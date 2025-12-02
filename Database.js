import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing from .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI) // No extra options!
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err.message));

export default mongoose;
