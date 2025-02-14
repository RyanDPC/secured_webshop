// Importer les modules nécessaires
const jwt = require("jsonwebtoken"); 
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" }); // Charger les variables d'environnement

// Vérification de l'existence des secrets
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error(
        "Erreur : Les variables JWT_SECRET ou REFRESH_TOKEN_SECRET ne sont pas définies."
    );
    process.exit(1); // Arrête l'application si les clés ne sont pas définies
}

// Générer un token d'accès (valable pour 1 heure)
exports.generateAccessToken = (user) => {
    const {password, salt, ...User} = user;
    return jwt.sign(
        User,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// Générer un token de rafraîchissement (valable pour 7 jours)
exports.generateRefreshToken = (user) => {
    const {password, salt, ...User} = user;

    return jwt.sign(
        User,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

// Middleware to check token and set user information
exports.checkToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token invalide" });
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
};

// Middleware to enforce authentication
exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.redirect("/login?error=Vous devez être connecté pour accéder à cette page.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect("/login?error=Session expirée, veuillez vous reconnecter.");
        }
        req.user = decoded;
        next();
    });
};
