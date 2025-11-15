import { useState } from 'react';
import { motion } from 'framer-motion';

const BookingModal = ({ 
  showBookingModal, 
  closeBookingModal, 
  selectedVenue, 
  bookingType, 
  setBookingType, 
  bookingLoading, 
  bookingSuccess, 
  smsStatus, 
  handleBookingSubmit,
  user 
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    inspectionDate: '',
    inspectionTime: '',
    notes: '',
    phone: '',
    email: user?.email || '',
    name: user?.name || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBookingSubmit(formData);
  };

  if (!showBookingModal || !selectedVenue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto"
      >
        {!bookingType ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">اختر نوع الحجز</h3>
              <button
                onClick={closeBookingModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => setBookingType("direct")}
                className="border-2 border-green-200 rounded-xl p-4 cursor-pointer hover:border-green-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">حجز مباشر</h4>
                    <p className="text-sm text-gray-600">احجز القاعة مباشرة للفرح</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setBookingType("inspection")}
                className="border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">طلب معاينة</h4>
                    <p className="text-sm text-gray-600">اطلب معاينة القاعة قبل الحجز + تأكيد برسالة SMS</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">معلومات القاعة</h4>
              <p className="text-sm text-gray-600">{selectedVenue.name}</p>
              <p className="text-sm text-gray-600">{selectedVenue.city}، {selectedVenue.governorate}</p>
              <p className="text-sm font-semibold text-purple-600">
                {parseInt(selectedVenue.price)?.toLocaleString()} جنيه
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {bookingType === "direct" ? "حجز القاعة" : "طلب معاينة"}
                </h3>
                <p className="text-sm text-gray-600">{selectedVenue.name}</p>
              </div>
              <button
                onClick={() => setBookingType("")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم إرسال الطلب بنجاح!</h3>
                <p className="text-gray-600 mb-4">
                  {bookingType === "direct" 
                    ? "تم إرسال طلب الحجز بنجاح وسنتواصل معك قريباً" 
                    : "تم إرسال طلب المعاينة بنجاح وسنتواصل معك لتأكيد الموعد"}
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">تم إرسال رسالة تأكيد إلى هاتفك</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {bookingType === "direct" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الفرح *</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">مدة الفرح *</label>
                      <select 
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">اختر المدة</option>
                        <option value="4 ساعات (6:00 مساءً - 10:00 مساءً)">4 ساعات (6:00 مساءً - 10:00 مساءً)</option>
                        <option value="6 ساعات (6:00 مساءً - 12:00 منتصف الليل)">6 ساعات (6:00 مساءً - 12:00 منتصف الليل)</option>
                        <option value="8 ساعات (6:00 مساءً - 2:00 صباحاً)">8 ساعات (6:00 مساءً - 2:00 صباحاً)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">عدد المدعوين *</label>
                      <input 
                        type="number" 
                        min="1"
                        max={selectedVenue.capacity}
                        value={formData.guests}
                        onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">السعة القصوى: {selectedVenue.capacity} شخص</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-blue-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">سيتم إرسال رسالة تأكيد إلى هاتفك بعد تقديم الطلب</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ المعاينة *</label>
                        <input 
                          type="date" 
                          value={formData.inspectionDate}
                          onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الوقت *</label>
                        <select 
                          value={formData.inspectionTime}
                          onChange={(e) => setFormData({...formData, inspectionTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">اختر الوقت</option>
                          <option value="9:00 صباحاً - 12:00 ظهراً">9:00 صباحاً - 12:00 ظهراً</option>
                          <option value="12:00 ظهراً - 3:00 عصراً">12:00 ظهراً - 3:00 عصراً</option>
                          <option value="3:00 عصراً - 6:00 مساءً">3:00 عصراً - 6:00 مساءً</option>
                          <option value="6:00 مساءً - 9:00 مساءً">6:00 مساءً - 9:00 مساءً</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أي متطلبات أو استفسارات إضافية..."
                  />
                </div>

                {smsStatus && (
                  <div className={`p-3 rounded-lg ${
                    smsStatus === "success" ? "bg-green-50 text-green-700" : 
                    smsStatus === "error" ? "bg-red-50 text-red-700" : 
                    "bg-blue-50 text-blue-700"
                  }`}>
                    <div className="flex items-center gap-2">
                      {smsStatus === "success" ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : smsStatus === "error" ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      <span className="text-sm">
                        {smsStatus === "success" ? "تم إرسال الرسالة بنجاح" :
                        smsStatus === "error" ? "فشل في إرسال الرسالة" :
                        "جاري إرسال الرسالة..."}
                      </span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <span>{bookingType === "direct" ? 'تأكيد الحجز' : 'إرسال طلب المعاينة'}</span>
                      <span>{bookingType === "direct" ? '🎉' : '🔍'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;