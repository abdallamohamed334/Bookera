import { useState, useRef, useEffect } from "react";

const VenueCard = ({ 
  venue, 
  onVenueClick, 
  onBookNow,
  onToggleFavorite,
  isFavorite = false
}) => {
  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  
  // Refs
  const autoPlayRef = useRef(null);
  const cardRef = useRef(null);
  
  // تنظيف الصور - أخذ 8 صور فقط
  const images = venue.images?.slice(0, 8) || 
                 (venue.image ? [venue.image] : 
                 ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"]);
  
  // مدة التسعير
  const price = venue.price || venue.starting_price ? 
                `${(venue.price || venue.starting_price).toLocaleString()} ج.م` : 
                "تواصل للسعر";
  
  // Handlers
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(venue.id);
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchEnd - touchStart;
    
    if (Math.abs(diff) > 50 && images.length > 1) {
      if (diff > 0) {
        // Swipe right
        setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
      } else {
        // Swipe left
        setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
      }
    }
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    }
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    }
  };

  // Effects
  useEffect(() => {
    if (isHovering && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 4000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovering, images.length]);

  return (
    <div 
      ref={cardRef}
      className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 group"
      onClick={() => onVenueClick?.(venue)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🔮 الصور */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {/* الصورة الحالية */}
        <img
          src={images[currentImageIndex]}
          alt={venue.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovering ? 'scale-110' : 'scale-100'
          } ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* حالة التحميل */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        )}
        
        {/* طبقة تدرجية */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* ❤️ زر المفضلة */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-gray-200"
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        
        {/* ✨ بادج الخصم */}
        {venue.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-3 py-1.5 rounded-lg shadow-lg">
            <div className="flex items-center gap-1 text-sm font-bold">
              <span>🎯</span>
              <span>{venue.discount}% خصم</span>
            </div>
          </div>
        )}
        
        {/* 💰 سعر القاعة */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2.5 rounded-xl shadow-lg border border-gray-600">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-300">بداية السعر</div>
            <div className="text-lg font-bold">{price}</div>
          </div>
        </div>
        
        {/* ⭐ التقييم */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-3 py-1.5 rounded-xl shadow-lg border border-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-sm">{venue.rating || 4.5}</span>
            <span className="text-xs text-gray-300">/5</span>
          </div>
        </div>
        
        {/* 🖼️ أسهم التنقل */}
        {images.length > 1 && isHovering && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200 z-10 border border-gray-300"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200 z-10 border border-gray-300"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* نقاط الصور */}
        {images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 📝 معلومات القاعة */}
      <div className="p-5">
        {/* الصورة الشخصية للقاعة + الاسم */}
        <div className="flex items-start gap-4 mb-4">
          {/* الصورة الشخصية */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
            <img 
              src={venue.profile_image || images[0]} 
              alt={venue.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          
          {/* الاسم والمكان */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
              {venue.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm truncate">{venue.city || venue.location || "غير محدد"}</span>
            </div>
          </div>
        </div>

        {/* 📊 الإحصائيات الأساسية */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* السعة */}
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{venue.capacity || 0}</div>
            <div className="text-xs text-gray-600 mt-1 font-medium">سعة الأشخاص</div>
          </div>
          
          
          
        
        </div>

        {/* 🏷️ المميزات الأساسية */}
        <div className="mb-5">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>✨</span>
            المميزات الأساسية
          </h4>
          <div className="flex flex-wrap gap-2">
            {/* كافيه */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">☕</span>
              </div>
              <span className="text-sm font-medium text-gray-700">كافيه</span>
            </div>
            
            {/* حمامات */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🚿</span>
              </div>
              <span className="text-sm font-medium text-gray-700">حمامات</span>
            </div>
            
            {/* تكييفات */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">❄️</span>
              </div>
              <span className="text-sm font-medium text-gray-700">تكييفات</span>
            </div>
            
            {/* واي فاي */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">📶</span>
              </div>
              <span className="text-sm font-medium text-gray-700">واي فاي</span>
            </div>
            
            {/* موقف سيارات */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🚗</span>
              </div>
              <span className="text-sm font-medium text-gray-700">موقف سيارات</span>
            </div>
            
            {/* أماكن تصوير */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg">📸</span>
              </div>
              <span className="text-sm font-medium text-gray-700">أماكن تصوير</span>
            </div>
          </div>
        </div>

        {/* 🎯 أزرار الإجراء */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVenueClick?.(venue);
            }}
            className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold text-sm hover:bg-gray-900 active:scale-95 transition-all duration-200 border border-gray-700"
          >
            تفاصيل القاعة
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow?.(venue);
            }}
            className="flex-1 py-3 bg-white text-gray-800 rounded-xl font-semibold text-sm hover:bg-gray-50 active:scale-95 transition-all duration-200 border border-gray-300 shadow-sm"
          >
            حجز فوري
          </button>
        </div>
      </div>

      {/* ✨ لمسات جمالية */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur-xl opacity-20" />
      <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur-xl opacity-20" />
    </div>
  );
};

export default VenueCard;