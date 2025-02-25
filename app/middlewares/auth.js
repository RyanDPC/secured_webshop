const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

class AuthMiddleware {
  static #JWT_SECRET = process.env.JWT_SECRET;
  static #REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  // Validate environment variables on startup
  static validateEnv() {
    if (!this.#JWT_SECRET || !this.#REFRESH_TOKEN_SECRET) {
      console.error("JWT_SECRET or REFRESH_TOKEN_SECRET not defined");
      process.exit(1);
    }
  }

  // Helper to create JWT token
  static #createToken(user, secret, expiresIn) {
    const { password_hash, ...userData } = user;
    return jwt.sign(userData, secret, { expiresIn });
  }

  // Helper to verify JWT token
  static #verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }

  // Generate access token (10 minutes)
  static generateAccessToken(user) {
    return this.#createToken(user, this.#JWT_SECRET, "10m");
  }

  // Generate refresh token (15 minutes)
  static generateRefreshToken(user) {
    return this.#createToken(user, this.#REFRESH_TOKEN_SECRET, "15m");
  }

  // Check token middleware
  static async checkToken(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) {
      return next();
    }

    try {
      req.user = await AuthMiddleware.#verifyToken(token, AuthMiddleware.#JWT_SECRET);
      next();
    } catch (error) {
      res.status(401).json({ message: "Token invalide" });
    }
  }

  // Authenticate token middleware
  static async authenticateToken(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.redirect("/login?error=Vous devez être connecté pour accéder à cette page.");
    }

    try {
      req.user = await AuthMiddleware.#verifyToken(token, AuthMiddleware.#JWT_SECRET);
      next();
    } catch (error) {
      res.redirect("/login?error=Session expirée, veuillez vous reconnecter.");
    }
  }
}

// Validate environment on module load
AuthMiddleware.validateEnv();

module.exports = {
  generateAccessToken: AuthMiddleware.generateAccessToken.bind(AuthMiddleware),
  generateRefreshToken: AuthMiddleware.generateRefreshToken.bind(AuthMiddleware),
  checkToken: AuthMiddleware.checkToken.bind(AuthMiddleware),
  authenticateToken: AuthMiddleware.authenticateToken.bind(AuthMiddleware)
};