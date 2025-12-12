import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// تخصيص أيقونات الماركر
const createCustomIcon = (color = 'red') => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        position: relative;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const VenuesMap = ({ venues, onVenueClick, onVenueHover, activeVenueId }) => {
  const [mapCenter, setMapCenter] = useState([30.7875, 31.0000]); // مركز الغربية
  const [zoom, setZoom] = useState(10);
  const [markers, setMarkers] = useState([]);
  const [bounds, setBounds] = useState(null);

  // مصفوفة الألوان للماركرز
  const markerColors = {
    'قاعة_أفراح': '#e74c3c',
    'قصر': '#9b59b6',
    'فندق': '#3498db',
    'منتجع': '#2ecc71',
    'نادي': '#f39c12',
    'default': '#e74c3c'
  };

  // إحداثيات المدن المحددة (بدقة أكبر)
  const cityCoordinates = {
    'طنطا': [30.7865, 31.0018],
    'المحلة الكبري': [30.9756, 31.1664],
    'زفتى': [30.7116, 31.2444],
    'سمنود': [30.9611, 31.2414],
    'بسيون': [30.9398, 31.0396],
    'قطور': [30.9756, 30.9497],
    'السنطه': [30.9772, 30.9611],
    'كفر الزيات': [30.8246, 30.8181],
    'صفتا': [30.8658, 30.8764],
    'شيخون': [30.9456, 30.8897],
    'شبرا النملة': [30.8500, 31.0000],
    // المدن الأخرى
    'كفر الشيخ': [31.1117, 30.9399],
    'دمياط': [31.4167, 31.8133],
    'الدقهلية': [31.0333, 31.3833],
    'القليوبية': [30.4167, 31.2167],
    'القاهرة': [30.0444, 31.2357],
    'الإسكندرية': [31.2001, 29.9187]
  };

  // تحضير بيانات الماركرز
  useEffect(() => {
    if (!venues || venues.length === 0) {
      setMarkers([]);
      return;
    }

    console.log('📍 جاري تحضير ماركرز للخريطة:', venues.length, 'قاعة');

    const newMarkers = venues.map(venue => {
      // الحصول على إحداثيات المدينة
      const getCoordinatesByCity = (city) => {
        if (!city) return [30.7875 + (Math.random() - 0.5) * 0.2, 31.0000 + (Math.random() - 0.5) * 0.2];
        
        // البحث عن المدينة في القاموس (بدون حساسية لحالة الأحرف)
        const cityLower = city.toLowerCase().trim();
        for (const [key, coords] of Object.entries(cityCoordinates)) {
          if (key.toLowerCase().includes(cityLower) || cityLower.includes(key.toLowerCase())) {
            console.log(`✅ عثرنا على إحداثيات لـ ${city}: ${coords}`);
            return coords;
          }
        }
        
        // إذا لم توجد المدينة في القاموس، استخدام إحداثيات عشوائية حول الغربية
        console.log(`⚠️ لم نجد إحداثيات لـ ${city}، استخدام إحداثيات عشوائية`);
        return [
          30.7875 + (Math.random() - 0.5) * 0.3, // خط عرض بين 30.5 و 31.0
          31.0000 + (Math.random() - 0.5) * 0.3  // خط طول بين 30.8 و 31.2
        ];
      };

      const city = venue.city || venue.governorate || 'طنطا';
      const coords = venue.coordinates || getCoordinatesByCity(city);
      
      return {
        id: venue.id || venue._id || Math.random().toString(),
        position: coords,
        name: venue.name || 'قاعة بدون اسم',
        type: venue.type || 'قاعة_أفراح',
        city: city,
        price: venue.price || 0,
        capacity: venue.capacity || 0,
        rating: venue.rating || 0,
        image: venue.images?.[0] || venue.profile_image || venue.image,
        venueData: venue // حفظ بيانات القاعة الكاملة
      };
    });

    setMarkers(newMarkers);
    
    // حساب الحدود لتضمين جميع الماركرز
    if (newMarkers.length > 0) {
      const lats = newMarkers.map(m => m.position[0]);
      const lngs = newMarkers.map(m => m.position[1]);
      
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      // حساب المركز المتوسط
      const avgLat = (minLat + maxLat) / 2;
      const avgLng = (minLng + maxLng) / 2;
      
      setMapCenter([avgLat, avgLng]);
      
      // حساب مستوى التكبير المناسب بناءً على انتشار الماركرز
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const maxDiff = Math.max(latDiff, lngDiff);
      
      let calculatedZoom = 10; // المستوى الافتراضي
      
      if (maxDiff > 0.5) calculatedZoom = 9;
      if (maxDiff > 1) calculatedZoom = 8;
      if (maxDiff > 2) calculatedZoom = 7;
      if (maxDiff < 0.1) calculatedZoom = 12;
      if (maxDiff < 0.05) calculatedZoom = 13;
      if (newMarkers.length === 1) calculatedZoom = 14;
      
      setZoom(calculatedZoom);
      
      console.log(`🗺️ مركز الخريطة: [${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}]`);
      console.log(`🔍 مستوى التكبير: ${calculatedZoom}`);
      console.log(`📍 عدد الماركرز: ${newMarkers.length}`);
    }
  }, [venues]);

  // التعامل مع النقر على الماركر
  const handleMarkerClick = (venueId) => {
    const venue = venues.find(v => (v.id || v._id) === venueId);
    if (venue && onVenueClick) {
      console.log('🖱️ تم النقر على قاعة:', venue.name);
      onVenueClick(venue);
    }
  };

  // التعامل مع تمرير الماوس على الماركر
  const handleMouseOver = (venueId) => {
    if (onVenueHover) {
      onVenueHover(venueId);
    }
  };

  // إذا لم توجد قاعات
  if (!venues || venues.length === 0) {
    return (
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">لا توجد قاعات للعرض</h3>
          <p className="text-gray-600 text-sm">قم بتعديل الفلاتر أو أضف قاعات جديدة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ borderRadius: '16px' }}
        key={`map-${venues.length}-${zoom}`} // إعادة التصيير عند تغيير البيانات
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map(marker => {
          // تخصيص لون الماركر بناءً على نوع القاعة
          const markerColor = markerColors[marker.type] || markerColors.default;
          const isActive = activeVenueId === marker.id;
          
          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={createCustomIcon(isActive ? '#FFD700' : markerColor)} // لون ذهبي إذا كانت نشطة
              eventHandlers={{
                click: () => handleMarkerClick(marker.id),
                mouseover: () => handleMouseOver(marker.id),
                mouseout: () => handleMouseOver(null)
              }}
            >
              <Popup>
                <div className="venue-popup" style={{ minWidth: '220px', maxWidth: '280px' }}>
                  {marker.image && (
                    <img 
                      src={marker.image} 
                      alt={marker.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += `
                          <div class="w-full h-40 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mb-3 flex items-center justify-center">
                            <span class="text-3xl">🏛️</span>
                          </div>
                        `;
                      }}
                    />
                  )}
                  
                  <h3 className="font-bold text-gray-800 text-base mb-2">{marker.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {marker.city}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {marker.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center p-2 bg-emerald-50 rounded-lg">
                      <div className="text-emerald-600 font-bold text-sm">
                        {marker.price > 0 ? `${marker.price.toLocaleString()} ج` : 'عند الطلب'}
                      </div>
                      <div className="text-xs text-gray-600">السعر</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-blue-600 font-bold text-sm">{marker.capacity}</div>
                      <div className="text-xs text-gray-600">السعة</div>
                    </div>
                  </div>
                  
                  {marker.rating > 0 && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 text-sm">⭐</span>
                        <span className="text-sm font-medium">{marker.rating.toFixed(1)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(marker.id);
                        }}
                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                    انقر على الزر أعلاه أو خارج النافذة للإغلاق
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* وسيلة إيضاح (Legend) */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 z-[1000] max-w-[200px]">
        <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          أنواع القاعات:
        </div>
        <div className="space-y-2">
          {Object.entries(markerColors).map(([type, color]) => (
            type !== 'default' && (
              <div key={type} className="flex items-center gap-3 text-xs">
                <div 
                  className="w-4 h-4 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: color, transform: 'rotate(45deg)' }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">{type}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* عداد القاعات ومعلومات الخريطة */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 z-[1000]">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{venues.length}</div>
          <div className="text-sm font-medium text-gray-700">قاعة في الخريطة</div>
          <div className="text-xs text-gray-500 mt-1">
            {markers.length > 0 ? `مركز الخريطة: ${mapCenter[0].toFixed(4)}, ${mapCenter[1].toFixed(4)}` : 'جاري التحميل...'}
          </div>
        </div>
      </div>

      {/* أدوات التحكم في الخريطة */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 z-[1000]">
        <div className="text-xs text-gray-600 font-medium">
          🔍 استخدم عجلة الماوس للتكبير | 🖱️ اسحب للتنقل
        </div>
      </div>
    </div>
  );
};

export default VenuesMap;