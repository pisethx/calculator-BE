const httpStatus = require('http-status')
const pick = require('../utils/pick')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const { randomizerService, userService } = require('../services')

const createRandomizer = catchAsync(async (req, res) => {
  const randomizer = await randomizerService.createRandomizer({ ...req.body, user: req.user })
  res.status(httpStatus.CREATED).send(randomizer)
})

const getRandomizersByUser = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const randomizers = await randomizerService.getRandomizersByUser(req.user)
  res.status(httpStatus.OK).send({ results: randomizers })
})

const deleteRandomizerById = catchAsync(async (req, res) => {
  const randomizer = await randomizerService.deleteRandomizerById(req.params.randomizerId, req.user)

  res.status(httpStatus.OK).send(randomizer)
})

module.exports = {
  createRandomizer,
  getRandomizersByUser,
  deleteRandomizerById,
}
