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
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImageIndex, setAlbumImageIndex] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);

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
        {
          "title": "حفل زفاف سارة ومحمد",
          "description": "تصوير كامل لحفل زفاف في فندق شيراتون القاهرة",
          "category": "أفراح",
          "coverImage": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
          "images": [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
            "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800"
          ],
          "_id": "691de00c42282915cfc3d2b6",
          "date": "2025-11-19T15:19:40.949+00:00"
        },
        {
          "title": "جلسة تصوير طبيعية",
          "description": "جلسة تصوير في الحديقة اليابانية بالزمالك",
          "category": "طبيعي",
          "coverImage": "https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=800",
          "images": [
            "https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=800",
            "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
            "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800"
          ],
          "_id": "691de00c42282915cfc3d2b7",
          "date": "2025-11-18T10:30:25.123+00:00"
        },
        {
          "title": "تصوير أزياء حديث",
          "description": "جلسة تصوير أزياء عصرية في الاستوديو",
          "category": "أزياء",
          "coverImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
          "images": [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"
          ],
          "_id": "691de00c42282915cfc3d2b8",
          "date": "2025-11-17T14:15:30.456+00:00"
        },
        {
          "title": "جلسة تصوير عائلية",
          "description": "تصوير عائلي في الاستوديو بخلفيات كلاسيكية",
          "category": "عائلات",
          "coverImage": "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
          "images": [
            "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
            "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800",
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
          ],
          "_id": "691de00c42282915cfc3d2b9",
          "date": "2025-11-16T09:20:15.789+00:00"
        }
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
          "comment": "مصور رائع ومحترف، الصور كانت أكثر من رائعة! التعامل كان في قمة الاحترافية. أنصح به بشدة لكل من يبحث عن التميز في التصوير التقليدي.",
          "date": "2024-01-15",
          "verified": true
        },
        {
          "user": "فاطمة أحمد",
          "rating": 4.5,
          "comment": "تعامل راقي وجودة تصوير ممتازة، أنصح به لكل من يبحث عن التميز. الألبوم النهائي كان رائعاً ويعكس الذوق الرفيع.",
          "date": "2024-01-10",
          "verified": true
        },
        {
          "user": "خالد محمود",
          "rating": 5,
          "comment": "أسلوب فريد في التصوير، يلتقط اللحظات بشكل رائع ويحافظ على الذكريات. تجربة رائعة من البداية للنهاية.",
          "date": "2024-01-05",
          "verified": true
        },
        {
          "user": "سارة عبدالله",
          "rating": 4.8,
          "comment": "تجربة رائعة من البداية للنهاية، أنصح بالباقة المميزة. جودة التصوير والتعديل كانت استثنائية.",
          "date": "2024-01-02",
          "verified": true
        },
        {
          "user": "مريم حسن",
          "rating": 5,
          "comment": "أفضل مصور تعاملت معه! الاحترافية في التعامل وجودة العمل تتجاوز التوقعات. شكراً على الذكريات الرائعة.",
          "date": "2023-12-28",
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
            "تسليم خلال 7 أيام",
            "غطاء تصوير أساسي"
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
            "تسليم خلال 5 أيام",
            "مصور مساعد"
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
            "نسخة إضافية من الألبوم",
            "فيديو تذكاري قصير"
          ],
          "popular": false
        },
        {
          "id": 4,
          "name": "الباقة الذهبية",
          "price": 12000, 
          "originalPrice": 15000,
          "description": "باقة شاملة بكل ما تحتاجه لمناسبة لا تنسى",
          "features": [
            "12 ساعة تصوير",
            "300 صورة معدلة",
            "ألبوم فاخر 40×60",
            "إكسسوارات تراثية فاخرة",
            "تعديل احترافي متقدم",
            "7 خلفيات مختلفة",
            "صور مطبوعة بحجم 15×20",
            "تسليم فوري خلال 48 ساعة",
            "نسختين إضافيتين من الألبوم",
            "فيديو تذكاري احترافي",
            "جلسة تصوير إضافية",
            "تصوير درون"
          ],
          "popular": false
        }
      ]
    }
  };

  // دالة لاختيار صور عشوائية من الألبومات
  const getRandomSliderImages = (portfolio, count = 4) => {
    if (!portfolio || portfolio.length === 0) return [];
    
    const allImages = portfolio.flatMap(album => album.images || []);
    
    if (allImages.length === 0) return [];
    
    if (allImages.length <= count) return allImages;
    
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Auto slide for gallery
  useEffect(() => {
    if (!autoSlide || !sliderImages || sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSlide, sliderImages]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true);
        console.log('🔄 جاري البحث عن المصور بالID:', id);

        await new Promise(resolve => setTimeout(resolve, 500));

        const foundPhotographer = mockPhotographers[id];
        if (foundPhotographer) {
          console.log('✅ تم العثور على المصور في البيانات المحلية');
          setPhotographer(foundPhotographer);
          
          const randomImages = getRandomSliderImages(foundPhotographer.portfolio, 4);
          setSliderImages(randomImages);
          console.log('🎰 صور السلايدر العشوائية:', randomImages.length);
          
          setSelectedPackage(null);
          setLoading(false);
          return;
        }

        console.log('🔍 جاري البحث في الـ API...');
        const response = await fetch(`https://bookera-production.up.railway.app/api/photographers/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم جلب بيانات المصور من API:', data);
          setPhotographer(data);
          
          const randomImages = getRandomSliderImages(data.portfolio, 4);
          setSliderImages(randomImages);
          console.log('🎰 صور السلايدر العشوائية:', randomImages.length);
          
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
    if (sliderImages && sliderImages.length > 0) {
      setSelectedImage(prev => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (sliderImages && sliderImages.length > 0) {
      setSelectedImage(prev => 
        prev === 0 ? sliderImages.length - 1 : prev - 1
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

  const togglePackageSelection = (pkg) => {
    const isSamePackage = selectedPackage && selectedPackage.id === pkg.id;
    
    if (isSamePackage) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(pkg);
    }
  };

  const deselectPackage = () => {
    setSelectedPackage(null);
  };

  // Lightbox functions for gallery
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    if (sliderImages) {
      setLightboxImageIndex(prev => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevLightboxImage = () => {
    if (sliderImages) {
      setLightboxImageIndex(prev => 
        prev === 0 ? sliderImages.length - 1 : prev - 1
      );
    }
  };

  // Album modal functions
  const openAlbumModal = (album) => {
    setSelectedAlbum(album);
    setAlbumImageIndex(0);
    setAlbumModalOpen(true);
  };

  const closeAlbumModal = () => {
    setAlbumModalOpen(false);
    setSelectedAlbum(null);
    setAlbumImageIndex(0);
  };

  const nextAlbumImage = () => {
    if (selectedAlbum?.images) {
      setAlbumImageIndex(prev => 
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevAlbumImage = () => {
    if (selectedAlbum?.images) {
      setAlbumImageIndex(prev => 
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
      );
    }
  };

  // Social media functions
  const handleSocialMediaClick = (platform, url) => {
    if (!url) {
      alert(`لا يوجد رابط متاح لـ ${platform}`);
      return;
    }
    
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
      <div className="space-y-4">
        {Object.entries(photographer.workingHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <span className="text-gray-700 font-medium text-lg">{days[day]}:</span>
            <span className="font-bold text-blue-600 text-lg">{hours}</span>
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

  const hasMultipleImages = sliderImages.length > 1;
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
            {/* Portfolio Gallery - السلايدر الرئيسي */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* Main Image Slider */}
              <div className="relative h-96 lg:h-[500px] bg-gray-100">
                {sliderImages.length > 0 ? (
                  <>
                    <img 
                      src={sliderImages[selectedImage]} 
                      alt={`${photographer.name} gallery ${selectedImage + 1}`}
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
                        {selectedImage + 1} / {sliderImages.length}
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

                    {/* Badge يوضح أن الصور عشوائية من الألبومات */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      🎰 عرض عشوائي من الأعمال
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    لا توجد صور متاحة في المعرض
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {sliderImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index 
                            ? 'border-blue-500 scale-105' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${photographer.name} ${index + 1}`}
                          className="w-20 h-16 object-cover"
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
              className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-2xl p-6 text-center shadow-xl"
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
              className="bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              {/* Tabs Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
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
                      className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white shadow-sm rounded-t-lg'
                          : 'border-transparent text-gray-600 hover:text-blue-500 hover:bg-white/50'
                      }`}
                    >
                      <span className="ml-2 text-lg">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tabs Content */}
              <div className="p-6">
                {activeTab === "portfolio" && (
                  <div className="space-y-6">
                    {/* Albums Grid - تصميم محترف */}
                    {photographer.portfolio && photographer.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {photographer.portfolio.map((album, index) => (
                          <motion.div
                            key={album._id}
                            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 hover:border-blue-300"
                            onClick={() => openAlbumModal(album)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ 
                              scale: 1.02,
                              y: -5
                            }}
                          >
                            <div className="relative h-80 overflow-hidden">
                              <img
                                src={album.coverImage}
                                alt={album.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="flex items-center justify-between text-white">
                                    <div>
                                      <h3 className="text-xl font-bold mb-1">{album.title}</h3>
                                      <p className="text-sm text-gray-200 line-clamp-2">{album.description}</p>
                                    </div>
                                    <div className="bg-blue-500 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Badges */}
                              <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                  {album.images?.length || 0} صورة
                                </span>
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                  {album.category}
                                </span>
                              </div>
                              
                              {/* Date */}
                              <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                {new Date(album.date).toLocaleDateString('ar-EG')}
                              </div>
                            </div>
                            
                            <div className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{album.title}</h3>
                                <span className="text-blue-600 text-sm font-medium">
                                  {album.images?.length || 0} صورة
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                {album.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  {album.category}
                                </span>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                                  عرض الكل →
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد ألبومات متاحة</h3>
                        <p className="text-gray-600">لم يقم المصور برفع أي ألبومات حتى الآن</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📖</span>
                        السيرة الذاتية
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{photographer.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">{photographer.experience}+</div>
                        <div className="text-blue-100 text-sm">سنوات خبرة</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">100+</div>
                        <div className="text-green-100 text-sm">عميل سعيد</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">500+</div>
                        <div className="text-purple-100 text-sm">جلسة تصوير</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-bold mb-1">50+</div>
                        <div className="text-orange-100 text-sm">جائزة وتكريم</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🎯</span>
                        الخدمات المقدمة
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {photographer.services?.map((service, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700 font-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🔧</span>
                        المعدات المستخدمة
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {photographer.equipment?.map((item, index) => (
                          <span key={index} className="bg-white text-blue-700 px-4 py-2 rounded-xl text-sm border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-yellow-600 mb-2">{photographer.rating}</div>
                          {renderStars(photographer.rating)}
                          <p className="text-gray-600 mt-2">بناءً على {photographer.reviews?.length || 0} تقييم</p>
                        </div>
                        <div className="flex-1 max-w-md">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = photographer.reviews?.filter(review => review.rating === star).length || 0;
                            const percentage = (count / (photographer.reviews?.length || 1)) * 100;
                            return (
                              <div key={star} className="flex items-center gap-3 mb-2">
                                <span className="text-gray-600 w-8 text-sm">{star}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-yellow-400 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-600 text-sm w-8">({count})</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {photographer.reviews?.map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg">{review.user}</h4>
                                {review.verified && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit mt-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    موثق
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-lg leading-relaxed">{review.comment}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "packages" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span>💰</span>
                        اختر الباقة المناسبة لك
                      </h3>
                      <p className="text-gray-600 text-lg">اختر الباقة التي تناسب احتياجاتك وميزانيتك</p>
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-700 text-sm">
                          <strong>الحالة الحالية:</strong> {selectedPackage ? `الباقة المختارة: ${selectedPackage.name}` : 'لا توجد باقة مختارة'}
                        </p>
                      </div>
                    </div>
                    
                    {!hasPackages ? (
                      <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
                        <div className="text-6xl mb-4">💼</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد باقات متاحة حالياً</h3>
                        <p className="text-gray-600">يمكنك التواصل مع المصور للاستفسار عن الأسعار</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {photographer.packages?.map((pkg) => {
                          const isSelected = selectedPackage ? selectedPackage.id === pkg.id : false;
                          
                          return (
                            <motion.div
                              key={pkg.id}
                              className={`border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer relative bg-white ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-xl scale-105'
                                  : pkg.popular
                                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 hover:border-yellow-500'
                                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                              }`}
                              onClick={() => togglePackageSelection(pkg)}
                              whileHover={{ scale: 1.02 }}
                            >
                              {/* Badge for popular package */}
                              {pkg.popular && (
                                <div className="absolute -top-3 left-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                  ⭐ الأكثر طلباً
                                </div>
                              )}
                              
                              {/* Selection indicator */}
                              <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-blue-500 border-blue-500' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>

                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h4>
                                  <p className="text-gray-600 text-lg leading-relaxed">{pkg.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-3xl font-bold text-blue-600">{pkg.price.toLocaleString()} جنيه</div>
                                  {pkg.originalPrice && (
                                    <div className="text-gray-400 text-lg line-through mt-1">{pkg.originalPrice.toLocaleString()} جنيه</div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3 mt-6">
                                {pkg.features?.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 text-lg">{feature}</span>
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
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📅</span>
                        مواعيد العمل
                      </h3>
                      {renderWorkingHours()}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span>💡</span>
                          ملاحظات هامة
                        </h4>
                        <ul className="space-y-3 text-gray-700 text-lg">
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            يفضل الحجز المسبق قبل أسبوع على الأقل
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            يمكن تغيير الموعد قبل 48 ساعة من الجلسة
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            متاح للتصوير في الاستوديو أو في الأماكن المفتوحة
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            الدفع 50% مقدماً عند الحجز
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span>⚡</span>
                          الخدمات السريعة
                        </h4>
                        <ul className="space-y-3 text-gray-700 text-lg">
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                            استشارة مجانية قبل الحجز
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                            تسليم سريع للصور خلال 3-7 أيام
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                            دعم فني متواصل
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                            ضمان جودة 100%
                          </li>
                        </ul>
                      </div>
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
              className="bg-white rounded-2xl border border-gray-200 p-6 self-start shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={photographer.profileImage} 
                    alt={photographer.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{photographer.name}</h2>
                  <p className="text-blue-600 font-semibold">{photographer.specialty}</p>
                  <p className="text-gray-600 text-sm">{photographer.businessName}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <span className="font-semibold text-gray-700">التقييم:</span>
                  <div className="flex items-center gap-2">
                    {renderStars(photographer.rating)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <span className="font-semibold text-gray-700">الخبرة:</span>
                  <span className="font-bold text-green-600 text-lg">{photographer.experience} سنة</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <span className="font-semibold text-gray-700">المكان:</span>
                  <span className="font-bold text-purple-600 text-sm text-left">{photographer.city}، {photographer.governorate}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <span className="font-semibold text-gray-700">وقت الاستجابة:</span>
                  <span className="font-bold text-orange-600">{photographer.responseTime}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleBookPhotographer}
                  disabled={!selectedPackage}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                    selectedPackage
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.176-1.24-6.165-3.495-8.411"/>
                  </svg>
                  {selectedPackage ? '💎 احجز الآن' : '❌ اختر باقة أولاً'}
                </button>

                <button 
                  onClick={handleConsultation}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  💬 استشارة مجانية
                </button>

                {selectedPackage && (
                  <button 
                    onClick={deselectPackage}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
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
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📞</span>
                معلومات التواصل
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">التليفون</div>
                    <div className="font-bold text-gray-800 text-lg">{photographer.contact}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">الإيميل</div>
                    <div className="font-bold text-gray-800 text-lg">{photographer.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">العنوان</div>
                    <div className="font-bold text-gray-800 text-sm leading-relaxed">{photographer.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Section */}
            {renderSocialMedia()}
          </div>
        </div>
      </div>

      {/* Lightbox for Gallery */}
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
                src={sliderImages[lightboxImageIndex]} 
                alt={`${photographer.name} gallery ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-[95vh] object-contain rounded-lg"
              />

              {sliderImages.length > 1 && (
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
                    {lightboxImageIndex + 1} / {sliderImages.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Album Modal - بدون الخط الأزرق */}
      <AnimatePresence>
        {albumModalOpen && selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeAlbumModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - بدون تدرج أزرق */}
              {/* <div className="bg-white border-b border-gray-200 p-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{selectedAlbum.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{selectedAlbum.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        {selectedAlbum.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {selectedAlbum.images?.length || 0} صورة
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(selectedAlbum.date).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeAlbumModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors ml-6 bg-gray-100 rounded-full p-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div> */}

              {/* Content */}
             <div className="p-0 max-h-[90vh] overflow-y-auto bg-transparent">
  <div className="relative overflow-hidden bg-transparent">
    {selectedAlbum.images && selectedAlbum.images.length > 0 ? (
      <>
        <img 
          src={selectedAlbum.images[albumImageIndex]} 
          alt={`${selectedAlbum.title} - ${albumImageIndex + 1}`}
          className="w-full max-h-[85vh] object-contain bg-transparent"
        />
        
        {/* Navigation Arrows */}
        {selectedAlbum.images.length > 1 && (
          <>
            <button
              onClick={prevAlbumImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextAlbumImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {selectedAlbum.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {albumImageIndex + 1} / {selectedAlbum.images.length}
          </div>
        )}
      </>
    ) : (
      <div className="w-full h-[600px] flex items-center justify-center text-gray-500 bg-transparent">
        لا توجد صور متاحة في هذا الألبوم
      </div>
    )}
  </div>
</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographerDetailsPage;