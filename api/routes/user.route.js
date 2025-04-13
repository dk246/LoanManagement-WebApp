import express from "express";
import { dataAll } from "../controller/user.controller.js";

const router = express.Router();

router.get("/", dataAll);

export default router;
