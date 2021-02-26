const mongoose = require('mongoose')
const { toJSON, paginate } = require('./plugins')
const { randomizerTypes } = require('../config/randomizer')

const randomizerSchema = mongoose.Schema(
  {
    dataset: {
      type: Array,
      required: true,
    },
    saved: {
      type: Boolean,
      default: false,
    },
    result: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: randomizerTypes,
      required: true,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

randomizerSchema.plugin(toJSON)
randomizerSchema.plugin(paginate)

/**
 * @typedef Randomizer
 */
const Randomizer = mongoose.model('Randomizer', randomizerSchema)

module.exports = Randomizer
