/**
 * @file Routes de l'API pour la gestion des catways.
 */
const express = require("express");
const router = express.Router();
const service = require("../services/catways");
const reservationService = require("../services/reservations");

/** GET /catways : liste de tous les catways. */
router.get("/", service.getAllCatways);

/** GET /catways/:id : détails d'un catway (id = numéro du catway). */
router.get("/:id", service.getById);

/** POST /catways : création d'un catway. */
router.post("/", service.add);

/** PUT /catways/:id : modification d'un catway. */
router.put("/:id", service.update);

/** DELETE /catways/:id : suppression d'un catway. */
router.delete("/:id", service.remove);

/** Routes de gestion des réservations pour un catway. */

/** GET /catways/:id/reservations : liste des réservations d'un catway. */
router.get("/:id/reservations", reservationService.getAllByCatway);

/** GET /catways/:id/reservations/:idReservation : détails d'une réservation. */
router.get("/:id/reservations/:idReservation", reservationService.getById);

/** POST /catways/:id/reservations : création d'une réservation. */
router.post("/:id/reservations", reservationService.add);

/** PUT /catways/:id/reservations/:idReservation : modification d'une réservation. */
router.put("/:id/reservations/:idReservation", reservationService.update);

/** DELETE /catways/:id/reservations/:idReservation : suppression d'une réservation. */
router.delete("/:id/reservations/:idReservation", reservationService.remove);

module.exports = router;
