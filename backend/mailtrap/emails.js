import { Resend } from "resend";
import dotenv from "dotenv";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

dotenv.config();

// ✅ استخدم التوكن من متغير البيئة أو ضع المفتاح مباشرة هنا
const resend = new Resend(process.env.RESEND_API_KEY || "re_3Z7zDfvW_AdeHYec2b1CozA2dgjpDXhCr");

// البريد المرسل منه (يفضل دومين تم التحقق منه في Resend)
const sender = "onboarding@resend.dev";

/**
 * إرسال إيميل التفعيل (Verification)
 */
export const sendVerificationEmail = async (email, verificationToken) => {
	try {
		const response = await resend.emails.send({
			from: sender,
			to: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		});

		console.log("✅ Verification email sent:", response);
	} catch (error) {
		console.error("❌ Error sending verification email:", error.message || error);
		throw new Error(`Error sending verification email: ${error.message}`);
	}
};

/**
 * إرسال إيميل الترحيب (Welcome)
 */
export const sendWelcomeEmail = async (email, name) => {
	try {
		const html = `
			<!DOCTYPE html>
			<html dir="rtl" lang="ar">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>أهلاً وسهلاً بك في Bookera</title>
				<style>
					@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
					
					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
					}
					
					body {
						font-family: 'Cairo', sans-serif;
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						margin: 0;
						padding: 20px;
					}
					
					.container {
						max-width: 600px;
						margin: 0 auto;
						background: white;
						border-radius: 20px;
						overflow: hidden;
						box-shadow: 0 20px 40px rgba(0,0,0,0.1);
					}
					
					.header {
						background: linear-gradient(135deg, #4F46E5 0%, #7E22CE 100%);
						padding: 40px 30px;
						text-align: center;
						color: white;
					}
					
					.logo {
						font-size: 48px;
						margin-bottom: 15px;
					}
					
					.title {
						font-size: 32px;
						font-weight: 700;
						margin-bottom: 10px;
					}
					
					.subtitle {
						font-size: 18px;
						opacity: 0.9;
						font-weight: 300;
					}
					
					.content {
						padding: 40px 30px;
					}
					
					.welcome-text {
						font-size: 24px;
						color: #333;
						text-align: center;
						margin-bottom: 30px;
						line-height: 1.6;
					}
					
					.highlight {
						color: #4F46E5;
						font-weight: 700;
					}
					
					.features {
						display: grid;
						grid-template-columns: repeat(2, 1fr);
						gap: 20px;
						margin: 30px 0;
					}
					
					.feature {
						text-align: center;
						padding: 20px;
						background: #f8fafc;
						border-radius: 12px;
						border: 2px solid #e2e8f0;
						transition: all 0.3s ease;
					}
					
					.feature:hover {
						transform: translateY(-5px);
						border-color: #4F46E5;
						box-shadow: 0 10px 25px rgba(79, 70, 229, 0.15);
					}
					
					.feature-icon {
						font-size: 32px;
						margin-bottom: 10px;
					}
					
					.feature-title {
						font-weight: 600;
						color: #4F46E5;
						margin-bottom: 8px;
					}
					
					.feature-desc {
						font-size: 14px;
						color: #666;
						line-height: 1.4;
					}
					
					.cta-section {
						text-align: center;
						margin: 40px 0;
					}
					
					.cta-button {
						display: inline-block;
						background: linear-gradient(135deg, #4F46E5, #7E22CE);
						color: white;
						padding: 16px 40px;
						text-decoration: none;
						border-radius: 50px;
						font-size: 18px;
						font-weight: 600;
						box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
						transition: all 0.3s ease;
					}
					
					.cta-button:hover {
						transform: translateY(-3px);
						box-shadow: 0 15px 40px rgba(79, 70, 229, 0.4);
					}
					
					.footer {
						background: #1e293b;
						color: white;
						padding: 30px;
						text-align: center;
					}
					
					.social-links {
						display: flex;
						justify-content: center;
						gap: 20px;
						margin: 20px 0;
					}
					
					.social-icon {
						width: 40px;
						height: 40px;
						background: #4F46E5;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						text-decoration: none;
						font-weight: bold;
						transition: all 0.3s ease;
					}
					
					.social-icon:hover {
						background: #7E22CE;
						transform: scale(1.1);
					}
					
					.footer-text {
						color: #94a3b8;
						font-size: 14px;
						margin-top: 20px;
						line-height: 1.6;
					}
					
					.heart {
						color: #ef4444;
						animation: pulse 1.5s infinite;
					}
					
					@keyframes pulse {
						0% { transform: scale(1); }
						50% { transform: scale(1.1); }
						100% { transform: scale(1); }
					}
					
					@media (max-width: 600px) {
						.features {
							grid-template-columns: 1fr;
						}
						
						.content {
							padding: 30px 20px;
						}
					}
				</style>
			</head>
			<body>
				<div class="container">
					<!-- Header -->
					<div class="header">
						<div class="logo">🎉</div>
						<h1 class="title">أهلاً وسهلاً بك!</h1>
						<p class="subtitle">${name}، نحن سعداء بانضمامك إلينا</p>
					</div>
					
					<!-- Content -->
					<div class="content">
						<p class="welcome-text">
							مرحباً <span class="highlight">${name}</span>! <br>
							يشرفنا انضمامك إلى <span class="highlight">Bookera</span>
						</p>
						
						<div class="features">
							<div class="feature">
								<div class="feature-icon">💒</div>
								<h3 class="feature-title">قاعات أفراح</h3>
								<p class="feature-desc">احجز أفضل قاعات الأفراح لمُناسبتك</p>
							</div>
							
							<div class="feature">
								<div class="feature-icon">🎤</div>
								<h3 class="feature-title">قاعات مؤتمرات</h3>
								<p class="feature-desc">مكان احترافي لفعالياتك واجتماعاتك</p>
							</div>
							
							<div class="feature">
								<div class="feature-icon">📸</div>
								<h3 class="feature-title">مصورين محترفين</h3>
								<p class="feature-desc">وثق لحظاتك مع أفضل المصورين</p>
							</div>
							
							<div class="feature">
								<div class="feature-icon">⚡</div>
								<h3 class="feature-title">حجز فوري</h3>
								<p class="feature-desc">احجز في دقائق بدون تعقيد</p>
							</div>
						</div>
						
						<div class="cta-section">
							<a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">
								🚀 ابدأ رحلتك الآن
							</a>
						</div>
					</div>
					
					<!-- Footer -->
					<div class="footer">
						<div class="social-links">
							<a href="#" class="social-icon">ف</a>
							<a href="#" class="social-icon">ت</a>
							<a href="#" class="social-icon">ي</a>
							<a href="#" class="social-icon">إن</a>
						</div>
						
						<p class="footer-text">
							صنع بكل <span class="heart">❤️</span> من فريق Bookera<br>
							للأسئلة والاستفسارات: support@booking-platform.com<br>
							© 2024 Bookera. جميع الحقوق محفوظة.
						</p>
					</div>
				</div>
			</body>
			</html>
		`;

		const response = await resend.emails.send({
			from: sender,
			to: email,
			subject: `🎊 أهلاً وسهلاً بك ${name}! - Bookera`,
			html: html,
		});

		console.log("✅ إيميل ترحيب مذهل اتبعت لـ:", email);
		return response;
	} catch (error) {
		console.error("❌ Error sending welcome email:", error.message || error);
		throw new Error(`Error sending welcome email: ${error.message}`);
	}
};
/**
 * إرسال رابط إعادة تعيين كلمة المرور
 */
export const sendPasswordResetEmail = async (email, resetURL) => {
	try {
		const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

		const response = await resend.emails.send({
			from: sender,
			to: email,
			subject: "Reset your password",
			html,
		});

		console.log("✅ Password reset email sent:", response);
	} catch (error) {
		console.error("❌ Error sending password reset email:", error.message || error);
		throw new Error(`Error sending password reset email: ${error.message}`);
	}
};

/**
 * تأكيد نجاح إعادة تعيين كلمة المرور
 */
export const sendResetSuccessEmail = async (email) => {
	try {
		const response = await resend.emails.send({
			from: sender,
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		});

		console.log("✅ Password reset success email sent:", response);
	} catch (error) {
		console.error("❌ Error sending password reset success email:", error.message || error);
		throw new Error(`Error sending password reset success email: ${error.message}`);
	}
};
