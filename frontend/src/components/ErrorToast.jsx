import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, X, Info } from "lucide-react";

const ErrorToast = ({ 
  type = 'error', 
  message, 
  onClose,
  action,
  actionLabel 
}) => {
  const config = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: AlertCircle,
      title: 'خطأ'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: AlertCircle,
      title: 'تحذير'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: Check,
      title: 'نجاح'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Info,
      title: 'معلومة'
    }
  };

  const { bg, border, text, icon: Icon, title } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${bg} ${border} border rounded-xl p-4 shadow-lg max-w-md mx-auto`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${text} mt-0.5`} />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm">{message}</p>
          {action && (
            <button
              onClick={action}
              className="mt-2 text-sm font-medium hover:underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${text} hover:opacity-70`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorToast;