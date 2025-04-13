import User from "../models/user.model.js";
import Loan from "../models/loan.model.js";
import Payment from "../models/payment.model.js";

export const loanRequest = async (req, res) => {
  const {
    witness,
    details,
    value,
    amount,
    interestRate,
    durationMonths,
    userId,
  } = req.body;

  const newLoan = new Loan({
    witness,
    details,
    value,
    amount,
    interestRate,
    durationMonths,
    user: userId,
  });

  try {
    await newLoan.save();

    res.status(200).json({ message: "Loan request created success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!!!" });
  }
};

export const paymentRequest = async (req, res) => {
  const { nowamount, payment, userId, loanId, monthlyInterest } = req.body;

  const newPayment = new Payment({
    nowamount,
    payment,
    user: userId,
    loan: loanId,
    monthlyInterest, // save monthlyInterest in DB
  });

  try {
    await newPayment.save();
    res
      .status(200)
      .json({ message: "Loan payment request created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!!!" });
  }
};

export const historyData = async (req, res) => {
  try {
    const requests = await Payment.find().populate("user");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLoan = async (req, res) => {
  const { id } = req.params;
  const { nowamount, monthlyInterest, createdAt } = req.body;

  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      {
        nowamount,
        monthlyInterest,
        createdAt,
      },
      { new: true }
    );

    res.status(200).json(updatedLoan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update loan data" });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment)
      return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({
      message: "Payment approved successfully",
      payment: updatedPayment,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loanDetails = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    if (!loans.length)
      return res.status(404).json({ message: "No loans found" });
    res.status(200).json(loans[0]); // assuming the latest loan is what you need
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
