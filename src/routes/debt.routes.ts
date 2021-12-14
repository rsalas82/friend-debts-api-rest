import { Express, Response, Request } from 'express'
import mongoose from 'mongoose'
import DebtModel from '../model/debt.model'
import log from '../logger'
import UserModel from '../model/user.model'

const getDebts = (app:Express) => {
  app.get('/api/debts', (req: Request, res: Response, next) => {
    DebtModel.find({}).then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      next(error)
    })
  })
}

const getDebtsByGroup = (app:Express) => {
  app.get('/api/debts/group/:id', (req: Request, res: Response) => {
    const groupId = new mongoose.Types.ObjectId(req.params.id)

    UserModel.find({ group: new mongoose.Types.ObjectId(groupId) })
      .then((users) => {
        if (users && users.length > 0) {
          const userIDs = users.map(user => user._id)
          DebtModel.find({ user: { $in: userIDs } }).sort({ debtDate: 'descending' }).populate('user').then((debts) => {
            if (debts && debts.length > 0) {
              res.status(200).send(debts)
            }
          })
            .catch((error) => {
              log.info(error)
              res.status(404).send({ error: 404, message: `No hay gastos asociados al grupo con ID ${groupId}` })
            })
        }
      })
      .catch((error) => {
        log.info(error)
        res.status(404).send({ error: 404, message: `No hay usuarios asociados al grupo con ID ${groupId}` })
      })
  })
}

const createDebt = (app:Express) => {
  app.post('/api/debts', (req: Request, res: Response) => {
    const newDebt = new DebtModel({ ...req.body })
    newDebt.save().then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(500).send({ error: 500, message: error.message }).end()
    })
  })
}

const deleteDebtById = (app:Express) => {
  app.delete('/api/debts/:id', (req: Request, res: Response) => {
    const debtId: string = req.params.id
    DebtModel.findByIdAndRemove(debtId).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'Debt ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const editDebtById = (app: Express) => {
  app.put('/api/debts/:id', (req: Request, res: Response) => {
    const debtId: string = req.params.id
    DebtModel.findByIdAndUpdate(debtId, req.body, { returnDocument: 'after' }).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'Debt ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })
}

const debtRoutes = (app: Express) => {
  getDebts(app)
  getDebtsByGroup(app)
  createDebt(app)
  deleteDebtById(app)
  editDebtById(app)
}

export default debtRoutes
