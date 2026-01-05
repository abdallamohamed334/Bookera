// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import DecorationsPage from './pages/DecorationsPage';
import VenueDetails from "./components/wedding/VenueDetails";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PhotographersPage from './pages/PhotographersPage';
import LoadingSpinner from "./components/LoadingSpinner";
import WeddingHallsPage from './pages/WeddingHallsPage';
import ConferenceHallsPage from './pages/ConferenceHallsPage';
import AdminDashboard from './pages/AdminDashboard';
import JoinUsPage from './pages/JoinUsPage';
import FavoritesPage from './pages/FavoritesPage';
import PhotographerDetailsPage from './components/photografer/PhotographerDetailsPage';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";

// تهيئة بيانات الزائر
const initGuestData = () => {
  const existingData = localStorage.getItem('bookera_guest_data');
  if (!existingData) {
    const guestData = {
      guestId: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      guestName: 'زائر',
      isGuest: true,
      sessionStart: new Date().toISOString(),
      visitedPages: [],
      favoritePhotographers: [],
      searchHistory: [],
      hasSeenWelcome: false
    };
    localStorage.setItem('bookera_guest_data', JSON.stringify(guestData));
  }
};

// نافذة الترحيب للزوار - مكون منفصل
const GuestWelcomeModal = ({ show, onClose, onLogin }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch' // لسلاسة التمرير على iOS
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        margin: 'auto'
      }}>
        <h2 style={{
          fontFamily: "'Tajawal', sans-serif",
          color: '#1f2937',
          marginBottom: '12px',
          fontSize: '20px',
          lineHeight: '1.4'
        }}>
          🎉 مرحباً بك في Bookera!
        </h2>
        
        <p style={{
          fontFamily: "'Tajawal', sans-serif",
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '20px',
          fontSize: '15px'
        }}>
          أنت الآن تتصفح المنصة كزائر. يمكنك:
        </p>
        
        <div style={{
          background: '#f0f9ff',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            textAlign: 'right'
          }}>
            <li style={{
              padding: '8px 0',
              fontFamily: "'Tajawal', sans-serif",
              color: '#0369a1',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '14px'
            }}>
              <span style={{
                minWidth: '8px',
                minHeight: '8px',
                background: '#0ea5e9',
                borderRadius: '50%',
                marginTop: '6px'
              }}></span>
              <span>تصفح جميع المصورين والقاعات</span>
            </li>
            <li style={{
              padding: '8px 0',
              fontFamily: "'Tajawal', sans-serif",
              color: '#0369a1',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '14px'
            }}>
              <span style={{
                minWidth: '8px',
                minHeight: '8px',
                background: '#0ea5e9',
                borderRadius: '50%',
                marginTop: '6px'
              }}></span>
              <span>مشاهدة الصور والأسعار</span>
            </li>
            <li style={{
              padding: '8px 0',
              fontFamily: "'Tajawal', sans-serif",
              color: '#0369a1',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '14px'
            }}>
              <span style={{
                minWidth: '8px',
                minHeight: '8px',
                background: '#0ea5e9',
                borderRadius: '50%',
                marginTop: '6px'
              }}></span>
              <span>البحث والتصفية</span>
            </li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={onClose}
            style={{
              padding: '14px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "'Tajawal', sans-serif",
              fontWeight: '500',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              width: '100%'
            }}
          >
            استمر كزائر
          </button>
          
          <button
            onClick={onLogin}
            style={{
              padding: '14px',
              background: 'white',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
              borderRadius: '8px',
              fontFamily: "'Tajawal', sans-serif",
              fontWeight: '500',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%'
            }}
          >
            تسجيل الدخول للحصول على ميزات إضافية
          </button>
        </div>
      </div>
    </div>
  );
};

// حماية المسارات التي تتطلب تسجيل دخول فقط للميزات المتقدمة
const ProtectedRoute = ({ children, requireVerification = true }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();
  const [showGuestWelcome, setShowGuestWelcome] = useState(false);

  useEffect(() => {
    // تهيئة بيانات الزائر إذا لزم
    if (!isCheckingAuth && !isAuthenticated) {
      const guestData = JSON.parse(localStorage.getItem('bookera_guest_data') || '{}');
      
      // إظهار رسالة ترحيب للزوار في أول مرة
      if (!guestData.hasSeenWelcome) {
        setTimeout(() => {
          setShowGuestWelcome(true);
          const updatedData = { ...guestData, hasSeenWelcome: true };
          localStorage.setItem('bookera_guest_data', JSON.stringify(updatedData));
        }, 1000); // تأخير بسيط لتحميل الصفحة أولاً
      }
    }
  }, [isCheckingAuth, isAuthenticated]);

  if (isCheckingAuth) return <LoadingSpinner />;

  // السماح للزوار بالوصول لجميع الصفحات
  // فقط المفضلة تتطلب تسجيل دخول
  const path = window.location.pathname;
  const requiresAuth = ['/favorites', '/admin/dashboard'].includes(path);
  
  if (!isAuthenticated && requiresAuth) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان المستخدم مسجلاً ولكن لم يتحقق من البريد وكانت الصفحة تتطلب تحقق
  if (requireVerification && isAuthenticated && !user?.emailVerified && path !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  return (
    <>
      {children}
      <GuestWelcomeModal 
        show={showGuestWelcome}
        onClose={() => setShowGuestWelcome(false)}
        onLogin={() => {
          setShowGuestWelcome(false);
          window.location.href = '/login';
        }}
      />
    </>
  );
};

// حماية الأدمن
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isAdmin } = useAuthStore();

  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (!user?.emailVerified) return <Navigate to='/verify-email' replace />;
  if (!isAdmin()) return <Navigate to='/' replace />;

  return children;
};

// مسار عام للجميع
const PublicRoute = ({ children, restrictAuthenticated = true }) => {
  const { isAuthenticated, user } = useAuthStore();

  // إذا كان المستخدم مسجلاً ومحققاً وإعدادات المسار تحد من المسجلين
  if (restrictAuthenticated && isAuthenticated && user?.emailVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

// مؤشر حالة الزائر
const GuestStatusIndicator = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isHovering, setIsHovering] = useState(false);

  if (isAuthenticated && user) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
          transition: 'all 0.3s',
          minWidth: '120px',
          maxWidth: '200px'
        }}
        onClick={() => setIsHovering(!isHovering)}
      >
        <div style={{
          width: '10px',
          height: '10px',
          background: '#10b981',
          borderRadius: '50%'
        }}></div>
        <span style={{
          fontFamily: "'Tajawal', sans-serif",
          fontWeight: '500',
          fontSize: '14px'
        }}>
          زائر
        </span>
      </div>

      {isHovering && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          width: '90vw',
          maxWidth: '300px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{
            fontFamily: "'Tajawal', sans-serif",
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '10px',
            fontSize: '16px'
          }}>
            أنت تتصفح كزائر
          </h4>
          <p style={{
            fontFamily: "'Tajawal', sans-serif",
            color: '#6b7280',
            fontSize: '13px',
            marginBottom: '15px',
            lineHeight: '1.5'
          }}>
            سجّل الدخول للإضافة للمفضلة والتقييم والحجز
          </p>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <a
              href="/login"
              style={{
                background: '#4f46e5',
                color: 'white',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Tajawal', sans-serif",
                textDecoration: 'none',
                display: 'block'
              }}
            >
              تسجيل دخول
            </a>
            <a
              href="/signup"
              style={{
                border: '1px solid #4f46e5',
                color: '#4f46e5',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Tajawal', sans-serif",
                textDecoration: 'none',
                display: 'block'
              }}
            >
              حساب جديد
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // تهيئة بيانات الزائر
      initGuestData();
      
      // التحقق من حالة المصادقة
      await checkAuth();
      
      setIsInitializing(false);
    };

    initializeApp();
  }, [checkAuth]);

  if (isInitializing || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      <Routes>
        {/* الصفحة الرئيسية - للجميع */}
        <Route path='/' element={<HomePage />} />

        {/* تفاصيل القاعة - للجميع */}
        <Route path="/venue/:id" element={
          <ProtectedRoute requireVerification={false}>
            <VenueDetails />
          </ProtectedRoute>
        } />

        {/* الأدمن - محمي */}
        <Route 
          path='/admin/dashboard' 
          element={<AdminRoute><AdminDashboard /></AdminRoute>} 
        />

        {/* المصورين - للجميع */}
        <Route 
          path='/photographers' 
          element={
            <ProtectedRoute requireVerification={false}>
              <PhotographersPage />
            </ProtectedRoute>
          } 
        />
        
        {/* صفحة تفاصيل المصور - للجميع */}
        <Route 
          path='/photographer/:id' 
          element={
            <ProtectedRoute requireVerification={false}>
              <PhotographerDetailsPage />
            </ProtectedRoute>
          } 
        />

        {/* القاعات - للجميع */}
        <Route 
          path='/wedding-halls' 
          element={
            <ProtectedRoute requireVerification={false}>
              <WeddingHallsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/conference-halls' 
          element={
            <ProtectedRoute requireVerification={false}>
              <ConferenceHallsPage />
            </ProtectedRoute>
          } 
        />

        {/* انضم إلينا - للجميع */}
        <Route path='/join-us' element={<JoinUsPage />} />
        
        {/* المفضلة - تتطلب تسجيل */}
        <Route 
          path='/favorites' 
          element={
            <ProtectedRoute requireVerification={true}>
              <FavoritesPage />
            </ProtectedRoute>
          } 
        />

        {/* الديكور - للجميع */}
        <Route 
          path='/decorations' 
          element={
            <ProtectedRoute requireVerification={false}>
              <DecorationsPage />
            </ProtectedRoute>
          } 
        />

        {/* تسجيل ودخول - للزوار فقط */}
        <Route 
          path='/signup' 
          element={
            <PublicRoute restrictAuthenticated={true}>
              <SignUpPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path='/login' 
          element={
            <PublicRoute restrictAuthenticated={true}>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* التحقق من البريد - للمسجلين فقط */}
        <Route 
          path='/verify-email' 
          element={
            <PublicRoute restrictAuthenticated={false}>
              <EmailVerificationPage />
            </PublicRoute>
          } 
        />

        {/* نسيان كلمة المرور - للزوار فقط */}
        <Route 
          path='/forgot-password' 
          element={
            <PublicRoute restrictAuthenticated={true}>
              <ForgotPasswordPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path='/reset-password/:token' 
          element={
            <PublicRoute restrictAuthenticated={true}>
              <ResetPasswordPage />
            </PublicRoute>
          } 
        />

        {/* أي مسار غير موجود */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      {/* إضافة مؤشر حالة الزائر */}
      <GuestStatusIndicator />
      
      <Toaster />
    </div>
  );
}

export default App;