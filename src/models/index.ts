import { Sequelize } from "sequelize-typescript"
import config from "../config"
import { LessonModel } from "./lesson.model"
import { LessonStudentModel } from "./lessonstudent.model"
import { LessonTeacherModel } from "./lessonteacher.model"
import { StudentModel } from "./student.model"
import { TeacherModel } from "./teacher.model"

export const database = new Sequelize({
	database: config.development.postgres.database,
	username: config.development.postgres.username,
	password: config.development.postgres.password,
	host: config.development.postgres.host,
	port: config.development.postgres.port,
	dialect: "postgres",
	timezone: "+03:00",
	logging: false,
	dialectOptions: {
		multipleStatements: true
	},
	sync: {
		alter: true
	},
	models: [LessonModel, TeacherModel, StudentModel, LessonTeacherModel, LessonStudentModel]
})

try {
	await database.sync()
} catch (error) {
	console.error("Ошибка при синхронизации базы данных!", error)
}

export { LessonModel, TeacherModel, StudentModel, LessonTeacherModel, LessonStudentModel }
