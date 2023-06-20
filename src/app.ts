import express, { Application } from "express"
import http from "http"
import moment from "moment"
import { AppController } from "./interfaces/controller.interface"

moment.locale("ru")

/**
 * Основной класс сервера
 */

class Server {
	/**
	 * Экземляр приложения express
	 */
	readonly #app: Application
	readonly #server: http.Server

	constructor(controllers: AppController[]) {
		this.#app = express()
		this.#app.use(express.json({ limit: "1024mb" }))
		this.#server = http.createServer(this.#app)

		this.initControllers(controllers)
	}

	/**
	 * Инициализация контроллеров
	 */
	private initControllers(controllers: AppController[]) {
		controllers.forEach(controller => this.#app.use(controller.router))
	}

	/**
	 * Запуск сервера
	 * @param port Порт для прослушивания сервером
	 */
	start(port: number) {
		this.#server.listen(port)

		/**
		 * Обработка запуска сервера
		 */
		this.#server.on("listening", () => console.log(`Сервер запущен на ${port} порту...`))

		/**
		 * Обработка отключения сервера
		 */
		this.#server.on("close", () => console.log(`Сервер отключен`))
	}
}

export default Server
