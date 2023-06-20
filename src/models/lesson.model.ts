import {
	AllowNull,
	AutoIncrement,
	BelongsToMany,
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table
} from "sequelize-typescript"
import { LessonStudentModel } from "./lessonstudent.model"
import { LessonTeacherModel } from "./lessonteacher.model"
import { StudentModel } from "./student.model"
import { TeacherModel } from "./teacher.model"

export enum LessonStatus {
	CONDUCTED = 1,
	MISCONDUCTED = 0
}

/**
 *  Модель занятия
 */

@Table({
	freezeTableName: true,
	tableName: "lessons",
	underscored: true,
	modelName: "lesson",
	createdAt: false,
	updatedAt: false
})
export class LessonModel extends Model {
	@AutoIncrement
	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.INTEGER)
	declare id: number

	@AllowNull(false)
	@Column(DataType.DATEONLY)
	declare date: string

	@AllowNull
	@Column(DataType.STRING(100))
	declare title: string

	@AllowNull
	@Default(LessonStatus.MISCONDUCTED)
	@Column(DataType.INTEGER)
	declare status: LessonStatus

	@BelongsToMany(() => TeacherModel, () => LessonTeacherModel)
	declare teachers: Awaited<(TeacherModel & { lesson_teacher: LessonTeacherModel })[]>

	@BelongsToMany(() => StudentModel, () => LessonStudentModel)
	declare students: Awaited<(StudentModel & { lesson_student: LessonStudentModel })[]>
}
