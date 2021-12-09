import { Express, Response, Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'
import log from '../logger'
import UserModel from '../model/user.model'

const loginUser = (app: Express) => {
  app.post('/api/login', (req: Request, res: Response) => {
    const data = req.body
    UserModel.findOne({ email: data.email }).then((user) => {
      if (!user) res.status(404).send({ error: 404, message: 'No existe un usuario registrado con el correo electrónico indicado.' })
      if (user) {
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if (error) {
            res.status(500).send({ error: error.name, message: 'Error en el servidor.' })
          }

          if (!result) {
            res.status(401).send({ error: 401, message: 'Contraseña incorrecta.' })
          }

          log.info({ user })

          const token = jwt.encode({
            email: req.body.email,
            userId: user.id,
            groupId: user.group,
            expire: Date.now() + (1000 * 60 * 60)
          }, user.email)

          res.status(200).json({ token })
        })
      }
    }).catch((error) => {
      log.info(error)
      res.status(404).send({ error: 404, message: 'No se han encontrado datos del usuario' })
    })
  })
}

const loginRoutes = (app: Express) => {
  loginUser(app)
}

export default loginRoutes
