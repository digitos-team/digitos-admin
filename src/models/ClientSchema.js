import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },
    phone: { type: String, required: [true, "Phone is required"] },
    company: { type: String, required: [true, "Company is required"] },
    message: { type: String, required: [true, "Message is required"] }
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
