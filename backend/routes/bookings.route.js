import express from "express";

const router = express.Router();

// دالة إرسال واتساب
const sendWhatsAppToOwner = async (ownerPhone, message) => {
  try {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;
    
    console.log('📱 WhatsApp Link for owner:', whatsappUrl);
    
    return { success: true, url: whatsappUrl };
  } catch (error) {
    console.error('WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};

// endpoint الحجز الرئيسي
router.post('/', async (req, res) => {
  try {
    const {
      venueId,
      venueName,
      type, // 'inspection' or 'direct'
      userName,
      userPhone, 
      userEmail,
      date,
      time,
      guests,
      notes,
      userId
    } = req.body;

    console.log('📥 Received booking request:', req.body);

    // محاكاة تسجيل في الداتابيز
    console.log('💾 Saving to database...');
    
    // محاكاة جلب بيانات القاعة
    const venue = {
      ownerPhone: "01012345678" // رقم افتراضي للتجربة
    };

    const venueOwnerPhone = venue.ownerPhone;

    // نرسل رسالة واتساب لصاحب القاعة
    const whatsappMessage = `
🎉 *طلب حجز جديد!*

*القاعة:* ${venueName}
*نوع الطلب:* ${type === 'inspection' ? 'معاينة 🗓️' : 'حجز مباشر 💒'}
*الاسم:* ${userName}
*التليفون:* ${userPhone}
*البريد:* ${userEmail || 'لم يتم provided'}
*التاريخ:* ${date}
*الوقت:* ${time}
${guests ? `*عدد الضيوف:* ${guests}` : ''}
${notes ? `*ملاحظات:* ${notes}` : ''}

📞 رابط التواصل: https://wa.me/${userPhone}
    `;

    // إرسال الواتساب
    const whatsappResult = await sendWhatsAppToOwner(venueOwnerPhone, whatsappMessage);

    res.status(200).json({
      success: true,
      message: 'تم إرسال طلب الحجز بنجاح!',
      bookingId: 'BK-' + Date.now(),
      whatsappSent: whatsappResult.success,
      whatsappUrl: whatsappResult.url
    });

  } catch (error) {
    console.error('❌ Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الطلب',
      error: error.message
    });
  }
});

// endpoint لاستعلام الحجوزات
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    
    const bookings = [
      {
        id: 1,
        venueId: venueId,
        userName: "أحمد محمد",
        type: "inspection",
        date: "2024-01-15",
        status: "pending"
      }
    ];
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الحجوزات'
    });
  }
});

// endpoint لحجوزات المستخدم
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookings = [
      {
        id: 1,
        venueName: "قاعة الأفراح الفاخرة",
        type: "direct",
        date: "2024-01-20",
        status: "confirmed"
      }
    ];
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب حجوزاتك'
    });
  }
});

export default router;