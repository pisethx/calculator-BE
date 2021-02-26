const Joi = require('joi')
const { objectId } = require('./custom.validation')
const { randomizerTypes } = require('../config/randomizer')

const createRandomizer = {
  body: Joi.object().keys({
    name: Joi.string(),
    dataset: Joi.array().required().items(Joi.string()),
    type: Joi.string()
      .required()
      .valid(...Object.values(randomizerTypes)),
    quantity: Joi.when('type', {
      is: Joi.valid(randomizerTypes.GROUP, randomizerTypes.CUSTOM),
      then: Joi.number().integer().min(1).max(Joi.ref('dataset.length')).required(),
      otherwise: Joi.any(),
    }),
  }),
}

const getRandomizers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

const getRandomizer = {
  params: Joi.object().keys({
    randomizerId: Joi.string().custom(objectId),
  }),
}

const deleteRandomizer = {
  params: Joi.object().keys({
    randomizerId: Joi.string().custom(objectId),
  }),
}

module.exports = {
  createRandomizer,
  getRandomizers,
  getRandomizer,
  deleteRandomizer,
}
