import express from 'express'
import config from 'config'
import cors from 'cors'
import bodyParser from 'body-parser'
import log from './logger'
import connect from './db/connect'
import routes from './routes'

const port: number = config.get('port')
const host: string = config.get('host')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`)
  connect()
  routes(app)
})

export { app, server }
