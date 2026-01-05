import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const CompanyHomePage = () => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // تحسين الأداء
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, [handleScroll]);

  // وضع الدارك مود
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = () => logout();
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // بيانات الخدمات
  const allSections = [
    {
      id: "wedding-halls",
      title: "قاعات الأفراح",
      description: "أجمل القاعات الفاخرة بتصاميم عالمية",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&auto=format&fit=crop&q=60",
      icon: "👑",
      color: "from-purple-600 to-pink-600",
      available: true,
      details: "قاعات بمساحات مختلفة، إضاءة احترافية، وتصميم داخلي فاخر"
    },
    {
      id: "photographers",
      title: "مصورين محترفين",
      description: "التقط ذكرياتك مع أفضل المصورين",
      image: "https://plus.unsplash.com/premium_photo-1674389991678-0836ca77c7f7?w=600&auto=format&fit=crop&q=60",
      icon: "📷",
      color: "from-blue-600 to-cyan-600",
      available: true,
      details: "تصوير بكاميرات احترافية، تعديل فوتوشوب، ألبومات فاخرة"
    },
    {
      id: "bridal-dresses",
      title: "فساتين العرائس",
      description: "تصاميم عالمية من كبار المصممين",
      image: "https://plus.unsplash.com/premium_photo-1673546785747-8068f85588ad?w=600&auto=format&fit=crop&q=60",
      icon: "👰",
      color: "from-pink-600 to-rose-600",
      comingSoon: true,
      details: "فساتين بتصميم مخصص، خياطة يدوية، تفصيل حسب المقاس"
    },
    {
      id: "decorations",
      title: "ديكور وزينة",
      description: "تزيين مبتكر بلمسة إبداعية",
      image: "https://images.unsplash.com/photo-1678514823362-fd5ec94505a2?w=600&auto=format&fit=crop&q=60",
      icon: "✨",
      color: "from-yellow-500 to-orange-500",
      comingSoon: true,
      details: "تصميم ديكور كامل، زينة فاخرة، إضاءة احترافية"
    },
  ];

  // آراء العملاء
  const testimonials = [
    {
      name: "أحمد السعيد",
      date: "سبتمبر 2024",
      comment: "تجربة رائعة! القاعة كانت تحفة فنية والمصور التقط لحظات لن أنساها أبداً.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
      rating: 5
    },
    {
      name: "سارة محمد",
      date: "أغسطس 2024",
      comment: "بعد بحث طويل، اكتشفت Bookera. الخدمة كانت استثنائية من البداية للنهاية.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60",
      rating: 5
    },
    {
      name: "محمد علي",
      date: "يوليو 2024",
      comment: "التنسيق كان مثاليًا والتنظيم رائع. أنصح الجميع بتجربة Bookera.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60",
      rating: 5
    }
  ];

  // إحصائيات جديدة
  const statistics = [
    { number: "1000+", label: "مناسبة ناجحة", icon: "🎉", color: "from-purple-500 to-pink-500" },
    { number: "98%", label: "رضا العملاء", icon: "😊", color: "from-green-500 to-emerald-500" },
    { number: "50+", label: "شريك معتمد", icon: "🤝", color: "from-blue-500 to-cyan-500" },
    { number: "24/7", label: "دعم فني", icon: "💬", color: "from-yellow-500 to-orange-500" }
  ];

  // ميزات المنصة
  const features = [
    { icon: "⚡", title: "حجز فوري", description: "احجز خلال دقائق بدون معاملات ورقية" },
    { icon: "🛡️", title: "ضمان الجودة", description: "كل الخدمات مختارة بعناية وجودة مضمونة" },
    { icon: "💰", title: "أسعار شفافة", description: "لا توجد رسوم خفية، أسعار تنافسية" },
    { icon: "📱", title: "تطبيق متكامل", description: "ادار حجزك من أي مكان بسهولة" },
    { icon: "🎯", title: "توصيات ذكية", description: "اقتراحات مخصصة بناءً على احتياجاتك" },
    { icon: "📅", title: "تخطيط زمني", description: "تنظيم كامل للمناسبة بجدول زمني" }
  ];

  // الأسئلة الشائعة
  const faqs = [
    {
      question: "كيف يمكنني الحجز عبر Bookera؟",
      answer: "يمكنك الحجز في 3 خطوات بسيطة: 1) اختر الخدمة 2) حدد التفاصيل 3) ادفع الكترونياً"
    },
    {
      question: "هل يمكنني تعديل الحجز بعد التأكيد؟",
      answer: "نعم، يمكنك تعديل الحجز قبل 48 ساعة من الموعد بدون رسوم إضافية"
    },
    {
      question: "ما هي وسائل الدفع المتاحة؟",
      answer: "نقبل الدفع بواسطة البطاقات الائتمانية، المحافظ الالكترونية، والتحويل البنكي"
    },
    {
      question: "هل هناك ضمان لاسترجاع المبلغ؟",
      answer: "نعم، نقدم ضمان استرجاع المبلغ خلال 24 ساعة من الحجز في حال وجود ظرف طارئ"
    }
  ];

  // آخر المناسبات (معارض، فعاليات)
  const events = [
    {
      title: "معرض الأفراح السنوي",
      date: "15 ديسمبر 2024",
      location: "فندق الماسة - القاهرة",
      description: "أكبر معرض للأفراح في مصر بمشاركة أفضل الموردين"
    },
    {
      title: "ورشة التصوير الاحترافي",
      date: "22 نوفمبر 2024",
      location: "أونلاين",
      description: "تعلم أسرار التصوير الاحترافي للمناسبات مع مصورين عالميين"
    },
    {
      title: "عروض خاصة للخريف",
      date: "حتى 30 نوفمبر",
      location: "جميع الفروع",
      description: "خصم يصل إلى 30% على حجز القاعات والمصورين"
    }
  ];

  // خطوات العمل
  const steps = [
    { number: "01", title: "تصفح الخدمات", description: "استكشف كافة الخدمات المتاحة" },
    { number: "02", title: "اختر ما يناسبك", description: "قارن بين الخيارات واختر الأفضل" },
    { number: "03", title: "احجز أونلاين", description: "اكمل الحجز بخطوات بسيطة" },
    { number: "04", title: "استمتع بمناسبتك", description: "دعنا نهتم بكل التفاصيل" }
  ];

  // فريق العمل
  const team = [
    { name: "أحمد محمود", role: "مدير العمليات", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=60" },
    { name: "سلمى كامل", role: "مستشارة أفراح", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=60" },
    { name: "عمر خالد", role: "خبير ديكور", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60" },
    { name: "منى سعيد", role: "منسقة فعاليات", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="cursor-pointer flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                <span className="text-lg">B</span>
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bookera
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">حلمك، مسؤوليتنا</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <button onClick={toggleDarkMode} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {darkMode ? "🌙" : "☀️"}
              </button>
              {user ? (
                <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl text-sm font-medium">
                  تسجيل الخروج
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium">
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold inline-block">
              🎉 المنصة الرقمية الأولى للأفراح
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="block text-gray-900 dark:text-white">اصنع ذكريات</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-2">
              لا تُنسى مع Bookera
            </span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            نقدم لك تجربة متكاملة لتنظيم مناسبتك بكل تفاصيلها. 
            من قاعات الأفراح الفاخرة إلى المصورين المحترفين، 
            كل شيء في مكان واحد وبأسعار تنافسية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              استكشف خدماتنا
            </button>
            <button
              onClick={() => navigate('/join-us')}
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
            >
              انضم الينا وزود حجوزاتك
            </button>
          </div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الخدمات */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">خدماتنا </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                المتميزة
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات لجعل مناسبتك لا تُنسى
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allSections.map((section) => (
              <div key={section.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="relative h-64">
                  <img 
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                      {section.icon}
                    </div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      section.available ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {section.available ? 'متاح' : 'قريباً'}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {section.description}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    {section.details}
                  </p>
                  <button
                    onClick={() => section.available ? navigate(`/${section.id}`) : null}
                    className={`w-full py-3 rounded-lg font-medium ${
                      section.available
                        ? `bg-gradient-to-r ${section.color} text-white hover:opacity-90`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    } transition-all`}
                  >
                    {section.available ? 'استعرض الخيارات →' : 'قريباً'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* خطوات العمل */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                4 خطوات
              </span>
              <span className="text-gray-900 dark:text-white"> لحجز مثالي</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              مميزات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Bookera</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              ما يجعلنا الخيار الأمثل لتنظيم مناسبتك
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* آراء العملاء */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">يقولون </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                عملاؤنا
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 space-x-reverse mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonial.date}
                    </p>
                    <div className="flex text-yellow-400 mt-1">
                      {"★".repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الفعاليات القادمة */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                فعاليات
              </span>
              <span className="text-gray-900 dark:text-white"> قادمة</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              انضم إلى فعالياتنا وورش العمل الحصرية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="mb-4">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-bold mb-1">
                    {event.date}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    <span className="mr-2">📍</span>
                    {event.location}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {event.description}
                </p>
                <button className="mt-4 text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline">
                  سجل حضورك →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الأسئلة الشائعة */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">أسئلة </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                شائعة
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* فريق العمل */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">فريق </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Bookera
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              فريق من الخبراء والمختصين لمساعدتك في كل خطوة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            ابدأ رحلتك نحو مناسبة أحلامك
          </h2>
          <p className="text-purple-100 mb-8 text-lg max-w-2xl mx-auto">
            انضم إلى آلاف العملاء الذين وثقوا بنا لجعل مناسباتهم استثنائية
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all"
            >
              استكشف الخدمات
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              تواصل مع مستشار
            </button>
          </div>
          
          <p className="text-purple-200 mt-8 text-sm">
            💎 تجربة مجانية • دعم فني 24/7 • ضمان الجودة
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="font-bold">B</span>
                </div>
                <div>
                  <span className="text-xl font-bold block">Bookera</span>
                  <span className="text-gray-400 text-sm">حلمك، مسؤوليتنا</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                نخلق ذكريات لا تنسى بكل تفاصيلها.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <div className="space-y-2">
                {['الرئيسية', 'الخدمات', 'عن Bookera', 'اتصل بنا'].map((link) => (
                  <button key={link} className="block text-gray-400 hover:text-white text-sm text-right">
                    {link}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">خدماتنا</h4>
              <div className="space-y-2">
                {allSections.map((section) => (
                  <button 
                    key={section.id}
                    onClick={() => section.available && navigate(`/${section.id}`)}
                    className="block text-gray-400 hover:text-white text-sm text-right"
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 space-x-reverse text-gray-400">
                  <span>📧</span>
                  <span className="text-sm">tallaey445@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-400">
                  <span>📱</span>
                  <span className="text-sm">+201040652783</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-400">
                  <span>📍</span>
                  <span className="text-sm">مصر</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Bookera. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              مصمم بواسطة فريق Bookera الإبداعي
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyHomePage;