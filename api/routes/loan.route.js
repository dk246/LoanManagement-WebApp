import express from "express";
import {
  approvePayment,
  historyData,
  loanDetails,
  loanRequest,
  paymentRequest,
  rejectPayment,
  updateLoan,
} from "../controller/loan.controller.js";

const router = express.Router();

router.post("/loan-request", loanRequest);
router.post("/payment-request", paymentRequest);
router.get("/payment-history", historyData);
router.put("/updateLoan/:id", updateLoan);
router.delete("/payment-delete/:id", rejectPayment);
router.put("/payment-approve/:id", approvePayment);
router.get("/user/:userId", loanDetails);
export default router;
