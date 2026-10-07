/**
 * @file connexion base de données MongoDB.
 */
const mongoose = require("mongoose");

/**
 * Initialise la connexion à MongoDB à partir des variables d'environnement
 * URL_MONGO et DB_NAME. Arrête l'application si la connexion échoue.
 *
 * @async
 * @returns {Promise<void>}
 */
exports.initClientDbConnection = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }
};
