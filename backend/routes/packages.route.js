// backend/routes/packages.route.js
import express from "express";
import { pool } from "../db/connectDB.js"; // استيراد named export بدلاً من default

const router = express.Router();

// GET /api/venues/:id/packages
router.get("/:id/packages", async (req, res) => {
  const { id } = req.params;
  console.log('Fetching packages for venue ID:', id);
  
  try {
    // أولاً: جرب جلب البيانات من الداتابيز
    const { rows } = await pool.query(
      `SELECT 
        id, 
        name, 
        price, 
        original_price as "originalPrice", 
        discount, 
        features, 
        additional_services as "additionalServices", 
        description, 
        notes, 
        created_at, 
        updated_at
       FROM packages
       WHERE venue_id = $1
       ORDER BY price ASC`,
      [id]
    );

    console.log('Packages found in DB:', rows.length);
    
    if (rows.length > 0) {
      // تحويل البيانات إذا لزم الأمر
      const formattedRows = rows.map(pkg => {
        let features = pkg.features;
        if (typeof features === 'string') {
          try {
            features = JSON.parse(features);
          } catch (e) {
            features = features.split(',').map(item => item.trim());
          }
        }

        let additionalServices = pkg.additionalServices;
        if (typeof additionalServices === 'string') {
          try {
            additionalServices = JSON.parse(additionalServices);
          } catch (e) {
            additionalServices = additionalServices.split(',').map(item => item.trim());
          }
        }

        return {
          ...pkg,
          features: features || [],
          additionalServices: additionalServices || []
        };
      });

      res.json(formattedRows);
    } else {
      // إذا لم توجد بيانات في الداتابيز، استخدم البيانات التجريبية
      console.log('No packages found in DB, using sample data');
      const samplePackages = [
        {
          id: "1",
          name: "الباكدج الأساسي",
          description: "باكدج مثالي للمناسبات الصغيرة والمتوسطة",
          price: 15000,
          originalPrice: 18000,
          discount: 17,
          features: [
            "استخدام القاعة لمدة 6 ساعات",
            "خدمة الصوتيات الأساسية",
            "إضاءة أساسية",
            "طاقم خدمة",
            "ترتيب الطاولات والكراسي",
            "تكييف مركزي",
            "خدمة الأمن"
          ],
          additionalServices: [
            "تصوير احترافي (1500 جنيه إضافي)",
            "بوفيه إضافي (200 جنيه للفرد)",
            "ديكور متقدم (3000 جنيه)"
          ],
          notes: "يشمل الضرائب والخدمة - مناسب حتى 150 ضيف"
        },
        {
          id: "2",
          name: "الباكدج الفاخر",
          description: "باكدج متكامل بكل الخدمات الفاخرة",
          price: 25000,
          originalPrice: 30000,
          discount: 17,
          features: [
            "استخدام القاعة لمدة 8 ساعات",
            "خدمة صوتيات وإضاءة متطورة",
            "بوفيه مفتوح لمدة 4 ساعات",
            "طاقم خدمة متخصص",
            "ديكور أساسي",
            "شاشة عرض LED",
            "خدمة الأمن",
            "غرفة خاصة للعروسين",
            "مواقف سيارات مجانية"
          ],
          additionalServices: [
            "تصوير فوتوغرافي وفيديو (3000 جنيه)",
            "كب كيك العروسين (500 جنيه)",
            "زينة إضافية (2000 جنيه)",
            "عرض أضواء ليزر (5000 جنيه)"
          ],
          notes: "باكدج متكامل يلبي جميع الاحتياجات - مناسب حتى 250 ضيف"
        },
        {
          id: "3",
          name: "الباكدج المميز",
          description: "أفضل ما يمكن تقديمه في مناسبتك",
          price: 40000,
          originalPrice: 50000,
          discount: 20,
          features: [
            "استخدام القاعة لمدة 10 ساعات",
            "أفضل أنظمة الصوت والإضاءة",
            "بوفيه فاخر مفتوح لمدة 6 ساعات",
            "ديكور متكامل حسب الطلب",
            "تصوير احترافي 4K",
            "خدمة راقية متكاملة",
            "غرفة خاصة للعروسين مع خدمة خاصة",
            "مواقف سيارات مجانية مع خدمة Valet",
            "شاشات عرض في جميع الأرجاء",
            "خدمة الواي فاي المجانية"
          ],
          additionalServices: [
            "عرض أضواء ليزر متطورة (5000 جنيه)",
            "فرقة موسيقية حية (8000 جنيه)",
            "خدمة نقل الضيوف (3000 جنيه)",
            "ديكور إضافي فاخر (5000 جنيه)"
          ],
          notes: "باكدج VIP متكامل يلبي جميع توقعاتك - مناسب حتى 350 ضيف"
        }
      ];
      res.json(samplePackages);
    }
  } catch (err) {
    console.error("Error fetching packages:", err);
    // في حالة الخطأ، ارجع بيانات تجريبية
    const samplePackages = [
      {
        id: "1",
        name: "الباكدج الأساسي",
        description: "باكدج مثالي للمناسبات",
        price: 10000,
        features: ["خدمة أساسية", "صوتيات", "إضاءة"],
        notes: "يشمل الضرائب"
      }
    ];
    res.json(samplePackages);
  }
});

export default router;