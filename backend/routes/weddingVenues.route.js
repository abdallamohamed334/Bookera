import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// ✅ GET جميع قاعات الأفراح مع الباكدجات
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

    const whereClause = whereConditions.join(" AND ");
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // query الأساسي للقاعات
    const countQuery = `SELECT COUNT(*) as total FROM wedding_venues w WHERE ${whereClause}`;
    const countResult = await client.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // query القاعات مع الباكدجات - استخدم الأسماء الصحيحة
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
        p.updated_at AS package_updated_at
      FROM wedding_venues w
      LEFT JOIN packages p ON w.id = p.venue_id
      WHERE ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    const finalParams = [...queryParams, parseInt(limit), skip];
    console.log('Executing venues query...');
    const venuesResult = await client.query(venuesQuery, finalParams);
    console.log(`Found ${venuesResult.rows.length} rows`);

    // تجميع القاعات والباكدجات
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
          packages: []
        });
      }

      // إضافة الباكدج إذا موجود
      if (row.package_id) {
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

        venuesMap.get(venueId).packages.push(packageData);
      }
    });

    const venues = Array.from(venuesMap.values());
    console.log(`Processed ${venues.length} venues with packages`);

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

// ✅ GET قاعة محددة بالـ ID مع باكدجاتها
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
        p.updated_at AS package_updated_at
      FROM wedding_venues w
      LEFT JOIN packages p ON w.id = p.venue_id
      WHERE w.id = $1
      ORDER BY p.price ASC
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
      packages: []
    };

    // إضافة الباكدجات
    result.rows.forEach(row => {
      if (row.package_id) {
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
    });

    res.json(venue);

  } catch (error) {
    console.error("Error fetching venue:", error);
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