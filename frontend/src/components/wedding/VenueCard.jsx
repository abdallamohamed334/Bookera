import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const VenueCard = ({ 
  venue, 
  onVenueClick, 
  onShareVenue,
  comparisonMode = false,
  isSelectedForComparison = false,
  onToggleComparison,
  onBookNow,
  filters = {},
  getEventTypeDisplayName,
  onToggleFavorite,
  isFavorite
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleProfileImageError = () => {
    setProfileImageError(true);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShareVenue) {
      onShareVenue(venue, e);
    }
  };

  const handleBookNowClick = (e) => {
    e.stopPropagation();
    if (onBookNow) {
      onBookNow(venue);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(venue.id || venue._id, e);
    }
  };

  const getVenueStatus = () => {
    if (!venue.available) return { label: "غير متاحة", color: "bg-gray-600" };
    if (venue.is_new) return { label: "جديد", color: "bg-green-500" };
    if (venue.discount > 0) return { label: `خصم ${venue.discount}%`, color: "bg-red-500" };
    if (venue.is_popular) return { label: "الأكثر طلباً", color: "bg-purple-500" };
    return null;
  };

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            return <span key={star} className="text-yellow-400 text-lg">★</span>;
          } else if (star === fullStars + 1 && hasHalfStar) {
            return <span key={star} className="text-yellow-400 text-lg">⭐</span>;
          } else {
            return <span key={star} className="text-gray-300 text-lg">★</span>;
          }
        })}
        <span className="text-gray-700 text-sm font-bold mr-1">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  const getDisplayImages = () => {
    if (!venue.images || venue.images.length === 0) {
      return venue.image ? [venue.image] : ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200"];
    }
    return venue.images.slice(0, 5);
  };

  const getEventTypeIcons = () => {
    const eventTypes = venue.eventTypes || venue.event_types || [];
    const icons = [];
    
    const iconMap = {
      'engagement': { icon: '💍', label: 'خطوبة' },
      'katb_ketab': { icon: '📖', label: 'كتب كتاب' },
      'islamic_wedding': { icon: '💒', label: 'فرح' },
      'conference': { icon: '👔', label: 'مؤتمرات' },
      'birthday': { icon: '🎂', label: 'عيد ميلاد' },
      'فرح': { icon: '💒', label: 'فرح' },
      'خطوبة': { icon: '💍', label: 'خطوبة' },
      'كتب_كتاب': { icon: '📖', label: 'كتب كتاب' },
      'عيد_ميلاد': { icon: '🎂', label: 'أعياد ميلاد' },
      'مؤتمرات': { icon: '👔', label: 'مؤتمرات' },
      'حفلات': { icon: '🎉', label: 'حفلات' },
      'اجتماعات': { icon: '🤝', label: 'اجتماعات' },
      'مناسبات خاصة': { icon: '🎊', label: 'مناسبات خاصة' }
    };
    
    eventTypes.forEach(type => {
      const eventType = String(type).toLowerCase().trim();
      
      if (iconMap[eventType]) {
        icons.push(iconMap[eventType]);
      } else {
        const displayName = getEventTypeDisplayName ? getEventTypeDisplayName(eventType) : eventType;
        icons.push({ 
          icon: '🎊', 
          label: displayName 
        });
      }
    });
    
    if (icons.length === 0) {
      icons.push({ icon: '💒', label: 'أفراح' });
    }
    
    return icons;
  };

  // ⭐⭐ دالة لمعرفة ما إذا كان هناك سعر ⭐⭐
  const hasPrice = () => {
    return venue.price || venue.starting_price || (venue.price_range && venue.price_range.min);
  };

  // ⭐⭐ دالة للحصول على السعر للعرض ⭐⭐
  const getDisplayPrice = () => {
    if (venue.price) {
      return { type: "بداية السعر", amount: venue.price };
    } else if (venue.starting_price) {
      return { type: "بداية السعر", amount: venue.starting_price };
    } else if (venue.price_range?.min) {
      return { type: "بداية السعر", amount: venue.price_range.min };
    }
    return null;
  };

  const getProfileImage = () => {
    if (profileImageError) {
      return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
    }
    if (venue.profile_image) return venue.profile_image;
    if (venue.image) return venue.image;
    if (venue.images && venue.images.length > 0) return venue.images[0];
    return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
  };

  const getVenueScore = () => {
    let score = venue.rating || 0;
    if (venue.parking) score += 0.2;
    if (venue.wifi) score += 0.1;
    if (venue.ac) score += 0.1;
    return Math.min(5, score).toFixed(1);
  };

  const displayImages = getDisplayImages();
  const venueStatus = getVenueStatus();
  const eventTypeIcons = getEventTypeIcons();
  const displayPrice = getDisplayPrice();
  const hasVenuePrice = hasPrice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: comparisonMode ? 1.02 : 1.03 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`bg-white rounded-3xl overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:shadow-2xl shadow-xl relative w-full max-w-md border border-gray-100 ${
        comparisonMode && isSelectedForComparison 
          ? 'ring-4 ring-blue-500 ring-opacity-30' 
          : ''
      }`}
      onClick={() => onVenueClick(venue)}
    >
      {venueStatus && (
        <div className={`absolute top-4 right-4 z-30 ${venueStatus.color} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
          {venueStatus.label}
        </div>
      )}

      {onToggleFavorite && (
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={handleFavoriteClick}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
              isFavorite
                ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-700 text-white'
                : 'bg-white/90 border-gray-300 hover:border-red-400 hover:bg-red-50'
            }`}
          >
            <svg 
              className={`w-5 h-5 ${isFavorite ? 'text-white' : 'text-gray-500'}`} 
              fill={isFavorite ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={isFavorite ? 0 : 2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>
      )}

      {comparisonMode && (
        <div className={`absolute top-4 ${onToggleFavorite ? 'left-16' : 'left-4'} z-30`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleComparison) {
                onToggleComparison();
              }
            }}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
              isSelectedForComparison
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700 text-white'
                : 'bg-white/90 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {isSelectedForComparison && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      )}

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
        comparisonMode={comparisonMode}
        isSelectedForComparison={isSelectedForComparison}
        displayImages={displayImages}
        isHovering={isHovering}
        venueScore={getVenueScore()}
        hasPrice={hasVenuePrice} // ⭐⭐ تمرير المعلومات ⭐⭐
        displayPrice={displayPrice} // ⭐⭐ تمرير المعلومات ⭐⭐
      />
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={getProfileImage()}
                  alt={`صورة شخصية لـ ${venue.name}`}
                  className="w-full h-full object-cover"
                  onError={handleProfileImageError}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                {getVenueScore()}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1 leading-tight">{venue.name}</h4>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {renderStars(venue.rating || 0)}
              </div>
              <span className="text-gray-600 text-sm font-medium">({venue.review_count || venue.reviewCount || 0} تقييم)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {eventTypeIcons.slice(0, 4).map((type, index) => (
                <div 
                  key={index}
                  className="text-sm bg-gradient-to-br from-gray-50 to-white px-3 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                  title={type.label}
                >
                  <span className="text-base">{type.icon}</span>
                  <span className="text-gray-700 font-semibold text-xs">{type.label}</span>
                </div>
              ))}
              {eventTypeIcons.length > 4 && (
                <div className="text-sm bg-gradient-to-br from-gray-50 to-white text-gray-500 px-3 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                  <span>+{eventTypeIcons.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ⭐⭐ Price Banner - تم التعديل هنا ⭐⭐ */}
        <div className="mb-5">
          <div className={`px-5 py-3 rounded-xl text-sm font-bold shadow-lg relative overflow-hidden ${
            hasVenuePrice 
              ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 text-white'
              : 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white'
          }`}>
            <div className="absolute top-0 left-0 w-2 h-full bg-white/30"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasVenuePrice ? (
                  <>
                    <span>{displayPrice?.type}:</span>
                    <span className="text-lg font-extrabold">{displayPrice?.amount?.toLocaleString()} ج.م</span>
                  </>
                ) : (
                  <>
                    <span>السعر:</span>
                    <span className="text-lg font-extrabold">تواصل لمعرفة السعر</span>
                  </>
                )}
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {hasVenuePrice ? 'عرض خاص' : 'تواصل معنا'}
              </span>
            </div>
          </div>
        </div>

        {venue.specialOffer && (
          <div className="mb-5">
            <div className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-white/30"></div>
              <div className="flex items-center justify-between">
                <span>{venue.specialOffer}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">عرض خاص</span>
              </div>
            </div>
          </div>
        )}

        {comparisonMode && isSelectedForComparison && (
          <div className="mb-5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-5 py-3 rounded-xl text-sm font-bold text-center border-2 border-blue-200 shadow-md">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              مختارة للمقارنة
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-700">
            <div className="p-2.5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm ml-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg">{venue.city || "غير محدد"}</span>
              <span className="text-gray-600 text-sm">{venue.governorate || "غير محدد"}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="text-gray-900 font-bold text-2xl">{venue.capacity || 0}</span>
              </div>
              <div className="text-gray-500 text-sm mt-2 font-semibold">سعة القاعة</div>
            </div>
          </div>
        </div>

        <VenueFeatures 
          venue={venue} 
          showAllFeatures={showAllFeatures}
          onToggleFeatures={() => setShowAllFeatures(!showAllFeatures)}
        />
        
        <VenueActions 
          onVenueClick={onVenueClick}
          venue={venue}
          onBookNow={handleBookNowClick}
          comparisonMode={comparisonMode}
          isSelectedForComparison={isSelectedForComparison}
          onToggleComparison={onToggleComparison}
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
  comparisonMode,
  isSelectedForComparison,
  displayImages,
  isHovering,
  venueScore,
  hasPrice, // ⭐⭐ إضافة هذه الخاصية ⭐⭐
  displayPrice // ⭐⭐ إضافة هذه الخاصية ⭐⭐
}) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  useEffect(() => {
    let interval;
    if (isHovering && displayImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === displayImages.length - 1 ? 0 : prev + 1
        );
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isHovering, displayImages.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0 && displayImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    } else if (distance < 0 && displayImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? displayImages.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    
    if (onShareClick) {
      onShareClick(e);
      return;
    }

    const shareData = {
      title: venue.name,
      text: `اكتشف ${venue.name} في ${venue.city} | سعة ${venue.capacity} شخص | تقييم ${venue.rating}/5`,
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
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? displayImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <div 
      className={`relative h-72 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 ${
        comparisonMode && isSelectedForComparison ? 'ring-4 ring-blue-500 ring-opacity-20' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="animate-pulse bg-gradient-to-br from-gray-700 to-gray-800 w-full h-full" />
        </div>
      )}

      <div className="relative w-full h-full">
        <img 
          src={imageError ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200" : displayImages[currentImageIndex]} 
          alt={`${venue.name} - صورة ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovering ? 'scale-110' : 'scale-100'}`}
          onLoad={onImageLoad}
          onError={onImageError}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {!venue.available && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="text-center p-6">
              <div className="text-white font-bold bg-gray-800/90 px-8 py-4 rounded-2xl text-lg mb-2 shadow-2xl">
                غير متاحة حالياً
              </div>
              <div className="text-white/80 text-sm">
                سيتم إعادة فتح الحجز قريباً
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-4 inset-x-5 flex justify-between items-start z-20">
          {/* ⭐⭐ Price Badge - تم التعديل هنا ⭐⭐ */}
          <div className={`backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-2xl ${
            hasPrice 
              ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90'
              : 'bg-gradient-to-r from-gray-600/90 to-gray-700/90'
          }`}>
            <div className="flex items-center gap-2">
              {hasPrice ? (
                <>
                  <span>{displayPrice?.type}:</span>
                  <span className="text-lg">{displayPrice?.amount?.toLocaleString()} ج.م</span>
                </>
              ) : (
                <>
                  <span>السعر:</span>
                  <span className="text-lg">تواصل لمعرفة السعر</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleShare}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all shadow-2xl hover:bg-white/30 hover:scale-110 border border-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-5 inset-x-5 flex justify-between items-end z-20">
          <div className="flex flex-col">
            <h3 className="text-white text-xl font-bold drop-shadow-2xl mb-1">{venue.name}</h3>
            <div className="flex items-center gap-2">
              {renderStars(venue.rating || 0)}
            </div>
          </div>

          {displayImages.length > 1 && (
            <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              {currentImageIndex + 1}/{displayImages.length}
            </div>
          )}
        </div>

        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-20 shadow-2xl hover:scale-110 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-20 shadow-2xl hover:scale-110 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125 w-8' 
                    : 'bg-white/50 hover:bg-white/70 w-2'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-14 left-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl z-20 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {venueScore}
          </div>
        </div>

        {comparisonMode && isSelectedForComparison && (
          <div className="absolute top-14 right-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-2xl z-20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              للمقارنة
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VenueFeatures = ({ venue, showAllFeatures, onToggleFeatures }) => {
  const getFeatureIcon = (feature) => {
    const featureIcons = {
      'حمام': (
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zM8 20H5v-2h3v2zm0-4H5v-2h3v2zm0-4H5v-2h3v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4v-2h4v2zm6 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3v-2h3v2z"/>
          </svg>
        </div>
      ),
      'كافيه': (
        <div className="p-1.5 bg-emerald-50 rounded-lg">
          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
          </svg>
        </div>
      ),
      'مكان للتصوير': (
        <div className="p-1.5 bg-purple-50 rounded-lg">
          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h3l2-2h6l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 3a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
          </svg>
        </div>
      ),
      'واي فاي': (
        <div className="p-1.5 bg-cyan-50 rounded-lg">
          <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
        </div>
      ),
      'تكييف': (
        <div className="p-1.5 bg-red-50 rounded-lg">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12H12zm0 0c0 3-2.5 5.5-5.5 5.5S1 15 1 12h11zm0 0c-3 0-5.5-2.5-5.5-5.5S9 1 12 1v11zm0 0c3 0 5.5 2.5 5.5 5.5S15 23 12 23V12z"/>
          </svg>
        </div>
      ),
      'موقف سيارات': (
        <div className="p-1.5 bg-orange-50 rounded-lg">
          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm6 6h-4v-4h4v4zm0-6h-4v-4h4v4zm6 6h-4v-4h4v4zm0-6h-4v-4h4v4z"/>
          </svg>
        </div>
      ),
      'خدمة طعام': (
        <div className="p-1.5 bg-yellow-50 rounded-lg">
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
      )
    };

    for (const [key, icon] of Object.entries(featureIcons)) {
      if (feature.includes(key)) {
        return icon;
      }
    }

    return (
      <div className="p-1.5 bg-gray-50 rounded-lg">
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  const getEnhancedFeatures = () => {
    const baseFeatures = venue.features || [];
    const enhancedFeatures = [...baseFeatures];
    
    if (venue.wc && !enhancedFeatures.some(f => f.includes('حمام'))) {
      enhancedFeatures.push('حمامات فاخرة');
    }
    
    if (venue.cafe && !enhancedFeatures.some(f => f.includes('كافيه'))) {
      enhancedFeatures.push('كافيه راقي');
    }
    
    if (venue.photo_spot && !enhancedFeatures.some(f => f.includes('مكان للتصوير'))) {
      enhancedFeatures.push('أماكن تصوير');
    }
    
    if (venue.wifi && !enhancedFeatures.some(f => f.includes('واي فاي'))) {
      enhancedFeatures.push('واي فاي مجاني');
    }
    
    if (venue.ac && !enhancedFeatures.some(f => f.includes('تكييف'))) {
      enhancedFeatures.push('تكييف مركزي');
    }
    
    if (venue.parking && !enhancedFeatures.some(f => f.includes('موقف'))) {
      enhancedFeatures.push('موقف سيارات');
    }
    
    if (venue.food_service && !enhancedFeatures.some(f => f.includes('طعام'))) {
      enhancedFeatures.push('خدمة طعام');
    }
    
    return enhancedFeatures;
  };

  const enhancedFeatures = getEnhancedFeatures();
  const displayFeatures = showAllFeatures ? enhancedFeatures : enhancedFeatures.slice(0, 4);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-gray-700 font-bold text-sm">المميزات</h5>
          {enhancedFeatures.length > 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatures();
              }}
              className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors"
            >
              {showAllFeatures ? 'عرض أقل' : `عرض ${enhancedFeatures.length - 4} أكثر`}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white text-gray-800 px-4 py-3 rounded-xl text-sm font-medium border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all hover:border-gray-200"
            >
              {getFeatureIcon(feature)}
              <span className="font-semibold">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const VenueActions = ({ 
  onVenueClick, 
  venue, 
  onBookNow,
  comparisonMode,
  isSelectedForComparison,
  onToggleComparison
}) => {
  return (
    <div className="mt-auto">
      <div className="flex gap-4">
        {comparisonMode ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleComparison) {
                  onToggleComparison();
                }
              }}
              className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all shadow-lg ${
                isSelectedForComparison
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
              }`}
            >
              {isSelectedForComparison ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onVenueClick(venue);
              }}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg"
            >
              التفاصيل
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onVenueClick(venue);
              }}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg"
            >
              التفاصيل
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onBookNow) {
                  onBookNow(venue);
                }
              }}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg"
            >
              احجز الآن
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VenueCard;