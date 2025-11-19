import { motion } from "framer-motion";
import ShareButton from "./ShareButton";
import { useState, useRef, useEffect } from "react";

const PhotographerCard = ({ photographer, onPhotographerClick, renderStars }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleCardClick = () => {
    onPhotographerClick(photographer);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // هنا بتكون وظيفة الشير جاهزة
    console.log("Sharing photographer:", photographer.name);
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

  // السلايدر اليدوي
  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    e.stopPropagation();
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // السلايدر التلقائي
  useEffect(() => {
    if (!photographer.portfolio || photographer.portfolio.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev === photographer.portfolio.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [photographer.portfolio]);

  // تحريك السلايدر عند تغيير currentSlide
  useEffect(() => {
    if (scrollContainerRef.current && photographer.portfolio) {
      scrollContainerRef.current.scrollTo({
        left: currentSlide * scrollContainerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, photographer.portfolio]);

  const images = photographer.portfolio?.map(album => album.coverImage) || [photographer.profileImage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all h-full flex flex-col hover:border-blue-400 hover:shadow-xl group"
      onClick={handleCardClick}
    >
      {/* Header with Scrollable Image Gallery */}
      <div className="relative h-56 flex-shrink-0 overflow-hidden">
        {/* Scrollable Image Container */}
        <div
          ref={scrollContainerRef}
          className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full snap-center flex-shrink-0">
              <img 
                src={image} 
                alt={`${photographer.name} work ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400";
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* السعر */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
            {parseInt(photographer.price)?.toLocaleString() || photographer.price} جنيه
          </div>
          
          {/* الخصومات */}
          {hasDiscount && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-lg animate-pulse">
              خصم حتى {maxDiscount}% 🎁
            </div>
          )}
        </div>

        {/* المدينة والتقييم */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
            {photographer.city}
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
            {renderStars(photographer.rating)}
          </div>
        </div>

        {/* زر المشاركة - شغال */}
        <div className="absolute bottom-3 left-3">
          <ShareButton 
            photographer={photographer}
            onShare={handleShare}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 transition-all duration-300 shadow-lg rounded-lg p-2"
          />
        </div>

        {/* مؤشر السلايدر */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              ></button>
            ))}
          </div>
        )}

        {/* أسهم التنقل */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(prev => prev === 0 ? images.length - 1 : prev - 1);
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(prev => prev === images.length - 1 ? 0 : prev + 1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
            >
              ›
            </button>
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* الاسم والخبرة */}
        <div className="flex justify-between items-start mb-3">
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
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {photographer.city}، {photographer.governorate}
        </p>

        {/* تفاصيل الخصومات */}
        {hasDiscount && (
          <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-red-700 font-semibold text-sm">عروض خصومات:</span>
              <span className="text-red-600 text-xs">Limited Time ⏰</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {discounts.slice(0, 2).map((discount, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium"
                >
                  {discount.name} - {discount.discount}%
                </span>
              ))}
              {discounts.length > 2 && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                  +{discounts.length - 2} عروض
                </span>
              )}
            </div>
          </div>
        )}

        {/* الخدمات */}
        <div className="flex flex-wrap gap-2 mb-4 flex-grow">
          {photographer.services?.slice(0, 4).map((service, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200"
            >
              {service}
            </span>
          ))}
          {photographer.services?.length > 4 && (
            <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200">
              +{photographer.services.length - 4} أكثر
            </span>
          )}
        </div>

        {/* الأزرار */}
        <div className="mt-auto flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
            عرض التفاصيل
          </button>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {photographer.responseTime || "رد سريع"}
          </span>
          <span className="flex items-center gap-1">
            {hasDiscount ? (
              <span className="text-red-500 font-semibold animate-pulse">عروض حصرية 🔥</span>
            ) : (
              <span className="text-green-500">أسعار تنافسية</span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotographerCard;