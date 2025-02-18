import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";

const budgetSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

budgetSchema.pre("save", async function (next) {
    try {
        const user = this.user;
        await User.findByIdAndUpdate(
            user,
            {
                $inc: { totalBudget: this.amount },
            },
            { runValidators: true }
        );
        next();
    } catch (error) {
        next(error);
    }
});

budgetSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const budget = await this.model.findOne(this.getQuery());
        if (!budget) return next();

        const update = this.getUpdate();
        const newAmount = update.$set?.amount || update.amount;

        if (newAmount !== undefined && newAmount !== budget.amount) {
            const difference = newAmount - budget.amount;
            await User.findByIdAndUpdate(
                budget.user,
                {
                    $inc: { totalBudget: difference },
                },
                { runValidators: true }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

budgetSchema.pre("remove", async function (next) {
    try {
        const user = this.user;
        await User.findByIdAndUpdate(
            user,
            {
                $inc: { totalBudget: -this.amount },
            },
            { runValidators: true }
        );
        next();
    } catch (error) {
        next(error);
    }
});

budgetSchema.pre("findOneAndRemove", async function (next) {
    try {
        const budget = await this.model.findOne(this.getQuery());
        if (!budget) return next();

        await User.findByIdAndUpdate(
            budget.user,
            {
                $inc: { totalBudget: -budget.amount },
            },
            { runValidators: true }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;