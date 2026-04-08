import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const CompanyHomePage = () => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Dark mode - apply immediately
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto slide for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => logout();
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Hero Slider Data with Join Us button
  const heroSlides = [
    {
      title: "حفل أحلامك يبدأ من هنا",
      subtitle: "نحول لحظاتك الخاصة إلى ذكريات لا تُنسى",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format",
      buttonText: "اكتشف المزيد"
    },
    {
      title: "انضم إلى عائلة Bookera",
      subtitle: "زد حجوزاتك وكن شريكاً في النجاح",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1600&auto=format",
      buttonText: "انضم إلينا الآن"
    },
    {
      title: "احجز بثقة وسهولة",
      subtitle: "منصة متكاملة لتنظيم مناسباتك",
      image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1600&auto=format",
      buttonText: "ابدأ الآن"
    }
  ];

  // Main Services - Egyptian prices
  const mainServices = [
    {
      id: "wedding-halls",
      name: "قاعات الأفراح",
      desc: "أفخم القاعات بتصاميم ملكية وفاخرة",
      longDesc: "نقدم لك أفضل قاعات الأفراح بأحدث التصاميم والإضاءات الاحترافية والمساحات المختلفة لتناسب جميع الأذواق والميزانيات.",
      price: "من 15,000 ج.م",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format",
      features: ["إضاءة احترافية", "أنظمة صوت متطورة", "مساحات متنوعة", "خدمة VIP"],
      tag: "متاح الآن",
      rating: 4.9,
      available: true,
      buttonText: "احجز قاعتك الآن"
    },
    {
      id: "photographers",
      name: "مصورين محترفين",
      desc: "أشهر مصوري الأفراح والمناسبات",
      longDesc: "فريق من المصورين المحترفين الحاصلين على جوائز عالمية لالتقاط أجمل لحظاتك بأسلوب فني واحترافي.",
      price: "من 8,000 ج.م",
      image: "https://images.unsplash.com/photo-1537633552986-d080842e7bc1?w=800&auto=format",
      features: ["كاميرات احترافية", "تعديل فوتوشوب", "ألبوم فاخر", "فيديو هايلايت"],
      tag: "متاح الآن",
      rating: 4.8,
      available: true,
      buttonText: "احجز مصورك الآن"
    },
    {
      id: "bridal-dresses",
      name: "فساتين العرائس",
      desc: "فساتين أحلامك من كبار المصممين",
      longDesc: "مجموعة حصرية من فساتين الزفاف بتصاميم عالمية من أفضل دور الأزياء العالمية، قريباً في Bookera.",
      price: "قريباً",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format",
      features: ["تصاميم حصرية", "أقمشة فاخرة", "تعديل مجاني", "توصيل للمنزل"],
      tag: "قريباً",
      rating: 0,
      available: false,
      buttonText: "قريباً"
    },
    {
      id: "decorations",
      name: "ديكور وزينة",
      desc: "حول قاعتك إلى تحفة فنية",
      longDesc: "فريق متخصص في تصميم وتنفيذ أجمل الديكورات والزينة للمناسبات، قريباً في Bookera.",
      price: "قريباً",
      image: "https://images.unsplash.com/photo-1678514823362-fd5ec94505a2?w=800&auto=format",
      features: ["تصميم مخصص", "زينة فاخرة", "إضاءة ساحرة", "ورود طبيعية"],
      tag: "قريباً",
      rating: 0,
      available: false,
      buttonText: "قريباً"
    }
  ];

  // Available services
  const availableServices = mainServices.filter(s => s.available);

  // Additional Services
  const additionalServices = [
    { name: "تنسيق زهور", icon: "bi-flower1", desc: "باقات ورد طبيعية فاخرة", available: false },
    { name: "حفلات خطوبة", icon: "bi-gem", desc: "تنظيم حفلات خطوبة مميزة", available: false },
    { name: "تصوير فيديو", icon: "bi-camera-reels", desc: "فيديو احترافي عالي الجودة", available: true },
    { name: "تنسيق طاولات", icon: "bi-table", desc: "تنسيق طاولات فاخر", available: false },
    { name: "فرق موسيقية", icon: "bi-music-note-beamed", desc: "أفضل الفرق الموسيقية", available: false },
    { name: "كيك وحلويات", icon: "bi-cake2", desc: "تصاميم كيك مذهلة", available: false }
  ];

  // Recent Works Gallery
  const recentWorks = [
    { image: "https://images.unsplash.com/photo-1583939176856-9e0f8ef6ac8c?w=600&auto=format", title: "قاعة الماسة", category: "قاعة أفراح" },
    { image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format", title: "لحظات خالدة", category: "تصوير" },
    { image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format", title: "روعة الأناقة", category: "ديكور" },
    { image: "https://images.unsplash.com/photo-1532712933605-b6d6c4ad163e?w=600&auto=format", title: "فساتين الأحلام", category: "أزياء" },
    { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format", title: "حفل أسطوري", category: "مناسبات" },
    { image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format", title: "تصوير إبداعي", category: "فوتوغرافي" }
  ];

  // Advantages
  const advantages = [
    { icon: "bi-crown", title: "خبرة 10 أعوام", desc: "آلاف المناسبات الناجحة", number: "1000+" },
    { icon: "bi-star", title: "خدمة VIP", desc: "اهتمام شخصي بالتفاصيل", number: "99%" },
    { icon: "bi-bullseye", title: "دقة متناهية", desc: "تنظيم احترافي بلا أخطاء", number: "100%" },
    { icon: "bi-diamond", title: "أسعار تنافسية", desc: "أفضل قيمة مقابل المال", number: "30%" }
  ];

  // Statistics
  const statistics = [
    { number: "1500+", label: "مناسبة ناجحة", icon: "bi-emoji-smile" },
    { number: "98%", label: "رضا العملاء", icon: "bi-heart-fill" },
    { number: "50+", label: "شريك معتمد", icon: "bi-people-fill" },
    { number: "24/7", label: "دعم فني", icon: "bi-headset" }
  ];

  // Testimonials
  const testimonials = [
    { name: "نورة أحمد", role: "عميلة مميزة", text: "تجربة رائعة! قاعة الأحلام كانت تحفة فنية والمصور التقط لحظات لن أنساها أبداً. شكراً Bookera!", rating: 5, date: "أكتوبر 2024" },
    { name: "خالد الوهيب", role: "رجل أعمال", text: "احترافية في التنظيم، ذوق رفيع في الاختيارات، أنصح بهم وبشدة. حفلاً لا يُنسى بكل المقاييس.", rating: 5, date: "سبتمبر 2024" },
    { name: "لمى السعيد", role: "مصممة أزياء", text: "تجربة استثنائية من البداية للنهاية. فريق محترف ومبدع. سأكرر التجربة بالتأكيد!", rating: 5, date: "أغسطس 2024" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <span className="text-xl font-bold tracking-tight dark:text-white bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bookera
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['الرئيسية', 'القاعات', 'المصورين', 'الفساتين', 'الديكور', 'انضم لنا', 'اتصل'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    if (item === 'القاعات') document.getElementById('wedding-halls')?.scrollIntoView({ behavior: 'smooth' });
                    else if (item === 'المصورين') document.getElementById('photographers')?.scrollIntoView({ behavior: 'smooth' });
                    else if (item === 'انضم لنا') navigate('/join-us');
                    else if (item === 'الرئيسية') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode} 
                className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>

              {user ? (
                <button onClick={handleLogout} className="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  خروج
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all">
                  دخول
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-3">
                {['الرئيسية', 'القاعات', 'المصورين', 'الفساتين', 'الديكور', 'انضم لنا', 'اتصل'].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => {
                      if (item === 'القاعات') document.getElementById('wedding-halls')?.scrollIntoView({ behavior: 'smooth' });
                      else if (item === 'المصورين') document.getElementById('photographers')?.scrollIntoView({ behavior: 'smooth' });
                      else if (item === 'انضم لنا') navigate('/join-us');
                      else if (item === 'الرئيسية') window.scrollTo({ top: 0, behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-right text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              activeSlide === idx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format';
              }}
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
              <div className="max-w-4xl animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-7xl text-white mb-4 leading-tight font-bold">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl text-white/90 mb-8">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      if (slide.buttonText === 'انضم إلينا الآن') {
                        navigate('/join-us');
                      } else {
                        document.getElementById('main-services')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-8 py-3 bg-white text-purple-600 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
                  >
                    {slide.buttonText}
                  </button>
                  {slide.buttonText !== 'انضم إلينا الآن' && (
                    <button 
                      onClick={() => navigate('/join-us')}
                      className="px-8 py-3 border-2 border-white text-white rounded-full text-sm font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      انضم إلينا
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'w-8 bg-white' : 'w-4 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, idx) => (
              <div key={idx} className="text-center p-4">
                <i className={`bi ${stat.icon} text-4xl text-purple-600 dark:text-purple-400 mb-2 block`}></i>
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Services Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 py-3 px-4 text-center">
        <p className="text-green-700 dark:text-green-400 text-sm">
          <i className="bi bi-check-circle-fill ml-2"></i>
          ✨ الخدمات المتاحة حالياً: {availableServices.map(s => s.name).join(' • ')} ✨
        </p>
      </div>

      {/* Main Services Section */}
      <section id="main-services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white">
              خدماتنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">المميزة</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              اختر الخدمة المناسبة لتنظيم مناسبتك بأعلى معايير الجودة وبأفضل الأسعار في مصر
            </p>
          </div>

          {/* All services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainServices.map((service, idx) => (
              <div 
                key={idx} 
                id={service.id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  service.available ? 'cursor-pointer hover:shadow-2xl transform hover:-translate-y-2' : 'opacity-90'
                }`}
                onClick={() => service.available && navigate(`/${service.id}`)}
              >
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.available ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {service.tag}
                    </span>
                  </div>
                  {service.available && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">اضغط للمزيد ←</span>
                    </div>
                  )}
                  {!service.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold px-3 py-1 bg-white/20 rounded-full">قريباً</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold dark:text-white">{service.name}</h3>
                    {service.available && (
                      <div className="flex items-center gap-1">
                        <i className="bi bi-star-fill text-yellow-400 text-sm"></i>
                        <span className="text-sm dark:text-white">{service.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{service.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 2).map((feature, i) => (
                      <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${service.available ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                      {service.price}
                    </span>
                    <button 
                      className={`px-4 py-2 text-white text-sm rounded-full transition-all ${
                        service.available 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (service.available) navigate(`/${service.id}`);
                      }}
                    >
                      {service.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access to Available Services */}
      <section className="py-8 px-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">✨ الخدمات المتاحة للحجز الفوري ✨</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {availableServices.map((service, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/${service.id}`)}
                className="px-6 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {service.name} ←
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">
              خدمات <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">إضافية</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400">خدمات قادمة قريباً لنجعل مناسبتك مثالية</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {additionalServices.map((service, idx) => (
              <div key={idx} className="group p-4 bg-white dark:bg-gray-800 rounded-xl text-center opacity-75">
                <i className={`bi ${service.icon} text-3xl text-purple-600 dark:text-purple-400 mb-2 block`}></i>
                <h4 className="font-semibold text-sm dark:text-white mb-1">{service.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{service.desc}</p>
                <span className="text-xs text-yellow-500 mt-2 inline-block">قريباً</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Works Gallery */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">
              أحدث <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">أعمالنا</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400">إبداع يتحدث عن نفسه</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentWorks.map((work, idx) => (
              <div key={idx} className="group cursor-pointer relative overflow-hidden rounded-xl">
                <img 
                  src={work.image} 
                  alt={work.title} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div>
                    <p className="text-white text-xs">{work.category}</p>
                    <p className="text-white text-sm font-semibold">{work.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {advantages.map((adv, idx) => (
              <div key={idx} className="text-center">
                <i className={`bi ${adv.icon} text-5xl text-purple-600 dark:text-purple-400 mb-3 block`}></i>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{adv.number}</div>
                <h3 className="text-lg font-semibold mb-1 dark:text-white">{adv.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">
              آراء <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">عملائنا</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400">ما يقوله عملاؤنا عن تجربتهم معنا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-white">{test.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{test.role} • {test.date}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-yellow-400 text-sm ml-0.5"></i>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  "{test.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <i className="bi bi-megaphone-fill text-5xl mb-4 block"></i>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            انضم إلى فريق Bookera
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            كن شريكاً في النجاح وزد حجوزاتك مع أكبر منصة لتنظيم المناسبات في مصر
          </p>
          <button 
            onClick={() => navigate('/join-us')}
            className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold hover:shadow-xl transition-all"
          >
            سجل الآن كشريك
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز لتنظيم مناسبة أحلامك؟
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            تواصل مع مستشارينا الآن واحصل على استشارة مجانية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('main-services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              استكشف الخدمات
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              تواصل مع مستشار
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">B</span>
                </div>
                <span className="text-xl font-bold">Bookera</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                نصنع لحظات لا تُنسى بلمسة من الأناقة والرقي، منذ 10 أعوام ونحن نخدم عملائنا بأعلى معايير الجودة في مصر.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <div className="space-y-2">
                {['من نحن', 'خدماتنا', 'أعمالنا', 'المدونة', 'اتصل بنا', 'انضم لنا'].map((link) => (
                  <button 
                    key={link} 
                    onClick={() => link === 'انضم لنا' ? navigate('/join-us') : null}
                    className="block text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <div className="space-y-2">
                {mainServices.map((service) => (
                  <button 
                    key={service.id}
                    onClick={() => service.available && navigate(`/${service.id}`)}
                    className={`block text-sm transition-colors ${service.available ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                  >
                    {service.name} {!service.available && '(قريباً)'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات الاتصال</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <p><i className="bi bi-envelope-fill ml-2"></i> info@bookera.com</p>
                <p><i className="bi bi-telephone-fill ml-2"></i> +20 10 1234 5678</p>
                <p><i className="bi bi-whatsapp ml-2"></i> +20 10 1234 5679</p>
                <p><i className="bi bi-geo-alt-fill ml-2"></i> القاهرة، مصر</p>
                <p><i className="bi bi-clock-fill ml-2"></i> السبت - الخميس: 9ص - 9م</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-sm">© 2024 Bookera. جميع الحقوق محفوظة - مصر</p>
          </div>
        </div>
      </footer>

      {/* Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      {/* Custom CSS */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompanyHomePage;