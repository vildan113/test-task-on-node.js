interface IConfig {
	port: number
	development: {
		postgres: {
			database: string
			username: string
			password: string
			host: string
			port: number
		}
	}
}

const config: IConfig = {
	port: Number(process.env.PORT) || 7000,
	development: {
		postgres: {
			database: String(process.env.PG_DATABASE),
			username: String(process.env.PG_USER),
			password: String(process.env.PG_PASSWORD),
			host: String(process.env.PG_HOST),
			port: Number(process.env.PG_PORT)
		}
	}
}

export default config
