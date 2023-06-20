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
 *  Модель ученика
 */

@Table({
	freezeTableName: true,
	tableName: "students",
	underscored: true,
	modelName: "student",
	createdAt: false,
	updatedAt: false
})
export class StudentModel extends Model {
	@AutoIncrement
	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.INTEGER)
	declare id: number

	@AllowNull
	@Column(DataType.STRING(10))
	declare name: string
}
