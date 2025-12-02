import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    positionApplyingFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosition",
      required: true,
    },
 resume: {  // ← New resume field
    type: String,  // Stores file path/URL
    required: true
  }
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
