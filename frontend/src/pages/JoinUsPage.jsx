import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const JoinUsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    partnerType: "",
    businessName: "",
    location: "",
    description: "",
    experience: "",
    portfolio: "",
    status: "pending",
    // الحقول الجديدة
    specialty: "",
    governorate: "",
    city: "",
    price: "",
    services: "",
    contact: "",
    address: ""
  });

  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  // أنواع الشركاء (القاعات والمصورين فقط)
  const partnerTypes = [
    { value: "hall_owner", label: "صاحب قاعة", icon: "🏢" },
    { value: "photographer", label: "مصور محترف", icon: "📸" }
  ];

  // قائمة المحافظات
  const governorates = [
    "القاهرة", "الإسكندرية", "الجيزة", "القليوبية", "الإسماعيلية",
    "السويس", "بورسعيد", "الشرقية", "الغربية", "الدقهلية",
    "البحيرة", "المنوفية", "الفيوم", "بني سويف", "المنيا",
    "أسوان", "الأقصر", "قنا", "سوهاج", "أسيوط", "دمياط", "كفر الشيخ", "مطروح"
  ];

  // قائمة التخصصات
  const specialties = [
    "تصوير افراح",
    "تصوير مناسبات",
    "تصوير شخصي",
    "تصوير عائلي",
    "تصوير منتجات",
    "تصوير أزياء",
    "تصوير معماري",
    "تصوير طبي"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      setEmailError("");
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (attempts >= 3) {
      toast.error("لقد تجاوزت الحد الأقصى للمحاولات. يرجى المحاولة مرة أخرى لاحقاً.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError("صيغة البريد الإلكتروني غير صحيحة");
      toast.error("صيغة البريد الإلكتروني غير صحيحة");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://bookera-production-2d16.up.railway.app/api/partners/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          registrationDate: new Date().toISOString(),
          // تحويل services من نص إلى مصفوفة
          services: formData.services ? formData.services.split(',').map(s => s.trim()) : []
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          <div className="text-right">
            <div className="font-bold text-lg">🎉 تم تقديم طلب الانضمام بنجاح!</div>
            <div className="text-sm mt-1">سنقوم بالتواصل معك خلال 24 ساعة</div>
          </div>,
          { duration: 5000, icon: '✅' }
        );
        
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          partnerType: "",
          businessName: "",
          location: "",
          description: "",
          experience: "",
          portfolio: "",
          status: "pending",
          specialty: "",
          governorate: "",
          city: "",
          price: "",
          services: "",
          contact: "",
          address: ""
        });
        setAttempts(0);
        setEmailError("");
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
        
      } else {
        setAttempts(prev => prev + 1);
        
        if (response.status === 409) {
          setEmailError("هذا البريد الإلكتروني مسجل مسبقاً");
          toast.error("⚠️ البريد الإلكتروني مسجل مسبقاً");
        } else if (response.status === 400) {
          toast.error("❌ بيانات غير صالحة");
        } else {
          toast.error("😔 حدث خطأ غير متوقع");
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setAttempts(prev => prev + 1);
      toast.error("🌐 خطأ في الشبكة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-filter backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>رجوع</span>
            </motion.button>
            
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              انضم إلى Bookera
            </motion.h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            انضم إلى عائلة Bookera
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            كن شريكاً معنا واربح مع Bookera الرائدة في مصر
          </p>
        </motion.div>

        {/* تحذير المحاولات */}
        {attempts > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 mx-auto max-w-2xl"
          >
            <div className={`p-4 rounded-xl border-2 ${
              attempts >= 3 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-xl">
                    {attempts >= 3 ? '🚫' : '⚠️'}
                  </span>
                  <div>
                    <div className="font-bold">
                      {attempts >= 3 
                        ? 'تم تجاوز الحد الأقصى للمحاولات' 
                        : `محاولة ${attempts} من 3`}
                    </div>
                    <div className="text-sm">
                      {attempts >= 3 
                        ? 'يرجى المحاولة مرة أخرى لاحقاً' 
                        : `متبقي ${3 - attempts} محاولة`}
                    </div>
                  </div>
                </div>
                {attempts < 3 && (
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(attempts / 3) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              قدم طلب الانضمام
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    disabled={attempts >= 3 || isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={attempts >= 3 || isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      emailError 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="example@email.com"
                  />
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center space-x-2 space-x-reverse"
                    >
                      <span>⚠️</span>
                      <span>{emailError}</span>
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={attempts >= 3 || isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم هاتف بديل للتواصل *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    disabled={attempts >= 3 || isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.partnerType === "hall_owner" ? "اسم القاعة *" : "اسم الاستوديو *"}
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    disabled={attempts >= 3 || isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={formData.partnerType === "hall_owner" ? "اسم القاعة" : "اسم الاستوديو"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    العنوان التفصيلي *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={attempts >= 3 || isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="العنوان بالتفصيل"
                  />
                </div>
              </div>

              {/* Partner Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  نوع الشريك *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {partnerTypes.map((type) => (
                    <motion.label
                      key={type.value}
                      whileHover={{ scale: attempts >= 3 ? 1 : 1.05 }}
                      whileTap={{ scale: attempts >= 3 ? 1 : 0.95 }}
                      className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 ${
                        formData.partnerType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                      } ${attempts >= 3 || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="partnerType"
                        value={type.value}
                        checked={formData.partnerType === type.value}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="hidden"
                      />
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {type.label}
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Photographer Specific Fields */}
              {formData.partnerType === "photographer" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6"
                >
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                    بيانات المصور المحترف
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        التخصص *
                      </label>
                      <select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">اختر التخصص</option>
                        {specialties.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        سنوات الخبرة *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">اختر سنوات الخبرة</option>
                        <option value="1">أقل من سنة</option>
                        <option value="2">1-3 سنوات</option>
                        <option value="3">3-5 سنوات</option>
                        <option value="4">5-10 سنوات</option>
                        <option value="5">أكثر من 10 سنوات</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المحافظة *
                      </label>
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">اختر المحافظة</option>
                        {governorates.map(gov => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المدينة *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="اسم المدينة"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        السعر اليومي (ج.م) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="مثال: 2000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الخدمات المقدمة (افصل بينها بفواصل) *
                      </label>
                      <input
                        type="text"
                        name="services"
                        value={formData.services}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="مثال: تصوير أفراح, تصوير مناسبات, تصوير شخصي"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الوصف *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      disabled={attempts >= 3 || isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="صف خبراتك ومهاراتك في التصوير..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Hall Owner Fields */}
              {formData.partnerType === "hall_owner" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6"
                >
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                    بيانات صاحب القاعة
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الموقع *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="المدينة والمنطقة"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        سنوات الخبرة *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        disabled={attempts >= 3 || isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">اختر سنوات الخبرة</option>
                        <option value="less_than_1">أقل من سنة</option>
                        <option value="1_3">1-3 سنوات</option>
                        <option value="3_5">3-5 سنوات</option>
                        <option value="5_10">5-10 سنوات</option>
                        <option value="more_than_10">أكثر من 10 سنوات</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      وصف القاعة والخدمات المقدمة *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      disabled={attempts >= 3 || isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="صف القاعة والخدمات التي تقدمها وتجربتك في هذا المجال..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Portfolio Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رابط محفظة الأعمال (اختياري)
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  disabled={attempts >= 3 || isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={attempts >= 3 || isSubmitting}
                whileHover={attempts >= 3 ? {} : { scale: 1.02 }}
                whileTap={attempts >= 3 ? {} : { scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${
                  attempts >= 3
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </div>
                ) : attempts >= 3 ? (
                  "تم تجاوز الحد الأقصى للمحاولات"
                ) : (
                  "تقديم طلب الانضمام"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">مزايا الانضمام إلينا</h3>
              <ul className="space-y-4">
                {[
                  "وصول إلى آلاف العملاء المحتملين",
                  "منصة دفع آمنة ومضمونة",
                  "إدارة حجوزات سهلة ومتقدمة",
                  "ملف تعريفي متكامل ومهني",
                  "تقييمات ومراجعات حقيقية",
                  "دعم فني متاح 24/7",
                  "عروض وتسويق مميز",
                  "تحليلات وأرقام مفصلة"
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 space-x-reverse"
                  >
                    <span className="text-xl">✅</span>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "300+", label: "قاعة مناسبة" },
                { number: "200+", label: "مصور محترف" },
                { number: "50K+", label: "حجز شهري" },
                { number: "95%", label: "رضا العملاء" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg"
                >
                  <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">للاستفسارات</h4>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p className="flex items-center space-x-3 space-x-reverse">
                  <span>📧</span>
                  <span>eventupcompany@gmail.com</span>
                </p>
                <p className="flex items-center space-x-3 space-x-reverse">
                  <span>📞</span>
                  <span>+201040652783</span>
                </p>
                <p className="flex items-center space-x-3 space-x-reverse">
                  <span>🕒</span>
                  <span>من الأحد إلى الخميس - 9 صباحاً إلى 5 مساءً</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JoinUsPage;