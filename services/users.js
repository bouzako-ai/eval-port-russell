/**
 * @file Services de gestion des utilisateurs.
 */
const User = require("../models/user");

/**
 * Liste tous les utilisateurs sans leur mot de passe.
 *
 * @async
 * @param {Object} req Requête HTTP.
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>} Renvoie la liste des utilisateurs (200).
 */
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 });
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Récupère un utilisateur à partir de son email.
 *
 * @async
 * @param {Object} req Requête HTTP (req.params.email = email de l'utilisateur).
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>} Renvoie l'utilisateur (200), ou une erreur 404.
 */
exports.getByEmail = async (req, res) => {
  const email = req.params.email.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Crée un nouvel utilisateur.
 *
 * @async
 * @param {Object} req Requête HTTP (req.body = username, email, password).
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>} Renvoie l'utilisateur créé (201), ou une erreur 400 / 409.
 */
exports.add = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    return res.status(201).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Cette adresse email est déjà utilisée" });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Modifie un utilisateur.
 *
 * @async
 * @param {Object} req Requête HTTP (req.params.email, req.body = username, email, password).
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>} Renvoie l'utilisateur modifié (200), ou une erreur 400 / 404 / 409.
 */
exports.update = async (req, res) => {
  const email = req.params.email.toLowerCase();
  const { username, email: newEmail, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (username !== undefined) user.username = username;
    if (newEmail !== undefined) user.email = newEmail;
    if (password !== undefined) user.password = password;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Cette adresse email est déjà utilisée" });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Supprime un utilisateur à partir de son email.
 *
 * @async
 * @param {Object} req Requête HTTP (req.params.email = email de l'utilisateur).
 * @param {Object} res Réponse HTTP.
 * @returns {Promise<void>} Renvoie un message de confirmation (200), ou une erreur 404.
 */
exports.remove = async (req, res) => {
  const email = req.params.email.toLowerCase();

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    return res.status(200).json({ message: `Utilisateur ${email} supprimé` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
