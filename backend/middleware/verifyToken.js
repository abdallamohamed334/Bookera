import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/Admin.model.js"; // ⬅️ استيراد موديل الأدمن

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        // التحقق من نوع المستخدم
        if (decoded.userType === "admin") {
            // إذا كان أدمن، نبحث في داتابيز الأدمن
            const admin = await Admin.findById(decoded.userId);
            if (!admin) {
                return res.status(401).json({ success: false, message: "Admin not found" });
            }
            req.userId = decoded.userId;
            req.userType = "admin";
            req.user = admin; // ⬅️ نضيف بيانات الأدمن للطلب
        } else {
            // إذا كان user عادي، نبحث في داتابيز اليوزرز
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }
            req.userId = decoded.userId;
            req.userType = "user";
            req.user = user; // ⬅️ نضيف بيانات اليوزر للطلب
        }

        next();
    } catch (error) {
        console.log("Error in verifyToken ", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};