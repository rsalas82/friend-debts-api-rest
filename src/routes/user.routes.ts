import { Express, Response, Request } from 'express'
import UserModel from '../model/user.model'
import log from '../logger'

const userRoutes = (app: Express) => {
  app.get('/api/users', (req: Request, res: Response) => {
    UserModel.find({}).then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(500).send({ error: 500, message: 'Internal error' })
    })
  })

  app.get('/api/users/:email', (req: Request, res: Response) => {
    const userEmail: string = req.params.email
    UserModel.find({ email: userEmail }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'User ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: `User email "${userEmail}" was not found` })
    })
  })

  app.post('/api/users', (req: Request, res: Response) => {
    UserModel.insertMany([...req.body], { ordered: false }).then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })

  app.delete('/api/users/:email', (req: Request, res: Response) => {
    const userEmail: string = req.params.email
    UserModel.findOneAndDelete({ email: userEmail }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'User email was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
  app.delete('/api/users/', (req: Request, res: Response) => {
    UserModel.deleteMany({}).then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })

  app.put('/api/users/:email', (req: Request, res: Response) => {
    const userEmail: string = req.params.email
    UserModel.findOneAndUpdate({ email: userEmail }, req.body, { returnDocument: 'after' }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'User email was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

export default userRoutes
