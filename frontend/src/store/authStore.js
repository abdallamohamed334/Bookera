// store/authStore.js
import { create } from "zustand";
import axios from "axios";

const RAILWAY_BACKEND_BASE = "https://bookera-production.up.railway.app";

const FINAL_API_BASE = import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : RAILWAY_BACKEND_BASE; 

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // ✅ التحقق من البريد الإلكتروني
    verifyEmail: async (verificationCode) => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("🔄 Verifying email with code:", verificationCode);
            
            const response = await axios.post(`${FINAL_API_BASE}/api/auth/verify-email`, { 
                code: verificationCode
            });
            
            console.log("✅ Email verification successful:", response.data);
            
            set({ 
                user: response.data.user, 
                isAuthenticated: true,
                isLoading: false,
                message: response.data.message 
            });
            
            return response.data;

        } catch (error) {
            console.error("❌ Email verification error:", error.response?.data);
            set({ 
                error: error.response?.data?.message || "Error verifying email", 
                isLoading: false 
            });
            throw error;
        }
    },

    // ✅ تسجيل مستخدم جديد
    signup: async (email, password, name) => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("🔄 Creating new user:", email);
            
            const response = await axios.post(`${FINAL_API_BASE}/api/auth/signup`, { 
                email, password, name 
            });
            
            console.log("✅ User created successfully:", response.data);
            
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isLoading: false,
                message: response.data.message 
            });
            
            return response.data.user;

        } catch (error) {
            console.error("❌ Signup error:", error.response?.data);
            set({ 
                error: error.response?.data?.message || "Error signing up", 
                isLoading: false 
            });
            throw error;
        }
    },
    
    // ✅ تسجيل دخول مستخدم عادي
    login: async (email, password) => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("🔄 User login attempt:", email);
            
            const response = await axios.post(`${FINAL_API_BASE}/api/auth/login`, { 
                email, password 
            });
            
            const userData = response.data.user;
            
            console.log("✅ User login successful:", userData);
            
            set({
                isAuthenticated: true,
                user: userData,
                error: null,
                isLoading: false,
                message: response.data.message
            });

            return userData?.role === 'admin';

        } catch (error) {
            console.error("❌ User login error:", error.response?.data);
            set({ 
                error: error.response?.data?.message || "Error logging in", 
                isLoading: false 
            });
            throw error;
        }
    },
    
    // ✅ تسجيل دخول أدمن
    loginAdmin: async (email, password) => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("👑 Admin login attempt:", email);
            
            const response = await axios.post(`${FINAL_API_BASE}/api/admin/login`, { 
                email, password 
            });
            
            const userData = response.data.user;
            
            const adminUserData = {
                ...userData,
                role: userData?.role || 'admin'
            };
            
            set({
                isAuthenticated: true,
                user: adminUserData,
                error: null,
                isLoading: false,
                message: response.data.message
            });

            return true;

        } catch (error) {
            console.error("❌ Admin login error:", error.response?.data);
            set({ 
                error: error.response?.data?.message || "Error logging in as admin", 
                isLoading: false 
            });
            throw error;
        }
    },
    
    // ✅ التحقق إذا كان المستخدم أدمن
    isAdmin: () => {
        const state = get();
        return state.user?.role === 'admin';
    },

    // ✅ الحصول على دور المستخدم
    getUserRole: () => {
        const state = get();
        return state.user?.role || 'user';
    },

    // ✅ التحقق من حالة المصادقة
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            console.log("🔄 Checking authentication...");
            
            const response = await axios.get(`${FINAL_API_BASE}/api/auth/check-auth`);
            
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isCheckingAuth: false 
            });

        } catch (error) {
            console.log("❌ Auth check failed:", error.response?.data);
            set({ 
                error: null, 
                isCheckingAuth: false, 
                isAuthenticated: false 
            });
        }
    },

    // ✅ طلب إعادة تعيين كلمة المرور
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("🔄 Forgot password request:", email);
            
            const response = await axios.post(`${FINAL_API_BASE}/api/auth/forgot-password`, { email });
            
            set({ 
                message: response.data.message, 
                isLoading: false 
            });

            return response.data;

        } catch (error) {
            console.error("❌ Forgot password error:", error.response?.data);
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error sending reset password email",
            });
            throw error;
        }
    },

    // ✅ إعادة تعيين كلمة المرور
    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("🔄 Resetting password...");
            
            const response = await axios.post(`${FINAL_API_BASE}/api/auth/reset-password/${token}`, { password });
            
            set({ 
                message: response.data.message, 
                isLoading: false 
            });

            return response.data;

        } catch (error) {
            console.error("❌ Reset password error:", error.response?.data);
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error resetting password",
            });
            throw error;
        }
    },

    // ✅ تسجيل الخروج
    logout: async () => {
        set({ isLoading: true, error: null, message: null });
        try {
            console.log("🔄 Logging out...");
            
            await axios.post(`${FINAL_API_BASE}/api/auth/logout`);
            
            set({ 
                user: null, 
                isAuthenticated: false, 
                error: null, 
                isLoading: false,
                message: "Logged out successfully" 
            });

        } catch (error) {
            console.error("❌ Logout error:", error);
            set({ 
                error: "Error logging out", 
                isLoading: false 
            });
            throw error;
        }
    },

    // ✅ مسح الرسائل والأخطاء
    clearMessages: () => {
        set({ error: null, message: null });
    },

    // ✅ تحديث بيانات المستخدم
    updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
    },

    // ✅ الحصول على حالة المستخدم الحالي
    getCurrentUser: () => {
        return get().user;
    },

    // ✅ التحقق من تحميل الصفحة
    getIsLoading: () => {
        return get().isLoading;
    },

    // ✅ الحصول على آخر خطأ
    getLastError: () => {
        return get().error;
    },

    // ✅ إعادة تعيين حالة المستخدم
    resetUser: () => {
        set({ 
            user: null, 
            isAuthenticated: false,
            error: null,
            message: null
        });
    }
}));