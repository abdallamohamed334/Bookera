import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("كلمات المرور غير متطابقة");
			return;
		}

		if (password.length < 6) {
			toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
			return;
		}

		try {
			await resetPassword(token, password);
			setIsSubmitted(true);
			
			toast.success("تم تغيير كلمة المرور بنجاح!");
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "حدث خطأ في تغيير كلمة المرور");
		}
	};

	if (isSubmitted) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<div className="max-w-md w-full">
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
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-center"
					>
						<div className="p-8">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
								className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
							>
								<CheckCircle className="h-10 w-10 text-green-600" />
							</motion.div>
							
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								تم تغيير كلمة المرور بنجاح! 🎉
							</h2>
							
							<p className="text-gray-600 mb-6">
								تم تغيير كلمة المرور الخاصة بحسابك بنجاح. 
								سيتم تحويلك تلقائياً لصفحة تسجيل الدخول خلال ثوانٍ.
							</p>

							<div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
								<p className="text-sm text-green-700">
									<strong>مهم:</strong> احفظ كلمة المرور الجديدة في مكان آمن.
								</p>
							</div>

							<Link 
								to="/login"
								className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200"
							>
								تسجيل الدخول الآن
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
		);
	}

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
						تعيين كلمة مرور جديدة
					</h1>
					<p className="text-gray-600 text-lg">
						اختر كلمة مرور قوية لحسابك
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
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Lock className="h-8 w-8 text-blue-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								كلمة المرور الجديدة
							</h2>
							<p className="text-gray-600 text-sm">
								ادخل كلمة المرور الجديدة وقم بتأكيدها
							</p>
						</div>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
								<p className="text-red-700 text-sm text-center">{error}</p>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<Input
								icon={Lock}
								type="password"
								placeholder="كلمة المرور الجديدة"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								dir="rtl"
								minLength={6}
							/>

							<Input
								icon={Lock}
								type="password"
								placeholder="تأكيد كلمة المرور"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								dir="rtl"
								minLength={6}
							/>

							<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
								<p className="text-sm text-blue-700 text-center">
									<strong>نصيحة:</strong> استخدم مزيج من الأحرف والأرقام والرموز
								</p>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center gap-2"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										جاري التعيين...
									</>
								) : (
									<>
										<Lock className="h-5 w-5" />
										تعيين كلمة المرور
									</>
								)}
							</motion.button>
						</form>
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
			</div>
		</div>
	);
};

export default ResetPasswordPage;