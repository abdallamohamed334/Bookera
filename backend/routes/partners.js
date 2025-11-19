import express from "express";
import db from "../db/db.js"; // PostgreSQL connection

const router = express.Router();

// ==============================
// 🔹 تسجيل شريك جديد
// ==============================
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      partnerType,
      businessName,
      location,
      description,
      experience,
      portfolio,
      status = "pending",
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (
      !fullName ||
      !email ||
      !phone ||
      !partnerType ||
      !businessName ||
      !location ||
      !description ||
      !experience
    ) {
      return res.status(400).json({ error: "جميع الحقول المطلوبة يجب ملؤها" });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "صيغة البريد الإلكتروني غير صحيحة" });
    }

    // التحقق من عدم وجود بريد إلكتروني مكرر
    const existingPartner = await db.query(
      "SELECT id FROM partners WHERE email = $1",
      [email]
    );

    if (existingPartner.rows.length > 0) {
      return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
    }

    // إدخال البيانات
    const result = await db.query(
      `
      INSERT INTO partners 
      (full_name, email, phone, partner_type, business_name, location, description, experience, portfolio_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
      `,
      [
        fullName,
        email,
        phone,
        partnerType,
        businessName,
        location,
        description,
        experience,
        portfolio || null,
        status,
      ]
    );

    res.status(201).json({
      message: "تم تقديم طلب الانضمام بنجاح",
      partnerId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error registering partner:", error);

    if (error.code === "23505") {
      return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
    }

    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// ==============================
// 🔹 الحصول على جميع الشركاء
// ==============================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, full_name, email, phone, partner_type, business_name, location,
             status, registration_date
      FROM partners
      ORDER BY registration_date DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// ==============================
// 🔹 تحديث الحالة
// ==============================
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "حالة غير صالحة" });
    }

    const result = await db.query(
      "UPDATE partners SET status = $1 WHERE id = $2 RETURNING id",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "الشريك غير موجود" });
    }

    res.json({ message: "تم تحديث الحالة بنجاح" });
  } catch (error) {
    console.error("Error updating partner status:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// ==============================
// 🔹 الحصول على شريك محدد
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * FROM partners WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "الشريك غير موجود" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching partner:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

export default router;
