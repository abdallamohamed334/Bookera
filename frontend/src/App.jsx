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
import 'bootstrap-icons/font/bootstrap-icons.css';

// ✅ حماية المسارات المعدلة - من غير أي نظام زائر
const ProtectedRoute = ({ children, requireVerification = true }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth) return <LoadingSpinner />;

  const path = window.location.pathname;
  
  // المسارات اللي محتاجة مصادقة إجبارية
  const requiresAuthPaths = ['/favorites', '/admin/dashboard'];
  const requiresAuth = requiresAuthPaths.includes(path);
  
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerification && isAuthenticated && !user?.emailVerified && path !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// حماية الأدمن
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isAdmin } = useAuthStore();

  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (!user?.emailVerified) return <Navigate to='/verify-email' replace />;
  if (!isAdmin()) return <Navigate to='/' replace />;

  return children;
};

// مسار عام
const PublicRoute = ({ children, restrictAuthenticated = true }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (restrictAuthenticated && isAuthenticated && user?.emailVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
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
        {/* الصفحة الرئيسية */}
        <Route path='/' element={<HomePage />} />

        {/* تفاصيل القاعة */}
        <Route path="/venue/:id" element={<VenueDetails />} />

        {/* الأدمن */}
        <Route 
          path='/admin/dashboard' 
          element={<AdminRoute><AdminDashboard /></AdminRoute>} 
        />

        {/* المصورين - قائمة المصورين */}
        <Route path='/photographers' element={<PhotographersPage />} />
        
        {/* صفحة تفاصيل المصور */}
        <Route path='/photographers/:id' element={<PhotographerDetailsPage />} />

        {/* القاعات */}
        <Route path='/wedding-halls' element={<WeddingHallsPage />} />
        <Route path='/conference-halls' element={<ConferenceHallsPage />} />

        {/* انضم إلينا */}
        <Route path='/join-us' element={<JoinUsPage />} />
        
        {/* المفضلة */}
        <Route 
          path='/favorites' 
          element={
            <ProtectedRoute requireVerification={true}>
              <FavoritesPage />
            </ProtectedRoute>
          } 
        />

        {/* الديكور */}
        <Route path='/decorations' element={<DecorationsPage />} />

        {/* تسجيل ودخول */}
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

        {/* التحقق من البريد */}
        <Route 
          path='/verify-email' 
          element={
            <PublicRoute restrictAuthenticated={false}>
              <EmailVerificationPage />
            </PublicRoute>
          } 
        />

        {/* نسيان كلمة المرور */}
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

      <Toaster />
    </div>
  );
}

export default App;