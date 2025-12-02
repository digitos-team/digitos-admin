

// import ClientSchema from "../models/ClientSchema.js";


// const addClientMessage = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0)
//       return res.status(400).json({ message: "Request body missing" });

//     const { name, email, phone, company, message } = req.body;

//     if (!name || !email || !phone || !company || !message) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const data = await ClientSchema.create({
//       name: name.trim(),
//       email: email.trim(),
//       phone: phone.trim(),
//       company: company.trim(),
//       message: message.trim()
//     });

//     res.status(201).json({ message: "Client inquiry sent", data });
//   } catch (error) {
//     console.error("Client creation error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// const getAllClientMessages = async (req, res) => {
//   try {
//     const messages = await ClientSchema.find().sort({ createdAt: -1 });
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const deleteClientMessage = async (req, res) => {
//   try {
//     const { id } = req.params; // Get ID from URL parameters

//     if (!id) return res.status(400).json({ message: "Client message ID is required" });

//     const deletedMessage = await ClientSchema.findByIdAndDelete(id);

//     if (!deletedMessage) {
//       return res.status(404).json({ message: "Client message not found" });
//     }

//     res.status(200).json({ 
//       message: "Client message deleted successfully", 
//       deletedMessage 
//     });
//   } catch (error) {
//     console.error("Client deletion error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
  
// export { addClientMessage, getAllClientMessages, deleteClientMessage };
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
const getAllClientMessages = asyncHandler(async (req, res) => {
    const messages = await ClientSchema.find().sort({ createdAt: -1 });

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
