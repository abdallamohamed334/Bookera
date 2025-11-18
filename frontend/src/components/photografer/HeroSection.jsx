import { motion } from "framer-motion";

const HeroSection = () => {
  const scrollToPhotographers = () => {
    document.getElementById('photographers-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          المصورين المحترفين في مصر
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
        >
          اكتشف أفضل المصورين المحترفين في كل محافظات مصر لتوثيق مناسباتك
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToPhotographers}
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
        >
          شوف المصورين
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;