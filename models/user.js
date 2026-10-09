/**
 * @file Utilisateur.
 */

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

/**
 Schéma d'un utilisateur.
  @typedef {Object} User
  @property {string} username Nom d'utilisateur.
  @property {string} email Adresse e-mail de l'utilisateur.
  @property {string} password Mot de passe de l'utilisateur haché.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Le nom d'utilisateur est obligatoire"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'adresse e-mail est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez entrer une adresse e-mail valide",
    ],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
  },
});

/**
 * On hache le mot de passe avant de sauvegarder l'utilisateur dans la base de données.
 * Async car hachage du mot de passe peut prendre du temps.
 */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

/** Retire le mot de passe des réponses JSON et ne le fait jamais apparaitre */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
module.exports = mongoose.model("User", userSchema);
