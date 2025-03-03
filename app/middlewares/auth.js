const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { findByUsername } = require("../models/User");
dotenv.config({ path: "./.env" });

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error("JWT_SECRET or REFRESH_TOKEN_SECRET not defined");
  process.exit(1);
}

module.exports = {
  generateAccessToken: (user) => {
    const { password_hash, ...userData } = user;
    return jwt.sign(userData, JWT_SECRET, { expiresIn: "1m" });
  },

  generateRefreshToken: (user) => {
    const { password_hash, ...userData } = user;
    return jwt.sign(userData, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  },

  checkToken: async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalide" });
      }
      req.user = decoded;
      next();
    });
  },

  authenticateToken: async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      return res.redirect(
        "/login?error=Vous devez être connecté pour accéder à cette page."
      );
    }

    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return next();
      }

      if (!refreshToken) {
        return res.redirect(
          "/login?error=Session expirée, veuillez vous reconnecter."
        );
      }

      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        (refreshErr, refreshDecoded) => {
          if (refreshErr) {
            return res.redirect(
              "/login?error=Session expirée, veuillez vous reconnecter."
            );
          }

          const newAccessToken = jwt.sign(
            { user: refreshDecoded.user },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          });

          req.user = refreshDecoded;
          next();
        }
      );
    });
  },
};
