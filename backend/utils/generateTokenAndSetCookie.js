import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, userType = "user") => {
    const token = jwt.sign({ 
        userId, 
        userType // ⬅️ إضافة userType في الـ payload
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // تحديد إعدادات الـ cookie بناء على البيئة
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    return token;
};