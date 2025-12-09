import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, AlertCircle, Chrome, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [showGoogleHelp, setShowGoogleHelp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const { signup, googleLogin, error, isLoading, clearMessages } = useAuthStore();

  // التحقق من صحة النموذج
  useEffect(() => {
    const isValid = 
      name.length >= 2 && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
      password.length >= 6 && 
      password === confirmPassword;
    
    setFormValid(isValid);
    
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("كلمات المرور غير متطابقة");
    } else {
      setPasswordError("");
    }
  }, [name, email, password, confirmPassword]);

  // تنظيف الرسائل عند تحميل الصفحة
  useEffect(() => {
    clearMessages();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!formValid) {
      // هزة للعناصر غير صالحة
      const invalidElements = document.querySelectorAll('input:invalid');
      invalidElements.forEach(el => {
        el.classList.add('animate-shake');
        setTimeout(() => el.classList.remove('animate-shake'), 500);
      });
      return;
    }
    
    try {
      await signup(email, password, name);
      setSignupSuccess(true);
      
      // الانتقال إلى صفحة التحقق بعد 2 ثانية
      setTimeout(() => {
        navigate("/verify-email", { 
          state: { 
            email, 
            name,
            message: "تم إرسال رابط التفعيل إلى بريدك الإلكتروني" 
          } 
        });
      }, 2000);
    } catch (error) {
      console.log("Signup error:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await googleLogin();
      // جوجل يتحقق تلقائياً، لذا انتقل للداشبورد مباشرة
      navigate("/dashboard");
    } catch (error) {
      console.log("خطأ في تسجيل الدخول بجوجل:", error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        setShowGoogleHelp(true);
      }
    }
  };

  // نافذة مساعدة جوجل
  const GoogleHelpModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg">
              <Chrome className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">مساعدة تسجيل جوجل</h3>
          </div>
          <button
            onClick={() => setShowGoogleHelp(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">لحل مشكلة تسجيل جوجل:</h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>اضغط على أيقونة 🔒 في شريط العنوان</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>اختر "السماح بالنوافذ المنبثقة"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>انقر على زر جوجل مرة أخرى</span>
              </li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">إذا استمرت المشكلة:</p>
            <ul className="space-y-1">
              <li>• جرب متصفح Chrome أو Firefox</li>
              <li>• تأكد من تفعيل JavaScript</li>
              <li>• جرب تسجيل الدخول بالبريد الإلكتروني</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowGoogleHelp(false)}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={handleGoogleSignUp}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4" />
            حاول مرة أخرى
          </button>
        </div>
      </motion.div>
    </div>
  );

  // حالة النجاح في التسجيل
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🎉 تم إنشاء حسابك بنجاح!</h2>
          
          <p className="text-gray-600 mb-6">
            مرحباً <span className="font-semibold text-blue-600">{name}</span>! 
            تم إرسال رابط التفعيل إلى بريدك الإلكتروني
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">{email}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-6">
            يرجى التحقق من بريدك الإلكتروني والنقر على رابط التفعيل للمتابعة
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <button
              onClick={() => navigate("/verify-email", { 
                state: { email, name } 
              })}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              الانتقال لصفحة التحقق
            </button>
          </motion.div>
          
          <p className="text-sm text-gray-400 mt-6">
            يتم التوجيه تلقائياً خلال ثانيتين...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative z-10'
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            إنشاء حساب جديد
          </motion.h1>
          <p className="text-blue-100">
            انضم إلينا وابدأ رحلتك مع Bookera
          </p>
        </div>

        <div className='p-8'>
          <form onSubmit={handleSignUp} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                icon={User}
                type='text'
                placeholder='الاسم الكامل'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-blue-500"
                required
                minLength={2}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                icon={Mail}
                type='email'
                placeholder='البريد الإلكتروني'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-blue-500"
                required
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='كلمة المرور'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:border-blue-500 pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='تأكيد كلمة المرور'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`bg-gray-50 border-gray-200 focus:border-blue-500 pr-12 ${
                    passwordError ? 'border-red-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </p>
              )}
            </motion.div>

            {/* Password Strength Meter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PasswordStrengthMeter password={password} />
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className='text-red-700 text-sm font-medium mb-1'>حدث خطأ</p>
                    <p className='text-red-600 text-sm'>{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-xs text-gray-600">
                بإنشاء حساب، فإنك توافق على{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  سياسة الخصوصية
                </Link>
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                type='submit'
                disabled={isLoading || !formValid}
              >
                {isLoading ? (
                  <>
                    <Loader className='w-5 h-5 animate-spin' />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    إنشاء حساب
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Social Sign Up Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">أو سجل باستخدام</p>
              <div className="flex flex-col gap-3">
                {/* زر جوجل مع تحسينات */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignUp}
                  className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group relative overflow-hidden"
                >
                  {/* تأثير خلفي */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">
                    متابعة مع جوجل
                  </span>
                </motion.button>
                
                {/* تلميح مساعدة جوجل */}
                <button
                  onClick={() => setShowGoogleHelp(true)}
                  className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
                >
                  تواجه مشكلة مع تسجيل جوجل؟
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className='px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-center'>
          <p className='text-sm text-gray-600'>
            لديك حساب بالفعل؟{" "}
            <Link 
              to={"/login"} 
              className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors'
            >
              سجل الدخول
            </Link>
          </p>
        </div>
      </motion.div>

      {/* نافذة مساعدة جوجل */}
      {showGoogleHelp && <GoogleHelpModal />}

      {/* Additional Styling for Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;