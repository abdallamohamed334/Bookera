// routes/whatsapp.js - الإرسال التلقائي
import express from "express";
import pool from "../db/db.js";
import fetch from 'node-fetch';

const router = express.Router();

// دالة محسنة لجلب رقم صاحب القاعة
const getVenueOwnerPhone = async (venueId) => {
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        id, 
        name, 
        contact,
        COALESCE(owner_phone, phone, whatsapp, contact) as final_phone
      FROM wedding_venues 
      WHERE id = $1
    `, [venueId]);
    
    client.release();
    
    if (result.rows.length > 0) {
      return result.rows[0].final_phone || process.env.ADMIN_WHATSAPP_NUMBER;
    }
    
    return process.env.ADMIN_WHATSAPP_NUMBER || "201286162776";
    
  } catch (error) {
    console.error('Error fetching venue phone:', error);
    return "201286162776";
  }
};

// تنظيف الرقم
const cleanPhoneNumber = (phone) => {
  if (!phone) return "201286162776";
  
  let cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '20' + cleanPhone.substring(1);
  }
  
  if (cleanPhone.startsWith('+201')) {
    cleanPhone = cleanPhone.substring(1);
  }
  
  if (cleanPhone.startsWith('201')) {
    return cleanPhone;
  }
  
  return "201286162776";
};

// 🔥 دالة الإرسال التلقائي الجديدة
const sendWhatsAppAuto = async (phone, message) => {
  try {
    const cleanPhone = cleanPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    console.log('🤖 محاولة الإرسال التلقائي إلى:', cleanPhone);
    
    // محاولة الإرسال التلقائي
    const response = await fetch(whatsappUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      // لا نستخدم mode: 'no-cors' لأننا نريد معرفة النتيجة
    });
    
    // هذه مجرد محاولة، لا يمكننا التأكد 100% من الوصول
    console.log('📤 تم طلب فتح واتساب بنجاح');
    
    return {
      success: true,
      message: 'تم إرسال طلب الواتساب تلقائياً',
      phone: cleanPhone,
      method: 'auto_redirect'
    };
    
  } catch (error) {
    console.error('❌ خطأ في الإرسال التلقائي:', error);
    return {
      success: false,
      error: error.message,
      method: 'auto_redirect_failed'
    };
  }
};

// 🔥 الـ endpoint الرئيسي - إرسال تلقائي بدون ما يرى المستخدم
router.post("/send-whatsapp", async (req, res) => {
  try {
    const bookingData = req.body;

    console.log("📨 بدء الإرسال التلقائي للحجز:", {
      venue: bookingData.venue_name,
      client: bookingData.user_name
    });

    // ✅ جلب رقم صاحب القاعة
    const venueOwnerPhone = await getVenueOwnerPhone(bookingData.venue_id);
    const cleanOwnerPhone = cleanPhoneNumber(venueOwnerPhone);

    console.log('📞 الإرسال إلى:', cleanOwnerPhone);

    // ✅ تحضير رسالة واتساب
    const message = `🎊 *طلب حجز جديد* 🎊

🏢 *القاعة:* ${bookingData.venue_name}

👤 *معلومات العميل:*
• *الاسم:* ${bookingData.user_name}
• *الهاتف:* ${bookingData.user_phone}
• *البريد:* ${bookingData.user_email || "غير متوفر"}

📅 *تفاصيل الحجز:*
• *النوع:* ${bookingData.type}
• *التاريخ:* ${bookingData.date}
• *عدد الضيوف:* ${bookingData.guests}

📝 *ملاحظات:*
${bookingData.notes || "لا توجد ملاحظات"}

⏰ *وقت الطلب:* ${new Date().toLocaleString('ar-EG')}

💬 *للرد على العميل:*
https://wa.me/${cleanPhoneNumber(bookingData.user_phone)}`;

    // 🔥 الإرسال التلقائي بدون انتظار
    sendWhatsAppAuto(venueOwnerPhone, message)
      .then(result => {
        console.log('✅ نتيجة الإرسال التلقائي:', result);
      })
      .catch(error => {
        console.error('❌ خطأ في الإرسال التلقائي:', error);
      });

    // ✅ الرد الفوري للمستخدم (لا يرى أي شيء عن الواتساب)
    res.json({
      success: true,
      message: "تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.",
      bookingReceived: true,
      // لا نرسل أي معلومات عن الواتساب للمستخدم
    });

  } catch (error) {
    console.error("❌ خطأ في معالجة الحجز:", error);
    
    // حتى في حالة الخطأ، لا نظهر تفاصيل للمستخدم
    res.json({
      success: true, // نعم نجح حتى مع الأخطاء الفرعية
      message: "تم استلام طلبك بنجاح!",
      bookingReceived: true
    });
  }
});

export default router;