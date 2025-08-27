const express = require("express");
const cors = require("cors");


const userRoutes = require("./routes/userRoutes");
const { testConnection } = require("./config/config");



const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Test database connection
testConnection();

// Test JSON formatting
app.get("/test-json", (req, res) => {
  res.json({ 
    test: "This is a test", 
    number: 123,
    array: [1, 2, 3]
  });
});

// Routes
app.use("/auth", userRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
