import Expense from "../models/expense.model.js";
import { sendSuccess, sendError, sendServerError } from "../utils/response.utils.js";
import { constants } from "../constants.js";
import expressAsyncHandler from "express-async-handler";

export const createExpense = expressAsyncHandler(async (req, res) => {
    try {
        const { title, amount, type, date, category, description } = req.body;

        if (!title || !amount || !date || !category || !description) {
            return sendError(res, constants.VALIDATION_ERROR, "Please fill in all required fields");
        }

        if (amount <= 0) {
            return sendError(res, constants.VALIDATION_ERROR, "Amount must be greater than 0");
        }

        if (description.length <= 0 || description.length > 20) {
            return sendError(res, constants.VALIDATION_ERROR, "Description must be between 1 and 20 characters");
        }

        const expense = await Expense.create({
            title,
            amount,
            type,
            date,
            category,
            description,
            user: req.user._id,
        });

        return sendSuccess(res, constants.CREATED, "Expense created successfully", expense);
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const getExpenses = expressAsyncHandler(async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });

        if (expenses.length === 0) {
            return sendSuccess(res, constants.OK, "No expenses found");
        }

        return sendSuccess(res, constants.OK, "Expenses retrieved successfully", expenses);
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const editExpense = expressAsyncHandler(async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { title, amount, date, category, description } = req.body;

        if (!expenseId) {
            return sendError(res, constants.VALIDATION_ERROR, "Expense ID is required");
        }

        if (amount && amount <= 0) {
            return sendError(res, constants.VALIDATION_ERROR, "Amount must be greater than 0");
        }

        if (description && (description.length <= 0 || description.length > 20)) {
            return sendError(res, constants.VALIDATION_ERROR, "Description must be between 1 and 20 characters");
        }

        const expense = await Expense.findByIdAndUpdate(expenseId, {
            title,
            amount,
            date,
            category,
            description,
        }, { new: true });

        return sendSuccess(res, constants.OK, "Expense updated successfully", expense);
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const deleteExpense = expressAsyncHandler(async (req, res) => {
    try {
        const { expenseId } = req.params;

        if (!expenseId) {
            return sendError(res, constants.VALIDATION_ERROR, "Expense ID is required");
        }

        const expense = await Expense.findByIdAndDelete(expenseId);

        return sendSuccess(res, constants.OK, "Expense deleted successfully", expense);
    } catch (error) {
        return sendServerError(res, error);
    }
});