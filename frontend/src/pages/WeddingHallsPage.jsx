import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// استيراد المكونات
import VenueDetails from "../components/wedding/VenueDetails";
import VenueCard from "../components/wedding/VenueCard";
import MobileFilters from "../components/wedding/MobileFilters";
import BookingModal from "../components/wedding/BookingModal";
import Footer from "../components/shared/Footer";
import VenuesMap from "../components/wedding/VenueMap";

const WeddingHallsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // استخدام useRef لحفظ حالة الفلاتر
  const filtersStateRef = useRef({
    priceRange: 50000,
    capacityRange: 500,
    selectedGovernorate: "all",
    selectedCity: "all",
    venueType: "all",
    locationType: "all",
    eventTypes: [],
    sortBy: "featured",
    searchQuery: "",
    hasPool: false,
    hasWifi: false,
    cateringService: false,
    hasStage: false,
    parkingCapacity: 0,
    minGuests: 0
  });

  // States for filtering
  const [priceRange, setPriceRange] = useState(filtersStateRef.current.priceRange);
  const [capacityRange, setCapacityRange] = useState(filtersStateRef.current.capacityRange);
  const [selectedGovernorate, setSelectedGovernorate] = useState(filtersStateRef.current.selectedGovernorate);
  const [selectedCity, setSelectedCity] = useState(filtersStateRef.current.selectedCity);
  const [venueType, setVenueType] = useState(filtersStateRef.current.venueType);
  const [locationType, setLocationType] = useState(filtersStateRef.current.locationType);
  const [eventTypes, setEventTypes] = useState(filtersStateRef.current.eventTypes);
  const [sortBy, setSortBy] = useState(filtersStateRef.current.sortBy);
  const [searchQuery, setSearchQuery] = useState(filtersStateRef.current.searchQuery);
  const [hasPool, setHasPool] = useState(filtersStateRef.current.hasPool);
  const [hasWifi, setHasWifi] = useState(filtersStateRef.current.hasWifi);
  const [cateringService, setCateringService] = useState(filtersStateRef.current.cateringService);
  const [hasStage, setHasStage] = useState(filtersStateRef.current.hasStage);
  const [parkingCapacity, setParkingCapacity] = useState(filtersStateRef.current.parkingCapacity);
  const [minGuests, setMinGuests] = useState(filtersStateRef.current.minGuests);

  // States for venues and UI
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [displayedVenues, setDisplayedVenues] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weddingVenues, setWeddingVenues] = useState([]);
  const [dataSource, setDataSource] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [itemsToShow, setItemsToShow] = useState(10);
  const [showMap, setShowMap] = useState(false);
  const [hoveredVenueId, setHoveredVenueId] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // صور السلايدر
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
      title: "قاعات فاخرة",
      subtitle: "أجواء راقية لمناسباتك الخاصة"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1464366400600-7168b6af0bc3?w=1200",
      title: "أجمل الأماكن",
      subtitle: "اختر من بين أفضل قاعات الأفراح"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
      title: "خدمات متكاملة",
      subtitle: "نقدم لك أفضل العروض والخدمات"
    }
  ];

  // محافظات مصر
  const governorates = {
    "all": { name: "كل المحافظات", cities: ["كل المدن"] },
    "القاهرة": {
      name: "القاهرة",
      cities: ["كل المدن", "مدينة نصر", "مصر الجديدة", "المعادي", "الزمالك", "الدقي", "العباسية", "شبرا", "الوايلي"]
    },
    "الإسكندرية": {
      name: "الإسكندرية",
      cities: ["كل المدن", "وسط البلد", "سموحة", "لوران", "المنتزه", "ستانلي", "العجمي", "أبو قير"]
    },
    "الجيزة": {
      name: "الجيزة",
      cities: ["كل المدن", "المهندسين", "الدقي", "العجوزة", "الهرم", "فيصل", "الشيخ زايد", "السادس من أكتوبر"]
    },
    "الغربية": {
      name: "الغربية",
      cities: ["كل المدن", "طنطا", "المحلة الكبرى", "زفتى", "سمنود", "بسيون", "قطور", "كفر الزيات"]
    }
  };

  // أنواع القاعات
  const venueTypes = {
    "all": "كل الأنواع",
    "قاعة_أفراح": "قاعة أفراح",
    "قصر": "قصر",
    "فندق": "فندق",
    "منتجع": "منتجع",
    "نادي": "نادي"
  };

  const locationTypes = {
    "all": "كل المواقع",
    "indoor": "داخلي",
    "outdoor": "خارجي",
    "mixed": "مختلط"
  };

  const availableEventTypes = {
    "engagement": "خطوبة",
    "katb_ketab": "كتب كتاب",
    "islamic_wedding": "فرح",
    "conference": "مؤتمرات",
    "birthday": "عيد ميلاد"
  };

  const eventTypeDisplayNames = {
    "engagement": "خطوبة",
    "katb_ketab": "كتب كتاب",
    "islamic_wedding": "فرح",
    "conference": "مؤتمرات",
    "birthday": "عيد ميلاد"
  };

  const sortOptions = {
    "featured": "مميز",
    "price_low": "السعر: من الأقل للأعلى",
    "price_high": "السعر: من الأعلى للأقل",
    "rating": "الأعلى تقييماً",
    "capacity": "السعة: من الأكبر للأصغر",
    "newest": "الأحدث"
  };

  // تأثير السلايدر التلقائي
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }, []);

  const handleEventTypeToggle = (eventType) => {
    setEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(type => type !== eventType)
        : [...prev, eventType]
    );
  };

  const clearAllEventTypes = () => {
    setEventTypes([]);
  };

  const getEventTypeDisplayName = (eventTypeKey) => {
    return eventTypeDisplayNames[eventTypeKey] || eventTypeKey;
  };

  // جلب البيانات
  useEffect(() => {
    const fetchAllWeddingVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const [page1Response, page2Response] = await Promise.all([
          fetch('http://localhost:5000/api/wedding-venues/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }),
          fetch('http://localhost:5000/api/wedding-venues/?page=2', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })
        ]);

        if (!page1Response.ok || !page2Response.ok) {
          throw new Error('فشل في جلب البيانات من الخادم');
        }

        const [page1Data, page2Data] = await Promise.all([
          page1Response.json(),
          page2Response.json()
        ]);

        const allVenues = [
          ...(page1Data.venues || []),
          ...(page2Data.venues || [])
        ];

        if (allVenues.length > 0) {
          const venuesWithId = allVenues.map(venue => ({
            ...venue,
            _id: venue.id || venue._id,
            images: venue.images || [venue.image],
            eventTypes: venue.supported_events || venue.event_types || venue.eventTypes || [],
            rating: venue.rating || 0,
            reviewCount: venue.reviewCount || 0,
            available: venue.available !== false,
            hasPool: venue.weddingSpecific?.hasPool || false,
            hasWifi: venue.weddingSpecific?.hasWifi || false,
            cateringService: venue.weddingSpecific?.cateringService || false,
            hasStage: venue.weddingSpecific?.hasStage || false,
            maxGuests: venue.weddingSpecific?.maxGuests || venue.capacity || 0,
            minGuests: venue.weddingSpecific?.minGuests || 0,
            parkingCapacity: venue.weddingSpecific?.parkingCapacity || 0
          }));

          setWeddingVenues(venuesWithId);
          setDataSource("api");
        } else {
          throw new Error('لا توجد بيانات في الـ API');
        }
      } catch (err) {
        console.error('❌ خطأ في جلب البيانات:', err);
        setDataSource("error");
        setError(`تعذر الاتصال بالخادم: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWeddingVenues();
  }, []);

  // فلترة الأماكن
  useEffect(() => {
    let filtered = weddingVenues.filter(venue => {
      const matchesSearch = searchQuery === "" ||
        venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = parseInt(venue.price || 0) <= priceRange;
      const matchesCapacity = parseInt(venue.capacity || 0) <= capacityRange;
      const matchesGovernorate = selectedGovernorate === "all" || venue.governorate === selectedGovernorate;
      const matchesCity = selectedCity === "all" || selectedCity === "كل المدن" || venue.city === selectedCity;
      const matchesVenueType = venueType === "all" || venue.type === venueType;
      
      let matchesLocationType = true;
      if (locationType !== "all") {
        const isOutdoor = venue.wedding_specific?.openAir === true;
        const env = isOutdoor ? "outdoor" : "indoor";
        matchesLocationType = locationType === "mixed" ? true : env === locationType;
      }
      
      let matchesEventTypes = true;
      if (eventTypes.length > 0 && venue.eventTypes) {
        const venueEventTypes = venue.eventTypes.map(type => String(type).toLowerCase().trim());
        matchesEventTypes = eventTypes.every(selectedType =>
          venueEventTypes.includes(String(selectedType).toLowerCase().trim())
        );
      }
      
      const matchesPool = !hasPool || venue.hasPool === true;
      const matchesWifi = !hasWifi || venue.hasWifi === true;
      const matchesCatering = !cateringService || venue.cateringService === true;
      const matchesStage = !hasStage || venue.hasStage === true;
      const matchesParking = parkingCapacity === 0 || (venue.parkingCapacity && venue.parkingCapacity >= parkingCapacity);
      const matchesMinGuests = minGuests === 0 || (venue.minGuests && venue.minGuests >= minGuests);

      return matchesSearch && matchesPrice && matchesCapacity && matchesGovernorate &&
        matchesCity && matchesVenueType && matchesLocationType && matchesEventTypes &&
        matchesPool && matchesWifi && matchesCatering && matchesStage && matchesParking && matchesMinGuests;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low": return (a.price || 0) - (b.price || 0);
        case "price_high": return (b.price || 0) - (a.price || 0);
        case "rating": return (b.rating || 0) - (a.rating || 0);
        case "capacity": return (b.capacity || 0) - (a.capacity || 0);
        case "newest": return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default: return (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredVenues(filtered);
    setItemsToShow(10);
  }, [searchQuery, priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventTypes, sortBy, weddingVenues, hasPool, hasWifi, cateringService, hasStage, parkingCapacity, minGuests]);

  useEffect(() => {
    setDisplayedVenues(filteredVenues.slice(0, itemsToShow));
  }, [filteredVenues, itemsToShow]);

  const loadMoreVenues = () => setItemsToShow(prev => prev + 5);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const resetFilters = () => {
    setPriceRange(50000);
    setCapacityRange(500);
    setSelectedGovernorate("all");
    setSelectedCity("all");
    setVenueType("all");
    setLocationType("all");
    setEventTypes([]);
    setSearchQuery("");
    setSortBy("featured");
    setHasPool(false);
    setHasWifi(false);
    setCateringService(false);
    setHasStage(false);
    setParkingCapacity(0);
    setMinGuests(0);
  };

  const handleVenueClick = (venue) => {
    const venueId = venue.id || venue._id;
    window.open(`/venue/${venueId}`, '_blank');
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedVenue(null);
    window.scrollTo(0, 0);
  };

  const handleGovernorateChange = (gov) => {
    setSelectedGovernorate(gov);
    setSelectedCity("all");
  };

  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setShowBookingModal(true);
    setBookingType("");
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingType("");
  };

  const shareVenue = async (venue, e) => {
    if (e) e.stopPropagation();
    const venueId = venue.id || venue._id;
    const shareUrl = `${window.location.origin}/venue/${venueId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: venue.name, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('✅ تم نسخ رابط القاعة');
      }
    } catch (error) {
      console.log('المشاركة ألغيت');
    }
  };

  if (currentView === "details" && selectedVenue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VenueDetails
          venue={selectedVenue}
          onBack={handleBackToList}
          onBookNow={handleBookNow}
          favorites={favorites}
          onToggleFavorite={(venueId, e) => {
            if (e) e.stopPropagation();
            favorites.includes(venueId) 
              ? setFavorites(favorites.filter(id => id !== venueId))
              : setFavorites([...favorites, venueId]);
          }}
          onShareVenue={shareVenue}
        />
        <BookingModal
          show={showBookingModal}
          onClose={closeBookingModal}
          venue={selectedVenue}
          bookingType={bookingType}
          onSetBookingType={setBookingType}
          user={user}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* زر العودة للأعلى */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section with Slider */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Slider Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => document.getElementById('venues-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                استكشف القاعات
              </button>
              <button
                onClick={() => navigate('/join-us')}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 border border-white/30"
              >
                انضم كشريك
              </button>
            </div>
          </motion.div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Slider Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">{weddingVenues.length}</span>
                <span className="text-gray-600">قاعة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">⭐ 4.7</span>
                <span className="text-gray-600">متوسط التقييم</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMap(false)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  !showMap ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                القائمة
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showMap ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                الخريطة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="venues-section" className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن قاعة، مدينة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                مسح الكل
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل القاعات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">حدث خطأ</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm p-8">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">لا توجد نتائج</h3>
            <p className="text-gray-600 mb-6">لم نجد قاعات تطابق معايير البحث</p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        ) : showMap ? (
          <VenuesMap
            venues={filteredVenues}
            onVenueClick={handleVenueClick}
            onVenueHover={setHoveredVenueId}
            activeVenueId={hoveredVenueId}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVenues.map((venue, index) => (
                <motion.div
                  key={venue.id || venue._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <VenueCard
                    venue={venue}
                    onVenueClick={handleVenueClick}
                    isFavorite={favorites.includes(venue.id || venue._id)}
                    onToggleFavorite={(venueId, e) => {
                      e.stopPropagation();
                      favorites.includes(venueId)
                        ? setFavorites(favorites.filter(id => id !== venueId))
                        : setFavorites([...favorites, venueId]);
                    }}
                    onBookNow={handleBookNow}
                    getEventTypeDisplayName={getEventTypeDisplayName}
                    isHovered={hoveredVenueId === (venue.id || venue._id)}
                  />
                </motion.div>
              ))}
            </div>

            {filteredVenues.length > displayedVenues.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreVenues}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                >
                  عرض المزيد ({filteredVenues.length - displayedVenues.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">لم تجد القاعة المناسبة؟</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            تواصل مع مستشارينا وسنساعدك في العثور على القاعة المثالية لحفل زفافك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+201040652783"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              📞 اتصل بنا
            </a>
            <button
              onClick={() => navigate('/join-us')}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-colors border border-white/30"
            >
              📩 طلب استشارة
            </button>
          </div>
        </div>
      </div>

      <Footer onNavigateHome={scrollToTop} />

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <MobileFilters
          onClose={() => setShowMobileFilters(false)}
          filtersProps={{
            searchQuery, onSearchChange: setSearchQuery,
            selectedGovernorate, onGovernorateChange: handleGovernorateChange,
            selectedCity, onCityChange: setSelectedCity,
            venueType, onVenueTypeChange: setVenueType,
            locationType, onLocationTypeChange: setLocationType,
            eventTypes, onEventTypesChange: setEventTypes,
            onEventTypeToggle: handleEventTypeToggle,
            priceRange, onPriceRangeChange: setPriceRange,
            capacityRange, onCapacityRangeChange: setCapacityRange,
            sortBy, onSortChange: setSortBy,
            hasPool, onHasPoolChange: setHasPool,
            hasWifi, onHasWifiChange: setHasWifi,
            cateringService, onCateringServiceChange: setCateringService,
            hasStage, onHasStageChange: setHasStage,
            parkingCapacity, onParkingCapacityChange: setParkingCapacity,
            minGuests, onMinGuestsChange: setMinGuests,
            onResetFilters: resetFilters,
            filteredVenues, weddingVenues, dataSource, favorites
          }}
          governorates={governorates}
          venueTypes={venueTypes}
          locationTypes={locationTypes}
          eventTypes={availableEventTypes}
          sortOptions={sortOptions}
          getEventTypeDisplayName={getEventTypeDisplayName}
        />
      )}

      <BookingModal
        show={showBookingModal}
        onClose={closeBookingModal}
        venue={selectedVenue}
        bookingType={bookingType}
        onSetBookingType={setBookingType}
        user={user}
      />
    </div>
  );
};

export default WeddingHallsPage;