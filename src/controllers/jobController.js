
// import upload from "../middleware/multerConfig.js";
// import JobApplication from "../models/JobApplication.js";
// import JobPositions from "../models/JobPositions.js";

// const addJobPosition = async (req, res) => {
//   try {
    
    
//     if (!req.body || Object.keys(req.body).length === 0)
//       return res.status(400).json({ message: "Request body missing" });

//     const { title, description, adminId, experienceRequired, location } = req.body;

//     if (!title) return res.status(400).json({ message: "Title is required" });
//     if (!adminId) return res.status(400).json({ message: "Admin ID is required" });

//     const exists = await JobPositions.findOne({ title });
//     if (exists)
//       return res.status(400).json({ message: "Position already exists" });

//     // Validate admin exists
//     const admin = await JobPositions.model("Admin").findById(adminId);
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     const pos = await JobPositions.create({ 
//       title, 
//       description,
//         adminId: adminId, // Now using the reference field [web:10], 
//         experienceRequired,
//        location
//     });
    
//     res.status(201).json({ message: "Position added", pos });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const applyForJob = async (req, res) => {
//   try {
//     // Remove the upload.single() wrapper - it's already in the route!
    
//     if (!req.body.name || !req.body.email || !req.body.phone || !req.body.positionApplyingFor) {
//       return res.status(400).json({
//         message: "name, email, phone and positionApplyingFor are required",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Resume is required" });
//     }

//     const position = await JobPositions.findById(req.body.positionApplyingFor);
//     if (!position) {
//       return res.status(404).json({ message: "Position does not exist" });
//     }

//     const app = await JobApplication.create({
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       positionApplyingFor: req.body.positionApplyingFor,
//       resume: req.file.path
//     });

//     res.status(201).json({ message: "Application submitted", app });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getAllApplications = async (req, res) => {
//   try {
//     const apps = await JobApplication.find()
//       .populate("positionApplyingFor", "title description")  // Position details
//       .populate("positionApplyingFor.admin", "name email")   // Nested admin
//       .select("name email phone resume positionApplyingFor createdAt")  // ← Include resume [web:10]
//       .sort({ createdAt: -1 });

//     res.json(apps);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get positions with admin populated
//   const getAllPositions = async (req, res) => {
//     try {
//       const positions = await JobPositions.find()
//         .populate("adminId", "name email ") // Populate admin details
//         .sort({ createdAt: -1 });
      
//       res.json(positions);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
// const deleteJobApplication = async (req, res) => {
//   try {
//     const { id } = req.params; // Get ID from URL parameters

//     if (!id) return res.status(400).json({ message: "Application ID is required" });

//     const deletedApp = await JobApplication.findByIdAndDelete(id);

//     if (!deletedApp) {
//       return res.status(404).json({ message: "Job application not found" });
//     }

//     res.status(200).json({ message: "Job application deleted successfully", deletedApp });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const deleteJobPosition = async (req, res) => {
//   try {
//     const { id } = req.params; // Get ID from URL parameters

//     if (!id) return res.status(400).json({ message: "Position ID is required" });

//     // Check if position exists and delete it
//     const deletedPosition = await JobPositions.findByIdAndDelete(id);

//     if (!deletedPosition) {
//       return res.status(404).json({ message: "Job position not found" });
//     }

//     res.status(200).json({ 
//       message: "Job position deleted successfully", 
//       deletedPosition 
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export { addJobPosition, applyForJob, getAllPositions, getAllApplications, deleteJobApplication, deleteJobPosition  };
import JobApplication from "../models/JobApplication.js";
import JobPositions from "../models/JobPositions.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// ---------------- ADD JOB POSITION ----------------
const addJobPosition = asyncHandler(async (req, res) => {
    const { title, description, adminId, experienceRequired, location } = req.body;

    if (!title) throw new ApiError(400, "Title is required");
    if (!adminId) throw new ApiError(400, "Admin ID is required");

    const exists = await JobPositions.findOne({ title });
    if (exists) throw new ApiError(400, "Position already exists");

    // Validate admin (Admin model is referenced inside JobPositions)
    const admin = await JobPositions.model("Admin").findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    const pos = await JobPositions.create({
        title,
        description,
        adminId,
        experienceRequired,
        location
    });

    return res
        .status(201)
        .json(new ApiResponse(201, pos, "Position added"));
});



// ---------------- APPLY FOR JOB ----------------
const applyForJob = asyncHandler(async (req, res) => {
    const { name, email, phone, positionApplyingFor } = req.body;

    if (!name || !email || !phone || !positionApplyingFor) {
        throw new ApiError(400, "name, email, phone and positionApplyingFor are required");
    }

    if (!req.file) {
        throw new ApiError(400, "Resume file is required");
    }

    const position = await JobPositions.findById(positionApplyingFor);
    if (!position) throw new ApiError(404, "Position does not exist");

    const app = await JobApplication.create({
        name,
        email,
        phone,
        positionApplyingFor,
        resume: req.file.path
    });

    return res
        .status(201)
        .json(new ApiResponse(201, app, "Application submitted"));
});



// ---------------- GET ALL APPLICATIONS ----------------
const getAllApplications = asyncHandler(async (req, res) => {
    const apps = await JobApplication.find()
        .populate("positionApplyingFor", "title description")
        .populate("positionApplyingFor.admin", "name email")
        .select("name email phone resume positionApplyingFor createdAt")
        .sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, apps, "Applications fetched"));
});



// ---------------- GET ALL JOB POSITIONS ----------------
const getAllPositions = asyncHandler(async (req, res) => {
    const positions = await JobPositions.find()
        .populate("adminId", "name email")
        .sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, positions, "Positions fetched"));
});



// ---------------- DELETE JOB APPLICATION ----------------
const deleteJobApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Application ID is required");

    const deletedApp = await JobApplication.findByIdAndDelete(id);
    if (!deletedApp) throw new ApiError(404, "Job application not found");

    return res.json(
        new ApiResponse(200, deletedApp, "Job application deleted successfully")
    );
});



// ---------------- DELETE JOB POSITION ----------------
const deleteJobPosition = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Position ID is required");

    const deletedPosition = await JobPositions.findByIdAndDelete(id);
    if (!deletedPosition) throw new ApiError(404, "Job position not found");

    return res.json(
        new ApiResponse(200, deletedPosition, "Job position deleted successfully")
    );
});



export {
    addJobPosition,
    applyForJob,
    getAllPositions,
    getAllApplications,
    deleteJobApplication,
    deleteJobPosition
};
