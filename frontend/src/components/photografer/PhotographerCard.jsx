import { motion } from "framer-motion";
import { useState } from "react";

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

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

  const discounts = calculateDiscounts();
  const hasDiscount = discounts.length > 0;
  const maxDiscount = hasDiscount ? Math.max(...discounts.map(d => d.discount)) : 0;

  const images = photographer.portfolio?.map(album => album.coverImage) || [photographer.profileImage];

  // دالة للصورة التالية
  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // دالة للصورة السابقة
  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

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
        {/* الصورة الرئيسية */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={`${photographer.name} work ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800";
            }}
          />
          
          {/* تدرج غامق من الأسفل */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* جميع العنوانات في الأعلى */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          {/* الجانب الأيسر */}
          <div className="flex flex-col gap-2">
            {/* المدينة */}
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
              {photographer.city}
            </div>
            
            {/* تواصل لمعرفة السعر */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg transform -rotate-1">
              تواصل لمعرفة السعر
            </div>
          </div>

          {/* الجانب الأيمن */}
          <div className="flex flex-col gap-2 items-end">
            {/* التقييم */}
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
              {renderStars(photographer.rating)}
            </div>
            
            {/* الخصومات */}
            {hasDiscount && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                خصم {maxDiscount}% 🎁
              </div>
            )}
          </div>
        </div>

        {/* زر المشاركة - في الأسفل اليسار */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-lg rounded-lg p-2.5 flex items-center justify-center hover:scale-110 active:scale-95"
            title="مشاركة الفوتوغرافر"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* أسهم التنقل - تظهر عند Hover فقط */}
        {images.length > 1 && isHovering && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 z-20"
              title="الصورة السابقة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 z-20"
              title="الصورة التالية"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* مؤشر الصور - في الأسفل */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* عدد الصور في الأسفل على اليمين */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-20">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* المحتوى أسفل الصورة */}
      <div className="p-5 flex-grow flex flex-col">
        {/* الاسم والخبرة */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">{photographer.name}</h4>
            <p className="text-blue-600 font-semibold text-sm">{photographer.specialty}</p>
          </div>
          <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {photographer.experience} سنة خبرة
          </span>
        </div>

        {/* الموقع */}
        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {photographer.city}، {photographer.governorate}
        </p>

        {/* الخصومات التفصيلية */}
        {hasDiscount && (
          <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-700 font-semibold text-sm">عروض خصومات:</span>
              <span className="text-red-600 text-xs font-bold">Limited Time ⏰</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {discounts.slice(0, 2).map((discount, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium"
                >
                  {discount.name} - {discount.discount}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* الخدمات */}
        <div className="flex flex-wrap gap-2 mb-4">
          {photographer.services?.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200"
            >
              {service}
            </span>
          ))}
          {photographer.services?.length > 3 && (
            <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200">
              +{photographer.services.length - 3} أكثر
            </span>
          )}
        </div>

        {/* زر التفاصيل */}
        <div className="mt-auto">
          <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-800 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
            عرض التفاصيل
          </button>
        </div>
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {photographer.responseTime || "رد سريع"}
          </span>
          <span className="flex items-center gap-1">
            {hasDiscount ? (
              <span className="text-red-500 font-semibold animate-pulse">عروض حصرية 🔥</span>
            ) : (
              <span className="text-green-500 font-semibold">جودة عالية</span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotographerCard;