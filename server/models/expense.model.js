import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: true,
      maxLength: 20,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: "expense",
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 20,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

expenseSchema.pre("save", async function (next) {
  try {
    const user = this.user;
    await User.findByIdAndUpdate(
      user,
      {
        $inc: { totalBalance: -this.amount },
      },
      { runValidators: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

expenseSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (!docToUpdate) return next();

    const update = this.getUpdate();
    const newAmount = update.$set?.amount || update.amount;

    if (newAmount !== undefined && newAmount !== docToUpdate.amount) {
      const difference = newAmount - docToUpdate.amount;

      await User.findByIdAndUpdate(
        docToUpdate.user,
        {
          $inc: { totalBalance: -difference },
        },
        { runValidators: true }
      );
    }
  } catch (error) {
    next(error);
  }
});

expenseSchema.pre("remove", async function (next) {
  try {
    await User.findByIdAndUpdate(
      this.user,
      {
        $inc: { totalBalance: this.amount },
      },
      { runValidators: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

expenseSchema.pre("findOneAndDelete", async function (next) {
  try {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (!docToDelete) return next();

    await User.findByIdAndUpdate(
      docToDelete.user,
      {
        $inc: { totalBalance: docToDelete.amount },
      },
      { runValidators: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
