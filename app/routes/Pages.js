// Initialement créé le 19 février 2021
const express = require("express");
const router = express.Router();

// Route pour la page d'accueil
router.get("/", (req, res) => {
  res.render("pages/home", {
    title: "Accueil",
    layout: "components/layout",
    cssFile: "home.css",
    user: req.session.user || null, // Utilisation correcte de req.session.user
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
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("pages/login", {
    title: "Se connecter",
    layout: "components/layout",
    cssFile: "form.css",
  });
});

// Route pour la page de profil
router.get("/profile", (req, res) => {
  const user = req.session.user || null; // Utilisation correcte de req.session.user
  if (!user) {
    return res.redirect("/login");
  } else {
    res.render("pages/profile", {
      title: "Mon Profil",
      username: user.username, // Exemple d'utilisation du nom d'utilisateur
      email: user.email, // Exemple d'utilisation de l'email
      cssFile: "profile.css",
    });
  }
});

module.exports = router;
