/**
 * @file Réservations.
 */
const mongoose = require("mongoose");

/**
 Schéma d'une réservation.
  @typedef {Object} Reservation
  @property {number} catwayNumber Numéro du catway réservé.
  @property {string} clientName Nom du client ayant effectué la réservation.
  @property {string} boatName Nom du bateau amarré.
  @property {Date} startDate  Date de début de la réservation.
  @property {Date} endDate Date de fin de la réservation.
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro du catway est obligatoire"],
    min: [1, "Le numéro du catway doit être supérieur à 0"],
  },
  clientName: {
    type: String,
    required: [true, "Le nom du client est obligatoire"],
    trim: true,
  },
  boatName: {
    type: String,
    required: [true, "Le nom du bateau est obligatoire"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "La date de début est obligatoire"],
  },
  endDate: {
    type: Date,
    required: [true, "La date de fin est obligatoire"],
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "La date de fin doit être après la date de début",
    },
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
