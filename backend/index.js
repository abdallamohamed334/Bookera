import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import adminRoutes from "./routes/admin.route.js";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import weddingVenuesRoutes from "./routes/weddingVenues.route.js";
import photographersRoutes from "./routes/photographers.route.js";
import bookingsRoutes from "./routes/bookings.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// 🔥 إصلاح CORS للموبايل
app.use(cors({
  origin: true, // يسمح بجميع origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// أو جرب هذا الإعداد البسيط:
// app.use(cors());

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wedding-venues", weddingVenuesRoutes);
app.use("/api/photographers", photographersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingsRoutes);

// 🔥 أضف route للتست على الموبايل
app.get("/api/mobile-test", (req, res) => {
  res.json({ 
    success: true, 
    message: "✅ Mobile API is working!",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully! 🚀" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});