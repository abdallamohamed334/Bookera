import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<Link 
						to="/"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
					>
						<ArrowLeft className="h-4 w-4 ml-1" />
						العودة للرئيسية
					</Link>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
						نسيت كلمة المرور؟
					</h1>
					<p className="text-gray-600 text-lg">
						سنساعدك في استعادة حسابك
					</p>
				</motion.div>

				{/* Form Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
				>
					<div className="p-8">
						{!isSubmitted ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="text-center mb-2">
									<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Mail className="h-8 w-8 text-blue-600" />
									</div>
									<h2 className="text-2xl font-bold text-gray-900 mb-2">
										إعادة تعيين كلمة المرور
									</h2>
									<p className="text-gray-600 text-sm">
										ادخل بريدك الإلكتروني وهنبعثلك رابط تعيين كلمة مرور جديدة
									</p>
								</div>

								<Input
									icon={Mail}
									type="email"
									placeholder="البريد الإلكتروني"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									dir="rtl"
								/>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center gap-2"
									type="submit"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<Loader className="h-5 w-5 animate-spin" />
											جاري الإرسال...
										</>
									) : (
										<>
											<Mail className="h-5 w-5" />
											إرسال رابط التعيين
										</>
									)}
								</motion.button>
							</form>
						) : (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center space-y-6"
							>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 500, damping: 30 }}
									className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
								>
									<Mail className="h-10 w-10 text-green-600" />
								</motion.div>
								
								<div>
									<h3 className="text-2xl font-bold text-gray-900 mb-3">
										تم إرسال الرابط! ✅
									</h3>
									<p className="text-gray-600 leading-relaxed">
										إذا كان فيه حساب مرتبط بـ 
										<span className="font-semibold text-blue-600"> {email}</span>، 
										هتستقبل رابط إعادة تعيين كلمة المرور في بريدك الإلكتروني قريب.
									</p>
								</div>

								<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
									<p className="text-sm text-blue-700">
										<strong>نصيحة:</strong> اتأكد من مجلد الـ Spam إذا مالقيتش الإيميل في صندوق الوارد.
									</p>
								</div>
							</motion.div>
						)}
					</div>

					{/* Footer */}
					<div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
						<Link 
							to="/login" 
							className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							العودة لتسجيل الدخول
						</Link>
					</div>
				</motion.div>

				{/* Additional Help */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-center mt-6"
				>
					<p className="text-gray-500 text-sm">
					 need help?{" "}
						<Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
							اتصل بالدعم
						</Link>
					</p>
				</motion.div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;