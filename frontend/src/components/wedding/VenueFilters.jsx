import { motion } from "framer-motion";

const VenueFilters = ({
  activeFilter,
  priceRange,
  selectedGovernorate,
  selectedCity,
  governorates,
  onFilterChange,
  onPriceChange,
  onGovernorateChange,
  onCityChange,
  onResetFilters,
  filteredCount,
  totalCount,
  dataSource
}) => {
  const categories = ["all", "فاخرة", "طبيعية", "كلاسيكية", "عصرية", "اقتصادية"];

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

        <CategoryFilter
          activeFilter={activeFilter}
          categories={categories}
          onChange={onFilterChange}
        />

        <PriceFilter
          priceRange={priceRange}
          onChange={onPriceChange}
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

const CategoryFilter = ({ activeFilter, categories, onChange }) => (
  <div className="mb-6">
    <h4 className="text-gray-900 font-medium mb-3">نوع القاعة</h4>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`w-full text-right px-3 py-2 rounded-lg transition-colors duration-200 ${
            activeFilter === category
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {category === "all" ? "كل الأنواع" : category}
        </button>
      ))}
    </div>
  </div>
);

const PriceFilter = ({ priceRange, onChange }) => (
  <div className="mb-6">
    <h4 className="text-gray-900 font-medium mb-3">السعر: لحد {priceRange.toLocaleString()} جنيه</h4>
    <input
      type="range"
      min="1000"
      max="50000"
      step="1000"
      value={priceRange}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full mb-2"
    />
    <div className="flex justify-between text-gray-600 text-sm">
      <span>1,000</span>
      <span>50,000</span>
    </div>
  </div>
);

const FilterStats = ({ filteredCount, totalCount, dataSource }) => (
  <div className="bg-purple-50 p-4 rounded-lg">
    <h4 className="font-medium text-purple-800 mb-2">إحصائيات البحث</h4>
    <div className="space-y-1 text-sm text-purple-700">
      <div>القاعات المتاحة: <span className="font-bold">{filteredCount}</span></div>
      <div>مجموع القاعات: <span className="font-bold">{totalCount}</span></div>
      <div>مصدر البيانات: <span className="font-bold">{dataSource === "api" ? "قاعدة البيانات" : "..."}</span></div>
    </div>
  </div>
);

export default VenueFilters;