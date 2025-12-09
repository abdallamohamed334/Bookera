import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const DecorationsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDecorator, setSelectedDecorator] = useState(null);
  const [filteredDecorators, setFilteredDecorators] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decorators, setDecorators] = useState([]);
  const [dataSource, setDataSource] = useState("");

  // محافظات مصر
  const governorates = {
    "all": { name: "كل المحافظات", cities: ["كل المدن"] },
    "القاهرة": { 
      name: "القاهرة", 
      cities: ["كل المدن", "المعادي", "مدينة نصر", "مصر الجديدة", "المهندسين"] 
    },
    "الجيزة": { 
      name: "الجيزة", 
      cities: ["كل المدن", "الدقي", "المهندسين", "فيصل"] 
    }
  };

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchDecorators = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://bookera-production-25ec.up.railway.app//api/decorations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.decorators && data.decorators.length > 0) {
            setDecorators(data.decorators);
            setDataSource("api");
          } else {
            // بيانات تجريبية إذا مافيش بيانات من API
            setDecorators([
              {
                _id: "1",
                name: "أحمد مصطفى",
                specialty: "ديكور أفراح",
                experience: 8,
                governorate: "القاهرة",
                city: "المعادي",
                priceRange: { min: 5000, max: 50000 },
                profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                portfolio: [
                  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
                  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
                ],
                description: "شركة متخصصة في ديكور حفلات الزفاف، نقدم تصاميم مبتكرة تجمع بين الفخامة والأناقة.",
                rating: 4.8,
                contact: "01001234567",
                email: "ahmed@decoration.com",
                address: "شارع 9، المعادي، القاهرة",
                services: ["تصميم ديكور", "تنسيق زهور", "إضاءة وديكور ضوئي"],
                materials: ["زهور طبيعية", "أقمشة فاخرة", "إضاءة LED"],
                decorationSpecific: {
                  designTime: 7,
                  executionTime: 2,
                  teamSize: 5,
                  providesMaterials: true
                },
                styles: ["كلاسيكي", "حديث", "فاخر"],
                packages: [
                  {
                    name: "الباقة الأساسية",
                    price: 5000,
                    description: "ديكور أساسي مع لمسات أنيقة",
                    features: ["ديكور المنصة", "طاولة الضيوف", "إضاءة أساسية"]
                  }
                ]
              }
            ]);
            setDataSource("demo");
          }
        } else {
          throw new Error(`فشل في جلب البيانات: ${response.status}`);
        }
      } catch (err) {
        console.error('❌ خطأ في جلب بيانات الديكور:', err.message);
        setDataSource("error");
        setError(`تعذر الاتصال بالخادم: ${err.message}`);
        
        // بيانات تجريبية للطوارئ
        setDecorators([
          {
            _id: "1",
            name: "أحمد مصطفى",
            specialty: "ديكور أفراح",
            experience: 8,
            governorate: "القاهرة",
            city: "المعادي",
            priceRange: { min: 5000, max: 50000 },
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            portfolio: [
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
              "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
            ],
            description: "شركة متخصصة في ديكور حفلات الزفاف، نقدم تصاميم مبتكرة تجمع بين الفخامة والأناقة.",
            rating: 4.8,
            contact: "01001234567",
            email: "ahmed@decoration.com",
            address: "شارع 9، المعادي، القاهرة",
            services: ["تصميم ديكور", "تنسيق زهور", "إضاءة وديكور ضوئي"],
            materials: ["زهور طبيعية", "أقمشة فاخرة", "إضاءة LED"],
            available: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDecorators();
  }, []);

  // فلترة مزودي الديكور
  useEffect(() => {
    const filtered = decorators.filter(decorator => {
      const matchesSpecialty = activeFilter === "all" || decorator.specialty === activeFilter;
      const matchesPrice = decorator.priceRange.max <= priceRange;
      const matchesGovernorate = selectedGovernorate === "all" || decorator.governorate === selectedGovernorate;
      const matchesCity = selectedCity === "all" || selectedCity === "كل المدن" || decorator.city === selectedCity;
      
      return matchesSpecialty && matchesPrice && matchesGovernorate && matchesCity;
    });
    
    setFilteredDecorators(filtered);
  }, [activeFilter, priceRange, selectedGovernorate, selectedCity, decorators]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-gray-600 text-sm mr-1">({rating})</span>
      </div>
    );
  };

  const resetFilters = () => {
    setActiveFilter("all");
    setSelectedGovernorate("all");
    setSelectedCity("all");
    setPriceRange(50000);
  };

  const handleDecoratorClick = (decorator) => {
    setSelectedDecorator(decorator);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedDecorator(null);
  };

  const handleGovernorateChange = (gov) => {
    setSelectedGovernorate(gov);
    setSelectedCity("all");
  };

  // الحجز عبر الواتساب
  const handleBookDecorator = (decorator) => {
    const message = `مرحبا، أنا مهتم بالحجز للديكور\nالاسم: ${decorator.name}\nالتخصص: ${decorator.specialty}\nالسعر: ${decorator.priceRange.min} - ${decorator.priceRange.max} جنيه`;
    const whatsappUrl = `https://wa.me/${decorator.contact}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // صفحة تفاصيل مزود الديكور المبسطة
  const DecoratorDetails = ({ decorator }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!decorator) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">مزود الديكور غير موجود</h1>
            <button 
              onClick={handleBackToList}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              العودة للقائمة
            </button>
          </div>
        </div>
      );
    }

    const images = decorator.portfolio || [decorator.profileImage];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={handleBackToList}
                className="flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                العودة للقائمة
              </button>
              <h1 className="text-2xl font-bold text-gray-900">تفاصيل الديكور</h1>
              <div className="w-8"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <img 
                  src={decorator.profileImage} 
                  alt={decorator.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{decorator.name}</h2>
                <p className="text-green-600 font-medium mb-4">{decorator.specialty}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-600">التقييم:</span>
                    <div className="mt-1">{renderStars(decorator.rating)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">الخبرة:</span>
                    <p className="font-medium">{decorator.experience} سنة</p>
                  </div>
                  <div>
                    <span className="text-gray-600">المكان:</span>
                    <p className="font-medium">{decorator.city}، {decorator.governorate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">السعر:</span>
                    <p className="font-bold text-green-600">
                      {decorator.priceRange.min.toLocaleString()} - {decorator.priceRange.max.toLocaleString()} جنيه
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBookDecorator(decorator)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  احجز على الواتساب
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">الوصف</h3>
              <p className="text-gray-600">{decorator.description}</p>
            </div>

            {decorator.services && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الخدمات</h3>
                <div className="flex flex-wrap gap-2">
                  {decorator.services.map((service, index) => (
                    <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات التواصل</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">هاتف:</span> {decorator.contact}</p>
                  <p><span className="text-gray-600">بريد إلكتروني:</span> {decorator.email}</p>
                  <p><span className="text-gray-600">عنوان:</span> {decorator.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  if (currentView === "details" && selectedDecorator) {
    return <DecoratorDetails decorator={selectedDecorator} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-green-600">خدمات الديكور</h1>
            <button 
              onClick={handleBackToHome}
              className="text-gray-600 hover:text-green-600"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
              <select
                value={selectedGovernorate}
                onChange={(e) => handleGovernorateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Object.keys(governorates).map((gov) => (
                  <option key={gov} value={gov}>{governorates[gov].name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {governorates[selectedGovernorate]?.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التخصص</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">كل التخصصات</option>
                <option value="ديكور أفراح">ديكور أفراح</option>
                <option value="ديكور صالات">ديكور صالات</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر: {priceRange.toLocaleString()} جنيه
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            مزودي الديكور ({filteredDecorators.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredDecorators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecorators.map((decorator) => (
                <div
                  key={decorator._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleDecoratorClick(decorator)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={decorator.profileImage} 
                      alt={decorator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{decorator.name}</h3>
                      <span className="text-green-600 text-sm bg-green-50 px-2 py-1 rounded">
                        {decorator.experience} سنة
                      </span>
                    </div>
                    <p className="text-green-600 font-medium mb-2">{decorator.specialty}</p>
                    <p className="text-gray-600 text-sm mb-3">{decorator.city}، {decorator.governorate}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">
                        {decorator.priceRange.min.toLocaleString()} - {decorator.priceRange.max.toLocaleString()} جنيه
                      </span>
                      {renderStars(decorator.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecorationsPage;