import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [reels, setReels] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [showMobileBooking, setShowMobileBooking] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
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
          `http://localhost:5000/api/wedding-venues/${id}`,
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
            `http://localhost:5000/api/wedding-venues/${id}/packages`,
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
          // موقع افتراضي للقاهرة
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

  // 🔥 فتح الخريطة
  const openMapModal = () => {
    setShowMapModal(true);
  };

  // 🔥 إغلاق الخريطة
  const closeMapModal = () => {
    setShowMapModal(false);
  };

  // 🔥 فتح الموقع في خرائط جوجل
  const openInGoogleMaps = () => {
    if (!mapLocation) return;
    
    const url = `https://www.google.com/maps/search/?api=1&query=${mapLocation.lat},${mapLocation.lng}`;
    window.open(url, '_blank');
  };

  // 🔥 فتح الموقع في ويز
  const openInWaze = () => {
    if (!mapLocation) return;
    
    const url = `https://waze.com/ul?ll=${mapLocation.lat},${mapLocation.lng}&navigate=yes`;
    window.open(url, '_blank');
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
          <i
            key={star}
            className={`bi bi-star-fill text-sm ${
              star <= numericRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
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

  // 🔥 سلايدر الصور الرئيسي - يعرض فقط اسم القاعة
  const renderImageSlider = () => {
    const allImages = venueData?.images || (venueData?.image ? [venueData.image] : []);
    const safeImages = Array.isArray(allImages) ? allImages : [];
    const displayImages = safeImages.slice(0, 6);

    if (displayImages.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <i className="bi bi-building text-7xl mb-4"></i>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{venueData?.name || 'قاعة أفراح'}</h1>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
        {/* الصور المتحركة */}
        <div className="relative w-full h-full">
          {displayImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === selectedImage ? 1 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={image} 
                alt={`${venueData?.name || 'القاعة'}`}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* اسم القاعة فقط */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-3xl font-bold"
          >
            {venueData?.name}
          </motion.h1>
        </div>
        
        {/* أزرار التنقل */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
              aria-label="الصورة السابقة"
            >
              <i className="bi bi-chevron-right text-xl"></i>
            </button>
            <button
              onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
              aria-label="الصورة التالية"
            >
              <i className="bi bi-chevron-left text-xl"></i>
            </button>
          </>
        )}
        
        {/* مؤشر الصور */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedImage 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`الذهاب إلى الصورة ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* عداد الصور */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
            <i className="bi bi-images"></i>
            <span>{selectedImage + 1} / {displayImages.length}</span>
          </div>
        )}
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
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>

              <img 
                src={isImageValid ? currentImage : getFallbackImage(venueData?.name)} 
                alt={`${venueData?.name || 'القاعة'}`}
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  >
                    <i className="bi bi-chevron-right text-2xl"></i>
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  >
                    <i className="bi bi-chevron-left text-2xl"></i>
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-3">
                <i className="bi bi-images"></i>
                <span>{selectedGalleryImage + 1} / {images.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // 🔥 مودال الخريطة
  const renderMapModal = () => {
    if (!showMapModal || !mapLocation) return null;

    return (
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeMapModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس المودال */}
              <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 flex justify-between items-center z-10 border-b border-gray-200">
                <div>
                  <h3 className="font-bold text-gray-900">موقع القاعة</h3>
                  <p className="text-sm text-gray-600">{mapLocation.name}</p>
                </div>
                <button
                  onClick={closeMapModal}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* الخريطة */}
              <div className="w-full h-full pt-16">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <LoadingSpinner size="medium" text="جاري تحميل الخريطة..." />
                  </div>
                }>
                  <VenueMap
                    venues={[{
                      id: venueData.id,
                      name: venueData.name,
                      lat: mapLocation.lat,
                      lng: mapLocation.lng,
                      address: mapLocation.address,
                      city: mapLocation.city,
                      governorate: mapLocation.governorate
                    }]}
                    onVenueClick={() => {}}
                    onVenueHover={() => {}}
                    activeVenueId={venueData.id}
                  />
                </Suspense>
              </div>

              {/* أزرار التنقل */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <button
                  onClick={openInGoogleMaps}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg"
                >
                  <i className="bi bi-google"></i>
                  <span>خرائط جوجل</span>
                </button>
                <button
                  onClick={openInWaze}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg"
                >
                  <i className="bi bi-waze"></i>
                  <span>Waze</span>
                </button>
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
          className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
        >
          <div className="text-center py-8">
            <i className="bi bi-image text-5xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">الصور والفيديوهات</h3>
            <p className="text-gray-600">سيتم إضافة الصور والفيديوهات قريباً</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <i className="bi bi-images text-2xl text-gray-700"></i>
            <h3 className="text-xl font-bold text-gray-900">معرض الصور</h3>
          </div>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <i className="bi bi-camera"></i>
            {allImages.length} صورة
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allImages.slice(0, 8).map((image, index) => (
            <motion.div 
              key={`image-${index}`} 
              className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              onClick={() => openImageModal(index)}
            >
              <img 
                src={image} 
                alt={`${venueData.name}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(venueData?.name);
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <i className="bi bi-zoom-in text-white text-2xl"></i>
              </div>
            </motion.div>
          ))}
        </div>
        
        {allImages.length > 8 && (
          <button
            onClick={() => openImageModal(0)}
            className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="bi bi-images"></i>
            <span>عرض الكل ({allImages.length} صورة)</span>
          </button>
        )}
      </motion.div>
    );
  };

  // 🔥 عرض معلومات سريعة
  const renderQuickInfo = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="bi bi-info-circle text-gray-700"></i>
          <span>معلومات سريعة</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <i className="bi bi-people text-2xl text-gray-700 mb-2"></i>
            <div className="font-bold text-gray-900 text-xl">{venueData.capacity || 250}+</div>
            <div className="text-gray-600 text-sm">سعة القاعة</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <i className="bi bi-star text-2xl text-yellow-500 mb-2"></i>
            <div className="font-bold text-gray-900 text-xl">{venueData.rating || 4.5}</div>
            <div className="text-gray-600 text-sm">التقييم</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <i className="bi bi-clock text-2xl text-gray-700 mb-2"></i>
            <div className="font-bold text-gray-900 text-xl">6</div>
            <div className="text-gray-600 text-sm">ساعات الحفل</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <i className={`bi bi-check-circle text-2xl ${venueData.available ? 'text-green-600' : 'text-red-600'} mb-2`}></i>
            <div className={`font-bold text-xl ${venueData.available ? 'text-green-600' : 'text-red-600'}`}>
              {venueData.available ? 'متاحة' : 'غير متاحة'}
            </div>
            <div className="text-gray-600 text-sm">الحجوزات</div>
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
        className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="bi bi-telephone text-gray-700"></i>
          <span>معلومات التواصل</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <i className="bi bi-geo-alt text-gray-500 text-xl"></i>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">العنوان</h4>
                <p className="text-gray-700">{venueData.address || 'بجوار محطة المترو'}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {venueData.city || 'القاهرة'}، {venueData.governorate || 'محافظة القاهرة'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <i className="bi bi-whatsapp text-3xl text-green-600 mb-2"></i>
              <h4 className="text-lg font-bold text-gray-900 mb-2">اتصل بنا</h4>
              <p className="text-gray-600 mb-3">للحجز والاستفسارات</p>
              <a 
                href={`tel:${venueOwner?.phone}`}
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-bold transition-all"
              >
                {venueOwner?.phone}
              </a>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-center mb-4">
              <i className="bi bi-clock text-3xl text-gray-700 mb-2"></i>
              <h4 className="text-lg font-bold text-gray-900">مواعيد العمل</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="font-medium text-gray-800">السبت - الخميس</span>
                <span className="text-gray-600">9ص - 12م</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="font-medium text-gray-800">الجمعة</span>
                <span className="text-gray-600">3م - 12م</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="font-medium text-gray-800">العطلات</span>
                <span className="text-gray-600">طوال اليوم</span>
              </div>
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
        className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="bi bi-stars text-2xl text-gray-700"></i>
            <h3 className="text-xl font-bold text-gray-900">المميزات</h3>
          </div>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {features.length} ميزة
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.slice(0, showAllFeatures ? features.length : 8).map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <i className="bi bi-check-circle-fill text-green-600"></i>
              <span className="text-gray-800">{feature}</span>
            </motion.div>
          ))}
        </div>
        
        {features.length > 8 && (
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className={`bi bi-chevron-${showAllFeatures ? 'up' : 'down'}`}></i>
            <span>{showAllFeatures ? 'عرض أقل' : `عرض ${features.length - 8} ميزة إضافية`}</span>
          </button>
        )}
      </motion.div>
    );
  };

  // 🔥 عرض كل تفاصيل الباكدجات
  const renderPackagesSection = () => {
    const packagesToShow = packages && packages.length > 0 ? packages : [];

    if (packagesToShow.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
        >
          <div className="text-center py-8">
            <i className="bi bi-gift text-5xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">الباكدجات</h3>
            <p className="text-gray-600 mb-6">تواصل مع القاعة للاستفسار عن العروض</p>
            <button
              onClick={() => openBookingModal('inspection')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
            >
              طلب عرض أسعار
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <i className="bi bi-pricetag text-2xl text-gray-700"></i>
            <h3 className="text-xl font-bold text-gray-900">الباكدجات المتاحة</h3>
          </div>

          <div className="space-y-4">
            {packagesToShow.map((pkg, index) => {
              const isSelected = selectedPackage === index;
              
              return (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name || `الباكدج ${index + 1}`}</h4>
                      <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {pkg.features?.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                        {pkg.features?.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            +{pkg.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {parseInt(pkg.price || 0).toLocaleString()} ج
                      </div>
                      <button
                        onClick={() => setSelectedPackage(isSelected ? null : index)}
                        className={`mt-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          isSelected
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                      >
                        {isSelected ? 'إلغاء' : 'اختيار'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  // 🔥 عرض الخريطة في التبويب
  const renderMapTab = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-geo-alt text-2xl text-gray-700"></i>
          <h3 className="text-xl font-bold text-gray-900">موقع القاعة</h3>
        </div>
        
        <div 
          onClick={openMapModal}
          className="relative h-64 bg-gray-200 rounded-xl overflow-hidden cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
            <div className="text-center text-white">
              <i className="bi bi-map text-5xl mb-3"></i>
              <h4 className="text-xl font-bold mb-1">{venueData?.name}</h4>
              <p className="text-sm opacity-90">{venueData?.address}</p>
              <p className="text-sm opacity-75">{venueData?.city}، {venueData?.governorate}</p>
              <button className="mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2">
                <i className="bi bi-arrows-fullscreen"></i>
                <span>عرض على الخريطة</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={openInGoogleMaps}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <i className="bi bi-google"></i>
            <span>خرائط جوجل</span>
          </button>
          <button
            onClick={openInWaze}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <i className="bi bi-waze"></i>
            <span>Waze</span>
          </button>
        </div>
      </motion.div>
    );
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <i className="bi bi-star text-2xl text-yellow-500"></i>
          <h3 className="text-xl font-bold text-gray-900">التقييمات</h3>
        </div>

        {/* متوسط التقييم */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">4.8</div>
              {renderStars(4.8)}
              <div className="text-gray-600 text-sm mt-1">{reviews.length} تقييم</div>
            </div>
            <div className="flex-1 w-full">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-8 text-sm text-gray-700">{rating} <i className="bi bi-star-fill text-xs"></i></div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400" 
                        style={{ width: `${rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
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
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div 
                key={review.id || index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <i className="bi bi-person text-xl text-gray-500"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user_name || 'زائر'}</h4>
                      <p className="text-gray-500 text-xs">{new Date(review.created_at).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 mr-13">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="bi bi-chat text-5xl text-gray-400 mb-4"></i>
            <h4 className="text-xl font-bold text-gray-900 mb-2">لا توجد تقييمات</h4>
            <p className="text-gray-600 mb-4">كن أول من يقيم هذه القاعة</p>
            <button
              onClick={() => alert('ميزة إضافة التقييم قريباً')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
            >
              أضف تقييمك
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  // 🔥 عرض التبويبات
  const renderTabs = () => {
    const tabs = [
      { id: "details", label: "التفاصيل", icon: "bi-info-circle" },
      { id: "gallery", label: "المعرض", icon: "bi-images" },
      { id: "packages", label: "الباكدجات", icon: "bi-gift" },
      { id: "location", label: "الموقع", icon: "bi-geo-alt" },
      { id: "reviews", label: "التقييمات", icon: "bi-star" },
    ];

    return (
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 transition-all font-medium ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className={`${tab.icon}`}></i>
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
        return renderReviewsSection();

      case "location":
        return renderMapTab();

      case "packages":
        return renderPackagesSection();
      
      default:
        return null;
    }
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
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-2 shadow-xl border border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openBookingModal('inspection')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <i className="bi bi-eye"></i>
                  <span>معاينة</span>
                </button>
                <button
                  onClick={() => openBookingModal('booking')}
                  className="bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <i className="bi bi-check-circle"></i>
                  <span>حجز</span>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">جاري التحميل</h2>
          <p className="text-gray-600">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  if (error || !venueData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full border border-gray-200"
        >
          <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">حدث خطأ</h2>
          <p className="text-gray-600 mb-8">{error || 'تعذر تحميل بيانات القاعة'}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 زر المشاركة */}
      <button
        onClick={handleShareClick}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 px-4 py-2 rounded-xl font-medium transition-all shadow-lg backdrop-blur-sm border border-gray-200"
      >
        <i className="bi bi-share"></i>
        <span className="text-sm">مشاركة</span>
      </button>

      {/* سلايدر الصور الرئيسي */}
      <div className="px-4 pt-4">
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
            <div className="sticky top-24 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="text-center mb-4">
                <i className="bi bi-check-circle text-4xl text-gray-800 mb-2"></i>
                <h3 className="text-lg font-bold text-gray-900">إجراء سريع</h3>
                <p className="text-gray-600 text-xs mt-1">احجز الآن بسهولة</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => openBookingModal('inspection')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    bookingSubmitted 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <i className="bi bi-eye"></i>
                  <span>طلب معاينة</span>
                </button>
                
                <button
                  onClick={() => openBookingModal('booking')}
                  disabled={bookingSubmitted}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    bookingSubmitted
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  <i className="bi bi-check-circle"></i>
                  <span>حجز مباشر</span>
                </button>
              </div>

              {/* معلومات سريعة */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 text-sm mb-2">معلومات سريعة</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعة:</span>
                    <span className="font-medium text-gray-900">{venueData.capacity || 250}+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">التقييم:</span>
                    <div className="flex items-center gap-1">
                      <i className="bi bi-star-fill text-yellow-500 text-xs"></i>
                      <span className="font-medium text-gray-900">{venueData.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الهاتف:</span>
                    <a href={`tel:${venueOwner?.phone}`} className="font-medium text-blue-600 hover:text-blue-700">
                      {venueOwner?.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              {/* 🔥 ملاحظة الأسعار */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <i className="bi bi-info-circle text-blue-600"></i>
                  <p className="text-blue-800 font-medium text-sm">السعر عند التواصل</p>
                </div>
                <p className="text-blue-600 text-xs">تواصل للاستفسار عن الأسعار</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 أزرار الحجز على الموبايل */}
      {renderMobileBookingButtons()}

      {/* 🔥 معرض الصور المودال */}
      {renderImageModal()}

      {/* 🔥 مودال الخريطة */}
      {renderMapModal()}

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeBookingModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {bookingType === 'inspection' ? 'طلب معاينة' : 'حجز مباشر'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">املأ النموذج وسنتصل بك</p>
                </div>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    placeholder="أدخل اسمك بالكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ المناسبة *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.eventDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الضيوف
                  </label>
                  <input
                    type="number"
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    placeholder="أدخل عدد الضيوف"
                    min="1"
                  />
                </div>

                {selectedPackage !== null && packages[selectedPackage] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 text-sm mb-1">الباكدج المختار</h4>
                    <p className="text-blue-700 font-medium">{packages[selectedPackage]?.name}</p>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      {parseInt(packages[selectedPackage]?.price || 0).toLocaleString()} جنيه
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || bookingSubmitted}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                    isSubmitting || bookingSubmitted
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : bookingType === 'inspection'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </div>
                  ) : bookingSubmitted ? (
                    <div className="flex items-center justify-center gap-2">
                      <i className="bi bi-check-circle"></i>
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