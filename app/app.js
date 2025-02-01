// app.js
const express = require("express");
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const { connectDb } = require("./db/database"); // Importer la connexion à la base de données
const { connectRoot } = require("./db/data"); // Importer la connexion à la base de données
const userRoute = require("./routes/User"); // Importer les routes des utilisateurs
const pagesRoute = require("./routes/Pages"); // Importer les routes des pages

const app = express();

// Middleware JSON
app.use(express.json());

// Vérification et initialisation de la base de données
async function initApp() {
  try {
    await connectDb(); // Attendre que la base de données soit initialisée
    await connectRoot(); // Attendre que la connexion en tant que root soit établie
    console.log("Base de données initialisée avec succès.");

    // Configuration des sessions après l'initialisation de la DB
    app.use(
      session({
        secret: "server.cert",
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: true,
          httpOnly: true,
          sameSite: "strict",
        },
      })
    );

    app.use((req, res, next) => {
      res.locals.user = req.session.user || null;
      next();
    });

    // Configuration des répertoires statiques
    const publicPath = path.resolve(__dirname, "public");
    app.use(express.static(publicPath));
    app.use(express.static(path.join(publicPath, "css")));
    app.use(express.static(path.join(publicPath, "js")));

    // Configuration du moteur de templates EJS
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "resources/views"));
    app.use(expressLayouts);
    app.set("layout", "components/layout");
    app.set("layout extractScripts", true);

    // Routes API
    app.use("/api/users", userRoute);

    // Routes des pages
    app.use("/", pagesRoute); // Utilisation des routes des pages

    // Route pour déconnexion
    app.post("/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Erreur lors de la déconnexion :", err);
          return res
            .status(500)
            .json({ message: "Erreur lors de la déconnexion." });
        }
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Déconnexion réussie." });
      });
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation de l'application:", err);
  }
}

initApp();

module.exports = app;
