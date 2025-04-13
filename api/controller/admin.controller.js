// In your backend (Node.js + Express)
// app.get("/api/admin/loan-requests", async (req, res) => {
//   try {
//     const requests = await LoanRequest.find().populate("userId"); // assuming you have userId linked
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

import Loan from "../models/loan.model.js";
import User from "../models/user.model.js";

export const requestedData = async (req, res) => {
  try {
    const requests = await Loan.find().populate("user"); // assuming you have userId linked
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const statusUpdate = async (req, res) => {
  const { status } = req.body;

  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const rejectLoan = async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);

    if (!deletedLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json({ message: "Loan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
