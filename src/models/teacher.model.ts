import {
	AllowNull,
	AutoIncrement,
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table
} from "sequelize-typescript"

/**
 *  Модель преподавателя
 */

@Table({
	freezeTableName: true,
	tableName: "teachers",
	underscored: true,
	modelName: "teacher",
	createdAt: false,
	updatedAt: false
})
export class TeacherModel extends Model {
	@AutoIncrement
	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.INTEGER)
	declare id: number

	@AllowNull
	@Column(DataType.STRING(10))
	declare name: string
}
