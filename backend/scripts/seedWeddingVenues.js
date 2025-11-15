import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// بيانات القاعة مطابقة للموديل
const newVenue = {
  name: "قاعة السراج AL SERAG - Wedding hall",
  type: "قاعة_أفراح",
  category: "فاخرة",
  governorate: "الغربية",
  city: "السنطه",
  address: "بجوار ماما نونا والنساجون الشرقيون وامام مول نصار، طريق طنطا زفتي - السنطة، محافظة الغربية",

  // السعة
  capacity: 250,
  minCapacity: 100,
  maxCapacity: 300,

  // الأسعار
  price: 30000,
  minPrice: 20000,
  maxPrice: 50000,
  pricingType: "سعر_قاعة",
  originalPrice: 37500,
  specialOffer: "خصم 20% للحجز المبكر",

  // الوسائط
  image: "https://plus.unsplash.com/premium_photo-1761827497586-2876ff7548e8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500",
  images: [
    "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyGto1t5xdJCUJqRQ8U4fvYs01bfB9R_nFix7QVxaei9viB0_317EMHlBHuSGLA4l_PFh_RRjfv7LxmQhZYru6wBYkIkFLiIAvmWR8IC7eP2SUwIP9kNMYc3O2ixPRkd6xQJq6vtw=s680-w680-h510-rw", 
    "https://lh3.googleusercontent.com/p/AF1QipNlA6z96gUARapnCb-pDV9b6r01_y6MBWBWtxSV=s680-w680-h510-rw",
    "https://lh3.googleusercontent.com/ggs/AF1QipN1KPwsiv8VLL8IM_iPnRvhryvW7fHfTfPCV3-l=m18",
    "https://lh3.googleusercontent.com/ggs/AF1QipMkRekHZim8rLI9RgygvU7XST6Wp33n3SjgoIVu=m18"
  ],
  videos: [
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  ],

  // المميزات والخدمات
  features: ["اضاءة ممتازه", "تنظيم علي اعلي مستوي", "ديكور فاخر", "مساحة واسعة"],
  amenities: ["واي فاي مجاني", "موقف سيارات", "تكييف مركزي", "خدمات نظافة", "حمامات فاخرة"],
  rules: ["التزام بموعد الحفل", "ممنوع التدخين في الأماكن المغلقة", "الحجز المسبق مطلوب"],

  // المعلومات العامة
  description: "استعداد تام لإقامة حفلات الزفاف والخطوبة وكتب الكتاب والمؤتمرات للحجز والاستعلام 01095952888 01555255352",
  available: true,
  isFeatured: true,

  // التقييمات
  rating: 4.5,
  reviewCount: 47,

  // معلومات التواصل
  contact: "01095952888",
  email: "alserag@example.com",
  whatsapp: "+201095952888",
  website: "https://alserag.com",

  // الموقع
  locationLat: 30.9695,
  locationLng: 31.0158,
  mapLink: "https://maps.google.com/?q=السنطة+الغربية+مصر",

  // مميزات خاصة بالأفراح - محولة لـ JSON
  weddingSpecific: JSON.stringify({
    brideRoom: true,
    groomRoom: true,
    photography: true,
    catering: true,
    decoration: true,
    openAir: false,
    weddingEvents: true,
    engagementEvents: true,
    katbKitaabEvents: true,
    maxGuests: 250,
    minGuests: 100,
    photographyAreas: 3,
    cateringOptions: ["بوفيه مفتوح", "مقبلات", "حلويات"],
    decorationOptions: ["كلاسيكي", "حديث", "عربي", "أوروبي"],
    soundSystem: true,
    lightingSystem: true,
    parkingCapacity: 50,
    hasGarden: false,
    hasPool: false,
    weddingPlanner: true,
    cateringService: true,
    decorationService: true,
    photographyService: true
  }),

  // إحصائيات المشاهدة
  viewCount: 0
};

const addVenue = async () => {
  try {
    console.log("🚀 بدء إضافة قاعة الأفراح...");
    console.log("🔍 جاري التحقق من وجود القاعة...");
    
    // التحقق من وجود القاعة
    const existingVenue = await prisma.weddingVenue.findFirst({
      where: { 
        OR: [
          { name: newVenue.name },
          { 
            AND: [
              { contact: newVenue.contact },
              { governorate: newVenue.governorate }
            ]
          }
        ]
      }
    });

    if (existingVenue) {
      console.log("⚠️ القاعة موجودة بالفعل في قاعدة البيانات!");
      console.log(`🏷️ اسم القاعة: ${existingVenue.name}`);
      console.log(`🆔 الرقم: ${existingVenue.id}`);
      console.log(`📍 الموقع: ${existingVenue.city}، ${existingVenue.governorate}`);
      return;
    }

    console.log(`🌱 جاري إضافة قاعة جديدة: ${newVenue.name}`);
    console.log(`📍 الموقع: ${newVenue.city}، ${newVenue.governorate}`);
    console.log(`💰 السعر: ${newVenue.price.toLocaleString()} جنيه`);

    // إضافة القاعة الجديدة
    const createdVenue = await prisma.weddingVenue.create({
      data: newVenue
    });

    console.log("\n✅ تم إضافة القاعة بنجاح!");
    console.log("=".repeat(50));
    console.log(`🆔 رقم القاعة: ${createdVenue.id}`);
    console.log(`🏷️ الاسم: ${createdVenue.name}`);
    console.log(`📍 الموقع: ${createdVenue.city}، ${createdVenue.governorate}`);
    console.log(`💰 السعر: ${createdVenue.price.toLocaleString()} جنيه`);
    console.log(`⭐ مميزة: ${createdVenue.isFeatured ? 'نعم' : 'لا'}`);
    console.log(`📞 للتواصل: ${createdVenue.contact}`);
    console.log(`👥 السعة: ${createdVenue.capacity} شخص`);
    console.log(`📊 التقييم: ${createdVenue.rating} ⭐ (${createdVenue.reviewCount} تقييم)`);
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("❌ خطأ في إضافة القاعة:");
    console.error("📋 تفاصيل الخطأ:", error.message);
    
    if (error.code) {
      console.error(`🔧 كود الخطأ: ${error.code}`);
    }
    
    // طباعة المزيد من التفاصيل للمساعدة في التشخيص
    if (error.meta) {
      console.error("🔍 ميتاداتا الخطأ:", error.meta);
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log("🔌 تم فصل الاتصال بقاعدة البيانات");
  }
};

// تشغيل السكريبت مع معالجة الأخطاء
addVenue()
  .then(() => {
    console.log("🎉 تم تنفيذ السكريبت بنجاح!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 فشل تنفيذ السكريبت!");
    process.exit(1);
  });