import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "invalid data",
        success: false
      });
    };

    //if user not register yourself
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // if user is present then matching the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const token = await jwt.sign(
      { id: user._id },
      "ILOVEYOUMEDUSASOMUCH",
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: `welcome back ${user.fullName}`,
        user: {   // added user object
          id: user._id,
          fullName: user.fullName,
          email: user.email
        },
        success: true
      });
  } catch (error) {
    console.error("Error in Login:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

//logout
export const logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()), // fixed: 'expiresIn' → 'expires'
      httpOnly: true
    })
    .json({
      message: "user logged out successfully.",
      success: true,
    });
};


//register 
// register
// Re-use bcrypt and User imported at top of the file

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // ✅ Validate inputs
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "This email is already used",
        success: false,
      });
    }

    // ✅ Hash password (recommended salt rounds: 10, not 16)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // ✅ Respond success
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error in Register:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
