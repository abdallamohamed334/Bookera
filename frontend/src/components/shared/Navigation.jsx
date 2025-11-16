import { motion } from "framer-motion";

const Navigation = ({ user, onLogout, onBackToHome, navigate }) => {
  return (
    <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} onLogout={onLogout} />
            ) : (
              <GuestMenu navigate={navigate} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const UserMenu = ({ user, onLogout }) => (
  <>
    <div className="hidden md:flex items-center space-x-3 bg-purple-50 px-4 py-2 rounded-lg">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-600">{user.email}</p>
      </div>
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
    <button 
      onClick={onLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
    >
      تسجيل الخروج
    </button>
  </>
);

const GuestMenu = ({ navigate }) => (
  <>
    <button 
      onClick={() => navigate('/login')}
      className="text-gray-600 hover:text-purple-600 text-sm font-medium"
    >
      تسجيل الدخول
    </button>
    <button 
      onClick={() => navigate('/signup')}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
    >
      اعمل حساب
    </button>
  </>
);

export default Navigation;