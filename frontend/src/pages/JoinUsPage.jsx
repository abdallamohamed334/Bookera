import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    portfolio: ""
  });

  const partnerTypes = [
    { value: "hall_owner", label: "صاحب قاعة", icon: "🏢" },
    { value: "photographer", label: "مصور محترف", icon: "📸" },
    { value: "decorator", label: "مصمم ديكور", icon: "🎨" },
    { value: "catering", label: "مقدم خدمات طعام", icon: "🍽️" },
    { value: "entertainment", label: "مقدم خدمات ترفيهية", icon: "🎤" },
    { value: "other", label: "خدمات أخرى", icon: "💼" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // هنا بتكون عملية الإرسال للداتابيز
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('تم تقديم طلب الانضمام بنجاح! سنتواصل معك قريباً.');
        navigate('/');
      } else {
        alert('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
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
              انضم إلى EventPro
            </motion.h1>
            
            <div className="w-20"></div> {/* Spacer for balance */}
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
            انضم إلى عائلة EventPro
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            كن شريكاً معنا واربح مع منصة الحجوزات الرائدة في المملكة
          </p>
        </motion.div>

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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="example@email.com"
                  />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+966 5XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم المنشأة *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="اسم المنشأة أو العلامة التجارية"
                  />
                </div>
              </div>

              {/* Partner Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  نوع الشريك *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {partnerTypes.map((type) => (
                    <motion.label
                      key={type.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 ${
                        formData.partnerType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="partnerType"
                        value={type.value}
                        checked={formData.partnerType === type.value}
                        onChange={handleInputChange}
                        required
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

              {/* Location */}
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="المدينة والمنطقة"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  سنوات الخبرة *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">اختر سنوات الخبرة</option>
                  <option value="less_than_1">أقل من سنة</option>
                  <option value="1_3">1-3 سنوات</option>
                  <option value="3_5">3-5 سنوات</option>
                  <option value="5_10">5-10 سنوات</option>
                  <option value="more_than_10">أكثر من 10 سنوات</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الخدمات المقدمة *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="صف الخدمات التي تقدمها وتجربتك في هذا المجال..."
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رابط محفظة الأعمال (اختياري)
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg"
              >
                تقديم طلب الانضمام
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
                { number: "500+", label: "شريك نشط" },
                { number: "50K+", label: "حجز شهري" },
                { number: "95%", label: "رضا العملاء" },
                { number: "24/7", label: "دعم فني" }
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
                  <span>partners@eventpro.com</span>
                </p>
                <p className="flex items-center space-x-3 space-x-reverse">
                  <span>📞</span>
                  <span>+966 500 000 001</span>
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