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
  dataSource,
  eventTypes = [], // ⭐⭐ إضافة eventTypes كـ prop
  onEventTypeToggle, // ⭐⭐ إضافة onEventTypeToggle كـ prop
  getEventTypeDisplayName, // ⭐⭐ إضافة getEventTypeDisplayName كـ prop
  clearAllEventTypes // ⭐⭐ إضافة clearAllEventTypes كـ prop
}) => {
  // ⭐⭐ تم التعديل هنا: أنواع المناسبات لمطابقة supported_events ⭐⭐
  const availableEventTypes = {
    "engagement": "خطوبة",
    "katb_ketab": "كتب كتاب",
    "islamic_wedding": "فرح",
    "conference": "مؤتمرات",
    "birthday": "عيد ميلاد"
  };

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

        {/* ⭐⭐ تم استبدال EventTypeFilter القديم بالمكون الجديد ⭐⭐ */}
        <EventTypesFilter
          eventTypes={eventTypes}
          onEventTypeToggle={onEventTypeToggle}
          availableEventTypes={availableEventTypes}
          getEventTypeDisplayName={getEventTypeDisplayName}
          clearAllEventTypes={clearAllEventTypes}
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

// ⭐⭐ مكون EventTypesFilter الجديد - بدلاً من EventTypeFilter القديم ⭐⭐
const EventTypesFilter = ({ 
  eventTypes, 
  onEventTypeToggle, 
  availableEventTypes,
  getEventTypeDisplayName,
  clearAllEventTypes 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-gray-900 font-medium">أنواع المناسبات</h4>
        {eventTypes.length > 0 && (
          <button
            onClick={clearAllEventTypes}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            مسح الكل
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {Object.entries(availableEventTypes).map(([key, label]) => {
          const isActive = eventTypes.includes(key);
          const displayName = getEventTypeDisplayName ? getEventTypeDisplayName(key) : label;
          
          return (
            <button
              key={key}
              onClick={() => onEventTypeToggle(key)}
              className={`w-full text-right px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getEventIcon(key)}</span>
                <span>{displayName}</span>
              </div>
              {isActive && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      
      {/* عرض عدد الأنواع المختارة */}
      {eventTypes.length > 0 && (
        <div className="mt-3 text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
          <div className="flex justify-between items-center">
            <span>مختار ({eventTypes.length})</span>
            <div className="flex flex-wrap gap-1">
              {eventTypes.slice(0, 3).map((type, index) => (
                <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {getEventTypeDisplayName ? getEventTypeDisplayName(type) : type}
                  {index === 2 && eventTypes.length > 3 && ` +${eventTypes.length - 3}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ⭐⭐ دالة للحصول على الأيقونة المناسبة ⭐⭐
const getEventIcon = (eventType) => {
  const iconMap = {
    'engagement': '💍',
    'katb_ketab': '📖',
    'islamic_wedding': '💒',
    'conference': '👔',
    'birthday': '🎂',
    'فرح': '💒',
    'خطوبة': '💍',
    'كتب_كتاب': '📖',
    'عيد_ميلاد': '🎂',
    'مؤتمرات': '👔'
  };
  
  return iconMap[eventType] || '🎊';
};

// ⭐⭐ الاحتفاظ بالمكون القديم للتوافق مع المكونات الأخرى إذا لزم الأمر ⭐⭐
const EventTypeFilter = ({ activeFilter, eventCategories, onChange }) => {
  // تسميات أنواع المناسبات
  const eventLabels = {
    "all": "كل المناسبات",
    "فرح": "💒 فرح",
    "خطوبة": "💍 خطوبة", 
    "كتب_كتاب": "📖 كتب كتاب",
    "عيد_ميلاد": "🎂 عيد ميلاد",
    "مؤتمرات": "👔 مؤتمرات",
    "engagement": "💍 خطوبة",
    "katb_ketab": "📖 كتب كتاب",
    "islamic_wedding": "💒 فرح",
    "conference": "👔 مؤتمرات",
    "birthday": "🎂 عيد ميلاد"
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