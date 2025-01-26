import Income from "../models/income.model.js";
import { sendSuccess, sendError, sendServerError } from "../utils/response.utils.js";
import { constants } from "../constants.js";
import expressAsyncHandler from "express-async-handler";

export const createIncome = expressAsyncHandler(async (req, res) => {
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

        const income = await Income.create({
            title,
            amount,
            type,
            date,
            category,
            description,
            user: req.user._id,
        });

        return sendSuccess(res, constants.CREATED, "Income created successfully", income);
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const getIncomes = expressAsyncHandler(async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user._id });

        if (incomes.length === 0) {
            return sendSuccess(res, constants.OK, "No incomes found");
        }

        return sendSuccess(res, constants.OK, "Incomes retrieved successfully", incomes);
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const editIncome = expressAsyncHandler(async (req, res) => {
    try {
        const { incomeId } = req.params;
        const { title, amount, date, category, description } = req.body;

        if (!incomeId) {
            return sendError(res, constants.VALIDATION_ERROR, "Income ID is required");
        }

        if (amount && amount <= 0) {
            return sendError(res, constants.VALIDATION_ERROR, "Amount must be greater than 0");
        }

        if (description && (description.length <= 0 || description.length > 20)) {
            return sendError(res, constants.VALIDATION_ERROR, "Description must be between 1 and 20 characters");
        }

        const income = await Income.findByIdAndUpdate(incomeId, {
            title,
            amount,
            date,
            category,
            description,
        }, { new: true });

        return sendSuccess(res, constants.OK, "Income updated successfully", income);
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const deleteIncome = expressAsyncHandler(async (req, res) => {
    try {
        const { incomeId } = req.params;

        if (!incomeId) {
            return sendError(res, constants.VALIDATION_ERROR, "Income ID is required");
        }

        const income = await Income.findByIdAndDelete(incomeId);

        return sendSuccess(res, constants.OK, "Income deleted successfully", income);
    } catch (error) {
        return sendServerError(res, error);
    }
});