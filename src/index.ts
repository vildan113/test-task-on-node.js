import LessonsController from "./api/lessons/lessons.controller"
import Server from "./app"
import config from "./config"

try {
	new Server([new LessonsController()]).start(config.port)
} catch (error) {
	console.error("Ошибка при запуске сервера!", error)
}
