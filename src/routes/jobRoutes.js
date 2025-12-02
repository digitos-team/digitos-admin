import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { addJobPosition, applyForJob, deleteJobApplication, deleteJobPosition, getAllApplications, getAllPositions } from "../controllers/jobController.js";
import upload from "../middleware/multerConfig.js";

const jobRoutes = express.Router();

// Admin: Add job position
jobRoutes.post("/add-position",
     authMiddleware,
      addJobPosition);

// Job Seeker: Apply for job
jobRoutes.post("/apply",upload.single("resume"), applyForJob);

// Admin: All applications
jobRoutes.get("/applications", 
    // authMiddleware, 
    getAllApplications);
jobRoutes.get("/positions", 
    // authMiddleware,
     getAllPositions);
     
jobRoutes.delete("/applications/:id", 
    authMiddleware,
    deleteJobApplication);

jobRoutes.delete("/deleteposition/:id", 
    authMiddleware,
    deleteJobPosition);

export default jobRoutes;
