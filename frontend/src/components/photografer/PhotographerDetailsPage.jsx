import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  
  // دالة محسنة لاختيار صور عشوائية من Unsplash
  const getRandomSliderImages = (portfolio, count = 6) => {
    // صور Unsplash عالية الجودة للمصورين
    const defaultImages = [
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w-1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&auto=format&fit=crop"
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
        const response = await fetch(`https://bookera-production-2d16.up.railway.app/api/photographers/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setPhotographer(data);
          
          // جمع كل الصور من جميع الألبومات لعرضها في المعرض
          const allImages = data.portfolio?.flatMap(album => 
            album.images || []
          ) || [];
          
          // استخدام الصور الحقيقية أو صور Unsplash
          const randomImages = allImages.length > 0 
            ? allImages.slice(0, 8) // عرض أول 8 صور
            : getRandomSliderImages([], 8);
            
          setSliderImages(randomImages);
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

  const handleBookPhotographer = () => {
    if (!selectedPackage) {
      setShowContactModal(true);
      return;
    }
    
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحباً،
أنا تواصلت معك من خلال موقع بوكيرا وحابب أستفسر عن حجز جلسة تصوير.

الاسم: ${photographer.name}
التخصص: ${photographer.specialty}
الباقة المختارة: ${selectedPackage.name}
السعر: ${selectedPackage.price.toLocaleString()} جنيه

ممكن تفاصيل أكثر عن الباقة والمواعيد المتاحة؟
شكراً لحضرتك 🌸`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConsultation = () => {
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحباً،
أنا تواصلت معك من خلال موقع بوكيرا وحابب أستفيد من الاستشارة المجانية للتصوير.

الاسم: ${photographer.name}
التخصص: ${photographer.specialty}

أرغب في معرفة المزيد عن الخدمات والتفاصيل.
شكراً لحضرتك 🌸`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // إصلاح مشكلة تحديد الباقات
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
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm mr-1">({rating})</span>
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
      <div className="space-y-4">
        {Object.entries(workingHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <span className="text-gray-700 font-medium text-base flex items-center gap-2">
              {day === "friday" ? "🎉" : "📅"}
              {days[day]}:
            </span>
            <span className={`font-semibold text-base ${
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

  // Render social media section
  const renderSocialMedia = () => {
    const socialMedia = photographer?.socialMedia;
    
    if (!socialMedia || (!socialMedia.instagram && !socialMedia.facebook && !socialMedia.website)) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-800">🌐 وسائل التواصل الاجتماعي</h3>
          <button
            onClick={() => setSocialMediaVisible(!socialMediaVisible)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {socialMediaVisible ? 'إخفاء' : 'إظهار'}
          </button>
        </div>
        
        {socialMediaVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            {socialMedia.instagram && (
              <button
                onClick={() => window.open(socialMedia.instagram.startsWith('http') ? socialMedia.instagram : `https://${socialMedia.instagram}`, '_blank')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-lg border border-pink-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <span>📷</span>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold text-gray-800 text-sm">انستجرام</div>
                  <div className="text-gray-600 text-xs truncate">
                    اضغط للزيارة
                  </div>
                </div>
              </button>
            )}

            {socialMedia.facebook && (
              <button
                onClick={() => window.open(socialMedia.facebook.startsWith('http') ? socialMedia.facebook : `https://${socialMedia.facebook}`, '_blank')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 rounded-lg border border-blue-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <span>📘</span>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold text-gray-800 text-sm">فيسبوك</div>
                  <div className="text-gray-600 text-xs truncate">
                    اضغط للزيارة
                  </div>
                </div>
              </button>
            )}

            {socialMedia.website && (
              <button
                onClick={() => window.open(socialMedia.website.startsWith('http') ? socialMedia.website : `https://${socialMedia.website}`, '_blank')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg border border-green-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <span>🌐</span>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold text-gray-800 text-sm">الموقع الإلكتروني</div>
                  <div className="text-gray-600 text-xs truncate">
                    اضغط للزيارة
                  </div>
                </div>
              </button>
            )}
          </motion.div>
        )}
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
            <span className="bg-blue-500 text-white p-2 rounded-2xl">👤</span>
            معلومات عن المصور
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-base bg-white p-4 rounded-2xl border border-blue-100">
              {photographer.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">{photographer.experience}+</div>
                <div className="text-blue-100 text-sm">سنوات خبرة</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">100+</div>
                <div className="text-green-100 text-sm">عميل سعيد</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">500+</div>
                <div className="text-purple-100 text-sm">جلسة تصوير</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl text-center">
                <div className="text-xl font-bold mb-1">50+</div>
                <div className="text-orange-100 text-sm">جائزة وتكريم</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white p-2 rounded-2xl">⚡</span>
            الخدمات المقدمة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photographer.services?.map((service, index) => (
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
              <span className="text-blue-500">🔧</span>
              المعدات المستخدمة
            </h4>
            <div className="flex flex-wrap gap-2">
              {photographer.equipment?.map((item, index) => (
                <span key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-3 py-2 rounded-xl text-sm border border-blue-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-3xl border border-yellow-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span className="bg-yellow-500 text-white p-2 rounded-2xl">⭐</span>
                تقييمات العملاء
              </h3>
              <p className="text-gray-600 text-sm">آراء العملاء السابقين عن جودة العمل</p>
            </div>
            <div className="text-center bg-white p-4 rounded-2xl">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{photographer.rating}</div>
              {renderStars(photographer.rating)}
              <p className="text-gray-600 text-xs mt-1">بناءً على {photographer.reviews?.length || 0} تقييم</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {photographer.reviews?.slice(0, 3).map((review, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-base font-bold">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{review.user}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {review.verified && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            ✓ موثق
                          </span>
                        )}
                        <span className="text-gray-500 text-xs">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
            
            {photographer.reviews?.length > 3 && (
              <div className="text-center mt-6">
                <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">
                  عرض المزيد من التقييمات ({photographer.reviews.length - 3}+) →
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-purple-500 text-white p-2 rounded-2xl">📅</span>
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
            <span className="bg-purple-500 text-white p-2 rounded-2xl">💰</span>
            اختر الباقة المناسبة لك
          </h3>
          <p className="text-gray-600 text-base">اختر الباقة التي تناسب احتياجاتك وميزانيتك</p>
        </motion.div>
        
        {!hasPackages ? (
          <div className="text-center p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد باقات متاحة حالياً</h3>
            <p className="text-gray-600 text-base mb-4">يمكنك التواصل مع المصور للاستفسار عن الأسعار</p>
            <button 
              onClick={() => setShowContactModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-base transition-all duration-300"
            >
              التواصل للاستفسار
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {photographer.packages?.map((pkg, index) => {
              const pkgId = pkg._id || pkg.id || `pkg-${index}`;
              const isSelected = selectedPackage ? selectedPackage._id === pkgId : false;
              
              return (
                <motion.div
                  key={pkgId}
                  className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white scale-105'
                      : pkg.popular
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                  onClick={() => togglePackageSelection({...pkg, _id: pkgId})}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                      ⭐ الأكثر طلباً
                    </div>
                  )}
                  
                  <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-white border-white' 
                      : pkg.popular
                      ? 'border-yellow-400'
                      : 'border-gray-300'
                  }`}>
                    {isSelected ? (
                      <span className="text-blue-600 text-base font-bold">✓</span>
                    ) : pkg.popular ? (
                      <span className="text-yellow-400 text-sm">★</span>
                    ) : null}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>{pkg.name}</h4>
                      <p className={`text-sm leading-relaxed ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>{pkg.description}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                        {pkg.price.toLocaleString()} جنيه
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
                          <span className={`${isSelected ? 'text-green-300' : 'text-green-500'} text-base`}>✓</span>
                          <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                        isSelected
                          ? 'bg-white text-blue-600 hover:bg-gray-100'
                          : pkg.popular
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      }`}
                    >
                      {isSelected ? '✓ مختارة' : 'اختيار الباقة'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render portfolio section - عرض جميع الصور في معرض واحد
  const renderPortfolioSection = () => {
    // جمع جميع الصور من الألبومات
    const allImages = photographer.portfolio?.flatMap(album => 
      album.images || []
    ) || [];

    return (
      <div className="space-y-6">
        {/* Gallery Grid */}
        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((image, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div 
                  className="relative h-48 cursor-pointer overflow-hidden"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`معرض الصور ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white text-center">
                        <p className="font-bold text-xs">👁️ عرض الصورة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
            <div className="text-7xl mb-4">📷</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد صور متاحة</h3>
            <p className="text-gray-600 text-base">لم يقم المصور برفع أي صور حتى الآن</p>
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
                <h4 className="text-lg font-bold text-gray-800 mb-2">📊 ملخص المعرض</h4>
                <p className="text-gray-600 text-base">إجمالي {allImages.length} صورة</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {allImages.length}
                  </div>
                  <div className="text-gray-600 text-sm">صورة</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-green-600">
                    {photographer.portfolio?.length || 0}
                  </div>
                  <div className="text-gray-600 text-sm">ألبوم</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {new Set(photographer.portfolio?.map(album => album.category) || []).size}
                  </div>
                  <div className="text-gray-600 text-sm">فئة</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Render profile sidebar for mobile
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
            <h3 className="text-lg font-bold text-gray-800">معلومات التواصل</h3>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
            <div className="relative">
              <img 
                src={photographer.profileImage} 
                alt={photographer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-gray-800">{photographer.name}</h2>
              <p className="text-blue-600 font-semibold text-sm">{photographer.specialty}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                  📞
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">رقم الهاتف</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {formatContactInfo(photographer.contact)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                  📧
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">البريد الإلكتروني</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {formatContactInfo(photographer.email, true)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-500 rounded-2xl flex items-center justify-center text-white">
                  📍
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">العنوان</div>
                  <div className="font-bold text-gray-800 text-sm">{photographer.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => {
                handleConsultation();
                setMobileSidebarOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-2xl font-bold text-base"
            >
              💬 تواصل للاستشارة
            </button>

            {selectedPackage && (
              <button 
                onClick={() => {
                  handleBookPhotographer();
                  setMobileSidebarOpen(false);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-2xl font-bold text-base"
              >
                💎 احجز الآن
              </button>
            )}
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
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
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
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-xl font-bold text-gray-800">تواصل مع المصور</h2>
            <button
              onClick={() => setShowContactModal(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">اختر طريقة التواصل</h3>
              <p className="text-gray-600 text-sm">تواصل مباشرة مع {photographer.name}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  handleConsultation();
                  setShowContactModal(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💬</div>
                  <div className="text-right">
                    <div className="font-bold">استشارة مجانية</div>
                    <div className="text-sm opacity-90">عبر واتساب</div>
                  </div>
                </div>
                <div className="text-xl">→</div>
              </button>

              <button 
                onClick={() => {
                  if (selectedPackage) {
                    handleBookPhotographer();
                  }
                  setShowContactModal(false);
                }}
                disabled={!selectedPackage}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  selectedPackage
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💎</div>
                  <div className="text-right">
                    <div className="font-bold">حجز الباقة</div>
                    <div className="text-sm opacity-90">عبر واتساب</div>
                  </div>
                </div>
                <div className="text-xl">→</div>
              </button>

              <button 
                onClick={() => window.open(`mailto:${photographer.email}`, '_blank')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📧</div>
                  <div className="text-right">
                    <div className="font-bold">البريد الإلكتروني</div>
                    <div className="text-sm opacity-90">إرسال رسالة</div>
                  </div>
                </div>
                <div className="text-xl">→</div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 text-sm text-center">
                ⚡ سيتم فتح نافذة جديدة للتواصل
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-base font-bold">جاري تحميل بيانات المصور...</p>
        </div>
      </div>
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-xl font-bold text-gray-800 mb-3">المصور غير موجود</h1>
          <p className="text-gray-600 text-base mb-6">{error}</p>
          <button 
            onClick={() => navigate('/photographers')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-base"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  const hasMultipleImages = sliderImages.length > 1;

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
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                      onClick={() => openLightbox(selectedImage)}
                    />
                    
                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                        >
                          →
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
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
                            ? 'border-blue-500 scale-105' 
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

            {/* Price Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white rounded-3xl p-6 text-center"
            >
              <div className="text-3xl font-bold mb-2">
                {selectedPackage ? selectedPackage.price.toLocaleString() : parseInt(photographer.price || 0).toLocaleString()} جنيه
              </div>
              <div className="text-gray-300 text-base">
                {selectedPackage ? `سعر ${selectedPackage.name}` : 'يبدأ السعر من'}
              </div>
              {selectedPackage && selectedPackage.originalPrice && (
                <div className="text-gray-400 text-sm line-through mt-2">
                  {selectedPackage.originalPrice.toLocaleString()} جنيه
                </div>
              )}
            </motion.div>

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
                    { id: "portfolio", name: "المعرض", icon: "🖼️" },
                    { id: "packages", name: "الباقات", icon: "💰" },
                    { id: "details", name: "التفاصيل", icon: "📋" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-4 border-b-2 font-bold text-base transition-all duration-300 whitespace-nowrap rounded-lg ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white'
                          : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-white/70'
                      }`}
                    >
                      <span className="ml-2">{tab.icon}</span>
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
              className="bg-white rounded-3xl border border-gray-200 p-6 self-start shadow-xl"
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
                  <span className="font-semibold text-gray-700 text-sm">التقييم:</span>
                  <div className="flex items-center gap-2">
                    {renderStars(photographer.rating)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                  <span className="font-semibold text-gray-700 text-sm">الخبرة:</span>
                  <span className="font-bold text-green-600 text-base">{photographer.experience} سنة</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                  <span className="font-semibold text-gray-700 text-sm">المكان:</span>
                  <span className="font-bold text-purple-600 text-sm text-right">{photographer.city}، {photographer.governorate}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>💬</span>
                  تواصل مع المصور
                </button>

                {selectedPackage && (
                  <button 
                    onClick={deselectPackage}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2 rounded-2xl font-bold text-sm transition-all duration-300"
                  >
                    🔄 إلغاء اختيار الباقة
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
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-2xl">📞</span>
                معلومات التواصل
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                    📞
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
                    📧
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
                    📍
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">العنوان</div>
                    <div className="font-bold text-gray-800 text-sm">{photographer.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Section */}
            {renderSocialMedia()}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Contact Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
        >
          <span className="text-xl">💬</span>
        </button>
      </div>

      {/* Contact Button at Bottom */}
      <div className="lg:hidden fixed bottom-6 left-6 z-30">
        <button
          onClick={() => setShowContactModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold text-base shadow-xl flex items-center gap-2"
        >
          <span>📞</span>
          تواصل
        </button>
      </div>

      {/* Photographers Navigation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 right-6 z-30 lg:hidden"
      >
        <button
          onClick={() => navigate("/photographers")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2"
        >
          <span>📸</span>
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
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 text-2xl"
              >
                ✕
              </button>

              <img 
                src={sliderImages[lightboxImageIndex]} 
                alt={`${photographer.name} gallery ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-[95vh] object-contain rounded-xl"
              />

              {sliderImages.length > 1 && (
                <>
                  <button
                    onClick={prevLightboxImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextLightboxImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    →
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {lightboxImageIndex + 1} / {sliderImages.length}
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
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  {selectedAlbum.images && selectedAlbum.images.length > 0 && (
                    <div className="relative">
                      <div className="relative h-64 bg-black rounded-xl overflow-hidden">
                        <img 
                          src={selectedAlbum.images[albumImageIndex]} 
                          alt={`${selectedAlbum.title} - ${albumImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        
                        {selectedAlbum.images.length > 1 && (
                          <>
                            <button
                              onClick={prevAlbumImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center"
                            >
                              ←
                            </button>
                            <button
                              onClick={nextAlbumImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center"
                            >
                              →
                            </button>
                          </>
                        )}

                        {selectedAlbum.images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
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
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
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