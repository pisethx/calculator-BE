const request = require('supertest')
const faker = require('faker')
const httpStatus = require('http-status')
const { rando } = require('@nastyox/rando.js')
const app = require('../../src/app')
const setupTestDB = require('../utils/setupTestDB')
const { User, Randomizer } = require('../../src/models')
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture')
const { randomizerIndividual, randomizerGroup, insertRandomizers } = require('../fixtures/randomizer.fixture')
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture')
const { randomizerTypes } = require('../../src/config/randomizer')
const { randomizeGroup, randomizeIndividual } = require('../../src/services/randomizer.service')

setupTestDB()

const randomizerOne = { ...randomizerIndividual, result: randomizeIndividual(randomizerIndividual.dataset) }
const randomizerTwo = {
  ...randomizerGroup,
  result: randomizeGroup(randomizerGroup.dataset, randomizerGroup.numberOfGroups),
}

describe('Randomizer routes', () => {
  describe('GET v1/randomizer/me', () => {
    test('should return 200 when randomizer exists', async () => {
      await insertUsers([userOne])

      await insertRandomizers([randomizerOne, randomizerTwo], userOne)

      const res = await request(app)
        .get('/v1/randomizer/me')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body.results.length).toEqual(2)

      await request(app)
        .get('/v1/randomizer/me/export')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })

    test('should return 200 with empty result', async () => {
      await insertUsers([userOne])

      const res = await request(app)
        .get('/v1/randomizer/me')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)

      expect(res.body.results.length).toEqual(0)
    })

    test('should throw unauthorized error if not authenticated', async () => {
      await request(app).get('/v1/randomizer/me').send().expect(httpStatus.UNAUTHORIZED)
    })
  })

  describe('POST v1/randomizer', () => {
    let randomizerBody
    beforeEach(() => {
      const dataset = new Array(50).fill(null).map((e) => faker.name.findName())

      randomizerBody = {
        type: rando(1, 2) === 1 ? randomizerTypes.INDIVIDUAL : randomizerTypes.GROUP,
        dataset,
        numberOfGroups: rando(1, dataset.length),
      }
    })

    test('should return 200 and randomizer object if data is ok', async () => {
      await insertUsers([userOne])

      const res = await request(app)
        .post('/v1/randomizer')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(randomizerBody)
        .expect(httpStatus.CREATED)

      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
      })

      const dbRandomizer = await Randomizer.findById(res.body.id)
      expect(dbRandomizer).toBeDefined()
      expect(dbRandomizer.dataset.length).toEqual(randomizerBody.dataset.length)

      expect(res.body.id).toEqual(expect.anything())
      expect(res.body.dataset).toEqual(randomizerBody.dataset)
      expect(res.body.type).toEqual(randomizerBody.type)

      if (res.body.type === randomizerTypes.GROUP) {
        const maxNumberOfItemsPerGroup = Math.ceil(randomizerBody.dataset.length / randomizerBody.numberOfGroups)
        expect(res.body.result.length).toBe(randomizerBody.numberOfGroups)

        if (res.body.result.length > 1) expect(res.body.result[0].length).toBe(maxNumberOfItemsPerGroup)
        expect(res.body.result[res.body.result.length - 1].length).toBeLessThanOrEqual(maxNumberOfItemsPerGroup)
      }

      if (res.body.type === randomizerTypes.INDIVIDUAL) expect(res.body.dataset).toContain(res.body.result)
    })

    test('should throw unauthorized error if not authenticated', async () => {
      await request(app).post('/v1/randomizer').send(randomizerBody).expect(httpStatus.UNAUTHORIZED)
    })
  })

  describe('DELETE v1/randomizer/:randomizerId', () => {
    test('should throw 404 not found error if try to non existing randomizer', async () => {
      await insertUsers([userOne])
      await insertRandomizers([randomizerOne], userOne)

      await request(app)
        .delete(`/v1/randomizer/${randomizerTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND)
    })

    test("should throw unauthorized error if try to delete others' randomizers", async () => {
      await insertUsers([userOne])
      await insertRandomizers([randomizerOne], admin)

      await request(app)
        .delete(`/v1/randomizer/${randomizerOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED)
    })

    test('should return 200 when delete own randomizer', async () => {
      await insertUsers([userOne])
      await insertRandomizers([randomizerOne], userOne)

      await request(app)
        .delete(`/v1/randomizer/${randomizerOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK)
    })
  })
})
