import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  // الكشف عن حجم الشاشة مع معالجة الأخطاء
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
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

  // التبديل التلقائي للصور
  useEffect(() => {
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

  // الحصول على صور آمنة
  const getSafeImages = () => {
    try {
      if (!photographer) return [];
      
      const portfolioImages = photographer.portfolio?.filter(album => album?.coverImage)?.map(album => album.coverImage) || [];
      const profileImage = photographer.profile_image ? [photographer.profile_image] : [];
      const allImages = [...portfolioImages, ...profileImage];
      
      return allImages.length > 0 
        ? allImages 
        : ["https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"];
    } catch (error) {
      console.error("Error getting images:", error);
      return ["https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"];
    }
  };

  // ✅ تصحيح: استخدام window.location.href بدلاً من navigate (حل مؤقت)
  const handleCardClick = (e) => {
    // منع انتشار الحدث
    e.preventDefault();
    e.stopPropagation();
    
    const photographerId = photographer?.id || photographer?._id;
    if (photographerId) {
      console.log('🖱️ Navigating to photographer:', photographerId);
      // ✅ استخدام window.location.href بدلاً من navigate
      window.location.href = `/photographers/${photographerId}`;
    }
    if (onPhotographerClick) {
      onPhotographerClick(photographer);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    try {
      if (!photographer) return;

      const photographerId = photographer.id || photographer._id || "unknown";
      const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/photographers/${photographerId}`
        : `https://example.com/photographers/${photographerId}`;
      
      const shareText = `📸 اكتشف أعمال ${photographer.name || "مصور"} - ${photographer.specialty || "تصوير"} في ${photographer.city || ""}`;

      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: photographer.name || "مصور",
          text: shareText,
          url: shareUrl,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('✅ تم نسخ رابط المصور إلى الحافظة!');
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ تم نسخ رابط المصور إلى الحافظة!');
      }
    } catch (err) {
      console.error("Share error:", err);
      if (err.name !== 'AbortError') {
        alert('✅ تم نسخ رابط المصور إلى الحافظة!');
      }
    }
  };

  // حساب الخصومات
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

  // حساب سعر البداية
  const calculateStartingPrice = () => {
    try {
      if (!photographer || !photographer.packages || !Array.isArray(photographer.packages)) {
        return photographer?.price || null;
      }
      
      const validPackages = photographer.packages.filter(pkg => pkg && typeof pkg.price === 'number');
      
      if (validPackages.length === 0) return photographer?.price || null;
      
      const minPrice = Math.min(...validPackages.map(pkg => pkg.price));
      return minPrice;
    } catch (error) {
      console.error("Error calculating starting price:", error);
      return photographer?.price || null;
    }
  };

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

  const safeRenderStars = renderStars || ((rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
      <span className="text-xs text-gray-600 mr-1">({rating || 0})</span>
    </div>
  ));

  return (
    <div
      className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-400 hover:shadow-2xl group"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* صورة مصغرة في الأعلى */}
      <div className="relative h-48 sm:h-56 w-full flex-shrink-0 bg-gray-900">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={`${safePhotographer.name} work ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80";
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* العنوانات - أعلى الصورة */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
          <div className="flex flex-col gap-1.5">
            <div 
              className="bg-white/95 backdrop-blur-md text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shadow-lg border border-white/20"
            >
              <span className="inline sm:hidden">📍</span>
              <span className="hidden sm:inline">📍 {safePhotographer.city || "المدينة"}</span>
            </div>
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs shadow-lg"
            >
              <span className="inline sm:hidden">🎯</span>
              <span className="hidden sm:inline">احجز الآن 🎯</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <div className="bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg border border-white/20">
              {safeRenderStars(safePhotographer.rating)}
            </div>
            {hasDiscount && (
              <div className="bg-gradient-to-r from-red-500 to-red-400 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shadow-lg">
                <span className="inline sm:hidden">{maxDiscount}%</span>
                <span className="hidden sm:inline">خصم {maxDiscount}% 🎁</span>
              </div>
            )}
          </div>
        </div>

        {/* صورة البروفايل المصغرة في الزاوية */}
        {safePhotographer.profile_image && (
          <div className="absolute -bottom-8 right-3 sm:right-4 z-30">
            <div className="relative">
              <img
                src={safePhotographer.profile_image}
                alt={`صورة ${safePhotographer.name}`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 border-white shadow-xl object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format&fit=crop&q=80";
                }}
              />
              {safePhotographer.isCertified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 sm:p-1 border-2 border-white">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        {/* نقاط التنقل للصور */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white w-3 sm:w-4' : 'bg-white/60 w-1.5'
                }`}
                aria-label={`صورة ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* زر المشاركة */}
        <div className="absolute bottom-3 left-3 z-20">
          <button
            onClick={handleShare}
            className="bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-blue-600 transition-all p-1.5 sm:p-2 shadow-lg rounded-lg hover:scale-110 active:scale-95"
            aria-label="مشاركة"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* الأسهم */}
        {shouldShowArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
              aria-label="الصورة السابقة"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
              aria-label="الصورة التالية"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* المحتوى أسفل الصورة */}
      <div className="p-4 sm:p-5 pt-8 sm:pt-8 flex-grow flex flex-col">
        {/* اسم المصور والتخصص */}
        <div className="mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">
            {safePhotographer.name}
          </h3>
          <p className="text-blue-600 font-medium text-xs sm:text-sm line-clamp-1">
            {safePhotographer.specialty}
          </p>
        </div>

        {/* المعلومات الأساسية */}
        <div className="flex flex-wrap justify-between items-start gap-2 mb-3 sm:mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                {safePhotographer.experience || 0} سنة
              </span>
              {safePhotographer.isCertified && (
                <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-0.5 sm:gap-1">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">معتمد</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{safePhotographer.city || "المدينة"}، {safePhotographer.governorate || "المحافظة"}</span>
            </div>
          </div>
          
          {/* السعر */}
          {startingPrice && (
            <div className="text-right">
              <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">تبدأ من</div>
              <div className="text-base sm:text-xl font-bold text-blue-600 whitespace-nowrap">
                {startingPrice.toLocaleString()} ج.م
              </div>
            </div>
          )}
        </div>

        {/* الخدمات */}
        <div className="mb-3 sm:mb-5">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">الخدمات</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {safePhotographer.services?.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium border border-gray-200 hover:border-blue-300 transition-colors line-clamp-1"
              >
                {service.length > 12 ? service.slice(0, 10) + '...' : service}
              </span>
            ))}
            {safePhotographer.services?.length > 3 && (
              <span className="bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium border border-blue-100 whitespace-nowrap">
                +{safePhotographer.services.length - 3}
              </span>
            )}
            {(!safePhotographer.services || safePhotographer.services.length === 0) && (
              <span className="bg-gray-50 text-gray-600 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium border border-gray-200">
                خدمات متنوعة
              </span>
            )}
          </div>
        </div>

        {/* معلومات احترافية */}
        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500">التسليم</div>
                <div className="text-[10px] sm:text-sm font-medium">{safePhotographer.deliveryTime || "3-7 أيام"}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500">الجودة</div>
                <div className="text-[10px] sm:text-sm font-medium">عالية</div>
              </div>
            </div>
          </div>

          {/* زر التفاصيل */}
          <button 
            onClick={handleCardClick}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2.5 sm:py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            <span className="hidden xs:inline">عرض التفاصيل الكاملة</span>
            <span className="xs:hidden">تفاصيل</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;