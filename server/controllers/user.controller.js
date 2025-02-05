import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { sendSuccess, sendError, sendServerError } from "../utils/response.utils.js";
import { constants } from "../constants.js";

export const registerUser = expressAsyncHandler(async (req, res) => {
    try {
        const { fullName, username, email, password, profileImage, isGmailUser } = req.body;

        if (!fullName || !email) {
            return sendError(res, constants.VALIDATION_ERROR, "Please fill in all required fields");
        }

        if (!isGmailUser && !password) {
            return sendError(res, constants.VALIDATION_ERROR, "Please provide a password");
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });

        if (existingUser) {
            return sendError(res, constants.CONFLICT, "User already exists");
        }

        const user = await User.create({
            fullName,
            username: username ? username : email.split("@")[0],
            email: email.toLowerCase(),
            password,
            profileImage,
            isGmailUser,
        })

        const accessToken = await user.generateAccessToken();

        // const registeredUser = await User.findById(user._id).select("-password");

        return sendSuccess(res, constants.CREATED, "User registered successfully", { accessToken });
    } catch (error) {
        sendServerError(res, error);
    }
});

export const loginUser = expressAsyncHandler(async (req, res) => {
    try {
        const { email, username, password, isGmailUser } = req.body;

        if (!email && !username) {
            return sendError(res, constants.VALIDATION_ERROR, "Please provide an email or username");
        }

        const user = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { username }] });

        if (!user) {
            return sendError(res, constants.NO_CONTENT, "User not found");
        }

        if (!user.isGmailUser && !(await user.isPasswordCorrect(password))) {
            return sendError(res, constants.UNAUTHORIZED, "Invalid credentials");
        }

        if (user.isGmailUser && !isGmailUser) {
            return sendError(res, constants.UNAUTHORIZED, "Please login with Google");
        }

        const accessToken = await user.generateAccessToken();

        // const loggedInUser = await User.findById(user._id).select("-password");

        return sendSuccess(res, constants.OK, "User logged in successfully", { accessToken });
    } catch (error) {
        sendServerError(res, error);
    }
});

export const getProfile = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        return sendSuccess(res, constants.OK, "Profile fetched successfully", user);
    } catch (error) {
        return sendServerError(res, error);
    }
});