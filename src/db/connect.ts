import mongoose from 'mongoose'
import config from 'config'
import log from '../logger'

const connect = () => {
  const dbUri: string = config.get('dbUri')

  return mongoose
    .connect(dbUri)
    .then(() => {
      log.info('Database connected')
    })
    .catch((error: Error) => {
      log.error('db error', error)
      process.exit(1)
    })
}

export default connect
