import express from "express";
import dotenv from "dotenv";
import path from "path";
import dns from "dns";

// Fix for some Render MongoDB connection issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);

// Deployment / Production setup for serving React
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start Server & Connect to Database
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
