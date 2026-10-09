/**
 * @file Service d'authentification avec connexion et déconnexion.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const DUREE_SESSION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

/** Connexion utilisateur en vérifiant son email et son mot de passe
 * @async
 * @param {Object} req Requête HTTP (req.body = email, password).
 * @param {Object} res Réponse HTTP.
 */

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email et mot de passe obligatoires" });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    const password0k = await bcrypt.compare(password, user.password);
    if (!password0k) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: DUREE_SESSION, // 24 heures
    });

    return res.status(200).json({ message: "Connexion réussie", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
/** Déconnexion utilisateur */
exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Déconnexion réussie" });
};
