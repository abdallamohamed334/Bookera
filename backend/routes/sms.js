const express = require('express');
const router = express.Router();

// محاكاة إرسال SMS للاختبار
router.post('/send-sms', async (req, res) => {
  try {
    const { to, message, type } = req.body;

    console.log('📱 محاولة إرسال SMS:', {
      to: to,
      message: message,
      type: type
    });

    // محاكاة إرسال SMS (في الإنتاج استخدم Twilio أو Unifonic)
    // هنا نجعلها تنجح دائماً للاختبار
    await new Promise(resolve => setTimeout(resolve, 1000));

    // تسجيل في قاعدة البيانات أو ملف log
    console.log('✅ تم إرسال SMS بنجاح (محاكاة)');
    console.log('📝 الرسالة:', message);
    
    res.json({ 
      success: true, 
      message: 'تم إرسال الرسالة بنجاح',
      debug: {
        to: to,
        messageLength: message.length,
        type: type
      }
    });
    
  } catch (error) {
    console.error('❌ خطأ في إرسال SMS:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في إرسال الرسالة',
      error: error.message 
    });
  }
});

// إشعار المالك
router.post('/notify-owner', async (req, res) => {
  try {
    const { to, message, venueId } = req.body;

    console.log('👤 إشعار المالك:', {
      venueId: venueId,
      message: message
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      success: true, 
      message: 'تم إرسال إشعار المالك'
    });
    
  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار المالك:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في إرسال إشعار المالك'
    });
  }
});

// حفظ الحجوزات
router.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;

    console.log('💾 حفظ بيانات الحجز:', bookingData);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      success: true, 
      message: 'تم حفظ الحجز بنجاح',
      bookingId: 'BK_' + Date.now()
    });
    
  } catch (error) {
    console.error('❌ خطأ في حفظ الحجز:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في حفظ الحجز'
    });
  }
});

module.exports = router;