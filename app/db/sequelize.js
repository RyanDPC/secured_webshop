const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/User");

const sequelize = new Sequelize("MiniGamesStore", "db_user", "db_user_pass", {
  host: "localhost",
  port: "6033", //pour les conteneurs docker MySQL
  dialect: "mysql",
  logging: false, // peut être true pour du debug
});
// Fonction d'initialisation de la base de données
let initDb = () => {
  return sequelize
    .sync({ alter: true }) // Utilisation de { alter: true } pour ajuster les tables
    .then(() => {
      console.log("La base de données a bien été synchronisée");
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la synchronisation de la base de données :",
        err
      );
    });
};
const User = UserModel(sequelize, DataTypes);

module.exports = { Sequelize, initDb, User, sequelize };
