// app.js
const express = require("express");
const path = require("path");
const CookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const { connectDb } = require("./db/database"); // Importer la connexion à la base de données
const { connectRoot } = require("./db/data"); // Importer la connexion à la base de données
const userRoute = require("./routes/User"); // Importer les routes des utilisateurs
const adminRoute = require("./routes/Admin"); // Importer les routes des administrateurs
const pagesRoute = require("./routes/Pages"); // Importer les routes des pages
const { authenticateToken } = require("./middlewares/auth");
const app = express();

// Middleware JSON
app.use(express.json());
app.use(CookieParser());

// Vérification et initialisation de la base de données
async function initApp() {
  try {
    await connectRoot(); // Attendre que la base de données soit initialisée
    await connectDb(); // Attendre que la connexion en tant que root soit établie
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
        store: new session.MemoryStore(),
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
    app.use(express.static(path.join("./", "middlewares")));

    // Configuration du moteur de templates EJS
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "resources/views"));
    app.use(expressLayouts);
    app.set("layout", "components/layout");
    app.set("layout extractScripts", true);

    // Routes API
    app.use("/api/users", userRoute);
    app.use("/api/admin", adminRoute);
    // Routes des pages
    app.use("/", pagesRoute); // Utilisation des routes des pages
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
  }
}

initApp();

module.exports = app;
