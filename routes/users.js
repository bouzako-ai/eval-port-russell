/**
 * @file Routes de l'API pour la gestion des utilisateurs.
 */
const express = require("express");
const router = express.Router();
const service = require("../services/users");

/** GET /users : liste des utilisateurs. */
router.get("/", service.getAll);

/** GET /users/:email : détails d'un utilisateur. */
router.get("/:email", service.getByEmail);

/** POST /users : création d'un utilisateur. */
router.post("/", service.add);

/** PUT /users/:email : modification d'un utilisateur. */
router.put("/:email", service.update);

/** DELETE /users/:email : suppression d'un utilisateur. */
router.delete("/:email", service.remove);

module.exports = router;
