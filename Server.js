// code in server.js file (S capital)
import express from "express";
import cors from "cors";
import Database from "./Database.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import clientRoutes from "./src/routes/clientRoutes.js";

let Server = express();

// Middlewares
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
Server.listen(5000, () => {
  console.log("server started");
});
