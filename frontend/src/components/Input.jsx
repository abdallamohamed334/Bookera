import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
	icon: Icon, 
	type = 'text', 
	placeholder, 
	value, 
	onChange, 
	className = '',
	...props 
}) => {
	return (
		<motion.div
			whileFocus={{ scale: 1.02 }}
			className={`relative flex items-center mb-4 ${className}`}
		>
			{Icon && (
				<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
					<Icon className="w-5 h-5" />
				</div>
			)}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className={`
					w-full px-4 py-3 pr-12 
					border-2 border-gray-200 
					rounded-lg 
					bg-white
					text-gray-800
					placeholder-gray-500
					focus:outline-none 
					focus:border-blue-500 
					focus:ring-2 
					focus:ring-blue-200 
					focus:ring-opacity-50
					transition-all 
					duration-200
					text-right
					direction: rtl
				`}
				{...props}
			/>
		</motion.div>
	);
};

export default Input;