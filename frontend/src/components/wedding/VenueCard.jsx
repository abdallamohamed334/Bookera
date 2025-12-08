import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const VenueCard = ({ 
  venue, 
  onVenueClick, 
  isFavorite, 
  onToggleFavorite, 
  onShareVenue,
  comparisonMode = false,
  isSelectedForComparison = false,
  onToggleComparison,
  onBookNow
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [profileImageError, setProfileImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
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

  // الحصول على أول 5 صور فقط
  const getDisplayImages = () => {
    if (!venue.images || venue.images.length === 0) {
      return venue.image ? [venue.image] : ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200"];
    }
    return venue.images.slice(0, 5);
  };

  // دالة لتحويل أنواع المناسبات إلى أيقونات
  const getEventTypeIcons = () => {
    const eventTypes = venue.event_types || [];
    const icons = [];
    
    if (eventTypes.includes('فرح')) icons.push('💒');
    if (eventTypes.includes('خطوبة')) icons.push('💍');
    if (eventTypes.includes('كتب_كتاب')) icons.push('📖');
    if (eventTypes.includes('عيد_ميلاد')) icons.push('🎂');
    if (eventTypes.includes('مؤتمرات')) icons.push('👔');
    
    return icons.length > 0 ? icons : ['💒'];
  };

  // الحصول على الصورة الشخصية
  const getProfileImage = () => {
    if (profileImageError) {
      return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
    }
    if (venue.profile_image) return venue.profile_image;
    if (venue.image) return venue.image;
    if (venue.images && venue.images.length > 0) return venue.images[0];
    return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200";
  };

  const displayImages = getDisplayImages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: comparisonMode ? 1.02 : 1.02 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:shadow-2xl shadow-lg relative w-full max-w-md ${
        comparisonMode && isSelectedForComparison 
          ? 'ring-2 ring-blue-500 ring-offset-2' 
          : ''
      }`}
      onClick={() => onVenueClick(venue)}
    >
      {/* Comparison Checkbox في وضع المقارنة */}
      {comparisonMode && (
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleComparison) {
                onToggleComparison();
              }
            }}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
              isSelectedForComparison
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white/90 border-gray-300 hover:border-blue-400'
            }`}
          >
            {isSelectedForComparison && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
        getEventTypeIcons={getEventTypeIcons}
        comparisonMode={comparisonMode}
        isSelectedForComparison={isSelectedForComparison}
        displayImages={displayImages}
        isHovering={isHovering}
      />
      
      <div className="p-5 flex-grow flex flex-col">
        {/* Profile Image and Header Section */}
        <div className="flex items-start gap-4 mb-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-gray-100">
              <img 
                src={getProfileImage()}
                alt={`صورة شخصية لـ ${venue.name}`}
                className="w-full h-full object-cover"
                onError={handleProfileImageError}
              />
            </div>
          </div>

          {/* Venue Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 leading-tight">{venue.name}</h4>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-base font-semibold text-gray-800">{venue.rating || 0}</span>
              </div>
              <span className="text-gray-600 text-sm">({venue.review_count || 0} تقييم)</span>
            </div>

            {/* Event Types Display */}
            <div className="flex items-center gap-2 mb-3">
              {getEventTypeIcons().slice(0, 3).map((icon, index) => (
                <span 
                  key={index}
                  className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1 shadow-sm"
                  title={getEventTypeLabel(icon)}
                >
                  {icon}
                </span>
              ))}
              {getEventTypeIcons().length > 3 && (
                <span className="text-sm bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg shadow-sm">
                  +{getEventTypeIcons().length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Special Offer Banner */}
        {venue.special_offer && (
          <div className="mb-4 self-start">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
              {venue.special_offer}
            </div>
          </div>
        )}

        {/* Comparison Badge */}
        {comparisonMode && isSelectedForComparison && (
          <div className="mb-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium text-center border border-blue-200 shadow-sm">
            ✓ مختارة للمقارنة
          </div>
        )}
        
        {/* Location and Capacity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-700 text-sm">
            <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate font-medium">{venue.city}، {venue.governorate}</span>
          </div>
          
          {/* Capacity with icon */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-gray-900 font-bold text-lg">{venue.capacity || 0}</span>
            </div>
            <div className="text-gray-500 text-sm mt-1.5 text-center font-medium">شخص</div>
          </div>
        </div>

        <VenueFeatures venue={venue} />
        <VenueActions 
          onVenueClick={onVenueClick}
          venue={venue}
          onBookNow={handleBookNowClick}
          comparisonMode={comparisonMode}
          isSelectedForComparison={isSelectedForComparison}
          onToggleComparison={onToggleComparison}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
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
  getEventTypeIcons,
  comparisonMode,
  isSelectedForComparison,
  displayImages,
  isHovering
}) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Auto slide on hover
  useEffect(() => {
    let interval;
    if (isHovering && displayImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === displayImages.length - 1 ? 0 : prev + 1
        );
      }, 3000);
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
      // Swipe left
      setCurrentImageIndex((prev) => 
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    } else if (distance < 0 && displayImages.length > 1) {
      // Swipe right
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
      text: `اكتشف ${venue.name} - ${venue.city} | تواصل للاستعلام عن الأسعار`,
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
      className={`relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 ${
        comparisonMode && isSelectedForComparison ? 'ring-2 ring-blue-500' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="animate-pulse bg-gray-700 w-full h-full" />
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full h-full">
        <img 
          src={imageError ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200" : displayImages[currentImageIndex]} 
          alt={`${venue.name} - صورة ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovering ? 'scale-105' : 'scale-100'}`}
          onLoad={onImageLoad}
          onError={onImageError}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Overlay for unavailable venues */}
        {!venue.available && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-10">
            <span className="text-white font-bold bg-gray-800/90 px-6 py-3 rounded-full text-base">
              غير متاحة حالياً
            </span>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-start z-20">
          {/* City Badge - Left Side */}
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl">
            {venue.city}
          </div>

          {/* Share Button - Right Side */}
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm text-gray-900 p-2.5 rounded-full transition-all shadow-xl hover:bg-white hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 inset-x-4 flex justify-between items-end z-20">
          {/* In/Out Door Indicator - Left Side */}
          <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur-sm ${
            venue.wedding_specific?.openAir 
              ? 'bg-green-500/90 text-white' 
              : 'bg-blue-500/90 text-white'
          }`}>
            {venue.wedding_specific?.openAir ? 'أوبن دور' : 'إن دور'}
          </span>

          {/* Image Count - Right Side */}
          {displayImages.length > 1 && (
            <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
              {currentImageIndex + 1}/{displayImages.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-20 shadow-xl hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-20 shadow-xl hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Indicators - Bottom Center */}
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
                    ? 'bg-white scale-125 w-6' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Comparison Selection Indicator */}
        {comparisonMode && isSelectedForComparison && (
          <div className="absolute top-14 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 backdrop-blur-sm">
            ✓ مختارة
          </div>
        )}
      </div>
    </div>
  );
};

// دالة مساعدة للحصول على تسمية نوع المناسبة
const getEventTypeLabel = (icon) => {
  const labels = {
    '💒': 'فرح',
    '💍': 'خطوبة', 
    '📖': 'كتب كتاب',
    '🎂': 'عيد ميلاد',
    '👔': 'مؤتمرات'
  };
  return labels[icon] || 'مناسبة';
};

const VenueFeatures = ({ venue }) => {
  const getFeatureIcon = (feature) => {
    const featureIcons = {
      'حمام': (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zM8 20H5v-2h3v2zm0-4H5v-2h3v2zm0-4H5v-2h3v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4v-2h4v2zm6 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3v-2h3v2z"/>
        </svg>
      ),
      'كافيه': (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
        </svg>
      ),
      'مكان للتصوير': (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h3l2-2h6l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 3a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
        </svg>
      ),
      'واي فاي': (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
        </svg>
      ),
      'تكييف': (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12H12zm0 0c0 3-2.5 5.5-5.5 5.5S1 15 1 12h11zm0 0c-3 0-5.5-2.5-5.5-5.5S9 1 12 1v11zm0 0c3 0 5.5 2.5 5.5 5.5S15 23 12 23V12z"/>
        </svg>
      )
    };

    for (const [key, icon] of Object.entries(featureIcons)) {
      if (feature.includes(key)) {
        return icon;
      }
    }

    return (
      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  const getEnhancedFeatures = () => {
    const baseFeatures = venue.features || [];
    const enhancedFeatures = [...baseFeatures];
    
    if (venue.wc && !enhancedFeatures.some(f => f.includes('حمام'))) {
      enhancedFeatures.push('حمام');
    }
    
    if (venue.cafe && !enhancedFeatures.some(f => f.includes('كافيه'))) {
      enhancedFeatures.push('كافيه');
    }
    
    if (venue.photo_spot && !enhancedFeatures.some(f => f.includes('مكان للتصوير'))) {
      enhancedFeatures.push('مكان للتصوير');
    }
    
    if (venue.wifi && !enhancedFeatures.some(f => f.includes('واي فاي'))) {
      enhancedFeatures.push('واي فاي');
    }
    
    if (venue.ac && !enhancedFeatures.some(f => f.includes('تكييف'))) {
      enhancedFeatures.push('تكييف');
    }
    
    return enhancedFeatures;
  };

  const enhancedFeatures = getEnhancedFeatures();

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 flex-grow">
        {enhancedFeatures.slice(0, 4).map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors"
          >
            {getFeatureIcon(feature)}
            <span className="font-semibold">{feature}</span>
          </div>
        ))}
        {enhancedFeatures.length > 4 && (
          <div className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">+{enhancedFeatures.length - 4}</span>
          </div>
        )}
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
  onToggleComparison,
  isFavorite,
  onToggleFavorite
}) => (
  <div className="mt-auto">
    <div className="flex gap-3">
      {comparisonMode ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleComparison) {
                onToggleComparison();
              }
            }}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border shadow-sm ${
              isSelectedForComparison
                ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {isSelectedForComparison ? 'إزالة' : 'مقارنة'}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onVenueClick(venue);
            }}
            className="flex-1 py-3.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] shadow-lg"
          >
            تفاصيل
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onVenueClick(venue);
            }}
            className="flex-1 py-3.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] shadow-lg"
          >
            تفاصيل
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) {
                onToggleFavorite(venue);
              }
            }}
            className={`p-3.5 rounded-xl font-bold text-sm transition-all border shadow-sm ${
              isFavorite
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </>
      )}
    </div>
  </div>
);

export default VenueCard;