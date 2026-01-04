import { motion, AnimatePresence } from "framer-motion";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [showFeaturedBadge, setShowFeaturedBadge] = useState(false);

  const sliderRef = useRef(null);
  const autoPlayTimer = useRef(null);

  useEffect(() => {
    if (isHovering && isAutoPlaying) {
      autoPlayTimer.current = setInterval(() => {
        setCurrentImageIndex(prev => 
          (prev + 1) % (venue.images?.length || 1)
        );
      }, 3000);
    }
    return () => clearInterval(autoPlayTimer.current);
  }, [isHovering, isAutoPlaying, venue.images]);

  // أنيميشن دخول البادج
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeaturedBadge(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const handleShareClick = async (e) => {
    e.stopPropagation();
    if (onShareVenue) {
      onShareVenue(venue, e);
    } else {
      const shareData = {
        title: `📍 ${venue.name}`,
        text: `✨ اكتشف ${venue.name} في ${venue.city} \n⭐ تقييم ${venue.rating || 5}/5 \n👥 سعة ${venue.capacity} شخص`,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(venue.id || venue._id, e);
  };

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e) => {
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const diffX = touchEnd.x - touchStart.x;
    const diffY = Math.abs(touchEnd.y - touchStart.y);
    
    if (Math.abs(diffX) > 50 && diffY < 50) {
      const images = venue.images || [venue.image];
      if (diffX > 0) {
        setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
      } else {
        setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
      }
    }
  };

  const getVenueStatus = () => {
    const statuses = [];
    if (!venue.available) statuses.push({ label: "🔒 غير متاحة", color: "from-gray-700 to-gray-900", icon: "🔒" });
    if (venue.is_new) statuses.push({ label: "🆕 جديد", color: "from-emerald-500 to-emerald-600", icon: "✨" });
    if (venue.discount > 0) statuses.push({ label: `🎯 ${venue.discount}% خصم`, color: "from-red-500 to-red-600", icon: "💎" });
    if (venue.is_popular) statuses.push({ label: "🔥 الأكثر طلباً", color: "from-amber-500 to-amber-600", icon: "🔥" });
    return statuses;
  };

  const getDisplayPrice = () => {
    const price = venue.price || venue.starting_price || venue.price_range?.min;
    return price ? `${price.toLocaleString()} ج.م` : "تواصل للسعر";
  };

  const getImages = () => {
    const images = venue.images || [];
    if (images.length === 0 && venue.image) {
      return [venue.image];
    }
    return images.length > 0 ? images : ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200"];
  };

  const images = getImages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 backdrop-blur-sm group"
      onClick={() => onVenueClick(venue)}
    >
      {/* 🔮 Top Badges */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          {getVenueStatus().map((status, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className={`bg-gradient-to-r ${status.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2`}
            >
              <span className="text-lg">{status.icon}</span>
              <span>{status.label}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col gap-2">
          {showFeaturedBadge && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl backdrop-blur-md"
            >
              ⭐ مختار بواسطة Bookera
            </motion.div>
          )}
        </div>
      </div>

      {/* ❤️ Favorite Button */}
      <motion.div 
        className="absolute top-4 right-4 z-30"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={handleFavoriteClick}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md ${
            isFavorite
              ? 'bg-gradient-to-br from-red-500 via-pink-500 to-red-600 border-red-500 shadow-red-500/30'
              : 'bg-white/90 border-white/50 hover:border-red-300 hover:bg-red-50/90 shadow-white/20'
          }`}
        >
          <motion.svg
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-6 h-6 ${isFavorite ? 'text-white' : 'text-gray-500'}`}
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </motion.svg>
        </button>
      </motion.div>

      {/* 🖼️ Image Slider - Fancy Version */}
      <div 
        className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <motion.img
              src={images[currentImageIndex]}
              alt={`${venue.name} - صورة ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 3 }}
            />
            
            {/* 🌟 Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            
            {/* ✨ Sparkle Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%'
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2 
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 🎮 Slider Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(idx);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                idx === currentImageIndex 
                  ? 'w-10 h-2 bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            >
              {idx === currentImageIndex && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 📸 Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-2xl border border-white/20">
            <span className="text-yellow-300">{currentImageIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{images.length}</span>
          </div>
        )}

        {/* 🎯 Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl border border-white/30 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl border border-white/30 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* 💎 Price Tag on Image */}
        <div className="absolute bottom-6 right-6 z-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-white px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-amber-300/50"
          >
            <div className="text-center">
              <div className="text-xs font-semibold opacity-90 mb-1">بداية السعر</div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <span>{getDisplayPrice()}</span>
                <span className="text-lg">👑</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🌟 Rating Badge */}
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md border border-blue-400/50">
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <motion.div
                  className="absolute inset-0 bg-yellow-300 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold">{venue.rating || 5.0}</span>
              <span className="text-sm opacity-90">/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 Venue Info Section */}
      <div className="p-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5"></div>
        
        {/* Venue Header */}
        <div className="relative mb-6">
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            {venue.name}
          </motion.h3>
          
          {/* Location & Capacity */}
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{venue.city || "غير محدد"}</div>
                <div className="text-gray-600 text-sm">{venue.governorate || "غير محدد"}</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {venue.capacity || 0}
              </div>
              <div className="text-gray-600 text-sm font-semibold mt-1">سعة القاعة</div>
            </motion.div>
          </div>
        </div>

        {/* ✨ Features Grid */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            المميزات الرئيسية
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🚗", label: "موقف سيارات", active: venue.parking },
              { icon: "📶", label: "واي فاي", active: venue.wifi },
              { icon: "❄️", label: "تكييف", active: venue.ac },
              { icon: "📸", label: "أماكن تصوير", active: venue.photo_spot },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  feature.active 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className={`font-semibold ${feature.active ? 'text-gray-800' : 'text-gray-400'}`}>
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🎯 Action Buttons */}
        <motion.div 
          className="flex gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onVenueClick(venue);
            }}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl group relative overflow-hidden"
          >
            <span className="relative z-10">استكشاف التفاصيل ✨</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBookNow?.(venue);
            }}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl group relative overflow-hidden"
          >
            <span className="relative z-10">حجز فوري 🎯</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </button>
        </motion.div>
      </div>

      {/* 🔮 Floating Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
    </motion.div>
  );
};

export default VenueCard;