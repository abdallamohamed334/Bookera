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
        
        const response = await fetch('http://localhost:5000/api/photographers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.photographers && data.photographers.length > 0) {
            const enhancedPhotographers = data.photographers.map((photographer, index) => ({
              id: photographer.id,
              _id: photographer.id,
              name: photographer.name,
              business_name: photographer.business_name,
              type: photographer.type,
              specialty: photographer.specialty,
              experience: photographer.experience,
              governorate: photographer.governorate,
              city: photographer.city,
              price: photographer.price,
              profile_image: photographer.profile_image,
              profileImage: photographer.profile_image,
              description: photographer.description,
              available: photographer.available,
              rating: photographer.rating || 0,
              total_reviews: photographer.total_reviews || 0,
              total_views: photographer.total_views || 0,
              total_bookings: photographer.total_bookings || 0,
              contact: photographer.contact,
              email: photographer.email,
              address: photographer.address,
              created_at: photographer.created_at,
              animationDelay: index * 0.1
            }));
            
            setPhotographers(enhancedPhotographers);
          } else {
            setPhotographers([]);
          }
        } else {
          throw new Error('فشل في جلب البيانات');
        }
      } catch (err) {
        const mockPhotographers = [
          {
            id: 1,
            name: "أحمد محمد",
            business_name: "أحمد محمد للتصوير",
            type: "freelancer",
            specialty: "تصوير أفراح",
            experience: 5,
            governorate: "القاهرة",
            city: "المعادي",
            price: "5000",
            profile_image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
            description: "مصور محترف متخصص في تصوير الأفراح والمناسبات",
            available: true,
            rating: 4.8,
            total_reviews: 24,
            total_views: 150,
            total_bookings: 45,
            contact: "+20123456789",
            email: "ahmed@example.com",
            address: "المعادي، القاهرة",
            created_at: new Date().toISOString(),
            tags: ["محترف", "سريع", "جودة عالية"],
            featured: true
          },
          {
            id: 2,
            name: "مريم أحمد",
            business_name: "Mariam Photography",
            type: "freelancer",
            specialty: "تصوير شخصي",
            experience: 3,
            governorate: "الجيزة",
            city: "الدقي",
            price: "2000",
            profile_image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80",
            description: "مصورة مبدعة متخصصة في التصوير الشخصي",
            available: true,
            rating: 4.9,
            total_reviews: 18,
            total_views: 200,
            total_bookings: 32,
            contact: "+20198765432",
            email: "mariam@example.com",
            address: "الدقي، الجيزة",
            created_at: new Date().toISOString(),
            tags: ["مبدعة", "أنثوي", "احترافي"],
            featured: true
          },
          {
            id: 3,
            name: "خالد علي",
            business_name: "خالد علي للتصوير",
            type: "agency",
            specialty: "تصوير طبيعة",
            experience: 8,
            governorate: "الجيزة",
            city: "الهرم",
            price: "3500",
            profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
            description: "مصور محترف للطبيعة والمناظر الخلابة",
            available: true,
            rating: 4.7,
            total_reviews: 12,
            total_views: 98,
            total_bookings: 23,
            contact: "+20111223344",
            email: "khaled@example.com",
            address: "الهرم، الجيزة",
            created_at: new Date().toISOString(),
            tags: ["طبيعة", "إبداعي", "مغامرة"]
          }
        ].map((photographer, index) => ({
          ...photographer,
          animationDelay: index * 0.1
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

    if (searchQuery) {
      filtered = filtered.filter(photographer => 
        photographer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter(photographer => photographer.specialty === activeFilter);
    }

    filtered = filtered.filter(photographer => {
      const photographerPrice = parseInt(photographer.price) || 0;
      return photographerPrice <= priceRange;
    });

    if (selectedGovernorate !== "all") {
      filtered = filtered.filter(photographer => photographer.governorate === selectedGovernorate);
    }

    if (selectedCity !== "all" && selectedCity !== "كل المدن") {
      filtered = filtered.filter(photographer => photographer.city === selectedCity);
    }

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

  const handlePhotographerClick = async (photographer) => {
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
    
    const rect = event.target.getBoundingClientRect();
    button.style.left = `${event.clientX - 25}px`;
    button.style.top = `${event.clientY - 25}px`;
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes explode {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    try {
      await fetch(`http://localhost:5000/api/photographers/${photographer.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          viewer_ip: await getClientIP()
        })
      });
    } catch (err) {
      // تم إزالة console.error
    }
    
    setTimeout(() => {
      document.body.removeChild(button);
      document.head.removeChild(style);
      navigate(`/photographer/${photographer.id}`);
    }, 500);
  };

  const getClientIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
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
      // تم إزالة console.error
    }
  };

  const getStats = () => {
    const totalRatings = photographers.reduce((sum, p) => sum + (p.rating || 0), 0);
    const avgRating = photographers.length > 0 ? (totalRatings / photographers.length).toFixed(1) : "4.8";
    
    return {
      photographersCount: photographers.length,
      avgRating: avgRating,
      totalBookings: photographers.reduce((sum, p) => sum + (p.total_bookings || 0), 0)
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
      {/* خلفيات متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
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

      {/* ✅ الهيدر المعدل - بشكل أنظف وأبسط */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* الشعار */}
            <div className="flex items-center gap-2">
              <div className="text-2xl">📸</div>
              <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Bookera
              </div>
            </div>

            {/* روابط التنقل */}
            <div className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">الرئيسية</a>
              <a href="/photographers" className="text-purple-600 font-medium border-b-2 border-purple-600 pb-0.5">المصورين</a>
              <a href="/wedding-halls" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">القاعات</a>
              <a href="/join-us" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">انضم إلينا</a>
            </div>

            {/* زر مشاركة + تسجيل دخول */}
            <div className="flex items-center gap-3">
              <button 
                onClick={sharePage}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                aria-label="مشاركة"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              
              <button className="hidden sm:flex px-4 py-2 text-purple-600 border border-purple-600 rounded-xl font-medium hover:bg-purple-600 hover:text-white transition-all duration-300">
                تسجيل دخول
              </button>
              
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300">
                حساب جديد
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* مسافة عشان المحتوى ما يختفي تحت الهيدر الثابت */}
      <div className="h-16"></div>

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
              className="text-4xl lg:text-6xl font-bold mb-5 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                اكتشف أفضل المصورين
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              اختر من بين نخبة المصورين المحترفين في مصر
            </motion.p>

            {/* شريط البحث */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مصور، تخصص، أو مدينة..."
                  className="w-full px-5 py-3.5 text-base rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all shadow-md"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
        className="relative py-10 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl mx-4 lg:mx-8 mb-12 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: stats.photographersCount, label: "مصور محترف", color: "from-purple-600 to-purple-400" },
              { number: 27, label: "محافظة", color: "from-indigo-600 to-indigo-400" },
              { number: stats.totalBookings, label: "حجز ناجح", color: "from-blue-600 to-blue-400" },
              { number: stats.avgRating, label: "متوسط التقييم", color: "from-green-600 to-green-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 counter`} data-target={stat.number}>
                  {loading ? "0" : stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم الفلاتر والمصورين */}
      <section className="py-8 w-full" id="photographers-section">
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
      <footer className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ابدأ رحلتك اليوم</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              تواصل مع أفضل المصورين المحترفين لتوثيق لحظاتك
            </p>
            <button
              onClick={() => document.getElementById('photographers-section').scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              استعرض المصورين
            </button>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>© 2024 Bookera. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

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