import mongoose from "mongoose";

const jobPositionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // References the Admin model [web:1][web:10]
      required: true // Optional: make it required if every position needs an admin
    },
    description: { type: String, trim: true },
    experienceRequired: { type: String, trim: true },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("JobPosition", jobPositionSchema);
