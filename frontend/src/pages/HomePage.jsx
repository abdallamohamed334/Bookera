import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";

const CompanyHomePage = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchData, setSearchData] = useState({
    eventType: "",
    location: "",
    date: ""
  });

  const [favorites, setFavorites] = useState([]);

  const handleLogout = () => {
    logout();
  };

  // أنواع الحجز المتاحة
  const bookingTypes = [
    {
      id: 1,
      title: "قاعات أفراح",
      description: "لحفلات الزفاف والمناسبات الكبيرة",
      icon: "💒",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-white dark:bg-gray-800",
      borderColor: "border-purple-200 dark:border-purple-800",
      route: "/wedding-halls"
    },
    {
      id: 2,
      title: "أماكن أعياد ميلاد",
      description: "لحفلات الأطفال والمناسبات الصغيرة",
      icon: "🎁",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-white dark:bg-gray-800",
      borderColor: "border-blue-200 dark:border-blue-800",
      route: "/birthday-places"
    },
    {
      id: 3,
      title: "ديكورات",
      description: "لللقاءات العائلية والاجتماعات",
      icon: "🎨",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-white dark:bg-gray-800",
      borderColor: "border-green-200 dark:border-green-800",
      route: "/decorations"
    },
    {
      id: 4,
      title: "قاعات مؤتمرات",
      description: "للالقاءات الرسمية والندوات",
      icon: "🏢",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-white dark:bg-gray-800",
      borderColor: "border-orange-200 dark:border-orange-800",
      route: "/conference-halls"
    },
    {
      id: 5,
      title: "مصورين",
      description: "مصورين محترفين لجميع المناسبات",
      icon: "📸",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-white dark:bg-gray-800",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      route: "/photographers"
    }
  ];

  // إحصائيات الشركة
  const companyStats = [
    { number: "500+", label: "مكان متاح" },
    { number: "10K+", label: "عميل راضي" },
    { number: "50+", label: "مدينة" },
    { number: "8+", label: "سنوات خبرة" }
  ];

  // خدماتنا
  const services = [
    {
      icon: "⚡",
      title: "حجز سريع وسهل",
      description: "عملية حجز مبسطة ومباشرة توفر وقتك وجهدك"
    },
    {
      icon: "💰",
      title: "أسعار تنافسية",
      description: "عروض وأسعار مناسبة تناسب جميع الميزانيات"
    },
    {
      icon: "⭐",
      title: "جودة مضمونة",
      description: "جميع الأماكن والمصورين مختارين بعناية فائقة"
    },
    {
      icon: "🛡️",
      title: "دعم فني 24/7",
      description: "فريق دعم فني متاح على مدار الساعة لمساعدتك"
    },
    {
      icon: "🎯",
      title: "حجوزات مضمونة",
      description: "تأكيد فوري للحجز مع خيارات دفع متعددة"
    },
    {
      icon: "🚀",
      title: "تجربة فريدة",
      description: "تصميم سهل الاستخدام يتناسب مع جميع احتياجاتك"
    }
  ];

  // خطوات العمل
  const howItWorks = [
    { step: "1", title: "اختر نوع الحجز", description: "اختر من بين أنواع الحجوزات المتاحة" },
    { step: "2", title: "تصفح الخيارات", description: "استعرض الأماكن أو المصورين المتاحين" },
    { step: "3", title: "احجز موعدك", description: "اختر التاريخ والوقت المناسبين" },
    { step: "4", title: "استمتع بمناسبتك", description: "استلم تأكيد الحجز واستمتع بمناسبتك" }
  ];

  // آراء العملاء
  const testimonials = [
    {
      name: "أحمد السعد",
      role: "عميل - حفل زفاف",
      comment: "تجربة رائعة مع المنصة، ساعدتني في إيجاد القاعة المثالية لحفل زفافي بكل سهولة",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "فاطمة الناصر",
      role: "عميلة - مؤتمر عمل",
      comment: "خدمة ممتازة ومحترفة، أنصح الجميع باستخدام المنصة لحجز قاعات المؤتمرات",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "محمد القحطاني",
      role: "عميل - تصوير مناسبات",
      comment: "المصور الذي حجزته من خلال المنصة كان محترفاً جداً، والنتائج كانت مذهلة",
      rating: 4,
      avatar: "👨‍🎓"
    },
    {
      name: "سارة العلي",
      role: "عميلة - حفل تخرج",
      comment: "سهولة الاستخدام والخدمة السريعة جعلت تجربتي لا تُنسى، شكراً لكم",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  // التحقق إذا كانت الصفحة الحالية هي الصفحة الرئيسية
  useEffect(() => {
    setShowBackButton(location.pathname !== "/");
  }, [location.pathname]);

  // تحميل وضع الدارك مود من localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    // تحميل المفضلات من localStorage
    const savedFavorites = localStorage.getItem('userFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // حفظ وضع الدارك مود في localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // حفظ المفضلات في localStorage
  useEffect(() => {
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // تبديل وضع الدارك مود
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // التنقل للصفحة المتخصصة مع تأثير الرجوع
  const handleNavigateToCategory = (route) => {
    const button = event?.currentTarget;
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
        navigate(route);
      }, 150);
    } else {
      navigate(route);
    }
  };

  // التنقل للقسم المحدد مع تأثير الرجوع
  const handleNavigateToSection = (section) => {
    setActiveSection(section);
    setShowMobileMenu(false);
    
    if (section === "favorites" && !user) {
      navigate('/login');
      return;
    }
    
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // إغلاق القائمة المتنقلة
  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false);
  };

  // الرجوع للصفحة السابقة
  const handleBack = () => {
    navigate(-1);
  };

  // معالجة تغيير بيانات البحث
  const handleSearchChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // معالجة البحث
  const handleSearch = () => {
    if (searchData.eventType || searchData.location || searchData.date) {
      navigate("/search-results", { state: { searchData } });
    }
  };

  // إضافة/إزالة من المفضلة
  const toggleFavorite = (item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      } else {
        return [...prev, { ...item, addedAt: new Date().toISOString() }];
      }
    });
  };

  // التحقق إذا كان العنصر في المفضلة
  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id);
  };

  // الانتقال لصفحة التسجيل كشريك
  const handleJoinAsPartner = () => {
    navigate('/join-us');
  };

  // عرض صفحة المفضلة
  const renderFavoritesSection = () => {
    if (!user) {
      return (
        <section id="favorites" className="py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-3xl p-8 sm:p-12 border-2 border-pink-200 dark:border-pink-800"
            >
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                يرجى تسجيل الدخول
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                لتتمكن من عرض المفضلة الخاصة بك، يرجى تسجيل الدخول أولاً
              </p>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg"
              >
                تسجيل الدخول
              </motion.button>
            </motion.div>
          </div>
        </section>
      );
    }

    return (
      <section id="favorites" className="py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
              المفضلة الخاصة بك
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              استعرض العناصر التي أضفتها إلى قائمة المفضلة لديك
            </p>
          </motion.div>

          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 sm:p-12 border-2 border-blue-200 dark:border-blue-800"
            >
              <div className="text-6xl mb-6">❤️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                قائمة المفضلة فارغة
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                لم تقم بإضافة أي عناصر إلى المفضلة بعد. ابدأ بتصفح أنواع الحجوزات وأضف ما يعجبك!
              </p>
              <motion.button
                onClick={() => handleNavigateToSection("booking-types")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg"
              >
                تصفح الحجوزات
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-800 shadow-lg relative group"
                >
                  {/* زر إزالة من المفضلة */}
                  <motion.button
                    onClick={() => toggleFavorite(favorite)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <span className="text-2xl text-red-500">❤️</span>
                  </motion.button>

                  <div className="text-4xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">
                    {favorite.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{favorite.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{favorite.description}</p>
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-1 bg-gradient-to-r ${favorite.color} rounded-full`}></div>
                    </div>
                    <motion.button
                      onClick={(e) => handleNavigateToCategory(favorite.route)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 w-full"
                    >
                      احجز الآن
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full transition-colors duration-300 relative">
      {/* خلفية الموقع */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100/20 via-white/20 to-indigo-100/20 dark:from-blue-900/10 dark:via-gray-800/10 dark:to-indigo-900/10 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-blend-overlay"></div>
      <div className="fixed inset-0 bg-white/40 dark:bg-gray-900/60 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-filter backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 w-full transition-colors duration-300 shadow-lg">
          <div className="w-full mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-16 sm:h-20">
              {/* الشعار وزر الرجوع */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* زر الرجوع */}
                <AnimatePresence>
                  {showBackButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={handleBack}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg flex-shrink-0"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* الشعار */}
                <motion.div 
                  onClick={() => handleNavigateToSection("home")}
                  className="cursor-pointer flex items-center space-x-2 sm:space-x-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm sm:text-base">E</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                      EventPro
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight hidden sm:block">
                      منصة الحجوزات
                    </span>
                  </div>
                </motion.div>
              </div>
              
              {/* Desktop Navigation - مخفي في الجوال */}
              <div className="hidden lg:flex space-x-1">
                {[
                  { id: "home", name: "الرئيسية", icon: "🏠" },
                  { id: "services", name: "خدماتنا", icon: "🎯" },
                  { id: "booking-types", name: "الحجوزات", icon: "📅" },
                  { id: "how-it-works", name: "كيف نعمل", icon: "🔄" },
                  { id: "testimonials", name: "آراء العملاء", icon: "💬" },
                  { id: "favorites", name: "المفضلة", icon: "❤️" },
                  { id: "join-us", name: "انضم إلينا", icon: "🤝" }
                ].map((section) => (
                  <motion.button 
                    key={section.id}
                    onClick={() => handleNavigateToSection(section.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      activeSection === section.id 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                  >
                    <span className="text-sm">{section.icon}</span>
                    <span className="text-xs">{section.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Desktop Actions - مخفي في الجوال */}
              <div className="hidden lg:flex items-center space-x-2">
                {/* زر الدارك مود */}
                <motion.button
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm"
                >
                  {darkMode ? (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </motion.button>

                {user ? (
                  <>
                    <motion.button 
                      onClick={() => handleNavigateToSection("favorites")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-800/20 dark:hover:to-rose-800/20 transition-all duration-200 shadow-sm relative"
                    >
                      <span className="text-sm">❤️</span>
                      {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                          {favorites.length}
                        </span>
                      )}
                    </motion.button>
                    
                    <motion.div 
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-2 rounded-xl shadow-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">{user.email}</p>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    </motion.div>
                    
                    <motion.button 
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 shadow-lg"
                    >
                      تسجيل الخروج
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button 
                      onClick={() => navigate('/login')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-xl text-xs font-medium transition-colors duration-200"
                    >
                      تسجيل الدخول
                    </motion.button>
                    <motion.button 
                      onClick={() => navigate('/signup')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 shadow-lg"
                    >
                      إنشاء حساب
                    </motion.button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button - ظاهر فقط في الجوال */}
              <div className="flex lg:hidden items-center space-x-2">
                {/* زر المفضلة في الجوال */}
                {user && (
                  <motion.button 
                    onClick={() => handleNavigateToSection("favorites")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-800/20 dark:hover:to-rose-800/20 transition-all duration-200 shadow-sm relative"
                  >
                    <span className="text-sm">❤️</span>
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        {favorites.length}
                      </span>
                    )}
                  </motion.button>
                )}

                {/* زر الدارك مود في الجوال */}
                <motion.button
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm"
                >
                  {darkMode ? (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </motion.button>

                {/* زر القائمة في الجوال */}
                <motion.button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Slider */}
          <AnimatePresence>
            {showMobileMenu && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={handleCloseMobileMenu}
                />
                
                {/* Slider */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white text-base font-bold">E</span>
                      </div>
                      <div>
                        <h2 className="text-base font-bold">EventPro</h2>
                        <p className="text-xs text-blue-100">منصة الحجوزات</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseMobileMenu}
                      className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1 px-3">
                      {[
                        { id: "home", name: "الرئيسية", icon: "🏠" },
                        { id: "services", name: "خدماتنا", icon: "🎯" },
                        { id: "booking-types", name: "أنواع الحجوزات", icon: "📅" },
                        { id: "how-it-works", name: "كيف نعمل", icon: "🔄" },
                        { id: "testimonials", name: "آراء العملاء", icon: "💬" },
                        { id: "favorites", name: "المفضلة", icon: "❤️" },
                        { id: "join-us", name: "انضم إلينا", icon: "🤝" }
                      ].map((section) => (
                        <motion.button
                          key={section.id}
                          onClick={() => handleNavigateToSection(section.id)}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                            activeSection === section.id 
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400"
                          }`}
                        >
                          <span className="text-base">{section.icon}</span>
                          <span className="font-medium text-base">{section.name}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* User Info in Mobile Menu */}
                    {user && (
                      <div className="mt-4 px-3">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="text-right flex-1">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions in Mobile */}
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    {user ? (
                      <motion.button 
                        onClick={() => {
                          handleCloseMobileMenu();
                          handleLogout();
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <span>تسجيل الخروج</span>
                        <span>🚪</span>
                      </motion.button>
                    ) : (
                      <div className="space-y-2">
                        <motion.button 
                          onClick={() => {
                            handleCloseMobileMenu();
                            navigate('/login');
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full text-gray-700 dark:text-gray-300 hover:text-blue-500 px-4 py-3 rounded-xl text-sm font-medium transition-colors border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 flex items-center justify-center space-x-2"
                        >
                          <span>تسجيل الدخول</span>
                          <span>🔑</span>
                        </motion.button>
                        <motion.button 
                          onClick={() => {
                            handleCloseMobileMenu();
                            navigate('/signup');
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <span>إنشاء حساب</span>
                          <span>👤</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative w-full py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-800 dark:via-blue-700 dark:to-indigo-800 text-white overflow-hidden">
          {/* خلفية متحركة */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* النص */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-right"
              >
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  ابدأ رحلتك مع
                  <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    EventPro
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 leading-relaxed text-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  نوفر لك أفضل الأماكن والمصورين لحفلاتك ومناسباتك في جميع أنحاء المملكة
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.button 
                    onClick={() => handleNavigateToSection("booking-types")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-2xl"
                  >
                    ابدأ الحجز الآن 🚀
                  </motion.button>
                  <motion.button 
                    onClick={handleJoinAsPartner}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-2xl"
                  >
                    انضم إلينا كشريك 💼
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* الصورة */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="حفلات ومناسبات"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">أفضل الأماكن بانتظارك</h3>
                    <p className="text-blue-100 text-sm sm:text-base">احجز الآن واستمتع بتجربة فريدة</p>
                  </div>
                </div>
                
                {/* عناصر زخرفية */}
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-yellow-400 rounded-xl sm:rounded-2xl rotate-12 opacity-80 hidden sm:block"></div>
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-pink-400 rounded-xl sm:rounded-2xl -rotate-12 opacity-80 hidden sm:block"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {companyStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Types Section */}
        <section id="booking-types" className="py-12 sm:py-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                ما نوع الحجز الذي تبحث عنه؟
              </h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                اختر من بين أنواع الحجوزات المتاحة لدينا وابحث عن المكان المثالي لمناسبتك
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {bookingTypes.map((type) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: type.id * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleNavigateToCategory(type.route)}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 ${type.bgColor} ${type.borderColor} hover:shadow-2xl dark:hover:shadow-2xl h-full flex flex-col group relative overflow-hidden`}
                >
                  {/* زر المفضلة */}
                  {user && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(type);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10"
                    >
                      <span className={`text-xl sm:text-2xl ${isFavorite(type) ? 'text-red-500' : 'text-gray-300'}`}>
                        {isFavorite(type) ? '❤️' : '🤍'}
                      </span>
                    </motion.button>
                  )}

                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 flex-grow-0 transform group-hover:scale-110 transition-transform duration-300 text-center">
                    {type.icon}
                  </div>
                  <div className="flex-grow text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">{type.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{type.description}</p>
                  </div>
                  <div className="flex items-center justify-center mt-1 sm:mt-2">
                    <div className={`w-12 sm:w-16 h-1 bg-gradient-to-r ${type.color} rounded-full`}></div>
                  </div>
                  <div className="text-center mt-2 sm:mt-4">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      اكتشف المزيد →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                لماذا تختار EventPro؟
              </h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                نقدم لك تجربة حجز فريدة ومميزة تناسب جميع احتياجاتك
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-600 text-center"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                كيف تعمل منصتنا؟
              </h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                عملية بسيطة ومباشرة لحجز مكانك المثالي في خطوات سهلة
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-800 text-center relative"
                >
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                ماذا يقول عملاؤنا؟
              </h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                انضم إلى آلاف العملاء الراضين عن خدماتنا
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{testimonial.comment}</p>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Favorites Section */}
        {renderFavoritesSection()}

        {/* Join Us Section */}
        <section id="join-us" className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">انضم إلى عائلة EventPro</h2>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                كن جزءاً من منصتنا الرائدة واربح معنا
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: "🏢",
                  title: "أصحاب القاعات",
                  description: "انضم كصاحب قاعة وعرض خدماتك على آلاف العملاء",
                  features: ["وصول لآلاف العملاء", "إدارة حجوزات سهلة", "دفعات آمنة وسريعة"]
                },
                {
                  icon: "📸",
                  title: "المصورين المحترفين",
                  description: "عرض مهاراتك التصويرية واحصل على فرص عمل مميزة",
                  features: ["ملف شخصي متكامل", "تقييمات العملاء", "حجوزات مضمونة"]
                },
                {
                  icon: "🎨",
                  title: "مقدمي الخدمات",
                  description: "قدم خدمات الديكور والتجهيزات للمناسبات المختلفة",
                  features: ["عرض محفظة أعمالك", "التواصل المباشر", "توسيع قاعدة عملائك"]
                }
              ].map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-800"
                >
                  <div className="text-4xl mb-4 text-center">{partner.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">{partner.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">{partner.description}</p>
                  <ul className="space-y-2 mb-6">
                    {partner.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    onClick={handleJoinAsPartner}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    انضم الآن
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
            >
              مستعد لبدء رحلتك معنا؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto text-blue-100"
            >
              انضم إلى آلاف العملاء الراضين عن خدماتنا وابدأ في التخطيط لمناسبتك القادمة
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <motion.button
                onClick={() => handleNavigateToSection("booking-types")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-2xl"
              >
                ابدأ الحجز الآن
              </motion.button>
              <motion.button
                onClick={handleJoinAsPartner}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-2xl"
              >
                انضم إلينا كشريك
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 sm:py-12 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <motion.h3 
                  onClick={() => handleNavigateToSection("home")}
                  className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 cursor-pointer flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>EventPro</span>
                  <span className="text-xl sm:text-2xl">🚀</span>
                </motion.h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  الوجهة الأولى لحجز قاعات المناسبات والفعاليات في المملكة العربية السعودية. نقدم أفضل الخدمات بأعلى معايير الجودة.
                </p>
              </div>
              
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">روابط سريعة</h4>
                <ul className="space-y-2 text-gray-400">
                  {[
                    { id: "home", name: "الرئيسية" },
                    { id: "services", name: "خدماتنا" },
                    { id: "booking-types", name: "أنواع الحجوزات" },
                    { id: "how-it-works", name: "كيف نعمل" },
                    { id: "testimonials", name: "آراء العملاء" },
                    { id: "join-us", name: "انضم إلينا" }
                  ].map((link) => (
                    <li key={link.id}>
                      <button 
                        onClick={() => handleNavigateToSection(link.id)}
                        className="hover:text-white transition-colors duration-200 text-right w-full hover:translate-x-1 transform transition-transform text-sm sm:text-base"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">أنواع الحجوزات</h4>
                <ul className="space-y-2 text-gray-400">
                  {bookingTypes.map((type) => (
                    <li key={type.id}>
                      <button 
                        onClick={() => handleNavigateToCategory(type.route)}
                        className="hover:text-white transition-colors duration-200 text-right w-full hover:translate-x-1 transform transition-transform text-sm sm:text-base flex items-center justify-between"
                      >
                        <span>{type.icon}</span>
                        <span>{type.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">تواصل معنا</h4>
                <div className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                  <p className="flex items-center space-x-2 space-x-reverse">
                    <span>📧</span>
                    <span>info@eventpro.com</span>
                  </p>
                  <p className="flex items-center space-x-2 space-x-reverse">
                    <span>📞</span>
                    <span>+966 500 000 000</span>
                  </p>
                  <p className="flex items-center space-x-2 space-x-reverse">
                    <span>📍</span>
                    <span>المملكة العربية السعودية</span>
                  </p>
                </div>
                
                <div className="flex space-x-3 sm:space-x-4 space-x-reverse mt-4 sm:mt-6">
                  {[
                    { icon: "📘", label: "فيسبوك", color: "hover:bg-blue-500" },
                    { icon: "🐦", label: "تويتر", color: "hover:bg-blue-400" },
                    { icon: "📷", label: "انستغرام", color: "hover:bg-pink-500" },
                    { icon: "💼", label: "لينكدإن", color: "hover:bg-blue-600" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 ${social.color} shadow-lg`}
                    >
                      <span className="text-xs sm:text-sm">{social.icon}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
              <p>© 2024 EventPro. جميع الحقوق محفوظة. | صمم بعناية لتجربة مستخدم استثنائية</p>
            </div>
          </div> 
        </footer>
      </div>
    </div>
  );
};

export default CompanyHomePage;