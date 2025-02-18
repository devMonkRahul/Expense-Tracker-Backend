import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { createBudget, getBudgets, getBudget, updateBudget, deleteBudget } from "../controllers/budget.controller.js";

const router = Router();

router.route("/addBudget").post(verifyUser, createBudget);
router.route("/getBudgets").get(verifyUser, getBudgets);
router.route("/getBudget/:budgetId").get(verifyUser, getBudget);
router.route("/updateBudget/:budgetId").patch(verifyUser, updateBudget);
router.route("/deleteBudget/:budgetId").delete(verifyUser, deleteBudget);

export default router;