// store/authStore.ts
import { create } from "zustand";
import axios from "axios";

const RAILWAY_BACKEND_BASE = "bookera-production.up.railway.app"; 

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
            console.log("🎯 User role from API:", userData?.role);
            
            set({
                isAuthenticated: true,
                user: userData,
                error: null,
                isLoading: false,
                message: response.data.message
            });

            // نتأكد من الـ role بعد ما خزنا البيانات
            console.log("🔍 User in store after login:", get().user);
            console.log("🔍 User role in store:", get().user?.role);

            // إرجاع true إذا كان المستخدم أدمن
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
            
            console.log("✅ Admin login FULL response:", response);
            console.log("📦 Response data:", response.data);
            console.log("👤 User data from API:", response.data.user);
            console.log("🎯 User role from API:", response.data.user?.role);
            
            const userData = response.data.user;
            
            // ⬇️⬇️⬇️ التعديل المهم - نتأكد إن role بيكون 'admin'
            const adminUserData = {
                ...userData,
                role: userData?.role || 'admin' // إذا مفيش role في الـ API، نضيفه يدوي
            };
            
            console.log("🎯 Final user data with role:", adminUserData);
            
            set({
                isAuthenticated: true,
                user: adminUserData,
                error: null,
                isLoading: false,
                message: response.data.message
            });

            // نتأكد من الـ role بعد ما خزنا البيانات
            console.log("🔍 User in store after login:", get().user);
            console.log("🔍 User role in store:", get().user?.role);

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
        console.log("🔍 isAdmin check:", {
            user: state.user,
            role: state.user?.role,
            isAdmin: state.user?.role === 'admin'
        });
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
            
            console.log("✅ Auth check successful:", response.data);
            console.log("🎯 User role from check-auth:", response.data.user?.role);
            
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
            
            console.log("✅ Forgot password email sent");
            
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
            
            console.log("✅ Password reset successful");
            
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
            
            console.log("✅ Logout successful");
            
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

    // ✅ إعادة تعيين حالة المستخدم (للت debugging)
    resetUser: () => {
        set({ 
            user: null, 
            isAuthenticated: false,
            error: null,
            message: null
        });
    }
}));