import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const ConferenceHallsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(15000);
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [currentView, setCurrentView] = useState("list");

  // بيانات قاعات المؤتمرات
  const conferenceVenues = [
    {
      id: 1,
      name: "مركز المؤتمرات الدولي",
      type: "قاعة مؤتمرات",
      category: "فاخرة",
      location: "الرياض",
      capacity: 500,
      price: 15000,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
      ],
      features: ["شاشات عرض كبيرة", "نظام ترجمة فورية", "واي فاي عالي السرعة", "تكييف مركزي", "قاعات فرعية", "خدمات إدارية"],
      description: "مركز مؤتمرات دولي مجهز بأحدث التقنيات، مثالي للمؤتمرات والندوات الكبيرة.",
      available: true,
      rating: 4.9,
      contact: "0550123461",
      email: "conference@venues.com",
      address: "حي الملقا، الرياض",
      amenities: ["واي فاي مجاني", "مواقف سيارات", "تكييف مركزي", "مصلى", "مطعم"],
      rules: ["الحجز المسبق مطلوب", "التزام بموعد البداية والنهاية"],
      conferenceSpecific: {
        projectors: 3,
        translation: true,
        breakoutRooms: 5,
        recording: true,
        techSupport: true
      }
    },
    {
      id: 2,
      name: "قاعة الأعمال",
      type: "قاعة مؤتمرات",
      category: "عصرية",
      location: "جدة",
      capacity: 150,
      price: 6000,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
      ],
      features: ["تصميم عصري", "شاشات تفاعلية", "نظام صوت متكامل", "إنترنت فائق السرعة", "خدمة القهوة"],
      description: "قاعة مؤتمرات عصرية مصممة خصيصاً للاجتماعات والتدريبات المتوسطة.",
      available: true,
      rating: 4.7,
      contact: "0550123462",
      email: "business@venues.com",
      address: "حي الشرفية، جدة",
      amenities: ["واي فاي مجاني", "مواقف سيارات", "تكييف مركزي", "مطبخ صغير"],
      rules: ["الحجز قبل 48 ساعة", "الالتزام بالتعليمات"],
      conferenceSpecific: {
        projectors: 2,
        translation: false,
        breakoutRooms: 2,
        recording: true,
        techSupport: true
      }
    },
    {
      id: 3,
      name: "قاعة الندوات",
      type: "قاعة مؤتمرات",
      category: "متوسطة",
      location: "المدينة المنورة",
      capacity: 80,
      price: 3500,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
      images: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
      ],
      features: ["شاشة عرض", "نظام صوتي", "إنترنت سريع", "تكييف", "خدمة القهوة"],
      description: "قاعة مناسبة للندوات وورش العمل الصغيرة، تتميز بجوها المريح وتجهيزاتها الأساسية.",
      available: true,
      rating: 4.5,
      contact: "0550123463",
      email: "seminars@venues.com",
      address: "حي العزيزية، المدينة المنورة",
      amenities: ["واي فاي مجاني", "مواقف سيارات", "تكييف", "مطبخ صغير"],
      rules: ["الحجز قبل 24 ساعة", "الالتزام بالوقت المحدد"],
      conferenceSpecific: {
        projectors: 1,
        translation: false,
        breakoutRooms: 1,
        recording: false,
        techSupport: false
      }
    }
  ];

  // المواقع المتاحة
  const locations = ["all", "الرياض", "جدة", "المدينة المنورة", "الدمام"];

  // فلترة الأماكن
  useEffect(() => {
    const filtered = conferenceVenues.filter(venue => {
      const matchesCategory = activeFilter === "all" || venue.category === activeFilter;
      const matchesPrice = venue.price <= priceRange;
      const matchesLocation = locationFilter === "all" || venue.location === locationFilter;
      
      return matchesCategory && matchesPrice && matchesLocation;
    });
    setFilteredVenues(filtered);
  }, [activeFilter, priceRange, locationFilter]);

  // العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate("/");
  };

  // عرض النجوم للتقييم
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm mr-1">({rating})</span>
      </div>
    );
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setActiveFilter("all");
    setLocationFilter("all");
    setPriceRange(15000);
  };

  // عرض تفاصيل القاعة
  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setCurrentView("details");
  };

  // العودة لقائمة الأماكن
  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedVenue(null);
  };

  // صفحة تفاصيل القاعة
  const VenueDetails = ({ venue }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={handleBackToList}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                العودة للقائمة
              </button>
              <h1 className="text-2xl font-bold text-gray-900">تفاصيل القاعة</h1>
              <div className="w-8"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Images Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden h-96 lg:h-[500px]">
                <img 
                  src={venue.images[selectedImage]} 
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {venue.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden h-24 border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${venue.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {venue.price.toLocaleString()} ر.س
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>السعة:</span>
                    <span className="font-medium">{venue.capacity} شخص</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المكان:</span>
                    <span className="font-medium">{venue.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التقييم:</span>
                    <span className="font-medium">{renderStars(venue.rating)}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-4 transition-colors">
                  احجز الآن
                </button>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{venue.name}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{venue.description}</p>
                
                {/* Conference Specific Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">مميزات خاصة بالمؤتمرات</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">عدد أجهزة العرض: {venue.conferenceSpecific.projectors}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${venue.conferenceSpecific.translation ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">نظام ترجمة فورية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">القاعات الفرعية: {venue.conferenceSpecific.breakoutRooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${venue.conferenceSpecific.recording ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">تسوير الفعاليات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${venue.conferenceSpecific.techSupport ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">دعم فني</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">المميزات العامة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {venue.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">المرافق</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">الشروط والأحكام</h3>
                  <div className="space-y-2">
                    {venue.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {rule}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">الهاتف</div>
                      <div className="font-medium text-gray-900">{venue.contact}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">البريد الإلكتروني</div>
                      <div className="font-medium text-gray-900">{venue.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">العنوان</div>
                      <div className="font-medium text-gray-900">{venue.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">طلب حجز</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>08:00 صباحاً - 12:00 ظهراً</option>
                      <option>12:00 ظهراً - 04:00 مساءً</option>
                      <option>04:00 مساءً - 08:00 مساءً</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأشخاص</label>
                    <input 
                      type="number" 
                      min="1"
                      max={venue.capacity}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    تأكيد الحجز
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  if (currentView === "details" && selectedVenue) {
    return <VenueDetails venue={selectedVenue} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 w-full">
      {/* Navigation */}
      <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">قاعات المؤتمرات</h1>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                الرئيسية
              </button>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                العروض الخاصة
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                خدمات إضافية
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                اتصل بنا
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <button className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                    تسجيل الدخول
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    إنشاء حساب
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            قاعات المؤتمرات
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            اكتشف أفضل قاعات المؤتمرات المجهزة بأحدث التقنيات للاجتماعات والندوات والمؤتمرات
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => document.getElementById('venues-section').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            استعرض القاعات
          </motion.button>
        </div>
      </section>

      {/* فلترة وعرض الأماكن */}
      <section id="venues-section" className="py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-full">
            <div className="flex flex-col lg:flex-row w-full">
              {/* Filters Sidebar */}
              <div className="lg:w-1/4 bg-gray-50 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className='text-xl font-semibold text-blue-600'>فلاتر البحث</h3>
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      إعادة تعيين
                    </button>
                  </div>
                  
                  {/* فلترة الموقع */}
                  <div className="mb-6">
                    <h4 className="text-gray-900 font-medium mb-3">المدينة</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {locations.map((location) => (
                        <button
                          key={location}
                          onClick={() => setLocationFilter(location)}
                          className={`w-full text-right px-3 py-2 rounded-lg transition-colors duration-200 ${
                            locationFilter === location
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {location === "all" ? "جميع المدن" : location}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* فلترة النوع */}
                  <div className="mb-6">
                    <h4 className="text-gray-900 font-medium mb-3">التصنيف</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {["all", "فاخرة", "عصرية", "متوسطة"].map((category) => (
                        <button
                          key={category}
                          onClick={() => setActiveFilter(category)}
                          className={`w-full text-right px-3 py-2 rounded-lg transition-colors duration-200 ${
                            activeFilter === category
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {category === "all" ? "جميع التصنيفات" : category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* فلترة السعر */}
                  <div className="mb-6">
                    <h4 className="text-gray-900 font-medium mb-3">السعر: حتى {priceRange.toLocaleString()} ر.س</h4>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full mb-2"
                    />
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>1,000</span>
                      <span>20,000</span>
                    </div>
                  </div>

                  {/* إحصائيات */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">إحصائيات البحث</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <div>القاعات المتاحة: <span className="font-bold">{filteredVenues.length}</span></div>
                      <div>متوسط السعر: <span className="font-bold">
                        {filteredVenues.length > 0 
                          ? Math.round(filteredVenues.reduce((sum, v) => sum + v.price, 0) / filteredVenues.length).toLocaleString() 
                          : 0} ر.س
                      </span></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* شبكة عرض الأماكن */}
              <div className="lg:w-3/4 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      قاعات المؤتمرات المتاحة ({filteredVenues.length})
                    </h3>
                    <p className="text-gray-600 mt-1">تم العثور على {filteredVenues.length} قاعة تناسب معايير البحث</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                      السعة: {filteredVenues.reduce((min, v) => Math.min(min, v.capacity), Infinity)}-{filteredVenues.reduce((max, v) => Math.max(max, v.capacity), 0)} شخص
                    </div>
                  </div>
                </div>

                {filteredVenues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
                    <p className="text-gray-600">جرب تغيير الفلاتر للحصول على نتائج أكثر</p>
                    <button 
                      onClick={resetFilters}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      إعادة تعيين الفلاتر
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredVenues.map((venue) => (
                      <motion.div
                        key={venue.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-300 hover:shadow-lg"
                        onClick={() => handleVenueClick(venue)}
                      >
                        <div className="relative h-48 flex-shrink-0">
                          <img 
                            src={venue.image} 
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                          {!venue.available && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <span className="text-white font-bold bg-red-600 px-4 py-2 rounded-full">
                                غير متاح
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {venue.price.toLocaleString()} ر.س
                          </div>
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
                            {venue.location}
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded">
                            {renderStars(venue.rating)}
                          </div>
                        </div>
                        
                        <div className="p-4 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{venue.name}</h4>
                            <span className="text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded">
                              {venue.capacity} شخص
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{venue.type}</p>
                          <div className="flex flex-wrap gap-1 mb-4 flex-grow">
                            {venue.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {feature}
                              </span>
                            ))}
                            {venue.features.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                +{venue.features.length - 3} أكثر
                              </span>
                            )}
                          </div>
                          <div className="mt-auto flex gap-2">
                            <button 
                              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                                venue.available 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                              disabled={!venue.available}
                            >
                              {venue.available ? 'عرض التفاصيل' : 'غير متاح'}
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors">
                              ♡
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferenceHallsPage;