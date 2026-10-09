/**
 * @file Services de gestion des réservations.
 */
const mongoose = require("mongoose");
const Catway = require("../models/catway");
const Reservation = require("../models/reservations");

/**
 * Liste l'ensemble des réservations.
 *
 * @async
 * @param {Object} req  Requête HTTP (req.params.id = numéro du catway).
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>} Renvoie la liste des réservations (200), ou une erreur 400 / 404.
 */
exports.getAllByCatway = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ message: "Le numéro du catway doit être un nombre entier" });
  }

  try {
    const catway = await Catway.findOne({ catwayNumber: id });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }

    const reservations = await Reservation.find({ catwayNumber: id }).sort({
      startDate: 1,
    });
    return res.status(200).json(reservations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Récupère les détails d'une réservation d'un catway.
 *
 * @async
 * @param {Object} req  Requête HTTP (req.params.id = numéro du catway, req.params.idReservation = identifiant de la réservation).
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>} Renvoie la réservation (200), ou une erreur 400 / 404.
 */
exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const { idReservation } = req.params;
  if (!Number.isInteger(id) || !mongoose.isValidObjectId(idReservation)) {
    /**On vérifie le format de l'identifiant MongoDB */
    return res.status(400).json({
      message: "Numéro de catway ou identifiant de réservation invalide",
    });
  }

  try {
    const reservation = await Reservation.findOne({
      _id: idReservation,
      catwayNumber: id,
    });
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Crée une réservation.
 *
 * @async
 * @param {Object} req  Requête HTTP (req.params.id = numéro du catway, req.body = clientName, boatName, startDate, endDate).
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>} Renvoie la réservation créée (201), ou une erreur 400 / 404.
 */
exports.add = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ message: "Le numéro du catway doit être un nombre entier" });
  }

  const { clientName, boatName, startDate, endDate } = req.body;

  try {
    const catway = await Catway.findOne({ catwayNumber: id });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }

    const reservation = await Reservation.create({
      catwayNumber: id,
      clientName,
      boatName,
      startDate,
      endDate,
    });
    return res.status(201).json(reservation);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Modifie une réservation.
 *
 * @async
 * @param {Object} req  Requête HTTP (req.params.id, req.params.idReservation, req.body = champs à modifier).
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>} Renvoie la réservation modifiée (200), ou une erreur 400 / 404.
 */
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { idReservation } = req.params;
  if (!Number.isInteger(id) || !mongoose.isValidObjectId(idReservation)) {
    return res.status(400).json({
      message: "Numéro de catway ou identifiant de réservation invalide",
    });
  }

  const { clientName, boatName, startDate, endDate } = req.body;

  try {
    const reservation = await Reservation.findOne({
      _id: idReservation,
      catwayNumber: id,
    });
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    if (clientName !== undefined) reservation.clientName = clientName;
    if (boatName !== undefined) reservation.boatName = boatName;
    if (startDate !== undefined) reservation.startDate = startDate;
    if (endDate !== undefined) reservation.endDate = endDate;

    await reservation.save();
    return res.status(200).json(reservation);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Supprime une réservation.
 *
 * @async
 * @param {Object} req  Requête HTTP (req.params.id = numéro du catway, req.params.idReservation = identifiant de la réservation).
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>} Renvoie un message de confirmation (200), ou une erreur 400 / 404.
 */
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const { idReservation } = req.params;
  if (!Number.isInteger(id) || !mongoose.isValidObjectId(idReservation)) {
    return res.status(400).json({
      message: "Numéro de catway ou identifiant de réservation invalide",
    });
  }

  try {
    const reservation = await Reservation.findOneAndDelete({
      _id: idReservation,
      catwayNumber: id,
    });
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    return res.status(200).json({ message: "Réservation supprimée" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
