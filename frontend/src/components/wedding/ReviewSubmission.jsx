import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const ReviewSubmission = ({ venue, onReviewAdded }) => {
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      alert('يرجى كتابة تقييمك');
      return;
    }

    if (!user) {
      alert('يرجى تسجيل الدخول لإضافة تقييم');
      return;
    }

    setIsSubmitting(true);

    const newReview = {
      id: Date.now(),
      userName: user?.name || 'مستخدم',
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString('ar-EG'),
      userInitial: user?.name?.charAt(0) || 'م'
    };

    try {
      // حفظ التقييم في قاعدة البيانات
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: venue.id || venue._id,
          venueName: venue.name,
          userName: user?.name || 'مستخدم',
          userEmail: user?.email || '',
          rating: reviewRating,
          review: reviewText,
          date: new Date().toISOString()
        })
      });

      if (response.ok) {
        onReviewAdded(newReview);
        setReviewText("");
        setReviewRating(5);
        alert('✅ تم إضافة تقييمك بنجاح!');
      } else {
        throw new Error('فشل في حفظ التقييم');
      }
    } catch (error) {
      console.error('خطأ في إضافة التقييم:', error);
      // في حالة الخطأ، نضيف التقييم محلياً للعرض
      onReviewAdded(newReview);
      setReviewText("");
      setReviewRating(5);
      alert('✅ تم إضافة تقييمك بنجاح! (بيانات محلية)');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 text-lg mb-2">⚠️</div>
        <h4 className="text-lg font-semibold text-yellow-800 mb-2">تسجيل الدخول مطلوب</h4>
        <p className="text-yellow-700 text-sm">
          يرجى تسجيل الدخول لإضافة تقييمك للقاعة
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">اكتب تقييمك</h4>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className={`text-2xl ${
                  star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-300 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">اختر عدد النجوم من 1 إلى 5</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="شاركنا تجربتك مع هذه القاعة..."
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !reviewText.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري الإرسال...
            </>
          ) : (
            'إرسال التقييم'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewSubmission;