import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(verifyUser, getProfile);

export default router;