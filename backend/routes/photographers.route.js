import express from 'express';
import { photograferDb } from '../db/photodb.js';
import { body, param, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'عدد كبير من الطلبات، الرجاء المحاولة بعد 15 دقيقة'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

router.use(limiter);

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة',
      errors: errors.array()
    });
  }
  next();
};

const sanitizeInput = (input) => {
  if (!input) return null;
  return String(input).trim().replace(/[<>]/g, '');
};

// =============================================
// GET جميع المصورين مع جميع البيانات من الداتابيز
// =============================================
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('governorate').optional().isString().trim(),
  query('city').optional().isString().trim(),
  query('specialty').optional().isString().trim(),
  query('search').optional().isString().trim().isLength({ max: 100 })
], validateRequest, async (req, res) => {
  try {
    const {
      governorate,
      city,
      specialty,
      search,
      page = 1,
      limit = 10
    } = req.query;

    let queryParams = [];
    let whereConditions = [];
    let paramIndex = 1;

    if (governorate && governorate !== 'all') {
      whereConditions.push(`p.governorate = $${paramIndex}`);
      queryParams.push(sanitizeInput(governorate));
      paramIndex++;
    }

    if (city && city !== 'all' && city !== 'كل المدن') {
      whereConditions.push(`p.city = $${paramIndex}`);
      queryParams.push(sanitizeInput(city));
      paramIndex++;
    }

    if (specialty && specialty !== 'all') {
      whereConditions.push(`p.specialty = $${paramIndex}`);
      queryParams.push(sanitizeInput(specialty));
      paramIndex++;
    }

    if (search) {
      const cleanSearch = sanitizeInput(search);
      whereConditions.push(`(
        p.name ILIKE $${paramIndex} OR 
        p.business_name ILIKE $${paramIndex} OR 
        p.specialty ILIKE $${paramIndex} OR 
        p.city ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${cleanSearch}%`);
      paramIndex++;
    }

    whereConditions.push(`p.available = true`);

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const offset = (page - 1) * limit;

    const photographersQuery = `
      SELECT 
        p.id,
        p.name,
        p.business_name,
        p.type,
        p.specialty,
        p.experience,
        p.governorate,
        p.city,
        p.price,
        p.profile_image,
        p.description,
        p.available,
        p.rating,
        p.total_reviews,
        p.total_views,
        p.total_bookings,
        p.contact,
        p.email,
        p.address,
        p.created_at,
        p.subscription_type,
        p.view_count,
        p.booking_count
      FROM photographers p
      ${whereClause}
      ORDER BY p.rating DESC, p.total_bookings DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(parseInt(limit), offset);

    const photographersResult = await photograferDb.query(photographersQuery, queryParams);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM photographers p
      ${whereClause}
    `;
    
    const countParams = queryParams.slice(0, -2);
    const countResult = await photograferDb.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    const photographers = await Promise.all(photographersResult.rows.map(async (photographer) => {
      // جلب الصور
      const imagesResult = await photograferDb.query(
        `SELECT images FROM photographer_images WHERE photographer_id = $1 ORDER BY created_at DESC`,
        [photographer.id]
      );
      
      let portfolio = [];
      if (imagesResult.rows.length > 0 && imagesResult.rows[0].images) {
        portfolio = [{
          id: 1,
          title: "أعمال المصور",
          category: photographer.specialty || "تصوير",
          description: `أعمال ${photographer.name} في التصوير`,
          images: Array.isArray(imagesResult.rows[0].images) ? imagesResult.rows[0].images : []
        }];
      }
      
      // جلب الباقات
      const packagesResult = await photograferDb.query(
        `SELECT id, name, price, description FROM packages WHERE photographer_id = $1 ORDER BY price ASC`,
        [photographer.id]
      );
      
      let packages = [];
      if (packagesResult.rows.length > 0) {
        packages = packagesResult.rows.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          price: parseFloat(pkg.price),
          description: pkg.description || "باقة مميزة",
          features: ["4 ساعات تصوير", "50 صورة معدلة", "ألبوم إلكتروني"]
        }));
      }
      
      // جلب التقييمات
      const reviewsResult = await photograferDb.query(
        `SELECT id, user_name, rating, comment, created_at FROM reviews WHERE photographer_id = $1 ORDER BY created_at DESC LIMIT 5`,
        [photographer.id]
      );
      
      let recent_reviews = reviewsResult.rows;
      
      // ✅ جلب التوفر (availability) من جدول photographer_availability
      const availabilityResult = await photograferDb.query(
        `SELECT date, is_available, start_time, end_time, note 
         FROM photographer_availability 
         WHERE photographer_id = $1 
         ORDER BY date ASC 
         LIMIT 30`,
        [photographer.id]
      );
      
      const services = [
        "تصوير أفراح",
        "تصوير مناسبات",
        "تصوير شخصي",
        "تصوير عائلي"
      ];
      
      return {
        ...photographer,
        services: services,
        packages: packages,
        portfolio: portfolio,
        recent_reviews: recent_reviews,
        availability: availabilityResult.rows // ✅ إضافة جدول التوفر
      };
    }));

    res.json({
      success: true,
      photographers: photographers,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('خطأ في جلب المصورين:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب البيانات'
    });
  }
});

// =============================================
// GET مصور محدد بالـ ID مع جميع البيانات
// =============================================
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID غير صالح')
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📸 جلب المصور ID: ${id}`);
    
    const photographerQuery = `
      SELECT 
        p.id,
        p.name,
        p.business_name,
        p.type,
        p.specialty,
        p.experience,
        p.governorate,
        p.city,
        p.price,
        p.profile_image,
        p.description,
        p.available,
        p.rating,
        p.total_reviews,
        p.total_views,
        p.total_bookings,
        p.contact,
        p.email,
        p.address,
        p.created_at,
        p.subscription_type,
        p.view_count,
        p.booking_count
      FROM photographers p
      WHERE p.id = $1 AND p.available = true
    `;
    
    const photographerResult = await photograferDb.query(photographerQuery, [id]);
    
    if (photographerResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'المصور غير موجود' 
      });
    }
    
    const photographer = photographerResult.rows[0];
    
    // جلب الصور
    const imagesResult = await photograferDb.query(
      `SELECT images FROM photographer_images WHERE photographer_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    
    let portfolio = [];
    if (imagesResult.rows.length > 0 && imagesResult.rows[0].images) {
      portfolio = [{
        id: 1,
        title: "أعمال المصور",
        category: photographer.specialty || "تصوير احترافي",
        description: `معرض أعمال ${photographer.name}`,
        images: Array.isArray(imagesResult.rows[0].images) ? imagesResult.rows[0].images : []
      }];
    }
    
    // جلب الباقات
    const packagesResult = await photograferDb.query(
      `SELECT id, name, price, description FROM packages WHERE photographer_id = $1 ORDER BY price ASC`,
      [id]
    );
    
    let packages = [];
    if (packagesResult.rows.length > 0) {
      packages = packagesResult.rows.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: parseFloat(pkg.price),
        description: pkg.description || "باقة مميزة",
        features: ["4 ساعات تصوير", "50 صورة معدلة", "ألبوم إلكتروني", "تسليم خلال 7 أيام"]
      }));
    }
    
    // جلب التقييمات
    const reviewsResult = await photograferDb.query(
      `SELECT id, user_name, rating, comment, created_at FROM reviews WHERE photographer_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [id]
    );
    
    let recent_reviews = reviewsResult.rows;
    
    // ✅ جلب التوفر (availability) من جدول photographer_availability
    const availabilityResult = await photograferDb.query(
      `SELECT id, date, is_available, start_time, end_time, note, created_at
       FROM photographer_availability 
       WHERE photographer_id = $1 
       ORDER BY date ASC`,
      [id]
    );
    
    const services = [
      "تصوير أفراح",
      "تصوير مناسبات",
      "تصوير شخصي",
      "تصوير عائلي",
      "تصوير خطوبة",
      "تصوير منتجات"
    ];
    
    const fullPhotographerData = {
      ...photographer,
      services: services,
      packages: packages,
      portfolio: portfolio,
      availability: availabilityResult.rows, // ✅ استخدام جدول availability بدلاً من workingHours
      recent_reviews: recent_reviews
    };
    
    // تحديث عدد المشاهدات
    await photograferDb.query(
      `INSERT INTO views (photographer_id, viewer_ip, viewed_at) VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [id, req.ip || req.connection.remoteAddress || 'unknown']
    ).catch(err => console.error('خطأ في تسجيل المشاهدة:', err));
    
    await photograferDb.query(
      'UPDATE photographers SET total_views = total_views + 1 WHERE id = $1',
      [id]
    ).catch(err => console.error('خطأ في تحديث المشاهدات:', err));
    
    console.log(`✅ تم جلب بيانات المصور ${photographer.name} بنجاح`);
    
    res.json({
      success: true,
      photographer: fullPhotographerData
    });
    
  } catch (error) {
    console.error('خطأ في جلب المصور:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب البيانات'
    });
  }
});

// =============================================
// GET توفر المصور (Availability)
// =============================================
router.get('/:id/availability', [
  param('id').isInt({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT id, date, is_available, start_time, end_time, note, created_at
      FROM photographer_availability 
      WHERE photographer_id = $1
    `;
    let params = [id];
    let paramIndex = 2;
    
    if (start_date) {
      query += ` AND date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      query += ` AND date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    query += ` ORDER BY date ASC`;
    
    const availabilityResult = await photograferDb.query(query, params);
    
    res.json({
      success: true,
      availability: availabilityResult.rows
    });
    
  } catch (error) {
    console.error('خطأ في جلب التوفر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في جلب بيانات التوفر'
    });
  }
});

// =============================================
// POST إضافة/تحديث توفر المصور
// =============================================
router.post('/:id/availability', [
  param('id').isInt({ min: 1 }),
  body('date').isISO8601().withMessage('تاريخ غير صالح'),
  body('is_available').optional().isBoolean(),
  body('start_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('وقت بداية غير صالح'),
  body('end_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('وقت نهاية غير صالح'),
  body('note').optional().isString().trim().isLength({ max: 500 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, is_available = true, start_time, end_time, note } = req.body;
    
    // التحقق من وجود المصور
    const photographerCheck = await photograferDb.query(
      'SELECT id FROM photographers WHERE id = $1 AND available = true',
      [id]
    );
    
    if (photographerCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'المصور غير موجود' 
      });
    }
    
    // التحقق من وجود سجل لنفس التاريخ
    const existingResult = await photograferDb.query(
      `SELECT id FROM photographer_availability 
       WHERE photographer_id = $1 AND date = $2`,
      [id, date]
    );
    
    let result;
    if (existingResult.rows.length > 0) {
      // تحديث السجل الموجود
      result = await photograferDb.query(
        `UPDATE photographer_availability 
         SET is_available = $1, start_time = $2, end_time = $3, note = $4
         WHERE photographer_id = $5 AND date = $6
         RETURNING *`,
        [is_available, start_time || null, end_time || null, note || null, id, date]
      );
    } else {
      // إضافة سجل جديد
      result = await photograferDb.query(
        `INSERT INTO photographer_availability 
         (photographer_id, date, is_available, start_time, end_time, note) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [id, date, is_available, start_time || null, end_time || null, note || null]
      );
    }
    
    res.json({
      success: true,
      message: existingResult.rows.length > 0 ? 'تم تحديث التوفر بنجاح' : 'تم إضافة التوفر بنجاح',
      availability: result.rows[0]
    });
    
  } catch (error) {
    console.error('خطأ في إضافة/تحديث التوفر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في حفظ بيانات التوفر'
    });
  }
});

// =============================================
// DELETE حذف توفر مصور
// =============================================
router.delete('/:id/availability/:availabilityId', [
  param('id').isInt({ min: 1 }),
  param('availabilityId').isInt({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id, availabilityId } = req.params;
    
    const result = await photograferDb.query(
      `DELETE FROM photographer_availability 
       WHERE photographer_id = $1 AND id = $2
       RETURNING id`,
      [id, availabilityId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'سجل التوفر غير موجود' 
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف التوفر بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في حذف التوفر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في حذف بيانات التوفر'
    });
  }
});

// =============================================
// GET الباقات لمصور محدد
// =============================================
router.get('/:id/packages', [
  param('id').isInt({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    
    const packagesResult = await photograferDb.query(
      `SELECT id, name, price, description FROM packages WHERE photographer_id = $1 ORDER BY price ASC`,
      [id]
    );
    
    if (packagesResult.rows.length > 0) {
      const packages = packagesResult.rows.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: parseFloat(pkg.price),
        description: pkg.description || "باقة مميزة",
        features: ["4 ساعات تصوير", "50 صورة معدلة", "ألبوم إلكتروني"]
      }));
      
      return res.json({
        success: true,
        packages: packages
      });
    }
    
    const photographerCheck = await photograferDb.query(
      'SELECT id, price, name FROM photographers WHERE id = $1 AND available = true',
      [id]
    );
    
    if (photographerCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'المصور غير موجود' 
      });
    }
    
    const photographer = photographerCheck.rows[0];
    const basePrice = parseInt(photographer.price) || 5000;
    
    const packages = [
      {
        id: null,
        name: "📸 الباقة الأساسية",
        price: basePrice,
        description: "باقة مثالية للمناسبات الصغيرة",
        features: ["4 ساعات تصوير", "50 صورة معدلة", "ألبوم إلكتروني"]
      },
      {
        id: null,
        name: "✨ الباقة المتكاملة",
        price: Math.floor(basePrice * 1.5),
        description: "الباقة الأكثر طلباً",
        features: ["8 ساعات تصوير", "100 صورة معدلة", "ألبوم إلكتروني", "فيديو Highlight"]
      }
    ];
    
    res.json({
      success: true,
      packages: packages
    });
    
  } catch (error) {
    console.error('خطأ في جلب الباقات:', error);
    res.json({
      success: true,
      packages: []
    });
  }
});

// =============================================
// GET صور المصور
// =============================================
router.get('/:id/images', [
  param('id').isInt({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    
    const imagesResult = await photograferDb.query(
      `SELECT images FROM photographer_images WHERE photographer_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    
    let images = [];
    if (imagesResult.rows.length > 0 && imagesResult.rows[0].images) {
      images = Array.isArray(imagesResult.rows[0].images) ? imagesResult.rows[0].images : [];
    }
    
    res.json({
      success: true,
      images: images
    });
    
  } catch (error) {
    console.error('خطأ في جلب الصور:', error);
    res.json({ 
      success: true, 
      images: []
    });
  }
});

// =============================================
// GET تقييمات المصور
// =============================================
router.get('/:id/reviews', [
  param('id').isInt({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    
    const reviewsResult = await photograferDb.query(
      `SELECT id, user_name, rating, comment, created_at FROM reviews WHERE photographer_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    
    res.json({
      success: true,
      reviews: reviewsResult.rows
    });
    
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    res.json({ 
      success: true, 
      reviews: []
    });
  }
});

// =============================================
// POST إضافة تقييم
// =============================================
router.post('/:id/reviews', [
  param('id').isInt({ min: 1 }),
  body('user_name').notEmpty().withMessage('الاسم مطلوب'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('التقييم يجب أن يكون بين 1 و 5'),
  body('comment').optional().isString().trim()
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, rating, comment } = req.body;
    
    await photograferDb.query(
      `INSERT INTO reviews (photographer_id, user_name, rating, comment, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [id, user_name, rating, comment || '']
    );
    
    const avgResult = await photograferDb.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE photographer_id = $1`,
      [id]
    );
    
    const avgRating = parseFloat(avgResult.rows[0].avg_rating) || 0;
    const totalReviews = parseInt(avgResult.rows[0].total) || 0;
    
    await photograferDb.query(
      `UPDATE photographers SET rating = $1, total_reviews = $2 WHERE id = $3`,
      [avgRating, totalReviews, id]
    );
    
    res.json({
      success: true,
      message: 'تم إضافة التقييم بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في إضافة التقييم:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في إضافة التقييم'
    });
  }
});

// =============================================
// POST تسجيل مشاهدة
// =============================================
router.post('/:id/view', [
  param('id').isInt({ min: 1 })
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    
    await photograferDb.query(
      `INSERT INTO views (photographer_id, viewer_ip, viewed_at) VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [id, req.ip || req.connection.remoteAddress || 'unknown']
    );
    
    await photograferDb.query(
      'UPDATE photographers SET total_views = total_views + 1 WHERE id = $1',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: 'تم تسجيل المشاهدة بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في تسجيل المشاهدة:', error);
    res.json({ 
      success: true, 
      message: 'تم تسجيل المشاهدة'
    });
  }
});

// =============================================
// GET المحافظات
// =============================================
router.get('/meta/governorates', async (req, res) => {
  try {
    const result = await photograferDb.query(`
      SELECT DISTINCT governorate 
      FROM photographers 
      WHERE available = true AND governorate IS NOT NULL AND governorate != ''
      ORDER BY governorate
    `);
    
    res.json({
      success: true,
      data: result.rows.map(row => row.governorate)
    });
  } catch (error) {
    res.json({ success: true, data: ["القاهرة", "الإسكندرية", "الجيزة"] });
  }
});

// =============================================
// GET المدن
// =============================================
router.get('/meta/cities/:governorate', validateRequest, async (req, res) => {
  try {
    const { governorate } = req.params;
    const result = await photograferDb.query(`
      SELECT DISTINCT city 
      FROM photographers 
      WHERE governorate = $1 AND available = true AND city IS NOT NULL AND city != ''
      ORDER BY city
    `, [governorate]);
    
    res.json({
      success: true,
      data: result.rows.map(row => row.city)
    });
  } catch (error) {
    res.json({ success: true, data: ["وسط البلد", "مدينة نصر", "المعادي"] });
  }
});

// =============================================
// GET التخصصات
// =============================================
router.get('/meta/specialties', async (req, res) => {
  try {
    const result = await photograferDb.query(`
      SELECT DISTINCT specialty 
      FROM photographers 
      WHERE available = true AND specialty IS NOT NULL AND specialty != ''
      ORDER BY specialty
    `);
    
    res.json({
      success: true,
      data: result.rows.map(row => row.specialty)
    });
  } catch (error) {
    res.json({ 
      success: true, 
      data: ["تصوير أفراح", "تصوير مناسبات", "تصوير شخصي", "تصوير عائلي"] 
    });
  }
});

export default router;