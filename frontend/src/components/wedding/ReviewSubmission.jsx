import { useState } from 'react';
import { motion } from 'framer-motion';

const ReviewSubmission = ({ venueId, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!venueId) {
      console.error('❌ venueId غير معرف');
      alert('❌ خطأ: معرف القاعة غير متوفر');
      return;
    }

    if (rating === 0) {
      alert('⚠️ يرجى اختيار تقييم');
      return;
    }

    if (!comment.trim()) {
      alert('⚠️ يرجى كتابة تعليق');
      return;
    }

    if (!userName.trim()) {
      alert('⚠️ يرجى كتابة اسمك');
      return;
    }

    const reviewData = {
      rating,
      comment: comment.trim(),
      user_name: userName.trim(),
      
      venue_id: venueId,
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    console.log('📤 بيانات التقييم المرسلة:', reviewData);

    try {
      const success = await onSubmit(reviewData);
      if (success) {
        // Reset form
        setRating(0);
        setComment('');
        setUserName('');
        setUserEmail('');
        setHoverRating(0);
      }
    } catch (error) {
      console.error('❌ خطأ في إرسال التقييم:', error);
      alert('❌ حدث خطأ أثناء إرسال التقييم');
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`text-2xl transition-transform hover:scale-110 ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6"
    >
      <h4 className="text-lg font-semibold text-gray-900 mb-4">أضف تقييمك</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* اسم المستخدم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسمك *
          </label>
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="أدخل اسمك"
            disabled={isSubmitting}
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني (اختياري)
          </label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="أدخل بريدك الإلكتروني"
            disabled={isSubmitting}
          />
        </div>

        {/* التقييم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التقييم *
          </label>
          {renderStars()}
          <div className="text-sm text-gray-500">
            {rating > 0 ? `لقد قيمت بـ ${rating} نجوم` : 'اختر عدد النجوم'}
          </div>
        </div>

        {/* التعليق */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تعليقك *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="اكتب تعليقك عن القاعة..."
            disabled={isSubmitting}
          />
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting || !venueId}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm ${
            isSubmitting || !venueId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الإرسال...
            </div>
          ) : (
            'إرسال التقييم'
          )}
        </button>

        {!venueId && (
          <div className="text-red-500 text-sm text-center">
            ⚠️ لا يمكن إضافة التقييم - بيانات القاعة غير متوفرة
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default ReviewSubmission;