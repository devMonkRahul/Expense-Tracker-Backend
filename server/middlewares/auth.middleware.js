import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { config } from "../constants.js";
import User from "../models/user.model.js";
import { sendUnauthorized, sendServerError } from "../utils/response.utils.js";

export const verifyUser = expressAsyncHandler(async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return sendUnauthorized(res);
        }

        const verifiedInformation = jwt.verify(
            token, config.accessTokenSecret
        );

        const user = await User.findById(verifiedInformation?._id).select("-password");

        if (!user) {
            return sendUnauthorized(res);
        }

        req.user = user;
        next();
    } catch (error) {
        return sendServerError(res, error);
    }
});