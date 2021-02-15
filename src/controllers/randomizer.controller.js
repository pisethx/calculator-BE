const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { randomizerService, userService } = require('../services');

const createRandomizer = catchAsync(async (req, res) => {
  const user = await userService.getUserByToken(req.headers.authorization);
  const randomizer = await randomizerService.createRandomizer({ ...req.body, user });
  res.status(httpStatus.CREATED).send(randomizer);
});

const getRandomizersByUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByToken(req.headers.authorization);

  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const randomizers = await randomizerService.getRandomizersByUser(user);
  res.status(httpStatus.OK).send({ results: randomizers });
});

module.exports = {
  createRandomizer,
  getRandomizersByUser,
};
