require("dotenv").config();

const express = require("express");
const cors = require("cors");

const triageRoute = require("./routes/triage");

const app = express();

// ✅ FIX: Proper PORT handling
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route (important for checking server)
app.get("/", (req, res) => {
  res.send("🚀 DermSight Backend is Running...");
});

// ✅ API route
app.use("/api/triage", triageRoute);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
