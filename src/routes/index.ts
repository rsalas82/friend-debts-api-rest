import { Express, Response, Request } from 'express'
import userRoutes from './user.routes'
import debtRoutes from './debt.routes'
import log from '../logger'
import loginRoutes from './login.routes'
import groupRoutes from './group.routes'

const checkSystemAlive = (app: Express) => {
  app.get('/api/system/alive', (req: Request, res: Response) => {
    res.status(200).json({
      system: 'API Rest to manage friend money debts',
      isAlive: true,
    })
  })
}

const routes = (app: Express) => {
  loginRoutes(app)
  userRoutes(app)
  debtRoutes(app)
  groupRoutes(app)
  checkSystemAlive(app)

  app.get('/', (req: Request, res: Response) => {
    res
      .status(200)
      .send(
        '<h1>Bienvenido al API Rest para gestionar deudas entre amigos</h1>'
      )
  })

  app.use((error: Error, req: Request, res: Response) => {
    log.info(error.name)
    res.status(500).send({ error: error.name })
  })
}

export default routes
