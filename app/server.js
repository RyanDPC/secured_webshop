const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const userRoute = require("./routes/User");

// Options SSL
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "ssl/server.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "ssl/server.cert")),
};

// Middleware JSON
app.use(express.json());

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

// Routes HTML (converties en EJS)
app.get("/", (_, res) =>
  res.render("pages/home", {
    title: "Accueil",
    layout: "components/layout",
    cssFile: "home.css",
  })
);
app.get("/register", (_, res) =>
  res.render("pages/register", {
    title: "Créer un compte",
    layout: "components/layout",
    cssFile: "form.css",
  })
);
app.get("/login", (_, res) =>
  res.render("pages/login", {
    title: "Se connecter",
    layout: "components/layout",
    cssFile: "form.css",
  })
);
app.get("/profile", (_, res) =>
  res.render("pages/profile", {
    title: "Mon Profil",
    username: "Utilisateur123",
    email: "utilisateur@example.com",
    cssFile: "profile.css",
  })
);

// Serveur HTTPS
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(8080, () => {
  console.log("Serveur HTTPS lancé sur https://localhost:8080");
});
