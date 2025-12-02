import express from "express";
import { loginAdmin, registerAdmin, updateAdminPassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const authRoutes = express.Router();

// Admin registration (use once)
authRoutes.post("/register", registerAdmin);

// Admin login
authRoutes.post("/login",  loginAdmin);

// Update admin password
authRoutes.put("/update-password",
     authMiddleware, 
     updateAdminPassword);

export default authRoutes;
