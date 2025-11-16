import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const VenueMap = ({ venue, governorate, city }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${venue.name}, ${city}, ${governorate}, مصر`
  )}&t=m&z=15&ie=UTF8&iwloc=&output=embed`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapLoaded) {
        setShowFallback(true);
      }
    }, 5000); // بعد 5 ثواني إذا ماحملتش

    return () => clearTimeout(timer);
  }, [mapLoaded]);

  const handleMapLoad = () => {
    setMapLoaded(true);
    setShowFallback(false);
  };

  const handleMapError = () => {
    setShowFallback(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-100"
    >
      {/* خريطة Google iframe */}
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
        }`}
        title={`خريطة ${venue.name}`}
        onLoad={handleMapLoad}
        onError={handleMapError}
        loading="lazy"
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

      {/* Fallback Map إذا فشل التحميل */}
      {showFallback && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
          <div className="text-4xl mb-3">🗺️</div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-lg">{venue.name}</p>
            <p className="text-gray-600">{city}، {governorate}</p>
            <p className="text-blue-600 text-sm mt-2">📍 موقع القاعة</p>
          </div>
          
          {/* خريطة بديلة مرسومة */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 px-3 py-1 rounded-full text-xs text-gray-600">
            انقر لفتح في خرائط Google
          </div>

          {/* رابط لفتح الخريطة في صفحة جديدة */}
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${venue.name}, ${city}, ${governorate}, مصر`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
            title="افتح في خرائط Google"
          />
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button 
          onClick={() => window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${venue.name}, ${city}, ${governorate}, مصر`
            )}`,
            '_blank'
          )}
          className="bg-white px-3 py-1 rounded-lg text-xs text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          فتح في خرائط
        </button>
      </div>
    </motion.div>
  );
};

export default VenueMap;