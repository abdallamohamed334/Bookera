// في ملف components/PasswordStrengthMeter.jsx
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const PasswordStrengthMeter = ({ password }) => {
	const getPasswordStrength = (pass) => {
		let score = 0;
		
		// طول كلمة المرور
		if (pass.length >= 8) score += 1;
		if (pass.length >= 12) score += 1;
		
		// أحرف متنوعة
		if (/[A-Z]/.test(pass)) score += 1;
		if (/[a-z]/.test(pass)) score += 1;
		if (/[0-9]/.test(pass)) score += 1;
		if (/[^A-Za-z0-9]/.test(pass)) score += 1;
		
		return score;
	};
	
	const strength = getPasswordStrength(password);
	const strengthPercentage = (strength / 6) * 100;
	
	const getStrengthColor = () => {
		if (strength <= 2) return "bg-red-500";
		if (strength <= 4) return "bg-yellow-500";
		return "bg-green-500";
	};
	
	const getStrengthText = () => {
		if (strength <= 2) return "ضعيفة";
		if (strength <= 4) return "متوسطة";
		return "قوية";
	};
	
	const getStrengthTextColor = () => {
		if (strength <= 2) return "text-red-600";
		if (strength <= 4) return "text-yellow-600";
		return "text-green-600";
	};
	
	const checks = [
		{ label: "8 أحرف على الأقل", met: password.length >= 8 },
		{ label: "حرف كبير وصغير", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
		{ label: "رقم واحد على الأقل", met: /[0-9]/.test(password) },
		{ label: "رمز خاص", met: /[^A-Za-z0-9]/.test(password) },
	];
	
	return (
		<div className="space-y-3">
			<div className="flex justify-between items-center">
				<span className="text-sm font-medium text-gray-700">قوة كلمة المرور:</span>
				<span className={`text-sm font-bold ${getStrengthTextColor()}`}>
					{getStrengthText()}
				</span>
			</div>
			
			<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${strengthPercentage}%` }}
					transition={{ duration: 0.5, type: "spring" }}
					className={`h-full ${getStrengthColor()} rounded-full`}
				/>
			</div>
			
			<div className="grid grid-cols-2 gap-2 mt-3">
				{checks.map((check, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className={`flex items-center gap-2 text-xs ${check.met ? 'text-green-600' : 'text-gray-500'}`}
					>
						{check.met ? (
							<Check className="w-3 h-3" />
						) : (
							<X className="w-3 h-3" />
						)}
						{check.label}
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default PasswordStrengthMeter;