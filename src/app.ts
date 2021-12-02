import express from 'express'
import config from 'config'

import log from './logger'
import connect from './db/connect'
import routes from './routes'

const port:number = config.get('port')
const host:string = config.get('host')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(port, host, () => {
    log.info(`Server listing at http://${host}:${port}`)
    connect()
    routes(app)
})