
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
// ---------------- GET ALL JOB POSITIONS ----------------
const getAllPositions = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;

    let query = JobPositions.find();

    if (page && limit) {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const skip = (pageInt - 1) * limitInt;
        query = query.skip(skip).limit(limitInt);
    }

    const positions = await query
        .populate("adminId", "name email")
        .sort({ createdAt: -1 })
        .lean();

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
