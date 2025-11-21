import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../store/firebase";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      await sendEmailVerification(res.user);

      set({
        user: res.user,
        isAuthenticated: false, // يفضل false حتى يتم التفعيل
        isLoading: false,
        message: "تم إنشاء الحساب. تحقق من بريدك الإلكتروني",
      });
      return res.user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await res.user.reload();

      set({
        user: res.user,
        isAuthenticated: res.user.emailVerified,
        isLoading: false,
        message: res.user.emailVerified
          ? "تم تسجيل الدخول بنجاح"
          : "حسابك لم يتم تفعيله بعد. تحقق من بريدك الإلكتروني",
      });

      return res.user.emailVerified;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  googleLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      set({
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
        message: "تم تسجيل الدخول بواسطة Google بنجاح",
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resendVerificationEmail: async () => {
    if (!auth.currentUser) throw new Error("لا يوجد مستخدم حالي");
    await sendEmailVerification(auth.currentUser);
    set({ message: "تم إعادة إرسال رابط التفعيل إلى بريدك الإلكتروني" });
  },

  checkAuth: () => {
    set({ isCheckingAuth: true });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        set({
          user,
          isAuthenticated:
            user.emailVerified || user.providerData.some(p => p.providerId === "google.com"),
          isCheckingAuth: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      }
    });
  },

  clearMessages: () => set({ error: null, message: null }),
}));
