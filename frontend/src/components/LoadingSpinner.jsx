import { motion } from "framer-motion";

const LoadingWithImage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1,
            type: "spring",
            bounce: 0.5
          }}
        >
        <motion.img
  src="/Gemini_Generated_Image_bmm6u9bmm6u9bmm6.png"
  alt="EventUp"
  className="w-24 h-24 object-cover rounded-2xl mx-auto shadow-lg border border-gray-200"
  animate={{
    y: [0, -10, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  onError={(e) => {
    console.error('Failed to load logo image');
    // يمكنك إضافة بديل هنا إذا فشل تحميل الصورة
  }}
/>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Evento
        </motion.h1>

        {/* Arabic Text */}
        <motion.p
          className="text-gray-600 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          حيث تبدأ الذكريات الجميلة
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {/* Big Rotating Loader */}
          <motion.div
            className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Loading Text */}
          <motion.p
            className="text-gray-700 font-medium text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            جاري التحميل...
          </motion.p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Simple Background Animation */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default LoadingWithImage;