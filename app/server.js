const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const session = require("express-session");

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
app.use(express.static(path.join(publicPath, "js")));
app.use(express.static(path.join(publicPath, "css")));

// Routes API
app.use("/api/users", userRoute);

// Routes HTML
app.get("/", (_, res) => res.sendFile(path.join(publicPath, "accueil.html")));
app.get("/register", (_, res) => res.sendFile(path.join(publicPath, "signup.html")));
app.get("/login", (_, res) => res.sendFile(path.join(publicPath, "login.html")));

// Serveur HTTPS
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(8080, () => {
    console.log("Serveur HTTPS lancé sur https://localhost:8080");
});
