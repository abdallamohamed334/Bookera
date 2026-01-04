import { motion } from "framer-motion";
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
<<<<<<< HEAD
  const intervalRef = useRef(null);

  // الكشف عن حجم الشاشة مع معالجة الأخطاء
=======

  // الكشف عن حجم الشاشة
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
<<<<<<< HEAD
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
=======
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = () => {
    onPhotographerClick(photographer);
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
  };

  const handleShare = async (e) => {
    e.stopPropagation();

<<<<<<< HEAD
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
=======
    const photographerId = photographer.id || photographer._id;
    const shareUrl = `${window.location.origin}/photographer/${photographerId}`;
    const shareText = `📸 اكتشف أعمال ${photographer.name} - ${photographer.specialty} في ${photographer.city}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: photographer.name,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('✅ تم نسخ رابط الفوتوغرافر إلى الحافظة!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('✅ تم نسخ رابط الفوتوغرافر إلى الحافظة!');
        } catch (clipboardErr) {
          console.error('تعذر نسخ الرابط:', clipboardErr);
        }
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
      }
    }
  };

<<<<<<< HEAD
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
=======
  // حساب الخصومات
  const calculateDiscounts = () => {
    if (!photographer.packages) return [];

    return photographer.packages
      .filter(pkg => pkg.originalPrice && pkg.originalPrice > pkg.price)
      .map(pkg => ({
        name: pkg.name,
        discount: Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100),
        originalPrice: pkg.originalPrice,
        newPrice: pkg.price
      }));
  };

  // حساب بداية سعر القاعة
  const calculateHallStartingPrice = () => {
    if (!photographer.packages) return null;
    
    const hallPackages = photographer.packages.filter(pkg => 
      pkg.category === 'hall' || pkg.name?.toLowerCase().includes('قاعة') || pkg.name?.toLowerCase().includes('hall')
    );
    
    if (hallPackages.length === 0) return null;
    
    const minPrice = Math.min(...hallPackages.map(pkg => pkg.price));
    return minPrice;
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
  };

  const discounts = calculateDiscounts();
  const hasDiscount = discounts.length > 0;
  const maxDiscount = hasDiscount ? Math.max(...discounts.map(d => d.discount)) : 0;
<<<<<<< HEAD
  const startingPrice = calculateStartingPrice();
  const images = getSafeImages();
=======
  const hallStartingPrice = calculateHallStartingPrice();

  const images = photographer.portfolio?.map(album => album.coverImage) || [photographer.profileImage];
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57

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

<<<<<<< HEAD
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
=======
  const shouldShowArrows = isMobile || isHovering || images.length > 1;
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
<<<<<<< HEAD
      className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-400 hover:shadow-2xl group"
=======
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-400 hover:shadow-xl group"
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* صورة كاملة في الأعلى */}
      <div className="relative h-80 w-full flex-shrink-0">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentImageIndex]}
<<<<<<< HEAD
            alt={`${safePhotographer.name} work ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80";
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
=======
            alt={`${photographer.name} work ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800";
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
        </div>

        {/* العنوانات - أعلى الصورة */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <div className="flex flex-col gap-2">
<<<<<<< HEAD
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
=======
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
              {photographer.city}
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
              احجز الآن 🎯
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
              {renderStars(photographer.rating)}
            </div>
            {hasDiscount && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                خصم {maxDiscount}% 🎁
              </div>
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
            )}
          </div>
        </div>

<<<<<<< HEAD
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

=======
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
        {/* زر المشاركة */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={handleShare}
<<<<<<< HEAD
            className="bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-blue-600 transition-all p-3 shadow-xl rounded-xl hover:scale-110 active:scale-95"
            aria-label="مشاركة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
=======
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 transition-all p-2.5 shadow-lg rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12a4 4 0 118 0 4 4 0 01-8 0zm4 6v4m0-20v4m8 4h4M2 12H6" />
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
            </svg>
          </button>
        </div>

        {/* الأسهم */}
<<<<<<< HEAD
        {shouldShowArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
              aria-label="الصورة السابقة"
=======
        {images.length > 1 && shouldShowArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
<<<<<<< HEAD
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
              aria-label="الصورة التالية"
=======
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
<<<<<<< HEAD
=======

>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
      </div>

      {/* المحتوى أسفل الصورة */}
      <div className="p-5 flex-grow flex flex-col">
<<<<<<< HEAD
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
=======
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">{photographer.name}</h4>
            <p className="text-blue-600 font-semibold text-sm">{photographer.specialty}</p>
          </div>
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {photographer.experience} سنة خبرة
          </span>
        </div>

        {/* الموقع */}
        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
          {photographer.city}، {photographer.governorate}
        </p>

        {/* الخدمات */}
        <div className="flex flex-wrap gap-2 mb-4">
          {photographer.services?.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-medium border"
            >
              {service}
            </span>
          ))}
          {photographer.services?.length > 3 && (
            <span className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium border">
              +{photographer.services.length - 3} أكثر
            </span>
          )}
        </div>

        {/* محرر فيديو وصور */}
        <div className="flex flex-wrap gap-2 mb-4">
          {photographer.isVideoEditor && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 flex items-center gap-1">
              🎬 محترف مونتاج فيديو
            </span>
          )}

          {photographer.isPhotoEditor && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-200 flex items-center gap-1">
              🎨 محرر صور (Photo Editor)
            </span>
          )}

          {!photographer.isVideoEditor && !photographer.isPhotoEditor && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200">
              لا توجد خدمات تعديل صور/فيديو
            </span>
          )}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg">
          عرض التفاصيل
        </button>
>>>>>>> c28e35099d3fff1ec515406ddb2e0bc39180fa57
      </div>
    </motion.div>
  );
};

export default PhotographerCard;