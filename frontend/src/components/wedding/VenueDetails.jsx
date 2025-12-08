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
  const videoRefs = useRef({});

  // 🔥 إعدادات التليجرام
  const TELEGRAM_CONFIG = {
    botToken: "8407583922:AAHHVA4rynx-PTwNTw6Efc6daJtpygaRGuY",
    chatIds: {
      admin: "5306134688",
    },
    enabled: true
  };

  // 🔥 دالة للحصول على صورة بديلة عند الخطأ - محدثة
  const getFallbackImage = (venueName) => {
    const name = venueName || 'قاعة أفراح';
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=${encodedName}`;
  };

  // 🔥 التحقق من أن الرابط صحيح
  const isValidUrl = (string) => {
    if (!string) return false;
    if (typeof string !== 'string') return false;
    
    // التحقق إذا كان رابط placeholder
    if (string.includes('via.placeholder.com')) return true;
    
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // 🔥 جلب بيانات القاعة والباكدجات من API
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 جاري جلب بيانات القاعة ID:', id);

        // جلب بيانات القاعة
        const venueResponse = await fetch(
          `https://bookera-production-25ec.up.railway.app/api/wedding-venues/${id}`,
          { 
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log('📡 حالة الاستجابة:', venueResponse.status);
        
        if (!venueResponse.ok) {
          const errorText = await venueResponse.text();
          console.error('❌ خطأ في الاستجابة:', errorText);
          throw new Error(`فشل في جلب بيانات القاعة: ${venueResponse.status}`);
        }
        
        const venueData = await venueResponse.json();
        console.log('✅ بيانات القاعة المستلمة:', venueData);
        setVenueData(venueData);

        // جلب الباكدجات
        try {
          const packagesResponse = await fetch(
            `https://bookera-production-25ec.up.railway.app/api/wedding-venues/${id}/packages`,
            { signal: controller.signal }
          );
          
          if (packagesResponse.ok) {
            const packagesData = await packagesResponse.json();
            setPackages(packagesData.packages || packagesData || []);
          } else {
            setPackages(venueData.packages || []);
          }
        } catch (packagesError) {
          console.error('⚠️ خطأ في جلب الباكدجات:', packagesError);
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

        // 🔥 إعداد الريلز من قاعدة البيانات
        console.log('🎬 بيانات الريلز:', venueData.reels);
        
        if (venueData.reels && venueData.reels.length > 0) {
          // إذا كانت الريلز مخزنة كـ JSON
          let reelsData;
          try {
            reelsData = Array.isArray(venueData.reels) ? venueData.reels : JSON.parse(venueData.reels || '[]');
            
            // 🔥 إصلاح الـ thumbnails
            reelsData = reelsData.map((reel, index) => ({
              ...reel,
              id: reel.id || index + 1,
              thumbnail: reel.thumbnail || getFallbackImage(venueData.name),
              video_url: reel.video_url || reel.videoUrl || reel.url,
              title: reel.title || `ريلز ${venueData.name} #${index + 1}`,
              description: reel.description || "جولة داخل القاعة وتصميماتها الفاخرة",
              likes: reel.likes || Math.floor(Math.random() * 1000) + 100,
              comments: reel.comments || Math.floor(Math.random() * 100) + 10,
              shares: reel.shares || Math.floor(Math.random() * 50) + 5,
              duration: reel.duration || "0:30",
              views: reel.views || Math.floor(Math.random() * 5000) + 1000,
              source_type: reel.source_type || getVideoSourceType(reel.video_url || reel.videoUrl || reel.url)
            }));
            
            console.log('✅ الريلز بعد الإصلاح:', reelsData);
          } catch (parseError) {
            console.error('❌ خطأ في تحليل الريلز:', parseError);
            reelsData = [];
          }
          setReels(reelsData);
        } else if (venueData.videos && venueData.videos.length > 0) {
          // استخدام الفيديوهات كبديل إذا لم توجد ريلز
          console.log('🎥 استخدام الفيديوهات كريلز بديلة');
          const reelsData = venueData.videos.map((video, index) => ({
            id: index + 1,
            video_url: video,
            thumbnail: getFallbackImage(venueData.name),
            title: `ريلز ${venueData.name} #${index + 1}`,
            description: "جولة داخل القاعة وتصميماتها الفاخرة",
            likes: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 50) + 5,
            duration: "0:30",
            views: Math.floor(Math.random() * 5000) + 1000,
            source_type: getVideoSourceType(video)
          }));
          setReels(reelsData);
        } else {
          console.log('📹 لا توجد ريلز أو فيديوهات متاحة');
          setReels([]);
        }
        
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('❌ خطأ في جلب البيانات:', err);
          setError('تعذر تحميل بيانات القاعة. يرجى المحاولة مرة أخرى.');
        }
      } finally {
        setLoading(false);
        console.log('🏁 انتهى تحميل البيانات');
      }
    };

    fetchData();

    return () => controller.abort();
  }, [id]);

  // 🔥 تحديد نوع مصدر الفيديو
  const getVideoSourceType = (videoUrl) => {
    if (!videoUrl) return 'direct';
    
    const url = videoUrl.toLowerCase();
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('res.cloudinary.com')) return 'cloudinary'; 
    return 'direct';
  };

  // 🔥 استخراج معرف فيديو يوتيوب
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  const getCloudinaryVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/res\.cloudinary\.com\/[^\/]+\/video\/upload\/(?:[^\/]+\/)?([^\/]+)\.(mp4|webm|mov)/);
    return match ? match[1] : null;
  };

  // 🔥 تحسين دالة getFacebookVideoId
  const getFacebookVideoId = (url) => {
    if (!url) return null;
    
    const urlStr = url.toString().toLowerCase();
    
    let match = urlStr.match(/(?:facebook\.com|fb\.watch)\/(?:[^\/]+\/videos\/|video\.php\?v=)([0-9]+)/);
    if (match) return match[1];
    
    match = urlStr.match(/fb\.watch\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    
    match = urlStr.match(/facebook\.com\/(?:[^\/]+\/)?video\/?\?v=([0-9]+)/);
    if (match) return match[1];
    
    return null;
  };

  // 🔥 جلب التقييمات
  useEffect(() => {
    if (!venueData?.id) return;

    const fetchReviewsData = async () => {
      try {
        setLoadingReviews(true);
        const response = await fetch(
          `https://bookera-production-25ec.up.railway.app/api/wedding-venues/${venueData.id}/reviews`
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

      const response = await fetch('https://bookera-production-25ec.up.railway.app/api/bookings', {
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

  // 🔥 فتح معرض الصور مع التحقق من الصحة
  const openImageModal = (index) => {
    const images = venueData?.images || [];
    if (!images || images.length === 0) {
      console.warn('لا توجد صور متاحة لفتح المعرض');
      return;
    }
    
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    setSelectedGalleryImage(safeIndex);
    setShowImageModal(true);
  };

  // 🔥 إغلاق معرض الصور
  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // 🔥 التنقل في معرض الصور
  const navigateImage = (direction) => {
    const images = venueData?.images || [];
    if (images.length === 0) return;
    
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
    
    // إيقاف جميع الفيديوهات عند الإغلاق
    Object.values(videoRefs.current).forEach(ref => {
      if (ref && ref.pause) ref.pause();
    });
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

  // 🔥 عرض فيديو يوتيوب
  const renderYouTubeVideo = (videoId) => {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    );
  };

  // 🔥 عرض فيديو فيسبوك
  const renderFacebookVideo = (videoId) => {
    return (
      <iframe
        src={`https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${videoId}/&show_text=0&width=476`}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        title="Facebook video"
      />
    );
  };

  // 🔥 عرض فيديو مباشر
  const renderDirectVideo = (videoUrl) => {
    return (
      <video 
        ref={el => {
          if (el && selectedReel) {
            videoRefs.current[selectedReel.id] = el;
          }
        }}
        controls 
        autoPlay
        className="w-full h-full object-contain"
        poster={selectedReel?.thumbnail}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        متصفحك لا يدعم تشغيل الفيديو
      </video>
    );
  };

  // 🔥 عرض الفيديو حسب المصدر
  const renderVideoBySource = (reel) => {
    if (!reel || !reel.video_url) return null;

    const sourceType = reel.source_type || getVideoSourceType(reel.video_url);

    switch (sourceType) {
      case 'youtube': {
        const youtubeId = getYouTubeVideoId(reel.video_url);
        return youtubeId ? renderYouTubeVideo(youtubeId) : renderDirectVideo(reel.video_url);
      }

      case 'facebook': {
        const facebookId = getFacebookVideoId(reel.video_url);
        return facebookId ? renderFacebookVideo(facebookId) : renderDirectVideo(reel.video_url);
      }

      case 'cloudinary': {
        const cloudinaryId = getCloudinaryVideoId(reel.video_url);
        return cloudinaryId ? renderDirectVideo(reel.video_url) : null;
      }

      case 'tiktok':
      case 'instagram':
      case 'vimeo':
        return renderDirectVideo(reel.video_url);

      case 'direct':
      default:
        return renderDirectVideo(reel.video_url);
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

  // 🔥 AUTO SLIDER EFFECT - محدث
  useEffect(() => {
    const allImages = venueData?.images || (venueData?.image ? [venueData.image] : []);
    const displayImages = Array.isArray(allImages) ? allImages : [];
    
    if (displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % displayImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [venueData?.images, venueData?.image]);

  // 🔥 سلايدر الصور المحسن والمصحح
  const renderImageSlider = () => {
    const allImages = venueData?.images || (venueData?.image ? [venueData.image] : []);
    
    // تجنب الأخطاء إذا كانت الصور غير محددة
    const safeImages = Array.isArray(allImages) ? allImages : [];
    const displayImages = safeImages.slice(0, 6);

    if (displayImages.length === 0) {
      return (
        <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-600 font-medium">لا توجد صور متاحة</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl">
        {/* حاوية الصور مع scroll افتراضي */}
        <div className="relative w-full h-full">
          {displayImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === selectedImage ? 1 : 0,
                scale: index === selectedImage ? 1 : 1.05
              }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={image} 
                alt={`${venueData?.name || 'القاعة'} - صورة ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(venueData?.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </motion.div>
          ))}
        </div>
        
        {/* أزرار التنقل */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
              aria-label="الصورة السابقة"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
              aria-label="الصورة التالية"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* مؤشر الصور */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedImage 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`الذهاب إلى الصورة ${index + 1}`}
            />
          ))}
        </div>

        {/* شارة القاعة المميزة */}
        {venueData?.is_featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1 z-10">
            <span>⭐</span>
            <span>مميزة</span>
          </div>
        )}
        
        {/* العداد */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm z-10">
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
        
        {/* زر فتح المعرض */}
        {displayImages.length > 1 && (
          <button
            onClick={() => openImageModal(selectedImage)}
            className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors z-10"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            فتح المعرض
          </button>
        )}
      </div>
    );
  };

  // معرض الصور المودال البسيط
  const renderImageModal = () => {
    const images = venueData?.images || [];
    
    if (!showImageModal || images.length === 0) return null;

    const currentImage = images[selectedGalleryImage];
    const isImageValid = currentImage && isValidUrl(currentImage);

    return (
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* زر الإغلاق */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* الصورة */}
              <img 
                src={isImageValid ? currentImage : getFallbackImage(venueData?.name)} 
                alt={`${venueData?.name || 'القاعة'} - صورة ${selectedGalleryImage + 1}`}
                className="w-full h-full object-contain max-h-[80vh] rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(venueData?.name);
                }}
              />
              
              {/* أزرار التنقل */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* العداد */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {selectedGalleryImage + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // 🔥 عرض قسم الصور والفيديوهات
  const renderGallerySection = () => {
    const allImages = venueData?.images || [];
    const allVideos = venueData?.videos || [];
    const allMedia = [...allImages, ...allVideos];
    
    if (allMedia.length === 0) {
      return (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 mb-4 shadow-lg border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            الصور والفيديوهات
          </h3>
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-sm">لا توجد صور أو فيديوهات متاحة حالياً</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 mb-4 shadow-lg border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          الصور والفيديوهات ({allMedia.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allImages.map((image, index) => (
            <motion.div 
              key={`image-${index}`} 
              className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
              whileHover={{ scale: 1.05 }}
              onClick={() => openImageModal(index)}
            >
              <img 
                src={image} 
                alt={`${venueData.name} - صورة ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(venueData?.name);
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                صورة
              </div>
            </motion.div>
          ))}
          
          {reels.map((reel, index) => (
            <motion.div 
              key={`reel-${reel.id || index}`} 
              className="aspect-[9/16] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative"
              whileHover={{ scale: 1.05 }}
              onClick={() => openReelsModal(reel, index)}
            >
              <div className="relative w-full h-full">
                <img 
                  src={reel.thumbnail || getFallbackImage(venueData?.name)} 
                  alt={reel.title || `فيديو ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(venueData?.name);
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-2 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>{(reel.views || 0).toLocaleString()}</span>
                    </span>
                    <span>{reel.duration || "0:30"}</span>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                  فيديو
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // 🔥 عرض معلومات سريعة
  const renderQuickInfo = () => {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 mb-4 shadow-lg border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          معلومات سريعة
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-2">
              <svg className="w-8 h-8 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-bold text-gray-900 text-lg">{venueData.capacity || 250}+</div>
            <div className="text-gray-600 text-sm">السعة</div>
          </div>
          
          <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-2">
              <svg className="w-8 h-8 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            {renderStars(venueData.rating || 4.5)}
            <div className="text-gray-600 text-sm mt-1">التقييم</div>
          </div>
          
          <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-2">
              <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-bold text-gray-900 text-lg">6 ساعات</div>
            <div className="text-gray-600 text-sm">المدة</div>
          </div>
          
          <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-2">
              <svg className="w-8 h-8 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={`font-bold text-lg ${venueData.available ? 'text-green-600' : 'text-red-600'}`}>
              {venueData.available ? 'متاحة' : 'غير متاحة'}
            </div>
            <div className="text-gray-600 text-sm">الحجوزات</div>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض معلومات التواصل مع إزالة السعر
  const renderContactInfo = () => {
    return (
      <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 mb-4 shadow-lg border border-green-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          معلومات التواصل
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <span className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-bold text-gray-900">العنوان</p>
              <p className="text-gray-600 text-sm mt-1">{venueData.address || 'بجوار محطة المترو، طريق رئيسي، المحافظة'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <span className="bg-green-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-bold text-gray-900">الهاتف</p>
              <p className="text-gray-600 text-sm mt-1">{venueOwner?.phone || '01095952888'}</p>
            </div>
          </div>
          
          {/* 🔥 قسم الأسعار مع إخفائه */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 text-center">
            <p className="text-gray-700 font-bold text-sm">📞 السعر عند التواصل</p>
            <p className="text-gray-600 text-xs mt-1">تواصل مع القاعة مباشرة للاستفسار عن الأسعار والعروض المتاحة</p>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض المميزات
  const renderFeatures = () => {
    const features = venueData?.features || [];

    return (
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 mb-4 shadow-lg border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          المميزات والخدمات ({features.length})
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {features.slice(0, showAllFeatures ? features.length : 6).map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <span className="text-green-500 text-lg bg-green-50 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700 text-sm font-medium flex-1">{feature}</span>
            </div>
          ))}
        </div>
        {features.length > 6 && (
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="text-blue-600 hover:text-blue-700 font-bold mt-4 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm w-full justify-center"
          >
            {showAllFeatures ? 'عرض أقل' : `عرض ${features.length - 6} ميزة أخرى`}
            <svg className={`w-4 h-4 transform transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  // 🔥 عرض كل تفاصيل الباكدجات - متوافق مع جدول الباكدجات
  const renderPackagesSection = () => {
    const packagesToShow = packages && packages.length > 0 ? packages : [];
    const venueMeals = venueData?.meals || [];

    // إذا لا توجد باكدجات
    if (packagesToShow.length === 0) {
      return (
        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 mb-4 shadow-lg border border-yellow-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
            الباكدجات والعروض
          </h3>
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-600 text-sm">لا توجد باكدجات متاحة حالياً</p>
            <p className="text-gray-500 text-xs mt-1">يمكنك التواصل مع القاعة مباشرة للاستفسار عن العروض المتاحة</p>
          </div>
        </div>
      );
    }

    // دالة لمعالجة بيانات الوجبات
    const parseMeals = (mealsData) => {
      if (!mealsData) return [];
      
      try {
        if (Array.isArray(mealsData)) {
          // إذا كانت مصفوفة من الأجسام (JSONB)
          return mealsData.map((meal, index) => ({
            id: meal.id || `meal-${index}`,
            name: meal.name || `وجبة ${index + 1}`,
            price: parseInt(meal.price) || 0,
            description: meal.description || '',
            type: meal.type || 'وجبة',
            items: meal.items || []
          }));
        } else if (typeof mealsData === 'string') {
          // إذا كانت نص JSON
          const parsed = JSON.parse(mealsData);
          if (Array.isArray(parsed)) {
            return parsed.map((meal, index) => ({
              id: meal.id || `meal-${index}`,
              name: meal.name || `وجبة ${index + 1}`,
              price: parseInt(meal.price) || 0,
              description: meal.description || '',
              type: meal.type || 'وجبة',
              items: meal.items || []
            }));
          }
        }
      } catch (error) {
        console.error('Error parsing meals:', error);
      }
      
      return [];
    };

    return (
      <div className="space-y-6">
        {/* قسم الباكدجات الأساسية */}
        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 shadow-lg border border-yellow-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              كل الباكدجات المتاحة ({packagesToShow.length})
            </h3>
            <div className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              اختر الباكدج المناسب لك
            </div>
          </div>

          <div className="space-y-6">
            {packagesToShow.map((pkg, index) => {
              const packageMeals = parseMeals(pkg.meals);
              
              return (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-2xl p-5 transition-all ${
                    selectedPackage === index
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-xl'
                      : 'border-gray-200 bg-white hover:border-blue-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* رأس الباكدج */}
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                    {/* رقم الباكدج */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* معلومات الباكدج */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.name || `الباكدج ${index + 1}`}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {pkg.description || 'باكدج شامل لجميع الخدمات'}
                          </p>
                        </div>
                        
                        {/* السعر */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {parseInt(pkg.price || 0).toLocaleString()} جنيه
                          </div>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <div className="flex items-center gap-2 mt-2 justify-end">
                              <div className="text-sm text-gray-500 line-through">
                                {parseInt(pkg.originalPrice).toLocaleString()} جنيه
                              </div>
                              <div className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                🔥 توفير {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 🔥 شارات الباكدج */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pkg.discount && pkg.discount > 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
                            🎁 خصم {pkg.discount}%
                          </span>
                        )}
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold">
                            💰 وفر {parseInt(pkg.originalPrice - pkg.price).toLocaleString()} جنيه
                          </span>
                        )}
                        {packageMeals.length > 0 && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-bold">
                            🍽️ {packageMeals.length} وجبة
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 🔥 كل تفاصيل الباكدج */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* العمود الأيسر: التفاصيل الأساسية */}
                    <div className="space-y-5">
                      {/* المميزات */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h5 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            المميزات المتضمنة ({pkg.features.length})
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {pkg.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                <span className="text-green-500 mt-0.5">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                <span className="text-gray-700 text-sm flex-1">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* الخدمات الإضافية */}
                      {pkg.additionalServices && pkg.additionalServices.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h5 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                            </svg>
                            الخدمات الإضافية ({pkg.additionalServices.length})
                          </h5>
                          <div className="space-y-2">
                            {pkg.additionalServices.map((service, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-blue-500">+</span>
                                <span className="text-gray-700 text-sm">{service}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* الملاحظات */}
                      {pkg.notes && (
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                          <h5 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            ملاحظات هامة
                          </h5>
                          <div className="space-y-2 text-sm text-gray-700">
                            {pkg.notes.split('\n').map((note, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-1">•</span>
                                <span>{note}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* العمود الأيمن: المعلومات التقنية */}
                    <div className="space-y-5">
                      {/* معلومات السعة والمدة */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 text-sm mb-3">المعلومات الفنية</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">السعة</div>
                            <div className="font-bold text-gray-900 text-lg">
                              {pkg.capacity || venueData.capacity || 'غير محدد'}
                            </div>
                            <div className="text-gray-500 text-xs mt-1">شخص</div>
                          </div>
                          <div className="text-center bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1">السعر</div>
                            <div className="font-bold text-gray-900 text-lg">
                              {parseInt(pkg.price || 0).toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-xs mt-1">جنيه</div>
                          </div>
                          {pkg.discount && (
                            <div className="text-center bg-green-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-600 mb-1">الخصم</div>
                              <div className="font-bold text-green-600 text-lg">
                                {pkg.discount}%
                              </div>
                            </div>
                          )}
                          {pkg.originalPrice && (
                            <div className="text-center bg-red-50 p-3 rounded-lg">
                              <div className="text-xs text-gray-600 mb-1">السعر الأصلي</div>
                              <div className="font-bold text-gray-500 text-lg line-through">
                                {parseInt(pkg.originalPrice).toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 🔥 الوجبات (Meals) */}
                      {packageMeals.length > 0 && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                          <h5 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 8.25a.75.75 0 01.75.75c0 1.12-.472 2.187-1.32 2.937l-.26.23c-.38.338-.74.658-1.08.956l.037.036a.75.75 0 01-1.06 1.06l-2.28-2.28a.75.75 0 01.53-1.28h2.69l.671-.669a.75.75 0 01.75-.75h.75z" />
                              <path d="M9 13.5a.75.75 0 01.75.75v.75H12a.75.75 0 010 1.5H9.75v.75a.75.75 0 01-1.5 0v-.75H6a.75.75 0 010-1.5h2.25v-.75A.75.75 0 019 13.5z" />
                              <path fillRule="evenodd" d="M10 1a3.5 3.5 0 00-3.5 3.5v.094a4.75 4.75 0 00-.75 9.406v.75H5.5a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-.25v-.75a4.75 4.75 0 00-.75-9.406V4.5A3.5 3.5 0 0010 1zm2.5 6.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z" clipRule="evenodd" />
                            </svg>
                            قوائم الطعام المتاحة ({packageMeals.length})
                          </h5>
                          <div className="space-y-3">
                            {packageMeals.map((meal, mealIndex) => (
                              <div key={mealIndex} className="bg-white border border-orange-100 rounded-lg p-3 hover:border-orange-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                  <h6 className="font-bold text-orange-800 text-sm flex-1">{meal.name}</h6>
                                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full ml-2">
                                    {parseInt(meal.price).toLocaleString()} جنيه
                                  </span>
                                </div>
                                
                                {/* 🔥 تحليل محتوى الوجبة */}
                                {meal.name && (
                                  <div className="text-xs text-gray-600 mt-2">
                                    <div className="font-semibold mb-1">المكونات:</div>
                                    {/* استخراج العناصر من اسم الوجبة */}
                                    {meal.name.split('+').map((item, itemIdx) => (
                                      <div key={itemIdx} className="flex items-center gap-1 mb-1">
                                        <span className="text-orange-500 text-xs">•</span>
                                        <span>{item.trim()}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* معلومات التوقيت */}
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          معلومات التوقيت
                        </h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          {pkg.created_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">تاريخ الإنشاء:</span>
                              <span className="font-medium">{new Date(pkg.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                          )}
                          {pkg.updated_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">آخر تحديث:</span>
                              <span className="font-medium">{new Date(pkg.updated_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🔥 زر الاختيار */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">
                          الباكدج شامل: {pkg.features ? pkg.features.length : 0} ميزة + {pkg.additionalServices ? pkg.additionalServices.length : 0} خدمة إضافية
                          {packageMeals.length > 0 && ` + ${packageMeals.length} وجبة`}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedPackage(selectedPackage === index ? null : index)}
                          className={`px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg ${
                            selectedPackage === index
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          {selectedPackage === index ? '✓ تم اختيار الباكدج' : 'اختيار هذا الباكدج'}
                        </button>
                        
                        <button
                          onClick={() => openBookingModal('booking')}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
                        >
                          احجز الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 🔥 قسم قوائم الطعام الرئيسية (من venueData.meals) */}
        {Array.isArray(venueMeals) && venueMeals.length > 0 && (
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                قوائم الطعام الإضافية ({venueMeals.length})
              </h3>
              <div className="text-xs text-gray-600 bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold">
                🍽️ يمكن إضافتها مع أي باكدج
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venueMeals.map((meal, index) => {
                const mealData = typeof meal === 'object' ? meal : {};
                
                return (
                  <div key={index} className="bg-white border border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all">
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 text-sm flex-1">
                          {mealData.name || `قائمة طعام ${index + 1}`}
                        </h4>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {mealData.type || 'وجبة'}
                        </span>
                      </div>
                      
                      {mealData.description && (
                        <p className="text-gray-600 text-xs mb-3">{mealData.description}</p>
                      )}
                    </div>

                    {/* 🔥 تحليل محتوى الوجبة */}
                    {mealData.name && (
                      <div className="mb-3">
                        <h5 className="text-xs font-bold text-gray-700 mb-2">المكونات:</h5>
                        <div className="text-xs text-gray-600">
                          {mealData.name.split('+').map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1 mb-1">
                              <span className="text-orange-500 text-xs">•</span>
                              <span className="flex-1">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-600">السعر</div>
                          <div className="text-lg font-bold text-green-600">
                            {mealData.price ? parseInt(mealData.price).toLocaleString() : '???'} جنيه
                          </div>
                          <div className="text-xs text-gray-500">للشخص</div>
                        </div>
                        <button
                          onClick={() => {
                            const mealIndex = packagesToShow.length + index;
                            setSelectedPackage(selectedPackage === mealIndex ? null : mealIndex);
                          }}
                          className={`px-4 py-2 rounded-lg text-xs font-bold ${
                            selectedPackage === packagesToShow.length + index
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          {selectedPackage === packagesToShow.length + index ? 'محدد' : 'اختيار'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔥 قسم مخصص لتحليل وتنسيق الوجبات */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">✨ نظام الوجبات المميز</h3>
              <p className="text-gray-600 text-sm">تشكيلة متنوعة من الوجبات السريعة والخفيفة</p>
            </div>
          </div>

          <div className="space-y-4">
            {packagesToShow.map((pkg, pkgIndex) => {
              const packageMeals = parseMeals(pkg.meals);
              if (packageMeals.length === 0) return null;

              return (
                <div key={pkgIndex} className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {pkg.name || `الباكدج ${pkgIndex + 1}`}
                    </span>
                    <span className="text-sm text-gray-600">- {packageMeals.length} وجبة</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {packageMeals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-orange-800 text-sm">{meal.name}</h5>
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {parseInt(meal.price).toLocaleString()} ج.م
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-700">
                          <div className="font-semibold mb-1">يشمل:</div>
                          <ul className="space-y-1">
                            {meal.name.split('+').map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="text-orange-500">•</span>
                                <span className="flex-1">{item.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض الخريطة
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
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            معلومات الموقع
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 text-lg">{venueData.name}</h5>
                <p className="text-gray-600 mt-1">{venueData.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-medium">الموقع: {venueData.city}، {venueData.governorate}</p>
                {venueData.area && (
                  <p className="text-gray-600 text-sm mt-1">المنطقة: {venueData.area}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="mb-2">
                  <svg className="w-8 h-8 text-blue-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4.577a1 1 0 00-.293-.707l-2-2A1 1 0 0018 8V5a1 1 0 00-1-1h-1.05a2.5 2.5 0 00-4.9 0H4a1 1 0 00-1 1v2.5a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 011-1h2a1 1 0 011 1v.5a1 1 0 001 1h1a1 1 0 011 1v1.5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-.5a1 1 0 00-1-1h-2a1 1 0 00-1 1v3.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5.5a1 1 0 00-1-1H2a1 1 0 010-2h1a1 1 0 001-1V5z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">موقف سيارات</p>
                <p className="font-bold text-green-600 text-sm">متوفر</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className="mb-2">
                  <svg className="w-8 h-8 text-purple-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">قريب من المترو</p>
                <p className="font-bold text-green-600 text-sm">نعم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 عرض التبويبات
  const renderTabs = () => {
    const tabs = [
      { id: "details", label: "التفاصيل", icon: "📋" },
      { id: "gallery", label: "الصور والفيديوهات", icon: "🖼️" },
      { id: "reviews", label: "التقييمات", icon: "⭐" },
      { id: "location", label: "الموقع", icon: "📍" },
      { id: "packages", label: "الباكدجات", icon: "💰" },
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
            {renderContactInfo()}
            {renderFeatures()}
          </div>
        );
      
      case "gallery":
        return renderGallerySection();
      
      case "reviews":
        return (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 shadow-lg border border-yellow-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
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
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
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
              <div className="w-full h-full">
                {renderVideoBySource(selectedReel)}
              </div>

              {/* معلومات الريلز */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-bold text-lg mb-2">{selectedReel.title || `فيديو ${currentReelIndex + 1}`}</h4>
                <p className="text-sm text-gray-300 mb-3">{selectedReel.description || "جولة داخل القاعة وتصميماتها الفاخرة"}</p>
                
                {/* إحصائيات الريلز */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{(selectedReel.likes || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{(selectedReel.comments || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>{(selectedReel.shares || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>{(selectedReel.views || 0).toLocaleString()}</span>
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
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
      {/* 🔥 زر المشاركة فقط */}
      <button
        onClick={handleShareClick}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-xl font-bold transition-all hover:scale-105 shadow-lg backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-xs">مشاركة</span>
      </button>

      {/* سكرول الصور الرئيسي */}
      <div className="px-3 pt-4">
        {renderImageSlider()}
      </div>

      {/* التبويبات */}
      {renderTabs()}

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* المحتوى الرئيسي */}
          <div className="flex-1">
            {renderTabContent()}
          </div>

          {/* 🔥 أزرار الحجز الثابتة في اليمين */}
          <div className="lg:w-72">
            <div className="sticky top-24 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">إجراء سريع</h3>
              
              {/* 🔥 أزرار الحجز المصغرة */}
              <div className="space-y-3">
                <button
                  onClick={() => openBookingModal('inspection')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                    bookingSubmitted 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{bookingSubmitted ? 'تم الإرسال' : 'طلب معاينة'}</span>
                </button>
                
                <button
                  onClick={() => openBookingModal('booking')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                    bookingSubmitted
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{bookingSubmitted ? 'تم الإرسال' : 'حجز مباشر'}</span>
                </button>
              </div>

              {/* معلومات سريعة */}
              <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs mb-2">معلومات سريعة</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعة:</span>
                    <span className="font-bold">{venueData.capacity || 250}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التقييم:</span>
                    <span className="font-bold">{venueData.rating || 4.5} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحجوزات:</span>
                    <span className={`font-bold ${venueData.available ? 'text-green-600' : 'text-red-600'}`}>
                      {venueData.available ? 'متاحة' : 'غير متاحة'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-bold text-blue-600">{venueOwner?.phone?.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>
              
              {/* 🔥 ملاحظة الأسعار */}
              <div className="mt-4 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-xs text-center font-bold">📞 السعر عند التواصل</p>
                <p className="text-blue-600 text-[10px] text-center mt-1">تواصل مع القاعة للاستفسار عن الأسعار</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 معرض الصور المودال */}
      {renderImageModal()}

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