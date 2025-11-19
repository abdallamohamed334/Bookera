import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

// قائمة الإيميلات المميزة التي لها صلاحية أدمن
const ADMIN_EMAILS = [
    'admin@example.com',
    'superadmin@company.com',
    'administrator@platform.com',
    'manager@reservation.com',
    'ahmed.admin@email.com',
    'mohamed.admin@email.com',
    'admin@reservation-platform.com',
    'superuser@platform.com'
    // أضف هنا أي إيميلات أخرى تريد منحها صلاحية الأدمن
];

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		// تحديد دور المستخدم بناءً على الإيميل
		const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';

		const user = new User({
			email,
			password: hashedPassword,
			name,
			role, // إضافة الدور
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  
  try {
    // البحث عن المستخدم باستخدام verificationToken
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select('+verificationToken +verificationTokenExpiresAt');

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired verification code" 
      });
    }

    // التحقق إذا كان البريد مُتحققاً بالفعل
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already verified" 
      });
    }

    // تحديث حالة المستخدم
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // إنشاء توكن جديد بعد التحقق
    generateTokenAndSetCookie(res, user._id);

    // إرسال بريد الترحيب
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.log("Failed to send welcome email:", emailError);
    }

    // إرجاع بيانات المستخدم بشكل آمن
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// التحقق من أن الإيميل مفعل
		if (!user.isVerified) {
			return res.status(400).json({ success: false, message: "Please verify your email first" });
		}

		// تحديث دور المستخدم إذا كان من الإيميلات المميزة ولم يكن أدمن بالفعل
		if (ADMIN_EMAILS.includes(email.toLowerCase()) && user.role !== 'admin') {
			user.role = 'admin';
			await user.save();
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// تحديث دور المستخدم إذا كان من الإيميلات المميزة ولم يكن أدمن بالفعل
		if (ADMIN_EMAILS.includes(user.email.toLowerCase()) && user.role !== 'admin') {
			user.role = 'admin';
			await user.save();
		}

		res.status(200).json({ 
			success: true, 
			user: {
				...user._doc,
				password: undefined
			}
		});
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// دالة مساعدة للتحقق من صلاحية الأدمن
export const isAdminEmail = (email) => {
	return ADMIN_EMAILS.includes(email.toLowerCase());
};