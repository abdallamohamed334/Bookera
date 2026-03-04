import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap-icons/font/bootstrap-icons.css';

const PhotographerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [autoSlide, setAutoSlide] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImageIndex, setAlbumImageIndex] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [socialMediaVisible, setSocialMediaVisible] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  
  // بيانات إضافية عشوائية لإثراء الصفحة
  const generateRandomAchievements = () => {
    const achievements = [
      { icon: "bi-trophy", title: "أفضل مصور 2024", description: "جائزة التميز في التصوير الفوتوغرافي" },
      { icon: "bi-camera", title: "أكثر المصورين طلباً", description: "في منطقة القاهرة الكبرى" },
      { icon: "bi-star-fill", title: "تقييم 5 نجوم", description: "من أكثر من 200 عميل" },
      { icon: "bi-film", title: "تصوير فيديو احترافي", description: "حاصل على شهادة معتمدة" },
      { icon: "bi-globe", title: "تغطية دولية", description: "خبرة في تصوير الأفراح خارج مصر" },
      { icon: "bi-award", title: "عضو في النقابة", description: "نقابة المصورين المحترفين" }
    ];
    return achievements.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  const generateRandomStats = () => {
    return [
      { label: "سنوات الخبرة", value: "8+", icon: "bi-clock-history" },
      { label: "جلسة تصوير", value: "500+", icon: "bi-camera" },
      { label: "عميل سعيد", value: "300+", icon: "bi-emoji-smile" },
      { label: "جائزة", value: "12", icon: "bi-award" },
      { label: "ألبوم منجز", value: "150+", icon: "bi-folder" },
      { label: "ساعة تصوير", value: "2000+", icon: "bi-stopwatch" }
    ];
  };

  const generateRandomTestimonials = () => {
    const testimonials = [
      { name: "أحمد محمد", comment: "أفضل مصور تعاملت معه، شغل محترف وذوق عالي جداً", rating: 5, date: "منذ 3 أيام" },
      { name: "سارة أحمد", comment: "صور زفافي كانت أحلى من الخيال، شكراً جزيلاً", rating: 5, date: "منذ أسبوع" },
      { name: "محمد علي", comment: "تعامل محترف وسعر مناسب جداً، أنصح بالتعامل معه", rating: 4, date: "منذ أسبوعين" },
      { name: "فاطمة عمر", comment: "التصوير العائلي عنده تحفة، أنصح وبقوة", rating: 5, date: "منذ 3 أسابيع" },
      { name: "خالد حسن", comment: "صور المناسبات عنده شيئ آخر، إبداع بمعنى الكلمة", rating: 5, date: "منذ شهر" },
      { name: "نورا سعيد", comment: "التسليم كان سريع والصور جودة عالية جداً", rating: 4, date: "منذ شهر" }
    ];
    return testimonials.sort(() => 0.5 - Math.random());
  };

  const generateRandomFAQ = () => {
    return [
      { q: "كم مدة تسليم الصور؟", a: "عادة ما يتم تسليم الصور خلال 7-14 يوم عمل بعد المناسبة" },
      { q: "هل توفرون تصوير الفيديو أيضاً؟", a: "نعم، نوفر خدمة تصوير الفيديو بشكل احترافي" },
      { q: "كم عدد الصور المسلمة؟", a: "يختلف حسب الباقة، لكن في المتوسط 300-500 صورة" },
      { q: "هل يوجد جلسة تصوير قبل الزفاف؟", a: "نعم، نوفر جلسات تصوير خطوبة وتجهيزات الزفاف" },
      { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل الدفع نقداً، تحويل بنكي، وبطاقات ائتمان" },
      { q: "هل توفرون ألبوم مطبوع؟", a: "نعم، نوفر ألبومات فاخرة حسب الباقة المختارة" }
    ];
  };

  const generateRandomCertificates = () => {
    return [
      { name: "شهادة تصوير محترف", issuer: "معهد التصوير الدولي", year: "2024" },
      { name: "دبلومة التصوير الرقمي", issuer: "جامعة القاهرة", year: "2023" },
      { name: "تصوير البورتريه", issuer: "أكاديمية الفنون", year: "2022" },
      { name: "المونتاج المتقدم", issuer: "Adobe Certified", year: "2024" },
      { name: "تصوير الأفراح", issuer: "نقابة المصورين", year: "2023" }
    ];
  };

  // جمع كل الصور من الألبومات
  const getAllImages = () => {
    return photographer?.portfolio?.flatMap(album => album.images || []) || [];
  };

  // دالة محسنة لاختيار صور عشوائية من Unsplash
  const getRandomSliderImages = (portfolio, count = 12) => {
    // صور Unsplash عالية الجودة للمصورين
    const defaultImages = [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop"
    ];
    
    if (!portfolio || portfolio.length === 0) {
      return defaultImages;
    }
    
    // استخراج جميع الصور من الألبومات
    const allImages = portfolio.flatMap(album => 
      album.images && album.images.length > 0 ? album.images : []
    );
    
    if (allImages.length === 0) {
      return defaultImages;
    }
    
    if (allImages.length <= count) return allImages;
    
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // دالة لتنظيف وإعداد رقم الهاتف للواتساب
  const prepareWhatsAppNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    cleanNumber = cleanNumber.replace(/^0+/, '');
    
    if (!cleanNumber.startsWith('20')) {
      cleanNumber = '20' + cleanNumber;
    }
    
    return cleanNumber;
  };

  // دالة لتنسيق وعرض معلومات التواصل بشكل آمن
  const formatContactInfo = (contact, isEmail = false) => {
    if (!contact) return "غير متوفر";
    
    if (isEmail) {
      const [username, domain] = contact.split('@');
      if (username.length > 3) {
        return `${username.substring(0, 3)}***@${domain}`;
      }
      return `***@${domain}`;
    } else {
      if (contact.length > 7) {
        return `${contact.substring(0, 4)} *** ***`;
      }
      return contact;
    }
  };

  // Auto slide for gallery
  useEffect(() => {
    if (!autoSlide || !sliderImages || sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSlide, sliderImages]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/photographers/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setPhotographer(data);
          
          // جمع كل الصور من جميع الألبومات
          const allImages = data.portfolio?.flatMap(album => 
            album.images || []
          ) || [];
          
          // استخدام الصور الحقيقية أو صور Unsplash
          const randomImages = allImages.length > 0 
            ? allImages.slice(0, 12) // عرض أول 12 صورة
            : getRandomSliderImages([], 12);
            
          setSliderImages(randomImages);
          setCurrentGalleryImages(allImages.length > 0 ? allImages : randomImages);
          setSelectedPackage(null);
        } else {
          throw new Error('المصور غير موجود');
        }
      } catch (err) {
        setError('المصور غير موجود');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPhotographer();
    } else {
      setError('لم يتم تحديد مصور');
      setLoading(false);
    }
  }, [id]);

  // فتح معرض الصور
  const openGalleryLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  // إصلاح مشكلة الأزرار
  useEffect(() => {
    const fixButtons = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, { passive: false });
      });
    };

    fixButtons();
  }, []);

  const nextImage = () => {
    if (sliderImages && sliderImages.length > 0) {
      setSelectedImage(prev => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (sliderImages && sliderImages.length > 0) {
      setSelectedImage(prev => 
        prev === 0 ? sliderImages.length - 1 : prev - 1
      );
    }
  };

  // دالة التواصل عبر واتساب
  const handleWhatsAppContact = () => {
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحباً ${photographer.name}،
أنا تواصلت معك من خلال موقع بوكيرا وأرغب في الاستفسار عن خدمات التصوير.

الاسم: ${photographer.name}
التخصص: ${photographer.specialty}
المدينة: ${photographer.city}

أرجو التواصل معي في أقرب وقت ممكن.
شكراً جزيلاً 🌸`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // دالة حجز الباقة (مع أو بدون اختيار)
  const handleBookPackage = (pkg = null) => {
    if (pkg) {
      // حجز باقة محددة
      setBookingPackage(pkg);
    } else {
      // حجز بدون باقة محددة
      setBookingPackage(null);
    }
    setBookingModalOpen(true);
  };

  // دالة إرسال طلب الحجز
  const submitBooking = () => {
    if (!bookingName || !bookingPhone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف");
      return;
    }

    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    let message = `مرحباً ${photographer.name}،
أنا ${bookingName} تواصلت معك من خلال موقع بوكيرا وأرغب في حجز جلسة تصوير.

📞 رقم هاتفي: ${bookingPhone}`;

    if (bookingPackage) {
      message += `\n\n📦 الباقة المختارة: ${bookingPackage.name}
💰 سعر الباقة: ${bookingPackage.price.toLocaleString()} جنيه`;
    } else {
      message += `\n\n📦 أرغب في الاستفسار عن الباقات المتاحة`;
    }

    if (bookingDate) {
      message += `\n📅 التاريخ المطلوب: ${bookingDate}`;
    }

    if (bookingTime) {
      message += `\n⏰ الوقت المطلوب: ${bookingTime}`;
    }

    if (bookingNotes) {
      message += `\n\n📝 ملاحظات إضافية: ${bookingNotes}`;
    }

    message += `\n\nشكراً جزيلاً 🌸`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // إغلاق النافذة بعد الإرسال
    setBookingModalOpen(false);
    
    // تفريغ الحقول
    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setBookingTime("");
    setBookingNotes("");
    setBookingPackage(null);
  };

  const handleBookPhotographer = () => {
    if (!selectedPackage) {
      handleWhatsAppContact();
      return;
    }
    
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحباً ${photographer.name}،
أنا تواصلت معك من خلال موقع بوكيرا وحابب أحجز جلسة تصوير.

الاسم: ${photographer.name}
التخصص: ${photographer.specialty}
الباقة المختارة: ${selectedPackage.name}
السعر: ${selectedPackage.price.toLocaleString()} جنيه

ممكن تفاصيل أكثر عن الباقة والمواعيد المتاحة؟
شكراً لحضرتك 🌸`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleConsultation = () => {
    handleWhatsAppContact();
  };

  const togglePackageSelection = (pkg) => {
    if (selectedPackage && selectedPackage._id === pkg._id) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(pkg);
    }
  };

  const deselectPackage = () => {
    setSelectedPackage(null);
  };

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    if (sliderImages) {
      setLightboxImageIndex(prev => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevLightboxImage = () => {
    if (sliderImages) {
      setLightboxImageIndex(prev => 
        prev === 0 ? sliderImages.length - 1 : prev - 1
      );
    }
  };

  // Album modal functions
  const openAlbumModal = (album) => {
    setSelectedAlbum(album);
    setAlbumImageIndex(0);
    setAlbumModalOpen(true);
  };

  const closeAlbumModal = () => {
    setAlbumModalOpen(false);
    setSelectedAlbum(null);
    setAlbumImageIndex(0);
  };

  const nextAlbumImage = () => {
    if (selectedAlbum?.images) {
      setAlbumImageIndex(prev => 
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevAlbumImage = () => {
    if (selectedAlbum?.images) {
      setAlbumImageIndex(prev => 
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
      );
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi bi-star-fill text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
        ))}
        <span className="text-gray-600 text-xs mr-1">({rating})</span>
      </div>
    );
  };

  const renderWorkingHours = () => {
    const defaultWorkingHours = {
      "saturday": "10:00 ص - 10:00 م",
      "sunday": "10:00 ص - 10:00 م",
      "monday": "10:00 ص - 10:00 م", 
      "tuesday": "10:00 ص - 10:00 م",
      "wednesday": "10:00 ص - 10:00 م",
      "thursday": "10:00 ص - 10:00 م",
      "friday": "11:00 ص - 6:00 م"
    };

    const workingHours = photographer?.workingHours || defaultWorkingHours;
    const days = {
      "saturday": "السبت",
      "sunday": "الأحد",
      "monday": "الإثنين", 
      "tuesday": "الثلاثاء",
      "wednesday": "الأربعاء",
      "thursday": "الخميس",
      "friday": "الجمعة"
    };

    return (
      <div className="space-y-2">
        {Object.entries(workingHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <i className="bi bi-calendar"></i>
              {days[day]}:
            </span>
            <span className={`font-semibold text-sm ${
              hours.includes("مغلق") || hours.includes("إجازة") 
                ? "text-red-600" 
                : "text-blue-600"
            }`}>
              {hours}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Render social media section تحت السلايدر
  const renderSocialMedia = () => {
    const socialMedia = photographer?.socialMedia;
    
    if (!socialMedia || (!socialMedia.instagram && !socialMedia.facebook && !socialMedia.website)) {
      return null;
    }

    return (
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i className="bi bi-share text-blue-600"></i>
          <span>صفحات المصور الخاصه به </span>
        </h3>
        
        <div className="flex items-center justify-center gap-4">
          {socialMedia.instagram && (
            <button
              onClick={() => window.open(socialMedia.instagram.startsWith('http') ? socialMedia.instagram : `https://${socialMedia.instagram}`, '_blank', 'noopener,noreferrer')}
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md"
            >
              <i className="bi bi-instagram text-2xl"></i>
            </button>
          )}

          {socialMedia.facebook && (
            <button
              onClick={() => window.open(socialMedia.facebook.startsWith('http') ? socialMedia.facebook : `https://${socialMedia.facebook}`, '_blank', 'noopener,noreferrer')}
              className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md"
            >
              <i className="bi bi-facebook text-2xl"></i>
            </button>
          )}

          {socialMedia.website && (
            <button
              onClick={() => window.open(socialMedia.website.startsWith('http') ? socialMedia.website : `https://${socialMedia.website}`, '_blank', 'noopener,noreferrer')}
              className="w-12 h-12 bg-gray-700 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md"
            >
              <i className="bi bi-globe2 text-2xl"></i>
            </button>
          )}

          {socialMedia.tiktok && (
            <button
              onClick={() => window.open(socialMedia.tiktok.startsWith('http') ? socialMedia.tiktok : `https://${socialMedia.tiktok}`, '_blank', 'noopener,noreferrer')}
              className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md"
            >
              <i className="bi bi-tiktok text-2xl"></i>
            </button>
          )}

          {socialMedia.youtube && (
            <button
              onClick={() => window.open(socialMedia.youtube.startsWith('http') ? socialMedia.youtube : `https://${socialMedia.youtube}`, '_blank', 'noopener,noreferrer')}
              className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md"
            >
              <i className="bi bi-youtube text-2xl"></i>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render achievements section
  const renderAchievements = () => {
    const achievements = generateRandomAchievements();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-3xl border border-yellow-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bi bi-trophy-fill text-yellow-600 text-xl"></i>
          الإنجازات والجوائز
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 border border-yellow-100">
              <div className="flex items-center gap-3">
                <i className={`bi ${item.icon} text-3xl text-yellow-600`}></i>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                  <p className="text-gray-600 text-xs">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render stats section
  const renderStats = () => {
    const stats = generateRandomStats();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl text-white"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <i className="bi bi-bar-chart-fill text-2xl"></i>
          إحصائيات المصور
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <i className={`bi ${stat.icon} text-2xl mb-1 block`}></i>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render testimonials
  const renderTestimonials = () => {
    const testimonials = generateRandomTestimonials().slice(0, 3);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bi bi-chat-dots-fill text-green-600 text-xl"></i>
          آراء العملاء
        </h3>
        
        <div className="space-y-4">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 border border-green-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-gray-500 text-xs">{item.date}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <i key={star} className={`bi bi-star-fill text-xs ${star <= item.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"{item.comment}"</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render FAQ
  const renderFAQ = () => {
    const faqs = generateRandomFAQ().slice(0, 3);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bi bi-question-circle-fill text-purple-600 text-xl"></i>
          الأسئلة الشائعة
        </h3>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 border border-purple-100">
              <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                <span className="text-purple-500">Q{index + 1}:</span>
                {faq.q}
              </h4>
              <p className="text-gray-600 text-sm pr-6">
                <span className="text-green-500 font-bold">ج: </span>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render certificates
  const renderCertificates = () => {
    const certificates = generateRandomCertificates().slice(0, 3);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bi bi-award-fill text-amber-600 text-xl"></i>
          الشهادات والدورات
        </h3>
        
        <div className="space-y-3">
          {certificates.map((cert, index) => (
            <div key={index} className="bg-white rounded-2xl p-3 border border-amber-100">
              <div className="flex items-center gap-3">
                <i className="bi bi-patch-check-fill text-2xl text-amber-600"></i>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{cert.name}</h4>
                  <p className="text-gray-600 text-xs">{cert.issuer} • {cert.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render details section
  const renderDetailsSection = () => {
    return (
      <div className="space-y-6">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bi bi-person-badge-fill text-blue-600 text-xl"></i>
            معلومات عن المصور
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-base bg-white p-4 rounded-2xl border border-blue-100">
              {photographer.description || "مصور محترف بخبرة واسعة في مجال التصوير الفوتوغرافي للأفراح والمناسبات، يتمتع بمهارات عالية في إخراج أجمل اللحظات بأسلوب فني راقي."}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">{photographer.experience || 8}+</div>
                <div className="text-blue-100 text-sm">سنوات خبرة</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">500+</div>
                <div className="text-green-100 text-sm">عميل سعيد</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">1200+</div>
                <div className="text-purple-100 text-sm">جلسة تصوير</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">15+</div>
                <div className="text-orange-100 text-sm">جائزة وتكريم</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        {renderAchievements()}

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bi bi-lightning-charge-fill text-green-600 text-xl"></i>
            الخدمات المقدمة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(photographer.services || ["تصوير أفراح", "تصوير مناسبات", "تصوير شخصي", "تصوير عائلي", "تصوير خطوبة", "تصوير منتجات"]).map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-4 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-base">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800 mb-1">{service}</h4>
                    <p className="text-gray-600 text-sm">خدمة احترافية متكاملة</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Equipment Section */}
          <div className="mt-6 bg-white rounded-2xl p-4 border border-blue-200">
            <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <i className="bi bi-tools text-blue-600"></i>
              المعدات المستخدمة
            </h4>
            <div className="flex flex-wrap gap-2">
              {(photographer.equipment || ["Canon EOS R5", "Sony A7III", "عدسات L-series", "إضاءة احترافية", "Drone", "Gimbal"]).map((item, index) => (
                <span key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-3 py-2 rounded-xl text-sm border border-blue-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {renderStats()}

        {/* Testimonials */}
        {renderTestimonials()}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-3xl border border-yellow-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                <i className="bi bi-star-fill text-yellow-600 text-xl"></i>
                تقييمات العملاء
              </h3>
              <p className="text-gray-600 text-sm">آراء العملاء السابقين عن جودة العمل</p>
            </div>
            <div className="text-center bg-white p-4 rounded-2xl">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{photographer.rating || 4.8}</div>
              {renderStars(photographer.rating || 4.8)}
              <p className="text-gray-600 text-xs mt-1">بناءً على 157 تقييم</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {(photographer.reviews || generateRandomTestimonials().slice(0, 3)).map((review, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-base font-bold">
                      {review.user ? review.user.charAt(0) : 'ع'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{review.user || 'عميل'}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <i className="bi bi-patch-check-fill text-xs"></i>
                          موثق
                        </span>
                        <span className="text-gray-500 text-xs">{review.date || 'منذ يومين'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating || 5)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">
                  "{review.comment || 'خدمة ممتازة وتعامل راقي، صور رائعة وأنصح بالتعامل معه'}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        {renderFAQ()}

        {/* Certificates */}
        {renderCertificates()}

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bi bi-calendar-week-fill text-purple-600 text-xl"></i>
            مواعيد العمل
          </h3>
          {renderWorkingHours()}
        </motion.div>
      </div>
    );
  };

  // Render packages section
  const renderPackagesSection = () => {
    const hasPackages = photographer.packages && photographer.packages.length > 0;

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
            <i className="bi bi-cash-stack text-purple-600 text-xl"></i>
            اختر الباقة المناسبة لك
          </h3>
          <p className="text-gray-600 text-base">اختر الباقة التي تناسب احتياجاتك وميزانيتك</p>
        </motion.div>
        
        {!hasPackages ? (
          <div className="text-center p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
            <i className="bi bi-briefcase text-6xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد باقات متاحة حالياً</h3>
            <p className="text-gray-600 text-base mb-4">يمكنك التواصل مع المصور للاستفسار عن الأسعار</p>
            <button 
              onClick={() => handleBookPackage()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i className="bi bi-pencil-square ml-2"></i>
              حجز استشارة
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {photographer.packages?.map((pkg, index) => {
                const pkgId = pkg._id || pkg.id || `pkg-${index}`;
                const isSelected = selectedPackage ? selectedPackage._id === pkgId : false;
                
                return (
                  <motion.div
                    key={pkgId}
                    className={`relative rounded-3xl p-6 transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white scale-105 shadow-2xl border-2 border-blue-300'
                        : pkg.popular
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg'
                        : 'bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                        <i className="bi bi-star-fill ml-1"></i>
                        الأكثر طلباً
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>{pkg.name}</h4>
                          <p className={`text-sm leading-relaxed ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>{pkg.description}</p>
                        </div>
                        <button
                          onClick={() => togglePackageSelection({...pkg, _id: pkgId})}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected 
                              ? 'bg-white border-white text-blue-600' 
                              : pkg.popular
                              ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-50'
                              : 'border-gray-300 text-gray-300 hover:border-blue-500 hover:text-blue-500'
                          }`}
                        >
                          {isSelected ? <i className="bi bi-check-lg"></i> : pkg.popular ? <i className="bi bi-star-fill"></i> : ''}
                        </button>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                          {pkg.price.toLocaleString()} <span className="text-sm">جنيه</span>
                        </div>
                        {pkg.originalPrice && (
                          <div className={`text-sm line-through ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                            {pkg.originalPrice.toLocaleString()} جنيه
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>المميزات:</h5>
                        {pkg.features?.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <i className={`bi bi-check-circle-fill text-sm ${isSelected ? 'text-green-300' : 'text-green-500'}`}></i>
                            <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => togglePackageSelection({...pkg, _id: pkgId})}
                          className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                            isSelected
                              ? 'bg-white text-blue-600 hover:bg-gray-100'
                              : pkg.popular
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                          }`}
                        >
                          {isSelected ? <><i className="bi bi-check-lg ml-1"></i>مختارة</> : 'اختيار الباقة'}
                        </button>
                        
                        <button 
                          onClick={() => handleBookPackage({...pkg, _id: pkgId})}
                          className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                            isSelected
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                          }`}
                        >
                          <i className="bi bi-calendar-check ml-1"></i>
                          حجز
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render portfolio section - عرض جميع الصور في معرض واحد
  const renderPortfolioSection = () => {
    const allImages = getAllImages();
    const imagesToShow = showAllImages ? allImages : allImages.slice(0, 8);

    return (
      <div className="space-y-6">
        {/* Gallery Grid */}
        {allImages.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagesToShow.map((image, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => openGalleryLightbox(index)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={image}
                      alt={`معرض الصور ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-white text-center">
                          <p className="font-bold text-sm"><i className="bi bi-search ml-1"></i>عرض الصورة</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs">
                      <i className="bi bi-image ml-1"></i>
                      {index + 1}/{allImages.length}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Show More Button */}
            {allImages.length > 8 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllImages(!showAllImages)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <i className={`bi ${showAllImages ? 'bi-eye-slash' : 'bi-eye'} ml-2`}></i>
                  {showAllImages ? 'عرض صور أقل' : `عرض الكل (${allImages.length} صورة)`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
            <i className="bi bi-images text-7xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد صور متاحة</h3>
            <p className="text-gray-600 text-base mb-4">لم يقم المصور برفع أي صور حتى الآن</p>
            <button
              onClick={() => handleBookPackage()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-2xl font-bold text-base transition-all duration-300"
            >
              <i className="bi bi-pencil-square ml-2"></i>
              حجز استشارة
            </button>
          </div>
        )}
        
        {/* Gallery Summary */}
        {allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-right mb-4 md:mb-0">
                <h4 className="text-lg font-bold text-gray-800 mb-2"><i className="bi bi-bar-chart-steps ml-2"></i>ملخص المعرض</h4>
                <p className="text-gray-600 text-base">إجمالي {allImages.length} صورة</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {allImages.length}
                  </div>
                  <div className="text-gray-600 text-sm"><i className="bi bi-image ml-1"></i>صورة</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-green-600">
                    {photographer.portfolio?.length || 5}
                  </div>
                  <div className="text-gray-600 text-sm"><i className="bi bi-folder ml-1"></i>ألبوم</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {new Set(photographer.portfolio?.map(album => album.category) || []).size || 4}
                  </div>
                  <div className="text-gray-600 text-sm"><i className="bi bi-tag ml-1"></i>فئة</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Render profile sidebar for mobile - محسن جداً
  const renderMobileSidebar = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="bi bi-person-circle text-blue-600"></i>
              صفحة المصور
            </h3>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
            <div className="relative">
              <img 
                src={photographer.profileImage} 
                alt={photographer.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800">{photographer.name}</h2>
              <p className="text-blue-600 font-semibold text-sm">{photographer.specialty}</p>
              <p className="text-gray-500 text-xs mt-1">{photographer.city}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl text-center">
              <i className="bi bi-clock-history text-lg mb-1 block"></i>
              <div className="text-lg font-bold">{photographer.experience || 8}+</div>
              <div className="text-xs">سنوات</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-xl text-center">
              <i className="bi bi-star-fill text-lg mb-1 block"></i>
              <div className="text-lg font-bold">4.8</div>
              <div className="text-xs">تقييم</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-xl text-center">
              <i className="bi bi-people-fill text-lg mb-1 block"></i>
              <div className="text-lg font-bold">500+</div>
              <div className="text-xs">عميل</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">رقم الهاتف</div>
                  <div className="font-bold text-gray-800 text-base">
                    {formatContactInfo(photographer.contact)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">البريد الإلكتروني</div>
                  <div className="font-bold text-gray-800 text-base">
                    {formatContactInfo(photographer.email, true)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white text-xl">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">العنوان</div>
                  <div className="font-bold text-gray-800 text-sm">{photographer.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => {
                handleWhatsAppContact();
                setMobileSidebarOpen(false);
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <i className="bi bi-whatsapp text-xl"></i>
              تواصل واتساب
            </button>

            <button 
              onClick={() => {
                handleBookPackage();
                setMobileSidebarOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <i className="bi bi-pencil-square text-xl"></i>
              حجز استشارة
            </button>

            {selectedPackage && (
              <button 
                onClick={() => {
                  handleBookPackage(selectedPackage);
                  setMobileSidebarOpen(false);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <i className="bi bi-gem text-xl"></i>
                حجز الباقة
              </button>
            )}

            <button 
              onClick={() => {
                setMobileSidebarOpen(false);
                navigate("/photographers");
              }}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <i className="bi bi-camera"></i>
              جميع المصورين
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render Contact Modal
  const renderContactModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        onClick={() => setShowContactModal(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-3xl">
            <h2 className="text-xl font-bold text-gray-800">تواصل مع المصور</h2>
            <button
              onClick={() => setShowContactModal(false)}
              className="text-gray-500 hover:text-gray-700 w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <i className="bi bi-telephone-forward text-6xl text-blue-600 mb-4"></i>
              <h3 className="text-lg font-bold text-gray-800 mb-2">اختر طريقة التواصل</h3>
              <p className="text-gray-600 text-sm">تواصل مباشرة مع {photographer.name}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  handleWhatsAppContact();
                  setShowContactModal(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-whatsapp text-2xl"></i>
                  <div className="text-right">
                    <div className="font-bold text-base">واتساب</div>
                    <div className="text-sm opacity-90">تواصل فوري</div>
                  </div>
                </div>
                <i className="bi bi-arrow-left text-2xl"></i>
              </button>

              <button 
                onClick={() => {
                  window.open(`tel:${photographer.contact}`, '_blank');
                  setShowContactModal(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-telephone-fill text-2xl"></i>
                  <div className="text-right">
                    <div className="font-bold text-base">مكالمة هاتفية</div>
                    <div className="text-sm opacity-90">اتصال مباشر</div>
                  </div>
                </div>
                <i className="bi bi-arrow-left text-2xl"></i>
              </button>

              <button 
                onClick={() => {
                  window.open(`mailto:${photographer.email}`, '_blank');
                  setShowContactModal(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-envelope-fill text-2xl"></i>
                  <div className="text-right">
                    <div className="font-bold text-base">البريد الإلكتروني</div>
                    <div className="text-sm opacity-90">إرسال رسالة</div>
                  </div>
                </div>
                <i className="bi bi-arrow-left text-2xl"></i>
              </button>

              <button 
                onClick={() => {
                  handleBookPackage();
                  setShowContactModal(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-pencil-square text-2xl"></i>
                  <div className="text-right">
                    <div className="font-bold text-base">حجز استشارة</div>
                    <div className="text-sm opacity-90">بدون اختيار باقة</div>
                  </div>
                </div>
                <i className="bi bi-arrow-left text-2xl"></i>
              </button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
              <p className="text-gray-600 text-sm text-center flex items-center justify-center gap-2">
                <i className="bi bi-lightning-charge text-yellow-500"></i>
                سيتم فتح نافذة جديدة للتواصل
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Render Booking Modal
  const renderBookingModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4"
        onClick={() => setBookingModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 rounded-t-3xl">
            <h2 className="text-xl font-bold text-gray-800">
              {bookingPackage ? `حجز ${bookingPackage.name}` : 'حجز استشارة'}
            </h2>
            <button
              onClick={() => setBookingModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <i className="bi bi-calendar-check text-5xl text-green-600 mb-4"></i>
              <h3 className="text-lg font-bold text-gray-800 mb-2">أدخل بياناتك للحجز</h3>
              <p className="text-gray-600 text-sm">
                {bookingPackage 
                  ? `سيتم إرسال طلب حجز باقة ${bookingPackage.name} إلى ${photographer.name}`
                  : `سيتم إرسال طلب استشارة إلى ${photographer.name} للاستفسار عن الباقات المتاحة`}
              </p>
            </div>

            <div className="space-y-4">
              {/* الاسم */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">
                  الاسم كامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  placeholder="أدخل رقم هاتفك"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />
              </div>

              {/* التاريخ */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">
                  التاريخ المطلوب (اختياري)
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />
              </div>

              {/* الوقت */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">
                  الوقت المطلوب (اختياري)
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />
              </div>

              {/* ملاحظات إضافية */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="أي ملاحظات إضافية تريد إضافتها..."
                  rows="3"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-none"
                />
              </div>

              {/* معلومات الباقة إذا كانت محددة */}
              {bookingPackage && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl">
                  <h4 className="font-bold text-gray-800 mb-2">تفاصيل الباقة:</h4>
                  <p className="text-gray-700 text-sm mb-1">{bookingPackage.name}</p>
                  <p className="text-gray-600 text-xs mb-2">{bookingPackage.description}</p>
                  <p className="text-green-600 font-bold text-lg">{bookingPackage.price.toLocaleString()} جنيه</p>
                </div>
              )}

              {/* أزرار الإجراء */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-bold text-base transition-all duration-300"
                >
                  إلغاء
                </button>
                <button
                  onClick={submitBooking}
                  className="py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  إرسال الطلب
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                <span className="text-red-500">*</span> حقول إجبارية
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-bold">جاري تحميل بيانات المصور...</p>
        </div>
      </div>
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md">
          <i className="bi bi-emoji-frown text-7xl text-gray-400 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">المصور غير موجود</h1>
          <p className="text-gray-600 text-base mb-6">{error}</p>
          <button 
            onClick={() => navigate('/photographers')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  const hasMultipleImages = sliderImages.length > 1;
  const allImages = getAllImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 z-40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {renderMobileSidebar()}
          </>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && renderContactModal()}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModalOpen && renderBookingModal()}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl"
            >
              {/* Main Image Slider */}
              <div className="relative h-80 lg:h-96 bg-gray-100">
                {sliderImages.length > 0 ? (
                  <>
                    <img 
                      src={sliderImages[selectedImage]} 
                      alt={`${photographer.name} gallery ${selectedImage + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
                      onClick={() => openGalleryLightbox(selectedImage)}
                    />
                    
                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                        >
                          <i className="bi bi-chevron-right text-2xl"></i>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                        >
                          <i className="bi bi-chevron-left text-2xl"></i>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <i className="bi bi-images"></i>
                        {selectedImage + 1} / {sliderImages.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    لا توجد صور متاحة في المعرض
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex space-x-3 overflow-x-auto pb-1">
                    {sliderImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index 
                            ? 'border-blue-500 scale-105 shadow-lg' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${photographer.name} ${index + 1}`}
                          className="w-20 h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Social Media Section تحت السلايدر مباشرة */}
            {renderSocialMedia()}

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-xl"
            >
              {/* Tabs Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <nav className="flex space-x-1 p-1 overflow-x-auto">
                  {[
                    { id: "portfolio", name: "المعرض", icon: "bi-images" },
                    { id: "packages", name: "الباقات", icon: "bi-cash-stack" },
                    { id: "details", name: "التفاصيل", icon: "bi-info-circle" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-4 border-b-2 font-bold text-base transition-all duration-300 whitespace-nowrap rounded-lg flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white shadow-md'
                          : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-white/70'
                      }`}
                    >
                      <i className={tab.icon}></i>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tabs Content */}
              <div className="p-4 lg:p-6">
                {activeTab === "portfolio" && renderPortfolioSection()}
                {activeTab === "packages" && renderPackagesSection()}
                {activeTab === "details" && renderDetailsSection()}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar (Hidden on Mobile) */}
          <div className="hidden lg:block space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 self-start shadow-xl sticky top-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={photographer.profileImage} 
                    alt={photographer.name}
                    className="w-24 h-24 rounded-3xl object-cover border-2 border-blue-100"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{photographer.name}</h2>
                  <p className="text-blue-600 font-bold text-base">{photographer.specialty}</p>
                  <p className="text-gray-600 text-sm">{photographer.businessName}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                  <span className="font-semibold text-gray-700 text-sm flex items-center gap-1">
                    <i className="bi bi-star-fill text-yellow-500"></i>
                    التقييم:
                  </span>
                  <div className="flex items-center gap-2">
                    {renderStars(photographer.rating || 4.8)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <span className="font-semibold text-gray-700 text-sm flex items-center gap-1">
                    <i className="bi bi-clock-history"></i>
                    الخبرة:
                  </span>
                  <span className="font-bold text-green-600 text-base">{photographer.experience || 8} سنة</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                  <span className="font-semibold text-gray-700 text-sm flex items-center gap-1">
                    <i className="bi bi-geo-alt-fill"></i>
                    المكان:
                  </span>
                  <span className="font-bold text-purple-600 text-sm text-right">{photographer.city}، {photographer.governorate}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleBookPackage()}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <i className="bi bi-pencil-square text-xl"></i>
                  حجز استشارة
                </button>

                <button 
                  onClick={handleWhatsAppContact}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <i className="bi bi-whatsapp text-xl"></i>
                  تواصل واتساب
                </button>

                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <i className="bi bi-telephone-fill"></i>
                  طرق التواصل
                </button>

                {selectedPackage && (
                  <button 
                    onClick={deselectPackage}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    إلغاء اختيار الباقة
                  </button>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="bi bi-telephone-fill text-blue-600"></i>
                معلومات التواصل
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">رقم الهاتف</div>
                    <div className="font-bold text-gray-800 text-base">
                      {formatContactInfo(photographer.contact)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">البريد الإلكتروني</div>
                    <div className="font-bold text-gray-800 text-base">
                      {formatContactInfo(photographer.email, true)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">العنوان</div>
                    <div className="font-bold text-gray-800 text-sm">{photographer.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons for Mobile */}
      <div className="lg:hidden fixed bottom-24 right-6 z-30 flex flex-col gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
        >
          <i className="bi bi-person-circle text-3xl"></i>
        </button>
      </div>

      {/* Booking Buttons at Bottom for Mobile */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-30 grid grid-cols-2 gap-3">
        <button
          onClick={() => handleBookPackage()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <i className="bi bi-pencil-square text-xl"></i>
          استشارة
        </button>

        <button
          onClick={handleWhatsAppContact}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <i className="bi bi-whatsapp text-xl"></i>
          واتساب
        </button>
      </div>

      {/* Photographers Navigation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 left-6 z-30 lg:hidden"
      >
        <button
          onClick={() => navigate("/photographers")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <i className="bi bi-camera"></i>
          المصورين
        </button>
      </motion.div>

      {/* Lightbox for Gallery */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-98 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <i className="bi bi-x-lg text-3xl"></i>
              </button>

              <img 
                src={allImages[lightboxImageIndex] || sliderImages[lightboxImageIndex]} 
                alt={`${photographer.name} gallery ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-xl"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevLightboxImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl"
                  >
                    <i className="bi bi-chevron-right text-2xl"></i>
                  </button>
                  <button
                    onClick={nextLightboxImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl"
                  >
                    <i className="bi bi-chevron-left text-2xl"></i>
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-base font-bold flex items-center gap-2">
                    <i className="bi bi-images"></i>
                    {lightboxImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Album Modal */}
      <AnimatePresence>
        {albumModalOpen && selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={closeAlbumModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-lg font-bold text-gray-800">{selectedAlbum.title}</h2>
                <button
                  onClick={closeAlbumModal}
                  className="text-gray-500 hover:text-gray-700 w-10 h-10 rounded-full hover:bg-white flex items-center justify-center"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  {selectedAlbum.images && selectedAlbum.images.length > 0 && (
                    <div className="relative">
                      <div className="relative h-96 bg-black rounded-xl overflow-hidden">
                        <img 
                          src={selectedAlbum.images[albumImageIndex]} 
                          alt={`${selectedAlbum.title} - ${albumImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        
                        {selectedAlbum.images.length > 1 && (
                          <>
                            <button
                              onClick={prevAlbumImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center"
                            >
                              <i className="bi bi-chevron-right text-2xl"></i>
                            </button>
                            <button
                              onClick={nextAlbumImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center"
                            >
                              <i className="bi bi-chevron-left text-2xl"></i>
                            </button>
                          </>
                        )}

                        {selectedAlbum.images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                            <i className="bi bi-images"></i>
                            {albumImageIndex + 1} / {selectedAlbum.images.length}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="text-base font-bold text-gray-800 mb-2">{selectedAlbum.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{selectedAlbum.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {selectedAlbum.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {selectedAlbum.images?.length || 0} صورة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographerDetailsPage;