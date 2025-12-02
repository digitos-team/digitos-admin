// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Admin from "../models/Admin.js";

// const registerAdmin = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0)
//       return res.status(400).json({ message: "Request body missing" });

//     const { name, email, password } = req.body;

//     // Basic validation
//     if (!name || !email || !password)
//       return res
//         .status(400)
//         .json({ message: "Name, email and password are required" });

//     const exists = await Admin.findOne({ email });
//     if (exists)
//       return res.status(400).json({ message: "Admin already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const admin = await Admin.create({ name, email, password: hashed });

//     res.status(201).json({ message: "Admin created", admin });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const loginAdmin = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0)
//       return res.status(400).json({ message: "Request body missing" });

//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password are required" });

//     // Find admin by email and include needed fields
//     const admin = await Admin.findOne({ email }).select("+password"); 
//     if (!admin) return res.status(400).json({ message: "Invalid credentials" });

//     // Compare hashed password
//     const match = await bcrypt.compare(password, admin.password);
//     if (!match) return res.status(400).json({ message: "Invalid credentials" });

//     // Generate JWT with admin ID
//     const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Populate essential admin info to return along with token
//     const adminData = await Admin.findById(admin._id).select("name email role");

//     res.json({ message: "Login successful", token, admin: adminData });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const updateAdminPassword = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0)
//       return res.status(400).json({ message: "Request body missing" });

//     const { currentPassword, newPassword } = req.body;

//     // Basic validation
//     if (!currentPassword || !newPassword)
//       return res
//         .status(400)
//         .json({ message: "Current password and new password are required" });

//     if (newPassword.length < 6)
//       return res
//         .status(400)
//         .json({ message: "New password must be at least 6 characters long" });

//     // Get admin from JWT token (assuming auth middleware sets req.admin)
//     const admin = await Admin.findById(req.admin.adminId).select("+password");
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
//     if (!isCurrentPasswordValid)
//       return res.status(400).json({ message: "Current password is incorrect" });

//     // Check if new password is same as current
//     const isSameAsCurrent = await bcrypt.compare(newPassword, admin.password);
//     if (isSameAsCurrent)
//       return res.status(400).json({ message: "New password cannot be same as current password" });

//     // Hash new password
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     admin.password = hashedNewPassword;
//     await admin.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export { registerAdmin, loginAdmin, updateAdminPassword };
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
