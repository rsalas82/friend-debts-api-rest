import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../src/app'
import log from '../src/logger'
import config from 'config'
import preloadDatabase, { seedGroups } from '../src/utils/preloadDatabase'

// const groupsInDatabase: Group = []

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

describe('Groups API REST Testing', () => {
  describe('POST /api/groups', () => {
    it(`should return 200 & the new groups created & there are ${seedGroups.length} groups`, async () => {
      const seedGroup = {
        name: 'Sevilla',
        description: 'Grupo de jugadores del Sevilla'
      }

      const response = await request(app)
        .post('/api/groups').send(seedGroup)

      const groups = [...seedGroups, response.body]

      expect(response.status).toBe(200)
      expect(groups).toHaveLength(seedGroups.length + 1)
    })
  })

  describe('DELETE /api/groups/:name', () => {
    it(`should return 200 & the specified group deleted & there are ${seedGroups.length - 1} groups`, async () => {
      const previousSeedGroupsLength = seedGroups.length + 1

      const response = await request(app)
        .delete(`/api/groups/${seedGroups[3].name}`)

      const postSeedGroupsLength = seedGroups.length

      expect(response.status).toBe(200)
      expect(postSeedGroupsLength).toBe(previousSeedGroupsLength - 1)
    })
  })

  describe('GET /api/groups', () => {
    it('should return 200 & a list of groups', async () => {
      const response = await request(app)
        .get('/api/groups')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(seedGroups.length)
    })
  })

  describe('UPDATE /api/groups/:name', () => {
    it('should return 200 & the specified group updated', async () => {
      const groupName = 'Sevilla'
      const seedUpdategroup = {
        name: 'Betis',
        description: 'Grupo de jugadores del Betis'
      }
      const response = await request(app)
        .put(`/api/groups/${groupName}`).send(seedUpdategroup)

      expect(response.status).toBe(200)
      expect(response.body.description).toBe(seedUpdategroup.description)
    })
  })
})
