import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // تحميل المفضلات من localStorage
    const savedFavorites = localStorage.getItem('userFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [user, navigate]);

  const removeFromFavorites = (itemId) => {
    const updatedFavorites = favorites.filter(item => item.id !== itemId);
    setFavorites(updatedFavorites);
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.setItem('userFavorites', JSON.stringify([]));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-filter backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>رجوع</span>
            </motion.button>
            
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              المفضلة
            </motion.h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            قائمة مفضلاتك
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            الأماكن والخدمات التي أضفتها إلى المفضلة
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
              قائمة المفضلة فارغة
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              لم تقم بإضافة أي عناصر إلى المفضلة بعد
            </p>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              استعرض الخدمات
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Header with Stats and Clear Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="text-2xl">❤️</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {favorites.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    عنصر في المفضلة
                  </div>
                </div>
              </div>

              <motion.button
                onClick={clearAllFavorites}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>حذف الكل</span>
              </motion.button>
            </motion.div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-4xl">{item.icon}</div>
                      <motion.button
                        onClick={() => removeFromFavorites(item.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className="text-2xl text-red-500 hover:text-red-600 transition-colors"
                      >
                        ❤️
                      </motion.button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className={`w-12 h-1 bg-gradient-to-r ${item.color} rounded-full`}></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.addedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <motion.button
                        onClick={() => navigate(item.route)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-center"
                      >
                        عرض التفاصيل
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Categories Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                ملخص المفضلة حسب التصنيف
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from(new Set(favorites.map(item => item.title))).map((category, index) => {
                  const count = favorites.filter(item => item.title === category).length;
                  return (
                    <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="text-2xl mb-2">
                        {favorites.find(item => item.title === category)?.icon}
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-white">{category}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{count} عنصر</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;