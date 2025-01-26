import { Router } from "express";
import { createIncome, getIncomes, editIncome, deleteIncome } from "../controllers/income.controller.js";
import { createExpense, getExpenses, editExpense, deleteExpense } from "../controllers/expense.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addIncome").post(verifyUser, createIncome);
router.route("/getIncomes").get(verifyUser, getIncomes);
router.route("/editIncome/:incomeId").patch(verifyUser, editIncome);
router.route("/deleteIncome/:incomeId").delete(verifyUser, deleteIncome);

router.route("/addExpense").post(verifyUser, createExpense);
router.route("/getExpenses").get(verifyUser, getExpenses);
router.route("/editExpense/:expenseId").patch(verifyUser, editExpense);
router.route("/deleteExpense/:expenseId").delete(verifyUser, deleteExpense);

export default router;