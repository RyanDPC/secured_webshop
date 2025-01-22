const { Sequelize, DataTypes } = require("sequelize");
const crypto = require("crypto");

const UserModel = (sequelize, DataTypes) =>
  sequelize.define(
    "User", // The name of the model
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Le nom d'utilisateur est requis" },
          notEmpty: { msg: "Le nom d'utilisateur ne peut pas être vide" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "L'email doit être valide" },
          notNull: { msg: "L'email est requis" },
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Le mot de passe est requis" },
        },
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      timestamps: true, // If you're not using `createdAt` and `updatedAt` columns, set this to false
    }
  );

// Add static method `hashPassword` to the model
UserModel.hashPassword = function (password, salt) {
  const hash = crypto.createHash("sha256");
  hash.update(password + salt); // Apply the salt to the password
  return hash.digest("hex");
};

module.exports = UserModel;
