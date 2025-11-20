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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchData, setSearchData] = useState({
    eventType: "",
    location: "",
    date: ""
  });

  const [favorites, setFavorites] = useState([]);

  // تحسين الأداء - lazy load للصور
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // أنواع الحجز المتاحة - مركز على القاعات والمصورين فقط
  const bookingTypes = [
    {
      id: 1,
      title: " قاعات افراح واعياد ميلاد ومؤتمرات ",
      description: "أفضل قاعات الأفراح لحفلاتك الخاصة",
      icon: "💒",
      route: "/wedding-halls",
      image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      category: "venues",
      featured: true
    },
    
    {
      id: 3,
      title: "مصورين أفراح",
      description: "مصورين محترفين لتوثيق لحظاتك الخاصة",
      icon: "📸",
      route: "/wedding-photographers",
      image: "https://images.unsplash.com/photo-1611550287705-7ff8b459c8eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZyUyMHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8MA%3D%3D",
      category: "photographers",
      featured: true
    },
    {
      id: 4,
      title: "مصورين فوتوشوت",
      description: "محترفين التصوير للإعلانات والمشاريع",
      icon: "🎬",
      route: "/photoshoot",
      image: "https://plus.unsplash.com/premium_photo-1661594795875-03c523fc754d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHBob3RvZ3JhcGh5fGVufDB8fDB8fHww",
      category: "photographers",
      featured: false
    },
    
  ];

  // الفئات الرئيسية
  const categories = [
    { id: "all", name: "الكل", icon: "🌟", count: bookingTypes.length },
    { id: "venues", name: "القاعات", icon: "🏛️", count: bookingTypes.filter(item => item.category === "venues").length },
    { id: "photographers", name: "المصورين", icon: "📷", count: bookingTypes.filter(item => item.category === "photographers").length }
  ];

  // العناصر المميزة
  const featuredItems = bookingTypes.filter(item => item.featured);

  // العناصر المرشحة بناء على الفئة المختارة
  const filteredItems = selectedCategory === "all" 
    ? bookingTypes 
    : bookingTypes.filter(item => item.category === selectedCategory);

  // إحصائيات الشركة
  const companyStats = [
    { number: "200+", label: "قاعة متاحة" },
    { number: "150+", label: "مصور محترف" },
    { number: "50+", label: "مدينة" },
    { number: "15K+", label: "عميل راضي" }
  ];

  // خدماتنا - تصميم مبسط
  const services = [
    {
      icon: "⚡",
      title: "حجز فوري",
      description: "احجز خلال دقائق بدون تعقيد"
    },
    {
      icon: "💰",
      title: "أسعار شفافة",
      description: "أسعار واضحة بدون مفاجآت"
    },
    {
      icon: "⭐",
      title: "جودة مضمونة",
      description: "أفضل القاعات والمصورين"
    },
    {
      icon: "🛡️",
      title: "دعم مستمر",
      description: "نحن معك في كل خطوة"
    }
  ];

  // خطوات العمل
  const howItWorks = [
    { step: "1", title: "اختر الخدمة", description: "قاعة أو مصور" },
    { step: "2", title: "شاهد المعرض", description: "صور حقيقية وتقييمات" },
    { step: "3", title: "احجز مباشرة", description: "اختر التاريخ والوقت" },
    { step: "4", title: "استمتع", description: "بمناسبتك بكل راحة" }
  ];

  // آراء العملاء - محسنة ومتنوعة
  const testimonials = [
    {
      name: "أحمد السعد",
      role: "عميل - حفل زفاف",
      comment: "لم أتخيل أبداً أن أجد القاعة المثالية بهذه السهولة! المنصة وفرت لي الوقت والجهد، وكانت تجربة حجز سلسة وممتازة.",
      rating: 5,
      avatar: "👨‍💼",
      type: "wedding"
    },
    {
      name: "فاطمة الناصر",
      role: "مديرة فعاليات",
      comment: "أكثر من مجرد منصة حجوزات.. EventUp أصبحت مصدر دخل مهم لي! الاستضافة أصبحت ممتعة وبسيطة.",
      rating: 5,
      avatar: "👩‍💼",
      type: "host"
    },
    {
      name: "محمد القحطاني",
      role: "مصور محترف",
      comment: "التجربة مع المنصة فاقت توقعاتي! ساعدتني في الوصول لعملاء جدد وتنظيم جدول أعمالي بشكل احترافي.",
      rating: 4,
      avatar: "👨‍🎓",
      type: "photographer"
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
    
    const savedFavorites = localStorage.getItem('userFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // تحميل الصور في الخلفية
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
    img.onload = () => setImagesLoaded(true);
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

  // التنقل لصفحة المصورين
  const handleNavigateToPhotographers = () => {
    navigate('/photographers');
  };

  // التنقل لصفحة القاعات
  const handleNavigateToVenues = () => {
    navigate('/wedding-venues');
  };

  // التنقل مع تأثير بسيط - معدلة
  const handleNavigateToCategory = (item) => {
    if (item.category === 'photographers') {
      // إذا كان من فئة المصورين، اذهب لصفحة المصورين
      handleNavigateToPhotographers();
    } else if (item.category === 'wedding-venues') {
      // إذا كان من فئة القاعات، اذهب لصفحة القاعات
      handleNavigateToVenues();
    } else {
      // إذا لم يكن ضمن التصنيفات المعروفة، استخدم الروت المباشر
      navigate(item.route);
    }
  };

  // التنقل للقسم المحدد
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

  // إضافة/إزالة من المفضلة
  const toggleFavorite = (item, e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    const isFavorite = favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== item.id));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  // الانتقال لصفحة التسجيل كشريك
  const handleJoinAsPartner = () => {
    navigate('/join-us');
  };

  // تصميم هادئ للأقسام
  const SectionContainer = ({ children, id, bg = "transparent" }) => (
    <section id={id} className={`py-16 transition-colors duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4">
        {children}
      </div>
    </section>
  );

  // عرض قسم الحجوزات الجديد والمحسن
  const renderBookingSection = () => (
    <SectionContainer id="booking-types" bg="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg mb-4"
        >
          <span className="text-2xl text-yellow-500">🔥</span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">الحجوزات الأكثر طلباً</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          احجز قاعة أو مصور بكل سهولة
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          اختر من بين أفضل القاعات والمصورين المحترفين
        </motion.p>
      </div>

      {/* فئات التصفية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-8"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 space-x-reverse ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === category.id
                ? "bg-white/20 text-white"
                : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}>
              {category.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* العناصر المميزة */}
      {selectedCategory === "all" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">مميز هذا الأسبوع ✨</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleNavigateToCategory(item)}
                className="cursor-pointer group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-70 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <span>🔥</span>
                      <span>مميز</span>
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                    <p className="text-blue-100 text-sm">{item.description}</p>
                  </div>
                </div>
                {/* <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <motion.button
                      onClick={(e) => toggleFavorite(item, e)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      className="text-2xl text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
                    </motion.button>
                  </div>
                </div> */}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* شبكة العناصر */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => handleNavigateToCategory(item)}
            className="cursor-pointer group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.category === 'venues' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {item.category === 'venues' ? 'قاعة' : 'مصور'}
                </span>
              </div>
            </div>
            
            {/* <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                </div>
                <span className="text-2xl ml-3">{item.icon}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <motion.button
                  onClick={(e) => toggleFavorite(item, e)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className="text-xl text-gray-400 hover:text-red-500 transition-colors"
                >
                  {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToCategory(item);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  احجز الآن
                </motion.button>
              </div>
            </div> */}
          </motion.div>
        ))}
      </motion.div>

      {/* دعوة للعمل */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mt-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">لم تجد ما تبحث عنه؟</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">فريقنا جاهز لمساعدتك في العثور على المكان أو المصور المثالي</p>
          <motion.button
            onClick={handleJoinAsPartner}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
          >
           تواصل معانا
          </motion.button>
        </div>
      </motion.div>
    </SectionContainer>
  );

  // عرض قسم الأخبار الجيدة
  const renderGoodNewsSection = () => (
    <SectionContainer bg="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm mb-4"
        >
          <span className="text-2xl">🎉</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">أخبار سعيدة من بعيد</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          دعنا نرى ما يقوله الناس عن EventUp
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          اكتشف تجارب عملائنا وشركائنا مع منصتنا
        </motion.p>
      </div>

      {/* Testimonial Featured */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-blue-800 max-w-4xl mx-auto mb-12"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-right">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic"
            >
              "لم أتخيل أبداً أن EventUp يمكن أن تكون مصدر الدخل الذي أصبحت عليه! ولكن الأهم من ذلك، الاستضافة أصبحت ممتعة وبسيطة وتوسع باستمرار رؤيتي لما يمكن أن يكون عليه هذا المكان."
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center md:justify-end space-x-4 space-x-reverse"
            >
              <div className="text-right">
                <h4 className="font-bold text-gray-800 dark:text-white text-lg">عادل محمد</h4>
                <p className="text-gray-600 dark:text-gray-400">شريك - صاحب قاعة</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                ع
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-shrink-0"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl">
              🏆
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SectionContainer>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* الشعار */}
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleBack}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              )}

              <motion.div 
                onClick={() => handleNavigateToSection("home")}
                className="cursor-pointer flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
              >
                
                <span className="text-lg font-bold text-gray-800 dark:text-white">EventUp</span>
              </motion.div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {[
                { id: "home", name: "الرئيسية" },
                { id: "services", name: "خدماتنا" },
                { id: "booking-types", name: "الحجوزات" },
                { id: "how-it-works", name: "كيف نعمل" },
                { id: "testimonials", name: "آراء العملاء" }
              ].map((section) => (
                <motion.button 
                  key={section.id}
                  onClick={() => handleNavigateToSection(section.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === section.id 
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {section.name}
                </motion.button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {darkMode ? "🌙" : "☀️"}
              </motion.button>

              {user ? (
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 dark:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-700 dark:hover:bg-gray-500"
                >
                  تسجيل الخروج
                </motion.button>
              ) : (
                <>
                  <motion.button 
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    تسجيل الدخول
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/signup')}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 dark:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-700 dark:hover:bg-gray-500"
                  >
                    إنشاء حساب
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {darkMode ? "🌙" : "☀️"}
              </motion.button>

              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={handleCloseMobileMenu}
              />
              
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 md:hidden flex flex-col"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">القائمة</span>
                    <button onClick={handleCloseMobileMenu} className="p-1">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-1 px-4">
                    {[
                      { id: "home", name: "الرئيسية" },
                      { id: "services", name: "خدماتنا" },
                      { id: "booking-types", name: "الحجوزات" },
                      { id: "how-it-works", name: "كيف نعمل" },
                      { id: "testimonials", name: "آراء العملاء" },
                      { id: "join-us", name: "انضم إلينا" }
                    ].map((section) => (
                      <motion.button
                        key={section.id}
                        onClick={() => handleNavigateToSection(section.id)}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full text-right px-4 py-3 rounded-lg transition-colors duration-200 ${
                          activeSection === section.id 
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {section.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  {user ? (
                    <motion.button 
                      onClick={handleLogout}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gray-800 dark:bg-gray-600 text-white py-3 rounded-lg text-sm font-medium"
                    >
                      تسجيل الخروج
                    </motion.button>
                  ) : (
                    <div className="space-y-2">
                      <motion.button 
                        onClick={() => navigate('/login')}
                        whileTap={{ scale: 0.95 }}
                        className="w-full text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 py-3 rounded-lg text-sm font-medium"
                      >
                        تسجيل الدخول
                      </motion.button>
                      <motion.button 
                        onClick={() => navigate('/signup')}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gray-800 dark:bg-gray-600 text-white py-3 rounded-lg text-sm font-medium"
                      >
                        إنشاء حساب
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
      <SectionContainer id="home" bg="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
          >
            احجز قاعة أو مصور 
            <span className="block text-blue-600 dark:text-blue-400">بكل سهولة وثقة</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            نوفر لك أفضل القاعات للمناسبات والمصورين المحترفين في جميع أنحاء المملكة
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button 
              onClick={() => handleNavigateToSection("booking-types")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
            >
              ابدأ الحجز الآن 🚀
            </motion.button>
            <motion.button 
              onClick={handleJoinAsPartner}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              انضم كشريك 💼
            </motion.button>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Statistics Section */}
      <SectionContainer bg="bg-white dark:bg-gray-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {companyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* Booking Section - الجديد والمحسن */}
      {renderBookingSection()}

      {/* Services Section */}
      <SectionContainer id="services" bg="bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">لماذا تختار EventUp؟</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-4"
            >
              <div className="text-2xl mb-3">{service.icon}</div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* How It Works Section */}
      <SectionContainer id="how-it-works" bg="bg-gray-50 dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">كيف تعمل منصتنا؟</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gray-800 dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                {step.step}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      {/* Good News Section */}
      {renderGoodNewsSection()}

      {/* Testimonials Section */}
      <SectionContainer id="testimonials" bg="bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">ماذا يقول عملاؤنا؟</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">انضم إلى آلاف العملاء الراضين عن خدماتنا</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">{testimonial.comment}</p>
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
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer bg="bg-gray-800 dark:bg-gray-700">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">مستعد لبدء رحلتك معنا؟</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">انضم إلى آلاف العملاء الراضين عن خدماتنا</p>
          <motion.button
            onClick={() => handleNavigateToSection("booking-types")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            ابدأ الحجز الآن
          </motion.button>
        </div>
      </SectionContainer>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">EventUp</h3>
              <p className="text-gray-400 text-sm">
                الوجهة الأولى لحجز قاعات المناسبات والفعاليات في مصر.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {['الرئيسية', 'خدماتنا', 'الحجوزات', 'كيف نعمل', 'آراء العملاء'].map((link) => (
                  <li key={link}>
                    <button className="hover:text-white transition-colors duration-200">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>tallaey445@gmail.com</p>
                <p>+201040652783</p>
                <p>مصر</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 EventUp. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyHomePage;