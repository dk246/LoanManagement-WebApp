import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },
    witness: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
