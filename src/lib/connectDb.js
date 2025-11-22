import mongoose from "mongoose";

let isConnected = false;
export async function connectDb() {
  try {
    if (isConnected) return;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    return db;
    // console.log(db.connection._connectionString, "connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return { success: false, message: "Error connecting..." };
  }
}
