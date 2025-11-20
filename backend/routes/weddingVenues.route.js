import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// ✅ GET جميع قاعات الأفراح مع الباكدجات والتقييمات
router.get("/", async (req, res) => {
  let client;
  try {
    const {
      governorate,
      city,
      category,
      minPrice,
      maxPrice,
      minCapacity,
      minRating,
      page = 1,
      limit = 10,
    } = req.query;

    client = await pool.connect();

    // بناء query الفلاتر
    let whereConditions = ["1=1"];
    let queryParams = [];
    let paramCount = 0;

    if (governorate && governorate !== "all") {
      paramCount++;
      whereConditions.push(`w.governorate = $${paramCount}`);
      queryParams.push(governorate);
    }

    if (city && city !== "all" && city !== "كل المدن") {
      paramCount++;
      whereConditions.push(`w.city = $${paramCount}`);
      queryParams.push(city);
    }

    if (category && category !== "all") {
      paramCount++;
      whereConditions.push(`w.category = $${paramCount}`);
      queryParams.push(category);
    }

    if (minPrice) {
      paramCount++;
      whereConditions.push(`w.price >= $${paramCount}`);
      queryParams.push(parseInt(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      whereConditions.push(`w.price <= $${paramCount}`);
      queryParams.push(parseInt(maxPrice));
    }

    if (minCapacity) {
      paramCount++;
      whereConditions.push(`w.capacity >= $${paramCount}`);
      queryParams.push(parseInt(minCapacity));
    }

    if (minRating) {
      paramCount++;
      whereConditions.push(`w.rating >= $${paramCount}`);
      queryParams.push(parseFloat(minRating));
    }

    const whereClause = whereConditions.join(" AND ");
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // query الأساسي للقاعات
    const countQuery = `SELECT COUNT(*) as total FROM wedding_venues w WHERE ${whereClause}`;
    const countResult = await client.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // query القاعات مع الباكدجات والتقييمات
    const venuesQuery = `
      SELECT 
        w.*,
        p.id AS package_id,
        p.name AS package_name,
        p.price AS package_price,
        p."originalPrice" AS package_original_price,
        p.discount AS package_discount,
        p.features AS package_features,
        p."additionalServices" AS package_additional_services,
        p.description AS package_description,
        p.notes AS package_notes,
        p.created_at AS package_created_at,
        p.updated_at AS package_updated_at,
        r.id AS review_id,
        r.user_name AS review_user_name,
        r.rating AS review_rating,
        r.comment AS review_comment,
        r.created_at AS review_created_at,
        r.is_verified AS review_is_verified,
        r.updated_at AS review_updated_at
      FROM wedding_venues w
      LEFT JOIN packages p ON w.id = p.venue_id
      LEFT JOIN reviews r ON w.id = r.venue_id
      WHERE ${whereClause}
      ORDER BY w.created_at DESC, r.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    const finalParams = [...queryParams, parseInt(limit), skip];
    console.log('Executing venues query...');
    const venuesResult = await client.query(venuesQuery, finalParams);
    console.log(`Found ${venuesResult.rows.length} rows`);

    // تجميع القاعات والباكدجات والتقييمات
    const venuesMap = new Map();

    venuesResult.rows.forEach(row => {
      const venueId = row.id;
      
      if (!venuesMap.has(venueId)) {
        // إنشاء القاعة
        venuesMap.set(venueId, {
          id: row.id,
          name: row.name,
          type: row.type,
          category: row.category,
          governorate: row.governorate,
          city: row.city,
          address: row.address,
          capacity: row.capacity,
          min_capacity: row.min_capacity,
          max_capacity: row.max_capacity,
          price: row.price,
          min_price: row.min_price,
          max_price: row.max_price,
          pricing_type: row.pricing_type,
          original_price: row.original_price,
          special_offer: row.special_offer,
          image: row.image,
          profile_image: row.profile_image, // ← حقل إجباري جديد
          images: row.images || [],
          videos: row.videos || [],
          features: row.features || [],
          amenities: row.amenities || [],
          rules: row.rules || [],
          description: row.description,
          available: row.available,
          is_featured: row.is_featured,
          rating: row.rating,
          review_count: row.review_count,
          contact: row.contact,
          email: row.email,
          whatsapp: row.whatsapp,
          website: row.website,
          location_lat: row.location_lat,
          location_lng: row.location_lng,
          map_link: row.map_link,
          wedding_specific: row.wedding_specific || {},
          view_count: row.view_count,
          created_at: row.created_at,
          updated_at: row.updated_at,
          packages: [],
          reviews: []
        });
      }

      const venue = venuesMap.get(venueId);

      // إضافة الباكدج إذا موجود
      if (row.package_id && !venue.packages.some(pkg => pkg.id === row.package_id)) {
        const packageData = {
          id: row.package_id,
          name: row.package_name,
          price: row.package_price,
          originalPrice: row.package_original_price,
          discount: row.package_discount,
          features: row.package_features || [],
          additionalServices: row.package_additional_services || [],
          description: row.package_description,
          notes: row.package_notes,
          created_at: row.package_created_at,
          updated_at: row.package_updated_at
        };
        venue.packages.push(packageData);
      }

      // إضافة التقييم إذا موجود
      if (row.review_id && !venue.reviews.some(review => review.id === row.review_id)) {
        const reviewData = {
          id: row.review_id,
          userName: row.review_user_name || 'زائر',
          rating: parseInt(row.review_rating) || 5,
          comment: row.review_comment || '',
          date: row.review_created_at ? new Date(row.review_created_at).toLocaleDateString('ar-EG') : 'قريباً',
          isVerified: row.review_is_verified || false,
          updatedAt: row.review_updated_at,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.review_user_name || 'زائر')}&background=random`
        };
        venue.reviews.push(reviewData);
      }
    });

    const venues = Array.from(venuesMap.values());
    console.log(`Processed ${venues.length} venues with packages and reviews`);

    res.json({
      venues,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });

  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ GET قاعة محددة بالـ ID مع باكدجاتها وتقييماتها
router.get("/:id", async (req, res) => {
  let client;
  try {
    const venueId = req.params.id;
    client = await pool.connect();

    const query = `
      SELECT 
        w.*,
        p.id AS package_id,
        p.name AS package_name,
        p.price AS package_price,
        p."originalPrice" AS package_original_price,
        p.discount AS package_discount,
        p.features AS package_features,
        p."additionalServices" AS package_additional_services,
        p.description AS package_description,
        p.notes AS package_notes,
        p.created_at AS package_created_at,
        p.updated_at AS package_updated_at,
        r.id AS review_id,
        r.user_name AS review_user_name,
        r.rating AS review_rating,
        r.comment AS review_comment,
        r.created_at AS review_created_at,
        r.is_verified AS review_is_verified,
        r.updated_at AS review_updated_at
      FROM wedding_venues w
      LEFT JOIN packages p ON w.id = p.venue_id
      LEFT JOIN reviews r ON w.id = r.venue_id
      WHERE w.id = $1
      ORDER BY p.price ASC, r.created_at DESC
    `;

    const result = await client.query(query, [venueId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "القاعة غير موجودة" });
    }

    // بناء بيانات القاعة
    const venue = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      type: result.rows[0].type,
      category: result.rows[0].category,
      governorate: result.rows[0].governorate,
      city: result.rows[0].city,
      address: result.rows[0].address,
      capacity: result.rows[0].capacity,
      min_capacity: result.rows[0].min_capacity,
      max_capacity: result.rows[0].max_capacity,
      price: result.rows[0].price,
      min_price: result.rows[0].min_price,
      max_price: result.rows[0].max_price,
      pricing_type: result.rows[0].pricing_type,
      original_price: result.rows[0].original_price,
      special_offer: result.rows[0].special_offer,
      image: result.rows[0].image,
      profile_image: result.rows[0].profile_image, // ← حقل إجباري جديد
      images: result.rows[0].images || [],
      videos: result.rows[0].videos || [],
      features: result.rows[0].features || [],
      amenities: result.rows[0].amenities || [],
      rules: result.rows[0].rules || [],
      description: result.rows[0].description,
      available: result.rows[0].available,
      is_featured: result.rows[0].is_featured,
      rating: result.rows[0].rating,
      review_count: result.rows[0].review_count,
      contact: result.rows[0].contact,
      email: result.rows[0].email,
      whatsapp: result.rows[0].whatsapp,
      website: result.rows[0].website,
      location_lat: result.rows[0].location_lat,
      location_lng: result.rows[0].location_lng,
      map_link: result.rows[0].map_link,
      wedding_specific: result.rows[0].wedding_specific || {},
      view_count: result.rows[0].view_count,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
      packages: [],
      reviews: []
    };

    // إضافة الباكدجات والتقييمات
    const seenPackages = new Set();
    const seenReviews = new Set();

    result.rows.forEach(row => {
      // إضافة الباكدج إذا موجود
      if (row.package_id && !seenPackages.has(row.package_id)) {
        seenPackages.add(row.package_id);
        venue.packages.push({
          id: row.package_id,
          name: row.package_name,
          price: row.package_price,
          originalPrice: row.package_original_price,
          discount: row.package_discount,
          features: row.package_features || [],
          additionalServices: row.package_additional_services || [],
          description: row.package_description,
          notes: row.package_notes,
          created_at: row.package_created_at,
          updated_at: row.package_updated_at
        });
      }

      // إضافة التقييم إذا موجود
      if (row.review_id && !seenReviews.has(row.review_id)) {
        seenReviews.add(row.review_id);
        venue.reviews.push({
          id: row.review_id,
          userName: row.review_user_name || 'زائر',
          rating: parseInt(row.review_rating) || 5,
          comment: row.review_comment || '',
          date: row.review_created_at ? new Date(row.review_created_at).toLocaleDateString('ar-EG') : 'قريباً',
          isVerified: row.review_is_verified || false,
          updatedAt: row.review_updated_at,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.review_user_name || 'زائر')}&background=random`
        });
      }
    });

    res.json(venue);

  } catch (error) {
    console.error("Error fetching venue:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ PUT تحديث الصورة الشخصية للقاعة
router.put("/:id/profile-image", async (req, res) => {
  let client;
  try {
    const venueId = req.params.id;
    const { profile_image } = req.body;
    
    if (!profile_image) {
      return res.status(400).json({ message: "رابط الصورة مطلوب" });
    }

    client = await pool.connect();

    const query = `
      UPDATE wedding_venues 
      SET profile_image = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await client.query(query, [profile_image, venueId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "القاعة غير موجودة" });
    }

    res.json({
      success: true,
      message: "تم تحديث الصورة الشخصية بنجاح",
      venue: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ GET باكدجات قاعة محددة
router.get("/:id/packages", async (req, res) => {
  let client;
  try {
    const venueId = req.params.id;
    client = await pool.connect();

    const query = `
      SELECT 
        id,
        name,
        price,
        "originalPrice",
        discount,
        features,
        "additionalServices",
        description,
        notes,
        created_at,
        updated_at
      FROM packages 
      WHERE venue_id = $1
      ORDER BY price ASC
    `;

    const result = await client.query(query, [venueId]);

    const packages = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      originalPrice: row.originalPrice,
      discount: row.discount,
      features: row.features || [],
      additionalServices: row.additionalServices || [],
      description: row.description,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    res.json(packages);

  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ GET تقييمات قاعة محددة
router.get("/:id/reviews", async (req, res) => {
  let client;
  try {
    const venueId = req.params.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    client = await pool.connect();

    // جلب التقييمات
    const reviewsQuery = `
      SELECT 
        id,
        user_name,
        rating,
        comment,
        created_at,
        is_verified,
        updated_at
      FROM reviews 
      WHERE venue_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const reviewsResult = await client.query(reviewsQuery, [venueId, parseInt(limit), skip]);

    // جلب إحصائيات التقييمات
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews 
      WHERE venue_id = $1
    `;

    const statsResult = await client.query(statsQuery, [venueId]);

    const reviews = reviewsResult.rows.map(row => ({
      id: row.id,
      userName: row.user_name || 'زائر',
      rating: parseInt(row.rating) || 5,
      comment: row.comment || '',
      date: row.created_at ? new Date(row.created_at).toLocaleDateString('ar-EG') : 'قريباً',
      isVerified: row.is_verified || false,
      updatedAt: row.updated_at,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.user_name || 'زائر')}&background=random`
    }));

    const stats = statsResult.rows[0];
    const response = {
      reviews,
      total: parseInt(stats.total_reviews) || 0,
      averageRating: parseFloat(stats.average_rating) || 0,
      ratingDistribution: {
        5: parseInt(stats.five_star) || 0,
        4: parseInt(stats.four_star) || 0,
        3: parseInt(stats.three_star) || 0,
        2: parseInt(stats.two_star) || 0,
        1: parseInt(stats.one_star) || 0
      },
      totalPages: Math.ceil((parseInt(stats.total_reviews) || 0) / parseInt(limit)),
      currentPage: parseInt(page)
    };

    res.json(response);

  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ POST إضافة تقييم جديد
router.post("/:id/reviews", async (req, res) => {
  const { id } = req.params;
  const { userName, rating, comment } = req.body;

  try {
    const query = `
      INSERT INTO reviews
      (venue_id, user_name, rating, comment, created_at, updated_at, is_verified)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), false)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id, userName, rating, comment]);

    res.status(201).json({
      success: true,
      review: rows[0],
      message: "تم إرسال التقييم بنجاح!"
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إرسال التقييم",
      error: err.message
    });
  }
});

// ✅ PUT تحديث تقييم
router.put("/:id/reviews/:reviewId", async (req, res) => {
  let client;
  try {
    const { id: venueId, reviewId } = req.params;
    const { rating, comment } = req.body;
    
    client = await pool.connect();

    const query = `
      UPDATE reviews 
      SET rating = $1, comment = $2, updated_at = NOW()
      WHERE id = $3 AND venue_id = $4
      RETURNING *
    `;

    const result = await client.query(query, [parseInt(rating), comment, reviewId, venueId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "التقييم غير موجود" });
    }

    res.json({
      success: true,
      message: "تم تحديث التقييم بنجاح",
      review: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ DELETE حذف تقييم
router.delete("/:id/reviews/:reviewId", async (req, res) => {
  let client;
  try {
    const { id: venueId, reviewId } = req.params;
    
    client = await pool.connect();

    const result = await client.query(
      'DELETE FROM reviews WHERE id = $1 AND venue_id = $2 RETURNING *',
      [reviewId, venueId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "التقييم غير موجود" });
    }

    res.json({
      success: true,
      message: "تم حذف التقييم بنجاح"
    });

  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ GET المحافظات المتاحة
router.get("/meta/governorates", async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    const query = `
      SELECT DISTINCT governorate 
      FROM wedding_venues 
      WHERE governorate IS NOT NULL AND governorate != ''
      ORDER BY governorate
    `;

    const result = await client.query(query);
    const governorates = result.rows.map(row => row.governorate);

    res.json(governorates);

  } catch (error) {
    console.error("Error fetching governorates:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

// ✅ GET المدن المتاحة في محافظة محددة
router.get("/meta/cities/:governorate", async (req, res) => {
  let client;
  try {
    const governorate = req.params.governorate;
    client = await pool.connect();

    const query = `
      SELECT DISTINCT city 
      FROM wedding_venues 
      WHERE governorate = $1 AND city IS NOT NULL AND city != ''
      ORDER BY city
    `;

    const result = await client.query(query, [governorate]);
    const cities = result.rows.map(row => row.city);

    res.json(cities);

  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: error.message });
  } finally {
    if (client) client.release();
  }
});

export default router;