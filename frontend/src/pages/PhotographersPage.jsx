import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/photografer/Navbar";
import HeroSection from "../components/photografer/HeroSection";
import FiltersSection from "../components/photografer/FiltersSection";
import PhotographersGrid from "../components/photografer/PhotographersGrid";
import { motion, AnimatePresence } from "framer-motion";

const PhotographersPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photographers, setPhotographers] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPhotographer, setHoveredPhotographer] = useState(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // تأثير Parallax
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        setParallaxOffset(scrollY * 0.3);
        setShowScrollTop(scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تأثير Stats Counter
  useEffect(() => {
    if (!loading && statsRef.current) {
      const counters = document.querySelectorAll('.counter');
      const speed = 200;

      counters.forEach(counter => {
        const updateCount = () => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const increment = target / speed;

          if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
          } else {
            counter.innerText = target;
          }
        };

        updateCount();
      });
    }
  }, [loading]);

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true);
        
        // مؤشر تحميل متحرك
        const loadingInterval = setInterval(() => {
          console.log('🔄 جاري تحميل البيانات...');
        }, 1000);

        const response = await fetch('http://localhost:5000/api/photographers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        clearInterval(loadingInterval);

        if (response.ok) {
          const data = await response.json();
          
          if (data.photographers && data.photographers.length > 0) {
            // إضافة تأثير ظهور تدريجي
            const enhancedPhotographers = data.photographers.map((photographer, index) => ({
              ...photographer,
              animationDelay: index * 0.1,
              id: photographer._id || `photographer-${index}`
            }));
            
            setPhotographers(enhancedPhotographers);
            
            // تأثير ظهور سحري للبيانات
            setTimeout(() => {
              document.querySelectorAll('.photographer-card').forEach((card, idx) => {
                card.style.animationDelay = `${idx * 0.1}s`;
              });
            }, 100);
          }
        } else {
          throw new Error('فشل في جلب البيانات');
        }
      } catch (err) {
        console.error('❌ خطأ في جلب البيانات:', err);
        
        // بيانات تجريبية بتأثيرات إضافية
        const mockPhotographers = [
          {
            _id: "1",
            name: "أحمد محمد",
            specialty: "تصوير أفراح",
            price: 5000,
            rating: 4.8,
            experience: 5,
            city: "المعادي",
            governorate: "القاهرة",
            profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
            description: "مصور محترف متخصص في تصوير الأفراح والمناسبات",
            services: ["تصوير كامل للفرح", "ألبوم صور فاخر", "فيديو احترافي"],
            portfolio: [
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&q=80"
            ],
            packages: [
              { name: "الباقة الأساسية", price: 3000 },
              { name: "الباقة المتكاملة", price: 5000 }
            ],
            tags: ["محترف", "سريع", "جودة عالية"],
            featured: true
          },
          {
            _id: "2",
            name: "مريم أحمد",
            specialty: "تصوير شخصي",
            price: 2000,
            rating: 4.9,
            experience: 3,
            city: "الدقي",
            governorate: "الجيزة",
            profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80",
            description: "مصورة مبدعة متخصصة في التصوير الشخصي",
            services: ["جلسات تصوير شخصية", "تصوير فوتوشوت", "تعديل احترافي"],
            portfolio: [
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
              "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80"
            ],
            packages: [
              { name: "جلسة شخصية", price: 1500 }
            ],
            tags: ["مبدعة", "أنثوي", "احترافي"],
            featured: true
          },
          {
            _id: "3",
            name: "خالد علي",
            specialty: "تصوير طبيعة",
            price: 3500,
            rating: 4.7,
            experience: 8,
            city: "الهرم",
            governorate: "الجيزة",
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
            description: "مصور محترف للطبيعة والمناظر الخلابة",
            services: ["تصوير طبيعة", "تصوير حياة برية", "فيديو وثائقي"],
            portfolio: [
              "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80"
            ],
            packages: [
              { name: "رحلة تصوير", price: 3500 }
            ],
            tags: ["طبيعة", "إبداعي", "مغامرة"]
          }
        ].map((photographer, index) => ({
          ...photographer,
          animationDelay: index * 0.1,
          id: photographer._id
        }));
        
        setPhotographers(mockPhotographers);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchPhotographers();
  }, []);

  // فلترة المصورين
  useEffect(() => {
    let filtered = [...photographers];

    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(photographer => 
        photographer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلترات أخرى
    filtered = filtered.filter(photographer => {
      const matchesSpecialty = activeFilter === "all" || photographer.specialty === activeFilter;
      const matchesPrice = parseInt(photographer.price) <= priceRange;
      const matchesGovernorate = selectedGovernorate === "all" || photographer.governorate === selectedGovernorate;
      const matchesCity = selectedCity === "all" || selectedCity === "كل المدن" || photographer.city === selectedCity;
      
      return matchesSpecialty && matchesPrice && matchesGovernorate && matchesCity;
    });

    setFilteredPhotographers(filtered);
  }, [activeFilter, priceRange, selectedGovernorate, selectedCity, searchQuery, photographers]);

  const resetFilters = () => {
    setActiveFilter("all");
    setSelectedGovernorate("all");
    setSelectedCity("all");
    setPriceRange(10000);
    setSearchQuery("");
  };

  const handleGovernorateChange = (gov) => {
    setSelectedGovernorate(gov);
    setSelectedCity("all");
  };

  const handlePhotographerClick = (photographer) => {
    // تأثير انفجار عند النقر
    const button = document.createElement('div');
    button.className = 'click-effect';
    button.style.cssText = `
      position: fixed;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(147,51,234,0.8) 0%, rgba(79,70,229,0.6) 100%);
      pointer-events: none;
      animation: explode 0.6s ease-out forwards;
      z-index: 10000;
    `;
    
    document.body.appendChild(button);
    
    // تحديد موقع النقر
    const rect = event.target.getBoundingClientRect();
    button.style.left = `${event.clientX - 25}px`;
    button.style.top = `${event.clientY - 25}px`;
    
    // إضافة animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes explode {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // فتح الصفحة بعد التأثير
    setTimeout(() => {
      document.body.removeChild(button);
      document.head.removeChild(style);
      const photographerUrl = `/photographer/${photographer._id}`;
      window.open(photographerUrl, '_blank');
    }, 500);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const sharePage = async () => {
    try {
      const shareUrl = window.location.href;
      const shareText = "📸 اكتشف أفضل المصورين المحترفين في مصر!";
      
      if (navigator.share) {
        await navigator.share({
          title: 'المصورين المحترفين',
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        
        // إشعار أنيق
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
          ">
            ✅ تم نسخ رابط الصفحة!
          </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease-out forwards';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
        
        // إضافة animation CSS
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => document.head.removeChild(style), 2300);
      }
    } catch (err) {
      console.error('خطأ في المشاركة:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
      {/* خلفيات متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* جسيمات متحركة */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* زر العودة للأعلى */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              للأعلى
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* الهيدر */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative bg-white/80 backdrop-blur-lg border-b border-gray-100 py-4 px-6 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            📸 Bookera
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sharePage}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            مشاركة الصفحة
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0" style={{ transform: `translateY(${parallaxOffset}px)` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                اكتشف فناني الصورة
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              أفضل المصورين المحترفين الذين يلتقطون لحظاتك بأعلى مستويات الجودة والإبداع
            </motion.p>

            {/* شريط البحث */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مصور، تخصص، أو مدينة..."
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all shadow-lg"
                />
                <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* إحصائيات */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        ref={statsRef}
        className="relative py-12 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-3xl mx-4 lg:mx-8 mb-16 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: photographers.length, label: "مصور محترف", color: "from-purple-600 to-purple-400" },
              { number: 27, label: "محافظة", color: "from-indigo-600 to-indigo-400" },
              { number: 1500, label: "مناسبة ملتقطة", color: "from-blue-600 to-blue-400" },
              { number: "4.8", label: "متوسط التقييم", color: "from-green-600 to-green-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 counter`} data-target={stat.number}>
                  {loading ? "0" : stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم الفلاتر والمصورين */}
      <section className="py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FiltersSection
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedGovernorate={selectedGovernorate}
            setSelectedGovernorate={handleGovernorateChange}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            resetFilters={resetFilters}
            filteredCount={filteredPhotographers.length}
            totalCount={photographers.length}
          />

          <PhotographersGrid
            photographers={filteredPhotographers}
            loading={loading}
            onPhotographerClick={handlePhotographerClick}
            onHover={setHoveredPhotographer}
          />
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-20"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">ابدأ رحلتك البصرية اليوم</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              تواصل مع أفضل المصورين المحترفين لتوثيق لحظاتك بأسلوب إبداعي لا يُنسى
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('photographers-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all"
            >
              استعرض المصورين الآن 🚀
            </motion.button>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Bookera. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </motion.footer>

      {/* إضافة أنماط CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .photographer-card {
          animation: cardAppear 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes cardAppear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gradient-border {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
        }
      `}</style>
    </div>
  );
};

export default PhotographersPage;