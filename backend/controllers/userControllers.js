//Signup of an user

import cloudinary from "../lib/cloundinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ success: false, message: "Account Already Exists" });
    }

    const salt = bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // After creating an user creating an token to authenticate the user
    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to login the user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    res.json({
      success: true,
      userData,
      token,
      message: "Login Succesfuly",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to check weather the user is authenticated

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user details

export const updateProfile = async (req, res) => {
  try {
    const { profilPic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updateUser;
    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilPic);
      updateUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }
    res.json({ success: true, user: updateUser });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};
