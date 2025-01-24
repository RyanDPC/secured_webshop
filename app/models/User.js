const crypto = require("crypto");
const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => {
  const User = sequelize.define(
    "User", // Nom du modèle
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
      timestamps: true, // Si tu veux `createdAt` et `updatedAt`
    }
  );

  // Méthode statique `hashPassword`
  User.hashPassword = function (password, salt) {
    const hash = crypto.createHash("sha256");
    hash.update(password + salt); // Applique le sel au mot de passe
    return hash.digest("hex");
  };

  return User;
};

module.exports = UserModel;
