// Initialement créé le 19 février 2021
const express = require("express");
const router = express.Router();
const { authenticateToken, checkToken } = require("../middlewares/auth");

// Route pour la page d'accueil
router.get("/", checkToken, (req, res) => {
  res.render("pages/home", {
    title: "Accueil",
    layout: "components/layout",
    cssFile: "home.css",
    user: req.user || null,
  });
});

// Route pour la page d'enregistrement
router.get("/register", (_, res) => {
  res.render("pages/register", {
    title: "Créer un compte",
    layout: "components/layout",
    cssFile: "form.css",
  });
});

// Route pour la page de connexion
router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("pages/login", {
    title: "Se connecter",
    layout: "components/layout",
    cssFile: "form.css",
  });
});

// Route pour la page de profil
router.get("/profile", authenticateToken, (req, res) => {
  res.render("pages/profile", {
    title: "Mon Profil",
    username: req.user.username,
    email: req.user.email,
    cssFile: "profile.css",
  });
});
router.get("/admin", authenticateToken, (req, res) => {
  res.render("pages/admin", {
    title: "Administrateur Profil",
    username: req.user.username,
    email: req.user.email,
    admin: req.user.admin,
    cssFile: "profile.css",
  });
});

module.exports = router;
