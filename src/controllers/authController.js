import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



// ---------------- REGISTER ADMIN ----------------
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
        throw new ApiError(400, "Admin already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
        name,
        email,
        password: hashed
    });

    return res
        .status(201)
        .json(new ApiResponse(201, admin, "Admin created successfully"));
});



// ---------------- LOGIN ADMIN ----------------
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
        throw new ApiError(400, "Invalid credentials");
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
        throw new ApiError(400, "Invalid credentials");
    }

    const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const adminData = await Admin.findById(admin._id).select("name email role");

    return res.json(
        new ApiResponse(200, { token, admin: adminData }, "Login successful")
    );
});



// ---------------- UPDATE ADMIN PASSWORD ----------------
const updateAdminPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long");
    }

    const admin = await Admin.findById(req.admin.adminId).select("+password");

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, admin.password);
    if (isSameAsCurrent) {
        throw new ApiError(400, "New password cannot be same as current password");
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.json(new ApiResponse(200, null, "Password updated successfully"));
});



export { registerAdmin, loginAdmin, updateAdminPassword };
