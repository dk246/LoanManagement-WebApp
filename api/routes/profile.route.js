// routes/user.routes.js
import express from "express";
import { updateUser } from "../controller/profile.controller.js";

const router = express.Router();

router.post("/update/:id", updateUser);

export default router;
