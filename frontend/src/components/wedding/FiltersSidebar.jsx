const FiltersSidebar = ({
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
  searchQuery,
  onSearchChange,
  onResetFilters,
  filteredVenues,
  weddingVenues,
  dataSource,
  favorites
}) => {
  
  const governorates = {
    "all": { name: "كل المحافظات", cities: ["كل المدن"] },
    "الغربية": { 
      name: "الغربية", 
      cities: ["كل المدن", "طنطا", "المحلة الكبرى", "زفتى", "سمنود", "بسيون", "قطور", "السنطه", "كفر الزيات", "صفتا", "شيخون"] 
    }
  };

  const venueTypes = {
    "all": "كل الأنواع",
    "قاعة_أفراح": "قاعة أفراح",
    "اوبن اير": "اوبن اير",
    "ان دور": "ان دور",
  };

  const locationTypes = {
    "all": "كل المواقع",
    "open": "أوبن دور",
    "closed": "إن دور",
    "mixed": "مختلط"
  };

  const eventTypes = {
    "all": "كل المناسبات",
    "فرح": "فرح",
    "خطوبة": "خطوبة",
    "كتب_كتاب": "كتب كتاب",
    "حفلة": "حفلة",
    "مناسبة_عمل": "مناسبة عمل"
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-32">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className='text-xl font-bold text-purple-600'>فلاتر البحث</h3>
          <button 
            onClick={onResetFilters}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            مسح الكل
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;