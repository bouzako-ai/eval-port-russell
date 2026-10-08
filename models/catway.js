/**
 * @file Catways
 */
const mongoose = require("mongoose");

/**
  Schéma d'un catway.
  @typedef {Object} Catway
  @property {number} catwayNumber  Numéro unique du catway.
  @property {string} catwayType    Type du catway ("long" ou "short").
  @property {string} catwayState   Etat du catway.
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro du catway est obligatoire"],
    unique: true,
    min: [1, "Le numéro du catway doit être supérieur à 0"],
  },
  catwayType: {
    type: String,
    required: [true, "Le type du catway est obligatoire"],
    enum: {
      values: ["long", "short"],
      message: 'Le type du catway doit être "long" ou "short"',
    },
  },
  catwayState: {
    type: String,
    required: [true, "L'état du catway est obligatoire"],
    trim: true,
  },
});

module.exports = mongoose.model("Catway", catwaySchema);
