import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, Loader, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail, user } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
			
			// Check if all fields are filled after paste
			if (newCode.every((digit) => digit !== "")) {
				setIsSubmitting(true);
				setTimeout(() => {
					handleSubmit();
				}, 100);
			}
		} else {
			// Allow only numbers
			if (!/^\d*$/.test(value)) return;
			
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}

			// Check if all fields are filled and this is the last input
			if (value && index === 5 && newCode.every((digit) => digit !== "")) {
				setIsSubmitting(true);
				setTimeout(() => {
					handleSubmit();
				}, 100);
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
		
		// Allow navigation with arrow keys
		if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1].focus();
		}
		if (e.key === "ArrowRight" && index < 5) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		if (e) e.preventDefault();
		
		const verificationCode = code.join("");
		
		if (verificationCode.length !== 6) {
			toast.error("الرجاء إدخال الرمز المكون من 6 أرقام");
			setIsSubmitting(false);
			return;
		}

		try {
			await verifyEmail(verificationCode);
			toast.success("تم التحقق من البريد الإلكتروني بنجاح");
			navigate("/");
		} catch (error) {
			console.log(error);
			// Reset code on error
			setCode(["", "", "", "", "", ""]);
			inputRefs.current[0].focus();
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResendCode = async () => {
		setTimer(60);
		setCanResend(false);
		// Here you would call your resend verification code API
		toast.success("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني");
	};

	// Timer for resend code
	useEffect(() => {
		if (timer > 0) {
			const countdown = setTimeout(() => setTimer(timer - 1), 1000);
			return () => clearTimeout(countdown);
		} else {
			setCanResend(true);
		}
	}, [timer]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			{/* Floating Background Shapes */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
				<div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative z-10'
			>
				{/* Header Section */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
					<Link 
						to="/login" 
						className="absolute right-6 top-6 text-white hover:text-blue-200 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					
					<motion.div
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
						className="flex items-center justify-center mb-4"
					>
						<div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
							<Mail className="w-8 h-8 text-white" />
						</div>
					</motion.div>
					
					<h1 className="text-2xl font-bold text-white mb-2">
						التحقق من البريد الإلكتروني
					</h1>
					<p className="text-blue-100 text-sm">
						أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني
					</p>
				</div>

				<div className='p-8'>
					{/* Email Info */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="text-center mb-8"
					>
						<p className="text-gray-600 mb-2">تم إرسال رمز التحقق إلى:</p>
						<p className="text-blue-600 font-semibold text-lg">{user?.email}</p>
					</motion.div>

					<form onSubmit={handleSubmit} className='space-y-8'>
						{/* Code Inputs */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="space-y-4"
						>
							<label className="block text-sm font-medium text-gray-700 text-center">
								أدخل رمز التحقق
							</label>
							
							<div className='flex justify-center gap-3'>
								{code.map((digit, index) => (
									<motion.input
										key={index}
										ref={(el) => (inputRefs.current[index] = el)}
										type='text'
										inputMode='numeric'
										maxLength='1'
										value={digit}
										onChange={(e) => handleChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										onFocus={(e) => e.target.select()}
										className='w-14 h-14 text-center text-2xl font-bold bg-gray-50 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200'
										whileFocus={{ scale: 1.05 }}
										disabled={isLoading || isSubmitting}
									/>
								))}
							</div>
						</motion.div>

						{/* Error Message */}
						{error && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-red-50 border border-red-200 rounded-lg p-3"
							>
								<p className='text-red-700 text-sm text-center font-medium'>{error}</p>
							</motion.div>
						)}

						{/* Submit Button */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type='submit'
								disabled={isLoading || isSubmitting || code.some((digit) => !digit)}
								className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{(isLoading || isSubmitting) ? (
									<>
										<Loader className='w-5 h-5 animate-spin' />
										جاري التحقق...
									</>
								) : (
									"تحقق من البريد الإلكتروني"
								)}
							</motion.button>
						</motion.div>
					</form>

					{/* Resend Code Section */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7 }}
						className="mt-8 pt-6 border-t border-gray-200 text-center"
					>
						<p className="text-gray-600 text-sm mb-3">
							لم تستلم الرمز؟
						</p>
						
						{canResend ? (
							<button
								onClick={handleResendCode}
								className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
							>
								إعادة إرسال الرمز
							</button>
						) : (
							<p className="text-gray-500 text-sm">
								يمكنك إعادة الإرسال خلال {timer} ثانية
							</p>
						)}
					</motion.div>

					{/* Help Text */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="text-center mt-6"
					>
						<p className="text-xs text-gray-500">
							تأكد من فحص مجلد البريد العشوائي (Spam) إذا لم تجد الرسالة
						</p>
					</motion.div>
				</div>

				{/* Footer */}
				<div className='px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-center'>
					<p className='text-sm text-gray-600'>
						تواجه مشكلة؟{" "}
						<Link 
							to="/contact" 
							className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors'
						>
							اتصل بالدعم
						</Link>
					</p>
				</div>
			</motion.div>

			{/* Additional Styling for Animations */}
			<style jsx>{`
				@keyframes blob {
					0% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
					100% { transform: translate(0px, 0px) scale(1); }
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	);
};

export default EmailVerificationPage;