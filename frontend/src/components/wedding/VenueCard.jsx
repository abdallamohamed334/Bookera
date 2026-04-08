import { useState, useRef, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const VenueCard = ({ 
  venue, 
  onVenueClick, 
  onBookNow,
  onToggleFavorite,
  isFavorite = false,
  getEventTypeDisplayName
}) => {
  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  
  // Refs
  const slideIntervalRef = useRef(null);
  
  // الصور
  const images = venue.images?.slice(0, 10) || 
                 (venue.image ? [venue.image] : 
                 ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format"]);
  
  // السعر
  const price = venue.price || venue.starting_price ? 
                `${(venue.price || venue.starting_price).toLocaleString()} ج.م` : 
                "تواصل للسعر";
  
  // تهيئة تحميل الصور
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
  }, [images.length]);

  // Auto-play - مع إصلاح مشكلة التكرار
  useEffect(() => {
    // فقط ابدأ auto-play إذا كان في hover وأكثر من صورة واحدة
    if (isHovering && images.length > 1) {
      // امسح أي interval موجود أولاً
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
      
      // ابدأ interval جديد
      slideIntervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 4000);
    }
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    };
  }, [isHovering, images.length]);

  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(venue.id || venue._id);
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format";
  };

  const handleImageLoad = (index) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchEnd - touchStart;
    
    if (Math.abs(diff) > 50 && images.length > 1) {
      if (diff > 0) {
        goToPrevImage();
      } else {
        goToNextImage();
      }
    }
  };

  const goToNextImage = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    }
  };

  const goToPrevImage = (e) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    }
  };

  const goToImage = (index, e) => {
    e?.stopPropagation();
    setCurrentImageIndex(index);
  };

  const getVenueTypeDisplay = () => {
    const types = {
      'قاعة_أفراح': 'قاعة أفراح',
      'قصر': 'قصر',
      'فندق': 'فندق',
      'منتجع': 'منتجع',
      'نادي': 'نادي'
    };
    return types[venue.type] || venue.type || 'قاعة';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'islamic_wedding': '💒',
      'engagement': '💍',
      'katb_ketab': '📖',
      'conference': '📊',
      'birthday': '🎂'
    };
    return icons[type] || '🎉';
  };

  // عرض الصورة الحالية مباشرة
  const currentImage = images[currentImageIndex];

  return (
    <div 
      className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 cursor-pointer group"
      onClick={() => onVenueClick?.(venue)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ==================== صالة العرض (سلايدر بسيط ومستقر) ==================== */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
        {/* الصورة الحالية */}
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt={venue.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovering ? 'scale-110' : 'scale-100'
            }`}
            onLoad={() => handleImageLoad(currentImageIndex)}
            onError={handleImageError}
          />
          
          {/* Loading Skeleton */}
          {!imagesLoaded[currentImageIndex] && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* ==================== الأزرار العلوية ==================== */}
        
        {/* زر المفضلة */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/95 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 group/fav"
        >
          <i className={`bi bi-heart${isFavorite ? '-fill' : ''} text-2xl ${
            isFavorite ? 'text-rose-500' : 'text-gray-600 group-hover/fav:text-rose-500'
          }`}></i>
        </button>

        {/* نوع القاعة */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur rounded-2xl px-4 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <i className="bi bi-building text-purple-600 text-sm"></i>
            <span className="text-sm font-bold text-gray-800">{getVenueTypeDisplay()}</span>
          </div>
        </div>

        {/* خصم */}
        {venue.discount > 0 && (
          <div className="absolute top-20 left-4 z-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl px-4 py-2 shadow-xl">
            <div className="flex items-center gap-2">
              <i className="bi bi-tag-fill text-white text-sm"></i>
              <span className="text-white text-sm font-bold">خصم {venue.discount}%</span>
            </div>
          </div>
        )}

        {/* السعر */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur rounded-2xl px-5 py-3 shadow-xl">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500 flex items-center justify-center gap-1">
              <i className="bi bi-currency-exchange"></i>
              <span>بداية من</span>
            </div>
            <div className="text-xl font-bold text-purple-600">{price}</div>
          </div>
        </div>

        {/* التقييم */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur rounded-2xl px-4 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <i className="bi bi-star-fill text-yellow-500 text-lg"></i>
            <span className="font-bold text-gray-800">{venue.rating || 4.8}</span>
            <span className="text-sm text-gray-500">({venue.reviewCount || 0}+ تقييم)</span>
          </div>
        </div>

        {/* ==================== أزرار التنقل في السلايدر ==================== */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <i className="bi bi-chevron-right text-xl text-purple-600"></i>
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <i className="bi bi-chevron-left text-xl text-purple-600"></i>
            </button>
          </>
        )}

        {/* نقاط المؤشرات */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => goToImage(idx, e)}
                className={`transition-all duration-300 ${
                  idx === currentImageIndex 
                    ? 'w-8 h-2 bg-white rounded-full' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'
                }`}
              />
            ))}
          </div>
        )}

        {/* عداد الصور */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur rounded-full px-3 py-1">
            <span className="text-white text-xs">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* ==================== محتوى البطاقة ==================== */}
      <div className="p-6">
        {/* الصورة الشخصية + الاسم */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50"></div>
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
              <img 
                src={venue.profile_image || images[0]} 
                alt={venue.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {venue.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-500">
              <i className="bi bi-geo-alt-fill text-purple-500"></i>
              <span className="text-sm truncate">{venue.city || "طنطا"}، {venue.governorate || "الغربية"}</span>
            </div>
          </div>
        </div>

        {/* الوصف */}
        {venue.description && (
          <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
            {venue.description}
          </p>
        )}

        {/* ==================== الإحصائيات ==================== */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <i className="bi bi-people-fill text-2xl text-purple-500 mb-1 block"></i>
            <div className="text-lg font-bold text-gray-800">{venue.capacity?.toLocaleString() || 0}</div>
            <div className="text-xs text-gray-500">أقصى سعة</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <i className="bi bi-door-open-fill text-2xl text-purple-500 mb-1 block"></i>
            <div className="text-lg font-bold text-gray-800">
              {venue.weddingSpecific?.brideRoom ? '2' : '1'}
            </div>
            <div className="text-xs text-gray-500">غرف عروس</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <i className="bi bi-car-front-fill text-2xl text-purple-500 mb-1 block"></i>
            <div className="text-lg font-bold text-gray-800">{venue.parkingCapacity || 50}</div>
            <div className="text-xs text-gray-500">موقف سيارات</div>
          </div>
        </div>

        {/* ==================== المناسبات المدعومة ==================== */}
        {venue.eventTypes && venue.eventTypes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <i className="bi bi-calendar-heart text-purple-500"></i>
              <span>المناسبات المتاحة</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {venue.eventTypes.slice(0, 4).map((type, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-medium border border-purple-100">
                  <span>{getEventTypeIcon(type)}</span>
                  <span>{getEventTypeDisplayName?.(type) || type}</span>
                </span>
              ))}
              {venue.eventTypes.length > 4 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium">
                  +{venue.eventTypes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ==================== المميزات والخدمات ==================== */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <i className="bi bi-stars text-purple-500"></i>
            <span>المميزات</span>
          </h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-wifi text-lg ${venue.hasWifi ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">واي فاي</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-water text-lg ${venue.hasPool ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">مسبح</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-cup-hot-fill text-lg ${venue.catering ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">كاترينج</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-easel2-fill text-lg ${venue.hasStage ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">منصة</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-tree-fill text-lg ${venue.hasGarden ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">حديقة</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className="bi bi-snow2 text-lg text-purple-500"></i>
              <span className="text-xs text-gray-600">تكييف</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-mic text-lg ${venue.hasSoundSystem ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">صوتيات</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl">
              <i className={`bi bi-brightness-alt-high text-lg ${venue.openAir ? 'text-purple-500' : 'text-gray-300'}`}></i>
              <span className="text-xs text-gray-600">أوبن دور</span>
            </div>
          </div>
        </div>

        {/* ==================== أزرار الإجراء ==================== */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVenueClick?.(venue);
            }}
            className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <i className="bi bi-info-circle-fill"></i>
            <span>تفاصيل القاعة</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow?.(venue);
            }}
            className="flex-1 py-3.5 bg-white text-purple-600 rounded-2xl font-bold text-sm hover:bg-purple-50 transition-all duration-200 border-2 border-purple-200 hover:border-purple-300 flex items-center justify-center gap-2"
          >
            <i className="bi bi-calendar-check-fill"></i>
            <span>حجز فوري</span>
          </button>
        </div>
      </div>

      {/* ==================== عناصر زخرفية ==================== */}
      <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-2xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 pointer-events-none" />
    </div>
  );
};

export default VenueCard;