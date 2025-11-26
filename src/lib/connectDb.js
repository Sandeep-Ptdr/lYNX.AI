// import mongoose from "mongoose";

// let isConnected = false;
// export async function connectDb() {
//   try {
//     if (isConnected) return;
//     const db = await mongoose.connect(process.env.MONGODB_URI);
//     isConnected = true;
//     return db;
//     // console.log(db.connection._connectionString, "connected");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     return { success: false, message: "Error connecting..." };
//   }
// }




import mongoose from "mongoose";

let isConnected = false;

export async function connectDb() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "test",//db name
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB Connected");

    return db;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw new Error("Error connecting to MongoDB");
  }
}
