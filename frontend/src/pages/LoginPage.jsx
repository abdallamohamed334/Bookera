// pages/LoginPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, User, Star, CheckCircle, Calendar, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // إضافة googleLogin هنا
    const { login, googleLogin, isLoading, error, clearMessages } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        clearMessages();

        try {
            const isVerified = await login(email, password);

            if (isVerified) {
                navigate('/'); // البريد مفعل → الصفحة الرئيسية
            } else {
                navigate('/verify-email'); // البريد غير مفعل → صفحة التحقق
            }

        } catch (err) {
            console.error("فشل تسجيل الدخول:", err);
        }
    };

    const features = [
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "سهولة الحجز",
            description: "احجز أفضل الأماكن في خطوات بسيطة"
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "تقييمات موثوقة",
            description: "اقرأ تجارب العملاء السابقين"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "دعم متكامل",
            description: "فريق الدعم جاهز لمساعدتك"
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "تأكيد فوري",
            description: "احصل على تأكيد الحجز فوراً"
        }
    ];

    const testimonials = [
        {
            name: "أحمد محمد",
            role: "عميل سعيد",
            comment: "أفضل منصة لحجز القاعات، جربتها لحفل زفافي وكانت رائعة!",
            rating: 5
        },
        {
            name: "فاطمة علي",
            role: "مديرة فعاليات",
            comment: "توفير الوقت والجهد في البحث عن الأماكن المناسبة",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* Navbar */}
            <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-2xl font-bold text-blue-600">
                                منصة الحجوزات
                            </Link>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                الرئيسية
                            </Link>
                            <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                عن المنصة
                            </Link>
                            <Link to="/contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                اتصل بنا
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/signup" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
                            >
                                إنشاء حساب
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                اهلاً بك في{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">
                                    منصة الحجوزات
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600">
                                اكتشف أفضل الأماكن لحفلاتك ومناسباتك..
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                    className="flex items-start space-x-3 space-x-reverse p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Testimonials */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">ماذا يقول عملاؤنا؟</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {testimonials.map((t, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 + 0.8 }}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                                    >
                                        <div className="flex items-center mb-3">
                                            {[...Array(t.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mb-3">"{t.comment}"</p>
                                        <p className="font-semibold text-gray-900">{t.name}</p>
                                        <p className="text-sm text-gray-600">{t.role}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right section – LOGIN */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-md">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                                    <h1 className="text-2xl font-bold text-white">مرحباً بعودتك</h1>
                                    <p className="text-blue-100 text-sm mt-1">سجل الدخول للمتابعة</p>
                                </div>

                                <div className='p-6'>
                                    <form onSubmit={handleLogin} className="space-y-4">

                                        <Input
                                            icon={Mail}
                                            type='email'
                                            placeholder='البريد الإلكتروني'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-gray-50 border-gray-200 focus:border-blue-500"
                                        />

                                        <Input
                                            icon={Lock}
                                            type='password'
                                            placeholder='كلمة المرور'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-gray-50 border-gray-200 focus:border-blue-500"
                                        />

                                        <Link 
                                            to='/forgot-password'
                                            className='text-sm text-blue-600 hover:underline'
                                        >
                                            نسيت كلمة المرور؟
                                        </Link>

                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <p className='text-red-700 text-center text-sm font-medium'>{error}</p>
                                            </div>
                                        )}

                                        <button
                                            className='w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-2'
                                            type='submit'
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader className='w-5 h-5 animate-spin' />
                                                    جاري تسجيل الدخول...
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-5 h-5" />
                                                    تسجيل الدخول
                                                </>
                                            )}
                                        </button>

                                        {/* زر اختبار الأدمن */}
                                 
                                    </form>

                                    {/* GOOGLE LOGIN */}
                                    <div className="mt-6 pt-6 border-t text-center">
                                        <p className="text-gray-600 text-sm mb-4">أو سجل الدخول باستخدام</p>

                                        <div className="flex justify-center gap-4">
                                            {/* Facebook placeholder */}
                                            

                                            {/* ⭐ زر Google الفعلي */}
                                            <button
                                                onClick={async () => {
                                                    const ok = await googleLogin();
                                                    if (ok) navigate('/');
                                                }}
                                                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-sm"
                                            >
                                                <span className="text-gray-700 font-bold text-base">G</span>
                                            </button>

                                            
                                        </div>
                                    </div>
                                </div>

                                <div className='px-6 py-4 bg-gray-50 text-center'>
                                    <p className='text-sm text-gray-600'>
                                        ليس لديك حساب؟
                                        <Link 
                                            to='/signup' 
                                            className='text-blue-600 hover:underline'
                                        >
                                            إنشاء حساب جديد
                                        </Link>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
