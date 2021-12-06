import { Express, Response, Request } from 'express'
import userRoutes from './user.routes'
import debtRoutes from './debt.routes'
import log from '../logger'

const routes = (app: Express) => {
  userRoutes(app)

  debtRoutes(app)

  app.get('/', (req: Request, res: Response) => {
    res
      .status(200)
      .send(
        '<h1>Bienvenido al API Rest para gestionar deudas entre amigos</h1>'
      )
  })

  app.get('/api/system/alive', (req: Request, res: Response) => {
    res.status(200).json({
      system: 'API Rest to manage friend money debts',
      isAlive: true,
    })
  })

  app.use((error: Error, req: Request, res: Response) => {
    log.info(error.name)
    res.status(500).send({ error: error.name })
  })
}

export default routes
