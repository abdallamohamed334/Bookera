// routes/bookings.js
import express from "express";
import pool from "../db/db.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 🔥 دالة لإنشاء رسالة واتساب جاهزة للنسخ
const createWhatsAppMessage = (bookingData) => {
  const {
    venue_name,
    user_name,
    user_phone,
    user_email,
    type,
    date,
    guests,
    notes
  } = bookingData;

  return `🎊 طلب حجز جديد

🏢 القاعة: ${venue_name}

👤 معلومات العميل:
• الاسم: ${user_name}
• الهاتف: ${user_phone}
• البريد: ${user_email || "غير متوفر"}

📅 تفاصيل الحجز:
• النوع: ${type}
• التاريخ: ${date}
• عدد الضيوف: ${guests}

📝 ملاحظات:
${notes || "لا توجد ملاحظات"}

⏰ وقت الطلب: ${new Date().toLocaleString('ar-EG')}`;
};

// 🔥 دالة لإنشاء رابط واتساب
const createWhatsAppLink = (phone) => {
  const cleanPhone = (phone) => {
    if (!phone) return "201286162776";
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '20' + clean.substring(1);
    return clean.startsWith('201') ? clean : "201286162776";
  };
  
  return `https://wa.me/${cleanPhone(phone)}`;
};

// 🔥 إضافة عمود needs_attention إذا لم يكن موجوداً
const addNeedsAttentionColumn = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='bookings' AND column_name='needs_attention'
        ) THEN
          ALTER TABLE bookings ADD COLUMN needs_attention BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);
    console.log('✅ تم التأكد من عمود needs_attention');
    client.release();
  } catch (error) {
    console.log('ℹ️ العمود موجود بالفعل');
  }
};

// استدعاء الدالة عند بدء التشغيل
addNeedsAttentionColumn();

// 🔥 endpoint الحجز الرئيسي
router.post('/', async (req, res) => {
  let client;
  try {
    const {
      venue_id,
      venue_name,  
      user_name,
      user_phone,
      user_email,
      type,
      date,
      guests,
      notes
    } = req.body;

    console.log('📥 استلام طلب حجز جديد:', {
      venue: venue_name,
      client: user_name,
      phone: user_phone
    });

    // ✅ التحقق من الحقول المطلوبة
    if (!user_name || !user_phone || !venue_id) {
      return res.status(400).json({
        success: false,
        message: 'البيانات ناقصة: الاسم، الهاتف، ومعرف القاعة مطلوبة'
      });
    }

    // ✅ استخدام قيم افتراضية آمنة
    const safeData = {
      id: uuidv4(),
      venue_id: venue_id || 'unknown',
      venue_name: venue_name || 'قاعة غير معروفة',
      user_name: user_name || 'لم يتم تقديم الاسم',
      user_phone: user_phone || 'لم يتم تقديم الهاتف',
      user_email: user_email || 'لم يتم تقديم البريد',
      type: type || 'حجز مباشر',
      date: date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG'),
      guests: parseInt(guests) || 0,
      notes: notes || 'لا توجد ملاحظات',
      status: 'pending',
      sms_sent: false,
    };

    console.log('💾 حفظ في قاعدة البيانات...');

    // 1. ✅ حفظ في قاعدة البيانات
    client = await pool.connect();
    
    const query = `
      INSERT INTO bookings (
        id, venue_id, venue_name, user_name, user_phone, user_email, 
        type, date, time, guests, notes, status, sms_sent, needs_attention
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    const values = [
      safeData.id,
      safeData.venue_id,
      safeData.venue_name,
      safeData.user_name,
      safeData.user_phone,
      safeData.user_email,
      safeData.type,
      safeData.date,
      safeData.time,
      safeData.guests,
      safeData.notes,
      safeData.status,
      safeData.sms_sent,
      true // needs_attention = true
    ];

    const result = await client.query(query, values);
    const savedBooking = result.rows[0];

    console.log('✅ تم حفظ الحجز، المعرف:', savedBooking.id);

    // 2. 🔥 إنشاء رسالة جاهزة للنسخ (للمسؤول)
    const whatsappMessage = createWhatsAppMessage(safeData);
    const whatsappLink = createWhatsAppLink("201286162776");

    console.log('📋 تم إنشاء طلب حجز جديد يحتاج متابعة:');
    console.log('👤 العميل:', safeData.user_name);
    console.log('📞 الهاتف:', safeData.user_phone);
    console.log('🔗 رابط واتساب:', whatsappLink);
    console.log('💬 نص الرسالة:');
    console.log(whatsappMessage);

    // 3. ✅ الرد الفوري للمستخدم (لا يرى أي شيء عن الواتساب)
    res.status(201).json({
      success: true,
      message: "تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.",
      bookingId: savedBooking.id,
    });

  } catch (error) {
    console.error('❌ خطأ في الحجز:', error);
    
    // حتى في حالة الخطأ، نرد برسالة إيجابية
    res.json({
      success: true,
      message: "تم استلام طلبك بنجاح! سنتواصل معك قريباً.",
    });
  } finally {
    if (client) client.release();
  }
});

// 🔥 endpoint جديد للحجوزات التي تحتاج متابعة
router.get('/admin/pending', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    
    // الحجوزات التي تحتاج متابعة
    const pendingBookings = await client.query(`
      SELECT * FROM bookings 
      WHERE needs_attention = true 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    // إحصائيات
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN needs_attention = true THEN 1 END) as needs_attention
      FROM bookings
    `);

    const bookingsWithMessages = pendingBookings.rows.map(booking => ({
      ...booking,
      whatsappMessage: createWhatsAppMessage(booking),
      whatsappLink: createWhatsAppLink("201286162776"),
      clientWhatsAppLink: createWhatsAppLink(booking.user_phone)
    }));

    res.json({
      success: true,
      stats: stats.rows[0],
      pendingBookings: bookingsWithMessages,
      instructions: {
        step1: "انسخ نص الرسالة من الحقل whatsappMessage",
        step2: "افتح رابط واتساب للإدارة",
        step3: "الصق الرسالة وأرسلها",
        step4: "اضغط على 'تم التواصل' بعد الإرسال"
      }
    });

  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب البيانات'
    });
  } finally {
    if (client) client.release();
  }
});

// 🔥 endpoint لتحديث حالة الحجز
router.put('/:bookingId/status', async (req, res) => {
  let client;
  try {
    const { bookingId } = req.params;
    const { status, mark_contacted } = req.body;

    client = await pool.connect();
    
    let query, values;
    
    if (mark_contacted) {
      // تحديث أن تم التواصل
      query = 'UPDATE bookings SET needs_attention = false WHERE id = $1 RETURNING *';
      values = [bookingId];
    } else {
      // تحديث الحالة العامة
      query = 'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *';
      values = [status, bookingId];
    }

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }

    res.json({
      success: true,
      message: mark_contacted ? 'تم تحديث حالة التواصل' : 'تم تحديث حالة الحجز',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث الحالة'
    });
  } finally {
    if (client) client.release();
  }
});

// endpoint لاستعلام حجوزات قاعة محددة
router.get('/venue/:venueId', async (req, res) => {
  let client;
  try {
    const { venueId } = req.params;
    
    client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM bookings WHERE venue_id = $1 ORDER BY created_at DESC',
      [venueId]
    );
    
    res.json({
      success: true,
      bookings: result.rows
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الحجوزات'
    });
  } finally {
    if (client) client.release();
  }
});

// endpoint لحجوزات مستخدم محددة
router.get('/user/:userPhone', async (req, res) => {
  let client;
  try {
    const { userPhone } = req.params;
    
    client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM bookings WHERE user_phone = $1 ORDER BY created_at DESC',
      [userPhone]
    );
    
    res.json({
      success: true,
      bookings: result.rows
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب حجوزاتك'
    });
  } finally {
    if (client) client.release();
  }
});

// endpoint للحصول على جميع الحجوزات
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50'
    );
    
    res.json({
      success: true,
      bookings: result.rows
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الحجوزات'
    });
  } finally {
    if (client) client.release();
  }
});

export default router;