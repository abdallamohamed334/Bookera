import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner";

// Lazy loaded components
const VenueMap = lazy(() => import("./VenueMap"));

const VenueDetails = ({ venue, onBack, onShareVenue }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  const stickyRef = useRef(null);

  // استخدام البيانات مباشرة من الـ API
  useEffect(() => {
    if (venue) {
      if (venue.packages) {
        setPackages(venue.packages);
      }
      setVenueData(venue);
      // جلب التقييمات عند تحميل المكون
      fetchReviews();
    }
  }, [venue]);

  // 🔥 دالة جلب التقييمات من API
 const fetchReviews = async () => {
  if (!venue?.id) return;

  try {
    setLoadingReviews(true);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wedding-venues/${venue.id}/reviews`);


    if (response.ok) {
      const data = await response.json();
      setReviews(data.reviews || []); // خليها دايمًا مصفوفة
    } else {
      console.error('فشل في جلب التقييمات');
      setReviews([]); // fallback
    }
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    setReviews([]); // fallback
  } finally {
    setLoadingReviews(false);
  }
};


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

  // 🔥 إصلاح: دالة محسنة للعودة مع منع الانتشار
  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('الضغط على زر العودة');
    if (onBack) {
      onBack();
    }
  };

  // 🔥 إصلاح: دالة محسنة للمشاركة
  // 🔥 إصلاح: دالة مشاركة معدلة تماماً
const handleShareClick = (e) => {
  // منع السلوك الافتراضي بأمان
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  
  console.log('🎯 بدء عملية المشاركة...');
  
  // التحقق من وجود بيانات القاعة
  if (!venueData || !venueData.id) {
    console.error('❌ بيانات القاعة غير متاحة');
    alert('❌ لا يمكن مشاركة القاعة - البيانات غير متاحة');
    return;
  }

  try {
    // إنشاء رابط المشاركة
    const venueUrl = `${window.location.origin}?venue=${venueData.id}&venue_name=${encodeURIComponent(venueData.name || 'قاعة')}&type=wedding&share=true`;
    const shareText = `🏢 ${venueData.name || 'قاعة حفلات'}\n📍 ${venueData.address || 'موقع القاعة'}\n${venueData.description ? venueData.description.substring(0, 100) + '...' : 'قاعة رائعة للمناسبات والأفراح'}`;

    console.log('🔗 الرابط المنشأ:', venueUrl);

    // ⚠️ تجاوز الدالة الخارجية واستخدام المشاركة المباشرة
    console.log('🚀 استخدام المشاركة المباشرة (تجاوز الدالة الخارجية)');
    
    // استخدام Web Share API إذا كان متاحاً
    if (navigator.share) {
      console.log('📱 استخدام Web Share API');
      navigator.share({
        title: `قاعة ${venueData.name || 'حفلات'}`,
        text: shareText,
        url: venueUrl,
      })
      .then(() => {
        console.log('✅ المشاركة ناجحة');
      })
      .catch((error) => {
        console.log('❌ تم إلغاء المشاركة أو حدث خطأ:', error);
        // الرجوع لطريقة النسخ إذا فشلت المشاركة
        fallbackShare(shareText, venueUrl);
      });
    } else {
      console.log('📋 استخدام طريقة النسخ (fallback)');
      // استخدام طريقة النسخ للحافظة
      fallbackShare(shareText, venueUrl);
    }

  } catch (error) {
    console.error('💥 خطأ غير متوقع في المشاركة:', error);
    alert('❌ حدث خطأ غير متوقع أثناء المشاركة');
  }
};

// دالة مساعدة للنسخ
const fallbackShare = (shareText, venueUrl) => {
  const fullShareText = `${shareText}\n\n🔗 ${venueUrl}`;
  
  navigator.clipboard.writeText(fullShareText)
    .then(() => {
      console.log('✅ تم النسخ للحافظة بنجاح');
      alert('✅ تم نسخ رابط القاعة للحافظة\nيمكنك مشاركته مع الآخرين');
    })
    .catch((err) => {
      console.error('❌ فشل النسخ للحافظة:', err);
      alert(`🔗 رابط القاعة:\n${venueUrl}\n\nيمكنك نسخ الرابط يدوياً ومشاركته`);
    });
};

  // 🔥 دالة محسنة لإرسال طلب الحجز
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // تحضير بيانات الحجز
      const bookingData = {
        venue_id: venueData.id,
        venue_name: venueData.name,
        user_name: bookingForm.name,
        user_phone: bookingForm.phone,
        user_email: bookingForm.email,
        type: bookingType === 'inspection' ? 'معاينة' : 'حجز مباشر',
        date: bookingForm.eventDate,
        time: new Date().toLocaleTimeString('ar-EG'),
        guests: parseInt(bookingForm.guestCount) || 0,
        notes: bookingForm.notes,
        status: 'pending',
        package_name: selectedPackage !== null ? packages[selectedPackage]?.name : null,
        package_price: selectedPackage !== null ? packages[selectedPackage]?.price : null,
        created_at: new Date().toISOString()
      };

      console.log('📤 بيانات الحجز المرسلة:', bookingData);

      // 1. حفظ في قاعدة البيانات
      const dbResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (dbResponse.ok) {
        const result = await dbResponse.json();
        console.log('✅ تم حفظ الحجز في قاعدة البيانات:', result);
        
        // 2. إرسال رسالة واتساب (اختياري)
        await sendWhatsAppMessage(bookingData);
        
        alert('✅ تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.');
        setShowBookingModal(false);
        setBookingForm({
          name: "",
          phone: "",
          email: "",
          eventDate: "",
          guestCount: "",
          notes: ""
        });
        setSelectedPackage(null);
        
      } else {
        const errorText = await dbResponse.text();
        console.error('❌ خطأ في حفظ الحجز:', errorText);
        throw new Error(`فشل في حفظ الحجز: ${errorText}`);
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى.\n' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة إرسال رسالة واتساب (اختيارية)
  const sendWhatsAppMessage = async (bookingData) => {
    try {
      const message = `🎊 *طلب حجز جديد* 🎊
      
🏢 *القاعة:* ${bookingData.venue_name}
👤 *الاسم:* ${bookingData.user_name}
📞 *الهاتف:* ${bookingData.user_phone}
📅 *التاريخ:* ${bookingData.date}
👥 *عدد الضيوف:* ${bookingData.guests}
📝 *النوع:* ${bookingData.type}

${bookingData.package_name ? `📦 *الباكدج:* ${bookingData.package_name}` : ''}
${bookingData.package_price ? `💰 *السعر:* ${bookingData.package_price} جنيه` : ''}

⏰ *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}`;

      // يمكنك إضافة إرسال واتساب هنا إذا أردت
      console.log('رسالة واتساب جاهزة:', message);
      
    } catch (error) {
      console.error('Error preparing WhatsApp message:', error);
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

  // 🔥 دالة مساعدة لتنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return 'قريباً';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'قريباً';
    }
  };

  // 🔥 إصلاح: استخدام بيانات افتراضية آمنة
  const images = venueData?.images && venueData.images.length > 0 ? venueData.images : 
                venueData?.image ? [venueData.image] : 
                ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"];

  const hasMultipleImages = images.length > 1;
  const hasVideos = venueData?.videos && venueData.videos.length > 0;
  const has360 = venueData?.view360 && venueData.view360.length > 0;
  const hasPackages = packages && packages.length > 0;

  // 🔥 إصلاح: بيانات الطعام مع قيم افتراضية آمنة
  const foodAndBeverage = {
    cateringIncluded: venueData?.wedding_specific?.cateringService || true,
    cateringType: venueData?.wedding_specific?.cateringOptions ? 
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

  // 🔥 إصلاح: عرض حالة التحميل للباكدجات
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
              key={pkg.id || index}
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
                    {parseInt(pkg.price || 0).toLocaleString()} جنيه
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

  // 🔥 إصلاح: عرض حالة التحميل للتقييمات
  const renderReviewsSection = () => {
    if (loadingReviews) {
      return (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="medium" text="جاري تحميل التقييمات..." />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review.id || index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.user_name?.charAt(0) || review.userName?.charAt(0) || 'ز'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.user_name || review.userName || 'زائر'}</p>
                    <p className="text-gray-500 text-sm">{formatDate(review.created_at || review.date)}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700">{review.comment || review.review_text}</p>
              
              {review.response && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600 font-semibold">رد الإدارة:</span>
                  </div>
                  <p className="text-blue-800 text-sm">{review.response}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p>لا توجد تقييمات حتى الآن</p>
            <p className="text-sm mt-2">سيتم إضافة التقييمات قريباً</p>
          </div>
        )}
      </div>
    );
  };

  // 🔥 التحقق من وجود البيانات قبل العرض
  if (!venueData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="جاري تحميل بيانات القاعة..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleBackClick}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              العودة للقائمة
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleShareClick}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                مشاركة
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

                    {activeTab === 'features' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">المميزات العامة</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(showAllFeatures ? (venueData.features || []) : (venueData.features || []).slice(0, 8)).map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <span className="text-xl">✅</span>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {venueData.features && venueData.features.length > 8 && (
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
                            {(showAllAmenities ? (venueData.amenities || []) : (venueData.amenities || []).slice(0, 12)).map((amenity, index) => (
                              <span key={index} className="bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm border border-green-200 flex items-center gap-2">
                                <span>✅</span>
                                {amenity}
                              </span>
                            ))}
                          </div>
                          {venueData.amenities && venueData.amenities.length > 12 && (
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
                                  <span className="text-red-700 text-sm">{rule}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'food' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">🍽️ خدمات الطعام والشراب</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">خدمة التموين</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  foodAndBeverage.cateringIncluded 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {foodAndBeverage.cateringIncluded ? 'مُتضمنة' : 'غير مُتضمنة'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">نوع التموين</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {foodAndBeverage.cateringType}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">التموين الخارجي</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  foodAndBeverage.externalCateringAllowed 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {foodAndBeverage.externalCateringAllowed ? 'مسموح' : 'غير مسموح'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">📋 مميزات البوفيه</h4>
                            <div className="space-y-2">
                              {foodAndBeverage.foodFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                  <span className="text-green-500">✓</span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {foodAndBeverage.additionalFoodServices.length > 0 && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">💎 خدمات إضافية (اختيارية)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {foodAndBeverage.additionalFoodServices.map((service, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg border border-purple-100">
                                  <span className="text-purple-500">+</span>
                                  {service}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {foodAndBeverage.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-yellow-500 text-lg">💡</span>
                              <p className="text-yellow-800 text-sm">{foodAndBeverage.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'location' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">📍 معلومات الموقع</h4>
                            <div className="space-y-4 bg-white rounded-xl p-6 border border-gray-200">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl">🏢</span>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900 text-lg">{venueData.name}</h5>
                                  <p className="text-gray-600 mt-1">{venueData.address}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl">🗺️</span>
                                </div>
                                <div>
                                  <p className="text-gray-700 font-medium">الموقع: {venueData.city}، {venueData.governorate}</p>
                                  {venueData.area && (
                                    <p className="text-gray-600 text-sm mt-1">المنطقة: {venueData.area}</p>
                                  )}
                                </div>
                              </div>
                              
                              {venueData.contact_phone && (
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">📞</span>
                                  </div>
                                  <div>
                                    <a 
                                      href={`tel:${venueData.contact_phone}`}
                                      className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
                                    >
                                      {venueData.contact_phone}
                                    </a>
                                    <p className="text-gray-600 text-sm mt-1">اتصل للاستفسار أو الحجز</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                              <h4 className="font-semibold text-gray-900 text-lg">🗺️ موقع القاعة على الخريطة</h4>
                            </div>
                            <div className="h-80">
                              <Suspense fallback={
                                <div className="h-full flex items-center justify-center">
                                  <LoadingSpinner size="medium" text="جاري تحميل الخريطة..." />
                                </div>
                              }>
                                <VenueMap 
                                  venue={venueData}
                                  governorate={venueData.governorate}
                                  city={venueData.city}
                                />
                              </Suspense>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">🚕</span>
                              <h5 className="font-semibold text-blue-900">التاكسي</h5>
                            </div>
                            <p className="text-blue-800 text-sm">أعطِ السائق العنوان: {venueData.address}</p>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">🚗</span>
                              <h5 className="font-semibold text-green-900">السيارة</h5>
                            </div>
                            <p className="text-green-800 text-sm">موقف سيارات مجاني متوفر أمام القاعة</p>
                          </div>
                          
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">📱</span>
                              <h5 className="font-semibold text-purple-900">التطبيقات</h5>
                            </div>
                            <p className="text-purple-800 text-sm">ابحث عن: {venueData.name} في خرائط Google</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">💬 تقييمات الزبائن</h4>
                          <div className="flex items-center gap-2">
                            {renderStars(venueData.rating || 4.5)}
                            <span className="text-gray-600 text-sm">
                              ({reviews.length || 0} تقييم)
                            </span>
                          </div>
                        </div>

                        {renderReviewsSection()}
                      </div>
                    )}

                    {activeTab === 'gallery' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">📸 معرض الصور</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((image, index) => (
                              <div 
                                key={index}
                                className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200"
                                onClick={() => setSelectedImage(index)}
                              >
                                <img 
                                  src={image}
                                  alt={`${venueData.name} ${index + 1}`}
                                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0l3-3m-3 3L7 13" />
                                  </svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {hasVideos && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">🎥 مقاطع الفيديو</h4>
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
                                    className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200"
                                    onClick={() => setSelectedVideo(video)}
                                  >
                                    {thumbnail ? (
                                      <img 
                                        src={thumbnail}
                                        alt={`فيديو ${venueData.name} ${index + 1}`}
                                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                      <div className="w-12 h-12 bg-blue-600 bg-opacity-90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                      فيديو {index + 1}
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
                      <div>
                        {renderPackagesSection()}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Contact */}
          <div className="lg:col-span-1">
            <div ref={stickyRef} className="sticky top-24 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 إجراء سريع</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => openBookingModal('inspection')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    طلب معاينة
                  </button>
                  
                  <button
                    onClick={() => openBookingModal('booking')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    حجز مباشر
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleShareClick}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    مشاركة القاعة
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📞 معلومات التواصل</h3>
                
                <div className="space-y-3">
                  {venueData.contact_phone && (
                    <a 
                      href={`tel:${venueData.contact_phone}`}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="font-medium">{venueData.contact_phone}</span>
                    </a>
                  )}
                  
                  {venueData.contact_email && (
                    <a 
                      href={`mailto:${venueData.contact_email}`}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="font-medium">{venueData.contact_email}</span>
                    </a>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{venueData.address}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 معلومات سريعة</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعة</span>
                    <span className="font-semibold text-gray-900">
                      {parseInt(venueData.capacity || 200).toLocaleString()} شخص
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">التقييم</span>
                    <div className="flex items-center gap-1">
                      {renderStars(venueData.rating || 4.5)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">نوع المكان</span>
                    <span className="font-semibold text-gray-900">
                      {venueData.wedding_specific?.openAir ? 'أوبن دور' : 'إن دور'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مواقف سيارات</span>
                    <span className="font-semibold text-gray-900">
                      {venueData.parking ? 'متاحة' : 'غير متاحة'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
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
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-4 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">فيديو القاعة</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={selectedVideo}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 360 View Modal */}
      <AnimatePresence>
        {selected360 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected360(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-4 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">عرض 360 درجة</h3>
                <button
                  onClick={() => setSelected360(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={selected360}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
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
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {bookingType === 'inspection' ? 'طلب معاينة' : 'حجز مباشر'}
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    onChange={(e) => setBookingForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الضيوف المتوقع
                  </label>
                  <input
                    type="number"
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="أدخل عدد الضيوف"
                    min="1"
                  />
                </div>

                {hasPackages && selectedPackage !== null && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-900 mb-1">الباكدج المختار</h4>
                    <p className="text-blue-700 text-sm">{packages[selectedPackage]?.name}</p>
                    <p className="text-blue-600 font-bold text-sm">
                      {parseInt(packages[selectedPackage]?.price || 0).toLocaleString()} جنيه
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="أي ملاحظات أو متطلبات إضافية..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : bookingType === 'inspection'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="small" />
                      جاري الإرسال...
                    </div>
                  ) : (
                    bookingType === 'inspection' ? 'إرسال طلب المعاينة' : 'إرسال طلب الحجز'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VenueDetails;