import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const CompanyHomePage = () => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // تتبع التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // عرض البوب أب بعد 3 ثواني
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => logout();
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // جميع الأقسام - محدثة بتصاميم مبهرة
  const allSections = [
    {
      id: "wedding-halls",
      title: "قاعات الأفراح",
      description: "استكشف أجمل قاعات الأفراح الفاخرة بتصاميم عالمية",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format&fit=crop&q=80",
      icon: "👑",
      color: "from-purple-600 to-pink-600",
      glowColor: "rgba(168, 85, 247, 0.4)",
      stats: "50+ قاعة",
      gradient: "bg-gradient-to-br from-purple-50 via-white to-pink-50",
      available: true,
      features: ["تصميم فاخر", "سعات مختلفة", "خدمات متكاملة"]
    },
    {
      id: "photographers",
      title: "المصورين المحترفين",
      description: "التقط ذكرياتك مع أفضل المصورين المحترفين",
      image: "https://plus.unsplash.com/premium_photo-1674389991678-0836ca77c7f7?w=800&auto=format&fit=crop&q=80",
      icon: "📷",
      color: "from-blue-600 to-cyan-600",
      glowColor: "rgba(59, 130, 246, 0.4)",
      stats: "30+ مصور",
      gradient: "bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      available: true,
      features: ["تكنولوجيا حديثة", "تصوير إبداعي", "تعديل احترافي"]
    },
    {
      id: "bridal-dresses",
      title: "فساتين العرائس",
      description: "تصاميم عالمية من كبار مصممي فساتين الزفاف",
      image: "https://plus.unsplash.com/premium_photo-1673546785747-8068f85588ad?w=800&auto=format&fit=crop&q=80",
      icon: "👰",
      color: "from-pink-600 to-rose-600",
      glowColor: "rgba(244, 63, 94, 0.4)",
      stats: "قريباً",
      gradient: "bg-gradient-to-br from-pink-50 via-white to-rose-50",
      comingSoon: true,
      features: ["تصميمات عالمية", "خياطة فاخرة", "تخصيص كامل"]
    },
    {
      id: "decorations",
      title: "ديكور وزينة",
      description: "تزيين مناسبتك بتصاميم مبتكرة وخلابة",
      image: "https://images.unsplash.com/photo-1678514823362-fd5ec94505a2?w=800&auto=format&fit=crop&q=80",
      icon: "✨",
      color: "from-yellow-500 to-orange-500",
      glowColor: "rgba(245, 158, 11, 0.4)",
      stats: "قريباً",
      gradient: "bg-gradient-to-br from-yellow-50 via-white to-orange-50",
      comingSoon: true,
      features: ["تصميم مخصص", "زينة فاخرة", "إضاءة احترافية"]
    },
  ];

  // آراء العملاء
  const testimonials = [
    {
      name: "أحمد السعيد",
      role: "عريس - سبتمبر 2024",
      comment: "لا أستطيع أن أصف مدى روعة التجربة! القاعة كانت تحفة فنية، والمصور التقط لحظات لن أنساها أبداً.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "سارة محمد",
      role: "عروس - أغسطس 2024",
      comment: "بعد بحث طويل، اكتشفت Bookera. المصور كان فناناً حقيقياً، والصور جاءت أفضل مما توقعت.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&auto=format&fit=crop&q=80",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "محمد علي",
      role: "والد عريس - أكتوبر 2024",
      comment: "الخدمة كانت استثنائية من البداية للنهاية. التنسيق كان مثاليًا والتنظيم رائع.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // ميزات المنصة
  const platformFeatures = [
    {
      icon: "⚡",
      title: "حجز فوري",
      description: "احجز خلال دقائق بدون معاملات ورقية",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: "🛡️",
      title: "ضمان الجودة",
      description: "كل الخدمات مختارة بعناية وجودة مضمونة",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: "🎯",
      title: "توصيات ذكية",
      description: "اقتراحات مخصصة بناءً على احتياجاتك",
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: "💰",
      title: "أسعار تنافسية",
      description: "أفضل الأسعار مع خصومات حصرية",
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: "📱",
      title: "تطبيق متكامل",
      description: "ادار حجزك من أي مكان بسهولة",
      color: "from-red-400 to-rose-600"
    },
    {
      icon: "💬",
      title: "دعم 24/7",
      description: "فريق دعم متاح على مدار الساعة",
      color: "from-indigo-400 to-violet-600"
    }
  ];

  // إحصائيات
  const stats = [
    { number: "1000+", label: "عميل راضي", icon: "😊", color: "from-green-400 to-emerald-600" },
    { number: "4.9", label: "تقييم عام", icon: "⭐", color: "from-yellow-400 to-orange-500" },
    { number: "50+", label: "قاعة فاخرة", icon: "🏛️", color: "from-purple-400 to-pink-600" },
    { number: "30+", label: "مصور محترف", icon: "📸", color: "from-blue-400 to-cyan-600" }
  ];

  // خطوات العمل
  const howItWorks = [
    {
      step: "1",
      title: "تصفح",
      description: "استكشف أفضل الخيارات المناسبة لك",
      icon: "🔍",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "2",
      title: "اختر",
      description: "حدد ما يناسب توقعاتك وميزانيتك",
      icon: "✅",
      color: "from-green-500 to-emerald-500"
    },
    {
      step: "3",
      title: "احجز",
      description: "اكمل عملية الحجز بسهولة وأمان",
      icon: "📅",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "4",
      title: "استمتع",
      description: "عش لحظات لا تُنسى في مناسبتك",
      icon: "🎉",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10 transition-colors duration-300 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{
              background: `radial-gradient(circle, ${['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4]} 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Navigation - تصميم جديد مبهر */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-200 dark:border-gray-800' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer flex items-center space-x-4 space-x-reverse"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <img 
                    src="https://res.cloudinary.com/dwocg88vs/image/upload/v1765294969/Red_Black_Typography_Nine_Brand_Logo_q0qhfd.png"
                    alt="Bookera Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border-2 border-purple-500/30 rounded-2xl"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bookera
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">حلمك، مسؤوليتنا</span>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center space-x-6 space-x-reverse">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 space-x-reverse bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg"
                  >
                    <div className="text-right">
                      <div className="font-bold text-gray-800 dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">مرحباً بك 👋</div>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                        <img 
                          src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full border-2 border-white dark:border-gray-900 shadow"></div>
                    </div>
                  </motion.div>
                  <motion.button 
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
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
                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    تسجيل الدخول
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    <span className="relative z-10">إنشاء حساب</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - مبهرة */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-3/4 w-96 h-96 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                🎉 منصة الأفراح الرقمية الأولى
              </div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="block text-gray-900 dark:text-white">
                مناسبتك المثالية
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mt-4 animate-gradient">
                تبدأ من هنا
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              اكتشف عالماً من الخيارات الفاخرة لتنظيم مناسبتك الكاملة. 
              من قاعات الأفراح الفاخرة إلى المصورين المحترفين، 
              كل شيء في مكان واحد.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">✨</span>
                استكشف خدماتنا
              </span>
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 border-2 border-gradient-to-r from-purple-600 to-pink-600 text-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              onClick={() => navigate('/join-us')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                انضم الينا
              </span>
            </motion.button>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-10 left-10 hidden lg:block"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl backdrop-blur-sm border border-white/20 shadow-xl p-4">
              <div className="text-3xl">👑</div>
              <div className="text-xs font-bold text-purple-600 mt-2">فخامة</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute top-20 right-10 hidden lg:block"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-3xl backdrop-blur-sm border border-white/20 shadow-xl p-4">
              <div className="text-2xl">📸</div>
              <div className="text-xs font-bold text-blue-600 mt-2">إبداع</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Banner - تصميم مبهر */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* جميع الخدمات - تصميم مبهر */}
      <section id="services" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-900/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                🚀 خدماتنا الحصرية
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-gray-900 dark:text-white">اكتشف </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                عالم Bookera
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              نقدم لك تجربة متكاملة لتنظيم مناسبتك بكل تفاصيلها، من البداية إلى النهاية
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                <div 
                  className={`${section.gradient} rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 relative h-full`}
                  style={{
                    boxShadow: `0 20px 60px ${section.glowColor}`
                  }}
                >
                  {/* شارة التوفر */}
                  <div className={`absolute top-6 right-6 z-10 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    section.available 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  }`}>
                    {section.available ? 'متاح الآن' : 'قريباً'}
                  </div>

                  {/* صورة البطاقة مع تأثير */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl`}>
                        {section.icon}
                      </div>
                    </div>
                  </div>

                  {/* محتوى البطاقة */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      {section.description}
                    </p>
                    
                    {/* المميزات */}
                    <div className="mb-8">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">المميزات:</div>
                      <div className="flex flex-wrap gap-2">
                        {section.features.map((feature, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* زر الإجراء */}
                    <motion.button
                      onClick={() => section.available ? navigate(`/${section.id}`) : null}
                      whileHover={{ scale: section.available ? 1.05 : 1 }}
                      whileTap={{ scale: section.available ? 0.95 : 1 }}
                      className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
                        section.available
                          ? `bg-gradient-to-r ${section.color} text-white shadow-lg hover:shadow-xl cursor-pointer`
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {section.available ? 'احجز الآن →' : 'قريباً...'}
                    </motion.button>
                  </div>
                </div>

                {/* تأثير الإضاءة */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ميزات المنصة - تصميم مبهر */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-gray-900 dark:text-white">لماذا </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                تختار Bookera؟
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 h-full relative overflow-hidden">
                  {/* أيقونة كبيرة مع تأثير */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mx-auto relative z-10`}>
                      {feature.icon}
                    </div>
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* كيف تعمل - تصميم مبهر */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-900/5" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                4 خطوات
              </span>
              <span className="text-gray-900 dark:text-white"> لحجز مثالي</span>
            </motion.h2>
          </div>

          <div className="relative">
            {/* خط الاتصال */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 rounded-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 text-center">
                    {/* رقم الخطوة */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-6 relative`}>
                      {step.step}
                      <motion.div 
                        className="absolute inset-0 border-2 border-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    
                    {/* الأيقونة */}
                    <div className="text-4xl mb-4">{step.icon}</div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* آراء العملاء - تصميم مبهر */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-rose-50/30 to-orange-50/30 dark:from-pink-900/10 dark:via-rose-900/10 dark:to-orange-900/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-gray-900 dark:text-white">يقولون عنا </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                العملاء
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 h-full">
                  {/* صورة العميل */}
                  <div className="flex items-center space-x-4 space-x-reverse mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${testimonial.color} rounded-full border-2 border-white dark:border-gray-800 shadow`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-lg">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* التعليق */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic text-lg relative">
                    <span className="absolute -top-4 -right-4 text-4xl text-pink-200 dark:text-pink-900">"</span>
                    {testimonial.comment}
                    <span className="absolute -bottom-4 -left-4 text-4xl text-pink-200 dark:text-pink-900">"</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - تصميم مبهر */}
      <section className="py-20 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10" />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full border border-white/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl inline-block mb-8">
              🎁 عرض خاص لمشاهدة الصفحة
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              هل أنت مستعد لبدء
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mt-4">
                رحلتك نحو حلمك؟
              </span>
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف العملاء الذين اختاروا Bookera لمناسباتهم المميزة
              واستمتع بتجربة فريدة لن تتكرر
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                ابدأ رحلتك الآن
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group px-12 py-6 border-2 border-white text-white rounded-2xl font-bold text-2xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
              onClick={() => navigate('/contact')}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-3xl">💎</span>
                احصل على استشارة مجانية
              </span>
            </motion.button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-purple-200 mt-12 text-lg flex items-center justify-center gap-4"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              تجربة مجانية
            </span>
            <span>•</span>
            <span>لا حاجة لبطاقة ائتمان</span>
            <span>•</span>
            <span>دعم فني 24/7</span>
          </motion.p>
        </div>
      </section>

      {/* Footer - تصميم مبهر */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white py-16 relative overflow-hidden">
        {/* تأثيرات الخلفية */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* العمود الأول - Logo */}
            <div>
              <div className="flex items-center space-x-4 space-x-reverse mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/dwocg88vs/image/upload/v1765294969/Red_Black_Typography_Nine_Brand_Logo_q0qhfd.png"
                      alt="Bookera Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div 
                    className="absolute -inset-2 border-2 border-purple-500/30 rounded-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div>
                  <span className="text-2xl font-bold block">Bookera</span>
                  <span className="text-gray-400">حلمك، مسؤوليتنا</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                نخلق ذكريات لا تنسى بكل تفاصيلها. 
                من الفكرة الأولى إلى اللحظة الأخيرة، 
                نحن هنا لنجعل مناسبتك استثنائية.
              </p>
            </div>
            
            {/* العمود الثاني - الخدمات */}
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-purple-400">✨</span>
                خدماتنا
              </h4>
              <div className="space-y-4">
                {allSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => navigate(`/${section.id}`)}
                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2"
                  >
                    <div className={`w-3 h-3 rounded-full ${section.available ? 'bg-green-500' : 'bg-yellow-500'} group-hover:scale-150 transition-transform`}></div>
                    <span>{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* العمود الثالث - روابط سريعة */}
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-blue-400">🚀</span>
                روابط سريعة
              </h4>
              <div className="space-y-4">
                {[
                  { label: "عن Bookera", icon: "🏢" },
                  { label: "كيف نعمل", icon: "🔧" },
                  { label: "الأسئلة الشائعة", icon: "❓" },
                  { label: "سياسة الخصوصية", icon: "🔒" },
                  { label: "الشروط والأحكام", icon: "📄" }
                ].map((link, index) => (
                  <button
                    key={index}
                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* العمود الرابع - تواصل معنا */}
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-pink-400">📞</span>
                تواصل معنا
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-white transition-colors">tallaey445@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-white transition-colors">+201040652783</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-white transition-colors">مصر</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* حقوق النشر */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              © 2024 Bookera. جميع الحقوق محفوظة. | 
              <span className="text-gray-400 mx-2">تصميم بواسطة فريق Bookera الإبداعي</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">
              نحن نعمل باستمرار لتطوير خدماتنا وتحسين تجربتك
            </p>
          </div>
        </div>
      </footer>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-blob {
          animation: blob 10s infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CompanyHomePage;