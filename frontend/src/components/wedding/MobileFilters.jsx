import { motion } from "framer-motion";

const MobileFilters = ({ onClose, filtersProps, governorates, venueTypes, locationTypes, eventTypes, sortOptions }) => {
  const {
    searchQuery,
    onSearchChange,
    selectedGovernorate,
    onGovernorateChange,
    selectedCity,
    onCityChange,
    venueType,
    onVenueTypeChange,
    locationType,
    onLocationTypeChange,
    eventType,
    onEventTypeChange,
    priceRange,
    onPriceRangeChange,
    capacityRange,
    onCapacityRangeChange,
    sortBy,
    onSortChange,
    onResetFilters,
    filteredVenues,
    weddingVenues,
    dataSource,
    favorites
  } = filtersProps;

  return (
    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-purple-600">فلاتر البحث</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* بحث */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">بحث</h4>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث باسم القاعة أو المنطقة..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>

            {/* فلترة المحافظة */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">المحافظة</h4>
              <select
                value={selectedGovernorate}
                onChange={(e) => onGovernorateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.keys(governorates).map((gov) => (
                  <option key={gov} value={gov}>
                    {governorates[gov].name}
                  </option>
                ))}
              </select>
            </div>

            {/* فلترة المدينة */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">المدينة/المنطقة</h4>
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {governorates[selectedGovernorate]?.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* فلترة نوع القاعة */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">نوع القاعة</h4>
              <select
                value={venueType}
                onChange={(e) => onVenueTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.entries(venueTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* فلترة الموقع */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">الموقع</h4>
              <select
                value={locationType}
                onChange={(e) => onLocationTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.entries(locationTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* فلترة نوع المناسبة */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">نوع المناسبة</h4>
              <select
                value={eventType}
                onChange={(e) => onEventTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.entries(eventTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* فلترة السعر */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">السعر: حتى {priceRange.toLocaleString()} جنيه</h4>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={priceRange}
                onChange={(e) => onPriceRangeChange(parseInt(e.target.value))}
                className="w-full mb-1"
              />
              <div className="flex justify-between text-gray-600 text-xs">
                <span>1,000</span>
                <span>100,000</span>
              </div>
            </div>

            {/* فلترة السعة */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">السعة: حتى {capacityRange} شخص</h4>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={capacityRange}
                onChange={(e) => onCapacityRangeChange(parseInt(e.target.value))}
                className="w-full mb-1"
              />
              <div className="flex justify-between text-gray-600 text-xs">
                <span>50</span>
                <span>1,000</span>
              </div>
            </div>

            {/* ترتيب النتائج */}
            <div>
              <h4 className="text-gray-900 font-medium mb-2">ترتيب حسب</h4>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* إحصائيات */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2 text-sm">إحصائيات البحث</h4>
              <div className="space-y-1 text-xs text-purple-700">
                <div className="flex justify-between">
                  <span>القاعات المتاحة:</span>
                  <span className="font-bold">{filteredVenues.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>مجموع القاعات:</span>
                  <span className="font-bold">{weddingVenues.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>في المفضلة:</span>
                  <span className="font-bold">{favorites.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>مصدر البيانات:</span>
                  <span className="font-bold">
                    {dataSource === "api" ? "قاعدة البيانات" : 
                     dataSource === "sample" ? "بيانات تجريبية" : "..."}
                  </span>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-2">
              <button 
                onClick={onResetFilters}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
              >
                مسح الكل
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
              >
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileFilters;