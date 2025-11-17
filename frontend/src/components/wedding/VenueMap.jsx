import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const VenueMap = ({ venue, governorate, city }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 🔥 إصلاح: إنشاء رابط الخريطة بشكل آمن
  const getMapUrl = () => {
    try {
      // استخدام بيانات القاعة مباشرة إذا كانت متوفرة
      const venueAddress = venue?.address || `${venue?.name}, ${city}, ${governorate}, مصر`;
      return `https://maps.google.com/maps?q=${encodeURIComponent(venueAddress)}&t=m&z=15&ie=UTF8&iwloc=&output=embed`;
    } catch (error) {
      console.error('خطأ في إنشاء رابط الخريطة:', error);
      return `https://maps.google.com/maps?q=${encodeURIComponent('مصر')}&t=m&z=10&output=embed`;
    }
  };

  const mapUrl = getMapUrl();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapLoaded && !mapError) {
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [mapLoaded, mapError]);

  const handleMapLoad = () => {
    console.log('✅ تم تحميل الخريطة بنجاح');
    setMapLoaded(true);
    setShowFallback(false);
    setMapError(false);
  };

  const handleMapError = () => {
    console.log('❌ فشل تحميل الخريطة');
    setMapError(true);
    setShowFallback(true);
    setMapLoaded(false);
  };

  // 🔥 إصلاح: فتح الخريطة في صفحة جديدة
  const openInGoogleMaps = () => {
    try {
      const venueAddress = venue?.address || `${venue?.name}, ${city}, ${governorate}, مصر`;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('خطأ في فتح الخريطة:', error);
      // رابط افتراضي
      window.open('https://www.google.com/maps', '_blank', 'noopener,noreferrer');
    }
  };

  // 🔥 إصلاح: التحقق من البيانات
  if (!venue || !governorate || !city) {
    return (
      <div className="w-full h-64 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-3xl mb-2">🗺️</div>
          <p>بيانات الموقع غير متوفرة</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-100"
    >
      {/* 🔥 إصلاح: iframe محسن */}
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        className={`absolute inset-0 transition-opacity duration-500 ${
          mapLoaded ? 'opacity-100' : 'opacity-0'
        } ${showFallback ? 'hidden' : 'block'}`}
        title={`خريطة ${venue.name}`}
        onLoad={handleMapLoad}
        onError={handleMapError}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      {/* Loading State */}
      {!mapLoaded && !showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">جاري تحميل الخريطة...</p>
            <p className="text-gray-500 text-xs mt-1">قد يستغرق بضع ثوان</p>
          </div>
        </div>
      )}

      {/* 🔥 إصلاح: Fallback Map محسن */}
      {showFallback && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6"
        >
          <div className="text-5xl mb-4">🗺️</div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-lg mb-2">{venue.name}</p>
            <p className="text-gray-600 mb-1">
              {venue.address ? venue.address : `${city}، ${governorate}`}
            </p>
            <p className="text-blue-600 text-sm font-medium">📍 موقع القاعة</p>
          </div>
          
          {/* 🔥 إصلاح: زر فتح الخريطة */}
          <button
            onClick={openInGoogleMaps}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2"
          >
            <span>🌍</span>
            فتح في خرائط Google
          </button>

          <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs text-gray-600">
            انقر فوق الزر لفتح الخريطة
          </div>
        </motion.div>
      )}

      {/* 🔥 إصلاح: Map Controls */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button 
          onClick={openInGoogleMaps}
          className="bg-white px-3 py-2 rounded-lg text-sm text-gray-700 shadow-md hover:bg-gray-50 transition-colors flex items-center gap-1"
        >
          <span>🗺️</span>
          فتح الخريطة
        </button>
      </div>

      {/* 🔥 إضافة: معلومات إضافية */}
      <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
        {city}، {governorate}
      </div>
    </motion.div>
  );
};

export default VenueMap;