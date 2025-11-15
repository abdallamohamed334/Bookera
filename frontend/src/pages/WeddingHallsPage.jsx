import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

// Lazy loaded components
import VenueMap from "../components/VenueMap";
import ImageGallery from "../components/ImageGallery";
import BookingModal from "../components/BookingModal";

const WeddingHallsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // States for filtering
  const [priceRange, setPriceRange] = useState(50000);
  const [capacityRange, setCapacityRange] = useState(500);
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [venueType, setVenueType] = useState("all");
  const [locationType, setLocationType] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weddingVenues, setWeddingVenues] = useState([]);
  const [dataSource, setDataSource] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for UI
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  
  // States for booking system
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [smsStatus, setSmsStatus] = useState("");

  // Refs for lazy loading and animations
  const imageRefs = useRef(new Map());
  const observerRef = useRef(null);
  const sectionRefs = useRef({});
  const stickyRef = useRef(null);

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
        
        console.log('🔍 جاري جلب بيانات القاعات...');
        const response = await fetch('http://localhost:5000/api/wedding-venues', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم جلب البيانات بنجاح:', data.venues?.length || 0, 'قاعة');
          
          if (data.venues && data.venues.length > 0) {
            const venuesWithId = data.venues.map(venue => ({
              ...venue,
              _id: venue.id || venue._id,
              // Ensure all required fields have default values
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
              originalPrice: venue.originalPrice || null
            }));
            
            setWeddingVenues(venuesWithId);
            setDataSource("api");
          } else {
            console.warn('⚠️ لا توجد بيانات في الـ API');
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
          console.log('🔄 استخدام بيانات تجريبية...');
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

  // بيانات تجريبية للعرض
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
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
      images: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"
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
      originalPrice: 37500
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
      image: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=600",
      images: [
        "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=600",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600"
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
      originalPrice: 90000
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

  // Lazy Loading Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              // Simulate loading delay for better UX
              setTimeout(() => {
                img.src = src;
                img.removeAttribute('data-src');
                setImageLoading(prev => ({ ...prev, [src]: false }));
              }, 300);
            }
            observerRef.current.unobserve(img);
          }
        });
      },
      { 
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );

    // Observe all images
    imageRefs.current.forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredVenues]);

  // إضافة/إزالة من المفضلة
  const toggleFavorite = (venueId, e) => {
    if (e) e.stopPropagation();
    if (favorites.includes(venueId)) {
      setFavorites(favorites.filter(id => id !== venueId));
    } else {
      setFavorites([...favorites, venueId]);
    }
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
          return new Date(b.createdAt) - new Date(a.createdAt);
        default: // featured
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredVenues(filtered);
  }, [searchQuery, priceRange, capacityRange, selectedGovernorate, selectedCity, venueType, locationType, eventType, sortBy, weddingVenues]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= numericRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm mr-1">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  const resetFilters = () => {
    setSelectedGovernorate("all");
    setSelectedCity("all");
    setVenueType("all");
    setLocationType("all");
    setEventType("all");
    setPriceRange(50000);
    setCapacityRange(500);
    setSearchQuery("");
    setSortBy("featured");
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

  // وظائف نظام الحجز
  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setShowBookingModal(true);
    setBookingType("");
    setBookingSuccess(false);
    setSmsStatus("");
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingType("");
    setBookingSuccess(false);
    setSmsStatus("");
  };

  // دالة إرسال SMS
  const sendSMSNotification = async (phoneNumber, venueName, bookingType, userName) => {
    try {
      setSmsStatus("جاري إرسال الرسالة...");
      
      const message = bookingType === "inspection" 
        ? `عزيزي ${userName}، تم استلام طلب المعاينة الخاص بك لقاعة ${venueName}. طلبك قيد المعالجة وسنتواصل معك قريباً لتأكيد الموعد. شكراً لاختيارك منصتنا - ايفنتو`
        : `عزيزي ${userName}، تم استلام طلب الحجز الخاص بك لقاعة ${venueName}. طلبك قيد المعالجة وسنتواصل معك قريباً لتأكيد التفاصيل. شكراً لاختيارك منصتنا - ايفنتو`;

      const response = await fetch('http://localhost:5000/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          type: bookingType
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSmsStatus("success");
        console.log('✅ تم إرسال SMS بنجاح:', result);
        return true;
      } else {
        throw new Error('فشل في إرسال الرسالة');
      }
    } catch (error) {
      console.error('❌ خطأ في إرسال SMS:', error);
      setSmsStatus("error");
      return false;
    }
  };

  // دالة الحجز
  const handleBookingSubmit = async (bookingData) => {
    setBookingLoading(true);
    setSmsStatus("");
    
    try {
      const smsSent = await sendSMSNotification(
        bookingData.phone,
        selectedVenue.name,
        bookingType,
        user?.name || bookingData.name || 'عميلنا الكريم'
      );

      if (!smsSent) {
        throw new Error('فشل في إرسال الرسالة النصية');
      }

      const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: selectedVenue.id || selectedVenue._id,
          venueName: selectedVenue.name,
          type: bookingType,
          userName: user?.name || bookingData.name,
          userPhone: bookingData.phone,
          userEmail: bookingData.email,
          date: bookingType === "direct" ? bookingData.date : bookingData.inspectionDate,
          time: bookingType === "direct" ? bookingData.time : bookingData.inspectionTime,
          guests: bookingData.guests,
          notes: bookingData.notes,
          status: 'pending'
        })
      });

      if (!bookingResponse.ok) {
        throw new Error('فشل في حفظ بيانات الحجز');
      }

      setBookingSuccess(true);
      
      if (bookingType === "direct") {
        alert('🎉 تم إرسال طلب الحجز بنجاح! تم إرسال رسالة تأكيد لهاتفك. سنتواصل معك قريباً لتأكيد التفاصيل.');
      } else {
        alert('🔍 تم إرسال طلب المعاينة بنجاح! تم إرسال رسالة تأكيد لهاتفك. طلبك قيد المعالجة وسنتواصل معك قريباً.');
      }
      
      setTimeout(() => {
        closeBookingModal();
      }, 3000);
      
    } catch (err) {
      console.error('خطأ في الحجز:', err);
      alert('❌ حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setBookingLoading(false);
    }
  };

  // مكون معاينة الصور مع السكرول الأفقي
  const ImageGalleryPreview = ({ venue, className = "" }) => {
    const scrollRef = useRef(null);
    const images = venue.images || [venue.image];

    const scroll = (direction) => {
      if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollLeft += direction * scrollAmount;
      }
    };

    if (!images || images.length === 0) return null;

    return (
      <div className={`relative ${className}`}>
        {images.length > 3 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                scroll(-1);
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-6 h-6 rounded-full z-10 flex items-center justify-center hover:bg-opacity-70 transition-all text-xs"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                scroll(1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-6 h-6 rounded-full z-10 flex items-center justify-center hover:bg-opacity-70 transition-all text-xs"
            >
              ›
            </button>
          </>
        )}
        
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 relative">
              <img
                ref={el => imageRefs.current.set(`preview-${venue.id}-${index}`, el)}
                data-src={image}
                src="/placeholder-image.jpg"
                alt={`${venue.name} ${index + 1}`}
                className="w-20 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVenueClick(venue);
                }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
                }}
              />
              {index === 0 && images.length > 1 && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+{images.length}</span>
                </div>
              )}
            </div>
          ))}
          
          {/* فيديوهات القاعة */}
          {venue.videos && venue.videos.length > 0 && (
            <div 
              className="flex-shrink-0 relative cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleVenueClick(venue);
              }}
            >
              <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors border border-gray-200">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                فيديو
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // مكون بطاقة القاعة - معدل
  const VenueCard = ({ venue }) => {
    const isFavorite = favorites.includes(venue.id || venue._id);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-purple-300 hover:shadow-lg group"
        onClick={() => handleVenueClick(venue)}
      >
        <div className="relative h-48 flex-shrink-0">
          {/* صورة القاعة */}
          <div className="relative w-full h-full bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}
            <img 
              ref={el => imageRefs.current.set(`card-${venue.id}`, el)}
              data-src={venue.image}
              src="/placeholder-image.jpg"
              alt={venue.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400";
                setImageLoaded(true);
              }}
            />
          </div>

          {/* Overlay Info */}
          {!venue.available && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold bg-red-600 px-4 py-2 rounded-full text-sm">
                غير متاحة
              </span>
            </div>
          )}
          
          {/* السعر - معدل الموقع */}
          <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {parseInt(venue.price)?.toLocaleString()} ج
          </div>
          
          {/* المدينة */}
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs shadow-lg">
            {venue.city}
          </div>
          
          {/* التقييم */}
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded text-xs shadow-lg">
            {renderStars(venue.rating)}
          </div>
          
          {/* أزرار المفضلة والمشاركة - معدل الموقع */}
          <div className="absolute top-12 left-3 flex flex-col gap-2">
            <button
              onClick={(e) => toggleFavorite(venue.id || venue._id, e)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 shadow-lg'
              }`}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
            <button
              onClick={(e) => shareVenue(venue, e)}
              className="w-8 h-8 bg-white bg-opacity-90 text-gray-600 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all transform hover:scale-110 shadow-lg"
            >
              ↷
            </button>
          </div>

          {/* عرض خاص */}
          {venue.specialOffer && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
              🎁 {venue.specialOffer}
            </div>
          )}
        </div>
        
        {/* محتوى البطاقة */}
        <div className="p-4 flex-grow flex flex-col">
          {/* العنوان والمعلومات الأساسية */}
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{venue.name}</h4>
            <span className="text-purple-600 text-sm bg-purple-50 px-2 py-1 rounded whitespace-nowrap">
              {venue.capacity} شخص
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">{venue.city}، {venue.governorate}</p>
          
          {/* عرض نطاق السعر */}
          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700 font-medium">نطاق السعر:</span>
              <span className="text-blue-800 font-bold">
                {parseInt(venue.minPrice)?.toLocaleString()} - {parseInt(venue.maxPrice)?.toLocaleString()} ج
              </span>
            </div>
          </div>
          
          {/* الوصف */}
          <p className="text-gray-700 text-sm mb-3 line-clamp-2 flex-grow">
            {venue.description}
          </p>
          
          {/* المميزات السريعة */}
          <div className="flex flex-wrap gap-1 mb-3">
            {venue.features?.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200"
              >
                {feature}
              </span>
            ))}
            {venue.features?.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">
                +{venue.features.length - 2} أكثر
              </span>
            )}
          </div>
          
          {/* معاينة الصور */}
          <div className="mb-4">
            <ImageGalleryPreview venue={venue} />
          </div>
          
          {/* زر التفاصيل */}
          <button 
            onClick={() => handleVenueClick(venue)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 group"
          >
            <span>شوف التفاصيل والحجز</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </motion.div>
    );
  };

  // مكون الفلتر للجوال
  const MobileFilters = () => (
    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-purple-600">فلاتر البحث</h3>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <FiltersContent />
        </div>
      </motion.div>
    </div>
  );

  // محتوى الفلاتر
  const FiltersContent = () => (
    <div className="space-y-6">
      {/* بحث */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">بحث</h4>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم القاعة أو المنطقة..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        />
      </div>

      {/* فلترة المحافظة */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">المحافظة</h4>
        <select
          value={selectedGovernorate}
          onChange={(e) => handleGovernorateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {Object.keys(governorates).map((gov) => (
            <option key={gov} value={gov}>
              {governorates[gov].name}
            </option>
          ))}
        </select>
      </div>

      {/* فلترة المدينة */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">المدينة/المنطقة</h4>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {governorates[selectedGovernorate]?.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* فلترة نوع القاعة */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">نوع القاعة</h4>
        <select
          value={venueType}
          onChange={(e) => setVenueType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {Object.entries(venueTypes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* فلترة الموقع */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">الموقع</h4>
        <select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {Object.entries(locationTypes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* فلترة نوع المناسبة */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">نوع المناسبة</h4>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {Object.entries(eventTypes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* فلترة السعر */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">السعر: حتى {priceRange.toLocaleString()} جنيه</h4>
        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full mb-1"
        />
        <div className="flex justify-between text-gray-600 text-xs">
          <span>1,000</span>
          <span>100,000</span>
        </div>
      </div>

      {/* فلترة السعة */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">السعة: حتى {capacityRange} شخص</h4>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={capacityRange}
          onChange={(e) => setCapacityRange(parseInt(e.target.value))}
          className="w-full mb-1"
        />
        <div className="flex justify-between text-gray-600 text-xs">
          <span>50</span>
          <span>1,000</span>
        </div>
      </div>

      {/* ترتيب النتائج */}
      <div>
        <h4 className="text-gray-900 font-medium mb-2">ترتيب حسب</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {Object.entries(sortOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* إحصائيات */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-800 mb-2 text-sm">إحصائيات البحث</h4>
        <div className="space-y-1 text-xs text-purple-700">
          <div className="flex justify-between">
            <span>القاعات المتاحة:</span>
            <span className="font-bold">{filteredVenues.length}</span>
          </div>
          <div className="flex justify-between">
            <span>مجموع القاعات:</span>
            <span className="font-bold">{weddingVenues.length}</span>
          </div>
          <div className="flex justify-between">
            <span>في المفضلة:</span>
            <span className="font-bold">{favorites.length}</span>
          </div>
          <div className="flex justify-between">
            <span>مصدر البيانات:</span>
            <span className="font-bold">
              {dataSource === "api" ? "قاعدة البيانات" : 
               dataSource === "sample" ? "بيانات تجريبية" : "..."}
            </span>
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-2">
        <button 
          onClick={resetFilters}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
        >
          مسح الكل
        </button>
        <button 
          onClick={() => setShowMobileFilters(false)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );

  // صفحة تفاصيل القاعة - معدلة
  const VenueDetails = ({ venue }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [autoSlide, setAutoSlide] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    
    const isFavorite = favorites.includes(venue.id || venue._id);
    const images = venue.images || [venue.image];
    const hasMultipleImages = images.length > 1;
    const hasVideos = venue.videos && venue.videos.length > 0;

    // Sticky effect for booking card
    useEffect(() => {
      const handleScroll = () => {
        if (stickyRef.current) {
          const rect = stickyRef.current.getBoundingClientRect();
          setIsSticky(rect.top <= 100);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto slide for images
    useEffect(() => {
      if (!autoSlide || !hasMultipleImages) return;

      const interval = setInterval(() => {
        setSelectedImage(prev => 
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }, [autoSlide, hasMultipleImages, images.length]);

    // Video Modal Component
    const VideoModal = () => {
      if (!selectedVideo) return null;

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">فيديو القاعة - {venue.name}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <video 
                controls 
                autoPlay
                className="w-full h-auto max-h-[70vh] rounded-lg"
                poster={venue.image}
              >
                <source src={selectedVideo} type="video/mp4" />
                <source src={selectedVideo} type="video/webm" />
                <source src={selectedVideo} type="video/ogg" />
                المتصفح الخاص بك لا يدعم تشغيل الفيديو.
              </video>
            </div>
          </motion.div>
        </motion.div>
      );
    };

    // Image Gallery Component for Details
    const DetailImageGallery = () => (
      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img 
                src={image}
                alt={`${venue.name} ${index + 1}`}
                className="w-20 h-16 object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
                }}
              />
            </button>
          ))}
          
          {/* فيديوهات القاعة - معدل الموقع */}
          {hasVideos && venue.videos.map((video, index) => (
            <button
              key={`video-${index}`}
              onClick={() => setSelectedVideo(video)}
              className="flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all relative group"
            >
              <div className="w-20 h-16 bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                فيديو
              </span>
            </button>
          ))}
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={handleBackToList}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                العودة للقائمة
              </button>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => shareVenue(venue, e)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="hidden sm:inline">مشاركة</span>
                </button>
                
                <button
                  onClick={(e) => toggleFavorite(venue.id || venue._id, e)}
                  className={`flex items-center gap-2 transition-colors ${
                    isFavorite 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="hidden sm:inline">{isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Basic Info */}
            <div className="lg:col-span-2">
              {/* Image Slider */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="relative h-80 lg:h-96 bg-gray-100">
                  {/* Loading State */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  )}

                  {/* Main Image */}
                  <img 
                    ref={el => imageRefs.current.set(`detail-${venue.id}`, el)}
                    data-src={images[selectedImage]}
                    src="/placeholder-image.jpg"
                    alt={venue.name}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800";
                      setImageLoaded(true);
                    }}
                  />

                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {images.length}
                    </div>
                  )}

                  {/* Auto Slide Toggle */}
                  {hasMultipleImages && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setAutoSlide(!autoSlide)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          autoSlide 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {autoSlide ? 'تشغيل التلقائي' : 'إيقاف التلقائي'}
                      </button>
                    </div>
                  )}

                  {/* Video Indicator */}
                  {hasVideos && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      {venue.videos.length} فيديو متاح
                    </div>
                  )}
                </div>

                {/* Thumbnails Gallery */}
                <DetailImageGallery />
              </div>

              {/* نطاق السعر في الأعلى */}
              <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">🎉 نطاق أسعار القاعة</h3>
                  <div className="text-3xl font-bold mb-2">
                    {parseInt(venue.minPrice)?.toLocaleString()} - {parseInt(venue.maxPrice)?.toLocaleString()} جنيه
                  </div>
                  <p className="text-blue-100">السعر يختلف حسب عدد الضيوف والخدمات الإضافية</p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {['details', 'features', 'location', 'reviews', 'gallery'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab === 'details' && 'التفاصيل'}
                        {tab === 'features' && 'المميزات والخدمات'}
                        {tab === 'location' && 'الموقع'}
                        {tab === 'reviews' && 'التقييمات'}
                        {tab === 'gallery' && 'معرض الصور'}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tabs Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'details' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{venue.name}</h3>
                            <p className="text-gray-700 leading-relaxed">{venue.description}</p>
                          </div>

                          {/* Wedding Specific Features */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">مميزات خاصة بالأفراح</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">غرفة العروسة</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    venue.weddingSpecific?.brideRoom 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {venue.weddingSpecific?.brideRoom ? 'متاحة' : 'غير متاحة'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">خدمة التصوير</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    venue.weddingSpecific?.photography 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {venue.weddingSpecific?.photography ? 'متاحة' : 'غير متاحة'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">خدمة الأكل</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    venue.weddingSpecific?.catering 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {venue.weddingSpecific?.catering ? 'متاحة' : 'غير متاحة'}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">خدمة الديكور</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    venue.weddingSpecific?.decoration 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {venue.weddingSpecific?.decoration ? 'متاحة' : 'غير متاحة'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">نوع المكان</span>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {venue.weddingSpecific?.openAir ? 'أوبن دور' : 'إن دور'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">المناسبات المتاحة</span>
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                    {[
                                      venue.weddingSpecific?.weddingEvents && 'أفراح',
                                      venue.weddingSpecific?.engagementEvents && 'خطوبة',
                                      venue.weddingSpecific?.katbKitaabEvents && 'كتب كتاب'
                                    ].filter(Boolean).join('، ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* إضافات جديدة تجعل العميل مبسوط */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl border border-orange-200">
                              <div className="text-2xl mb-2">🎵</div>
                              <h5 className="font-semibold text-gray-900">صوتيات احترافية</h5>
                              <p className="text-sm text-gray-600">أحدث أنظمة الصوت</p>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200">
                              <div className="text-2xl mb-2">💡</div>
                              <h5 className="font-semibold text-gray-900">إضاءة متطورة</h5>
                              <p className="text-sm text-gray-600">تجهيز إضاءة احترافية</p>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
                              <div className="text-2xl mb-2">🚗</div>
                              <h5 className="font-semibold text-gray-900">مواقف سيارات</h5>
                              <p className="text-sm text-gray-600">مساحة كافية للسيارات</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'features' && (
                        <div className="space-y-6">
                          {/* Features */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">المميزات العامة</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {(showAllFeatures ? venue.features : venue.features?.slice(0, 8))?.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                            {venue.features?.length > 8 && (
                              <button
                                onClick={() => setShowAllFeatures(!showAllFeatures)}
                                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                {showAllFeatures ? 'عرض أقل' : `عرض كل المميزات (${venue.features.length})`}
                              </button>
                            )}
                          </div>

                          {/* Amenities */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">المرافق والخدمات</h4>
                            <div className="flex flex-wrap gap-2">
                              {(showAllAmenities ? venue.amenities : venue.amenities?.slice(0, 12))?.map((amenity, index) => (
                                <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                            {venue.amenities?.length > 12 && (
                              <button
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                {showAllAmenities ? 'عرض أقل' : `عرض كل المرافق (${venue.amenities.length})`}
                              </button>
                            )}
                          </div>

                          {/* Rules */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">الشروط والأحكام</h4>
                            <div className="space-y-2">
                              {venue.rules?.map((rule, index) => (
                                <div key={index} className="flex items-start gap-2 text-gray-600">
                                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  <span>{rule}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'location' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">الموقع</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="font-medium text-gray-900">{venue.address}</p>
                                  <p className="text-gray-600 text-sm mt-1">{venue.city}، {venue.governorate}</p>
                                  {venue.mapLink && (
                                    <a 
                                      href={venue.mapLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                                    >
                                      فتح في خرائط جوجل →
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Map Component */}
                          <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                            <Suspense fallback={
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                              </div>
                            }>
                              <VenueMap 
                                venue={venue}
                                governorate={venue.governorate}
                                city={venue.city}
                              />
                            </Suspense>
                          </div>
                        </div>
                      )}

                      {activeTab === 'reviews' && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900">{venue.rating?.toFixed(1)}</div>
                              <div className="flex items-center gap-1 mt-1">
                                {renderStars(venue.rating)}
                              </div>
                              <div className="text-gray-600 text-sm mt-1">({venue.reviewCount} تقييم)</div>
                            </div>
                            <div className="flex-1">
                              <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map((star) => (
                                  <div key={star} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-4">{star}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-yellow-400 h-2 rounded-full" 
                                        style={{ width: `${(venue.rating >= star ? 1 : Math.max(0, venue.rating - star + 1)) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">{(venue.rating >= star ? 1 : Math.max(0, venue.rating - star + 1)) * 100}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Sample Reviews */}
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  م
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">محمد أحمد</div>
                                  <div className="flex items-center gap-1">
                                    {renderStars(5)}
                                    <span className="text-gray-500 text-sm">قبل أسبوع</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700">قاعة رائعة وخدمة ممتازة. فريق العمل محترف جداً والديكور جميل. أنصح بيها لكل العرايس.</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  ف
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">فاطمة محمود</div>
                                  <div className="flex items-center gap-1">
                                    {renderStars(4)}
                                    <span className="text-gray-500 text-sm">قبل شهر</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700">تجربة جميلة، الأسعار مناسبة والخدمة جيدة. المكان نظيف ومنظم.</p>
                            </div>
                          </div>

                          <button className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-colors font-medium">
                            اكتب تقييمك
                          </button>
                        </div>
                      )}

                      {activeTab === 'gallery' && (
                        <div className="space-y-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">معرض الصور والفيديوهات</h4>
                          
                          {/* صور القاعة */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">الصور ({images.length})</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {images.map((image, index) => (
                                <div key={index} className="relative group cursor-pointer">
                                  <img 
                                    src={image}
                                    alt={`${venue.name} ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                                    onClick={() => setSelectedImage(index)}
                                    onError={(e) => {
                                      e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300";
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* فيديوهات القاعة - معدل الموقع */}
                          {hasVideos && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-3">الفيديوهات ({venue.videos.length})</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {venue.videos.map((video, index) => (
                                  <div 
                                    key={index}
                                    className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden"
                                    onClick={() => setSelectedVideo(video)}
                                  >
                                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                      <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                                      <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                        انقر لمشاهدة الفيديو
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Column - Booking & Contact */}
            <div className="space-y-6">
              {/* Booking Card - Sticky */}
              <div 
                ref={stickyRef}
                className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 ${
                  isSticky ? 'sticky top-24 z-30' : ''
                }`}
              >
                {/* Price */}
                <div className="text-center mb-6">
                  {venue.specialOffer ? (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-green-600">
                        {parseInt(venue.price)?.toLocaleString()} جنيه
                      </div>
                      <div className="text-lg text-red-500 line-through">
                        {parseInt(venue.originalPrice)?.toLocaleString()} جنيه
                      </div>
                      <div className="bg-red-100 border border-red-300 rounded-lg p-2">
                        <div className="text-red-700 font-medium text-sm">
                          🎁 {venue.specialOffer}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-green-600">
                      {parseInt(venue.price)?.toLocaleString()} جنيه
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">السعة</span>
                    <span className="font-medium text-gray-900">{venue.capacity} شخص</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">المدينة</span>
                    <span className="font-medium text-gray-900">{venue.city}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">التقييم</span>
                    <span className="font-medium text-gray-900">{venue.rating?.toFixed(1)} ({venue.reviewCount})</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">النوع</span>
                    <span className="font-medium text-gray-900">
                      {venue.weddingSpecific?.openAir ? 'أوبن دور' : 'إن دور'}
                    </span>
                  </div>
                </div>

                {/* Booking Button */}
                <button 
                  onClick={() => handleBookNow(venue)}
                  disabled={!venue.available}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    venue.available
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {venue.available ? (
                    <span className="flex items-center justify-center gap-2">
                      <span>احجز الآن</span>
                      <span>🎉</span>
                    </span>
                  ) : (
                    'غير متاحة حالياً'
                  )}
                </button>

                <p className="text-center text-gray-600 text-sm mt-3">
                  اختر بين الحجز المباشر أو طلب معاينة
                </p>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">التليفون</div>
                      <div className="font-medium text-gray-900">{venue.contact}</div>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  {venue.whatsapp && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">واتساب</div>
                        <div className="font-medium text-gray-900">{venue.whatsapp}</div>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">البريد الإلكتروني</div>
                      <div className="font-medium text-gray-900">{venue.email}</div>
                    </div>
                  </div>

                  {/* Website */}
                  {venue.website && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">الموقع الإلكتروني</div>
                        <a 
                          href={venue.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          زيارة الموقع
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">العنوان</div>
                      <div className="font-medium text-gray-900">{venue.address}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <a 
                    href={`tel:${venue.contact}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-center transition-colors"
                  >
                    اتصل الآن
                  </a>
                  {venue.whatsapp && (
                    <a 
                      href={`https://wa.me/${venue.whatsapp.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium text-center transition-colors"
                    >
                      واتساب
                    </a>
                  )}
                </div>
              </div>

              {/* Special Offers */}
              {venue.specialOffer && (
                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">🎁 عرض خاص</div>
                    <div className="text-lg mb-3">{venue.specialOffer}</div>
                    <div className="text-sm opacity-90">
                      {venue.originalPrice && (
                        <div className="line-through mb-1">
                          السعر الأصلي: {parseInt(venue.originalPrice)?.toLocaleString()} جنيه
                        </div>
                      )}
                      <div>السعر الحالي: {parseInt(venue.price)?.toLocaleString()} جنيه</div>
                    </div>
                  </div>
                </div>
              )}

              {/* إضافات جديدة تجعل العميل مبسوط */}
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-3">✨ مميزات إضافية</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span>✅ استشارة مجانية</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>✅ مساعدة في التخطيط</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>✅ خيارات دفع مرنة</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>✅ دعم فني متكامل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && <VideoModal />}
        </AnimatePresence>
      </div>
    );
  };

  // مودال الحجز
  const BookingModal = () => {
    const [formData, setFormData] = useState({
      date: '',
      time: '',
      guests: 1,
      inspectionDate: '',
      inspectionTime: '',
      notes: '',
      phone: '',
      email: user?.email || '',
      name: user?.name || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleBookingSubmit(formData);
    };

    if (!showBookingModal || !selectedVenue) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto"
        >
          {!bookingType ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">اختر نوع الحجز</h3>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => setBookingType("direct")}
                  className="border-2 border-green-200 rounded-xl p-4 cursor-pointer hover:border-green-400 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">حجز مباشر</h4>
                      <p className="text-sm text-gray-600">احجز القاعة مباشرة للفرح</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setBookingType("inspection")}
                  className="border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">طلب معاينة</h4>
                      <p className="text-sm text-gray-600">اطلب معاينة القاعة قبل الحجز + تأكيد برسالة SMS</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">معلومات القاعة</h4>
                <p className="text-sm text-gray-600">{selectedVenue.name}</p>
                <p className="text-sm text-gray-600">{selectedVenue.city}، {selectedVenue.governorate}</p>
                <p className="text-sm font-semibold text-purple-600">
                  {parseInt(selectedVenue.price)?.toLocaleString()} جنيه
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {bookingType === "direct" ? "حجز القاعة" : "طلب معاينة"}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedVenue.name}</p>
                </div>
                <button
                  onClick={() => setBookingType("")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">تم إرسال الطلب بنجاح!</h3>
                  <p className="text-gray-600 mb-4">
                    {bookingType === "direct" 
                      ? "تم إرسال طلب الحجز بنجاح وسنتواصل معك قريباً" 
                      : "تم إرسال طلب المعاينة بنجاح وسنتواصل معك لتأكيد الموعد"}
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-800 font-medium">تم إرسال رسالة تأكيد إلى هاتفك</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Form fields remain the same as before */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {bookingType === "direct" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الفرح *</label>
                        <input 
                          type="date" 
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">مدة الفرح *</label>
                        <select 
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">اختر المدة</option>
                          <option value="4 ساعات (6:00 مساءً - 10:00 مساءً)">4 ساعات (6:00 مساءً - 10:00 مساءً)</option>
                          <option value="6 ساعات (6:00 مساءً - 12:00 منتصف الليل)">6 ساعات (6:00 مساءً - 12:00 منتصف الليل)</option>
                          <option value="8 ساعات (6:00 مساءً - 2:00 صباحاً)">8 ساعات (6:00 مساءً - 2:00 صباحاً)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">عدد المدعوين *</label>
                        <input 
                          type="number" 
                          min="1"
                          max={selectedVenue.capacity}
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">السعة القصوى: {selectedVenue.capacity} شخص</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 text-blue-800">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">سيتم إرسال رسالة تأكيد إلى هاتفك بعد تقديم الطلب</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ المعاينة *</label>
                          <input 
                            type="date" 
                            value={formData.inspectionDate}
                            onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">الوقت *</label>
                          <select 
                            value={formData.inspectionTime}
                            onChange={(e) => setFormData({...formData, inspectionTime: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">اختر الوقت</option>
                            <option value="9:00 صباحاً - 12:00 ظهراً">9:00 صباحاً - 12:00 ظهراً</option>
                            <option value="12:00 ظهراً - 3:00 عصراً">12:00 ظهراً - 3:00 عصراً</option>
                            <option value="3:00 عصراً - 6:00 مساءً">3:00 عصراً - 6:00 مساءً</option>
                            <option value="6:00 مساءً - 9:00 مساءً">6:00 مساءً - 9:00 مساءً</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية</label>
                    <textarea 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أي متطلبات أو استفسارات إضافية..."
                    />
                  </div>

                  {smsStatus && (
                    <div className={`p-3 rounded-lg ${
                      smsStatus === "success" ? "bg-green-50 text-green-700" : 
                      smsStatus === "error" ? "bg-red-50 text-red-700" : 
                      "bg-blue-50 text-blue-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        {smsStatus === "success" ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : smsStatus === "error" ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                        <span className="text-sm">
                          {smsStatus === "success" ? "تم إرسال الرسالة بنجاح" :
                          smsStatus === "error" ? "فشل في إرسال الرسالة" :
                          "جاري إرسال الرسالة..."}
                        </span>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <span>{bookingType === "direct" ? 'تأكيد الحجز' : 'إرسال طلب المعاينة'}</span>
                        <span>{bookingType === "direct" ? '🎉' : '🔍'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  // Render based on current view
  if (currentView === "details" && selectedVenue) {
    return (
      <>
        <VenueDetails venue={selectedVenue} />
        <Suspense fallback={null}>
          <BookingModal />
        </Suspense>
      </>
    );
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 w-full">
      {/* Navigation */}
      <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 w-full shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-purple-600">🎪 قاعات الأفراح في الغربية</h1>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                الرئيسية
              </button>
              <button 
                onClick={() => navigate('/favorites')}
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                المفضلة ({favorites.length})
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-3 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-purple-600 text-sm font-medium"
                  >
                    تسجيل الدخول
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg"
                  >
                    اعمل حساب
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-28 bg-gradient-to-r from-purple-600 to-pink-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            قاعات الأفراح في محافظة الغربية
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            اكتشف أفضل قاعات الأفراح في طنطا والمحلة والسنطة وكل مدن الغربية
            <br />
            <span className="text-lg opacity-90">لأجمل لحظات فرحك</span>
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => document.getElementById('venues-section').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            اكتشف القاعات 🎉
          </motion.button>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم القاعة، المنطقة، أو الخدمات..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop Filters & Sort */}
            <div className="hidden lg:flex items-center gap-4 ml-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <button 
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                الفلاتر
              </button>

              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-sm"
              >
                مسح الكل
              </button>
            </div>

            {/* Mobile Filters Button */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              الفلاتر
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="venues-section" className="py-8 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Messages */}
          {dataSource === "api" && weddingVenues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center">
                <div className="text-green-600 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-medium">✅ تم تحميل {weddingVenues.length} قاعة من قاعدة البيانات</p>
                  <p className="text-green-700 text-sm">بيانات حقيقية ومحدثة</p>
                </div>
              </div>
            </motion.div>
          )}

          {dataSource === "sample" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center">
                <div className="text-yellow-600 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-yellow-800 font-medium">⚠️ عرض بيانات تجريبية</p>
                  <p className="text-yellow-700 text-sm">جاري محاولة الاتصال بالخادم...</p>
                </div>
              </div>
            </motion.div>
          )}

          {error && dataSource === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center">
                <div className="text-red-600 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-medium">❌ خطأ في الاتصال بالخادم</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-32">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h3 className='text-xl font-bold text-purple-600'>فلاتر البحث</h3>
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      مسح الكل
                    </button>
                  </div>
                  <FiltersContent />
                </div>
              </div>
            </div>

            {/* Venues Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      قاعات الأفراح في الغربية 
                      <span className="text-purple-600 ml-2">({filteredVenues.length})</span>
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {dataSource === "api" 
                        ? `عرض ${filteredVenues.length} من ${weddingVenues.length} قاعة` 
                        : dataSource === "sample"
                        ? "بيانات تجريبية للعرض والتجربة"
                        : "جاري تحميل البيانات..."}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate('/favorites')}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      المفضلة ({favorites.length})
                    </button>
                    
                    {/* Mobile Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="lg:hidden px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
                    >
                      {Object.entries(sortOptions).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedGovernorate !== "all" || selectedCity !== "all" || venueType !== "all" || locationType !== "all" || eventType !== "all" || searchQuery || priceRange < 50000 || capacityRange < 500) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedGovernorate !== "all" && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {governorates[selectedGovernorate].name}
                        <button onClick={() => setSelectedGovernorate("all")} className="hover:text-blue-900">×</button>
                      </span>
                    )}
                    {selectedCity !== "all" && selectedCity !== "كل المدن" && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {selectedCity}
                        <button onClick={() => setSelectedCity("all")} className="hover:text-green-900">×</button>
                      </span>
                    )}
                    {venueType !== "all" && (
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {venueTypes[venueType]}
                        <button onClick={() => setVenueType("all")} className="hover:text-purple-900">×</button>
                      </span>
                    )}
                    {locationType !== "all" && (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        {locationTypes[locationType]}
                        <button onClick={() => setLocationType("all")} className="hover:text-orange-900">×</button>
                      </span>
                    )}
                    {eventType !== "all" && (
                      <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                        {eventTypes[eventType]}
                        <button onClick={() => setEventType("all")} className="hover:text-pink-900">×</button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        بحث: {searchQuery}
                        <button onClick={() => setSearchQuery("")} className="hover:text-gray-900">×</button>
                      </span>
                    )}
                    {priceRange < 50000 && (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        سعر: حتى {priceRange.toLocaleString()} ج
                        <button onClick={() => setPriceRange(50000)} className="hover:text-yellow-900">×</button>
                      </span>
                    )}
                    {capacityRange < 500 && (
                      <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        سعة: حتى {capacityRange} شخص
                        <button onClick={() => setCapacityRange(500)} className="hover:text-indigo-900">×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">جاري تحميل القاعات...</p>
                  <p className="text-gray-500 text-sm mt-2">يتم جلب أحدث البيانات من قاعدة البيانات</p>
                </div>
              ) : filteredVenues.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-600 mb-6">لم نتمكن من العثور على قاعات تطابق معايير البحث الخاصة بك</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={resetFilters}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      مسح كل الفلاتر
                    </button>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      مسح البحث
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    جرب تعديل الفلاتر أو البحث بكلمات مختلفة
                  </p>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                >
                  <AnimatePresence>
                    {filteredVenues.map((venue) => (
                      <VenueCard key={venue.id || venue._id} venue={venue} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Load More Button (for pagination) */}
              {!loading && filteredVenues.length > 0 && filteredVenues.length < weddingVenues.length && (
                <div className="text-center mt-8">
                  <button className="bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-sm">
                    تحميل المزيد من القاعات
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">قاعات الأفراح في الغربية</h4>
              <p className="text-gray-400 text-sm">
                منصة متكاملة لاكتشاف أفضل قاعات الأفراح في محافظة الغربية
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={handleBackToHome} className="hover:text-white transition-colors">الصفحة الرئيسية</button></li>
                <li><button onClick={() => navigate('/favorites')} className="hover:text-white transition-colors">قائمة المفضلة</button></li>
                <li><button className="hover:text-white transition-colors">شروط الاستخدام</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">المدن</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {governorates.الغربية.cities.slice(1).map(city => (
                  <li key={city}><button className="hover:text-white transition-colors">{city}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">التواصل</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>للإعلان أو الدعم الفني:</p>
                <p>info@example.com</p>
                <p>+20 100 000 0000</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 قاعات الأفراح في الغربية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && <MobileFilters />}
      </AnimatePresence>

      {/* Booking Modal */}
      <Suspense fallback={null}>
        <BookingModal />
      </Suspense>
    </div>
  );
};

export default WeddingHallsPage;