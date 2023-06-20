import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { LessonModel } from "./lesson.model"
import { StudentModel } from "./student.model"

@Table({
	freezeTableName: true,
	tableName: "lessons_student",
	underscored: true,
	modelName: "lesson_student",
	createdAt: false,
	updatedAt: false
})
export class LessonStudentModel extends Model {
	@ForeignKey(() => LessonModel)
	@Column
	declare lessonId: number

	@ForeignKey(() => StudentModel)
	@Column
	declare studentId: number

	@Column(DataType.BOOLEAN)
	declare visit: boolean
}
