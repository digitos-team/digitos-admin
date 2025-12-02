import express from "express";
import { addClientMessage, deleteClientMessage, getAllClientMessages } from "../controllers/clientController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const clientRoutes = express.Router();

// Client submits inquiry
clientRoutes.post("/addmessage", addClientMessage);

// Admin gets all client messages
clientRoutes.get("/getallmessages", 
    authMiddleware, 
    getAllClientMessages);
clientRoutes.delete("/deletemessage/:id",
    // authMiddleware,
    deleteClientMessage);
export default clientRoutes;
