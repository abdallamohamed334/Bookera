import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const governorates = {
  "all": { name: "كل المحافظات", cities: ["كل المدن"] },
  "القاهرة": { 
    name: "القاهرة", 
    cities: ["كل المدن", "المعادي", "مدينة نصر", "مصر الجديدة", "الزمالك", "الدقي", "المهندسين", "الزيتون", "شبرا", "العباسية", "المنيل", "الفسطاط", "حدائق القبة", "الوايلي", "الزاوية الحمراء", "عابدين", "بولاق", "دار السلام", "السيدة زينب", "باب الشعرية"] 
  },
  "الجيزة": { 
    name: "الجيزة", 
    cities: ["كل المدن", "الدقي", "المهندسين", "فيصل", "الأهرام", "العمرانية", "البدرشين", "الصف", "أوسيم", "الوراق", "إمبابة", "العجوزة", "الهرم", "كرداسة", "أبو النمرس", "الحوامدية", "المنصورية"] 
  },
  "الإسكندرية": { 
    name: "الإسكندرية", 
    cities: ["كل المدن", "المنتزه", "سموحة", "اللبان", "العصافرة", "الظاهرية", "كرموز", "المكس", "الجمرك", "العطارين", "محطة الرمل", "الشاطبي", "باكوس", "ستانلي", "سيدي جابر", "السيوف", "المنشية", "الورديان"] 
  },
  "الدقهلية": { 
    name: "الدقهلية", 
    cities: ["كل المدن", "المنصورة", "ميت غمر", "أجا", "منية النصر", "السنبلاوين", "طلخا", "شربين", "تمي الأمديد", "الجمالية", "دكرنس", "الكردي", "بنى عبيد", "المطرية"] 
  },
  "البحر الأحمر": { 
    name: "البحر الأحمر", 
    cities: ["كل المدن", "الغردقة", "رأس غارب", "سفاجا", "القصير", "مرسى علم", "شلاتين", "حلايب"] 
  },
  "البحيرة": { 
    name: "البحيرة", 
    cities: ["كل المدن", "دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو المطامير", "أبو حمص", "الدلنجات", "المحمودية", "الرحمانية", "إيتاي البارود", "حوش عيسى", "شبراخيت", "كوم حمادة", "وادي النطرون", "بدر", "النوبارية الجديدة"] 
  },
  "الفيوم": { 
    name: "الفيوم", 
    cities: ["كل المدن", "الفيوم", "طامية", "سنورس", "إطسا", "يوسف الصديق", "الزيارة", "الفارس"] 
  },
  "الغربية": { 
    name: "الغربية", 
    cities: ["كل المدن", "طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة", "بسيون", "قطور", "سمنود"] 
  },
  "الإسماعيلية": { 
    name: "الإسماعيلية", 
    cities: ["كل المدن", "الإسماعيلية", "فايد", "القنطرة غرب", "القنطرة شرق", "التل الكبير", "أبو صوير", "القصاصين الجديدة"] 
  },
  "المنوفية": { 
    name: "المنوفية", 
    cities: ["كل المدن", "شبين الكوم", "السادات", "منوف", "أشمون", "الباجور", "قويسنا", "بركة السبع", "تلا", "الشهداء"] 
  },
  "المنيا": { 
    name: "المنيا", 
    cities: ["كل المدن", "المنيا", "ملوي", "دير مواس", "مغاغة", "بني مزار", "مطاي", "سمالوط", "العدوة", "أبو قرقاص"] 
  },
  "القليوبية": { 
    name: "القليوبية", 
    cities: ["كل المدن", "بنها", "قليوب", "شبرا الخيمة", "الخانكة", "كفر شكر", "طوخ", "القناطر الخيرية", "العبور"] 
  },
  "الوادي الجديد": { 
    name: "الوادي الجديد", 
    cities: ["كل المدن", "الخارجة", "الداخلة", "باريس", "موط", "الفرافرة", "بلاط"] 
  },
  "السويس": { 
    name: "السويس", 
    cities: ["كل المدن", "السويس", "الأربعين", "عتاقة", "الجناين", "فيصل"] 
  },
  "أسوان": { 
    name: "أسوان", 
    cities: ["كل المدن", "أسوان", "كوم أمبو", "دراو", "نصر النوبة", "كلابشة", "إدفو", "الرديسية", "البصيلية"] 
  },
  "أسيوط": { 
    name: "أسيوط", 
    cities: ["كل المدن", "أسيوط", "ديروط", "منفلوط", "القوصية", "أبنوب", "أبو تيج", "الغنايم", "ساحل سليم", "البداري", "صدفا", "الفتح"] 
  },
  "بني سويف": { 
    name: "بني سويف", 
    cities: ["كل المدن", "بني سويف", "الواسطى", "ناصر", "إهناسيا", "ببا", "سمسطا", "الفشن", "مغرة"] 
  },
  "بورسعيد": { 
    name: "بورسعيد", 
    cities: ["كل المدن", "بورسعيد", "بورفؤاد", "الضواحي", "المناخ", "العرب", "الزهور", "المنشية", "الظاهر"] 
  },
  "دمياط": { 
    name: "دمياط", 
    cities: ["كل المدن", "دمياط", "الروضة", "كفر سعد", "الزرقا", "ميت أبو غالب", "كفر البطيخ", "فارسكور", "السرو"] 
  },
  "سوهاج": { 
    name: "سوهاج", 
    cities: ["كل المدن", "سوهاج", "أخميم", "البلينا", "المراغة", "المنشأة", "دار السلام", "جرجا", "جهينة", "ساقلتة", "طما", "طهطا"] 
  },
  "قنا": { 
    name: "قنا", 
    cities: ["كل المدن", "قنا", "أبو تشت", "نجع حمادي", "دشنا", "الوقف", "قفط", "نقادة", "فرشوط", "قوص"] 
  },
  "كفر الشيخ": { 
    name: "كفر الشيخ", 
    cities: ["كل المدن", "كفر الشيخ", "دسوق", "فوه", "مطوبس", "بلطيم", "الرياض", "سيدي سالم", "قلين", "الحامول", "برج البرلس", "بيلا"] 
  },
  "مطروح": { 
    name: "مطروح", 
    cities: ["كل المدن", "مرسى مطروح", "الحمام", "العلمين", "الضبعة", "النجيلة", "سيدي براني", "السلوم", "سيوة"] 
  },
  "الأقصر": { 
    name: "الأقصر", 
    cities: ["كل المدن", "الأقصر", "الزينية", "البياضية", "الطود", "أرمنت", "إسنا"] 
  },
  "جنوب سيناء": { 
    name: "جنوب سيناء", 
    cities: ["كل المدن", "شرم الشيخ", "دهب", "نويبع", "طابا", "رأس سدر", "سانت كاترين", "أبو رديس", "أبو زنيمة", "طور سيناء"] 
  },
  "شمال سيناء": { 
    name: "شمال سيناء", 
    cities: ["كل المدن", "العريش", "الشيخ زويد", "رفح", "بئر العبد", "الحسنة", "نخل"] 
  }
};

const specialties = [
  { id: "all", name: "كل التخصصات", icon: "🎯" },
  { id: "تصوير أفراح", name: "تصوير أفراح", icon: "📷" },
  { id: "تصوير شخصي", name: "تصوير شخصي", icon: "👤" },
  { id: "تصوير عائلي", name: "تصوير عائلي", icon: "👨‍👩‍👧‍👦" },
  { id: "تصوير مناسبات", name: "تصوير مناسبات", icon: "🎉" },
  { id: "تصوير مواليد", name: "تصوير مواليد", icon: "👶" },
  { id: "تصوير أزياء", name: "تصوير أزياء", icon: "👗" },
  { id: "تصوير منتجات", name: "تصوير منتجات", icon: "📦" },
  { id: "تصوير طبيعي", name: "تصوير طبيعي", icon: "🌄" },
  { id: "تصوير رياضي", name: "تصوير رياضي", icon: "⚽" },
  { id: "تصوير معماري", name: "تصوير معماري", icon: "🏛️" }
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
            <h1 className="text-2xl font-bold text-gray-900">
              مصورين الأفراح في {selectedGovernorate === "all" ? "كل المحافظات" : governorates[selectedGovernorate]?.name}
              {selectedCity !== "كل المدن" && ` - ${selectedCity}`}
            </h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* تخصص التصوير */}
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

          {/* الموقع */}
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
                    onChange={(e) => {
                      setSelectedGovernorate(e.target.value);
                      setSelectedCity("كل المدن");
                    }}
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

          {/* نطاق السعر وإعادة التعيين */}
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
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-sm"
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isExpanded ? "إخفاء الفلاتر المتقدمة" : "عرض الفلاتر المتقدمة"}
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
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Experience Level */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    مستوى الخبرة
                  </h4>
                  <div className="space-y-2">
                    {["جميع المستويات", "مبتدئ (أقل من سنة)", "متوسط (1-3 سنوات)", "محترف (3-5 سنوات)", "خبير (أكثر من 5 سنوات)"].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipment Type */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    نوع المعدات
                  </h4>
                  <div className="space-y-2">
                    {["جميع المعدات", "كاميرا احترافية", "كاميرا شبه احترافية", "عدسات متنوعة", "إضاءة احترافية", "درون تصوير"].map((equipment) => (
                      <label key={equipment} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{equipment}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    خدمات إضافية
                  </h4>
                  <div className="space-y-2">
                    {["جميع الخدمات", "تعديل الصور", "طباعة الألبومات", "تصوير فيديو", "تصوير جوي", "استديو متنقل"].map((service) => (
                      <label key={service} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Quick Price Filters */}
              <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">نطاقات سريعة</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange(range.max)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        priceRange === range.max
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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