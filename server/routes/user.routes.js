import { Router } from "express";
import { registerUser, loginUser, getProfile, updateProfile, changePassword, validateUsername, validateEmail } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(verifyUser, getProfile);
router.route("/profile/update").patch(verifyUser, updateProfile);
router.route("/profile/changePassword").patch(verifyUser, changePassword);

router.route("/validate/username").post(verifyUser, validateUsername);
router.route("/validate/email").post(verifyUser, validateEmail);

export default router;