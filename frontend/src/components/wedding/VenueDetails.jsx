import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import ReviewSubmission from "./ReviewSubmission";
import LoadingSpinner from "../LoadingSpinner";

// Lazy loaded components
const VenueMap = lazy(() => import("./VenueMap"));

const VenueDetails = ({ venue, onBack, favorites, onToggleFavorite, onShareVenue }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selected360, setSelected360] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPackageDetails, setShowPackageDetails] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    guestCount: "",
    notes: ""
  });
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [venueData, setVenueData] = useState(venue);
  
  const stickyRef = useRef(null);
  const isFavorite = favorites.includes(venue.id);

  // استخدام البيانات مباشرة من الـ API
  useEffect(() => {
    if (venue && venue.packages) {
      setPackages(venue.packages);
    }
    setVenueData(venue);
  }, [venue]);

  // Auto slide for images
  useEffect(() => {
    if (!autoSlide || !venueData.images || venueData.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage(prev => 
        prev === venueData.images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSlide, venueData.images]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch(`/api/venues/${venueData.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews(prev => [newReview, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting review:', error);
      return false;
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        venueId: venueData.id,
        venueName: venueData.name,
        package: selectedPackage !== null ? packages[selectedPackage] : null,
        type: bookingType,
        ...bookingForm
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.');
        setShowBookingModal(false);
        setBookingForm({
          name: "",
          phone: "",
          email: "",
          eventDate: "",
          guestCount: "",
          notes: ""
        });
      } else {
        alert('حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.');
    }
  };

  const openBookingModal = (type) => {
    setBookingType(type);
    setShowBookingModal(true);
  };

  const togglePackageSelection = (index) => {
    if (selectedPackage === index) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(index);
    }
  };

  const togglePackageDetails = (index) => {
    if (showPackageDetails === index) {
      setShowPackageDetails(null);
    } else {
      setShowPackageDetails(index);
    }
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

  // استخدام البيانات الحقيقية من الـ API
  const images = venueData.images && venueData.images.length > 0 ? venueData.images : 
                venueData.image ? [venueData.image] : 
                ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"];

  const hasMultipleImages = images.length > 1;
  const hasVideos = venueData.videos && venueData.videos.length > 0;
  const has360 = venueData.view360 && venueData.view360.length > 0;
  const hasPackages = packages && packages.length > 0;

  // بيانات الطعام من قاعدة البيانات
  const foodAndBeverage = {
    cateringIncluded: venueData.wedding_specific?.cateringService || true,
    cateringType: venueData.wedding_specific?.cateringOptions ? 
                  venueData.wedding_specific.cateringOptions.join('، ') : "بوفيه مفتوح",
    foodFeatures: [
      "بوفيه مفتوح لمدة 4 ساعات",
      "تشكيلة من المقبلات الساخنة والباردة",
      "أطباق رئيسية متنوعة",
      "مشروبات غازية وعصائر",
      "تشكيلة حلويات شرقية وغربية",
      "قهوة وشاي مجانية"
    ],
    additionalFoodServices: [
      "بوفيه لحوم (ساعات إضافية - 100 جنيه للفرد)",
      "مشروبات الطاقة والعصائر المميزة",
      "كب كيك مخصص للعروسين"
    ],
    externalCateringAllowed: false,
    notes: "جميع الأطعمة حلال ومعدة بأعلى معايير الجودة"
  };

  // عرض حالة التحميل للباكدجات
  const renderPackagesSection = () => {
    if (loadingPackages) {
      return (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📦 الباكدجات والعروض</h3>
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="medium" text="جاري تحميل الباكدجات..." />
          </div>
        </div>
      );
    }

    if (!hasPackages) {
      return (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📦 الباكدجات والعروض</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            <p>لا توجد باكدجات متاحة حالياً</p>
            <p className="text-sm mt-2">يمكنك التواصل مع القاعة مباشرة للاستفسار عن العروض المتاحة</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📦 الباكدجات والعروض</h3>
        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`border-2 rounded-xl p-4 transition-all ${
                selectedPackage === index
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {parseInt(pkg.price).toLocaleString()} جنيه
                  </div>
                  {pkg.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {parseInt(pkg.originalPrice).toLocaleString()} جنيه
                    </div>
                  )}
                  {pkg.discount && (
                    <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full mt-1">
                      خصم {pkg.discount} جنيه
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                {pkg.features && pkg.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </div>
                ))}
                {pkg.features && pkg.features.length > 3 && (
                  <button
                    onClick={() => togglePackageDetails(index)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    {showPackageDetails === index ? 'عرض أقل' : `عرض ${pkg.features.length - 3} ميزة أخرى`}
                    <span>{showPackageDetails === index ? '▲' : '▼'}</span>
                  </button>
                )}
              </div>

              {showPackageDetails === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  {pkg.features && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">المميزات المتضمنة:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pkg.additionalServices && pkg.additionalServices.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">الخدمات الإضافية:</h5>
                      <div className="space-y-1">
                        {pkg.additionalServices.map((service, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-blue-500">+</span>
                            {service}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pkg.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">{pkg.notes}</p>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => togglePackageDetails(index)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  {showPackageDetails === index ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                </button>
                <button
                  onClick={() => togglePackageSelection(index)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
                    selectedPackage === index
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {selectedPackage === index ? 'إلغاء التحديد' : 'اختيار الباكدج'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              العودة للقائمة
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => onShareVenue(venueData, e)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                مشاركة
              </button>

              <button
                onClick={(e) => onToggleFavorite(venueData.id, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                  isFavorite 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}
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
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm relative">
              <div className="relative h-80 lg:h-96 bg-gray-100">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="medium" />
                  </div>
                )}

                <img 
                  src={images[selectedImage]}
                  alt={venueData.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800";
                    e.target.onerror = null;
                  }}
                />

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

                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}

                {hasMultipleImages && (
                  <div className="absolute top-14 right-4">
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

                {hasVideos && (
                  <div className="absolute top-24 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {venueData.videos.length} فيديو متاح
                  </div>
                )}
              </div>

              {/* Thumbnails Gallery */}
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
                        alt={`${venueData.name} ${index + 1}`}
                        className="w-20 h-16 object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
                          e.target.onerror = null;
                        }}
                      />
                    </button>
                  ))}
                  
                  {hasVideos && venueData.videos.map((video, index) => {
                    const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                    const getYouTubeThumbnail = (url) => {
                      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                      return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : null;
                    };
                    const thumbnail = isYouTube ? getYouTubeThumbnail(video) : null;

                    return (
                      <button
                        key={`video-${index}`}
                        onClick={() => setSelectedVideo(video)}
                        className="flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all relative group"
                      >
                        {thumbnail ? (
                          <>
                            <img 
                              src={thumbnail}
                              alt={`فيديو ${venueData.name} ${index + 1}`}
                              className="w-20 h-16 object-cover"
                            />
                            <span className="absolute bottom-1 right-1 bg-blue-600 bg-opacity-90 text-white text-xs px-1 rounded">
                              فيديو
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-20 h-16 bg-gray-100 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-blue-600 bg-opacity-90 text-white text-xs px-1 rounded">
                              فيديو
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Price Range Banner */}
            <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="relative text-center">
                <h3 className="text-xl font-bold mb-2">🎉 نطاق أسعار القاعة</h3>
                
                <div className="text-3xl font-bold mb-2">
                  {parseInt(venueData.min_price || 10000).toLocaleString()} - {parseInt(venueData.max_price || 50000).toLocaleString()} جنيه
                </div>

                <p className="text-blue-100 text-sm mt-2">السعر يختلف حسب عدد الضيوف والخدمات الإضافية</p>
              </div>
            </div>

            {/* Packages Section */}
            {renderPackagesSection()}

            {/* Tabs Navigation */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px overflow-x-auto">
                  {[
                    'details', 
                    'features', 
                    'food',
                    'location', 
                    'reviews', 
                    'gallery',
                    ...(hasPackages ? ['packages'] : [])
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-shrink-0 py-4 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'details' && 'التفاصيل'}
                      {tab === 'features' && 'المميزات'}
                      {tab === 'food' && 'الطعام والشرب'}
                      {tab === 'location' && 'الموقع'}
                      {tab === 'reviews' && 'التقييمات'}
                      {tab === 'gallery' && 'معرض الصور'}
                      {tab === 'packages' && 'الباكدجات'}
                    </button>
                  ))}
                </nav>
              </div>

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
                          <h3 className="text-xl font-bold text-gray-900 mb-4">{venueData.name}</h3>
                          <p className="text-gray-700 leading-relaxed">{venueData.description}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">مميزات خاصة بالأفراح</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">غرفة العروسة</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  venueData.wedding_specific?.brideRoom
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {venueData.wedding_specific?.brideRoom ? 'متاحة' : 'غير متاحة'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">خدمة التصوير</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  venueData.wedding_specific?.photography
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {venueData.wedding_specific?.photography ? 'متاحة' : 'غير متاحة'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">خدمة الأكل</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  venueData.wedding_specific?.cateringService
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {venueData.wedding_specific?.cateringService ? 'متاحة' : 'غير متاحة'}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">خدمة الديكور</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  venueData.wedding_specific?.decorationService
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {venueData.wedding_specific?.decorationService ? 'متاحة' : 'غير متاحة'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">نوع المكان</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {venueData.wedding_specific?.openAir ? 'أوبن دور' : 'إن دور'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">المناسبات المتاحة</span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                  {[
                                    venueData.wedding_specific?.weddingEvents && 'أفراح',
                                    venueData.wedding_specific?.engagementEvents && 'خطوبة',
                                    venueData.wedding_specific?.katbKitaabEvents && 'كتب كتاب'
                                  ].filter(Boolean).join('، ') || 'أفراح، خطوبة، كتب كتاب'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

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

                    {activeTab === 'food' && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">🍽️</div>
                            <div>
                              <h3 className="text-xl font-bold">خدمات الطعام والشرب</h3>
                              <p className="text-green-100">تجربة طعام استثنائية لضيوفك</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                              <h4 className="font-semibold mb-2">نوع الخدمة</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">📋</span>
                                <span>{foodAndBeverage.cateringType}</span>
                              </div>
                            </div>
                            
                            <div className="bg-white bg-opacity-20 rounded-lg p-4">
                              <h4 className="font-semibold mb-2">الطعام متضمن</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {foodAndBeverage.cateringIncluded ? '✅' : '❌'}
                                </span>
                                <span>{foodAndBeverage.cateringIncluded ? 'نعم، الطعام عليهم' : 'لا، الطعام إضافي'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">مميزات الطعام المتضمن</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {foodAndBeverage.foodFeatures.map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-green-500 text-xl">✓</span>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {foodAndBeverage.additionalFoodServices.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">خدمات طعام إضافية</h4>
                            <div className="space-y-2">
                              {foodAndBeverage.additionalFoodServices.map((service, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <span className="text-blue-500">+</span>
                                  <span className="text-gray-700">{service}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-yellow-500 text-xl">💡</span>
                            <div>
                              <h5 className="font-semibold text-yellow-800 mb-1">ملاحظات هامة</h5>
                              <p className="text-yellow-700 text-sm">{foodAndBeverage.notes}</p>
                              <p className="text-yellow-700 text-sm mt-2">
                                {foodAndBeverage.externalCateringAllowed 
                                  ? '✓ يسمح بإحضار طعام خارجي' 
                                  : '✗ لا يسمح بإحضار طعام خارجي'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'features' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">المميزات العامة</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(showAllFeatures ? venueData.features : venueData.features.slice(0, 8)).map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <span className="text-xl">✅</span>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {venueData.features.length > 8 && (
                            <button
                              onClick={() => setShowAllFeatures(!showAllFeatures)}
                              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              {showAllFeatures ? 'عرض أقل' : `عرض كل المميزات (${venueData.features.length})`}
                            </button>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">المرافق والخدمات</h4>
                          <div className="flex flex-wrap gap-2">
                            {(showAllAmenities ? venueData.amenities : venueData.amenities.slice(0, 12)).map((amenity, index) => (
                              <span key={index} className="bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm border border-green-200 flex items-center gap-2">
                                <span>✅</span>
                                {amenity}
                              </span>
                            ))}
                          </div>
                          {venueData.amenities.length > 12 && (
                            <button
                              onClick={() => setShowAllAmenities(!showAllAmenities)}
                              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              {showAllAmenities ? 'عرض أقل' : `عرض كل المرافق (${venueData.amenities.length})`}
                            </button>
                          )}
                        </div>

                        {venueData.rules && venueData.rules.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">الشروط والأحكام</h4>
                            <div className="space-y-2">
                              {venueData.rules.map((rule, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-gray-700">{rule}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                                <p className="font-medium text-gray-900">{venueData.address}</p>
                                <p className="text-gray-600 text-sm mt-1">{venueData.city}، {venueData.governorate}</p>
                                {venueData.map_link && (
                                  <a 
                                    href={venueData.map_link} 
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

                        <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                          <Suspense fallback={<LoadingSpinner size="small" text="جاري تحميل الخريطة..." />}>
                            <VenueMap 
                              venue={venueData}
                              governorate={venueData.governorate}
                              city={venueData.city}
                            />
                          </Suspense>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{venueData.rating.toFixed(1)}</div>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(venueData.rating)}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">({venueData.review_count} تقييم)</div>
                          </div>
                          <div className="flex-1">
                            <div className="space-y-1">
                              {[5, 4, 3, 2, 1].map((star) => {
                                const starReviews = reviews.filter(review => review.rating === star).length;
                                const percentage = reviews.length > 0 ? (starReviews / reviews.length) * 100 : 0;
                                
                                return (
                                  <div key={star} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-4">{star}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-yellow-400 h-2 rounded-full" 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">{percentage.toFixed(0)}%</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <ReviewSubmission 
                          venue={venueData}
                          onReviewSubmit={handleReviewSubmit}
                        />

                        <div className="space-y-4">
                          {reviews.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              لا توجد تقييمات حتى الآن. كن أول من يقيم هذه القاعة!
                            </div>
                          ) : (
                            reviews.map((review) => (
                              <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {review.userName ? review.userName.charAt(0) : 'م'}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{review.userName || 'مستخدم'}</div>
                                    <div className="flex items-center gap-1">
                                      {renderStars(review.rating)}
                                      <span className="text-gray-500 text-sm">
                                        {review.created_at ? new Date(review.created_at).toLocaleDateString('ar-EG') : 'قبل فترة'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'gallery' && (
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">معرض الصور والفيديوهات</h4>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">الصور ({images.length})</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="relative group cursor-pointer">
                                <img 
                                  src={image}
                                  alt={`${venueData.name} ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                                  onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300";
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {hasVideos && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">الفيديوهات ({venueData.videos.length})</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {venueData.videos.map((video, index) => {
                                const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                                const getYouTubeThumbnail = (url) => {
                                  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                  return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : null;
                                };
                                const thumbnail = isYouTube ? getYouTubeThumbnail(video) : null;

                                return (
                                  <div 
                                    key={index}
                                    className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden"
                                    onClick={() => setSelectedVideo(video)}
                                  >
                                    {thumbnail ? (
                                      <img 
                                        src={thumbnail}
                                        alt={`فيديو ${venueData.name} ${index + 1}`}
                                        className="w-full aspect-video object-cover"
                                      />
                                    ) : (
                                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                                      <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                        انقر لمشاهدة الفيديو
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'packages' && hasPackages && (
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">📦 الباكدجات والعروض المتاحة</h4>
                        <div className="space-y-4">
                          {packages.map((pkg, index) => (
                            <div key={pkg.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h5 className="text-xl font-bold text-gray-900">{pkg.name}</h5>
                                  <p className="text-gray-600">{pkg.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-600">
                                    {parseInt(pkg.price).toLocaleString()} جنيه
                                  </div>
                                  {pkg.originalPrice && (
                                    <div className="text-sm text-gray-500 line-through">
                                      {parseInt(pkg.originalPrice).toLocaleString()} جنيه
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h6 className="font-semibold text-gray-900 mb-2">المميزات المتضمنة:</h6>
                                  <div className="space-y-1">
                                    {pkg.features.map((feature, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="text-green-500">✓</span>
                                        {feature}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h6 className="font-semibold text-gray-900 mb-2">الخدمات الإضافية:</h6>
                                  <div className="space-y-1">
                                    {pkg.additionalServices.map((service, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="text-blue-500">+</span>
                                        {service}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {pkg.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-sm text-yellow-800">{pkg.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="relative">
            {/* Sticky Container */}
            <div className="sticky top-28 z-30 space-y-6">
              {/* Sticky Info Card */}
              <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
                {/* Price Range */}
                <div className="text-center mb-6">
                  {selectedPackage !== null ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">الباكدج المختار</div>
                      <div className="text-xl font-bold text-green-600">{packages[selectedPackage].name}</div>
                      <div className="text-2xl font-bold text-green-600">
                        {parseInt(packages[selectedPackage].price).toLocaleString()} جنيه
                      </div>
                      {packages[selectedPackage].originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {parseInt(packages[selectedPackage].originalPrice).toLocaleString()} جنيه
                        </div>
                      )}
                      {packages[selectedPackage].discount && (
                        <div className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                          وفر {parseInt(packages[selectedPackage].discount).toLocaleString()} جنيه
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">
                        {parseInt(venueData.min_price).toLocaleString()} - {parseInt(venueData.max_price).toLocaleString()} جنيه
                      </div>
                      <div className="text-sm text-gray-600">ابدأ من {parseInt(venueData.min_price).toLocaleString()} جنيه</div>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span>👥</span>
                      السعة
                    </span>
                    <span className="font-medium text-gray-900">{venueData.capacity} شخص</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span>📍</span>
                      المدينة
                    </span>
                    <span className="font-medium text-gray-900">{venueData.city}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span>⭐</span>
                      التقييم
                    </span>
                    <span className="font-medium text-gray-900">{venueData.rating.toFixed(1)} ({venueData.review_count})</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span>🏢</span>
                      النوع
                    </span>
                    <span className="font-medium text-gray-900">
                      {venueData.wedding_specific?.openAir ? 'أوبن دور' : 'إن دور'}
                    </span>
                  </div>
                </div>

                {/* Booking Buttons */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openBookingModal('inspection')}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      حجز معاينة
                    </button>

                    <button
                      onClick={() => openBookingModal('direct')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      حجز مباشر
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => onToggleFavorite(venueData.id, e)}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2 transform hover:scale-105 ${
                        isFavorite 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isFavorite ? 'في المفضلة' : 'المفضلة'}
                    </button>

                    <button
                      onClick={(e) => onShareVenue(venueData, e)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      مشاركة
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">التليفون</div>
                      <div className="font-medium text-gray-900">{venueData.contact}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">البريد الإلكتروني</div>
                      <div className="font-medium text-gray-900">{venueData.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">العنوان</div>
                      <div className="font-medium text-gray-900">{venueData.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Features */}
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
      </div>

      {/* Video Modal */}
      {selectedVideo && (
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
              <h3 className="text-lg font-semibold">فيديو القاعة - {venueData.name}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {selectedVideo.includes('youtube.com') || selectedVideo.includes('youtu.be') ? (
                (() => {
                  const videoId = selectedVideo.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=1` : null;
                  return embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full aspect-video rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : null;
                })()
              ) : (
                <video 
                  controls 
                  autoPlay
                  className="w-full h-auto max-h-[70vh] rounded-lg"
                  poster={venueData.image}
                >
                  <source src={selectedVideo} type="video/mp4" />
                  <source src={selectedVideo} type="video/webm" />
                  <source src={selectedVideo} type="video/ogg" />
                  المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                </video>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">
                {bookingType === 'inspection' ? 'حجز معاينة' : 'حجز مباشر'} - {venueData.name}
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسمك بالكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ المناسبة *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.eventDate}
                    onChange={(e) => setBookingForm({...bookingForm, eventDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الضيوف المتوقع *
                  </label>
                  <input
                    type="number"
                    required
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm({...bookingForm, guestCount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل عدد الضيوف"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أي ملاحظات أو متطلبات إضافية"
                  />
                </div>

                {selectedPackage !== null && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>الباكدج المختار:</strong> {packages[selectedPackage].name}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  إرسال طلب الحجز
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VenueDetails;