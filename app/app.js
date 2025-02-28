const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const { DatabaseManager } = require("./db/data");
const { connectDb } = require("./db/database");
const userRoute = require("./routes/User");
const adminRoute = require("./routes/Admin");
const pagesRoute = require("./routes/Pages");

const app = express();

// Basic middlewares
app.use(express.json());
app.use(cookieParser());

async function initApp() {
  try {
    // Initialize database
    await DatabaseManager.connectRoot();
    await connectDb();
    console.log("Database initialized successfully");

    // Setup session
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

    // User session middleware
    app.use((req, res, next) => {
      res.locals.user = req.session.user || null;
      next();
    });

    // Static files
    const publicPath = path.resolve(__dirname, "public");
    app.use(express.static(publicPath));
    app.use(express.static(path.join(publicPath, "css")));
    app.use(express.static(path.join(publicPath, "js")));

    // View engine setup
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "resources/views"));
    app.use(expressLayouts);
    app.set("layout", "components/layout");
    app.set("layout extractScripts", true);

    // Routes
    app.use("/api/users/", userRoute);
    app.use("/api/admin/", adminRoute);
    app.use("/", pagesRoute);
  } catch (error) {
    console.error("Application initialization error:", error);
    process.exit(1);
  }
}

initApp();

module.exports = app;
