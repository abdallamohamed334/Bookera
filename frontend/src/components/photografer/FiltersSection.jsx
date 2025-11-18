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
  { id: "all", name: "كل التخصصات" },
  { id: "تصوير أفراح", name: "تصوير أفراح", icon: "💒" },
  { id: "تصوير شخصي", name: "تصوير شخصي", icon: "👤" },
  { id: "تصوير عائلي", name: "تصوير عائلي", icon: "👨‍👩‍👧‍👦" },
  { id: "تصوير حمل", name: "تصوير حمل", icon: "🤰" },
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

      {/* Always Visible Filters */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* تخصص التصوير */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <span>📸</span>
              تخصص التصوير
            </h3>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.icon} {specialty.name}
                </option>
              ))}
            </select>
          </div>

          {/* الموقع */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
              <span>📍</span>
              الموقع
            </h3>
            <div className="space-y-2">
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              >
                {Object.keys(governorates).map((gov) => (
                  <option key={gov} value={gov}>
                    {governorates[gov].name}
                  </option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              >
                {governorates[selectedGovernorate]?.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* نطاق السعر - تصميم محسن */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
              <span>💰</span>
              نطاق السعر
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 font-medium">{priceRange.toLocaleString()} جنيه</span>
                <span className="text-xs text-purple-600">حد أقصى</span>
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
              <div className="flex justify-between text-xs text-purple-600">
                <span>500 ج</span>
                <span>10,000 ج</span>
              </div>
            </div>
          </div>

          {/* التحكم */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
              <span>⚙️</span>
              التحكم
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between px-3 py-2 bg-white border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors text-sm text-orange-700"
              >
                <span>فلاتر متقدمة</span>
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button 
                onClick={resetFilters}
                className="px-3 py-2 bg-white border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors text-sm text-orange-700"
              >
                مسح الكل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">فلاتر متقدمة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* نطاقات سعر جاهزة */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">نطاقات سعر جاهزة</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => setPriceRange(range.max)}
                        className={`w-full text-right px-3 py-2 rounded-lg border transition-all duration-200 ${
                          priceRange === range.max
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs opacity-75">{range.min.toLocaleString()} - {range.max.toLocaleString()} ج</span>
                          <span>{range.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* خصائص إضافية */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">خدمات إضافية</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">تصوير فيديو</span>
                      <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                    </label>
                    <label className="flex items-center justify-between gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">تعديل الصور</span>
                      <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                    </label>
                    <label className="flex items-center justify-between gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">ألبوم صور</span>
                      <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                    </label>
                    <label className="flex items-center justify-between gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">جلسات خارجية</span>
                      <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                    </label>
                  </div>
                </div>

                {/* خيارات متقدمة */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">خيارات متقدمة</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">الخبرة</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>أي خبرة</option>
                        <option>أقل من سنة</option>
                        <option>1-3 سنوات</option>
                        <option>أكثر من 3 سنوات</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">التقييم</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>أي تقييم</option>
                        <option>4 نجوم فأكثر</option>
                        <option>3 نجوم فأكثر</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default FiltersSection;