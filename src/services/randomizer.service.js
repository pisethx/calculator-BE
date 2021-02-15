const httpStatus = require('http-status');
const { rando } = require('@nastyox/rando.js');
const { Randomizer } = require('../models');
const { randomizerTypes } = require('../config/randomizer');
const ApiError = require('../utils/ApiError');
const shuffleArr = require('../utils/shuffleArr');

/**
 * Create a randomizer
 * @param {Object} randomizerBody
 * @returns {Promise<Randomizer>}
 */

const randomizeGroup = (dataset, numberOfGroups) => {
  const result = [];
  let totalGroups = numberOfGroups;
  let arr = shuffleArr([...dataset]);

  while (arr.length) {
    const groupSize = Math.ceil(arr.length / totalGroups--);
    const group = arr.slice(0, groupSize);
    result.push(group);
    arr = arr.slice(groupSize);
  }

  return result;
};

const randomizeIndividual = (dataset) => {
  const randomIdx = rando(dataset.length - 1);

  return dataset[randomIdx];
};

const createRandomizer = async (randomizerBody) => {
  const { type, dataset, numberOfGroups } = randomizerBody;
  let result = [];

  if (type === randomizerTypes.INDIVIDUAL) result = randomizeIndividual(dataset);
  if (type === randomizerTypes.GROUP) result = randomizeGroup(dataset, numberOfGroups);

  const randomizer = await Randomizer.create({ ...randomizerBody, result });
  return randomizer;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRandomizers = async (filter, options) => {
  const randomizers = await Randomizer.paginate(filter, options);
  return randomizers;
};

const getRandomizerById = async (id) => {
  return Randomizer.findById(id);
};

const getRandomizersByUser = async (user) => {
  return Randomizer.find({ user: { $eq: user } });
  // return Randomizer.filter();
};

/**
 * Delete randomizer by id
 * @param {ObjectId} randomizerId
 * @returns {Promise<User>}
 */
const deleteRandomizerById = async (randomizerId) => {
  const randomizer = await getRandomizerById(randomizerId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Randomizer not found');
  }
  await randomizer.remove();
  return randomizer;
};

module.exports = {
  createRandomizer,
  queryRandomizers,
  getRandomizerById,
  getRandomizersByUser,
  deleteRandomizerById,
  randomizeGroup,
  randomizeIndividual,
};
