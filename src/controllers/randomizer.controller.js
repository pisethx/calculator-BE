const httpStatus = require('http-status')
const { convertArrayToCSV } = require('convert-array-to-csv')
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

const exportRandomizersByUser = catchAsync(async (req, res) => {
  const randomizers = await randomizerService.getRandomizersByUser(req.user)

  const csv = convertArrayToCSV(
    randomizers.map((e) => ({
      id: e.id,
      type: e.type,
      dataset: e.dataset.join(','),
      result: JSON.stringify(e.result),
    }))
  )

  res.contentType('text/csv')
  res.status(httpStatus.OK).send(csv)
})

const deleteRandomizerById = catchAsync(async (req, res) => {
  await randomizerService.deleteRandomizerById(req.params.randomizerId, req.user)

  res.status(httpStatus.OK).send()
})

module.exports = {
  createRandomizer,
  getRandomizersByUser,
  deleteRandomizerById,
  exportRandomizersByUser,
}
