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
import PhotographerDetailsPage from './components/photografer/PhotographerDetailsPage'; // تأكد من المسار الصحيح

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// حماية المسارات التي تتطلب تسجيل دخول
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth) return <div>جارٍ التحقق من الحساب...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.emailVerified) return <Navigate to="/verify-email" replace />;

  return children;
};

// حماية الأدمن
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isAdmin } = useAuthStore();

  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (!user?.isVerified) return <Navigate to='/verify-email' replace />;
  if (!isAdmin()) return <Navigate to='/' replace />;

  return children;
};

// منع الدخول لو بالفعل مسجل
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) return <Navigate to='/' replace />;

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

        {/* الصفحة الرئيسية غير محمية — ضروري للشير */}
        <Route path='/' element={<HomePage />} />

        {/* تفاصيل القاعة */}
        <Route path="/venue/:id" element={<VenueDetails />} />

        {/* الأدمن */}
        <Route 
          path='/admin/dashboard' 
          element={<AdminRoute><AdminDashboard /></AdminRoute>} 
        />

        {/* المصورين */}
        {/* احذف هذا الراوت الخاطئ */}
        {/* <Route path="/photographers/:photographerId" element={<PhotographersPage />} /> */}
        
        <Route 
          path='/photographers' 
          element={<ProtectedRoute><PhotographersPage /></ProtectedRoute>} 
        />
        
        {/* صفحة تفاصيل المصور - أضف هذا الراوت */}
        <Route 
          path='/photographer/:id' 
          element={<ProtectedRoute><PhotographerDetailsPage /></ProtectedRoute>} 
        />

        {/* القاعات */}
        <Route 
          path='/wedding-halls' 
          element={<ProtectedRoute><WeddingHallsPage /></ProtectedRoute>} 
        />
        <Route 
          path='/conference-halls' 
          element={<ProtectedRoute><ConferenceHallsPage /></ProtectedRoute>} 
        />

        {/* انضم إلينا */}
        <Route path='/join-us' element={<JoinUsPage />} />
        

        {/* المفضلة */}
        <Route 
          path='/favorites' 
          element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} 
        />

        {/* الديكور */}
        <Route 
          path='/decorations' 
          element={<ProtectedRoute><DecorationsPage /></ProtectedRoute>} 
        />

        {/* تسجيل ودخول */}
        <Route 
          path='/signup' 
          element={<PublicRoute><SignUpPage /></PublicRoute>} 
        />
        <Route 
          path='/login' 
          element={<PublicRoute><LoginPage /></PublicRoute>} 
        />

        {/* التحقق */}
        <Route path='/verify-email' element={<EmailVerificationPage />} />

        {/* نسيان الباسورد */}
        <Route 
          path='/forgot-password' 
          element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} 
        />
        <Route 
          path='/reset-password/:token' 
          element={<PublicRoute><ResetPasswordPage /></PublicRoute>} 
        />

        {/* أي مسار غلط */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;