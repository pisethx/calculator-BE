const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { randomizerService } = require('../services');

const test = catchAsync(async (req, res) => {
  const randomizer = await randomizerService.createUser(req.body);
  res.status(httpStatus.CREATED).send(randomizer);
});

module.exports = {
  test,
};
