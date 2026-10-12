/**
 * @file Routes des pages des utilisateurs connectés.
 */

const express = require("express");
const router = express.Router();
const service = require("../services/pages");

/** GET /dashboard : tableau de bord de l'utilisateur connecté. */
router.get("/", service.dashboard);
/** GET /dashboard/catways : liste de tous les catways. */
router.get("/catways", service.catwaysList);
/** GET /dashboard/catways/:id : détails d'un catway. */
router.get("/catways/:id", service.catwayDetails);
module.exports = router;
