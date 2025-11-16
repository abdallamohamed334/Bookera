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
import bookingsRoutes from "./routes/bookings.route.js"; // الجديد

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wedding-venues", weddingVenuesRoutes); // قاعات الأفراح
app.use("/api/photographers", photographersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingsRoutes); // الجديد
console.log("✅ Bookings routes loaded: /api/bookings");


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