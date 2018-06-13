/* global describe, before, beforeEach, after, it */
const app = require('./api.js').app
const supertest = require('supertest')
const should = require('should')

const monk = require('monk')
const db = monk('localhost/usersApi')
const users = db.get('users')

describe('User API', () => {
  const testUser = { name: 'Marcus', city: 'Stockholm, Sweden' }
  let request = {}
  let server = {}

  before(() => { server = app.listen(8888) })
  after(() => { server.close() })

  beforeEach(async () => {
    await users.remove({})
    request = supertest(server)
  })

  const throwIfError = (err, res) => { if (err) throw err }

  it('returns JSON for existing user', async () => {
    const user = await users.insert(testUser)
    request
      .get(`/user/${user._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(/Marcus/)
      .expect(res => res.body.city.should.equal('Stockholm, Sweden'))
      .expect(200)
      .end(throwIfError)
  })

  it('content type is json', async () => {
    const user = await users.insert(testUser)
    request
      .get(`/user/${user._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(throwIfError)
  })

  it('status is 200', async () => {
    const user = await users.insert(testUser)
    request
      .get(`/user/${user._id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end(throwIfError)
  })

  it('city is correct', async () => {
    const user = await users.insert(testUser)
    request
      .get(`/user/${user._id}`)
      .set('Accept', 'application/json')
      .expect(res => res.body.city.should.equal('Stockholm, Sweden'))
      .end(throwIfError)
  })

  it('name is correct', async () => {
    const user = await users.insert(testUser)
    request
      .get(`/user/${user._id}`)
      .set('Accept', 'application/json')
      .expect(/Marcus/)
      .end(throwIfError)
  })
})
