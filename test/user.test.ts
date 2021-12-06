import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../src/app'
import log from '../src/logger'
import config from 'config'

const seedUsers = [
  {
    firstname: 'Toni',
    surname: 'Kross',
    password: 'tkross.123',
    email: 'tkross@realmadrid.com'
  },
  {
    firstname: 'Rodrygo',
    surname: 'Goes',
    password: 'rgoes.123',
    email: 'rgoes@realmadrid.com'
  },
  {
    firstname: 'Karim',
    surname: 'Benzema',
    password: 'kbenzema.123',
    email: 'kbenzema@realmadrid.com'
  },
  {
    firstname: 'Vinicius',
    surname: 'Jr.',
    password: 'viniciusjr.123',
    email: 'viniciusjr@gmail.com'
  },
  {
    firstname: 'Thibaut',
    surname: 'Curtois',
    password: 'tcurtois.123',
    email: 'tcurtois@gmail.com'
  },
  {
    firstname: 'Eder',
    surname: 'Militao',
    password: 'emilitao.123',
    email: 'emilitao@gmail.com'
  },
  {
    firstname: 'David',
    surname: 'Alaba',
    password: 'dalaba.123',
    email: 'dalaba@gmail.com'
  }
]

const dbUri: string = config.get('dbUri')

beforeAll(async () => {
  await mongoose
    .connect(dbUri)
    .then(async () => {
      log.info('Database connected')
      await request(app).delete('/api/users').then(async () => {
        await request(app)
          .post('/api/users').send(seedUsers)
      })
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

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(seedUsers.length)
    })
  })

  describe('GET /api/users/:email', () => {
    it('should return 200 & a user with the specified email', async () => {
      const expectedEmail = 'tkross@realmadrid.com'
      const response = await request(app)
        .get(`/api/users/${expectedEmail}`)
      expect(response.status).toBe(200)
      expect(response.body[0].email).toBe(expectedEmail)
    })
  })

  describe('DELETE /api/users/:email', () => {
    it(`should return 200 & the specified user deleted & there are ${seedUsers.length - 1} users`, async () => {
      const expectedEmail = 'rgoes@realmadrid.com'

      await request(app)
        .delete(`/api/users/${expectedEmail}`)

      const response = await request(app)
        .get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(seedUsers.length - 1)
    })
  })

  describe('POST /api/users', () => {
    it(`should return 200 & the new user created & there are ${seedUsers.length - 1} users`, async () => {
      const seedNewUser = [{
        firstname: 'Carlos Henrique',
        surname: 'Casemiro',
        password: 'chcasemiro.123',
        email: 'chcasemiro@gmail.com',
      }]

      await request(app)
        .post('/api/users').send([...seedNewUser])

      const response = await request(app)
        .get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(seedUsers.length)
    })
  })

  describe('UPDATE /api/users/:email', () => {
    it('should return 200 & the specified user updated', async () => {
      const expectedEmail = 'tkross@realmadrid.com'
      const seedUpdateUser = {
        firstname: 'Antonio'
      }
      const response = await request(app)
        .put(`/api/users/${expectedEmail}`).send(seedUpdateUser)

      expect(response.status).toBe(200)
      expect(response.body.firstname).toBe(seedUpdateUser.firstname)
    })
  })
})
