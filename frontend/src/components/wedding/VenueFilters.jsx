import { motion } from "framer-motion";

const VenueFilters = ({
  activeFilter,
  selectedGovernorate,
  selectedCity,
  governorates,
  onFilterChange,
  onGovernorateChange,
  onCityChange,
  onResetFilters,
  filteredCount,
  totalCount,
  dataSource
}) => {
  const eventCategories = ["all", "فرح", "خطوبة", "كتب_كتاب", "عيد_ميلاد"];

  return (
    <div className="lg:w-1/4 bg-gray-50 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className='text-xl font-semibold text-purple-600'>فلاتر البحث</h3>
          <button 
            onClick={onResetFilters}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            مسح الفلاتر
          </button>
        </div>
        
        <GovernorateFilter
          selectedGovernorate={selectedGovernorate}
          governorates={governorates}
          onChange={onGovernorateChange}
        />

        <CityFilter
          selectedCity={selectedCity}
          selectedGovernorate={selectedGovernorate}
          governorates={governorates}
          onChange={onCityChange}
        />

        <EventTypeFilter
          activeFilter={activeFilter}
          eventCategories={eventCategories}
          onChange={onFilterChange}
        />

        <FilterStats
          filteredCount={filteredCount}
          totalCount={totalCount}
          dataSource={dataSource}
        />
      </motion.div>
    </div>
  );
};

const GovernorateFilter = ({ selectedGovernorate, governorates, onChange }) => (
  <div className="mb-6">
    <h4 className="text-gray-900 font-medium mb-3">المحافظة</h4>
    <select
      value={selectedGovernorate}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    >
      {Object.keys(governorates).map((gov) => (
        <option key={gov} value={gov}>
          {governorates[gov].name}
        </option>
      ))}
    </select>
  </div>
);

const CityFilter = ({ selectedCity, selectedGovernorate, governorates, onChange }) => (
  <div className="mb-6">
    <h4 className="text-gray-900 font-medium mb-3">المدينة</h4>
    <select
      value={selectedCity}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    >
      {governorates[selectedGovernorate]?.cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>
);

const EventTypeFilter = ({ activeFilter, eventCategories, onChange }) => {
  // تسميات أنواع المناسبات
  const eventLabels = {
    "all": "كل المناسبات",
    "فرح": "💒 فرح",
    "خطوبة": "💍 خطوبة", 
    "كتب_كتاب": "📖 كتب كتاب",
    "عيد_ميلاد": "🎂 عيد ميلاد",
    "مؤتمرات": "👔 مؤتمرات"
  };

  return (
    <div className="mb-6">
      <h4 className="text-gray-900 font-medium mb-3">نوع المناسبة</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {eventCategories.map((eventType) => (
          <button
            key={eventType}
            onClick={() => onChange(eventType)}
            className={`w-full text-right px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
              activeFilter === eventType
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{eventLabels[eventType] || eventType}</span>
            {activeFilter === eventType && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const FilterStats = ({ filteredCount, totalCount, dataSource }) => (
  <div className="bg-purple-50 p-4 rounded-lg">
    <h4 className="font-medium text-purple-800 mb-2">إحصائيات البحث</h4>
    <div className="space-y-1 text-sm text-purple-700">
      <div className="flex justify-between">
        <span>القاعات المتاحة:</span>
        <span className="font-bold">{filteredCount}</span>
      </div>
      <div className="flex justify-between">
        <span>مجموع القاعات:</span>
        <span className="font-bold">{totalCount}</span>
      </div>
      <div className="flex justify-between">
        <span>مصدر البيانات:</span>
        <span className="font-bold">
          {dataSource === "api" 
            ? "قاعدة البيانات" 
            : dataSource === "sample" 
            ? "بيانات تجريبية" 
            : "جارِ التحميل..."}
        </span>
      </div>
    </div>
  </div>
);

export default VenueFilters;