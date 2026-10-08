/**
 * @file Services pour les catways.
 */

const Catway = require("../models/catway");
const Reservation = require("../models/reservations");

/**
 * Récupère tous les catways.
 *
 *@async
 * @param {Object} req Requete http
 * @param {Object} res Reponse http
 * @returns {Promise<void>}
 */

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des catways",
      error: error.message,
    });
  }
};

/**
 * Récupère un catway
 *
 * @async
 * @param {Object} req Requête HTTP.
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getById = async (req, res) => {
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
    return res.status(200).json(catway);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Création de nouveau catway.
 *
 * @async
 * @param {Object} req Requête HTTP.
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>}
 */

exports.add = async (req, res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    const catway = await Catway.create({
      catwayNumber,
      catwayType,
      catwayState,
    });
    return res.status(201).json(catway);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Ce numéro de catway existe déjà" });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Modifie l'état d'un catway.
 
 * @async
 * @param {Object} req  Requete HTTP
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>} 
 */

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ message: "Le numéro du catway doit être un nombre entier" });
  }

  const { catwayState } = req.body;
  if (typeof catwayState !== "string" || catwayState.trim() === "") {
    return res
      .status(400)
      .json({ message: "L'état du catway est obligatoire" });
  }

  try {
    const catway = await Catway.findOne({ catwayNumber: id });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }

    catway.catwayState = catwayState;
    await catway.save();
    return res.status(200).json(catway);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Supprimer un catway.
 *
 * @async
 * @param {Object} req  Requête HTTP
 * @param {Object} res  Réponse HTTP.
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ message: "Le numéro du catway doit être un nombre entier" });
  }

  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: id });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }

    /**
     Ici on supprime les réservations associées au catway qui n'existent plus.
     */

    await Reservation.deleteMany({ catwayNumber: id });
    return res.status(200).json({ message: `Catway n°${id} supprimé` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
