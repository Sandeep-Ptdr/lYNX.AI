import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js
export default mongoose.models.User || mongoose.model("User", UserSchema);
