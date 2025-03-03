// server.js
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = require("./app"); // Importer l'application

// Options SSL
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "ssl/server.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "ssl/server.cert")),
};

// Démarrer le serveur HTTPS
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(443, () => {
  console.log("Serveur HTTPS lancé sur https://localhost:443");
});
