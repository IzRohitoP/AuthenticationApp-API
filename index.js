const express = require("express");
const dbconnect = require("./config/db");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

const startServer = async () => {
  try {
    // Connect to the database
    await dbconnect();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error while starting the server:", error);
  }
};

// Start the server
startServer();

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hi");
});

// User routes
const userRoutes = require("./routes/user");
app.use("/api/v1", userRoutes);
