import express from "express";

import {
  rejectLoan,
  requestedData,
  statusUpdate,
} from "../controller/admin.controller.js";

const router = express.Router();

router.get("/loan-requests", requestedData);
router.put("/loan-status/:id", statusUpdate);
router.delete("/loan-delete/:id", rejectLoan);
export default router;
