const httpStatus = require('http-status')
const excel = require('node-excel-export')
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

const saveRandomizerById = catchAsync(async (req, res) => {
  const randomizer = await randomizerService.saveRandomizerById(req.params.randomizerId, req.user)

  res.status(httpStatus.OK).send(randomizer)
})

const exportRandomizersByUser = catchAsync(async (req, res) => {
  const randomizers = await randomizerService.getRandomizersByUser(req.user)

  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FF000000',
        },
      },
      font: {
        color: {
          rgb: 'FFFFFFFF',
        },
        sz: 14,
        bold: true,
        underline: true,
      },
    },
  }

  const specification = {
    id: {
      displayName: 'ID', // <- Here you specify the column header
      headerStyle: styles.headerDark, // <- Header style
      width: 200,
    },
    name: {
      displayName: 'Type',
      headerStyle: styles.headerDark,
      width: 80,
    },
    dataset: {
      displayName: 'Dataset',
      headerStyle: styles.headerDark,
      width: 300,
    },
    result: {
      displayName: 'Result',
      headerStyle: styles.headerDark,
      width: 300,
    },
  }

  const report = excel.buildExport([
    {
      name: 'Randomizer', // <- Specify sheet name (optional)
      specification: specification, // <- Report specification
      data: randomizers.map((rnd) => ({
        id: rnd.id,
        type: rnd.type,
        dataset: rnd.dataset.join(','),
        result: JSON.stringify(rnd.result),
      })), // <-- Report data
    },
  ])

  res.attachment('report.xlsx') // This is sails.js specific (in general you need to set headers)

  res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.status(httpStatus.OK).send(report)
})

const deleteRandomizerById = catchAsync(async (req, res) => {
  await randomizerService.deleteRandomizerById(req.params.randomizerId, req.user)

  res.status(httpStatus.OK).send()
})

module.exports = {
  createRandomizer,
  getRandomizersByUser,
  saveRandomizerById,
  deleteRandomizerById,
  exportRandomizersByUser,
}
