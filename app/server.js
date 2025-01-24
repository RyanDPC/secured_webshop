const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const { initDb, sequelize } = require("./db/sequelize"); // Importer initDb
const userRoute = require("./routes/User");

// Options SSL
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "ssl/server.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "ssl/server.cert")),
};

// Middleware JSON
app.use(express.json());

// Test de connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion réussie à la base de données");
  })
  .catch((err) => {
    console.error("Impossible de se connecter à la base de données:", err);
  });

// Configuration des sessions
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

app.get("/", (req, res) =>
  res.render("pages/home", {
    title: "Accueil",
    layout: "components/layout",
    cssFile: "home.css",
    user: req.session.user || null, // Utilisation correcte de req.session.user
  })
);

app.get("/register", (_, res) =>
  res.render("pages/register", {
    title: "Créer un compte",
    layout: "components/layout",
    cssFile: "form.css",
  })
);

app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("pages/login", {
    title: "Se connecter",
    layout: "components/layout",
    cssFile: "form.css",
  });
});

app.get("/profile", (req, res) => {
  const user = req.session.user || null; // Utilisation correcte de req.session.user
  if (!user) {
    return res.redirect("/login");
  } else {
    res.render("pages/profile", {
      title: "Mon Profil",
      username: user, // Exemple d'utilisation du nom d'utilisateur
      email: user, // Exemple d'utilisation de l'email
      cssFile: "profile.css",
    });
  }
});

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

initDb()
  .then(() => {
    // Serveur HTTPS
    const httpsServer = https.createServer(sslOptions, app);

    httpsServer.listen(8080, () => {
      console.log("Serveur HTTPS lancé sur https://localhost:8080");
    });
  })
  .catch((error) => console.error("Erreur de sync:", error));
