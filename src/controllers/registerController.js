import User from "../app/api/models/user.js";

export const register = async (username, email, password) => {
  try {
     
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(
        {
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const user = new User({
      username,
      email,
      password,
    });
    await user.save();
    return res.json(
      {
        message: "User registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return res.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
};
