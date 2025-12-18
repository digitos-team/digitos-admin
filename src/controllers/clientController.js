
import ClientSchema from "../models/ClientSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// ---------------- ADD CLIENT MESSAGE ----------------
const addClientMessage = asyncHandler(async (req, res) => {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email || !phone || !company || !message) {
        throw new ApiError(400, "All fields are required");
    }

    const data = await ClientSchema.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        message: message.trim(),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, data, "Client inquiry sent"));
});



// ---------------- GET ALL CLIENT MESSAGES ----------------
// ---------------- GET ALL CLIENT MESSAGES ----------------
const getAllClientMessages = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;

    let query = ClientSchema.find();

    if (page && limit) {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const skip = (pageInt - 1) * limitInt;
        query = query.skip(skip).limit(limitInt);
    }

    const messages = await query.sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, messages, "Client messages fetched"));
});



// ---------------- DELETE CLIENT MESSAGE ----------------
const deleteClientMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Client message ID is required");
    }

    const deletedMessage = await ClientSchema.findByIdAndDelete(id);

    if (!deletedMessage) {
        throw new ApiError(404, "Client message not found");
    }

    return res.json(
        new ApiResponse(200, deletedMessage, "Client message deleted successfully")
    );
});



export {
    addClientMessage,
    getAllClientMessages,
    deleteClientMessage
};
