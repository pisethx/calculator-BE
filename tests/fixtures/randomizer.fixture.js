const mongoose = require('mongoose')
const faker = require('faker')
const { rando } = require('@nastyox/rando.js')
const Randomizer = require('../../src/models/randomizer.model')
const { randomizerTypes } = require('../../src/config/randomizer')

const dataset = new Array(50).fill(null).map((e) => faker.name.findName())
const quantity = rando(1, dataset.length)

const randomizerIndividual = {
  _id: mongoose.Types.ObjectId(),
  type: randomizerTypes.INDIVIDUAL,
  dataset,
}

const randomizerGroup = {
  _id: mongoose.Types.ObjectId(),
  type: randomizerTypes.GROUP,
  dataset,
  quantity: quantity,
}

const insertRandomizers = async (randomizers, user, saved = false) => {
  await Randomizer.insertMany(randomizers.map((randomizer) => ({ ...randomizer, saved, user })))
}

module.exports = { randomizerIndividual, randomizerGroup, insertRandomizers }
