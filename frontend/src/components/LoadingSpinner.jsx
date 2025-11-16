import { motion } from "framer-motion";

const LoadingWithImage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Step 1: Logo Entrance */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 3,
            type: "spring",
            bounce: 0.6
          }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1578932750294-f5075e85a44b?w=150&h=150&fit=crop&crop=center"
            alt="Evento Logo"
            className="w-36 h-36 object-cover rounded-2xl mx-auto shadow-2xl border-4 border-white/10"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Step 2: Text Entrance */}
        <motion.h1
          className="text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          Evento
        </motion.h1>

        {/* Step 3: Tagline Entrance */}
        <motion.p
          className="text-xl text-purple-200/70 mb-12 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          حيث تبدأ الذكريات الجميلة
        </motion.p>

        {/* Step 4: Loading Animation */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
        >
          {/* Rotating Loader */}
          <motion.div
            className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Staggered Dots */}
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-4 bg-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            ))}
          </div>

          {/* Progress Text */}
          <motion.p
            className="text-purple-300/60 text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            نجهز كل شيء من أجلك...
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Background Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default LoadingWithImage;