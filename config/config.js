const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "docsecure_db",
  multipleStatements: true,
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.promise().getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

module.exports = {
  pool: pool.promise(),
  testConnection
};
