import Budget from "../models/budget.model.js";
import {
  sendSuccess,
  sendError,
  sendServerError,
} from "../utils/response.utils.js";
import { constants } from "../constants.js";
import expressAsyncHandler from "express-async-handler";

export const createBudget = expressAsyncHandler(async (req, res) => {
  try {
    const { title, amount } = req.body;

    if (!title || !amount) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Please fill in all required fields"
      );
    }

    if (amount <= 0) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Amount must be greater than 0"
      );
    }

    const budget = await Budget.create({
      title,
      amount,
      user: req.user._id,
    });

    return sendSuccess(
      res,
      constants.CREATED,
      "Budget created successfully",
      budget
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

export const getBudgets = expressAsyncHandler(async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    if (budgets.length === 0) {
      return sendSuccess(res, constants.OK, "No budgets found", budgets);
    }
    return sendSuccess(
      res,
      constants.OK,
      "Budgets retrieved successfully",
      budgets
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

export const getBudget = expressAsyncHandler(async (req, res) => {
  try {
    const { budgetId } = req.params;
    if (!budgetId) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Budget ID is required"
      );
    }
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return sendError(res, constants.VALIDATION_ERROR, "Budget not found");
    }
    return sendSuccess(
      res,
      constants.OK,
      "Budget retrieved successfully",
      budget
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

export const updateBudget = expressAsyncHandler(async (req, res) => {
  try {
    const { budgetId } = req.params;
    if (!budgetId) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Budget ID is required"
      );
    }
    const { title, amount } = req.body;
    const budget = await Budget.findByIdAndUpdate(
        budgetId,
      {
        title,
        amount,
      },
      { new: true }
    );
    return sendSuccess(
      res,
      constants.OK,
      "Budget updated successfully",
      budget
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});

export const deleteBudget = expressAsyncHandler(async (req, res) => {
  try {
    const { budgetId } = req.params;
    if (!budgetId) {
      return sendError(
        res,
        constants.VALIDATION_ERROR,
        "Budget ID is required"
      );
    }
    const budget = await Budget.findByIdAndDelete(budgetId);
    return sendSuccess(
      res,
      constants.OK,
      "Budget deleted successfully",
      budget
    );
  } catch (error) {
    return sendServerError(res, error);
  }
});
