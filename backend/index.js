import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes imports
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import weddingVenuesRoutes from "./routes/weddingVenues.route.js";
import photographersRoutes from "./routes/photographers.route.js";
import bookingsRoutes from "./routes/bookings.route.js";
import whatsappRoutes from "./routes/whatsapp.js"; // ✅ تم التصحيح
import reviewsRoutes from './routes/reviews.route.js';
import { connectDB } from "./db/connectDB.js";
import telegramRoutes from "./routes/telegram.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 إصلاح __dirname لـ ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 إصلاح CORS للموبايل
app.use(
  cors({
    origin: true, // يسمح بجميع origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wedding-venues", weddingVenuesRoutes);
app.use("/api/photographers", photographersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/whatsapp", whatsappRoutes); 
app.use('/api/venues', reviewsRoutes);
app.use("/api/telegram", telegramRoutes)// ✅ استخدام import بدلاً من require

// 🔥 Route للتست على الموبايل
app.get("/api/mobile-test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Mobile API is working!",
    timestamp: new Date().toISOString(),
  });
});

// 🔥 Route لفحص إعدادات Twilio
app.get("/api/check-twilio", (req, res) => {
  const twilioConfig = {
    hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
    hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    adminNumber: process.env.ADMIN_WHATSAPP_NUMBER,
  };
  
  res.json({
    success: true,
    twilio: twilioConfig,
    message: twilioConfig.hasAccountSid && twilioConfig.hasAuthToken 
      ? "Twilio configured ✅" 
      : "Twilio not configured ❌"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully! 🚀" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("🚀 Server is running on port:", PORT);
  console.log("📞 WhatsApp Routes: /api/whatsapp/send-whatsapp");
  console.log("🔧 Twilio Check: /api/check-twilio");
});