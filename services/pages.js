/**
 * @file Services des pages du site.
 */
const Reservation = require("../models/reservations");
const Catway = require("../models/catway");

/**
 * Affiche le tableau de bord : utilisateur connecté, date du jour
 * et réservations en cours.
 *
 * @async
 * @param {Object} req Requête HTTP (req.user = utilisateur connecté, ajouté par le middleware).
 * @param {Object} res Réponse HTTP.
 * @param {Function} next - Fonction de passage à la gestion d'erreurs.
 * @returns {Promise<void>} Affiche la vue "dashboard".
 */
exports.dashboard = async (req, res, next) => {
  try {
    const today = new Date();
    const reservations = await Reservation.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    }).sort({ startDate: 1 });

    return res.render("dashboard", {
      user: req.user,
      today,
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Affiche la liste de tous les catways, triés par numéro.
 *
 * @async
 * @param {Object} req Requête HTTP.
 * @param {Object} res Réponse HTTP.
 * @param {Function} next Fonction de passage à la gestion d'erreurs.
 * @returns {Promise<void>} Affiche la vue "catways".
 */
exports.catwaysList = async (req, res, next) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    return res.render("catways", { catways });
  } catch (error) {
    return next(error);
  }
};

/**
 * Affiche les détails d'un catway à partir de son numéro.
 * Si le numéro est invalide ou si le catway n'existe pas, affiche la page "Not Found".
 *
 * @async
 * @param {Object} req Requête HTTP (req.params.id = numéro du catway).
 * @param {Object} res Réponse HTTP.
 * @param {Function} next Fonction de passage à la suite (page 404) ou à la gestion d'erreurs.
 * @returns {Promise<void>} Affiche la vue "catway".
 */
exports.catwayDetails = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return next();
  }

  try {
    const catway = await Catway.findOne({ catwayNumber: id });
    if (!catway) {
      return next();
    }
    return res.render("catways-details", { catway });
  } catch (error) {
    return next(error);
  }
};
