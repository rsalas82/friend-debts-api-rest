import { Express, Response, Request } from 'express'
import mongoose from 'mongoose'
import UserModel from '../model/user.model'
import log from '../logger'

const getUsers = (app: Express) => {
  app.get('/api/users', (req: Request, res: Response) => {
    UserModel.find({}).populate('group').then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(500).send({ error: 500, message: 'Internal error' })
    })
  })
}

const getUserById = (app: Express) => {
  app.get('/api/users/:id', (req: Request, res: Response) => {
    const userId = new mongoose.Types.ObjectId(req.params.id)
    UserModel.find({ _id: userId }).populate('group').then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'User ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: `User email "${userId}" was not found` })
    })
  })
}

const createNewUser = (app: Express) => {
  app.post('/api/users', (req: Request, res: Response) => {
    const user = new UserModel({ ...req.body })
    user.save().then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const deleteUserById = (app: Express) => {
  app.delete('/api/users/:id', (req: Request, res: Response) => {
    const userId: string = req.params.id
    UserModel.findOneAndDelete({ email: userId }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'User ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const editUserById = (app: Express) => {
  app.put('/api/users/:id', (req: Request, res: Response) => {
    const userId: string = req.params.id
    UserModel.findOneAndUpdate({ email: userId }, req.body, { returnDocument: 'after' }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'User ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const getUserByGroup = (app: Express) => {
  app.get('/api/users/group/:id', (req: Request, res: Response) => {
    const groupId = new mongoose.Types.ObjectId(req.params.id)
    UserModel.find({ group: groupId }).populate('group').then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: `No existen usuarios asociados al grupo con ID ${groupId}` })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: `No existen usuarios asociados al grupo con ID ${groupId}` })
    })
  })
}

const userRoutes = (app: Express) => {
  getUsers(app)
  getUserById(app)
  createNewUser(app)
  deleteUserById(app)
  editUserById(app)
  getUserByGroup(app)
}

export default userRoutes
