import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

// استيراد المكونات مباشرة بدون lazy loading
import VenueDetails from "../components/wedding/VenueDetails";
import VenueCard from "../components/wedding/VenueCard";
import FiltersSidebar from "../components/wedding/FiltersSidebar";
import MobileFilters from "../components/wedding/MobileFilters";
import BookingModal from "../components/wedding/BookingModal";
import Navigation from "../components/shared/Navigation";
import Footer from "../components/shared/Footer";

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
    eventType: "all",
    sortBy: "featured",
    searchQuery: ""
  });

  // States for filtering - استخدام القيم المحفوظة
  const [priceRange, setPriceRange] = useState(filtersStateRef.current.priceRange);
  const [capacityRange, setCapacityRange] = useState(filtersStateRef.current.capacityRange);
  const [selectedGovernorate, setSelectedGovernorate] = useState(filtersStateRef.current.selectedGovernorate);
  const [selectedCity, setSelectedCity] = useState(filtersStateRef.current.selectedCity);
  const [venueType, setVenueType] = useState(filtersStateRef.current.venueType);
  const [locationType, setLocationType] = useState(filtersStateRef.current.locationType);
  const [eventType, setEventType] = useState(filtersStateRef.current.eventType);
  const [sortBy, setSortBy] = useState(filtersStateRef.current.sortBy);
  
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weddingVenues, setWeddingVenues] = useState([]);
  const [dataSource, setDataSource] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState(filtersStateRef.current.searchQuery);
  
  // States for UI
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState("");

  // محافظات مصر - الغربية فقط
  const governorates = {
    "all": { name: "كل المحافظات", cities: ["كل المدن"] },
    "الغربية": { 
      name: "الغربية", 
      cities: ["كل المدن", "طنطا", "المحلة الكبرى", "زفتى", "سمنود", "بسيون", "قطور", "السنطه", "كفر الزيات", "صفتا", "شيخون"] 
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
    "open": "أوبن دور",
    "closed": "إن دور",
    "mixed": "مختلط"
  };

  const eventTypes = {
    "all": "كل المناسبات",
    "فرح": "فرح",
    "خطوبة": "خطوبة",
    "كتب_كتاب": "كتب كتاب",
    "حفلة": "حفلة",
    "مناسبة_عمل": "مناسبة عمل"
  };

  const sortOptions = {
    "featured": "مميز",
    "price_low": "السعر: من الأقل للأعلى",
    "price_high": "السعر: من الأعلى للأقل",
    "rating": "الأعلى تقييماً",
    "capacity": "السعة: من الأكبر للأصغر",
    "newest": "الأحدث"
  };

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchWeddingVenues = async () => {
      try {
        setLoading(true);
        setError(null);
        
     const response = await fetch(`https://bookera-production.up.railway.app/api/wedding-venues`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});


        if (response.ok) {
          const data = await response.json();
          
          if (data.venues && data.venues.length > 0) {
            const venuesWithId = data.venues.map(venue => ({
              ...venue,
              _id: venue.id || venue._id,
              images: venue.images || [venue.image],
              features: venue.features || [],
              amenities: venue.amenities || [],
              rules: venue.rules || [],
              weddingSpecific: venue.weddingSpecific || {},
              rating: venue.rating || 0,
              reviewCount: venue.reviewCount || 0,
              available: venue.available !== false,
              videos: venue.videos || [],
              specialOffer: venue.specialOffer || null,
              originalPrice: venue.originalPrice || null,
              discount: venue.discount || null
            }));
            
            setWeddingVenues(venuesWithId);
            setDataSource("api");
          } else {
            throw new Error('لا توجد بيانات في الـ API');
          }
        } else {
          throw new Error(`فشل في جلب البيانات: ${response.status}`);
        }
      } catch (err) {
        console.error('❌ خطأ في جلب البيانات:', err);
        setDataSource("error");
        setError(`تعذر الاتصال بالخادم: ${err.message}`);
        
        // Fallback to sample data for demo
        setTimeout(() => {
          setWeddingVenues(getSampleVenues());
          setDataSource("sample");
          setLoading(false);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingVenues();
  }, []);

  // بيانات تجريبية محسنة بصور أجمل
  const getSampleVenues = () => [
    {
      id: "1",
      name: "قاعة السراج AL SERAG",
      type: "قاعة_أفراح",
      category: "فاخرة",
      governorate: "الغربية",
      city: "السنطه",
      address: "بجوار ماما نونا والنساجون الشرقيون، طريق طنطا زفتي - السنطة",
      capacity: 250,
      minCapacity: 100,
      maxCapacity: 300,
      price: 30000,
      minPrice: 20000,
      maxPrice: 50000,
      pricingType: "سعر_قاعة",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      images: [
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
      ],
      features: ["اضاءة ممتازه", "تنظيم علي اعلي مستوي", "ديكور فاخر", "مساحة واسعة"],
      amenities: ["واي فاي مجاني", "موقف سيارات", "تكييف مركزي", "خدمات نظافة"],
      rules: ["التزام بموعد الحفل", "ممنوع التدخين في الأماكن المغلقة"],
      description: "استعداد تام لإقامة حفلات الزفاف والخطوبة وكتب الكتاب والمؤتمرات. قاعة فاخرة بتصميم عصري وخدمات متكاملة.",
      available: true,
      rating: 4.5,
      reviewCount: 47,
      contact: "01095952888",
      email: "alserag@example.com",
      whatsapp: "+201095952888",
      website: "https://alserag.com",
      locationLat: 30.9695,
      locationLng: 31.0158,
      mapLink: "https://maps.google.com/?q=السنطة+الغربية",
      weddingSpecific: {
        brideRoom: true,
        groomRoom: true,
        photography: true,
        catering: true,
        decoration: true,
        openAir: false,
        weddingEvents: true,
        engagementEvents: true,
        katbKitaabEvents: true,
        maxGuests: 250,
        minGuests: 100
      },
      videos: [
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      ],
      specialOffer: "خصم 20% للحجز المبكر",
      originalPrice: 37500,
      discount: 20
    },
    {
      id: "2",
      name: "قصر الأفراح الملكي",
      type: "قصر",
      category: "فاخرة",
      governorate: "الغربية",
      city: "طنطا",
      address: "شارع الجلاء، طنطا، الغربية",
      capacity: 500,
      minCapacity: 200,
      maxCapacity: 600,
      price: 75000,
      minPrice: 50000,
      maxPrice: 100000,
      pricingType: "سعر_قاعة",
      image: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80"
      ],
      features: ["حديقة خاصة", "نوافير مياه", "إضاءة متطورة", "صوتيات احترافية"],
      amenities: ["موقف سيارات فاخر", "خدمة فاليه", "غرفة عروسة VIP", "شاشات عرض"],
      rules: ["الحجز المسبق قبل 3 أشهر", "التزام بالتعليمات"],
      description: "قصر فاخر لإقامة حفلات الزفاف والمناسبات الكبرى بمواصفات عالمية وخدمات متكاملة.",
      available: true,
      rating: 4.8,
      reviewCount: 89,
      contact: "01001234567",
      email: "royal@example.com",
      whatsapp: "+201001234567",
      website: "https://royal-palace.com",
      locationLat: 30.7865,
      locationLng: 31.0014,
      mapLink: "https://maps.google.com/?q=طنطا+الغربية",
      weddingSpecific: {
        brideRoom: true,
        groomRoom: true,
        photography: true,
        catering: true,
        decoration: true,
        openAir: true,
        weddingEvents: true,
        engagementEvents: true,
        katbKitaabEvents: true,
        maxGuests: 500,
        minGuests: 200
      },
      videos: [],
      specialOffer: "باقة كاملة بسعر خاص",
      originalPrice: 90000,
      discount: 17
    },
    {
      id: "3",
      name: "فندق ومنتجع النخيل",
      type: "فندق",
      category: "5 نجوم",
      governorate: "الغربية",
      city: "المحلة الكبرى",
      address: "شارع البحر الأعظم، المحلة الكبرى",
      capacity: 400,
      minCapacity: 150,
      maxCapacity: 500,
      price: 45000,
      minPrice: 30000,
      maxPrice: 70000,
      pricingType: "سعر_قاعة",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
      ],
      features: ["مسبح خارجي", "حديقة خضراء", "قاعة مؤتمرات", "خدمة كاملة"],
      amenities: ["غرف فندقية", "سبا", "صالة ألعاب", "مطعم"],
      rules: ["الحجز قبل أسبوعين", "التزام بالزي الرسمي"],
      description: "فندق فاخر يقدم خدمات متكاملة لحفلات الزفاف والمناسبات في أجواء راقية.",
      available: true,
      rating: 4.7,
      reviewCount: 63,
      contact: "01002345678",
      email: "palmresort@example.com",
      whatsapp: "+201002345678",
      website: "https://palmresort.com",
      locationLat: 30.9685,
      locationLng: 31.1663,
      mapLink: "https://maps.google.com/?q=المحلة+الكبرى+الغربية",
      weddingSpecific: {
        brideRoom: true,
        groomRoom: true,
        photography: true,
        catering: true,
        decoration: true,
        openAir: true,
        weddingEvents: true,
        engagementEvents: true,
        katbKitaabEvents: true,
        maxGuests: 400,
        minGuests: 150
      },
      videos: [],
      specialOffer: "باقة شهر العسل مجاناً",
      originalPrice: 55000,
      discount: 18
    },
    {
      id: "4",
      name: "نادي النجوم للاحتفالات",
      type: "نادي",
      category: "راقي",
      governorate: "الغربية",
      city: "كفر الزيات",
      address: "شارع النيل، كفر الزيات",
      capacity: 350,
      minCapacity: 120,
      maxCapacity: 400,
      price: 35000,
      minPrice: 25000,
      maxPrice: 60000,
      pricingType: "سعر_قاعة",
      image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      images: [
        "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      ],
      features: ["تصميم عصري", "إضاءة LED متطورة", "حديقة خارجية", "ديكورات متميزة"],
      amenities: ["خدمة بار", "تجهيزات صوتية متكاملة", "شاشات عرض", "واي فاي مجاني"],
      rules: ["الحجز قبل 10 أيام", "التزام بموعد إنهاء الحفل"],
      description: "نادي راقي يقدم خدمات متكاملة لحفلات الزفاف والمناسبات الخاصة بتصميمات عصرية وخدمات متميزة.",
      available: true,
      rating: 4.6,
      reviewCount: 38,
      contact: "01003456789",
      email: "starsclub@example.com",
      whatsapp: "+201003456789",
      website: "https://starsclub.com",
      locationLat: 30.8245,
      locationLng: 30.8174,
      mapLink: "https://maps.google.com/?q=كفر+الزيات+الغربية",
      weddingSpecific: {
        brideRoom: true,
        groomRoom: true,
        photography: true,
        catering: true,
        decoration: true,
        openAir: true,
        weddingEvents: true,
        engagementEvents: true,
        katbKitaabEvents: true,
        maxGuests: 350,
        minGuests: 120
      },
      videos: [],
      specialOffer: "تصوير مجاني للعروسين",
      originalPrice: 42000,
      discount: 17
    }
  ];

  // جلب المفضلة من localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weddingVenuesFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // حفظ المفضلة في localStorage
  useEffect(() => {
    localStorage.setItem('weddingVenuesFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // تحديث حالة الفلاتر في useRef عند تغييرها
  useEffect(() => {
    filtersStateRef.current = {
      priceRange,
      capacityRange,
      selectedGovernorate,
      selectedCity,
      venueType,
      locationType,
      eventType,
      sortBy,
      searchQuery
    };
  }, [priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventType, sortBy, searchQuery]);

  // فلترة وترتيب الأماكن
  useEffect(() => {
    let filtered = weddingVenues.filter(venue => {
      const matchesSearch = searchQuery === "" || 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = parseInt(venue.price) <= priceRange;
      const matchesCapacity = parseInt(venue.capacity) <= capacityRange;
      const matchesGovernorate = selectedGovernorate === "all" || venue.governorate === selectedGovernorate;
      const matchesCity = selectedCity === "all" || selectedCity === "كل المدن" || venue.city === selectedCity;
      const matchesVenueType = venueType === "all" || venue.type === venueType;
      const matchesLocationType = locationType === "all" || 
        (locationType === "open" && venue.weddingSpecific?.openAir) ||
        (locationType === "closed" && !venue.weddingSpecific?.openAir) ||
        (locationType === "mixed" && venue.weddingSpecific?.openAir !== undefined);
      const matchesEventType = eventType === "all" || 
        (eventType === "فرح" && venue.weddingSpecific?.weddingEvents) ||
        (eventType === "خطوبة" && venue.weddingSpecific?.engagementEvents) ||
        (eventType === "كتب_كتاب" && venue.weddingSpecific?.katbKitaabEvents);
      
      return matchesSearch && matchesPrice && matchesCapacity && matchesGovernorate && 
             matchesCity && matchesVenueType && matchesLocationType && matchesEventType;
    });

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "capacity":
          return b.capacity - a.capacity;
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredVenues(filtered);
  }, [searchQuery, priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventType, sortBy, weddingVenues]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const resetFilters = () => {
    const resetValues = {
      priceRange: 50000,
      capacityRange: 500,
      selectedGovernorate: "all",
      selectedCity: "all",
      venueType: "all",
      locationType: "all",
      eventType: "all",
      searchQuery: "",
      sortBy: "featured"
    };

    // تحديث useState
    setPriceRange(resetValues.priceRange);
    setCapacityRange(resetValues.capacityRange);
    setSelectedGovernorate(resetValues.selectedGovernorate);
    setSelectedCity(resetValues.selectedCity);
    setVenueType(resetValues.venueType);
    setLocationType(resetValues.locationType);
    setEventType(resetValues.eventType);
    setSearchQuery(resetValues.searchQuery);
    setSortBy(resetValues.sortBy);

    // تحديث useRef
    filtersStateRef.current = resetValues;
  };

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setCurrentView("details");
    window.scrollTo(0, 0);
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
    
    const shareUrl = `${window.location.origin}/venue/${venue.id || venue._id}`;
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Navigation محسّن */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo والعنوان */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-800 leading-tight">قاعات الأفراح</h1>
                <p className="text-xs text-gray-500 leading-tight">الغربية</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors border border-gray-300 rounded-lg hover:border-teal-500 bg-white shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">العودة</span>
              </button>

              <button 
                onClick={() => navigate('/favorites')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors border border-gray-300 rounded-lg hover:border-teal-500 bg-white shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-sm">المفضلة ({favorites.length})</span>
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Navigation 
                user={user}
                onLogout={logout}
                onNavigateHome={handleBackToHome}
                onNavigateFavorites={() => navigate('/favorites')}
                favoritesCount={favorites.length}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back Button for Mobile */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          onClick={handleBackToHome}
          className="flex items-center justify-center w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {/* Hero Section محسّن */}
      <div className="relative bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            اكتشف أفضل قاعات الأفراح في الغربية
          </h1>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            اختر القاعة المثالية لحفل زفافك من بين أفضل الأماكن المميزة بأسعار مناسبة وتقييمات حقيقية
          </p>
          
          {/* إحصائيات محسّنة */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
              <div className="text-xl font-bold">{weddingVenues.length}+</div>
              <div className="text-sm opacity-90">قاعة مميزة</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
              <div className="text-xl font-bold">⭐ 4.7+</div>
              <div className="text-sm opacity-90">تقييم متوسط</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
              <div className="text-xl font-bold">🏆</div>
              <div className="text-sm opacity-90">أفضل الخدمات</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => document.getElementById('search-input')?.focus()}
              className="bg-white text-teal-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ابدأ البحث الآن
            </button>
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              عرض الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar محسّن */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search محسّن */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن قاعة، منطقة، أو خدمة..."
                  className="w-full pr-4 pl-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-300 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Controls محسّنة */}
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>الفلاتر المتقدمة</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all duration-300 shadow-sm bg-white"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FiltersSidebar 
              selectedGovernorate={selectedGovernorate}
              onGovernorateChange={handleGovernorateChange}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              venueType={venueType}
              onVenueTypeChange={setVenueType}
              locationType={locationType}
              onLocationTypeChange={setLocationType}
              eventType={eventType}
              onEventTypeChange={setEventType}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              capacityRange={capacityRange}
              onCapacityRangeChange={setCapacityRange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onResetFilters={resetFilters}
              filteredVenues={filteredVenues}
              weddingVenues={weddingVenues}
              dataSource={dataSource}
              favorites={favorites}
              governorates={governorates}
              venueTypes={venueTypes}
              locationTypes={locationTypes}
              eventTypes={eventTypes}
            />
          </div>

          {/* Venues Grid */}
          <div className="flex-1">
            {/* Results Header محسّن */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>القاعات المتاحة</span>
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                      {filteredVenues.length} قاعة
                    </span>
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                    {dataSource === "api" 
                      ? `✨ عرض ${filteredVenues.length} من ${weddingVenues.length} قاعة حقيقية` 
                      : "💫 بيانات تجريبية للعرض والتجربة"}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/favorites')}
                    className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 transition-colors border border-teal-200 rounded-xl hover:border-teal-300 bg-teal-50 text-sm font-medium lg:hidden"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>المفضلة ({favorites.length})</span>
                  </button>
                </div>
              </div>

              {/* Active Filters محسّنة */}
              {(selectedGovernorate !== "all" || selectedCity !== "all" || venueType !== "all" || locationType !== "all" || eventType !== "all" || searchQuery || priceRange < 50000 || capacityRange < 500) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 font-medium">الفلاتر النشطة:</span>
                  {selectedGovernorate !== "all" && (
                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                      {governorates[selectedGovernorate]?.name}
                      <button onClick={() => setSelectedGovernorate("all")} className="hover:text-blue-900 text-xs bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                    </span>
                  )}
                  {selectedCity !== "all" && selectedCity !== "كل المدن" && (
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
                      {selectedCity}
                      <button onClick={() => setSelectedCity("all")} className="hover:text-green-900 text-xs bg-green-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                    </span>
                  )}
                  {venueType !== "all" && (
                    <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium">
                      {venueTypes[venueType]}
                      <button onClick={() => setVenueType("all")} className="hover:text-purple-900 text-xs bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
                      بحث: {searchQuery}
                      <button onClick={() => setSearchQuery("")} className="hover:text-gray-900 text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                    </span>
                  )}
                  {priceRange < 50000 && (
                    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-medium">
                      سعر: حتى {priceRange.toLocaleString()} ج
                      <button onClick={() => setPriceRange(50000)} className="hover:text-yellow-900 text-xs bg-yellow-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                    </span>
                  )}
                  <button 
                    onClick={resetFilters}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    مسح الكل
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">جاري تحميل القاعات...</p>
                <p className="text-gray-500 text-sm mt-2">نبحث عن أفضل الأماكن لحفل زفافك</p>
              </div>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">لا توجد نتائج</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">لم نتمكن من العثور على قاعات تطابق معايير البحث. حاول تعديل الفلاتر أو البحث بكلمات أخرى.</p>
                <button 
                  onClick={resetFilters}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  مسح كل الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredVenues.map((venue) => (
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
            eventType,
            onEventTypeChange: setEventType,
            priceRange,
            onPriceRangeChange: setPriceRange,
            capacityRange,
            onCapacityRangeChange: setCapacityRange,
            sortBy,
            onSortChange: setSortBy,
            onResetFilters: resetFilters,
            filteredVenues,
            weddingVenues,
            dataSource,
            favorites
          }}
          governorates={governorates}
          venueTypes={venueTypes}
          locationTypes={locationTypes}
          eventTypes={eventTypes}
          sortOptions={sortOptions}
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