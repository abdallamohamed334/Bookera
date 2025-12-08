import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

// استيراد المكونات مباشرة بدون lazy loading
import VenueDetails from "../components/wedding/VenueDetails";
import VenueCard from "../components/wedding/VenueCard";
import FiltersSidebar from "../components/wedding/FiltersSidebar";
import MobileFilters from "../components/wedding/MobileFilters";
import BookingModal from "../components/wedding/BookingModal";
import Navigation from "../components/shared/Navigation";
import Footer from "../components/shared/Footer";
import { useNavigate } from "react-router-dom";

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
    eventTypes: [], // تغيير إلى مصفوفة
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
  const [eventTypes, setEventTypes] = useState(filtersStateRef.current.eventTypes); // تغيير إلى مصفوفة
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

  // States for Comparison Feature
  const [comparisonMode, setComparisonMode] = useState(false);
  const [venuesToCompare, setVenuesToCompare] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // محافظات مصر - الغربية فقط
  const governorates = {
    "all": { name: "كل المحافظات", cities: ["كل المدن"] },
    "الغربية": {
      name: "الغربية",
      cities: ["كل المدن", "طنطا", "المحلة الكبري", "زفتى", "سمنود", "بسيون", "قطور", "السنطه", "كفر الزيات", "صفتا", "شيخون"]
    }
  };

  // أنواع القاعات والمناسبات - محدثة
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

  // أنواع المناسبات - محدثة
  const availableEventTypes = {
    "فرح": "فرح",
    "خطوبة": "خطوبة",
    "كتب_كتاب": "كتب كتاب",
    "عيد_ميلاد": "عيد ميلاد",
    "مؤتمرات": "مؤتمرات/مناسبات عمل"
  };

  const sortOptions = {
    "featured": "مميز",
    "price_low": "السعر: من الأقل للأعلى",
    "price_high": "السعر: من الأعلى للأقل",
    "rating": "الأعلى تقييماً",
    "capacity": "السعة: من الأكبر للأصغر",
    "newest": "الأحدث"
  };

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

  // دوال المقارنة الجديدة
  const toggleVenueComparison = (venue) => {
    const venueId = venue.id || venue._id;

    if (venuesToCompare.some(v => (v.id || v._id) === venueId)) {
      // إزالة من المقارنة
      setVenuesToCompare(prev => prev.filter(v => (v.id || v._id) !== venueId));
    } else {
      // إضافة للمقارنة (بحد أقصى 3 قاعات)
      if (venuesToCompare.length < 3) {
        setVenuesToCompare(prev => [...prev, venue]);
      } else {
        alert("يمكنك مقارنة حتى 3 قاعات فقط في المرة الواحدة");
      }
    }
  };

  const startComparison = () => {
    if (venuesToCompare.length >= 2) {
      setShowComparisonModal(true);
    } else {
      alert("يجب اختيار قاعتين على الأقل للمقارنة");
    }
  };

  const clearComparison = () => {
    setVenuesToCompare([]);
    setComparisonMode(false);
  };

  const exitComparisonMode = () => {
    setComparisonMode(false);
    setVenuesToCompare([]);
  };

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchWeddingVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`bookera-production-25ec.up.railway.app/api/wedding-venues/`, {
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
              profile_image: venue.profile_image,
              features: venue.features || [],
              amenities: venue.amenities || [],
              rules: venue.rules || [],
              weddingSpecific: venue.weddingSpecific || {},
              event_types: venue.event_types || getEventTypesFromWeddingSpecific(venue.weddingSpecific),
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

  // دالة لاستخراج event_types من weddingSpecific للبيانات القديمة
  const getEventTypesFromWeddingSpecific = (weddingSpecific) => {
    if (!weddingSpecific) return ['فرح']; // قيمة افتراضية

    const events = [];
    if (weddingSpecific.weddingEvents) events.push('فرح');
    if (weddingSpecific.engagementEvents) events.push('خطوبة');
    if (weddingSpecific.katbKitaabEvents) events.push('كتب_كتاب');
    if (weddingSpecific.birthdayEvents) events.push('عيد_ميلاد');
    if (weddingSpecific.businessEvents) events.push('مؤتمرات');

    return events.length > 0 ? events : ['فرح'];
  };

  // بيانات تجريبية محسنة
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
        birthdayEvents: true,
        businessEvents: true,
        maxGuests: 250,
        minGuests: 100
      },
      event_types: ['فرح', 'خطوبة', 'كتب_كتاب', 'عيد_ميلاد', 'مؤتمرات'],
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
        birthdayEvents: true,
        businessEvents: false,
        maxGuests: 500,
        minGuests: 200
      },
      event_types: ['فرح', 'خطوبة', 'كتب_كتاب', 'عيد_ميلاد'],
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
      city: "المحلة الكبري",
      address: "شارع البحر الأعظم، المحلة الكبري",
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
      mapLink: "https://maps.google.com/?q=المحلة الكبري+الكبرى+الغربية",
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
        birthdayEvents: true,
        businessEvents: true,
        maxGuests: 400,
        minGuests: 150
      },
      event_types: ['فرح', 'خطوبة', 'كتب_كتاب', 'عيد_ميلاد', 'مؤتمرات'],
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
        engagementEvents: false,
        katbKitaabEvents: true,
        birthdayEvents: true,
        businessEvents: false,
        maxGuests: 350,
        minGuests: 120
      },
      event_types: ['فرح', 'كتب_كتاب', 'عيد_ميلاد'],
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
      eventTypes,
      sortBy,
      searchQuery
    };
  }, [priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventTypes, sortBy, searchQuery]);

  // فلترة وترتيب الأماكن - محدثة لاستخدام event_types متعددة
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

      const matchesEventTypes = eventTypes.length === 0 ||
        (venue.event_types && eventTypes.some(selectedType =>
          venue.event_types.includes(selectedType)
        ));

      return matchesSearch && matchesPrice && matchesCapacity && matchesGovernorate &&
        matchesCity && matchesVenueType && matchesLocationType && matchesEventTypes;
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
  }, [searchQuery, priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventTypes, sortBy, weddingVenues]);

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
      eventTypes: [],
      searchQuery: "",
      sortBy: "featured"
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

  // Comparison Modal Component
  const ComparisonModal = () => {
    if (!showComparisonModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">مقارنة القاعات</h2>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-right p-4 font-semibold text-gray-700 bg-gray-50">المعايير</th>
                    {venuesToCompare.map((venue, index) => (
                      <th key={venue.id || venue._id} className="text-center p-4">
                        <div className="flex flex-col items-center">
                          <img
                            src={venue.image}
                            alt={venue.name}
                            className="w-20 h-20 object-cover rounded-lg mb-2"
                          />
                          <h3 className="font-bold text-gray-800 text-sm">{venue.name}</h3>
                          <p className="text-gray-600 text-xs">{venue.city}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">السعر</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <span className="text-lg font-bold text-green-600">
                          {venue.price?.toLocaleString()} ج
                        </span>
                        {venue.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {venue.originalPrice.toLocaleString()} ج
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">السعة</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <span className="font-semibold">{venue.capacity} شخص</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">التقييم</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{venue.rating || 0}</span>
                          <span className="text-gray-500 text-sm">({venue.reviewCount || 0})</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">نوع القاعة</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {venueTypes[venue.type] || venue.type}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">المدينة</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <span className="text-gray-700">{venue.city}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">الخدمات</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <div className="space-y-1">
                          {venue.features?.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {feature}
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">المناسبات المتاحة</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <div className="space-y-1">
                          {venue.event_types?.slice(0, 3).map(eventType => (
                            <div key={eventType} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {availableEventTypes[eventType] || eventType}
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">الإجراءات</td>
                    {venuesToCompare.map(venue => (
                      <td key={venue.id || venue._id} className="p-4 text-center">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleBookNow(venue)}
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            احجز الآن
                          </button>
                          <button
                            onClick={() => {
                              const venueId = venue.id || venue._id;
                              window.open(`/venue/${venueId}`, '_blank');
                            }}
                            className="border border-gray-300 hover:border-black text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  if (currentView === "details" && selectedVenue) {
    return (
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-white">
      {/* Navigation محسّن */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo والعنوان */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-800 leading-tight">قاعات الأفراح والمناسبات</h1>
                <p className="text-xs text-gray-500 leading-tight">الغربية - لحفلات الزفاف، الخطوبة، كتب الكتاب، أعياد الميلاد والمؤتمرات</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black transition-colors border border-gray-300 rounded-lg hover:border-black bg-white shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">العودة للرئيسية</span>
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
          className="flex items-center justify-center w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {/* Comparison Bar */}
      {venuesToCompare.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {venuesToCompare.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">القاعات المختارة للمقارنة</p>
                <p className="text-xs text-gray-600">اختر {3 - venuesToCompare.length} قاعات أخرى للمقارنة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startComparison}
                disabled={venuesToCompare.length < 2}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${venuesToCompare.length >= 2
                  ? 'bg-black text-white hover:bg-gray-800 shadow-md'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
              >
                مقارنة ({venuesToCompare.length})
              </button>
              <button
                onClick={clearComparison}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section محسّن */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black text-white py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            اكتشف أفضل قاعات الأفراح والمناسبات في الغربية
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            احجز القاعة المثالية لحفل زفافك، خطوبتك، كتب كتاب، عيد ميلاد، أو مؤتمر عملك.
            اختر من بين أفضل الأماكن المميزة بأسعار مناسبة وتقييمات حقيقية
          </p>

          {/* Event Types Icons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["💒 أفراح", "💍 خطوبة", "📖 كتب كتاب", "🎂 أعياد ميلاد"].map((event, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <span className="text-sm font-medium">{event}</span>
              </div>
            ))}
          </div>

          {/* Hero Image */}
          <div className="mb-8 max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="قاعة أفراح فاخرة"
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
            />
          </div>

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
              <div className="text-xl font-bold">🎯</div>
              <div className="text-sm opacity-90">جميع المناسبات</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
              <div className="text-xl font-bold">📍</div>
              <div className="text-sm opacity-90">إن دور & أوبن دور</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            
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
           

            {/* Controls محسّنة */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>الفلاتر المتقدمة</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-sm transition-all duration-300 shadow-sm bg-white"
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
        {/* Desktop Filters Above Venues */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">فلاتر البحث المتقدم</h2>
              <button
                onClick={resetFilters}
                className="text-black hover:text-gray-800 text-sm font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                مسح الكل
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Governorate Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
                <select
                  value={selectedGovernorate}
                  onChange={(e) => handleGovernorateChange(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm transition-all duration-300"
                >
                  {Object.entries(governorates).map(([value, gov]) => (
                    <option key={value} value={value}>{gov.name}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm transition-all duration-300"
                >
                  {selectedGovernorate !== "all" && governorates[selectedGovernorate]?.cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                  {selectedGovernorate === "all" && (
                    <option value="all">كل المدن</option>
                  )}
                </select>
              </div>

            

              {/* Location Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المكان</label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm transition-all duration-300"
                >
                  {Object.entries(locationTypes).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Event Types Filter */}
              <div className="lg:col-span-2">
                
                
                {eventTypes.length > 0 && (
                  <button
                    onClick={clearAllEventTypes}
                    className="mt-2 text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    مسح الكل
                  </button>
                )}
              </div>

              {/* Price Range Filter - محسن */}
             
              {/* Capacity Range Filter - محسن */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    عدد الأشخاص
                  </label>
                  <span className="text-sm font-bold text-black bg-gray-100 px-2 py-1 rounded">
                    حتى {capacityRange} شخص
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={capacityRange}
                  onChange={(e) => setCapacityRange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">50 شخص</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">500 شخص</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">1000 شخص</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header محسّن */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>القاعات المتاحة</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredVenues.length} قاعة
                </span>
              </h2>
            
            </div>

            {/* Comparison Mode Toggle */}
            <div className="flex items-center gap-3">
              {venuesToCompare.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {venuesToCompare.length} قاعة مختارة
                  </span>
                  <button
                    onClick={clearComparison}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    مسح الكل
                  </button>
                </div>
              )}
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium ${comparisonMode
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {comparisonMode ? 'خروج من وضع المقارنة' : 'مقارنة القاعات'}
              </button>
            </div>
          </div>

          {/* Active Filters محسّنة */}
          {(selectedGovernorate !== "all" || selectedCity !== "all" || venueType !== "all" || locationType !== "all" || eventTypes.length > 0 || searchQuery || priceRange < 50000 || capacityRange < 500) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 font-medium">الفلاتر النشطة:</span>

              {/* Event Types Active Filters */}
              {eventTypes.map(eventType => (
                <span key={eventType} className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  {availableEventTypes[eventType]}
                  <button
                    onClick={() => handleEventTypeToggle(eventType)}
                    className="hover:text-blue-900 text-xs bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              ))}

              {selectedGovernorate !== "all" && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  {governorates[selectedGovernorate]?.name}
                  <button onClick={() => setSelectedGovernorate("all")} className="hover:text-gray-900 text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                </span>
              )}
              {selectedCity !== "all" && selectedCity !== "كل المدن" && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  {selectedCity}
                  <button onClick={() => setSelectedCity("all")} className="hover:text-gray-900 text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                </span>
              )}
            
              {locationType !== "all" && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  {locationTypes[locationType]}
                  <button onClick={() => setLocationType("all")} className="hover:text-gray-900 text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                </span>
              )}
        
              
              {capacityRange < 500 && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  سعة: حتى {capacityRange} شخص
                  <button onClick={() => setCapacityRange(500)} className="hover:text-gray-900 text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">×</button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-black hover:text-gray-800 text-sm font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
              >
                مسح الكل
              </button>
            </div>
          )}
        </div>

        {/* Venues Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
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
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                مسح كل الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  // إضافة خاصية المقارنة
                  comparisonMode={comparisonMode}
                  isSelectedForComparison={venuesToCompare.some(v => (v.id || v._id) === (venue.id || venue._id))}
                  onToggleComparison={() => toggleVenueComparison(venue)}
                />
              ))}
            </div>
          )}
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
            eventTypes,
            onEventTypesChange: setEventTypes,
            onEventTypeToggle: handleEventTypeToggle,
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
          eventTypes={availableEventTypes}
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

      {/* Comparison Modal */}
      <ComparisonModal />
    </div>
  );
};

export default WeddingHallsPage;