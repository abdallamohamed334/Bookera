import { motion } from "framer-motion";
import { useState, useRef } from "react";

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
      return venue.image ? [venue.image] : ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600"];
    }
    return venue.images.slice(0, 5); // فقط أول 5 صور
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: comparisonMode ? 1.02 : 1.02 }}
      className={`bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:shadow-lg relative w-full max-w-md ${
        comparisonMode && isSelectedForComparison 
          ? 'border-2 border-blue-500 shadow-blue-100' 
          : 'border-gray-200 hover:border-gray-300'
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
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
              isSelectedForComparison
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 hover:border-blue-400'
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
        getDisplayImages={getDisplayImages}
      />
      
      <div className="p-4 flex-grow flex flex-col">
        {/* Profile Image and Header Section */}
        <div className="flex items-start gap-3 mb-3">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100">
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
            <h4 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 leading-tight">{venue.name}</h4>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">{venue.rating || 0}</span>
              </div>
              <span className="text-gray-500 text-xs">({venue.review_count || 0} تقييم)</span>
            </div>

            {/* Event Types Display */}
            <div className="flex items-center gap-1 mb-2">
              {getEventTypeIcons().slice(0, 3).map((icon, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-lg border border-gray-200 flex items-center gap-1"
                  title={getEventTypeLabel(icon)}
                >
                  {icon}
                </span>
              ))}
              {getEventTypeIcons().length > 3 && (
                <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-lg">
                  +{getEventTypeIcons().length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Special Offer Banner (صغير على الجانب) */}
        {venue.special_offer && (
          <div className="mb-3 self-start">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
              {venue.special_offer}
            </div>
          </div>
        )}

        {/* Comparison Badge */}
        {comparisonMode && isSelectedForComparison && (
          <div className="mb-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium text-center border border-blue-200">
            ✓ مختارة للمقارنة
          </div>
        )}
        
        {/* Location and Capacity */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{venue.city}، {venue.governorate}</span>
          </div>
          
          {/* Capacity with icon */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-gray-800 font-bold">{venue.capacity || 0}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1 text-center">شخص</div>
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
  getDisplayImages
}) => {
  const scrollContainerRef = useRef(null);
  
  // الحصول على أول 5 صور فقط
  const displayImages = getDisplayImages();

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
    <div className={`relative h-52 flex-shrink-0 bg-gray-100 overflow-hidden ${
      comparisonMode && isSelectedForComparison ? 'ring-2 ring-blue-500' : ''
    }`}>
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
        {displayImages.map((img, index) => (
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
      {displayImages.length > 1 && (
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

      {/* Image Indicators - فقط أول 5 صور */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {displayImages.slice(0, 5).map((_, index) => (
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

      {/* Price Range - إزالة الأسعار */}
      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
        تواصل للاستعلام
      </div>

      {/* City */}
      <div className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium">
        {venue.city}
      </div>

      {/* Event Types */}
      <div className="absolute top-12 left-3 flex gap-1 z-20">
        {getEventTypeIcons().map((icon, index) => (
          <div 
            key={index}
            className="bg-white/90 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg border border-gray-200"
            title={getEventTypeLabel(icon)}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Image Count - تظهر فقط إذا كان هناك أكثر من 5 صور */}
      {venue.images && venue.images.length > 5 && (
        <div className="absolute top-12 right-3 bg-gray-800/80 text-white px-2 py-1 rounded-full text-xs">
          +{venue.images.length - 5}
        </div>
      )}

      {/* Comparison Selection Indicator */}
      {comparisonMode && isSelectedForComparison && (
        <div className="absolute top-3 left-12 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg z-20">
          ✓ مختارة
        </div>
      )}

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="absolute bottom-3 left-3 p-2 bg-white text-gray-600 rounded-full transition-all shadow-lg hover:bg-gray-100 border border-gray-300 z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
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
  // استبدال الإيموجي بأيقونات أفضل
  const getFeatureIcon = (feature) => {
    const featureIcons = {
      'حمام': (
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zM8 20H5v-2h3v2zm0-4H5v-2h3v2zm0-4H5v-2h3v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4v-2h4v2zm6 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3v-2h3v2z"/>
        </svg>
      ),
      'كافيه': (
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
        </svg>
      ),
      'مكان للتصوير': (
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h3l2-2h6l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 3a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
        </svg>
      ),
      'واي فاي': (
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
        </svg>
      ),
      'تكييف': (
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12H12zm0 0c0 3-2.5 5.5-5.5 5.5S1 15 1 12h11zm0 0c-3 0-5.5-2.5-5.5-5.5S9 1 12 1v11zm0 0c3 0 5.5 2.5 5.5 5.5S15 23 12 23V12z"/>
        </svg>
      )
    };

    // البحث عن الأيقونة المناسبة
    for (const [key, icon] of Object.entries(featureIcons)) {
      if (feature.includes(key)) {
        return icon;
      }
    }

    // أيقونة افتراضية إذا لم يتم العثور على تطابق
    return (
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  // الحصول على المميزات مع أيقونات محسنة
  const getEnhancedFeatures = () => {
    const baseFeatures = venue.features || [];
    
    // إضافة مميزات من خصائص القاعة إذا لم تكن موجودة
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
            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 flex items-center gap-2"
          >
            {getFeatureIcon(feature)}
            <span>{feature}</span>
          </div>
        ))}
        {enhancedFeatures.length > 4 && (
          <div className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            <span>+{enhancedFeatures.length - 4}</span>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-4">
         
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm border border-gray-300 ${
          venue.wedding_specific?.openAir 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {venue.wedding_specific?.openAir ? 'أوبن دور' : 'إن دور'}
        </span>
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
    <div className="flex gap-2">
      {comparisonMode ? (
        // أزرار وضع المقارنة
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleComparison) {
                onToggleComparison();
              }
            }}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border ${
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
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.02]"
          >
            تفاصيل
          </button>
        </>
      ) : (
        // أزرار الوضع العادي
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onVenueClick(venue);
            }}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.02]"
          >
            تفاصيل
          </button>
          
          {/* زر حجز سريع */}
          
        </>
      )}
    </div>
  </div>
);

export default VenueCard;