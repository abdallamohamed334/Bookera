import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, Loader, ArrowLeft } from "lucide-react";

const EmailVerificationPage = () => {
    const [isSending, setIsSending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();

    const { user, resendVerificationEmail, message, error } = useAuthStore();

    useEffect(() => {
        if (!user) return;

        const interval = setInterval(async () => {
            await user.reload();
            const verified = user.emailVerified || user.providerData.some(p => p.providerId === "google.com");
            if (verified) {
                toast.success("تم تفعيل البريد بنجاح 🎉");
                navigate("/"); // يروح للهوم مباشرة بدل تسجيل الدخول
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user, navigate]);

    const handleResend = async () => {
        setIsSending(true);
        try {
            await resendVerificationEmail();
            toast.success("تم إعادة إرسال رابط التفعيل إلى بريدك الإلكتروني");
            setTimer(60);
            setCanResend(false);
        } catch (err) {
            toast.error(err.message || "حدث خطأ أثناء إعادة الإرسال");
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative z-10 p-8'
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center rounded-xl mb-6">
                    <Link to="/" className="absolute right-6 top-6 text-white hover:text-blue-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">التحقق من البريد الإلكتروني</h1>
                    <p className="text-blue-100 text-sm">
                        تم إرسال رابط التفعيل إلى بريدك الإلكتروني:
                    </p>
                    <p className="text-blue-200 font-semibold mt-1">{user?.email}</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-red-700 text-sm text-center font-medium">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-green-700 text-sm text-center font-medium">{message}</p>
                    </div>
                )}

                <div className="text-center mt-6">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={isSending}
                            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "إعادة إرسال رابط التفعيل"}
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            يمكنك إعادة الإرسال خلال {timer} ثانية
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;
