import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/photografer/Navbar";
import HeroSection from "../components/photografer/HeroSection";
import FiltersSection from "../components/photografer/FiltersSection";
import PhotographersGrid from "../components/photografer/PhotographersGrid";
import DataStatus from "../components/photografer/DataStatus";

const PhotographersPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photographers, setPhotographers] = useState([]);
  const [dataSource, setDataSource] = useState("");

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 جاري جلب بيانات المصورين من API...');
        
        const response = await fetch('bookera-production-25ec.up.railway.app/api/photographers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم جلب بيانات المصورين بنجاح:', data);
          
          if (data.photographers && data.photographers.length > 0) {
            setPhotographers(data.photographers);
            setDataSource("api");
            console.log(`🎉 تم تحميل ${data.photographers.length} مصور من الـ API`);
          } else {
            throw new Error('لا توجد بيانات للمصورين في الـ API');
          }
        } else {
          throw new Error(`فشل في جلب البيانات: ${response.status}`);
        }
      } catch (err) {
        console.error('❌ خطأ في جلب بيانات المصورين:', err.message);
        setDataSource("error");
        setError(`تعذر الاتصال بالخادم: ${err.message}`);
        
        // استخدام بيانات تجريبية في حالة الخطأ
        const mockPhotographers = [
          {
            _id: "1",
            name: "أحمد محمد",
            specialty: "تصوير أفراح",
            price: 5000,
            rating: 4.8,
            experience: 5,
            city: "المعادي",
            governorate: "القاهرة",
            profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
            description: "مصور محترف متخصص في تصوير الأفراح والمناسبات بخبرة 5 سنوات",
            services: ["تصوير كامل للفرح", "ألبوم صور فاخر", "فيديو احترافي", "باقة الصور الرقمية"],
            equipment: ["Canon EOS R5", "Sony A7III", "عدسات متعددة", "إضاءة احترافية"],
            portfolio: [
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
            ],
            contact: "20123456789",
            email: "ahmed@example.com",
            address: "المعادي، القاهرة",
            socialMedia: {
              instagram: "@ahmed_photos",
              facebook: "ahmed.photography",
              website: "https://ahmed-photos.com"
            },
            photographySpecific: {
              hoursCoverage: 8,
              numberOfPhotos: 500,
              editingTime: 14
            },
            packages: [
              {
                name: "الباقة الأساسية",
                price: 3000,
                description: "تغطية 4 ساعات + 200 صورة",
                features: ["4 ساعات تصوير", "200 صورة معدلة", "ألبوم رقمي"]
              },
              {
                name: "الباقة المتكاملة",
                price: 5000,
                description: "تغطية 8 ساعات + 500 صورة",
                features: ["8 ساعات تصوير", "500 صورة معدلة", "ألبوم فاخر", "فيديو تذكاري"]
              }
            ]
          },
          {
            _id: "2",
            name: "مريم أحمد",
            specialty: "تصوير شخصي",
            price: 2000,
            rating: 4.9,
            experience: 3,
            city: "الدقي",
            governorate: "الجيزة",
            profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
            description: "مصورة مبدعة متخصصة في التصوير الشخصي والفوتوشوت",
            services: ["جلسات تصوير شخصية", "تصوير فوتوشوت", "تعديل احترافي", "إرشاد بالملابس والمكياج"],
            equipment: ["Sony A7IV", "Canon 5D Mark IV", "عدسات برايم", "إضاءة LED"],
            portfolio: [
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
              "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800"
            ],
            contact: "20109876543",
            email: "mariam@example.com",
            address: "الدقي، الجيزة",
            socialMedia: {
              instagram: "@mariam_portraits",
              facebook: "mariam.portraits"
            },
            photographySpecific: {
              hoursCoverage: 3,
              numberOfPhotos: 100,
              editingTime: 7
            },
            packages: [
              {
                name: "جلسة شخصية",
                price: 1500,
                description: "جلسة تصوير شخصية احترافية",
                features: ["ساعتين تصوير", "50 صورة معدلة", "3 خلفيات مختلفة"]
              }
            ]
          }
        ];
        
        setPhotographers(mockPhotographers);
        setDataSource("mock");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, []);

  // فلترة المصورين
  useEffect(() => {
    console.log('🔄 جاري فلترة المصورين...', photographers.length);
    
    const filtered = photographers.filter(photographer => {
      const matchesSpecialty = activeFilter === "all" || photographer.specialty === activeFilter;
      const matchesPrice = parseInt(photographer.price) <= priceRange;
      const matchesGovernorate = selectedGovernorate === "all" || photographer.governorate === selectedGovernorate;
      const matchesCity = selectedCity === "all" || selectedCity === "كل المدن" || photographer.city === selectedCity;
      
      return matchesSpecialty && matchesPrice && matchesGovernorate && matchesCity;
    });
    
    setFilteredPhotographers(filtered);
    console.log('✅ تمت الفلترة:', filtered.length, 'مصور');
  }, [activeFilter, priceRange, selectedGovernorate, selectedCity, photographers]);

  const resetFilters = () => {
    setActiveFilter("all");
    setSelectedGovernorate("all");
    setSelectedCity("all");
    setPriceRange(10000);
  };

  const handleGovernorateChange = (gov) => {
    setSelectedGovernorate(gov);
    setSelectedCity("all");
  };

  const handlePhotographerClick = (photographer) => {
    // فتح صفحة المصور في تبويب جديد
    const photographerUrl = `/photographer/${photographer._id}`;
    window.open(photographerUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 w-full">
      {/* Header مع زرين فقط */}
      <header className="bg-transparent py-4 px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          
          <button 
            onClick={() => {
              const shareUrl = window.location.href;
              navigator.clipboard.writeText(shareUrl);
              alert('تم نسخ رابط الصفحة!');
            }}
            className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors duration-200 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md"
          >
            المشاركة
          </button>
        </div>
      </header>
      
      {/* Hero Section معدلة */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* خلفية ديكورية */}
        <div className="absolute inset-0 overflow-hidden">
          {/* أشكال دائرية */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"></div>
          
          {/* خطوط زخرفية */}
          <div className="absolute top-1/4 left-10 w-2 h-32 bg-gradient-to-b from-purple-400/20 to-transparent"></div>
          <div className="absolute bottom-1/4 right-16 w-2 h-24 bg-gradient-to-t from-blue-400/20 to-transparent"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-16 bg-gradient-to-b from-indigo-400/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            المصورين المحترفين في مصر
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            اكتشف أفضل المصورين المحترفين في كل محافظات مصر لتوثيق مناسباتك
          </p>
          
          {/* إحصائيات */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{photographers.length}+</div>
              <div className="text-gray-600">مصور محترف</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24+</div>
              <div className="text-gray-600">محافظة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">1000+</div>
              <div className="text-gray-600">مناسبة</div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="photographers-section" className="py-12 w-full bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* إزالة DataStatus */}
          
          <FiltersSection
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedGovernorate={selectedGovernorate}
            setSelectedGovernorate={handleGovernorateChange}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            resetFilters={resetFilters}
            filteredCount={filteredPhotographers.length}
            totalCount={photographers.length}
          />

          <PhotographersGrid
            photographers={filteredPhotographers}
            loading={loading}
            dataSource={dataSource}
            totalCount={photographers.length}
            onPhotographerClick={handlePhotographerClick}
            onResetFilters={resetFilters}
          />
        </div>
      </section>
    </div>
  );
};

export default PhotographersPage;