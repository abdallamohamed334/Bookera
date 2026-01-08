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
  const [showMobileBooking, setShowMobileBooking] = useState(true);
  const videoRefs = useRef({});

  // 🔥 إعدادات التليجرام
  const TELEGRAM_CONFIG = {
    botToken: "8407583922:AAHHVA4rynx-PTwNTw6Efc6daJtpygaRGuY",
    chatIds: {
      admin: "5306134688",
    },
    enabled: true
  };

  // 🔥 دالة للحصول على صورة بديلة عند الخطأ
  const getFallbackImage = (venueName) => {
    const name = venueName || 'قاعة أفراح';
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=${encodedName}`;
  };

  // 🔥 التحقق من أن الرابط صحيح
  const isValidUrl = (string) => {
    if (!string) return false;
    if (typeof string !== 'string') return false;
    
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
        
        // جلب بيانات القاعة
        const venueResponse = await fetch(
          `https://bookera-production-2d16.up.railway.app/api/wedding-venues/${id}`,
          { 
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!venueResponse.ok) {
          const errorText = await venueResponse.text();
          console.error('❌ خطأ في الاستجابة:', errorText);
          throw new Error(`فشل في جلب بيانات القاعة: ${venueResponse.status}`);
        }
        
        const venueData = await venueResponse.json();
        setVenueData(venueData);

        // جلب الباكدجات
        try {
          const packagesResponse = await fetch(
            `https://bookera-production-2d16.up.railway.app/api/wedding-venues/${id}/packages`,
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

        // 🔥 إعداد الريلز
        if (venueData.reels && venueData.reels.length > 0) {
          let reelsData;
          try {
            reelsData = Array.isArray(venueData.reels) ? venueData.reels : JSON.parse(venueData.reels || '[]');
            
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
            
          } catch (parseError) {
            console.error('❌ خطأ في تحليل الريلز:', parseError);
            reelsData = [];
          }
          setReels(reelsData);
        } else if (venueData.videos && venueData.videos.length > 0) {
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
          `bookera-production-2d16.up.railway.app/api/wedding-venues/${venueData.id}/reviews`
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

      const response = await fetch('https://bookera-production-2d16.up.railway.app/api/bookings', {
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

  // 🔥 AUTO SLIDER EFFECT
  useEffect(() => {
    const allImages = venueData?.images || (venueData?.image ? [venueData.image] : []);
    const displayImages = Array.isArray(allImages) ? allImages : [];
    
    if (displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % displayImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [venueData?.images, venueData?.image]);

  // 🔥 تتبع السكرول لعرض أزرار الحجز على الموبايل
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 300) {
          setShowMobileBooking(true);
        } else {
          setShowMobileBooking(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 سلايدر الصور الرئيسي - تصميم مذهل
  const renderImageSlider = () => {
    const allImages = venueData?.images || (venueData?.image ? [venueData.image] : []);
    const safeImages = Array.isArray(allImages) ? allImages : [];
    const displayImages = safeImages.slice(0, 6);

    if (displayImages.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-2xl"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="text-7xl mb-4">🏰</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{venueData?.name}</h1>
              <p className="text-lg opacity-90">قاعة أفراح فاخرة</p>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        {/* صور الخلفية مع تأثير تمويه */}
        {displayImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === selectedImage ? 0.4 : 0,
              scale: index === selectedImage ? 1.1 : 1
            }}
            transition={{ duration: 1 }}
          >
            <img 
              src={image} 
              alt=""
              className="w-full h-full object-cover blur-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getFallbackImage(venueData?.name);
              }}
            />
          </motion.div>
        ))}
        
        {/* الصورة الرئيسية */}
        <div className="relative w-full h-full">
          {displayImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: index === selectedImage ? 1 : 0,
                scale: index === selectedImage ? 1 : 0.95
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
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
            </motion.div>
          ))}
        </div>
        
        {/* طبقة التدرج */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* معلومات القاعة */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {venueData?.is_featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                  <span className="text-base">🌟</span>
                  <span>قاعة مميزة</span>
                </span>
              )}
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full font-medium text-sm">
                {venueData?.city || 'القاهرة'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
              {venueData?.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{venueData?.address || 'عنوان القاعة'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>سعة {venueData?.capacity || 250}+ شخص</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* أزرار التنقل */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
              className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-10"
              aria-label="الصورة السابقة"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-10"
              aria-label="الصورة التالية"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* مؤشر الصور */}
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-3 h-3 rounded-full transition-all transform ${
                index === selectedImage 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`الذهاب إلى الصورة ${index + 1}`}
            />
          ))}
        </div>

        {/* العداد والتحكم */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-4">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            {selectedImage + 1} / {displayImages.length}
          </span>
          
          <button
            onClick={() => openImageModal(selectedImage)}
            className="flex items-center gap-2 hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            معرض الصور
          </button>
        </div>
      </div>
    );
  };

  // 🔥 معرض الصور المودال
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
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-6xl h-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full hover:scale-110 transition-all"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img 
                src={isImageValid ? currentImage : getFallbackImage(venueData?.name)} 
                alt={`${venueData?.name || 'القاعة'} - صورة ${selectedGalleryImage + 1}`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(venueData?.name);
                }}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-2 rounded-full text-sm flex items-center gap-4">
                <span>{selectedGalleryImage + 1} / {images.length}</span>
                <span className="text-gray-300">|</span>
                <span>{venueData?.name}</span>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 mb-6 shadow-2xl border border-indigo-100"
        >
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">الصور والفيديوهات</h3>
            <p className="text-gray-600">سيتم إضافة الصور والفيديوهات قريباً</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 mb-6 shadow-2xl border border-indigo-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">معرض الصور والفيديوهات</h3>
            <p className="text-gray-600 mt-1">اكتشف جمال {venueData?.name}</p>
          </div>
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-bold">
            {allMedia.length} ملف
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((image, index) => (
            <motion.div 
              key={`image-${index}`} 
              className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => openImageModal(index)}
            >
              <img 
                src={image} 
                alt={`${venueData.name} - صورة ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(venueData?.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-sm font-medium">صورة {index + 1}</div>
                <div className="text-xs opacity-90">انقر للتكبير</div>
              </div>
            </motion.div>
          ))}
          
          {reels.map((reel, index) => (
            <motion.div 
              key={`reel-${reel.id || index}`} 
              className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => openReelsModal(reel, index)}
            >
              <div className="relative w-full h-full">
                <img 
                  src={reel.thumbnail || getFallbackImage(venueData?.name)} 
                  alt={reel.title || `فيديو ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(venueData?.name);
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-3 group-hover:scale-110 transition-transform duration-300 shadow-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {(reel.views || 0).toLocaleString()}
                    </span>
                    <span className="bg-black/60 px-2 py-1 rounded text-xs">{reel.duration || "0:30"}</span>
                  </div>
                  <div className="text-xs opacity-90 truncate">{reel.title || `فيديو ${index + 1}`}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // 🔥 عرض معلومات سريعة
  const renderQuickInfo = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 mb-6 shadow-2xl border border-blue-100"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <span>معلومات سريعة</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-2xl mb-1">{venueData.capacity || 250}+</div>
              <div className="text-gray-600 text-sm">سعة القاعة</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-yellow-50 p-5 rounded-2xl shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-center">
              {renderStars(venueData.rating || 4.5)}
              <div className="text-gray-600 text-sm mt-2">التقييم العام</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-2xl mb-1">6 ساعات</div>
              <div className="text-gray-600 text-sm">مدة الحفلة</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-green-50 p-5 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center">
              <div className={`font-bold text-2xl mb-1 ${venueData.available ? 'text-green-600' : 'text-red-600'}`}>
                {venueData.available ? 'متاحة' : 'غير متاحة'}
              </div>
              <div className="text-gray-600 text-sm">الحجوزات</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 🔥 عرض معلومات التواصل
  const renderContactInfo = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 mb-6 shadow-2xl border border-emerald-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">معلومات التواصل</h3>
            <p className="text-gray-600 mt-1">تواصل معنا للحجز والاستفسارات</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">العنوان</h4>
                  <p className="text-gray-700">{venueData.address || 'بجوار محطة المترو، طريق رئيسي'}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {venueData.city || 'القاهرة'}، {venueData.governorate || 'محافظة القاهرة'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">اتصل بنا</h4>
              <p className="text-gray-600 mb-3">للحجز والاستفسارات</p>
              <a 
                href={`tel:${venueOwner?.phone}`}
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              >
                {venueOwner?.phone}
              </a>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">مواعيد العمل</h4>
            </div>
            
            <div className="space-y-3">
              {[
                { day: 'السبت - الخميس', time: '9:00 صباحاً - 12:00 مساءً' },
                { day: 'الجمعة', time: '3:00 مساءً - 12:00 مساءً' },
                { day: 'العطلات الرسمية', time: 'طوال اليوم' }
              ].map((schedule, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/80 rounded-lg">
                  <span className="font-medium text-gray-800">{schedule.day}</span>
                  <span className="text-gray-600">{schedule.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 🔥 عرض المميزات
  const renderFeatures = () => {
    const features = venueData?.features || [];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 mb-6 shadow-2xl border border-purple-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">المميزات والخدمات</h3>
            <p className="text-gray-600 mt-1">كل ما تحتاجه في قاعة واحدة</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold">
            {features.length} ميزة
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.slice(0, showAllFeatures ? features.length : 8).map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-50"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-800 font-medium flex-1">{feature}</span>
            </motion.div>
          ))}
        </div>
        
        {features.length > 8 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-purple-100"
          >
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="w-full py-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <span>{showAllFeatures ? 'عرض عدد أقل من المميزات' : `عرض ${features.length - 8} ميزة إضافية`}</span>
              <svg className={`w-5 h-5 transform transition-transform duration-300 ${showAllFeatures ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // 🔥 عرض كل تفاصيل الباكدجات
  const renderPackagesSection = () => {
    const packagesToShow = packages && packages.length > 0 ? packages : [];
    const venueMeals = venueData?.meals || [];

    if (packagesToShow.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-8 mb-6 shadow-2xl border border-amber-100"
        >
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">الباكدجات والعروض</h3>
            <p className="text-gray-600 mb-6">تواصل مع القاعة مباشرة للاستفسار عن العروض المتاحة</p>
            <button
              onClick={() => openBookingModal('inspection')}
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              طلب عرض أسعار
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="space-y-8">
        {/* قسم الباكدجات الأساسية */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-8 shadow-2xl border border-amber-100"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">الباكدجات المتاحة</h3>
              <p className="text-gray-600 mt-1">اختر الباكدج الذي يناسب احتياجاتك</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold">
              {packagesToShow.length} باكدج
            </div>
          </div>

          <div className="space-y-8">
            {packagesToShow.map((pkg, index) => {
              const isSelected = selectedPackage === index;
              
              return (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-3xl p-2 transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                      : 'hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50'
                  }`}
                >
                  {/* شارة الأفضل قيمة */}
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full font-bold text-sm z-10 shadow-lg">
                      🏆 الأفضل قيمة
                    </div>
                  )}
                  
                  <div className={`bg-white rounded-2xl p-8 shadow-xl border-2 transition-all duration-300 ${
                    isSelected ? 'border-blue-500 shadow-blue-100' : 'border-amber-100 hover:border-amber-300'
                  }`}>
                    {/* رأس الباكدج */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-gray-900 mb-3">{pkg.name || `الباكدج ${index + 1}`}</h4>
                            <p className="text-gray-600 leading-relaxed">
                              {pkg.description || 'باكدج شامل لجميع الخدمات الأساسية والاضافية'}
                            </p>
                          </div>
                          
                          {/* السعر */}
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {parseInt(pkg.price || 0).toLocaleString()} جنيه
                            </div>
                            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                              <div className="flex items-center gap-3 justify-end">
                                <div className="text-lg text-gray-500 line-through">
                                  {parseInt(pkg.originalPrice).toLocaleString()} جنيه
                                </div>
                                <div className="text-sm font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
                                  توفير {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* شارات الباكدج */}
                        <div className="flex flex-wrap gap-2">
                          {pkg.discount && pkg.discount > 0 && (
                            <span className="bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-full font-bold">
                              🎁 خصم {pkg.discount}%
                            </span>
                          )}
                          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <span className="bg-red-100 text-red-800 text-sm px-3 py-1.5 rounded-full font-bold">
                              💰 وفر {parseInt(pkg.originalPrice - pkg.price).toLocaleString()} جنيه
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1.5 rounded-full font-bold">
                            📦 شامل
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* تفاصيل الباكدج */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                      {/* المميزات */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                          <h5 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            المميزات المتضمنة
                          </h5>
                          <div className="space-y-3">
                            {pkg.features.slice(0, 5).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* المعلومات الفنية */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <h5 className="font-bold text-gray-900 text-lg mb-4">المعلومات الفنية</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {pkg.capacity || venueData.capacity || 'غير محدد'}
                            </div>
                            <div className="text-gray-600 text-sm">السعة</div>
                          </div>
                          <div className="bg-white rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {parseInt(pkg.price || 0).toLocaleString()}
                            </div>
                            <div className="text-gray-600 text-sm">السعر</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">
                          شامل: {pkg.features?.length || 0} ميزة
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedPackage(isSelected ? null : index)}
                          className={`px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                          }`}
                        >
                          {isSelected ? '✓ تم الاختيار' : 'اختيار الباكدج'}
                        </button>
                        
                        <button
                          onClick={() => openBookingModal('booking')}
                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
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
        </motion.div>

        {/* 🔥 قسم الوجبات */}
        {venueMeals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-8 shadow-2xl border border-orange-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">قوائم الطعام</h3>
                <p className="text-gray-600 mt-1">تشكيلة متنوعة من الوجبات الفاخرة</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venueMeals.map((meal, index) => {
                const mealData = typeof meal === 'object' ? meal : {};
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300 hover:-translate-y-2"
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {mealData.name || `قائمة طعام ${index + 1}`}
                        </h4>
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                          {mealData.type || 'وجبة'}
                        </span>
                      </div>
                      
                      {mealData.description && (
                        <p className="text-gray-600 text-sm mb-4">{mealData.description}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm font-bold text-gray-700 mb-2">يشمل:</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        {mealData.name?.split('+').map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <span>{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-600">السعر للشخص</div>
                          <div className="text-xl font-bold text-green-600">
                            {mealData.price ? parseInt(mealData.price).toLocaleString() : '???'} جنيه
                          </div>
                        </div>
                        <button
                          onClick={() => openBookingModal('booking')}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                        >
                          إضافة للطلب
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">موقع القاعة</h3>
              <p className="text-gray-600 mt-1">تعرف على كيفية الوصول إلينا</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{venueData?.name}</h4>
                    <p className="text-gray-700">{venueData?.address}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {venueData?.city}، {venueData?.governorate}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center bg-blue-50 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4.577a1 1 0 00-.293-.707l-2-2A1 1 0 0018 8V5a1 1 0 00-1-1h-1.05a2.5 2.5 0 00-4.9 0H4a1 1 0 00-1 1v2.5a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 011-1h2a1 1 0 011 1v.5a1 1 0 001 1h1a1 1 0 011 1v1.5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-.5a1 1 0 00-1-1h-2a1 1 0 00-1 1v3.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5.5a1 1 0 00-1-1H2a1 1 0 010-2h1a1 1 0 001-1V5a1 1 0 011-1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 011-1h4a1 1 0 011 1v2.5a1 1 0 001 1h1a1 1 0 011 1v1.5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-.5a1 1 0 00-1-1h-2a1 1 0 00-1 1v.5a1 1 0 01-1 1H7a1 1 0 01-1-1v-2.5a1 1 0 00-1-1H4a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v2.5a1 1 0 001 1h1a1 1 0 011 1v1.5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-.5a1 1 0 00-1-1h-2a1 1 0 00-1 1v3.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5.5a1 1 0 00-1-1H2a1 1 0 010-2h1a1 1 0 001-1V5z" />
                    </svg>
                    <p className="text-sm font-bold text-gray-900">موقف سيارات</p>
                    <p className="text-green-600 text-xs mt-1">متوفر</p>
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* خريطة جوجل */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 flex items-center justify-center">
              <div className="w-full h-64 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-xl font-bold mb-2">موقع القاعة</h4>
                    <p className="opacity-90">اضغط لفتح الخريطة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 🔥 عرض التبويبات
  const renderTabs = () => {
    const tabs = [
      { id: "details", label: "التفاصيل", icon: "📋" },
      { id: "gallery", label: " المعرض", icon: "🖼️" },
      { id: "packages", label: "الباكدجات", icon: "💰" },
      { id: "location", label: "الموقع", icon: "📍" },
      { id: "reviews", label: "التقييمات", icon: "⭐" },
      
    ];

    return (
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 whitespace-nowrap border-b-2 transition-all font-bold text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
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
          <div className="space-y-6">
            {renderQuickInfo()}
            {renderContactInfo()}
            {renderFeatures()}
          </div>
        );
      
      case "gallery":
        return renderGallerySection();
      
      case "reviews":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-8 shadow-2xl border border-yellow-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">التقييمات والآراء</h3>
                <p className="text-gray-600 mt-1">رأي زوارنا في القاعة</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            {renderReviewsSection()}
          </motion.div>
        );

      case "location":
        return renderMapSection();

      case "packages":
        return renderPackagesSection();
      
      default:
        return null;
    }
  };

  // 🔥 عرض التقييمات
  const renderReviewsSection = () => {
    if (loadingReviews) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="medium" text="جاري تحميل التقييمات..." />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* متوسط التقييم */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">4.8</div>
              {renderStars(4.8)}
              <div className="text-gray-600 text-sm mt-2">{reviews.length} تقييم</div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="w-10 text-right text-sm text-gray-700">{rating} نجوم</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                        style={{ width: `${(rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 3 : 2)}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-sm text-gray-600">
                      {rating === 5 ? '75%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* قائمة التقييمات */}
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div 
              key={review.id || index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {review.user_name?.charAt(0) || 'ز'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.user_name || 'زائر'}</h4>
                    <p className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">لا توجد تقييمات حتى الآن</h4>
            <p className="text-gray-600 mb-6">كن أول من يقيم هذه القاعة</p>
            <button
              onClick={() => alert('ميزة إضافة التقييم قريباً')}
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
            >
              أضف تقييمك
            </button>
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
              <button
                onClick={closeReelsModal}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="w-full h-full">
                {renderVideoBySource(selectedReel)}
              </div>

              {/* معلومات الريلز */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-bold text-lg mb-2">{selectedReel.title || `فيديو ${currentReelIndex + 1}`}</h4>
                <p className="text-sm text-gray-300 mb-3">{selectedReel.description || "جولة داخل القاعة وتصميماتها الفاخرة"}</p>
                
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

  // 🔥 أزرار الحجز على الموبايل
  const renderMobileBookingButtons = () => {
    if (window.innerWidth >= 768) return null;

    return (
      <AnimatePresence>
        {showMobileBooking && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-40"
          >
            <div className="bg-gradient-to-r from-blue-500/95 to-purple-600/95 backdrop-blur-lg rounded-2xl p-3 shadow-2xl border border-white/20">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openBookingModal('inspection')}
                  className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-bold text-sm transition-all backdrop-blur-sm"
                >
                  طلب معاينة
                </button>
                <button
                  onClick={() => openBookingModal('booking')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
                >
                  حجز مباشر
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // حالات التحميل والأخطاء
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">جاري تحميل بيانات القاعة</h2>
          <p className="text-gray-600">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  if (error || !venueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full border border-gray-100"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">حدث خطأ</h2>
          <p className="text-gray-600 mb-8">{error || 'تعذر تحميل بيانات القاعة'}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
            >
              العودة للرئيسية
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 🔥 زر المشاركة */}
      <button
        onClick={handleShareClick}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 px-4 py-3 rounded-2xl font-bold transition-all hover:scale-105 shadow-2xl backdrop-blur-sm border border-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-sm">مشاركة</span>
      </button>

      {/* سلايدر الصور الرئيسي */}
      <div className="px-4 pt-6">
        {renderImageSlider()}
      </div>

      {/* التبويبات */}
      {renderTabs()}

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* المحتوى الرئيسي */}
          <div className="flex-1">
            {renderTabContent()}
          </div>

          {/* 🔥 أزرار الحجز الثابتة في اليمين */}
          <div className="lg:w-80">
            <div className="sticky top-24 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">إجراء سريع</h3>
                <p className="text-gray-600 text-sm mt-1">احجز الآن بسهولة</p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => openBookingModal('inspection')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    bookingSubmitted 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>طلب معاينة</span>
                </button>
                
                <button
                  onClick={() => openBookingModal('booking')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    bookingSubmitted
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>حجز مباشر</span>
                </button>
              </div>

              {/* معلومات سريعة */}
              <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-lg mb-4">معلومات سريعة</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-gray-600">السعة:</span>
                    <span className="font-bold text-gray-900">{venueData.capacity || 250}+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-gray-600">التقييم:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold text-gray-900">{venueData.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-gray-600">الهاتف:</span>
                    <a href={`tel:${venueOwner?.phone}`} className="font-bold text-blue-600 hover:text-blue-700">
                      {venueOwner?.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              {/* 🔥 ملاحظة الأسعار */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-800 font-bold">السعر عند التواصل</p>
                </div>
                <p className="text-blue-600 text-sm">تواصل مع القاعة للاستفسار عن الأسعار والعروض</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 أزرار الحجز على الموبايل */}
      {renderMobileBookingButtons()}

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
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeBookingModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {bookingType === 'inspection' ? 'طلب معاينة' : 'حجز مباشر'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">املأ النموذج وسنتصل بك</p>
                </div>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أدخل اسمك بالكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    تاريخ المناسبة *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.eventDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    عدد الضيوف المتوقع
                  </label>
                  <input
                    type="number"
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أدخل عدد الضيوف"
                    min="1"
                  />
                </div>

                {selectedPackage !== null && packages[selectedPackage] && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 text-sm mb-1">الباكدج المختار</h4>
                    <p className="text-blue-700 font-medium">{packages[selectedPackage]?.name}</p>
                    <p className="text-blue-600 font-bold text-lg mt-1">
                      {parseInt(packages[selectedPackage]?.price || 0).toLocaleString()} جنيه
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أي ملاحظات أو متطلبات إضافية..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || bookingSubmitted}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-xl ${
                    isSubmitting || bookingSubmitted
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : bookingType === 'inspection'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </div>
                  ) : bookingSubmitted ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      تم الإرسال بنجاح
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