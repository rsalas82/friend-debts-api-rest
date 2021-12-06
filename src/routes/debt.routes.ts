import { Express, Response, Request } from 'express'
import DebtModel from '../model/debt.model'
import log from '../logger'

const debtRoutes = (app: Express) => {
  app.get('/api/debts', (req: Request, res: Response, next) => {
    DebtModel.find({}).then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      next(error)
    })
  })

  app.get('/api/debts/:id', (req: Request, res: Response) => {
    const debtId: string = req.params.id
    DebtModel.findById(debtId).then((result) => {
      log.info({ result })
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'Debt ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: `Debt ID "${debtId}" was not found` })
    })
  })

  app.post('/api/debts', (req: Request, res: Response) => {
    const newDebt = new DebtModel({ ...req.body })
    newDebt.save().then((result) => {
      res.status(200).json(result)
    }).catch((error) => {
      log.info(error)
      res.status(500).send({ error: 500, message: error.message }).end()
    })
  })

  app.delete('/api/debts/:id', (req: Request, res: Response) => {
    const debtId: string = req.params.id
    DebtModel.findByIdAndRemove(debtId).then((result) => {
      result ? res.status(200).json(result) : res.status(404).send({ error: 404, message: 'Debt ID was not found' })
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: error.message }).end()
    })
  })

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

export default debtRoutes
