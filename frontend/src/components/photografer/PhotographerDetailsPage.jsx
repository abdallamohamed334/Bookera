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

  // دالة محسنة لاختيار صور عشوائية
  const getRandomSliderImages = (portfolio, count = 4) => {
    if (!portfolio || portfolio.length === 0) {
      return [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800"
      ];
    }
    
    const allImages = portfolio.flatMap(album => 
      album.images && album.images.length > 0 ? album.images : []
    );
    
    if (allImages.length === 0) {
      return [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
      ];
    }
    
    if (allImages.length <= count) return allImages;
    
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // دالة لتنظيف وإعداد رقم الهاتف للواتساب
  const prepareWhatsAppNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    
    // إزالة أي رموز غير رقمية
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // إزالة أي أصفار في البداية
    cleanNumber = cleanNumber.replace(/^0+/, '');
    
    // التأكد من أن الرقم يبدأ بـ 20 (كود مصر)
    if (!cleanNumber.startsWith('20')) {
      cleanNumber = '20' + cleanNumber;
    }
    
    return cleanNumber;
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
        console.log('🔄 جاري البحث عن المصور بالID:', id);

        // جلب البيانات من الـ API فقط
        console.log('🔍 جاري البحث في الـ API...');
        const response = await fetch(`https://bookera-production-25ec.up.railway.app/api/photographers/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم جلب بيانات المصور من API:', data);
          setPhotographer(data);
          
          const randomImages = getRandomSliderImages(data.portfolio, 4);
          setSliderImages(randomImages);
          setSelectedPackage(null);
        } else {
          throw new Error('المصور غير موجود');
        }
      } catch (err) {
        console.error('❌ خطأ:', err.message);
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
      alert('يرجى اختيار باقة أولاً');
      return;
    }
    
    // إصلاح رابط الواتساب - استخدام الرقم مع كود الدولة
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحبا، أنا مهتم بالحجز للتصوير\nالاسم: ${photographer.name}\nالتخصص: ${photographer.specialty}\nالباقة: ${selectedPackage.name}\nالسعر: ${selectedPackage.price.toLocaleString()} جنيه\nممكن التفاصيل والمواعيد المتاحة؟`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConsultation = () => {
    // إصلاح رابط الواتساب - استخدام الرقم مع كود الدولة
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحبا، أنا مهتم بالاستشارة المجانية للتصوير\nالاسم: ${photographer.name}\nالتخصص: ${photographer.specialty}\nأرغب في معرفة المزيد عن الخدمات والتفاصيل`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const togglePackageSelection = (pkg) => {
    const isSamePackage = selectedPackage && selectedPackage.id === pkg.id;
    
    if (isSamePackage) {
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

  // دالة لعرض الألبوم في المودال
  const renderAlbumModalContent = () => {
    if (!selectedAlbum) return null;

    const hasImages = selectedAlbum.images && selectedAlbum.images.length > 0;
    const hasVideos = selectedAlbum.videos && selectedAlbum.videos.length > 0;

    return (
      <div className="space-y-6">
        {/* السلايدر الرئيسي */}
        {hasImages && (
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] bg-black rounded-2xl overflow-hidden">
              <img 
                src={selectedAlbum.images[albumImageIndex]} 
                alt={`${selectedAlbum.title} - ${albumImageIndex + 1}`}
                className="w-full h-full object-contain transition-opacity duration-500"
              />
              
              {/* أسهم التنقل */}
              {selectedAlbum.images.length > 1 && (
                <>
                  <button
                    onClick={prevAlbumImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextAlbumImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    →
                  </button>
                </>
              )}

              {/* عداد الصور */}
              {selectedAlbum.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {albumImageIndex + 1} / {selectedAlbum.images.length}
                </div>
              )}
            </div>

            {/* الثمبنيلز */}
            {selectedAlbum.images.length > 1 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {selectedAlbum.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setAlbumImageIndex(index)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        albumImageIndex === index 
                          ? 'border-blue-500 scale-105' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${selectedAlbum.title} ${index + 1}`}
                        className="w-20 h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* معلومات الألبوم */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedAlbum.title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">{selectedAlbum.description}</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {selectedAlbum.category}
            </span>
            <span className="text-gray-500 text-sm">
              {selectedAlbum.images?.length || 0} صورة
            </span>
            {hasVideos && (
              <span className="text-gray-500 text-sm">
                {selectedAlbum.videos.length} فيديو
              </span>
            )}
          </div>
        </div>

        {/* الفيديوهات */}
        {hasVideos && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎥</span>
              الفيديوهات ({selectedAlbum.videos.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedAlbum.videos.map((video, index) => (
                <div key={index} className="bg-gray-100 rounded-xl overflow-hidden">
                  <video
                    controls
                    poster={video.thumbnail}
                    className="w-full h-48 object-cover"
                  >
                    <source src={video.url} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                  <div className="p-3">
                    <p className="font-medium text-gray-800">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
    // مواعيد العمل الافتراضية للمصورين
    const defaultWorkingHours = {
      "saturday": "10:00 ص - 10:00 م",
      "sunday": "10:00 ص - 10:00 م",
      "monday": "10:00 ص - 10:00 م", 
      "tuesday": "10:00 ص - 10:00 م",
      "wednesday": "10:00 ص - 10:00 م",
      "thursday": "10:00 ص - 10:00 م",
      "friday": "11:00 ص - 6:00 م"
    };

    // استخدام المواعيد من البيانات إذا كانت موجودة، وإلا استخدام الافتراضية
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
          <div key={day} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <span className="text-gray-700 font-medium text-lg flex items-center gap-2">
              {day === "friday" ? "🎉" : "📅"}
              {days[day]}:
            </span>
            <span className={`font-bold text-lg ${
              hours.includes("مغلق") || hours.includes("إجازة") 
                ? "text-red-600" 
                : "text-blue-600"
            }`}>
              {hours}
            </span>
          </div>
        ))}
        
        {/* ملاحظة */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm text-center">
            ⚠️ المواعيد قابلة للتعديل حسب طلب العميل وتوافر المصور
          </p>
        </div>
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
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">🌐 وسائل التواصل الاجتماعي</h3>
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
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {socialMedia.instagram && (
              <button
                onClick={() => window.open(socialMedia.instagram.startsWith('http') ? socialMedia.instagram : `https://${socialMedia.instagram}`, '_blank')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-lg border border-pink-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span>📷</span>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold text-gray-800">انستجرام</div>
                  <div className="text-gray-600 text-sm truncate">
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
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span>📘</span>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold text-gray-800">فيسبوك</div>
                  <div className="text-gray-600 text-sm truncate">
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
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span>🌐</span>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold text-gray-800">الموقع الإلكتروني</div>
                  <div className="text-gray-600 text-sm truncate">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">جاري تحميل بيانات المصور...</p>
        </div>
      </div>
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">المصور غير موجود</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/photographers')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  const hasMultipleImages = sliderImages.length > 1;
  const hasPackages = photographer.packages && photographer.packages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">
                {photographer.businessName}
              </h1>
              <p className="text-gray-600 text-sm">مصور محترف متخصص في {photographer.specialty}</p>
            </div>
            
            <button
              onClick={() => {
                const shareUrl = window.location.href;
                navigator.clipboard.writeText(shareUrl);
                alert('تم نسخ رابط المصور!');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors duration-200"
            >
              مشاركة
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* Main Image Slider */}
              <div className="relative h-96 lg:h-[500px] bg-gray-100">
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
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        >
                          →
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImage + 1} / {sliderImages.length}
                      </div>
                    )}

                    {/* Auto Slide Toggle */}
                    {hasMultipleImages && (
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => setAutoSlide(!autoSlide)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            autoSlide 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-gray-600 hover:bg-gray-700 text-white'
                          }`}
                        >
                          {autoSlide ? '⏸️' : '▶️'}
                        </button>
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      🎰 عرض عشوائي من الأعمال
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    لا توجد صور متاحة في المعرض
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {sliderImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
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
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-2xl p-6 text-center shadow-xl"
            >
              <div className="text-3xl font-bold mb-2">
                {selectedPackage ? selectedPackage.price.toLocaleString() : parseInt(photographer.price || 0).toLocaleString()} جنيه
              </div>
              <div className="text-gray-300">
                {selectedPackage ? `سعر ${selectedPackage.name}` : 'يبدأ السعر من'}
              </div>
              {selectedPackage && selectedPackage.originalPrice && (
                <div className="text-gray-400 text-sm line-through mt-1">
                  {selectedPackage.originalPrice.toLocaleString()} جنيه
                </div>
              )}
            </motion.div>

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              {/* Tabs Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <nav className="flex space-x-6 px-4 overflow-x-auto">
                  {[
                    { id: "portfolio", name: "المعرض", icon: "🖼️" },
                    { id: "about", name: "عن المصور", icon: "👤" },
                    { id: "services", name: "الخدمات", icon: "⚡" },
                    { id: "reviews", name: "التقييمات", icon: "⭐" },
                    { id: "packages", name: "الباقات", icon: "💰" },
                    { id: "schedule", name: "المواعيد", icon: "📅" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white shadow-sm rounded-t-lg'
                          : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-white/50'
                      }`}
                    >
                      <span className="ml-2 text-lg">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tabs Content */}
              <div className="p-6">
                {activeTab === "portfolio" && (
                  <div className="space-y-8">
                    {/* Albums Grid - تصميم جديد */}
                    {photographer.portfolio && photographer.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photographer.portfolio.map((album, index) => (
                          <motion.div
                            key={album._id || index}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-blue-300"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                          >
                            {/* Album Cover */}
                            <div 
                              className="relative h-64 cursor-pointer overflow-hidden"
                              onClick={() => openAlbumModal(album)}
                            >
                              <img
                                src={album.coverImage || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800"}
                                alt={album.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              
                              {/* Overlay Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="text-white text-center">
                                    <div className="text-3xl mb-2">👁️</div>
                                    <p className="font-bold text-sm">عرض الألبوم</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Quick Info Badge */}
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                                <span className="text-blue-600 font-bold text-sm">
                                  {album.images?.length || 0} صورة
                                </span>
                              </div>
                              
                              {/* Category Badge */}
                              <div className="absolute top-3 left-3">
                                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                  {album.category}
                                </span>
                              </div>
                            </div>
                            
                            {/* Album Info */}
                            <div className="p-5">
                              <h3 className="text-xl font-bold text-gray-800 mb-3 truncate">
                                {album.title}
                              </h3>
                              
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
                                {album.description}
                              </p>
                              
                              {/* Stats */}
                              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                  {album.videos && album.videos.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-red-500">🎥</span>
                                      <span className="text-gray-600 text-xs">{album.videos.length}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <span className="text-blue-500">🖼️</span>
                                    <span className="text-gray-600 text-xs">{album.images?.length || 0}</span>
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={() => openAlbumModal(album)}
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  استعراض
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
                        <div className="text-7xl mb-6">📷</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">لا توجد ألبومات متاحة</h3>
                        <p className="text-gray-600 text-lg">لم يقم المصور برفع أي ألبومات حتى الآن</p>
                        <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg">
                          ← العودة للمعرض
                        </button>
                      </div>
                    )}
                    
                    {/* Albums Summary */}
                    {photographer.portfolio && photographer.portfolio.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                          <div className="text-center md:text-right mb-4 md:mb-0">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">📊 ملخص الألبومات</h4>
                            <p className="text-gray-600">إجمالي {photographer.portfolio.length} ألبوم</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                              <div className="text-2xl font-bold text-blue-600">
                                {photographer.portfolio.reduce((total, album) => total + (album.images?.length || 0), 0)}
                              </div>
                              <div className="text-gray-600 text-sm">صورة</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                              <div className="text-2xl font-bold text-red-600">
                                {photographer.portfolio.reduce((total, album) => total + (album.videos?.length || 0), 0)}
                              </div>
                              <div className="text-gray-600 text-sm">فيديو</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                              <div className="text-2xl font-bold text-green-600">
                                {new Set(photographer.portfolio.map(album => album.category)).size}
                              </div>
                              <div className="text-gray-600 text-sm">فئة</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                              <div className="text-2xl font-bold text-purple-600">
                                {photographer.portfolio.length}
                              </div>
                              <div className="text-gray-600 text-sm">ألبوم</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📖</span>
                        السيرة الذاتية
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{photographer.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">{photographer.experience}+</div>
                        <div className="text-blue-100 text-sm">سنوات خبرة</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">100+</div>
                        <div className="text-green-100 text-sm">عميل سعيد</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">500+</div>
                        <div className="text-purple-100 text-sm">جلسة تصوير</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">50+</div>
                        <div className="text-orange-100 text-sm">جائزة وتكريم</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🎯</span>
                        الخدمات المقدمة
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {photographer.services?.map((service, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700 font-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🔧</span>
                        المعدات المستخدمة
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {photographer.equipment?.map((item, index) => (
                          <span key={index} className="bg-white text-blue-700 px-4 py-2 rounded-xl text-sm border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-yellow-600 mb-2">{photographer.rating}</div>
                          {renderStars(photographer.rating)}
                          <p className="text-gray-600 mt-2">بناءً على {photographer.reviews?.length || 0} تقييم</p>
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {photographer.reviews?.map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg">{review.user}</h4>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit mt-1">
                                    ✓ موثق
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-lg leading-relaxed">{review.comment}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "packages" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span>💰</span>
                        اختر الباقة المناسبة لك
                      </h3>
                      <p className="text-gray-600 text-lg">اختر الباقة التي تناسب احتياجاتك وميزانيتك</p>
                    </div>
                    
                    {!hasPackages ? (
                      <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="text-6xl mb-4">💼</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد باقات متاحة حالياً</h3>
                        <p className="text-gray-600">يمكنك التواصل مع المصور للاستفسار عن الأسعار</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {photographer.packages?.map((pkg) => {
                          const isSelected = selectedPackage ? selectedPackage.id === pkg.id : false;
                          
                          return (
                            <motion.div
                              key={pkg.id}
                              className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer relative bg-white ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-xl scale-105'
                                  : pkg.popular
                                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 hover:border-yellow-500'
                                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                              }`}
                              onClick={() => togglePackageSelection(pkg)}
                              whileHover={{ scale: 1.02 }}
                            >
                              {/* Badge for popular package */}
                              {pkg.popular && (
                                <div className="absolute -top-3 left-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                  ⭐ الأكثر طلباً
                                </div>
                              )}
                              
                              {/* Selection indicator */}
                              <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-blue-500 border-blue-500' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <span className="text-white text-sm">✓</span>
                                )}
                              </div>

                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h4>
                                  <p className="text-gray-600 text-lg leading-relaxed">{pkg.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-3xl font-bold text-blue-600">{pkg.price.toLocaleString()} جنيه</div>
                                  {pkg.originalPrice && (
                                    <div className="text-gray-400 text-lg line-through mt-1">{pkg.originalPrice.toLocaleString()} جنيه</div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3 mt-6">
                                {pkg.features?.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <span className="text-green-500 text-lg">✓</span>
                                    <span className="text-gray-700 text-lg">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📅</span>
                        مواعيد العمل
                      </h3>
                      {renderWorkingHours()}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 self-start shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={photographer.profileImage} 
                    alt={photographer.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{photographer.name}</h2>
                  <p className="text-blue-600 font-semibold">{photographer.specialty}</p>
                  <p className="text-gray-600 text-sm">{photographer.businessName}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <span className="font-semibold text-gray-700">التقييم:</span>
                  <div className="flex items-center gap-2">
                    {renderStars(photographer.rating)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <span className="font-semibold text-gray-700">الخبرة:</span>
                  <span className="font-bold text-green-600 text-lg">{photographer.experience} سنة</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <span className="font-semibold text-gray-700">المكان:</span>
                  <span className="font-bold text-purple-600 text-sm text-left">{photographer.city}، {photographer.governorate}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleBookPhotographer}
                  disabled={!selectedPackage}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                    selectedPackage
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>💎</span>
                  {selectedPackage ? 'احجز الآن' : 'اختر باقة أولاً'}
                </button>

                <button 
                  onClick={handleConsultation}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>💬</span>
                  استشارة مجانية
                </button>

                {selectedPackage && (
                  <button 
                    onClick={deselectPackage}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
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
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📞</span>
                معلومات التواصل
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    📞
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">التليفون</div>
                    <div className="font-bold text-gray-800 text-lg">{photographer.contact}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    📧
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">الإيميل</div>
                    <div className="font-bold text-gray-800 text-lg">{photographer.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    📍
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">العنوان</div>
                    <div className="font-bold text-gray-800 text-sm leading-relaxed">{photographer.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Section */}
            {renderSocialMedia()}
          </div>
        </div>
      </div>

      {/* Lightbox for Gallery */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
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
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                ✕
              </button>

              <img 
                src={sliderImages[lightboxImageIndex]} 
                alt={`${photographer.name} gallery ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-[95vh] object-contain rounded-lg"
              />

              {sliderImages.length > 1 && (
                <>
                  <button
                    onClick={prevLightboxImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextLightboxImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  >
                    →
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
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
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeAlbumModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-2xl font-bold text-gray-800">{selectedAlbum.title}</h2>
                <button
                  onClick={closeAlbumModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {renderAlbumModalContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographerDetailsPage;