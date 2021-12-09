import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../src/app'
import log from '../src/logger'
import config from 'config'
import preloadDatabase, { seedUsers } from '../src/utils/preloadDatabase'

const dbUri: string = config.get('dbUri')

beforeAll(async () => {
  await mongoose
    .connect(dbUri)
    .then(async () => {
      log.info('Database connected')
      preloadDatabase()
    })
    .catch((error: Error) => {
      log.error('db error', error)
      process.exit(1)
    })
})

afterAll(async () => {
  await mongoose.connection.close().then((response) => {
    log.info('Database connection closed')
    server.close()
  }).catch((error: Error) => {
    log.error('db close connection error', error)
    process.exit(1)
  })
})

describe('User API REST Testing', () => {
  describe('GET /api/users', () => {
    it('should return 200 & a list of users', async () => {
      const response = await request(app)
        .get('/api/users')

      log.info(response.body)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(seedUsers.length)
    })
  })

  describe('GET /api/users/group/:groupId', () => {
    it('should return 200 & users for the specified group', async () => {
      const groupId = '61b20709a915de06af722bea'
      const response = await request(app)
        .get(`/api/users/${groupId}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(3)
    })
  })
})
