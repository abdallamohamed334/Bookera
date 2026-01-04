import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // الكشف عن حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = () => {
    onPhotographerClick(photographer);
  };

  const handleShare = async (e) => {
    e.stopPropagation();

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
      }
    }
  };

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
  };

  const discounts = calculateDiscounts();
  const hasDiscount = discounts.length > 0;
  const maxDiscount = hasDiscount ? Math.max(...discounts.map(d => d.discount)) : 0;
  const hallStartingPrice = calculateHallStartingPrice();

  const images = photographer.portfolio?.map(album => album.coverImage) || [photographer.profileImage];

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

  const shouldShowArrows = isMobile || isHovering || images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-400 hover:shadow-xl group"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* صورة كاملة في الأعلى */}
      <div className="relative h-80 w-full flex-shrink-0">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={`${photographer.name} work ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800";
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* العنوانات - أعلى الصورة */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <div className="flex flex-col gap-2">
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
            )}
          </div>
        </div>

        {/* زر المشاركة */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 transition-all p-2.5 shadow-lg rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12a4 4 0 118 0 4 4 0 01-8 0zm4 6v4m0-20v4m8 4h4M2 12H6" />
            </svg>
          </button>
        </div>

        {/* الأسهم */}
        {images.length > 1 && shouldShowArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
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
      </div>
    </motion.div>
  );
};

export default PhotographerCard;