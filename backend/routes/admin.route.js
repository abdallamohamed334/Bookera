// routes/admin.route.js
import express from "express";
import { adminLogin } from "../controllers/admin.controller.js"; // تأكد من الاستيراد

const router = express.Router();

router.post("/login", adminLogin);

export default router;