import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../constants.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already taken"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already registered"],
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address", // Validates proper email format
      ],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    },
    isGmailUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Check if the provided password matches the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate an access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenExpiry || "1h" } // Fallback to "1h" if the environment variable is not set
  );
};

const User = mongoose.model("User", userSchema);

export default User;
