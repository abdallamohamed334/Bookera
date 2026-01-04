import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  // الكشف عن حجم الشاشة مع معالجة الأخطاء
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // معالجة حالة SSR
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, []);

  // التبديل التلقائي للصور مع معالجة آمنة
  useEffect(() => {
    // إنشاء صور افتراضية آمنة
    const safeImages = getSafeImages();
    
    if (isHovering && safeImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === safeImages.length - 1 ? 0 : prev + 1
        );
      }, 4000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering]);

  // الحصول على صور آمنة مع fallback
  const getSafeImages = () => {
    try {
      if (!photographer) return [];
      
      // محاولة الحصول من portfolio
      const portfolioImages = photographer.portfolio?.filter(album => album?.coverImage)?.map(album => album.coverImage) || [];
      
      // محاولة الحصول من profileImage
      const profileImage = photographer.profileImage ? [photographer.profileImage] : [];
      
      // دمج مع fallback
      const allImages = [...portfolioImages, ...profileImage];
      
      return allImages.length > 0 
        ? allImages 
        : ["https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"];
    } catch (error) {
      console.error("Error getting images:", error);
      return ["https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"];
    }
  };

  const handleCardClick = () => {
    if (onPhotographerClick && photographer) {
      onPhotographerClick(photographer);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    try {
      if (!photographer) return;

      const photographerId = photographer.id || photographer._id || "unknown";
      const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/photographer/${photographerId}`
        : `https://example.com/photographer/${photographerId}`;
      
      const shareText = `📸 اكتشف أعمال ${photographer.name || "مصور"} - ${photographer.specialty || "تصوير"} في ${photographer.city || ""}`;

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: photographer.name || "مصور",
          text: shareText,
          url: shareUrl,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('✅ تم نسخ رابط الفوتوغرافر إلى الحافظة!');
      } else {
        // Fallback للـ clipboard
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ تم نسخ رابط الفوتوغرافر إلى الحافظة!');
      }
    } catch (err) {
      console.error("Share error:", err);
      if (err.name !== 'AbortError') {
        alert('✅ تم نسخ رابط الفوتوغرافر إلى الحافظة!');
      }
    }
  };

  // حساب الخصومات مع معالجة آمنة
  const calculateDiscounts = () => {
    try {
      if (!photographer || !photographer.packages || !Array.isArray(photographer.packages)) {
        return [];
      }

      return photographer.packages
        .filter(pkg => pkg && pkg.originalPrice && pkg.price && pkg.originalPrice > pkg.price)
        .map(pkg => ({
          name: pkg.name || "باقة",
          discount: Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100),
          originalPrice: pkg.originalPrice,
          newPrice: pkg.price
        }));
    } catch (error) {
      console.error("Error calculating discounts:", error);
      return [];
    }
  };

  // حساب سعر البداية مع معالجة آمنة
  const calculateStartingPrice = () => {
    try {
      if (!photographer || !photographer.packages || !Array.isArray(photographer.packages)) {
        return null;
      }
      
      const validPackages = photographer.packages.filter(pkg => pkg && typeof pkg.price === 'number');
      
      if (validPackages.length === 0) return null;
      
      const minPrice = Math.min(...validPackages.map(pkg => pkg.price));
      return minPrice;
    } catch (error) {
      console.error("Error calculating starting price:", error);
      return null;
    }
  };

  // البيانات الآمنة
  const safePhotographer = photographer || {
    name: "مصور",
    specialty: "تصوير فوتوغرافي",
    city: "المدينة",
    governorate: "المحافظة",
    experience: 0,
    rating: 0,
    services: [],
    packages: []
  };

  const discounts = calculateDiscounts();
  const hasDiscount = discounts.length > 0;
  const maxDiscount = hasDiscount ? Math.max(...discounts.map(d => d.discount)) : 0;
  const startingPrice = calculateStartingPrice();
  const images = getSafeImages();

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const shouldShowArrows = (isMobile || isHovering) && images.length > 1;

  // التأكد من أن renderStars دالة
  const safeRenderStars = renderStars || ((rating) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-lg ${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
      <span className="text-sm text-gray-600 mr-2">({rating || 0})</span>
    </div>
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-400 hover:shadow-2xl group"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* صورة كاملة في الأعلى */}
      <div className="relative h-80 w-full flex-shrink-0">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={`${safePhotographer.name} work ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80";
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* العنوانات - أعلى الصورة */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <div className="flex flex-col gap-2">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 backdrop-blur-md text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-xl border border-white/20"
            >
              📍 {safePhotographer.city || "المدينة"}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl"
            >
              احجز الآن 🎯
            </motion.div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white/20"
            >
              {safeRenderStars(safePhotographer.rating)}
            </motion.div>
            {hasDiscount && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-500 to-red-400 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl"
              >
                خصم {maxDiscount}% 🎁
              </motion.div>
            )}
          </div>
        </div>

        {/* اسم المصور فوق الصورة */}
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {safePhotographer.name}
          </h3>
          <p className="text-blue-100 font-medium text-sm mt-1">
            {safePhotographer.specialty}
          </p>
        </div>

        {/* نقاط التنقل للصور */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/60'
                }`}
                aria-label={`صورة ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* زر المشاركة */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={handleShare}
            className="bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-blue-600 transition-all p-3 shadow-xl rounded-xl hover:scale-110 active:scale-95"
            aria-label="مشاركة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* الأسهم */}
        {shouldShowArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
              aria-label="الصورة السابقة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
              aria-label="الصورة التالية"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* المحتوى أسفل الصورة */}
      <div className="p-5 flex-grow flex flex-col">
        {/* المعلومات الأساسية */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                {safePhotographer.experience || 0} سنة خبرة
              </span>
              {safePhotographer.isCertified && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  معتمد
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {safePhotographer.city || "المدينة"}، {safePhotographer.governorate || "المحافظة"}
            </div>
          </div>
          
          {/* السعر */}
          {startingPrice && (
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">تبدأ الأسعار من</div>
              <div className="text-xl font-bold text-blue-600">
                {startingPrice.toLocaleString()} ج.م
              </div>
            </div>
          )}
        </div>

        {/* الخدمات */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">الخدمات المميزة</h4>
          <div className="flex flex-wrap gap-2">
            {safePhotographer.services?.slice(0, 4).map((service, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 hover:border-blue-300 transition-colors"
              >
                {service}
              </span>
            ))}
            {safePhotographer.services?.length > 4 && (
              <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs font-medium border border-blue-100">
                +{safePhotographer.services.length - 4} خدمات أخرى
              </span>
            )}
            {(!safePhotographer.services || safePhotographer.services.length === 0) && (
              <span className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200">
                خدمات متنوعة
              </span>
            )}
          </div>
        </div>

        {/* معلومات احترافية */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">سرعة التسليم</div>
                <div className="text-sm font-medium">{safePhotographer.deliveryTime || "3-7 أيام"}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">الجودة</div>
                <div className="text-sm font-medium">عالية الدقة</div>
              </div>
            </div>
          </div>

          {/* زر التفاصيل */}
          <button 
            onClick={handleCardClick}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            عرض التفاصيل الكاملة
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotographerCard;