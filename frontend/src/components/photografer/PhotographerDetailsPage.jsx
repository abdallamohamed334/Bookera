import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PhotographerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [autoSlide, setAutoSlide] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  // بيانات المصورين المحلية
  const mockPhotographers = {
    "6903ac7c7c330fcb39f532b8": {
      "_id": "6903ac7c7c330fcb39f532b8",
      "name": "محمد السيد",
      "businessName": "تراث للتصوير",
      "type": "استوديو",
      "specialty": "تصوير تقليدي", 
      "experience": 15,
      "governorate": "الأقصر",
      "city": "الأقصر",
      "price": "6000",
      "portfolio": [
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
      ],
      "profileImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "services": [
        "تصوير حفل الزفاف",
        "ألبوم كامل", 
        "فيديو",
        "تصوير قبل الزفاف",
        "تصوير ما بعد الحفل",
        "جلسات تصوير شخصية",
        "تصوير عائلي"
      ],
      "equipment": [
        "Canon 5D Mark IV",
        "Traditional Props",
        "Historical Costumes", 
        "Natural Lighting",
        "Studio Backdrops",
        "Professional Lighting",
        "عدسات متعددة الاحجام"
      ],
      "description": "مصور متخصص في التصوير التقليدي والتراثي، أحافظ على الأصالة والتراث في كل لقطة. أمتلك خبرة 15 عاماً في مجال التصوير التراثي والأفراح التقليدية. أركز على إبراز الجمال الطبيعي والتفاصيل الدقيقة في كل صورة.",
      "available": true,
      "rating": 4.9,
      "reviews": [
        {
          "user": "أحمد محمد",
          "rating": 5,
          "comment": "مصور رائع ومحترف، الصور كانت أكثر من رائعة! التعامل كان في قمة الاحترافية",
          "date": "2024-01-15",
          "verified": true
        },
        {
          "user": "فاطمة أحمد",
          "rating": 4.5,
          "comment": "تعامل راقي وجودة تصوير ممتازة، أنصح به لكل من يبحث عن التميز",
          "date": "2024-01-10",
          "verified": true
        },
        {
          "user": "خالد محمود",
          "rating": 5,
          "comment": "أسلوب فريد في التصوير، يلتقط اللحظات بشكل رائع ويحافظ على الذكريات",
          "date": "2024-01-05",
          "verified": true
        },
        {
          "user": "سارة عبدالله",
          "rating": 4.8,
          "comment": "تجربة رائعة من البداية للنهاية، أنصح بالباقة المميزة",
          "date": "2024-01-02",
          "verified": true
        }
      ],
      "contact": "+201040652783",
      "email": "mohamed@photography.com",
      "address": "شارع الكورنيش، الأقصر",
      "workingHours": {
        "saturday": "9:00 ص - 10:00 م",
        "sunday": "9:00 ص - 10:00 م", 
        "monday": "9:00 ص - 10:00 م",
        "tuesday": "9:00 ص - 10:00 م",
        "wednesday": "9:00 ص - 10:00 م",
        "thursday": "9:00 ص - 10:00 م",
        "friday": "10:00 ص - 11:00 م"
      },
      "responseTime": "خلال 30 دقيقة",
      "socialMedia": {
        "instagram": "https://instagram.com/mohamed_photography",
        "facebook": "https://facebook.com/mohamedphotography",
        "website": "https://mohamed-photography.com"
      },
      "packages": [
        {
          "id": 1,
          "name": "الباقة الأساسية",
          "price": 3500,
          "originalPrice": 4000,
          "description": "جلسة تصوير تراثية تقليدية مناسبة للمناسبات الصغيرة",
          "features": [
            "4 ساعات تصوير",
            "80 صورة معدلة", 
            "أزياء تقليدية",
            "صور رقمية عالية الجودة",
            "تعديل أساسي للصور",
            "تسليم خلال 7 أيام"
          ],
          "popular": false
        },
        {
          "id": 2,
          "name": "الباقة المتوسطة",
          "price": 5000, 
          "originalPrice": 6000,
          "description": "باقة تراثية متكاملة تغطي معظم احتياجاتك",
          "features": [
            "6 ساعات تصوير",
            "120 صورة معدلة",
            "ألبوم فاخر 20×30",
            "إكسسوارات تراثية",
            "تعديل متقدم للصور",
            "2 خلفيات مختلفة",
            "تسليم خلال 5 أيام"
          ],
          "popular": true
        },
        {
          "id": 3,
          "name": "الباقة المميزة",
          "price": 8000, 
          "originalPrice": 10000,
          "description": "باقة تراثية شاملة بكل التفاصيل الفاخرة",
          "features": [
            "8 ساعات تصوير",
            "200 صورة معدلة",
            "ألبوم فاخر 30×40",
            "إكسسوارات تراثية متعددة",
            "تعديل احترافي متقدم",
            "5 خلفيات مختلفة",
            "صور مطبوعة بحجم 10×15",
            "تسليم فوري خلال 3 أيام",
            "نسخة إضافية من الألبوم"
          ],
          "popular": false
        }
      ]
    }
  };

  // Auto slide for portfolio
  useEffect(() => {
    if (!autoSlide || !photographer?.portfolio || photographer.portfolio.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => 
        prev === photographer.portfolio.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSlide, photographer?.portfolio]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true);
        console.log('🔄 جاري البحث عن المصور بالID:', id);

        // محاكاة delay لرؤية حالة التحميل
        await new Promise(resolve => setTimeout(resolve, 500));

        // أولاً: جرب البيانات المحلية مباشرة
        const foundPhotographer = mockPhotographers[id];
        if (foundPhotographer) {
          console.log('✅ تم العثور على المصور في البيانات المحلية');
          setPhotographer(foundPhotographer);
          setSelectedPackage(null);
          setLoading(false);
          return;
        }

        // ثانياً: إذا لم يوجد محلياً، جرب الـ API
        console.log('🔍 جاري البحث في الـ API...');
        const response = await fetch(`http://localhost:5000/api/photographers/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم جلب بيانات المصور من API:', data);
          setPhotographer(data);
          setSelectedPackage(null);
        } else {
          throw new Error('المصور غير موجود في API');
        }
      } catch (err) {
        console.error('❌ خطأ:', err.message);
        setError('المصور غير موجود');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPhotographer();
    } else {
      setError('لم يتم تحديد مصور');
      setLoading(false);
    }
  }, [id]);

  const nextImage = () => {
    if (photographer?.portfolio && photographer.portfolio.length > 0) {
      setSelectedImage(prev => 
        prev === photographer.portfolio.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (photographer?.portfolio && photographer.portfolio.length > 0) {
      setSelectedImage(prev => 
        prev === 0 ? photographer.portfolio.length - 1 : prev - 1
      );
    }
  };

  const handleBookPhotographer = () => {
    if (!selectedPackage) {
      alert('يرجى اختيار باقة أولاً');
      return;
    }
    
    const message = `مرحبا، أنا مهتم بالحجز للتصوير\nالاسم: ${photographer.name}\nالتخصص: ${photographer.specialty}\nالباقة: ${selectedPackage.name}\nالسعر: ${selectedPackage.price.toLocaleString()} جنيه\nممكن التفاصيل والمواعيد المتاحة؟`;
    const whatsappUrl = `https://wa.me/${photographer.contact}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConsultation = () => {
    const message = `مرحبا، أنا مهتم بالاستشارة المجانية للتصوير\nالاسم: ${photographer.name}\nالتخصص: ${photographer.specialty}\nأرغب في معرفة المزيد عن الخدمات والتفاصيل`;
    const whatsappUrl = `https://wa.me/${photographer.contact}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // الدالة الرئيسية لاختيار الباقات - الحل النهائي
  const togglePackageSelection = (pkg) => {
    const isSamePackage = selectedPackage && selectedPackage.id === pkg.id;
    
    console.log('🔄 تبديل الباقة:', {
      package: pkg.name,
      current: selectedPackage?.name,
      isSame: isSamePackage
    });

    if (isSamePackage) {
      setSelectedPackage(null);
      console.log('✅ تم إلغاء اختيار الباقة');
    } else {
      setSelectedPackage(pkg);
      console.log('✅ تم اختيار الباقة:', pkg.name);
    }
  };

  const deselectPackage = () => {
    console.log('🗑️ إلغاء اختيار الباقة');
    setSelectedPackage(null);
  };

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    if (photographer?.portfolio) {
      setLightboxImageIndex(prev => 
        prev === photographer.portfolio.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevLightboxImage = () => {
    if (photographer?.portfolio) {
      setLightboxImageIndex(prev => 
        prev === 0 ? photographer.portfolio.length - 1 : prev - 1
      );
    }
  };

  // Social media functions
  const handleSocialMediaClick = (platform, url) => {
    if (!url) {
      alert(`لا يوجد رابط متاح لـ ${platform}`);
      return;
    }
    
    // إضافة https:// إذا لم يكن موجوداً
    let finalUrl = url;
    if (!url.startsWith('http')) {
      finalUrl = `https://${url}`;
    }
    
    window.open(finalUrl, '_blank');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
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

  const renderWorkingHours = () => {
    if (!photographer?.workingHours) return null;

    const days = {
      "saturday": "السبت",
      "sunday": "الأحد",
      "monday": "الإثنين", 
      "tuesday": "الثلاثاء",
      "wednesday": "الأربعاء",
      "thursday": "الخميس",
      "friday": "الجمعة"
    };

    return (
      <div className="space-y-3">
        {Object.entries(photographer.workingHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium">{days[day]}:</span>
            <span className="font-bold text-blue-600">{hours}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render social media section
  const renderSocialMedia = () => {
    const socialMedia = photographer?.socialMedia;
    
    if (!socialMedia || (!socialMedia.instagram && !socialMedia.facebook && !socialMedia.website)) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">🌐 وسائل التواصل الاجتماعي</h3>
        <div className="space-y-3">
          {socialMedia.instagram && (
            <button
              onClick={() => handleSocialMediaClick("انستجرام", socialMedia.instagram)}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-lg border border-pink-200 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="text-right flex-1">
                <div className="font-bold text-gray-800">انستجرام</div>
                <div className="text-gray-600 text-sm truncate">
                  {socialMedia.instagram.replace('https://', '').replace('www.', '')}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}

          {socialMedia.facebook && (
            <button
              onClick={() => handleSocialMediaClick("فيسبوك", socialMedia.facebook)}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 rounded-lg border border-blue-200 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="text-right flex-1">
                <div className="font-bold text-gray-800">فيسبوك</div>
                <div className="text-gray-600 text-sm truncate">
                  {socialMedia.facebook.replace('https://', '').replace('www.', '')}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}

          {socialMedia.website && (
            <button
              onClick={() => handleSocialMediaClick("الموقع الإلكتروني", socialMedia.website)}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg border border-green-200 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="text-right flex-1">
                <div className="font-bold text-gray-800">الموقع الإلكتروني</div>
                <div className="text-gray-600 text-sm truncate">
                  {socialMedia.website.replace('https://', '').replace('www.', '')}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">جاري تحميل بيانات المصور...</p>
        </div>
      </div>
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">المصور غير موجود</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/photographers')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    );
  }

  const images = photographer.portfolio || [photographer.profileImage];
  const hasMultipleImages = images.length > 1;
  const hasPackages = photographer.packages && photographer.packages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/photographers')}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors duration-200"
            >
              العودة
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">
                {photographer.businessName}
              </h1>
              <p className="text-gray-600 text-sm">مصور محترف متخصص في {photographer.specialty}</p>
            </div>
            
            <button
              onClick={() => {
                const shareUrl = window.location.href;
                navigator.clipboard.writeText(shareUrl);
                alert('تم نسخ رابط المصور!');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors duration-200"
            >
              المشاركة
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* Main Image Slider */}
              <div className="relative h-96 lg:h-[500px] bg-gray-100">
                <img 
                  src={images[selectedImage]} 
                  alt={`${photographer.name} portfolio ${selectedImage + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
                  onClick={() => openLightbox(selectedImage)}
                />
                
                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}

                {/* Auto Slide Toggle */}
                {hasMultipleImages && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setAutoSlide(!autoSlide)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        autoSlide 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {autoSlide ? '⏸️' : '▶️'}
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border transition-colors ${
                          selectedImage === index 
                            ? 'border-blue-500' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${photographer.name} ${index + 1}`}
                          className="w-16 h-12 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Price Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 text-white rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold mb-2">
                {selectedPackage ? selectedPackage.price.toLocaleString() : parseInt(photographer.price).toLocaleString()} جنيه
              </div>
              <div className="text-gray-300">
                {selectedPackage ? `سعر ${selectedPackage.name}` : 'يبدأ السعر من'}
              </div>
              {selectedPackage && selectedPackage.originalPrice && (
                <div className="text-gray-400 text-sm line-through mt-1">
                  {selectedPackage.originalPrice.toLocaleString()} جنيه
                </div>
              )}
            </motion.div>

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200"
            >
              {/* Tabs Header */}
              <div className="border-b border-gray-200 bg-gray-50">
                <nav className="flex space-x-6 px-4 overflow-x-auto">
                  {[
                    { id: "portfolio", name: "المعرض", icon: "🖼️" },
                    { id: "about", name: "عن المصور", icon: "👤" },
                    { id: "services", name: "الخدمات", icon: "⚡" },
                    { id: "reviews", name: "التقييمات", icon: "⭐" },
                    { id: "packages", name: "الباقات", icon: "💰" },
                    { id: "schedule", name: "المواعيد", icon: "📅" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <span className="ml-1">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tabs Content */}
              <div className="p-6">
                {activeTab === "portfolio" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={image}
                          alt={`${photographer.name} portfolio ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">👁️ مشاهدة</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">📖 السيرة الذاتية</h3>
                      <p className="text-gray-700 leading-relaxed">{photographer.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                        <div className="text-xl font-bold text-blue-700">{photographer.experience}+</div>
                        <div className="text-gray-700 text-sm">سنوات خبرة</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                        <div className="text-xl font-bold text-green-700">100+</div>
                        <div className="text-gray-700 text-sm">عميل سعيد</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-200">
                        <div className="text-xl font-bold text-purple-700">500+</div>
                        <div className="text-gray-700 text-sm">جلسة تصوير</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center border border-orange-200">
                        <div className="text-xl font-bold text-orange-700">50+</div>
                        <div className="text-gray-700 text-sm">جائزة وتكريم</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 الخدمات المقدمة</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {photographer.services?.map((service, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">🔧 المعدات المستخدمة</h4>
                      <div className="flex flex-wrap gap-2">
                        {photographer.equipment?.map((item, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm border border-green-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-3xl font-bold text-yellow-600">{photographer.rating}</div>
                      <div>
                        {renderStars(photographer.rating)}
                        <p className="text-gray-700 text-sm mt-1">بناءً على {photographer.reviews?.length || 0} تقييم</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {photographer.reviews?.map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-sm">{review.user}</h4>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-700 text-xs px-1 py-0.5 rounded">✓ موثق</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2 text-sm">{review.comment}</p>
                          <p className="text-gray-500 text-xs">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "packages" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">💎 اختر الباقة المناسبة لك</h3>
                      <p className="text-gray-600 text-sm">اختر الباقة التي تناسب احتياجاتك وميزانيتك</p>
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-xs">
                          <strong>الحالة الحالية:</strong> {selectedPackage ? `الباقة المختارة: ${selectedPackage.name}` : 'لا توجد باقة مختارة'}
                        </p>
                      </div>
                    </div>
                    
                    {!hasPackages ? (
                      <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 font-medium">لا توجد باقات متاحة حالياً</p>
                        <p className="text-gray-500 text-sm mt-1">يمكنك التواصل مع المصور للاستفسار عن الأسعار</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {photographer.packages?.map((pkg) => {
                          const isSelected = selectedPackage ? selectedPackage.id === pkg.id : false;
                          
                          return (
                            <motion.div
                              key={pkg.id}
                              className={`border rounded-lg p-4 transition-colors cursor-pointer relative bg-white ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-blue-300'
                              }`}
                              onClick={() => togglePackageSelection(pkg)}
                              whileHover={{ scale: 1.01 }}
                            >
                              {/* Badge for popular package */}
                              {pkg.popular && (
                                <div className="absolute -top-2 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                                  ⭐ الأكثر طلباً
                                </div>
                              )}
                              
                              {/* Selection indicator */}
                              <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-blue-500 border-blue-500' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>

                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="text-lg font-bold text-gray-800">{pkg.name}</h4>
                                  <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-blue-600">{pkg.price.toLocaleString()} جنيه</div>
                                  {pkg.originalPrice && (
                                    <div className="text-gray-400 text-sm line-through mt-1">{pkg.originalPrice.toLocaleString()} جنيه</div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-2">
                                {pkg.features?.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">📅 مواعيد العمل</h3>
                      {renderWorkingHours()}
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">💡 ملاحظات هامة</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          يفضل الحجز المسبق قبل أسبوع على الأقل
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          يمكن تغيير الموعد قبل 48 ساعة من الجلسة
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          متاح للتصوير في الاستوديو أو في الأماكن المفتوحة
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 self-start"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img 
                    src={photographer.profileImage} 
                    alt={photographer.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-blue-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{photographer.name}</h2>
                  <p className="text-blue-600 font-medium">{photographer.specialty}</p>
                  <p className="text-gray-600 text-sm">{photographer.businessName}</p>
                </div>
              </div>

              <div className="space-y-3 text-gray-700 mb-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-medium">التقييم:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(photographer.rating)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-medium">الخبرة:</span>
                  <span className="font-bold text-green-600">{photographer.experience} سنة</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium">المكان:</span>
                  <span className="font-bold text-purple-600">{photographer.city}، {photographer.governorate}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="font-medium">وقت الاستجابة:</span>
                  <span className="font-bold text-orange-600">{photographer.responseTime}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleBookPhotographer}
                  disabled={!selectedPackage}
                  className={`w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                    selectedPackage
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.176-1.24-6.165-3.495-8.411"/>
                  </svg>
                  {selectedPackage ? '💎 احجز الآن' : '❌ اختر باقة أولاً'}
                </button>

                <button 
                  onClick={handleConsultation}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  💬 استشارة مجانية
                </button>

                {selectedPackage && (
                  <button 
                    onClick={deselectPackage}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    🔄 إلغاء اختيار الباقة
                  </button>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">📞 معلومات التواصل</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">التليفون</div>
                    <div className="font-bold text-gray-800">{photographer.contact}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">الإيميل</div>
                    <div className="font-bold text-gray-800">{photographer.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">العنوان</div>
                    <div className="font-bold text-gray-800">{photographer.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Section */}
            {renderSocialMedia()}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img 
                src={images[lightboxImageIndex]} 
                alt={`${photographer.name} portfolio ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevLightboxImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextLightboxImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                    {lightboxImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographerDetailsPage;