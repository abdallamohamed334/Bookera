import { useEffect, useRef } from 'react';

const VenueMap = ({ venue, governorate, city }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // This is a simplified map component
    // In a real application, you would integrate with Google Maps or similar
    console.log('Map location:', { venue, governorate, city });
  }, [venue, governorate, city]);

  const getMapImageUrl = () => {
    const query = encodeURIComponent(`${venue?.address || ''} ${city} ${governorate}`);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${query}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${query}&key=YOUR_GOOGLE_MAPS_API_KEY`;
  };

  const handleMapClick = () => {
    if (venue?.mapLink) {
      window.open(venue.mapLink, '_blank');
    } else {
      const query = encodeURIComponent(`${venue?.address || ''} ${city} ${governorate}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
      {/* Fallback map representation */}
      <div 
        className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleMapClick}
      >
        <div className="text-center text-white">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="font-semibold">موقع القاعة على الخريطة</p>
          <p className="text-sm opacity-90 mt-1">{venue?.address}</p>
          <p className="text-sm opacity-90">{city}، {governorate}</p>
          <div className="mt-2 text-xs bg-white text-blue-600 px-3 py-1 rounded-full inline-block">
            انقر لفتح الخريطة
          </div>
        </div>
      </div>
      
      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs">
        <span className="text-gray-600">خرائط جوجل</span>
      </div>
    </div>
  );
};

export default VenueMap;