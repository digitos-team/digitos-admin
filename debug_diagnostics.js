import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobPositions from './src/models/JobPositions.js';

dotenv.config();

const run = async () => {
    try {
        console.log("--- DIAGNOSTIC START ---");
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is missing");

        console.log("Connecting...");
        await mongoose.connect(uri);
        console.log("Connected.");

        const count = await JobPositions.countDocuments();
        console.log(`COUNT: ${count}`);

        if (count > 0) {
            const first = await JobPositions.findOne().lean();
            console.log("FIRST_ID:", first._id.toString());
        } else {
            console.log("NO_DATA_FOUND");
        }
        console.log("--- DIAGNOSTIC END ---");

    } catch (error) {
        console.error("ERROR:", error.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

run();
