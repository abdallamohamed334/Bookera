import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};

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
					<motion.h1 
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
						className="text-3xl font-bold text-white mb-2"
					>
						إنشاء حساب جديد
					</motion.h1>
					<p className="text-blue-100">
						انضم إلينا وابدأ رحلتك مع منصة الحجوزات
					</p>
				</div>

				<div className='p-8'>
					<form onSubmit={handleSignUp} className="space-y-6">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Input
								icon={User}
								type='text'
								placeholder='الاسم الكامل'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="bg-gray-50 border-gray-200 focus:border-blue-500"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Input
								icon={Mail}
								type='email'
								placeholder='البريد الإلكتروني'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-gray-50 border-gray-200 focus:border-blue-500"
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
						>
							<Input
								icon={Lock}
								type='password'
								placeholder='كلمة المرور'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-gray-50 border-gray-200 focus:border-blue-500"
							/>
						</motion.div>

						{/* Password Strength Meter */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<PasswordStrengthMeter password={password} />
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

						{/* Terms and Conditions */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="text-center"
						>
							<p className="text-xs text-gray-600">
								بإنشاء حساب، فإنك توافق على{" "}
								<Link to="/terms" className="text-blue-600 hover:underline">
									شروط الخدمة
								</Link>{" "}
								و{" "}
								<Link to="/privacy" className="text-blue-600 hover:underline">
									سياسة الخصوصية
								</Link>
							</p>
						</motion.div>

						{/* Submit Button */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
						>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
								type='submit'
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader className='w-5 h-5 animate-spin' />
										جاري إنشاء الحساب...
									</>
								) : (
									<>
										<User className="w-5 h-5" />
										إنشاء حساب
									</>
								)}
							</motion.button>
						</motion.div>
					</form>

					{/* Social Sign Up Options */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="mt-8 pt-6 border-t border-gray-200"
					>
						<div className="text-center">
							<p className="text-gray-600 text-sm mb-4">أو سجل باستخدام</p>
							<div className="flex justify-center gap-4">
								
								<button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
									<span className="text-gray-700 font-bold text-sm">G</span>
								</button>
								
							</div>
						</div>
					</motion.div>
				</div>

				{/* Footer */}
				<div className='px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-center'>
					<p className='text-sm text-gray-600'>
						لديك حساب بالفعل؟{" "}
						<Link 
							to={"/login"} 
							className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors'
						>
							سجل الدخول
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

export default SignUpPage;