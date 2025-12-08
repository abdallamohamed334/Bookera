import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const governorates = {
  "all": { name: "كل المحافظات", cities: ["كل المدن"] },
  "القاهرة": { 
    name: "القاهرة", 
    cities: ["كل المدن", "المعادي", "مدينة نصر", "مصر الجديدة", "الزمالك", "الدقي", "المهندسين", "الزيتون", "شبرا", "العباسية"] 
  },
  "الجيزة": { 
    name: "الجيزة", 
    cities: ["كل المدن", "الدقي", "المهندسين", "فيصل", "الأهرام", "العمرانية", "البدرشين", "الصف", "أوسيم"] 
  },
};

const specialties = [
  { id: "all", name: "كل التخصصات", icon: "🎯" },
  { id: "تصوير أفراح", name: "تصوير أفراح", icon: "📷" },
  { id: "تصوير شخصي", name: "تصوير شخصي", icon: "👤" },
  { id: "تصوير عائلي", name: "تصوير عائلي", icon: "👨‍👩‍👧‍👦" },
  { id: "تصوير مناسبات", name: "تصوير مناسبات"},
  { id: "تصوير مواليد", name: "تصوير مواليد", icon: "👶" },
  { id: "تصوير أزياء", name: "تصوير أزياء", icon: "👗" },
  { id: "تصوير منتجات", name: "تصوير منتجات", icon: "📦" }
];

const priceRanges = [
  { label: "أي سعر", min: 0, max: 10000 },
  { label: "اقتصادي", min: 500, max: 2000 },
  { label: "متوسط", min: 2000, max: 5000 },
  { label: "فاخر", min: 5000, max: 10000 }
];

const FiltersSection = ({
  activeFilter,
  setActiveFilter,
  selectedGovernorate,
  setSelectedGovernorate,
  selectedCity,
  setSelectedCity,
  priceRange,
  setPriceRange,
  resetFilters,
  filteredCount,
  totalCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مصورين الأفراح في كل المحافظات</h1>
            <p className="text-gray-600 mt-1">{filteredCount} مصور متاح</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث هنا..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Always Visible Filters - Now 3 columns instead of 4 */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* تخصص التصوير - تصميم محسن */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2 text-lg">
              <span className="bg-white p-2 rounded-lg shadow-sm">🎯</span>
              تخصص التصوير
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {specialties.slice(0, 4).map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => setActiveFilter(specialty.id)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                    activeFilter === specialty.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg">{specialty.icon}</span>
                  <span className="text-sm font-medium">{specialty.name}</span>
                </button>
              ))}
            </div>
            
            {/* Select for more options */}
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="mt-3 w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.icon} {specialty.name}
                </option>
              ))}
            </select>
          </div>

          {/* الموقع - تصميم محسن */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2 text-lg">
              <span className="bg-white p-2 rounded-lg shadow-sm">📍</span>
              الموقع
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-green-700 mb-1 font-medium">المحافظة</label>
                <div className="relative">
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
                  >
                    {Object.keys(governorates).map((gov) => (
                      <option key={gov} value={gov}>
                        {governorates[gov].name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-3.5 text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-green-700 mb-1 font-medium">المدينة</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
                  >
                    {governorates[selectedGovernorate]?.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-3.5 text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* نطاق السعر وإعادة التعيين - تصميم محسن */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-900 flex items-center gap-2 text-lg">
                <span className="bg-white p-2 rounded-lg shadow-sm">💰</span>
                نطاق السعر
              </h3>
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-purple-300 rounded-lg hover:bg-purple-100 transition-colors text-sm text-purple-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                مسح الكل
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">الحد الأقصى للسعر</span>
                  <span className="text-lg font-bold text-purple-900">{priceRange.toLocaleString()} جنيه</span>
                </div>
                
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex justify-between text-xs text-purple-600 mt-2">
                  <span>500 ج</span>
                  <span>2,500 ج</span>
                  <span>5,000 ج</span>
                  <span>7,500 ج</span>
                  <span>10,000 ج</span>
                </div>
              </div>
              
              {/* زر الفلاتر المتقدمة */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Advanced Filters */}
      

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.4);
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.6);
        }
        
        .slider::-moz-range-thumb {
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.4);
          transition: all 0.2s;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.6);
        }
      `}</style>
    </div>
  );
};

export default FiltersSection;