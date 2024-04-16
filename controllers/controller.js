const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming you have a User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config");

exports.manualSignUp = async (req, res) => {
    try {
      // Extracting data from the request body
      const { name, email, password } = req.body;
  
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user instance
      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Password should be hashed before saving to the database for security
      });
  
      // Save the new user to the database
      await newUser.save();
  
      res.status(200).json({ message: "Sign in successful" });
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.Manual_login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT token for authentication
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: "24h",
      });
  
      // Return user data along with message and token
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.getUserDetails = async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        // Add more fields as needed
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  exports.getUsers= async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };