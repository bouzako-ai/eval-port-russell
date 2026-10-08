/**
 * @file Routes de l'API pour la gestion des catways.
 */
const express = require("express");
const router = express.Router();
const service = require("../services/catways");

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

module.exports = router;
