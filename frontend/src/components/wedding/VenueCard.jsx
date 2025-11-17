import { motion } from "framer-motion";
import { useState, useRef } from "react";

const VenueCard = ({ venue, onVenueClick, isFavorite, onToggleFavorite, onShareVenue }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShareVenue(venue, e);
  };

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= numericRating ? 'text-gray-600' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-500 text-sm mr-1">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  const getPriceRange = () => {
    const minPrice = venue.min_price || venue.price;
    const maxPrice = venue.max_price || venue.price;
    
    if (minPrice && maxPrice && minPrice !== maxPrice) {
      return `${parseInt(minPrice).toLocaleString()} - ${parseInt(maxPrice).toLocaleString()} ج`;
    } else if (minPrice) {
      return `${parseInt(minPrice).toLocaleString()} ج`;
    } else {
      return "السعر عند الطلب";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-gray-300 hover:shadow-lg relative w-full max-w-md" // تم تكبير العرض إلى max-w-md
      onClick={() => onVenueClick(venue)}
    >
      <VenueImage 
        venue={venue} 
        renderStars={renderStars}
        imageLoaded={imageLoaded}
        imageError={imageError}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        onImageLoad={() => setImageLoaded(true)}
        onImageError={handleImageError}
        onShareClick={handleShareClick}
        getPriceRange={getPriceRange}
      />
      
      <div className="p-4 flex-grow flex flex-col">
        {/* Special Offer Banner - بألوان رمادية فاتحة */}
        {venue.special_offer && (
          <div className="mb-3 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold text-center">
            🎉 {venue.special_offer}
          </div>
        )}
        
        <VenueInfo 
          venue={venue} 
          getPriceRange={getPriceRange}
        />
        <VenueFeatures venue={venue} />
        <VenueActions 
          onVenueClick={onVenueClick}
          venue={venue}
        />
      </div>
    </motion.div>
  );
};

const VenueImage = ({ 
  venue, 
  renderStars, 
  imageLoaded, 
  imageError, 
  currentImageIndex,
  setCurrentImageIndex,
  onImageLoad, 
  onImageError,
  onShareClick,
  getPriceRange
}) => {
  const scrollContainerRef = useRef(null);

  const handleShare = async (e) => {
    e.stopPropagation();
    
    // استخدام دالة الشير من الـ props بدل التنفيذ المباشر
    if (onShareClick) {
      onShareClick(e);
      return;
    }

    // Fallback implementation
    const shareData = {
      title: venue.name,
      text: `اكتشف ${venue.name} - ${venue.city} | ${getPriceRange()}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ رابط القاعة إلى الحافظة! 📋');
      }
    } catch (err) {
      console.log('مشكلة في المشاركة:', err);
      // لا تعرض رسالة خطأ إذا كان المستخدم ألغى المشاركة
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('تم نسخ رابط القاعة إلى الحافظة! 📋');
        } catch (clipboardErr) {
          console.log('تعذر نسخ الرابط');
        }
      }
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (venue.images && venue.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === venue.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (venue.images && venue.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? venue.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className={`relative h-52 flex-shrink-0 bg-gray-100 overflow-hidden`}>
      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      )}

      {/* Image Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {(venue.images && venue.images.length > 0 ? venue.images : [venue.image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600"]).map((img, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img 
              src={imageError ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600" : img} 
              alt={`${venue.name} - صورة ${index + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={onImageLoad}
              onError={onImageError}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows for multiple images */}
      {venue.images && venue.images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full transition-all z-20 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full transition-all z-20 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image Indicators */}
      {venue.images && venue.images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {venue.images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Overlay for unavailable venues */}
      {!venue.available && (
        <div className="absolute inset-0 bg-gray-600/60 flex items-center justify-center z-10">
          <span className="text-white font-bold bg-gray-700 px-4 py-2 rounded-full text-sm">
            غير متاحة حالياً
          </span>
        </div>
      )}

      {/* Price Range - على الجانب */}
      <div className="absolute top-3 right-3 bg-gray-700 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
        {getPriceRange()}
      </div>

      {/* City - على الجانب */}
      <div className="absolute top-3 left-3 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
        {venue.city}
      </div>

      {/* Rating */}
      <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-2 rounded-xl shadow-sm border border-gray-200">
        {renderStars(venue.rating)}
      </div>

      {/* Share Button فقط - تم إزالة زر المفضلة */}
      <button
        onClick={handleShare}
        className="absolute bottom-3 left-3 p-2 bg-white text-gray-600 rounded-full transition-all shadow-lg hover:bg-gray-100 border border-gray-300 z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Image Count */}
      {venue.images && venue.images.length > 1 && (
        <div className="absolute top-12 right-3 bg-gray-700/80 text-white px-2 py-1 rounded-full text-xs">
          +{venue.images.length - 1}
        </div>
      )}
    </div>
  );
};

const VenueInfo = ({ venue, getPriceRange }) => (
  <div className="flex justify-between items-start mb-3">
    <div className="flex-1 min-w-0">
      <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 leading-tight">{venue.name}</h4>
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{venue.city}، {venue.governorate}</span>
      </div>
    </div>
    {/* Capacity with icon - بخلفية رمادية فاتحة */}
    <div className="text-right flex-shrink-0 ml-3">
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <span className="text-gray-800 text-lg font-bold">{venue.capacity}</span>
      </div>
      <div className="text-gray-500 text-sm mt-1">شخص</div>
    </div>
  </div>
);

const VenueFeatures = ({ venue }) => (
  <>
    <div className="flex flex-wrap gap-2 mb-4 flex-grow">
      {venue.features?.slice(0, 4).map((feature, index) => (
        <span
          key={index}
          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200"
        >
          {feature}
        </span>
      ))}
      {venue.features?.length > 4 && (
        <span className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg text-sm">
          +{venue.features.length - 4}
        </span>
      )}
    </div>

    {/* Additional Info */}
    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {venue.review_count || 0} تقييم
        </span>
      </div>
      <span className={`px-3 py-1.5 rounded-full text-sm border border-gray-300 ${
        venue.wedding_specific?.openAir 
          ? 'bg-gray-100 text-gray-700' 
          : 'bg-gray-100 text-gray-700'
      }`}>
        {venue.wedding_specific?.openAir ? 'أوبن دور' : 'إن دور'}
      </span>
    </div>
  </>
);

const VenueActions = ({ onVenueClick, venue }) => (
  <div className="mt-auto">
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onVenueClick(venue);
      }}
      className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.02] shadow-lg"
    >
      عرض التفاصيل
    </button>
  </div>
);

export default VenueCard;