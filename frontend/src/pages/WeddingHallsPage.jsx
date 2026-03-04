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
  
  // State لإظهار/إخفاء زر العودة للرئيسية
  const [showBackToTop, setShowBackToTop] = useState(false);

  // محافظات مصر - الغربية فقط
  const governorates = {
    "all": { name: "كل المحافظات", cities: ["كل المدن"] },
    "الغربية": {
      name: "الغربية",
      cities: ["كل المدن", "شبرا النملة","طنطا", "المحلة الكبري", "زفتى", "سمنود", "بسيون", "قطور", "السنطه", "كفر الزيات", "صفتا", "شيخون"]
    }
  };

  // أنواع القاعات والمناسبات
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
    "indoor": "إن دور (داخلي)",
    "outdoor": "أوبن دور (خارجي)",
    "mixed": "مختلط"
  };

  // أنواع المناسبات لمطابقة supported_events من قاعدة البيانات
  const availableEventTypes = {
    "engagement": "خطوبة",
    "katb_ketab": "كتب كتاب",
    "islamic_wedding": "فرح",
    "conference": "مؤتمرات",
    "birthday": "عيد ميلاد"
  };

  // خريطة للتحويل من إنجليزي لعربي للعرض
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

  // التحكم في إظهار زر العودة للرئيسية عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تحميل CSS خاص بـ Leaflet
  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }, []);

  // دالة لإدارة event types
  const handleEventTypeToggle = (eventType) => {
    setEventTypes(prev => {
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      } else {
        return [...prev, eventType];
      }
    });
  };

  // دالة لتفريغ كل event types
  const clearAllEventTypes = () => {
    setEventTypes([]);
  };

  // دالة لتحويل event types للعرض في الواجهة
  const getEventTypeDisplayName = (eventTypeKey) => {
    return eventTypeDisplayNames[eventTypeKey] || eventTypeKey;
  };

  // جلب البيانات من جميع صفحات الـ API
  useEffect(() => {
    const fetchAllWeddingVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 جاري جلب جميع القاعات من جميع الصفحات...');

        // جلب الصفحتين معاً باستخدام Promise.all للحصول على كل القاعات
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

        // جمع القاعات من الصفحتين
        const allVenues = [
          ...(page1Data.venues || []),
          ...(page2Data.venues || [])
        ];

        console.log(`✅ الصفحة الأولى: ${page1Data.venues?.length || 0} قاعة`);
        console.log(`✅ الصفحة الثانية: ${page2Data.venues?.length || 0} قاعة`);
        console.log(`🎉 الإجمالي: ${allVenues.length} قاعة من كل الصفحات`);

        if (allVenues.length > 0) {
          const venuesWithId = allVenues.map(venue => ({
            ...venue,
            _id: venue.id || venue._id,
            images: venue.images || [venue.image],
            profile_image: venue.profile_image,
            features: venue.features || [],
            amenities: venue.amenities || [],
            rules: venue.rules || [],
            weddingSpecific: venue.weddingSpecific || {},
            // استخدام supported_events من قاعدة البيانات
            eventTypes: venue.supported_events || venue.event_types || venue.eventTypes || [],
            rating: venue.rating || 0,
            reviewCount: venue.reviewCount || 0,
            available: venue.available !== false,
            videos: venue.videos || [],
            specialOffer: venue.specialOffer || null,
            originalPrice: venue.originalPrice || null,
            discount: venue.discount || null,
            venue_environment: venue.venue_environment || (venue.openAir ? "outdoor" : "indoor"),
            // معلومات إضافية من weddingSpecific
            hasPool: venue.weddingSpecific?.hasPool || false,
            hasWifi: venue.weddingSpecific?.hasWifi || false,
            openAir: venue.weddingSpecific?.openAir || false,
            catering: venue.weddingSpecific?.catering || false,
            cateringService: venue.weddingSpecific?.cateringService || false,
            hasStage: venue.weddingSpecific?.hasStage || false,
            brideRoom: venue.weddingSpecific?.brideRoom || false,
            groomRoom: venue.weddingSpecific?.groomRoom || false,
            hasGarden: venue.weddingSpecific?.hasGarden || false,
            maxGuests: venue.weddingSpecific?.maxGuests || venue.capacity || 0,
            minGuests: venue.weddingSpecific?.minGuests || 0,
            parkingCapacity: venue.weddingSpecific?.parkingCapacity || 0
          }));

          console.log('✅ جميع القاعات المستلمة:', venuesWithId.map(v => v.name));
          console.log('📊 تفاصيل eventTypes:', 
            venuesWithId.map(v => ({ 
              name: v.name, 
              eventTypes: v.eventTypes,
              eventTypesLength: v.eventTypes?.length 
            }))
          );

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

  // تحديث حالة الفلاتر في useRef عند تغييرها
  useEffect(() => {
    filtersStateRef.current = {
      priceRange,
      capacityRange,
      selectedGovernorate,
      selectedCity,
      venueType,
      locationType,
      eventTypes,
      sortBy,
      searchQuery,
      hasPool,
      hasWifi,
      cateringService,
      hasStage,
      parkingCapacity,
      minGuests
    };
  }, [priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventTypes, sortBy, searchQuery, hasPool, hasWifi, cateringService, hasStage, parkingCapacity, minGuests]);

  // فلترة وترتيب الأماكن - معدلة للعمل مع جميع القاعات
  useEffect(() => {
    console.log('🔄 جاري تطبيق الفلاتر على جميع القاعات...');
    console.log('📊 إجمالي القاعات:', weddingVenues.length);
    console.log('🎯 الفلاتر الحالية:', {
      eventTypes,
      eventTypesCount: eventTypes.length,
      locationType,
      hasPool,
      hasWifi,
      cateringService,
      hasStage,
      parkingCapacity,
      minGuests,
      priceRange,
      capacityRange
    });

    let filtered = weddingVenues.filter(venue => {
      // 1. البحث النصي
      const matchesSearch = searchQuery === "" ||
        venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. السعر والسعة
      const matchesPrice = parseInt(venue.price || 0) <= priceRange;
      const matchesCapacity = parseInt(venue.capacity || 0) <= capacityRange;
      
      // 3. المحافظة والمدينة
      const matchesGovernorate = selectedGovernorate === "all" || venue.governorate === selectedGovernorate;
      const matchesCity = selectedCity === "all" || selectedCity === "كل المدن" || venue.city === selectedCity;
      
      // 4. نوع القاعة
      const matchesVenueType = venueType === "all" || venue.type === venueType;
      
      // 5. نوع الموقع (إن دور/أوبن دور)
      let matchesLocationType = true;

      if (locationType !== "all") {
        const isOutdoor = venue.wedding_specific?.openAir === true;
        const env = isOutdoor ? "outdoor" : "indoor";

        if (locationType === "indoor") {
          matchesLocationType = env === "indoor";
        } else if (locationType === "outdoor") {
          matchesLocationType = env === "outdoor";
        } else if (locationType === "mixed") {
          matchesLocationType = true;
        }
      }
      
      // 6. أنواع المناسبات
      let matchesEventTypes = true;
      if (eventTypes.length > 0) {
        if (!venue.eventTypes || venue.eventTypes.length === 0) {
          matchesEventTypes = false;
        } else {
          const venueEventTypes = venue.eventTypes.map(type => 
            String(type).toLowerCase().trim()
          );
          
          matchesEventTypes = eventTypes.every(selectedType => {
            const normalizedSelectedType = String(selectedType).toLowerCase().trim();
            const hasEventType = venueEventTypes.includes(normalizedSelectedType);
            
            return hasEventType;
          });
        }
      }
      
      // 7. الخدمات الإضافية
      const matchesPool = !hasPool || venue.hasPool === true;
      const matchesWifi = !hasWifi || venue.hasWifi === true;
      const matchesCatering = !cateringService || venue.cateringService === true;
      const matchesStage = !hasStage || venue.hasStage === true;
      
      // 8. موقف السيارات
      const matchesParking = parkingCapacity === 0 || 
        (venue.parkingCapacity && venue.parkingCapacity >= parkingCapacity);
      
      // 9. الحد الأدنى للضيوف
      const matchesMinGuests = minGuests === 0 || 
        (venue.minGuests && venue.minGuests >= minGuests);

      const result = matchesSearch && matchesPrice && matchesCapacity && 
        matchesGovernorate && matchesCity && matchesVenueType && 
        matchesLocationType && matchesEventTypes && matchesPool && 
        matchesWifi && matchesCatering && matchesStage && 
        matchesParking && matchesMinGuests;

      return result;
    });

    console.log(`📊 عدد النتائج بعد التصفية: ${filtered.length} من ${weddingVenues.length}`);
    
    if (filtered.length > 0) {
      console.log('✅ القاعات المصفاة:', filtered.map(f => f.name));
    }

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return (a.price || 0) - (b.price || 0);
        case "price_high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "capacity":
          return (b.capacity || 0) - (a.capacity || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredVenues(filtered);
    setItemsToShow(10);
  }, [
    searchQuery, priceRange, capacityRange, selectedGovernorate, selectedCity, 
    venueType, locationType, eventTypes, sortBy, weddingVenues,
    hasPool, hasWifi, cateringService, hasStage, parkingCapacity, minGuests
  ]);

  // تحديث القاعات المعروضة بناءً على itemsToShow
  useEffect(() => {
    setDisplayedVenues(filteredVenues.slice(0, itemsToShow));
  }, [filteredVenues, itemsToShow]);

  // دالة لتحميل المزيد من القاعات
  const loadMoreVenues = () => {
    setItemsToShow(prev => prev + 5);
  };

  const handleBackToHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    const resetValues = {
      priceRange: 50000,
      capacityRange: 500,
      selectedGovernorate: "all",
      selectedCity: "all",
      venueType: "all",
      locationType: "all",
      eventTypes: [],
      searchQuery: "",
      sortBy: "featured",
      hasPool: false,
      hasWifi: false,
      cateringService: false,
      hasStage: false,
      parkingCapacity: 0,
      minGuests: 0
    };

    setPriceRange(resetValues.priceRange);
    setCapacityRange(resetValues.capacityRange);
    setSelectedGovernorate(resetValues.selectedGovernorate);
    setSelectedCity(resetValues.selectedCity);
    setVenueType(resetValues.venueType);
    setLocationType(resetValues.locationType);
    setEventTypes(resetValues.eventTypes);
    setSearchQuery(resetValues.searchQuery);
    setSortBy(resetValues.sortBy);
    setHasPool(resetValues.hasPool);
    setHasWifi(resetValues.hasWifi);
    setCateringService(resetValues.cateringService);
    setHasStage(resetValues.hasStage);
    setParkingCapacity(resetValues.parkingCapacity);
    setMinGuests(resetValues.minGuests);

    filtersStateRef.current = resetValues;
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

  // مشاركة القاعة
  const shareVenue = async (venue, e) => {
    if (e) e.stopPropagation();

    const venueId = venue.id || venue._id;
    const shareUrl = `${window.location.origin}/venue/${venueId}`;
    const shareText = `شوف قاعة ${venue.name} في ${venue.city} - ${venue.description?.substring(0, 100)}...`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: venue.name,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('✅ تم نسخ رابط القاعة للحافظة');
      }
    } catch (error) {
      console.log('المشاركة ألغيت');
    }
  };

  // Render based on current view
  if (currentView === "details" && selectedVenue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <VenueDetails
          venue={selectedVenue}
          onBack={handleBackToList}
          onBookNow={handleBookNow}
          favorites={favorites}
          onToggleFavorite={(venueId, e) => {
            if (e) e.stopPropagation();
            if (favorites.includes(venueId)) {
              setFavorites(favorites.filter(id => id !== venueId));
            } else {
              setFavorites([...favorites, venueId]);
            }
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

  // Main List View
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
      
      {/* زر العودة للرئيسية - يظهر عند التمرير */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleBackToHome}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium hidden sm:inline">العودة للرئيسية</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* زر العودة للأعلى */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-50 bg-white border-2 border-amber-200 text-amber-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="font-medium hidden sm:inline">الأعلى</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section - بدون هيدر */}
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 text-gray-800 py-8 md:py-12 overflow-hidden">
        {/* عناصر زخرفية ذهبية */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-300 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          {/* شعار بسيط */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-200">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" />
                <path d="M15 12h1a2 2 0 002-2V6a2 2 0 00-2-2h-1a2 2 0 00-2 2v4a2 2 0 002 2zM4 16a2 2 0 002-2v-4a2 2 0 00-2-2H3a2 2 0 00-2 2v4a2 2 0 002 2h1z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-800">
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                قاعات الأفراح والمناسبات
              </span>
            </h1>
            
            <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              احجز القاعة المثالية لحفل زفافك، خطوبتك، كتب كتاب، عيد ميلاد، أو مؤتمر عملك.
              اختر من بين {weddingVenues.length} مكان مميز بأسعار مناسبة وتقييمات حقيقية
            </p>

            {/* Event Types Quick Filters - تصميم ذهبي */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
              {Object.entries(availableEventTypes).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleEventTypeToggle(key)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-300 text-xs md:text-sm font-medium ${eventTypes.includes(key)
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200'
                    : 'bg-white text-gray-700 border border-amber-200 hover:border-amber-300 hover:shadow-md'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Stats - بطاقات ذهبية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-amber-100 shadow-md">
              <div className="text-xl font-bold text-amber-600">{weddingVenues.length}</div>
              <div className="text-xs text-gray-600">قاعة مميزة</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-amber-100 shadow-md">
              <div className="text-xl font-bold text-amber-600">⭐ 4.7+</div>
              <div className="text-xs text-gray-600">تقييم متوسط</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-amber-100 shadow-md">
              <div className="text-xl font-bold text-amber-600">💼</div>
              <div className="text-xs text-gray-600">جميع المناسبات</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-amber-100 shadow-md">
              <div className="text-xl font-bold text-amber-600">📍</div>
              <div className="text-xs text-gray-600">إن دور & أوبن دور</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Search and Filter Header - تصميم ذهبي */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن قاعة، مدينة، أو خدمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-300 focus:bg-white"
                />
                <svg className="absolute right-4 top-3.5 w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>الفلاتر</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-300 shadow-sm"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-300 text-sm font-medium"
              >
                مسح الكل
              </button>
            </div>
          </div>

          {/* Active Filters Display - تصميم ذهبي */}
          {(selectedGovernorate !== "all" || selectedCity !== "all" || venueType !== "all" || locationType !== "all" || eventTypes.length > 0 || searchQuery || hasPool || hasWifi || cateringService || hasStage || parkingCapacity > 0 || minGuests > 0 || priceRange < 50000 || capacityRange < 500) && (
            <div className="mt-4 pt-4 border-t border-amber-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">الفلاتر النشطة:</span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  مسح الكل
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map(eventType => (
                  <span key={eventType} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium">
                    {getEventTypeDisplayName(eventType)}
                    <button
                      onClick={() => handleEventTypeToggle(eventType)}
                      className="hover:text-amber-900 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {selectedGovernorate !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    {governorates[selectedGovernorate]?.name}
                    <button onClick={() => setSelectedGovernorate("all")} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {selectedCity !== "all" && selectedCity !== "كل المدن" && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    {selectedCity}
                    <button onClick={() => setSelectedCity("all")} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {venueType !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    {venueTypes[venueType]}
                    <button onClick={() => setVenueType("all")} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {locationType !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    {locationTypes[locationType]}
                    <button onClick={() => setLocationType("all")} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {hasPool && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    مسبح
                    <button onClick={() => setHasPool(false)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {hasWifi && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    واي فاي
                    <button onClick={() => setHasWifi(false)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {cateringService && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    كترینج
                    <button onClick={() => setCateringService(false)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {hasStage && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    منصة
                    <button onClick={() => setHasStage(false)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {parkingCapacity > 0 && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    موقف {parkingCapacity}+
                    <button onClick={() => setParkingCapacity(0)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {minGuests > 0 && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    {minGuests}+ ضيوف
                    <button onClick={() => setMinGuests(0)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {priceRange < 50000 && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    حتى {priceRange.toLocaleString()} ج
                    <button onClick={() => setPriceRange(50000)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
                
                {capacityRange < 500 && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs">
                    حتى {capacityRange} شخص
                    <button onClick={() => setCapacityRange(500)} className="hover:text-amber-900 text-xs">×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {showMap ? 'الخريطة التفاعلية' : 'القاعات المتاحة'}
              <span className="mr-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {filteredVenues.length} قاعة
              </span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {loading ? "جاري التحميل..." : showMap ? 
                `شاهد مواقع ${filteredVenues.length} قاعة على الخريطة` : 
                `عرض ${displayedVenues.length} من ${filteredVenues.length} قاعة`}
            </p>
          </div>
          
          {/* أزرار التبديل - تصميم ذهبي */}
          <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                !showMap 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                القائمة
              </div>
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                showMap 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                الخريطة
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Filters Button - تصميم ذهبي */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            عرض وتعديل جميع الفلاتر
          </button>
        </div>

        {/* عرض الخريطة أو القائمة */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">جاري تحميل جميع القاعات...</p>
              <p className="text-gray-500 text-sm mt-2">نبحث عن أفضل الأماكن لحفل زفافك</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-gray-700 mb-3">حدث خطأ في الاتصال</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700 mb-3">لا توجد نتائج</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">لم نتمكن من العثور على قاعات تطابق معايير البحث. حاول تعديل الفلاتر أو البحث بكلمات أخرى.</p>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                مسح كل الفلاتر
              </button>
            </div>
          ) : showMap ? (
            // عرض الخريطة
            <div className="space-y-6">
              <VenuesMap
                venues={filteredVenues}
                onVenueClick={handleVenueClick}
                onVenueHover={setHoveredVenueId}
                activeVenueId={hoveredVenueId}
              />
              
              {/* ملخص تحت الخريطة - تصميم ذهبي */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border border-amber-100 rounded-lg">
                    <div className="text-lg font-bold text-amber-600">{filteredVenues.length}</div>
                    <div className="text-sm text-gray-600">قاعة في الخريطة</div>
                  </div>
                  <div className="text-center p-3 border border-amber-100 rounded-lg">
                    <div className="text-lg font-bold text-amber-600">
                      {filteredVenues.filter(v => v.type === 'قاعة_أفراح').length}
                    </div>
                    <div className="text-sm text-gray-600">قاعات أفراح</div>
                  </div>
                  <div className="text-center p-3 border border-amber-100 rounded-lg">
                    <div className="text-lg font-bold text-amber-600">
                      {filteredVenues.filter(v => v.type === 'قصر').length}
                    </div>
                    <div className="text-sm text-gray-600">قصور</div>
                  </div>
                  <div className="text-center p-3 border border-amber-100 rounded-lg">
                    <div className="text-lg font-bold text-amber-600">
                      {Math.round(filteredVenues.reduce((sum, v) => sum + (v.price || 0), 0) / filteredVenues.length).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">متوسط السعر</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // عرض القائمة
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayedVenues.map((venue) => (
                  <VenueCard
                    key={venue.id || venue._id}
                    venue={venue}
                    onVenueClick={handleVenueClick}
                    isFavorite={favorites.includes(venue.id || venue._id)}
                    onToggleFavorite={(venueId, e) => {
                      if (e) e.stopPropagation();
                      if (favorites.includes(venueId)) {
                        setFavorites(favorites.filter(id => id !== venueId));
                      } else {
                        setFavorites([...favorites, venueId]);
                      }
                    }}
                    onBookNow={handleBookNow}
                    getEventTypeDisplayName={getEventTypeDisplayName}
                    isHovered={hoveredVenueId === (venue.id || venue._id)}
                  />
                ))}
              </div>

              {/* Load More Button - تصميم ذهبي */}
              {filteredVenues.length > displayedVenues.length && (
                <div className="text-center mt-8 md:mt-12">
                  <button
                    onClick={loadMoreVenues}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 md:px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                    </svg>
                    عرض المزيد ({filteredVenues.length - displayedVenues.length} متبقية)
                  </button>
                  <p className="text-gray-500 text-sm mt-3">
                    عرض {displayedVenues.length} من أصل {filteredVenues.length} قاعة
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA - تصميم ذهبي */}
      {!loading && filteredVenues.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-t border-amber-200 mt-8 md:mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">لم تجد القاعة المناسبة؟</h3>
              <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base px-4">
                يمكننا مساعدتك في العثور على القاعة المثالية. تواصل مع مستشارينا للحصول على توصيات شخصية
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
                <button
                  onClick={() => window.location.href = 'tel:+201040652783'}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm md:text-base"
                >
                  📞 تواصل معنا الآن
                </button>
                <button
                  onClick={() => navigate('/join-us')}
                  className="bg-white text-gray-700 border border-amber-200 hover:border-amber-300 hover:bg-amber-50 px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow font-medium text-sm md:text-base"
                >
                  📩 طلب استشارة مجانية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer onNavigateHome={handleBackToHome} />

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <MobileFilters
          onClose={() => setShowMobileFilters(false)}
          filtersProps={{
            searchQuery,
            onSearchChange: setSearchQuery,
            selectedGovernorate,
            onGovernorateChange: handleGovernorateChange,
            selectedCity,
            onCityChange: setSelectedCity,
            venueType,
            onVenueTypeChange: setVenueType,
            locationType,
            onLocationTypeChange: setLocationType,
            eventTypes,
            onEventTypesChange: setEventTypes,
            onEventTypeToggle: handleEventTypeToggle,
            priceRange,
            onPriceRangeChange: setPriceRange,
            capacityRange,
            onCapacityRangeChange: setCapacityRange,
            sortBy,
            onSortChange: setSortBy,
            hasPool,
            onHasPoolChange: setHasPool,
            hasWifi,
            onHasWifiChange: setHasWifi,
            cateringService,
            onCateringServiceChange: setCateringService,
            hasStage,
            onHasStageChange: setHasStage,
            parkingCapacity,
            onParkingCapacityChange: setParkingCapacity,
            minGuests,
            onMinGuestsChange: setMinGuests,
            onResetFilters: resetFilters,
            filteredVenues,
            weddingVenues,
            dataSource,
            favorites
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