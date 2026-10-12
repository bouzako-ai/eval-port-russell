/**
 * @file Middleware de protection.
 */
const jwt = require("jsonwebtoken");

/**
 * Vérifie que la requête contient un token JWT valide dans le cookie "token".
 * Alors, les informations de l'utilisateur sont placées dans req.user
 * et la requête continue.
 * Sinon, l'accès est refusée.
 * Un middleware recoit trois paramètres : req, res et next.
 * @param {Object} req Requête HTTP.
 * @param {Object} res Réponse HTTP.
 * @param {Function} next Fonction qui passe la main au middleware ou au service suivant.
 * @returns {void}
 */
exports.checkJWT = (req, res, next) => {
  const token = req.cookies.token; /** Grace au cookie parser */
  if (!token) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Session invalide ou expirée" });
  }
};

/**
 * Variante de checkJWT pour les pages du site : si l'utilisateur n'est pas
 * connecté (ou si sa session a expiré), il est redirigé vers la page d'accueil.
 *
 * @param {Object} req Requête HTTP.
 * @param {Object} res Réponse HTTP.
 * @param {Function} next Fonction qui passe la main à la suite.
 * @returns {void}
 */
exports.checkJWTPage = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/");
  }

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    return next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};
