import { motion } from "framer-motion";
import { useState } from "react";

const VenueCard = ({ venue, onVenueClick, isFavorite, onToggleFavorite, onShareVenue }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(venue.id, e);
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
            className={`text-xs ${
              star <= numericRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-xs mr-1">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  // الحصول على نطاق السعر
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
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-purple-300 hover:shadow-xl relative"
      onClick={() => onVenueClick(venue)}
    >
      {/* بانر الخصم في أعلى الكارد */}
      {venue.special_offer && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-red-500 to-pink-600 text-white text-center py-2 z-10">
          <span className="text-sm font-bold">🎉 {venue.special_offer}</span>
        </div>
      )}

      <VenueImage 
        venue={venue} 
        renderStars={renderStars}
        imageLoaded={imageLoaded}
        imageError={imageError}
        onImageLoad={() => setImageLoaded(true)}
        onImageError={handleImageError}
        isFavorite={isFavorite}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        getPriceRange={getPriceRange}
      />
      
      <div className={`p-4 flex-grow flex flex-col ${venue.special_offer ? 'pt-8' : ''}`}>
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
  onImageLoad, 
  onImageError,
  isFavorite,
  onFavoriteClick,
  onShareClick,
  getPriceRange
}) => {
  const handleShare = async (e) => {
    e.stopPropagation();
    
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ رابط القاعة إلى الحافظة! 📋');
      } catch (clipboardErr) {
        alert('تعذر مشاركة الرابط. يرجى نسخ الرابط يدوياً.');
      }
    }
  };

  return (
    <div className={`relative h-48 flex-shrink-0 bg-gray-100 ${venue.special_offer ? 'mt-8' : ''}`}>
      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Main Image */}
      <img 
        src={imageError ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600" : venue.images?.[0] || venue.image} 
        alt={venue.name}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={onImageLoad}
        onError={onImageError}
      />

      {/* Overlay for unavailable venues */}
      {!venue.available && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <span className="text-white font-bold bg-red-600 px-4 py-2 rounded-full text-sm">
            غير متاحة حالياً
          </span>
        </div>
      )}

      {/* Price Range */}
      <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
        {getPriceRange()}
      </div>

      {/* City */}
      <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
        {venue.city}
      </div>

      {/* Rating */}
      <div className="absolute bottom-3 right-3 bg-white bg-opacity-95 px-3 py-2 rounded-xl shadow-sm">
        {renderStars(venue.rating)}
      </div>

      {/* Favorite Button */}
      <button
        onClick={onFavoriteClick}
        className={`absolute bottom-3 left-3 p-2 rounded-full transition-all shadow-lg ${
          isFavorite 
            ? 'bg-red-500 text-white' 
            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
        }`}
      >
        <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="absolute top-12 left-3 p-2 bg-white/90 text-gray-600 rounded-full transition-all shadow-lg hover:bg-white hover:text-blue-500 group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="absolute -top-8 right-1/2 transform translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          مشاركة
        </span>
      </button>

      {/* Image Count */}
      {venue.images && venue.images.length > 1 && (
        <div className="absolute bottom-3 left-12 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          +{venue.images.length - 1}
        </div>
      )}
    </div>
  );
};

const VenueInfo = ({ venue, getPriceRange }) => (
  <div className="flex justify-between items-start mb-3">
    <div className="flex-1">
      <h4 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{venue.name}</h4>
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{venue.city}، {venue.governorate}</span>
      </div>
    </div>
    <div className="text-right">
      <div className="text-purple-600 text-lg font-bold bg-purple-50 px-3 py-1 rounded-lg">
        {venue.capacity} شخص
      </div>
      <div className="text-gray-500 text-xs mt-1">السعة</div>
    </div>
  </div>
);

const VenueFeatures = ({ venue }) => (
  <>
    <div className="flex flex-wrap gap-1 mb-4 flex-grow">
      {venue.features?.slice(0, 4).map((feature, index) => (
        <span
          key={index}
          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200"
        >
          {feature}
        </span>
      ))}
      {venue.features?.length > 4 && (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
          +{venue.features.length - 4} أكثر
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
      <span className={`px-2 py-1 rounded-full text-xs ${
        venue.wedding_specific?.openAir 
          ? 'bg-green-100 text-green-800' 
          : 'bg-blue-100 text-blue-800'
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
      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all transform hover:scale-105 shadow-lg"
    >
      شوف التفاصيل
    </button>
  </div>
);

export default VenueCard;