import { useState, useRef, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  // Refs
  const autoPlayRef = useRef(null);
  const cardRef = useRef(null);
  const slideIntervalRef = useRef(null);
  
  // تنظيف الصور - أخذ 8 صور فقط
  const images = venue.images?.slice(0, 8) || 
                 (venue.image ? [venue.image] : 
                 ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"]);
  
  // مدة التسعير
  const price = venue.price || venue.starting_price ? 
                `${(venue.price || venue.starting_price).toLocaleString()} ج.م` : 
                "تواصل للسعر";
  
  // تهيئة حالة تحميل الصور
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
  }, [images.length]);

  // Handlers
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(venue.id || venue._id);
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
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
        // Swipe right
        goToPrevImage();
      } else {
        // Swipe left
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

  // Auto-play effect
  useEffect(() => {
    if (isHovering || showControls) {
      // Start autoplay when hovering
      slideIntervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isHovering, showControls, images.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  // Get venue type display name
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

  return (
    <div 
      ref={cardRef}
      className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-amber-100 group"
      onClick={() => onVenueClick?.(venue)}
      onMouseEnter={() => {
        setIsHovering(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowControls(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 📸 صالة عرض الصور (السلايدر) */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-amber-900 to-amber-800">
        {/* حاوية الصور المتحركة */}
        <div 
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image}
                alt={`${venue.name} - صورة ${index + 1}`}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isHovering ? 'scale-110' : 'scale-100'
                }`}
                onLoad={() => handleImageLoad(index)}
                onError={handleImageError}
                loading="lazy"
              />
              
              {/* حالة التحميل */}
              {!imagesLoaded[index] && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-800 animate-pulse flex items-center justify-center">
                  <i className="bi bi-image text-amber-500/50 text-4xl"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* طبقة تدرجية سفلية */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* ❤️ زر المفضلة - Bootstrap Icons */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 border border-amber-200 group"
        >
          <i className={`bi bi-heart${isFavorite ? '-fill' : ''} text-2xl ${
            isFavorite ? 'text-amber-600' : 'text-gray-600 group-hover:text-amber-600'
          }`}></i>
        </button>
        
        {/* 🏷️ بادج نوع القاعة */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm text-amber-700 px-4 py-2 rounded-xl shadow-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <i className="bi bi-building text-lg"></i>
            <span className="text-sm font-bold">{getVenueTypeDisplay()}</span>
          </div>
        </div>
        
        {/* ✨ بادج الخصم */}
        {venue.discount > 0 && (
          <div className="absolute top-20 left-4 z-20 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <i className="bi bi-tag-fill text-sm"></i>
              <span className="text-sm font-bold">خصم {venue.discount}%</span>
            </div>
          </div>
        )}
        
        {/* 💰 سعر القاعة */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-amber-700 px-4 py-2.5 rounded-xl shadow-lg border border-amber-200">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500 flex items-center justify-center gap-1">
              <i className="bi bi-currency-exchange"></i>
              <span>بداية السعر</span>
            </div>
            <div className="text-xl font-bold">{price}</div>
          </div>
        </div>
        
        {/* ⭐ التقييم */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <i className="bi bi-star-fill text-amber-400 text-lg"></i>
            <span className="font-bold text-gray-800">{venue.rating || 4.5}</span>
            <span className="text-sm text-gray-500">({venue.reviewCount || 128}+)</span>
          </div>
        </div>
        
        {/* ⬅️➡️ أسهم التنقل في السلايدر */}
        {images.length > 1 && showControls && (
          <>
            <button
              onClick={goToPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-amber-200"
            >
              <i className="bi bi-chevron-right text-2xl text-amber-700"></i>
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-amber-200"
            >
              <i className="bi bi-chevron-left text-2xl text-amber-700"></i>
            </button>
          </>
        )}
        
        {/* 🎯 نقاط مؤشرات الصور */}
        {images.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => goToImage(idx, e)}
                className={`transition-all duration-300 ${
                  idx === currentImageIndex 
                    ? 'w-8 h-2.5 bg-amber-500 rounded-full' 
                    : 'w-2.5 h-2.5 bg-white/70 hover:bg-white rounded-full'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 📝 محتوى الكارد */}
      <div className="p-6">
        {/* الصورة الشخصية + الاسم + الموقع */}
        <div className="flex items-start gap-4 mb-6">
          {/* الصورة الشخصية */}
          <div className="w-20 h-20 rounded-xl overflow-hidden border-3 border-amber-200 shadow-lg flex-shrink-0">
            <img 
              src={venue.profile_image || images[0]} 
              alt={venue.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          
          {/* الاسم والموقع */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {venue.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <i className="bi bi-geo-alt-fill text-amber-500"></i>
              <span className="text-sm truncate">{venue.city || venue.location || "غير محدد"}</span>
            </div>
          </div>
        </div>

        {/* 📊 الإحصائيات الأساسية */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* السعة */}
          <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
            <i className="bi bi-people-fill text-2xl text-amber-600 mb-1 block"></i>
            <div className="text-xl font-bold text-gray-800">{venue.capacity || 0}</div>
            <div className="text-xs text-gray-600">أقصى سعة</div>
          </div>
          
          {/* الغرف */}
          <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
            <i className="bi bi-door-open-fill text-2xl text-amber-600 mb-1 block"></i>
            <div className="text-xl font-bold text-gray-800">
              {venue.weddingSpecific?.brideRoom ? '2' : '1'}+
            </div>
            <div className="text-xs text-gray-600">غرف عروس</div>
          </div>
          
          {/* موقف السيارات */}
          <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
            <i className="bi bi-car-front-fill text-2xl text-amber-600 mb-1 block"></i>
            <div className="text-xl font-bold text-gray-800">{venue.parkingCapacity || 50}</div>
            <div className="text-xs text-gray-600">موقف سيارات</div>
          </div>
        </div>

        {/* ✨ المميزات والخدمات */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <i className="bi bi-stars text-amber-500"></i>
            <span>المميزات والخدمات</span>
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {/* واي فاي */}
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <i className={`bi bi-wifi text-xl ${venue.hasWifi ? 'text-amber-600' : 'text-gray-400'}`}></i>
              <span className="text-xs font-medium text-gray-700">واي فاي</span>
            </div>
            
            {/* مسبح */}
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <i className={`bi bi-water text-xl ${venue.hasPool ? 'text-amber-600' : 'text-gray-400'}`}></i>
              <span className="text-xs font-medium text-gray-700">مسبح</span>
            </div>
            
            {/* كاترينج */}
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <i className={`bi bi-cup-hot-fill text-xl ${venue.cateringService ? 'text-amber-600' : 'text-gray-400'}`}></i>
              <span className="text-xs font-medium text-gray-700">كاترينج</span>
            </div>
            
            {/* منصة */}
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <i className={`bi bi-easel2-fill text-xl ${venue.hasStage ? 'text-amber-600' : 'text-gray-400'}`}></i>
              <span className="text-xs font-medium text-gray-700">منصة</span>
            </div>
            
            {/* حديقة */}
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <i className={`bi bi-tree-fill text-xl ${venue.hasGarden ? 'text-amber-600' : 'text-gray-400'}`}></i>
              <span className="text-xs font-medium text-gray-700">حديقة</span>
            </div>
            
            {/* تكييف */}
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <i className="bi bi-snow2 text-xl text-amber-600"></i>
              <span className="text-xs font-medium text-gray-700">تكييف</span>
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
            className="flex-1 py-3.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 active:scale-95 transition-all duration-200 shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
          >
            <i className="bi bi-info-circle-fill"></i>
            <span>تفاصيل القاعة</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow?.(venue);
            }}
            className="flex-1 py-3.5 bg-white text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-50 active:scale-95 transition-all duration-200 border-2 border-amber-200 shadow-lg flex items-center justify-center gap-2"
          >
            <i className="bi bi-calendar-check-fill"></i>
            <span>حجز فوري</span>
          </button>
        </div>
      </div>

      {/* ✨ تأثيرات زخرفية */}
      <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-r from-amber-300 to-amber-400 rounded-full blur-xl opacity-30" />
      <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full blur-xl opacity-30" />
    </div>
  );
};

export default VenueCard;