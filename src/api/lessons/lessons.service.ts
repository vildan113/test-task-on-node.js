import moment from "moment"
import { Op, WhereOptions, literal } from "sequelize"
import { LessonModel, LessonTeacherModel, StudentModel, TeacherModel } from "../../models"
import { LessonStatus } from "../../models/lesson.model"

class LessonsService {
	async get({
		date,
		status,
		teacherIds,
		studentsCount,
		page = 1,
		lessonsPerPage = 5
	}: {
		page: number
		lessonsPerPage: number
		date?: string
		status?: LessonStatus
		teacherIds?: string
		studentsCount?: string
	}) {
		const whereOptions: WhereOptions = {
			teachers: {}
		}

		// Добавляем фильтр по дате
		if (date !== undefined) {
			const dates = date.split(",")

			if (dates.length === 1) {
				whereOptions.date = dates[0]
			}

			if (dates.length === 2) {
				whereOptions.date = {
					[Op.between]: dates
				}
			}
		}

		// Добавляем фильтр по статусу
		if (status !== undefined) {
			whereOptions.status = status
		}

		// Добавляем фильтр по учителям
		if (teacherIds !== undefined) {
			const teacherIdsArray = teacherIds.split(",")

			whereOptions.teachers.id = {
				[Op.in]: teacherIdsArray
			}
		}

		// Добавляем фильтр по количеству учеников
		if (studentsCount !== undefined) {
			const studentsCountArray = studentsCount.split(",")

			let havingCount: string = "HAVING COUNT(*) "

			if (studentsCountArray.length === 1) {
				havingCount += `= ${Number(studentsCountArray[0])}`
			}

			if (studentsCountArray.length === 2) {
				havingCount += `BETWEEN 
				${Number(studentsCountArray[0])} AND ${Number(studentsCountArray[1])}`
			}

			if (studentsCountArray.length === 1 || studentsCountArray.length === 2) {
				whereOptions.id = {
					[Op.in]: literal(`(
						SELECT lesson_id FROM lessons_student
						GROUP BY lesson_id
						${havingCount}
					)`)
				}
			}
		}

		const rows = await LessonModel.findAll({
			attributes: ["id", "date", "title", "status"],
			where: {
				...(whereOptions.date && { date: whereOptions.date }),
				...(whereOptions.status && { status: whereOptions.status }),
				...(whereOptions.id && { id: whereOptions.id })
			},
			include: [
				{
					model: TeacherModel,
					attributes: ["id", "name"],
					where: whereOptions.teachers,
					as: "teachers"
				},
				{
					model: StudentModel,
					attributes: ["id", "name"],
					as: "students"
				}
			],
			offset: (page - 1) * lessonsPerPage,
			limit: lessonsPerPage
		})

		const lessons = rows.map(lesson => ({
			id: lesson.id,
			date: lesson.date,
			title: lesson.title,
			status: lesson.status,
			visitCount: lesson.students.filter(student => student.lesson_student.visit === true)
				.length,
			students: lesson.students.map(student => ({
				id: student.id,
				name: student.name,
				visit: student.lesson_student.visit
			})),
			teachers: lesson.teachers
		}))

		return {
			lessons,
			totalLessons: lessons.length,
			totalPages: Math.ceil(lessons.length / lessonsPerPage)
		}
	}

	async create({
		teacherIds,
		title,
		days,
		firstDate,
		lessonsCount,
		lastDate
	}: {
		teacherIds: number[]
		title: string
		days: number[]
		firstDate: string
		lessonsCount?: number
		lastDate?: string
	}) {
		const dates = this.generateDates({ days, firstDate, lessonsCount, lastDate })

		const lessons = await LessonModel.bulkCreate(
			dates.map(date => ({
				date,
				title
			}))
		)

		const teachers = await TeacherModel.findAll({
			where: {
				id: { [Op.in]: teacherIds }
			}
		})

		const lessonsTeacher: { lessonId: number; teacherId: number }[] = []

		for (let i = 0; i < lessons.length; i++) {
			for (let j = 0; j < teachers.length; j++) {
				lessonsTeacher.push({ lessonId: lessons[i].id, teacherId: teachers[j].id })
			}
		}

		await LessonTeacherModel.bulkCreate(lessonsTeacher, { logging: true })

		const result = lessons.map(lesson => lesson.id)

		return result
	}

	private generateDates({
		days,
		firstDate,
		lessonsCount,
		lastDate
	}: {
		days: number[]
		firstDate: string
		lessonsCount?: number
		lastDate?: string
	}) {
		// Ограничения по количеству занятий и дате
		const maxLessonsCount = 300
		const maxDateRangeInDays = 365

		const endDate = lastDate ? moment(lastDate) : null
		const oneYearLater = moment(firstDate).add(maxDateRangeInDays, "days")

		const result = []
		let currentDate = moment(firstDate)

		while (
			(!lessonsCount || result.length < lessonsCount) &&
			(!endDate || currentDate.isSameOrBefore(endDate)) &&
			currentDate.isSameOrBefore(oneYearLater, "day") &&
			result.length < maxLessonsCount
		) {
			if (days.includes(currentDate.day())) {
				result.push(currentDate.format("YYYY-MM-DD"))
			}
			currentDate.add(1, "day")
		}

		return result
	}
}

export default LessonsService
