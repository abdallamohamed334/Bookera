import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const CompanyHomePage = () => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const navigate = useNavigate();

  // تحميل وضع الدارك مود
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // عرض البوب أب بعد 3 ثواني
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => logout();
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // جميع الأقسام
  const allSections = [
    {
      id: "wedding-halls",
      title: "قاعات الأفراح",
      description: "أفضل قاعات الأفراح والمناسبات الفاخرة في مصر",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D",
      icon: "🏛️",
      color: "from-blue-500 to-blue-600",
      stats: "متاح الآن",
      gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      available: true
    },
    {
      id: "photographers",
      title: "المصورين المحترفين",
      description: "أفضل المصورين بتقنيات حديثة لالتقاط الذكريات",
      image: "https://plus.unsplash.com/premium_photo-1674389991678-0836ca77c7f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
      icon: "📸",
      color: "from-purple-500 to-pink-500",
      stats: "متاح الآن",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      available: true
    },
    {
      id: "bridal-dresses",
      title: "فساتين العرائس",
      description: "أجمل تصاميم فساتين الزفاف من أفضل المصممين العالميين",
      image: "https://plus.unsplash.com/premium_photo-1673546785747-8068f85588ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGJyaWRhbC1kcmVzc2VzfGVufDB8fDB8fHww",
      icon: "👰",
      color: "from-pink-500 to-rose-500",
      stats: "قريباً",
      gradient: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      comingSoon: true
    },
    {
      id: "decorations",
      title: "ديكور وزينة",
      description: "تصاميم ديكور مبتكرة تجعل مناسبتك لا تُنسى",
      image: "https://images.unsplash.com/photo-1678514823362-fd5ec94505a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRlY29yYXRpb25zfGVufDB8fDB8fHww",
      icon: "💐",
      color: "from-yellow-500 to-orange-500",
      stats: "قريباً",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      comingSoon: true
    },
  ];

  // آراء العملاء
  const testimonials = [
    {
      name: "أحمد السعيد",
      role: "عريس - سبتمبر 2024",
      comment: "لا أستطيع أن أصف مدى روعة التجربة! القاعة كانت تحفة فنية، والمصور التقط لحظات لن أنساها أبداً. Bookera هي الوجهة الوحيدة لمن يبحث عن الكمال.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "سارة محمد",
      role: "عروس - أغسطس 2024",
      comment: "بعد بحث طويل، اكتشفت Bookera. المصور كان فناناً حقيقياً، والصور جاءت أفضل مما توقعت. أنصح كل عروس وعريس بهذه المنصة الرائعة.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "فاطمة الناصر",
      role: "والدة عروس - أكتوبر 2024",
      comment: "التجربة كانت سلسة من البداية للنهاية. فريق Bookera متابع لكل التفاصيل. أنصح كل الأمهات بهذه المنصة لتنظيم حفلات بناتهم.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  // ميزات المنصة
  const platformFeatures = [
    {
      icon: "⚡",
      title: "حجز فوري",
      description: "احجز خلال دقائق بدون معاملات ورقية"
    },
    {
      icon: "🛡️",
      title: "ضمان الجودة",
      description: "كل الخدمات مختارة بعناية"
    },
    {
      icon: "🎯",
      title: "توصيات ذكية",
      description: "اقتراحات مخصصة بناءً على احتياجاتك"
    },
    {
      icon: "📱",
      title: "تطبيق متكامل",
      description: "ادار حجزك من أي مكان"
    },
    {
      icon: "💬",
      title: "دعم 24/7",
      description: "فريق دعم متاح على مدار الساعة"
    }
  ];

  // خطوات العمل
  const howItWorks = [
    {
      step: "1",
      title: "تصفح",
      description: "تصفح أفضل القاعات والمصورين",
      icon: "🔍"
    },
    {
      step: "2",
      title: "اختر",
      description: "اختر ما يناسب ميزانيتك وتوقعاتك",
      icon: "✅"
    },
    {
      step: "3",
      title: "احجز",
      description: "اكمل الحجز بسهولة وأمان",
      icon: "📅"
    },
    {
      step: "4",
      title: "استمتع",
      description: "استمتع بمناسبتك المثالية",
      icon: "🎉"
    }
  ];

  // معرض الصور
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "قاعات"
    },
    {
      url: "https://plus.unsplash.com/premium_photo-1682097066897-209d0d9e9ae5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
      category: "تصوير"
    },
    {
      url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "زفاف"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "مناسبات"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Navigation - تم تحسينه */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - محاذاة مع مسافات أفضل */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="cursor-pointer flex items-center space-x-4 space-x-reverse"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dwocg88vs/image/upload/v1765294969/Red_Black_Typography_Nine_Brand_Logo_q0qhfd.png"
                    alt="Bookera Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs shadow">
                  B
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">Bookera</span>
                
              </div>
            </motion.div>

            {/* Actions - تم تحسين المحاذاة */}
            <div className="flex items-center space-x-6 space-x-reverse">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <span className="text-xl">🌙</span>
                ) : (
                  <span className="text-xl">☀️</span>
                )}
              </motion.button>

              {user ? (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="text-right hidden md:block">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">مرحباً بك</div>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 dark:border-blue-400 shadow">
                        <img 
                          src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                  </div>
                  <motion.button 
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium shadow hover:shadow-md transition-all"
                  >
                    تسجيل الخروج
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <motion.button 
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    تسجيل الدخول
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium shadow hover:shadow-md transition-all"
                  >
                    إنشاء حساب
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Popup للعروض */}
      {showOfferPopup && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg mb-1">🎉 عرض خاص!</h3>
                  <p className="text-blue-100 text-sm">عروض حصرية على قاعات الأفراح</p>
                </div>
                <button
                  onClick={() => setShowOfferPopup(false)}
                  className="text-white/80 hover:text-white text-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="mb-4 text-sm">
                احصل على <span className="font-bold">خصم 20%</span> على حجز قاعة فاخرة لمدة محدودة
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigate('/wedding-halls');
                    setShowOfferPopup(false);
                  }}
                  className="flex-1 bg-white text-blue-600 py-2.5 rounded-lg font-medium text-sm shadow hover:shadow-md transition-all"
                >
                  استعرض العروض
                </motion.button>
                <button
                  onClick={() => setShowOfferPopup(false)}
                  className="px-4 py-2.5 text-white/80 hover:text-white text-sm transition-colors"
                >
                  لاحقاً
                </button>
              </div>
            </div>
            <div className="bg-black/10 px-5 py-2.5 text-xs text-white/70">
              العرض ساري حتى نهاية الشهر
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight"
            >
              رحلتك نحو
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mt-2">
                مناسبة لا تُنسى تبدأ من هنا
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Bookera توفر لك كل ما تحتاجه لتنظيم مناسبتك الكاملة. ابدأ بحجز قاعة فاخرة أو مصور محترف، واستعد لخدمات جديدة قريباً!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              >
                <span>✨</span>
                استكشف خدماتنا
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-500 text-blue-500 dark:text-blue-400 rounded-xl font-semibold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                onClick={() => navigate('/join-us')}
              >
                انضم الينا واعرض خدماتك
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1K+</div>
              <div className="text-blue-100">عميل راضي</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9</div>
              <div className="text-blue-100">تقييم عام</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1</div>
              <div className="text-blue-100">مدينة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-100">رضا عملاء</div>
            </div>
          </div>
        </div>
      </div>

      {/* جميع الخدمات */}
      <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              اكتشف عالم Bookera
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              نبدأ برحلة تنظيم مناسبتك مع قاعات فاخرة ومصورين محترفين، ونستعد لإطلاق المزيد من الخدمات قريباً
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`${section.gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 relative group`}
              >
                {/* Badge */}
                <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-semibold shadow ${
                  section.available 
                    ? 'bg-green-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {section.available ? 'متاح الآن' : 'قريباً'}
                </div>

                {/* Card Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                      {section.icon}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {section.description}
                  </p>
                  <motion.button
                    onClick={() => section.available ? navigate(`/${section.id}`) : null}
                    whileHover={{ scale: section.available ? 1.05 : 1 }}
                    whileTap={{ scale: section.available ? 0.95 : 1 }}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${
                      section.available
                        ? `bg-gradient-to-r ${section.color} text-white shadow hover:shadow-md cursor-pointer`
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {section.available ? 'احجز الآن' : 'قريباً'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ميزات المنصة */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              لماذا تختار Bookera؟
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              نقدم تجربة حجز استثنائية تجعل تنظيم مناسبتك أمراً سهلاً وممتعاً
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* كيف تعمل */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              خطوات سهلة لحجز مثالي
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* آراء العملاء */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              يثق بنا الآلاف من العملاء
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              انضم إلى مجتمعنا المتنامي من العملاء والشركاء الراضين
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4 space-x-reverse mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* معرض الصور */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              لحظات من سعادتنا
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              نشارككم بعض اللحظات الجميلة التي ساعدنا في تنظيمها
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
              >
                <img 
                  src={image.url} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-medium">{image.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            هل أنت مستعد لبدء رحلتك؟
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-8"
          >
            انضم إلى آلاف العملاء الذين اختاروا Bookera لمناسباتهم المميزة
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              onClick={() => navigate('/join-us')}
            >
              <span>🚀</span>
              انضم الينا واظهر عملك
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 flex items-center justify-center gap-2"
              onClick={() => navigate('/contact')}
            >
              <span>💬</span>
              تواصل مع مستشار
            </motion.button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-200 mt-8 text-sm"
          >
            تجربة مجانية • لا حاجة لبطاقة ائتمان • دعم فني متواصل
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&auto=format&fit=crop&q=60"
                    alt="Bookera Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold block">Bookera</span>
                  <span className="text-gray-400 text-sm">مناسبتك، مسؤوليتنا</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                نحن هنا لنجعل مناسبتك تجربة لا تُنسى بكل تفاصيلها، من الفكرة إلى التنفيذ.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">الخدمات المتاحة</h4>
              <div className="space-y-2 text-gray-400">
                {allSections.filter(s => s.available).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => navigate(`/${section.id}`)}
                    className="block hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className={`w-2 h-2 rounded-full ${section.id === 'wedding-halls' ? 'bg-green-500' : 'bg-purple-500'}`}></span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">الخدمات القادمة</h4>
              <div className="space-y-2 text-gray-400">
                {allSections.filter(s => s.comingSoon).slice(0, 4).map((section) => (
                  <div key={section.id} className="text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    {section.title}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">تواصل معنا</h4>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  tallaey445@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  +201040652783
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  مصر 
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Bookera. جميع الحقوق محفوظة.</p>
            <p className="text-gray-500 text-xs mt-2">نحن نعمل باستمرار لتطوير خدماتنا وتحسين تجربتك</p>
          </div>
        </div>
      </footer>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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

export default CompanyHomePage;