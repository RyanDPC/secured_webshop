const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "db",
  port: 3306,
  user: "db_user",
  password: "db_user_pass",
  database: "db_TechSolutions",
});

// Connect to database
const connectDb = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Database Connection Error:", err.message);
        return reject(err);
      }
      console.log("Connected to database successfully");
      resolve();
    });
  });
};

// Helper for executing queries
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        console.error("Query Error:", err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  db,
  connectDb,
  executeQuery,
};
