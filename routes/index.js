/**
 * @file Routes de l'application.
 */

var express = require("express");
var router = express.Router();
var authService = require("../services/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/** Connexion et déconnexion */
router.post("/login", authService.login);
router.get("/logout", authService.logout);
module.exports = router;
