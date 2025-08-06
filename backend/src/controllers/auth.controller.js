import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from "../lib/stream.js";
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists, please use a different one' });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        // const hashedPassword = await bcrypt.hash(password, 10);
        // if (!hashedPassword) {
        //     return res.status(500).json({ message: 'Error hashing password' });
        // }

        const newUser = await User.create({
            fullName,
            email,
            password,// password: hashedPassword,
            profilePic: randomAvatar
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }


        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            success: true
        });
    } catch (error) {
        console.error('Error during signup:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }

}
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
}   

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    console.log("userid:",userId);
    const { fullName, bio, profilePic, birthday, profession, location } = req.body;

    if (!fullName || !bio || !birthday || !profession || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",  
          !birthday && "birthday",
          !location && "location",
          !profession && "profession",
        ].filter(Boolean),
      });
    }
console.log("Onboarding user3");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
console.log("Onboarding user4");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
console.log("Onboarding user5");
// update Stream user after onboarding
console.log("Updated User:",updatedUser);

    try {
      await upsertStreamUser([
       { id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",}
      ]);
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
      console.log("Onboarding user6");
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}