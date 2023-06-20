import { NextFunction, Request, Response, Router } from "express"
import LessonsService from "./lessons.service"

class LessonsController {
	readonly #service: LessonsService
	router: Router

	constructor() {
		this.router = Router()
		this.#service = new LessonsService()

		this.router.get("/", (...args) => this.get(...args))
		this.router.post("/lessons", (...args) => this.create(...args))
	}

	private async get(req: Request, res: Response, _next: NextFunction) {
		try {
			const result = await this.#service.get(req.body)
			res.json(result)
		} catch (error) {
			console.error(error)
			res.status(400).json({ error: "Ошибка при получении занятий." })
		}
	}

	private async create(req: Request, res: Response, _next: NextFunction) {
		try {
			const result = await this.#service.get(req.body)
			res.json(result)
		} catch (error) {
			console.error(error)
			res.status(400).json({ error: "Ошибка при создании занятий." })
		}
	}
}

export default LessonsController
