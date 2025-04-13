import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    nowamount: {
      type: Number,
      default: 0,
    },
    payment: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthlyInterest: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
