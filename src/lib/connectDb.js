import mongoose from "mongoose";

export async function connectDb() {
  try {
    let isConnected = false;
    if (isConnected) return;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(db.connection._connectionString, "connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
