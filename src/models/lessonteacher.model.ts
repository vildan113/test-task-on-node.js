import { Column, ForeignKey, Model, Table } from "sequelize-typescript"
import { LessonModel } from "./lesson.model"
import { TeacherModel } from "./teacher.model"

@Table({
	freezeTableName: true,
	tableName: "lessons_teacher",
	underscored: true,
	modelName: "lesson_teacher",
	createdAt: false,
	updatedAt: false
})
export class LessonTeacherModel extends Model {
	@ForeignKey(() => LessonModel)
	@Column
	declare lessonId: number

	@ForeignKey(() => TeacherModel)
	@Column
	declare teacherId: number
}
