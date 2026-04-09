import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap-icons/font/bootstrap-icons.css';

const PhotographerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [sliderImages, setSliderImages] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFullBio, setShowFullBio] = useState(false);
  
  const fetchedRef = useRef(false);
  const mountedRef = useRef(true);

  const API_URL = 'http://localhost:5000/api';

  // ✅ دالة لتحويل التاريخ من UTC إلى YYYY-MM-DD فقط
  const formatDateOnly = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // جلب البيانات
  useEffect(() => {
    mountedRef.current = true;
    
    if (fetchedRef.current) {
      console.log("⚠️ Already fetched, skipping...");
      return;
    }
    
    const fetchPhotographer = async () => {
      if (!id) {
        setError('لم يتم تحديد مصور');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔄 Fetching photographer ID: ${id}`);
        
        const response = await fetch(`${API_URL}/photographers/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('المصور غير موجود');
          }
          throw new Error(`فشل في تحميل البيانات: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ API Response:", data);
        
        if (mountedRef.current) {
          if (data.success && data.photographer) {
            const photographerData = data.photographer;
            console.log("✅ Photographer found:", photographerData.name);
            
            // ✅ معالجة التوفر - تحويل التواريخ إلى صيغة YYYY-MM-DD فقط
            const processedAvailability = (photographerData.availability || []).map(item => ({
              ...item,
              date: formatDateOnly(item.date) // تحويل "2026-04-09T22:00:00.000Z" إلى "2026-04-09"
            }));
            
            console.log("📅 Processed availability:", processedAvailability);
            
            setPhotographer(photographerData);
            setReviews(photographerData.recent_reviews || []);
            setAvailability(processedAvailability);
            
            fetchedRef.current = true;
            
            // ✅ تجهيز الصور من portfolio
            let imagesArray = [];
            
            if (photographerData.portfolio) {
              if (Array.isArray(photographerData.portfolio)) {
                imagesArray = photographerData.portfolio;
                console.log("📸 Portfolio is array with", imagesArray.length, "images");
              } 
              else if (typeof photographerData.portfolio === 'string' && photographerData.portfolio !== "null") {
                imagesArray = [photographerData.portfolio];
                console.log("📸 Portfolio is single image URL");
              }
            }
            
            // إذا مفيش صور، استخدم صور افتراضية
            if (imagesArray.length === 0) {
              imagesArray = [
                "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format",
                "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format",
                "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&auto=format"
              ];
              console.log("📸 Using default images");
            }
            
            setSliderImages(imagesArray);
          } else {
            throw new Error('بيانات المصور غير مكتملة');
          }
        }
        
      } catch (err) {
        console.error('❌ Error:', err);
        if (mountedRef.current) {
          setError(err.message);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchPhotographer();

    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  // ✅ التحقق مما إذا كان اليوم محجوزاً (is_available = false)
  const isDateBooked = (date) => {
    const availabilityRecord = availability.find(a => a.date === date);
    if (availabilityRecord) {
      return !availabilityRecord.is_available;
    }
    return false;
  };

  // ✅ التحقق مما إذا كان اليوم متاحاً (is_available = true)
  const isDateAvailable = (date) => {
    const availabilityRecord = availability.find(a => a.date === date);
    if (availabilityRecord) {
      return availabilityRecord.is_available;
    }
    return true; // إذا لم يوجد سجل، فهو متاح افتراضياً
  };

  // ✅ الحصول على ملاحظة اليوم
  const getDateNote = (date) => {
    const availabilityRecord = availability.find(a => a.date === date);
    if (availabilityRecord && !availabilityRecord.is_available) {
      return availabilityRecord.note || "محجوز";
    }
    if (availabilityRecord && availabilityRecord.is_available && availabilityRecord.note && availabilityRecord.note !== "متاح") {
      return availabilityRecord.note;
    }
    return "";
  };

  // ✅ الحصول على وقت العمل لليوم
  const getWorkingTimeForDate = (date) => {
    const availabilityRecord = availability.find(a => a.date === date);
    if (availabilityRecord && availabilityRecord.is_available && availabilityRecord.start_time && availabilityRecord.end_time) {
      const start = availabilityRecord.start_time.slice(0,5);
      const end = availabilityRecord.end_time.slice(0,5);
      return `${start} - ${end}`;
    }
    return null;
  };

  // الحصول على أيام الشهر
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // تغيير الشهر
  const changeMonth = (delta) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  // تنسيق التاريخ YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ✅ التحقق من أن التاريخ المحدد في الحجز متاح
  const isSelectedDateAvailable = (dateStr) => {
    if (!dateStr) return false;
    const isPast = new Date(dateStr) < new Date(new Date().toDateString());
    if (isPast) return false;
    return !isDateBooked(dateStr) && isDateAvailable(dateStr);
  };

  // إضافة تقييم جديد
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewName.trim()) {
      alert("الرجاء إدخال اسمك");
      return;
    }
    
    setSubmittingReview(true);
    
    try {
      const response = await fetch(`${API_URL}/photographers/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newReview = {
          id: Date.now(),
          user_name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          created_at: new Date().toISOString()
        };
        
        setReviews([newReview, ...reviews]);
        
        if (photographer) {
          const newTotalReviews = (photographer.total_reviews || 0) + 1;
          const newRating = ((photographer.rating || 0) * (photographer.total_reviews || 0) + reviewRating) / newTotalReviews;
          setPhotographer({
            ...photographer,
            rating: newRating,
            total_reviews: newTotalReviews
          });
        }
        
        setShowReviewModal(false);
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
        
        alert("✅ تم إضافة تقييمك بنجاح!");
      } else {
        throw new Error(data.message || "فشل في إضافة التقييم");
      }
      
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("❌ حدث خطأ في إضافة التقييم. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const prepareWhatsAppNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    cleanNumber = cleanNumber.replace(/^0+/, '');
    if (!cleanNumber.startsWith('20')) {
      cleanNumber = '20' + cleanNumber;
    }
    return cleanNumber;
  };

  const handleWhatsAppContact = () => {
    if (!photographer?.contact) {
      alert("رقم الهاتف غير متوفر");
      return;
    }
    const phoneNumber = prepareWhatsAppNumber(photographer.contact);
    const message = `مرحباً ${photographer.name}، أنا تواصلت معك من خلال موقع بوكيرا وأرغب في الاستفسار عن خدمات التصوير.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleBookPackage = (pkg = null) => {
    setBookingPackage(pkg);
    setBookingModalOpen(true);
  };

  const submitBooking = () => {
    if (!bookingName || !bookingPhone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف");
      return;
    }
    
    if (bookingDate && !isSelectedDateAvailable(bookingDate)) {
      alert("❌ التاريخ المحدد غير متاح للحجز. الرجاء اختيار تاريخ آخر.");
      return;
    }

    const phoneNumber = prepareWhatsAppNumber(photographer?.contact);
    let message = `مرحباً ${photographer?.name}،\nأنا ${bookingName} تواصلت معك وأرغب في حجز جلسة تصوير.\n\n📞 رقم هاتفي: ${bookingPhone}`;

    if (bookingPackage) {
      message += `\n\n📦 الباقة: ${bookingPackage.name}\n💰 السعر: ${bookingPackage.price.toLocaleString()} جنيه`;
    }
    if (bookingDate) message += `\n📅 التاريخ: ${bookingDate}`;
    if (bookingTime) message += `\n⏰ الوقت: ${bookingTime}`;
    if (bookingNotes) message += `\n\n📝 ملاحظات: ${bookingNotes}`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    setBookingModalOpen(false);
    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setBookingTime("");
    setBookingNotes("");
    setBookingPackage(null);
  };

  const nextImage = () => {
    if (sliderImages.length > 0) {
      setSelectedImage((prev) => (prev + 1) % sliderImages.length);
    }
  };

  const prevImage = () => {
    if (sliderImages.length > 0) {
      setSelectedImage((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    }
  };

  const openLightbox = (index) => {
    if (index < sliderImages.length) {
      setLightboxImageIndex(index);
      setLightboxOpen(true);
    }
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi bi-star-fill text-sm ${
              star <= Math.round(numRating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          ></i>
        ))}
        <span className="text-gray-600 text-xs mr-1">({numRating.toFixed(1)})</span>
      </div>
    );
  };

  // ✅ عرض التقويم - نسخة مصححة بالكامل
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    const dayNames = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    
    // إضافة أيام فارغة قبل أول يوم
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 bg-gray-50 rounded-lg"></div>);
    }
    
    // إضافة أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const isBooked = isDateBooked(dateStr);
      const isAvailable = isDateAvailable(dateStr);
      const isPast = date < today;
      const note = getDateNote(dateStr);
      const workingTime = getWorkingTimeForDate(dateStr);
      
      // تحديد اللون والحالة
      let bgColor = "bg-green-100 border-green-500";
      let statusText = "✅ متاح";
      let statusColor = "text-green-600";
      let canBook = true;
      let dayNumberColor = "text-green-700";
      
      if (isPast) {
        bgColor = "bg-gray-100 border-gray-300 opacity-60";
        statusText = "📅 تاريخ ماضي";
        statusColor = "text-gray-400";
        dayNumberColor = "text-gray-400";
        canBook = false;
      } else if (isBooked) {
        bgColor = "bg-red-100 border-red-500";
        statusText = note || "❌ محجوز";
        statusColor = "text-red-600";
        dayNumberColor = "text-red-700";
        canBook = false;
      } else if (isAvailable) {
        bgColor = "bg-green-100 border-green-500 hover:bg-green-200";
        statusText = "✅ متاح";
        statusColor = "text-green-600";
        dayNumberColor = "text-green-700";
        canBook = true;
      }
      
      days.push(
        <div
          key={day}
          onClick={() => {
            if (canBook) {
              setBookingDate(dateStr);
              setBookingModalOpen(true);
            } else if (isBooked) {
              alert(`❌ هذا اليوم محجوز${note ? `: ${note}` : ''}`);
            } else if (isPast) {
              alert("📅 لا يمكن حجز تواريخ ماضية");
            }
          }}
          className={`h-28 rounded-lg p-2 transition-all cursor-pointer ${bgColor} border-2 ${
            !isPast && !isBooked && isAvailable ? 'hover:shadow-lg hover:scale-105' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <span className={`text-lg font-bold ${dayNumberColor}`}>
              {day}
            </span>
            {workingTime && !isPast && !isBooked && (
              <span className="text-xs mt-1 text-blue-600 truncate">
                🕐 {workingTime}
              </span>
            )}
            {note && !isPast && (
              <span className={`text-xs mt-1 truncate font-medium ${isBooked ? 'text-red-600' : 'text-blue-600'}`}>
                📝 {note.length > 15 ? note.slice(0, 12) + '...' : note}
              </span>
            )}
            <span className={`text-xs mt-auto font-medium ${statusColor}`}>
              {statusText}
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="bi bi-chevron-right text-xl"></i>
          </button>
          <h3 className="text-xl font-bold text-gray-800">
            {currentMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="bi bi-chevron-left text-xl"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
        
        <div className="mt-6 flex justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">✅ متاح للحجز</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">❌ محجوز</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">📅 تاريخ ماضي</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center">
          <p className="text-sm text-gray-600">
            <i className="bi bi-info-circle-fill text-blue-500 ml-1"></i>
            اضغط على أي يوم متاح (بالأخضر) للحجز المباشر
          </p>
        </div>
      </div>
    );
  };

  // ✅ صورة البروفايل الافتراضية
  const getProfileImage = () => {
    if (photographer?.profile_image && photographer.profile_image !== "null" && photographer.profile_image !== null) {
      return photographer.profile_image;
    }
    return "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format";
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-bold">جاري تحميل بيانات المصور...</p>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md">
          <i className="bi bi-emoji-frown text-7xl text-gray-400 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">عذراً!</h1>
          <p className="text-gray-600 text-base mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold w-full"
            >
              إعادة المحاولة
            </button>
            <button 
              onClick={() => navigate('/photographers')}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold w-full"
            >
              العودة للمصورين
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!photographer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* زر المشاركة */}
      <button
        onClick={() => {
          const shareUrl = `${window.location.origin}/photographers/${photographer.id}`;
          if (navigator.share) {
            navigator.share({
              title: photographer.name,
              text: `📸 تعرف على أعمال ${photographer.name} - ${photographer.specialty}`,
              url: shareUrl,
            });
          } else {
            navigator.clipboard.writeText(shareUrl);
            alert('✅ تم نسخ رابط المصور');
          }
        }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 px-4 py-2 rounded-xl font-medium transition-all shadow-lg backdrop-blur-sm border border-gray-200"
      >
        <i className="bi bi-share"></i>
        <span className="text-sm">مشاركة</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* العمود الأيسر */}
          <div className="lg:col-span-2 space-y-6">
            {/* معرض الصور */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
              <div className="relative h-80 lg:h-96 bg-gray-900">
                {sliderImages.length > 0 && sliderImages[selectedImage] ? (
                  <img 
                    src={sliderImages[selectedImage]} 
                    alt={photographer.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(selectedImage)}
                    onError={(e) => {
                      console.error("Image failed to load:", sliderImages[selectedImage]);
                      e.target.src = "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <i className="bi bi-camera text-white text-6xl opacity-50"></i>
                  </div>
                )}
                
                {sliderImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
                    >
                      <i className="bi bi-chevron-right text-xl"></i>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
                    >
                      <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs z-10">
                      {selectedImage + 1} / {sliderImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* صور مصغرة */}
              {sliderImages.length > 1 && (
                <div className="p-3 bg-gray-50 overflow-x-auto">
                  <div className="flex gap-2">
                    {sliderImages.map((img, idx) => (
                      <button
                        key={`img-${idx}`}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=100&auto=format";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* التبويبات */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex p-2 gap-1 overflow-x-auto">
                  {[
                    { id: "details", label: "التفاصيل", icon: "bi-info-circle" },
                    { id: "packages", label: "الباقات", icon: "bi-cash-stack" },
                    { id: "portfolio", label: "المعرض", icon: "bi-images" },
                    { id: "reviews", label: "التقييمات", icon: "bi-star" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-6 font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.id 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <i className={tab.icon}></i>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* تبويب التفاصيل مع التقويم */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    {/* معلومات المصور الأساسية */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">{photographer.name}</h1>
                        {photographer.subscription_type === "free" ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            🆓 حساب مجاني
                          </span>
                        ) : (
                          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <i className="bi bi-patch-check-fill"></i>
                            موثق
                          </span>
                        )}
                      </div>
                      
                      <p className="text-blue-600 font-semibold mb-2">{photographer.specialty}</p>
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(photographer.rating)}
                        <span className="text-gray-500 text-sm">({photographer.total_reviews || 0} تقييم)</span>
                      </div>
                      
                      {/* السيرة الذاتية */}
                      <div className="mb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {showFullBio 
                            ? (photographer.description || "مصور محترف بخبرة واسعة في مجال التصوير الفوتوغرافي")
                            : (photographer.description || "مصور محترف بخبرة واسعة في مجال التصوير الفوتوغرافي").slice(0, 200)}
                          {(photographer.description || "").length > 200 && (
                            <button
                              onClick={() => setShowFullBio(!showFullBio)}
                              className="text-blue-500 mr-2 hover:text-blue-600"
                            >
                              {showFullBio ? "عرض أقل" : "اقرأ المزيد"}
                            </button>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* إحصائيات المصور */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <i className="bi bi-briefcase text-2xl text-blue-600 mb-2"></i>
                        <div className="text-2xl font-bold text-blue-600">{photographer.experience}+</div>
                        <div className="text-gray-600 text-sm">سنوات خبرة</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl text-center">
                        <i className="bi bi-eye text-2xl text-green-600 mb-2"></i>
                        <div className="text-2xl font-bold text-green-600">{photographer.total_views || 0}+</div>
                        <div className="text-gray-600 text-sm">مشاهدة</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl text-center">
                        <i className="bi bi-calendar-check text-2xl text-purple-600 mb-2"></i>
                        <div className="text-2xl font-bold text-purple-600">{photographer.total_bookings || 0}</div>
                        <div className="text-gray-600 text-sm">حجوزات</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl text-center">
                        <i className="bi bi-star-fill text-2xl text-orange-600 mb-2"></i>
                        <div className="text-2xl font-bold text-orange-600">{photographer.rating || 0}</div>
                        <div className="text-gray-600 text-sm">التقييم</div>
                      </div>
                    </div>

                    {/* الخدمات */}
                    {photographer.services && photographer.services.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <i className="bi bi-grid-3x3-gap-fill text-blue-500"></i>
                          الخدمات المقدمة
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {photographer.services.map((service, idx) => (
                            <span key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 border border-gray-200">
                              <i className="bi bi-check-circle-fill text-green-500 text-xs ml-1"></i>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* معلومات إضافية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <i className="bi bi-geo-alt-fill text-red-500"></i>
                          العنوان
                        </h4>
                        <p className="text-gray-600 text-sm">{photographer.address || "العنوان غير متوفر"}</p>
                        <p className="text-gray-500 text-xs mt-1">{photographer.city}، {photographer.governorate}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <i className="bi bi-telephone-fill text-green-500"></i>
                          التواصل
                        </h4>
                        <p className="text-gray-600 text-sm">{photographer.contact || "رقم الهاتف غير متوفر"}</p>
                        <p className="text-gray-500 text-xs mt-1">{photographer.email || "البريد الإلكتروني غير متوفر"}</p>
                      </div>
                    </div>

                    {/* التقويم */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                        <i className="bi bi-calendar-week text-blue-500"></i>
                        تقويم التوفر
                      </h3>
                      {renderCalendar()}
                    </div>
                  </div>
                )}

                {/* تبويب الباقات */}
                {activeTab === "packages" && (
                  <div className="space-y-4">
                    {!photographer.packages || photographer.packages.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="bi bi-gift text-5xl text-gray-400 mb-4"></i>
                        <p className="text-gray-500">لا توجد باقات متاحة حالياً</p>
                        <button onClick={() => handleBookPackage()} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-xl">
                          طلب استشارة
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {photographer.packages.map((pkg, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-2 rounded-xl p-4 hover:shadow-lg transition-all hover:border-blue-300"
                          >
                            <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>
                            <p className="text-2xl font-bold text-blue-600 my-2">{Number(pkg.price).toLocaleString()} ج.م</p>
                            <p className="text-gray-600 text-sm">{pkg.description}</p>
                            {pkg.features && (
                              <ul className="mt-3 space-y-1">
                                {pkg.features.map((feature, i) => (
                                  <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                                    <i className="bi bi-check-circle-fill text-green-500 text-xs"></i>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            )}
                            <button 
                              onClick={() => handleBookPackage(pkg)} 
                              className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                            >
                              احجز الآن
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* تبويب المعرض */}
                {activeTab === "portfolio" && (
                  <div>
                    {sliderImages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <i className="bi bi-image text-5xl mb-4"></i>
                        <p>لا توجد صور متاحة</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {sliderImages.map((img, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => openLightbox(idx)}
                          >
                            <img 
                              src={img} 
                              alt={`صورة ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&auto=format";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <i className="bi bi-zoom-in text-white text-2xl"></i>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* تبويب التقييمات */}
                {activeTab === "reviews" && (
                  <div>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="mb-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:from-purple-600 hover:to-purple-700 transition-all"
                    >
                      <i className="bi bi-star-fill"></i>
                      أضف تقييمك
                    </button>

                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <i className="bi bi-chat text-5xl mb-4"></i>
                        <p>لا توجد تقييمات بعد</p>
                        <p className="text-sm mt-2">كن أول من يقيم هذا المصور</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review, idx) => (
                          <motion.div 
                            key={review.id || idx} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-b border-gray-100 pb-4 last:border-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-gray-800">{review.user_name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-600 mt-2 mr-2">{review.comment}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* العمود الأيمن - معلومات التواصل */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xl sticky top-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={getProfileImage()}
                    alt={photographer.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&auto=format";
                    }}
                  />
                  {photographer.subscription_type !== "free" && (
                    <div className="absolute bottom-0 right-4 bg-green-500 rounded-full p-1 border-2 border-white">
                      <i className="bi bi-patch-check-fill text-white text-sm"></i>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-4">{photographer.name}</h2>
                <p className="text-blue-600">{photographer.specialty}</p>
                <p className="text-gray-500 text-sm mt-1">
                  <i className="bi bi-geo-alt-fill"></i> {photographer.city}، {photographer.governorate}
                </p>
              </div>

              <div className="space-y-3 mt-6">
                <button 
                  onClick={() => handleBookPackage()} 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <i className="bi bi-calendar-check"></i>
                  حجز استشارة
                </button>
                
                <button 
                  onClick={handleWhatsAppContact} 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <i className="bi bi-whatsapp"></i>
                  واتساب
                </button>
                
                <button 
                  onClick={() => setShowContactModal(true)} 
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  <i className="bi bi-telephone-fill"></i>
                  طرق التواصل
                </button>
                
                <button 
                  onClick={() => navigate('/photographers')} 
                  className="w-full bg-gray-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-600 transition-all"
                >
                  <i className="bi bi-camera"></i>
                  جميع المصورين
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="bi bi-info-circle-fill text-blue-500"></i>
                  معلومات سريعة
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">عضو منذ:</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(photographer.created_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">نوع العضوية:</span>
                    <span className={`font-medium ${
                      photographer.subscription_type === "free" ? "text-green-600" : "text-amber-600"
                    }`}>
                      {photographer.subscription_type === "free" ? "مجاني" : "مميز"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">عدد الخدمات:</span>
                    <span className="text-gray-800 font-medium">{photographer.services?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">عدد الباقات:</span>
                    <span className="text-gray-800 font-medium">{photographer.packages?.length || 0}</span>
                  </div>
                </div>
              </div>

              {photographer.price && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-gray-600 text-sm">تبدأ الأسعار من</p>
                  <p className="text-2xl font-bold text-blue-600">{Number(photographer.price).toLocaleString()} ج.م</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* باقي المودالات كما هي */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center mb-4">تواصل مع {photographer?.name}</h3>
              <div className="space-y-3">
                <button onClick={handleWhatsAppContact} className="w-full bg-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                  <i className="bi bi-whatsapp"></i> واتساب
                </button>
                <button onClick={() => { window.open(`tel:${photographer?.contact}`); setShowContactModal(false); }} className="w-full bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                  <i className="bi bi-telephone-fill"></i> اتصال
                </button>
                <button onClick={() => { window.open(`mailto:${photographer?.email}`); setShowContactModal(false); }} className="w-full bg-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                  <i className="bi bi-envelope-fill"></i> إيميل
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center mb-4">أضف تقييمك</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسمك</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="أدخل اسمك"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        <i className={`bi bi-star-fill ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تعليقك</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows="4"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="اكتب تعليقك هنا..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="py-3 bg-gray-200 rounded-xl font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50"
                  >
                    {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setBookingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center mb-4">{bookingPackage ? `حجز ${bookingPackage.name}` : 'حجز استشارة'}</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="الاسم كامل" 
                  value={bookingName} 
                  onChange={(e) => setBookingName(e.target.value)} 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="tel" 
                  placeholder="رقم الهاتف" 
                  value={bookingPhone} 
                  onChange={(e) => setBookingPhone(e.target.value)} 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="date" 
                  value={bookingDate} 
                  onChange={(e) => setBookingDate(e.target.value)} 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <input 
                  type="time" 
                  value={bookingTime} 
                  onChange={(e) => setBookingTime(e.target.value)} 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500"
                />
                <textarea 
                  placeholder="ملاحظات إضافية" 
                  value={bookingNotes} 
                  onChange={(e) => setBookingNotes(e.target.value)} 
                  rows="3" 
                  className="w-full p-3 border rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setBookingModalOpen(false)} className="py-3 bg-gray-200 rounded-xl font-semibold">إلغاء</button>
                  <button onClick={submitBooking} className="py-3 bg-green-500 text-white rounded-xl font-semibold">إرسال</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl"
              >
                <i className="bi bi-x-lg"></i>
              </button>
              <img 
                src={sliderImages[lightboxImageIndex]} 
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-xl"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format";
                }}
              />
              {sliderImages.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/90 transition-all"
                  >
                    <i className="bi bi-chevron-right text-2xl"></i>
                  </button>
                  <button
                    onClick={() => setLightboxImageIndex((prev) => (prev + 1) % sliderImages.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/90 transition-all"
                  >
                    <i className="bi bi-chevron-left text-2xl"></i>
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {lightboxImageIndex + 1} / {sliderImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographerDetailsPage;