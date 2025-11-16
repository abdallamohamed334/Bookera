import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const StickyPriceBox = ({ venue, onBookNow }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 300; // عندما يصل السكرول لهذا المستوى يظهر البوكس
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!venue || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-sm">{venue.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            {venue.originalPrice ? (
              <>
                <span className="text-lg font-bold text-green-600">
                  {parseInt(venue.price)?.toLocaleString()} ج
                </span>
                <span className="text-sm text-red-500 line-through">
                  {parseInt(venue.originalPrice)?.toLocaleString()} ج
                </span>
                {venue.discount && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    خصم {venue.discount}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-bold text-green-600">
                {parseInt(venue.price)?.toLocaleString()} ج
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onBookNow(venue)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          احجز الآن
        </button>
      </div>
    </motion.div>
  );
};

export default StickyPriceBox;