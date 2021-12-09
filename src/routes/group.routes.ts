import { Express, Response, Request } from 'express'
import mongoose from 'mongoose'
import GroupModel from '../model/group.model'
import log from '../logger'

const getGroups = (app: Express) => {
  app.get('/api/groups', (req: Request, res: Response) => {
    GroupModel.find({}).then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(500).send({ error: 500, message: 'Internal error' })
    })
  })
}

const getGroupById = (app: Express) => {
  app.get('/api/groups/:id', (req: Request, res: Response) => {
    const groupId = new mongoose.Types.ObjectId(req.params.id)
    GroupModel.find({ _id: groupId }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: `No existe un grupo con ID ${groupId}` })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: `No existe un grupo con ID ${groupId}` })
    })
  })
}

const createGroup = (app: Express) => {
  app.post('/api/groups', (req: Request, res: Response) => {
    const group = new GroupModel({ ...req.body })
    group.save().then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const deleteGroupByName = (app: Express) => {
  app.delete('/api/groups/:name', (req: Request, res: Response) => {
    const groupName: string = req.params.name
    GroupModel.findOneAndDelete({ name: groupName }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: `No existe un grupo con ID ${groupName}` })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const editGroupByName = (app: Express) => {
  app.put('/api/groups/:name', (req: Request, res: Response) => {
    const groupName: string = req.params.name
    GroupModel.findOneAndUpdate({ name: groupName }, req.body, { returnDocument: 'after' }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: `No existe un grupo con ID ${groupName}` })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const groupRoutes = (app: Express) => {
  getGroups(app)
  getGroupById(app)
  createGroup(app)
  deleteGroupByName(app)
  editGroupByName(app)
}

export default groupRoutes
