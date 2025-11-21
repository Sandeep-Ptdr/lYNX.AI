// import { register } from "@/controllers/registerController";
import { NextResponse } from "next/server";
import User from "@/app/api/models/user";
import { connectDb } from "@/lib/connectDb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();
  // console.log('username',name,'password',password);
  try {
    await connectDb();
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    const exists = await User.findOne({ email });

    if (exists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name:name,
      email, 
      password:hashedPassword,
    });
    await user.save();
    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
