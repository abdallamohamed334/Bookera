import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

// Lazy loaded components
const VenueMap = lazy(() => import("./VenueMap"));

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [venueData, setVenueData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
  const [bookingType, setBookingType] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    guestCount: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [venueOwner, setVenueOwner] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [reels, setReels] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  // 🔥 إعدادات التليجرام
  const TELEGRAM_CONFIG = {
    botToken: "8407583922:AAHHVA4rynx-PTwNTw6Efc6daJtpygaRGuY",
    chatIds: {
      admin: "5306134688",
    },
    enabled: true
  };

  // 🔥 جلب بيانات القاعة والباكدجات من API
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب بيانات القاعة
        const venueResponse = await fetch(
          `https://bookera-production.up.railway.app/api/wedding-venues/${id}`,
          { signal: controller.signal }
        );
        
        if (!venueResponse.ok) throw new Error('فشل في جلب بيانات القاعة');
        
        const venueData = await venueResponse.json();
        setVenueData(venueData);

        // جلب الباكدجات
        const packagesResponse = await fetch(
          `https://bookera-production.up.railway.app/api/wedding-venues/${id}/packages`,
          { signal: controller.signal }
        );
        
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          setPackages(packagesData.packages || packagesData || []);
        } else {
          setPackages(venueData.packages || []);
        }
        
        // 🔥 حفظ بيانات صاحب القاعة
        if (venueData.owner_phone) {
          setVenueOwner({
            phone: venueData.owner_phone,
            name: venueData.owner_name || 'صاحب القاعة'
          });
        } else {
          setVenueOwner({
            phone: venueData.phone || venueData.whatsapp || "01095952888",
            name: 'صاحب القاعة'
          });
        }

        // 🔥 إعداد موقع الخريطة
        if (venueData.location_lat && venueData.location_lng) {
          setMapLocation({
            lat: parseFloat(venueData.location_lat),
            lng: parseFloat(venueData.location_lng),
            name: venueData.name,
            address: venueData.address,
            city: venueData.city,
            governorate: venueData.governorate
          });
        } else {
          setMapLocation({
            lat: 30.0444,
            lng: 31.2357,
            name: venueData.name,
            address: venueData.address,
            city: venueData.city,
            governorate: venueData.governorate
          });
        }

        // 🔥 إعداد نطاق الأسعار
        setPriceRange({
          min: venueData.min_price || venueData.price || 0,
          max: venueData.max_price || venueData.price || 0
        });

        // 🔥 إعداد الريلز (استخدام الفيديوهات كريلز)
        if (venueData.videos && venueData.videos.length > 0) {
          const reelsData = venueData.videos.map((video, index) => ({
            id: index + 1,
            videoUrl: video,
            thumbnail: venueData.images?.[0] || venueData.image,
            title: `ريلز ${venueData.name} #${index + 1}`,
            description: "جولة داخل القاعة وتصميماتها الفاخرة",
            likes: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 50) + 5,
            duration: "0:30",
            views: Math.floor(Math.random() * 5000) + 1000
          }));
          setReels(reelsData);
        }
        
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('تعذر تحميل بيانات القاعة. يرجى المحاولة مرة أخرى.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [id]);

  // 🔥 جلب التقييمات
  useEffect(() => {
    if (!venueData?.id) return;

    const fetchReviewsData = async () => {
      try {
        setLoadingReviews(true);
        const response = await fetch(
          `https://bookera-production.up.railway.app/api/wedding-venues/${venueData.id}/reviews`
        );
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviewsData();
  }, [venueData?.id]);

  // 🔥 دالة العودة
  const handleBackClick = () => {
    navigate(-1);
  };

  // 🔥 دالة المشاركة
  const handleShareClick = () => {
    if (!venueData) return;
    
    const shareUrl = `${window.location.origin}/venue/${venueData.id}`;
    const shareText = `🏢 ${venueData.name}\n📍 ${venueData.address}\n${venueData.description?.substring(0, 100)}...`;

    if (navigator.share) {
      navigator.share({
        title: venueData.name,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
        .then(() => alert('✅ تم نسخ رابط القاعة للحافظة'))
        .catch(() => alert(`🔗 رابط القاعة:\n${shareUrl}`));
    }
  };

  // 🔥 دالة إرسال الحجز
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        venue_id: venueData.id,
        venue_name: venueData.name,
        user_name: bookingForm.name,
        user_phone: bookingForm.phone,
        user_email: bookingForm.email,
        type: bookingType === 'inspection' ? 'معاينة' : 'حجز مباشر',
        date: bookingForm.eventDate,
        guests: parseInt(bookingForm.guestCount) || 0,
        notes: bookingForm.notes,
        package_name: selectedPackage !== null ? packages[selectedPackage]?.name : null,
        package_price: selectedPackage !== null ? packages[selectedPackage]?.price : null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const response = await fetch('https://bookera-production.up.railway.app/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        await sendNotifications(bookingData);
        setBookingSubmitted(true);
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingSubmitted(false);
        }, 2000);
        
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
        throw new Error('فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 دالة إرسال الإشعارات
  const sendNotifications = async (bookingData) => {
    try {
      const baseMessage = `
🎊 طلب ${bookingData.type} جديد 🎊

🏢 القاعة: ${bookingData.venue_name}
👤 الاسم: ${bookingData.user_name}
📞 الهاتف: ${bookingData.user_phone}
${bookingData.user_email ? `📧 البريد: ${bookingData.user_email}` : ''}
📅 التاريخ المطلوب: ${bookingData.date}
👥 عدد الضيوف: ${bookingData.guests}

${bookingData.package_name ? `📦 الباكدج المختار: ${bookingData.package_name}` : ''}
${bookingData.package_price ? `💰 سعر الباكدج: ${parseInt(bookingData.package_price).toLocaleString()} جنيه` : ''}

📝 ملاحظات: ${bookingData.notes || 'لا توجد ملاحظات'}

⏰ وقت الطلب: ${new Date().toLocaleString('ar-EG')}
      `.trim();

      const promises = [];

      if (TELEGRAM_CONFIG.enabled) {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        promises.push(
          fetch(telegramUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: TELEGRAM_CONFIG.chatIds.admin,
              text: `📋 طلب جديد للنظام\n\n${baseMessage}\n\n🆔 رقم القاعة: ${bookingData.venue_id}`,
            }),
          })
        );
      }

      if (venueOwner?.phone) {
        const whatsappMessage = `🎊 طلب ${bookingData.type} جديد 🎊%0A%0A🏢 القاعة: ${bookingData.venue_name}%0A👤 الاسم: ${bookingData.user_name}%0A📞 الهاتف: ${bookingData.user_phone}%0A${bookingData.user_email ? `📧 البريد: ${bookingData.user_email}%0A` : ''}📅 التاريخ: ${bookingData.date}%0A👥 الضيوف: ${bookingData.guests}%0A${bookingData.package_name ? `📦 الباكدج: ${bookingData.package_name}%0A` : ''}${bookingData.package_price ? `💰 السعر: ${parseInt(bookingData.package_price).toLocaleString()} جنيه%0A` : ''}📝 الملاحظات: ${bookingData.notes || 'لا توجد'}%0A%0A⏰ وقت الطلب: ${new Date().toLocaleString('ar-EG')}`;

        const whatsappUrl = `https://wa.me/${venueOwner.phone}?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank', 'width=600,height=700');
        promises.push(Promise.resolve({ ok: true }));
      }

      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Error sending notifications:', error);
      return false;
    }
  };

  // 🔥 فتح نموذج الحجز
  const openBookingModal = (type) => {
    setBookingType(type);
    setShowBookingModal(true);
    setBookingSubmitted(false);
  };

  // 🔥 إغلاق نموذج الحجز
  const closeBookingModal = () => {
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
    setBookingSubmitted(false);
  };

  // 🔥 فتح معرض الصور
  const openImageModal = (index) => {
    setSelectedGalleryImage(index);
    setShowImageModal(true);
  };

  // 🔥 إغلاق معرض الصور
  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // 🔥 التنقل في معرض الصور
  const navigateImage = (direction) => {
    const images = venueData?.images || [];
    if (direction === 'next') {
      setSelectedGalleryImage(prev => (prev + 1) % images.length);
    } else {
      setSelectedGalleryImage(prev => (prev - 1 + images.length) % images.length);
    }
  };

  // 🔥 فتح الريلز
  const openReelsModal = (reel, index) => {
    setSelectedReel(reel);
    setCurrentReelIndex(index);
    setShowReelsModal(true);
  };

  // 🔥 إغلاق الريلز
  const closeReelsModal = () => {
    setShowReelsModal(false);
    setSelectedReel(null);
    setCurrentReelIndex(0);
  };

  // 🔥 التنقل بين الريلز
  const navigateReels = (direction) => {
    if (direction === 'next') {
      const nextIndex = (currentReelIndex + 1) % reels.length;
      setSelectedReel(reels[nextIndex]);
      setCurrentReelIndex(nextIndex);
    } else {
      const prevIndex = (currentReelIndex - 1 + reels.length) % reels.length;
      setSelectedReel(reels[prevIndex]);
      setCurrentReelIndex(prevIndex);
    }
  };

  // 🔥 عرض النجوم
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
        <span className="text-gray-600 text-xs mr-1">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  // 🔥 عرض سكرول الصور الرئيسي (6 صور فقط)
  const renderImageScroll = () => {
    const allImages = venueData?.images || (venueData?.image ? [venueData.image] : []);
    const displayImages = allImages.slice(0, 6); // 🔥 عرض 6 صور فقط في السلايدر
    
    if (displayImages.length === 0) {
      return (
        <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">🏢</div>
            <p className="text-sm">لا توجد صور متاحة</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-96 overflow-hidden">
        <div className="flex h-full transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${selectedImage * 100}%)` }}>
          {displayImages.map((image, index) => (
            <div key={index} className="w-full h-96 flex-shrink-0 relative">
              <img 
                src={image} 
                alt={`${venueData.name} - صورة ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          ))}
        </div>
        
        {/* أزرار التنقل */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 text-xs"
            >
              ‹
            </button>
            <button
              onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 text-xs"
            >
              ›
            </button>
          </>
        )}
        
        {/* مؤشر الصور */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all transform hover:scale-125 ${
                  index === selectedImage ? 'bg-white scale-125' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* شارة القاعة المميزة */}
        {venueData?.is_featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-bold text-xs shadow-lg">
            ⭐ مميزة
          </div>
        )}
      </div>
    );
  };

  // 🔥 عرض قسم الريلز
  const renderReelsSection = () => {
    if (reels.length === 0) {
      return null;
    }

    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1 rounded-lg text-sm">🎬</span>
          ريلز القاعة
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {reels.map((reel, index) => (
            <motion.div 
              key={reel.id} 
              className="aspect-[9/16] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
              whileHover={{ scale: 1.05 }}
              onClick={() => openReelsModal(reel, index)}
            >
              {/* ثامبنل الفيديو */}
              <div className="relative w-full h-full">
                <img 
                  src={reel.thumbnail} 
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* طبقة تدرج لوني */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* أيقونة التشغيل */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                </div>
                
                {/* معلومات الريلز */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1">
                      <span>👁️</span>
                      <span>{reel.views.toLocaleString()}</span>
                    </span>
                    <span>{reel.duration}</span>
                  </div>
                </div>
                
                {/* شارة الريلز */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  REELS
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* نص توضيحي */}
        <div className="text-center mt-4 p-3 bg-white/80 rounded-xl border border-purple-200">
          <p className="text-gray-700 text-sm font-medium">
            🎥 استمتع بمشاهدة ريلز حصرية للقاعة تعرض أجمل اللحظات والتفاصيل
          </p>
        </div>
      </div>
    );
  };

  // 🔥 عرض قسم الفيديوهات
  const renderVideosSection = () => {
    if (!venueData?.videos || venueData.videos.length === 0) {
      return null;
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 mb-4 shadow-lg border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 p-1 rounded-lg text-sm">🎥</span>
          فيديوهات القاعة
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {venueData.videos.map((video, index) => (
            <div key={index} className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
              <video 
                controls 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                poster={venueData.images?.[0]}
              >
                <source src={video} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <p className="font-bold text-sm">فيديو {index + 1}</p>
                  <p className="text-xs">جولة داخل القاعة وتصميماتها</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 🔥 عرض معلومات سريعة
  const renderQuickInfo = () => {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 mb-4 shadow-lg border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 p-1 rounded-lg text-sm">⚡</span>
          معلومات سريعة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-bold text-gray-900 text-sm">{venueData.capacity || 250}+</div>
            <div className="text-gray-600 text-xs">السعة</div>
          </div>
          
          <div className="text-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">⭐</div>
            {renderStars(venueData.rating || 4.5)}
            <div className="text-gray-600 text-xs mt-1">التقييم</div>
          </div>
          
          <div className="text-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-bold text-green-600 text-sm">
              {parseInt(priceRange.min).toLocaleString()} ج
            </div>
            <div className="text-gray-600 text-xs">يبدأ من</div>
          </div>
          
          <div className="text-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📅</div>
            <div className={`font-bold text-sm ${venueData.available ? 'text-green-600' : 'text-red-600'}`}>
              {venueData.available ? 'متاحة' : 'غير متاحة'}
            </div>
            <div className="text-gray-600 text-xs">الحجوزات</div>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض معلومات التواصل
  const renderContactInfo = () => {
    return (
      <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 mb-4 shadow-lg border border-green-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-green-100 p-1 rounded-lg text-sm">📞</span>
          معلومات التواصل
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <span className="text-xl bg-blue-100 p-2 rounded-lg">📍</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">العنوان</p>
              <p className="text-gray-600 text-xs mt-1">{venueData.address || 'بجوار محطة المترو، طريق رئيسي، المحافظة'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <span className="text-xl bg-green-100 p-2 rounded-lg">📞</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">الهاتف</p>
              <p className="text-gray-600 text-xs mt-1">{venueOwner?.phone || '01095952888'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض المميزات
  const renderFeatures = () => {
    const features = venueData?.features || [];

    return (
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-purple-100 p-1 rounded-lg text-sm">⭐</span>
          المميزات والخدمات
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {features.slice(0, showAllFeatures ? features.length : 6).map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <span className="text-green-500 text-lg bg-green-50 p-1 rounded-lg group-hover:scale-110 transition-transform">✓</span>
              <span className="text-gray-700 text-sm font-medium flex-1">{feature}</span>
            </div>
          ))}
        </div>
        {features.length > 6 && (
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="text-blue-600 hover:text-blue-700 font-bold mt-3 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-xs w-full justify-center"
          >
            {showAllFeatures ? 'عرض أقل' : `عرض ${features.length - 6} ميزة أخرى`}
            <span className="text-sm">{showAllFeatures ? '▲' : '▼'}</span>
          </button>
        )}
      </div>
    );
  };

  // 🔥 عرض الباكدجات مع إصلاح الألوان
  const renderPackagesSection = () => {
    const packagesToShow = packages && packages.length > 0 ? packages : [];

    if (packagesToShow.length === 0) {
      return (
        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-4 mb-4 shadow-lg border border-yellow-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 p-1 rounded-lg text-sm">📦</span>
            الباكدجات والعروض
          </h3>
          <div className="text-center py-6">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-600 text-sm">لا توجد باكدجات متاحة حالياً</p>
            <p className="text-gray-500 text-xs mt-1">يمكنك التواصل مع القاعة مباشرة للاستفسار عن العروض المتاحة</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-4 mb-4 shadow-lg border border-yellow-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-yellow-100 p-1 rounded-lg text-sm">📦</span>
          الباكدجات والعروض
        </h3>
        <div className="space-y-4">
          {packagesToShow.map((pkg, index) => (
            <motion.div
              key={pkg.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-xl p-4 transition-all ${
                selectedPackage === index
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{pkg.name || `باكدج ${index + 1}`}</h4>
                    <p className="text-gray-600 text-xs">{pkg.description || pkg.details || 'باكدج شامل لجميع الخدمات'}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {parseInt(pkg.price || pkg.cost || 0).toLocaleString()} جنيه
                  </div>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className="text-sm text-red-600 font-bold mt-1 bg-red-50 px-2 py-1 rounded-full inline-block">
                      🔥 خصم {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                    </div>
                  )}
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className="text-sm text-gray-500 line-through mt-1">
                      {parseInt(pkg.originalPrice).toLocaleString()} جنيه
                    </div>
                  )}
                </div>
              </div>

              {/* 🔥 عرض كل التفاصيل مرة واحدة بدون زر */}
              <div className="mt-4 space-y-3 border-t pt-4">
                <h5 className="font-bold text-gray-900 text-sm">المميزات المتضمنة:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(pkg.features || pkg.includes || []).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700 bg-white p-2 rounded-lg border border-gray-200 text-xs hover:border-blue-300 transition-colors">
                      <span className="text-green-500 text-sm">✓</span>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* معلومات إضافية عن الباكدج */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="text-center bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-600">السعة</p>
                    <p className="font-bold text-gray-900">{pkg.capacity || venueData.capacity || 'غير محدد'}</p>
                  </div>
                  <div className="text-center bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-600">المدة</p>
                    <p className="font-bold text-gray-900">{pkg.duration || '6 ساعات'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedPackage(selectedPackage === index ? null : index)}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all hover:scale-105 text-xs ${
                    selectedPackage === index
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md'
                  }`}
                >
                  {selectedPackage === index ? 'إلغاء التحديد' : 'اختيار الباكدج'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // 🔥 عرض الخريطة مع تصميم جميل بدون خرائط
  const renderMapSection = () => {
    const locationToShow = mapLocation || { 
      lat: 30.0444, 
      lng: 31.2357,
      name: venueData?.name,
      address: venueData?.address,
      city: venueData?.city,
      governorate: venueData?.governorate
    };

    return (
      <div className="space-y-6">
        {/* معلومات الموقع */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-lg">📍</span>
            معلومات الموقع
          </h4>
          <div className="space-y-4">
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
                <p className="text-gray-500 text-xs mt-2">
                  الإحداثيات: {locationToShow.lat.toFixed(6)}، {locationToShow.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* 🔥 معلومات إضافية جميلة */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl mb-2">🚗</div>
                <p className="text-xs text-gray-600">موقف سيارات</p>
                <p className="font-bold text-green-600 text-sm">متوفر</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl mb-2">🚇</div>
                <p className="text-xs text-gray-600">قريب من المترو</p>
                <p className="font-bold text-green-600 text-sm">نعم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض نطاق الأسعار
  const renderPriceRange = () => {
    if (priceRange.min === 0 && priceRange.max === 0) return null;

    return (
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-4 mb-4 shadow-lg border border-emerald-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-emerald-100 p-1 rounded-lg text-sm">💰</span>
          نطاق أسعار القاعة
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-600 text-sm">السعر الأدنى</span>
            <span className="text-lg font-bold text-green-600">
              {parseInt(priceRange.min).toLocaleString()} ج
            </span>
          </div>
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-600 text-sm">السعر الأعلى</span>
            <span className="text-lg font-bold text-green-600">
              {parseInt(priceRange.max).toLocaleString()} ج
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض التبويبات
  const renderTabs = () => {
    const tabs = [
      { id: "details", label: "التفاصيل", icon: "📋" },
      { id: "gallery", label: "الصور", icon: "🖼️" },
      { id: "reviews", label: "التقييمات", icon: "⭐" },
      { id: "location", label: "الموقع", icon: "📍" },
      { id: "packages", label: "البكجات", icon: "💰" },
      { id: "features", label: "المميزات", icon: "⚡" },
      { id: "reels", label: "الريلز", icon: "🎬" } // 🔥 تغيير من "الطعام" إلى "الريلز"
    ];

    return (
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 transition-all font-bold text-xs ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض محتوى التبويب النشط
  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-4">
            {renderQuickInfo()}
            {renderPriceRange()}
            {renderContactInfo()}
          </div>
        );
      
      case "gallery":
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-4 shadow-lg border border-pink-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-pink-100 p-1 rounded-lg text-sm">🖼️</span>
                معرض الصور ({venueData?.images?.length || 0} صورة)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {venueData?.images?.map((image, index) => (
                  <motion.div 
                    key={index} 
                    className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => openImageModal(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${venueData.name} - صورة ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">👁️</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "reviews":
        return (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-4 shadow-lg border border-yellow-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-yellow-100 p-1 rounded-lg text-sm">⭐</span>
              التقييمات والآراء
            </h3>
            {renderReviewsSection()}
          </div>
        );

      case "location":
        return renderMapSection();

      case "packages":
        return renderPackagesSection();
      
      case "features":
        return renderFeatures();
      
      case "reels": // 🔥 تبويب الريلز الجديد
        return (
          <div className="space-y-4">
            {renderReelsSection()}
            {renderVideosSection()}
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{activeTab}</h3>
            <p className="text-gray-600 text-sm">محتويات هذا القسم قريباً...</p>
          </div>
        );
    }
  };

  // 🔥 عرض التقييمات
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
            <motion.div 
              key={review.id || index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {review.user_name?.charAt(0) || 'ز'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.user_name || 'زائر'}</p>
                    <p className="text-gray-500 text-xs">{new Date(review.created_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-600 text-sm mb-2">لا توجد تقييمات حتى الآن</p>
            <p className="text-gray-500 text-xs">كن أول من يقيم هذه القاعة</p>
          </div>
        )}
      </div>
    );
  };

  // 🔥 عرض مودال الريلز
  const renderReelsModal = () => {
    if (!selectedReel) return null;

    return (
      <AnimatePresence>
        {showReelsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
            onClick={closeReelsModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full h-full max-w-md max-h-[90vh] aspect-[9/16] bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* زر الإغلاق */}
              <button
                onClick={closeReelsModal}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* الفيديو */}
              <div className="w-full h-full flex items-center justify-center">
                <video 
                  controls 
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={selectedReel.thumbnail}
                >
                  <source src={selectedReel.videoUrl} type="video/mp4" />
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </div>

              {/* معلومات الريلز */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-bold text-lg mb-2">{selectedReel.title}</h4>
                <p className="text-sm text-gray-300 mb-3">{selectedReel.description}</p>
                
                {/* إحصائيات الريلز */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span>❤️</span>
                      <span>{selectedReel.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{selectedReel.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>↗️</span>
                      <span>{selectedReel.shares.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{selectedReel.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* أزرار التنقل بين الريلز */}
              {reels.length > 1 && (
                <>
                  <button
                    onClick={() => navigateReels('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => navigateReels('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}

              {/* مؤشر الريلز */}
              {reels.length > 1 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {reels.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentReelIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // حالات التحميل والأخطاء
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner size="medium" text="جاري تحميل بيانات القاعة..." />
        </div>
      </div>
    );
  }

  if (error || !venueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-sm w-full border border-gray-100">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">تعذر تحميل البيانات</h2>
          <p className="text-gray-600 mb-6 text-sm">{error || 'حدث خطأ في تحميل بيانات القاعة'}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg text-sm"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg text-sm"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 🔥 زر العودة في أعلى اليسار - ثابت ومستقل عن السلايدر */}
      <button
        onClick={handleBackClick}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 shadow-lg backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">العودة</span>
      </button>

      {/* 🔥 زر المشاركة في أعلى اليمين */}
      <button
        onClick={handleShareClick}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 shadow-lg backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-sm">مشاركة</span>
      </button>

      {/* سكرول الصور الرئيسي */}
      {renderImageScroll()}

      {/* التبويبات */}
      {renderTabs()}

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* المحتوى الرئيسي */}
          <div className="flex-1">
            {renderTabContent()}
          </div>

          {/* 🔥 أزرار الحجز في اليمين */}
          <div className="lg:w-80">
            <div className="sticky top-24 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">إجراء سريع</h3>
              <div className="space-y-3">
                <button
                  onClick={() => openBookingModal('inspection')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                    bookingSubmitted 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105'
                  }`}
                >
                  <span className="text-lg">👁️</span>
                  <span>{bookingSubmitted ? 'تم الإرسال' : 'طلب معاينة'}</span>
                </button>
                <button
                  onClick={() => openBookingModal('booking')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                    bookingSubmitted
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
                  }`}
                >
                  <span className="text-lg">✅</span>
                  <span>{bookingSubmitted ? 'تم الإرسال' : 'حجز مباشر'}</span>
                </button>
              </div>

              {/* معلومات سريعة */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3">معلومات سريعة</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعة:</span>
                    <span className="font-bold">{venueData.capacity || 250}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعر يبدأ من:</span>
                    <span className="font-bold text-green-600">{parseInt(priceRange.min).toLocaleString()} ج</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التقييم:</span>
                    <span className="font-bold">{venueData.rating || 4.5} ⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 معرض الصور المودال */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative h-full">
                <img 
                  src={venueData.images[selectedGalleryImage]} 
                  alt={`${venueData.name} - صورة ${selectedGalleryImage + 1}`}
                  className="w-full h-full object-contain max-h-[80vh] rounded-lg"
                />
                
                {venueData.images.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => navigateImage('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      ›
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedGalleryImage + 1} / {venueData.images.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 مودال الريلز */}
      {renderReelsModal()}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3"
            onClick={closeBookingModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {bookingType === 'inspection' ? 'طلب معاينة' : 'حجز مباشر'}
                </h3>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="أدخل اسمك بالكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تاريخ المناسبة *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.eventDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    عدد الضيوف المتوقع
                  </label>
                  <input
                    type="number"
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="أدخل عدد الضيوف"
                    min="1"
                  />
                </div>

                {selectedPackage !== null && packages[selectedPackage] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-bold text-blue-900 text-sm mb-1">الباكدج المختار</h4>
                    <p className="text-blue-700 text-sm">{packages[selectedPackage]?.name}</p>
                    <p className="text-blue-600 font-bold text-sm">
                      {parseInt(packages[selectedPackage]?.price || 0).toLocaleString()} جنيه
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    placeholder="أي ملاحظات أو متطلبات إضافية..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || bookingSubmitted}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all shadow-lg ${
                    isSubmitting || bookingSubmitted
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : bookingType === 'inspection'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="small" />
                      جاري الإرسال...
                    </div>
                  ) : bookingSubmitted ? (
                    '✅ تم الإرسال بنجاح'
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