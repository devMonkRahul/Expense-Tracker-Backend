import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";

const incomeSchema = new Schema(
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
      default: "income",
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

incomeSchema.pre("save", async function (next) {
  try {
    const user = this.user;
    await User.findByIdAndUpdate(
      user,
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

incomeSchema.pre("findOneAndUpdate", async function (next) {
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
          $inc: { totalBalance: difference },
        },
        { runValidators: true }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

incomeSchema.pre("remove", async function (next) {
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

incomeSchema.pre("findOneAndDelete", async function (next) {
  try {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (!docToDelete) return next();
    await User.findByIdAndUpdate(
      docToDelete.user,
      {
        $inc: { totalBalance: -docToDelete.amount },
      },
      { runValidators: true }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Income = mongoose.model("Income", incomeSchema);

export default Income;
