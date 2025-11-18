import express from "express";
import { sendTelegramMessage } from "../controllers/telegram.controller.js";

const router = express.Router();

router.post("/send", sendTelegramMessage);

export default router;
