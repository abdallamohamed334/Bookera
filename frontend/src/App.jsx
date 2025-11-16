// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import DecorationsPage from './pages/DecorationsPage';
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
import JoinUsPage from './pages/JoinUsPage'; // الجديد
import FavoritesPage from './pages/FavoritesPage'; // الجديد

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// حماية المسارات التي تتطلب تسجيل دخول
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// حماية مسارات الأدمن فقط
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  if (!isAdmin()) {
    return <Navigate to='/' replace />;
  }

  return children;
};

// إعادة توجيه المستخدمين المسجلين بالفعل
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          }
        />

        {/* صفحة الأدمن */}
        <Route
          path='/admin/dashboard'
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* صفحة المصورين */}
        <Route path="/photographers/:photographerId" element={<PhotographersPage />} />
        <Route
          path='/photographers'
          element={
            <ProtectedRoute>
              <PhotographersPage />
            </ProtectedRoute>
          }
        />

        {/* صفحة الديكور */}
        <Route path="/decorations" element={<DecorationsPage />} />

        {/* صفحات أنواع القاعات */}
        <Route
          path='/wedding-halls'
          element={
            <ProtectedRoute>
              <WeddingHallsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/conference-halls'
          element={
            <ProtectedRoute>
              <ConferenceHallsPage />
            </ProtectedRoute>
          }
        />

        {/* صفحة انضم إلينا - مسار عام */}
        <Route
          path='/join-us'
          element={<JoinUsPage />}
        />

        {/* صفحة المفضلة - تتطلب تسجيل دخول */}
        <Route
          path='/favorites'
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        
        {/* صفحات المصادقة */}
        <Route
          path='/signup'
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        
        {/* صفحة التحقق من البريد الإلكتروني */}
        <Route 
          path='/verify-email' 
          element={<EmailVerificationPage />} 
        />
        
        <Route
          path='/forgot-password'
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path='/reset-password/:token'
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* جميع المسارات الأخرى */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;