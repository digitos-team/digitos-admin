// code in server.js file (S capital)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./Database.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import clientRoutes from "./src/routes/clientRoutes.js";

let Server = express();

// Middlewares
Server.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ message: "Service Unavailable: Database starting up..." });
  }
});

Server.use(cors());
// Server.use(express.json()); // parse application/json
// Server.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Routes
Server.use("/uploads", express.static("uploads"));
Server.use(express.json({ limit: '10mb' }));
Server.use(express.urlencoded({ extended: true, limit: '10mb' }));
Server.use("/auth", authRoutes);
Server.use("/jobs", jobRoutes);
Server.use("/clients", clientRoutes);
Server.get("/", (req, res) => {
  res.send("Digitos Backend is running ");
});

const startServer = () => {
  connectDB(); // Non-blocking connection start
  Server.listen(process.env.PORT || 5000, () => {
    console.log("server started Port " + (process.env.PORT || 5000));
  });
};

startServer();
