import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

// Initialize the Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    // Only allow "student" or "instructor" self-signup; admin created manually in DB
    const safeRole = ["student", "instructor"].includes(role) ? role : "student";

    const user = await User.create({ name, email, password, role: safeRole });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// NEW: Google Login Controller
export const googleLogin = async (req, res) => {
  console.log("=== GOOGLE LOGIN ROUTE HIT ==="); // <-- TRIPWIRE 1

  try {
    const { credential } = req.body;
    console.log("Token received from frontend:", !!credential); // <-- TRIPWIRE 2

    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Token successfully verified by Google!"); // <-- TRIPWIRE 3

    // 2. Extract user info from the verified token
    const { email, name } = ticket.getPayload();

    // 3. Check if user already exists in your database
    let user = await User.findOne({ email });

    // 4. If they don't exist, create a new account for them
    if (!user) {
      console.log("Creating new user account for:", email); // <-- TRIPWIRE 4
      
      // Generate a secure, random password to satisfy the User model requirements
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1@";
      
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: "student", // Default role for new Google signups
      });
    } else {
      console.log("Logging in existing user:", email); // <-- TRIPWIRE 5
    }

    // 5. Generate your standard Nursita JWT
    const token = signToken(user._id);

    // 6. Send it back to the frontend
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
    console.log("=== GOOGLE LOGIN SUCCESS ===");
    
  } catch (err) {
    console.error("=== GOOGLE AUTH ERROR ===", err); // <-- DETAILED ERROR LOG
    res.status(500).json({ message: "Google authentication failed", error: err.message });
  }
};