import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// بيانات القاعة الجديدة محدثة حسب المودل
const newVenue = {
  name: "قاعة السراج AL SERAG - Wedding hall",
  type: "قاعة_أفراح",
  category: "فاخرة",
  governorate: "الغربية",
  city: "السنطه",
  address: "بجوار ماما نونا والنساجون الشرقيون وامام مول نصار، طريق طنطا زفتي - السنطة، محافظة الغربية",

  capacity: 250,
  minCapacity: 100,        // الحد الأدنى للحضور
  maxCapacity: 300,        // الحد الأقصى للحضور

  price: 30000,
  minPrice: 20000,         // أقل سعر
  maxPrice: 50000,         // أعلى سعر
  pricingType: "سعر_قاعة", // سعر فرد / سعر قاعة / حسب الموسم

  image: "https://plus.unsplash.com/premium_photo-1761827497586-2876ff7548e8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500",
  images: [
    "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyGto1t5xdJCUJqRQ8U4fvYs01bfB9R_nFix7QVxaei9viB0_317EMHlBHuSGLA4l_PFh_RRjfv7LxmQhZYru6wBYkIkFLiIAvmWR8IC7eP2SUwIP9kNMYc3O2ixPRkd6xQJq6vtw=s680-w680-h510-rw", 
    "https://lh3.googleusercontent.com/p/AF1QipNlA6z96gUARapnCb-pDV9b6r01_y6MBWBWtxSV=s680-w680-h510-rw",
    "https://lh3.googleusercontent.com/ggs/AF1QipN1KPwsiv8VLL8IM_iPnRvhryvW7fHfTfPCV3-l=m18",
    "https://lh3.googleusercontent.com/ggs/AF1QipMkRekHZim8rLI9RgygvU7XST6Wp33n3SjgoIVu=m18"
  ],

  features: ["اضاءة ممتازه", "تنظيم علي اعلي مستوي", "ديكور فاخر", "مساحة واسعة"],
  amenities: ["واي فاي مجاني", "موقف سيارات", "تكييف مركزي", "خدمات نظافة", "حمامات فاخرة"],
  rules: ["التزام بموعد الحفل", "ممنوع التدخين في الأماكن المغلقة", "الحجز المسبق مطلوب"],

  description: "استعداد تام لإقامة حفلات الزفاف والخطوبة وكتب الكتاب والمؤتمرات للحجز والاستعلام 01095952888 01555255352",
  available: true,

  rating: 4.5,
  reviewCount: 47,

  contact: "01095952888",
  email: "alserag@example.com",
  whatsapp: "+201095952888",        // وسيلة مهمة في الحجز
  website: "https://alserag.com",   // لو ليهم موقع

  locationLat: 30.9695,             // خط العرض للسنطة تقريباً
  locationLng: 31.0158,             // خط الطول للسنطة تقريباً
  mapLink: "https://maps.google.com/?q=السنطة+الغربية+مصر",

  weddingSpecific: {
    brideRoom: true,
    groomRoom: true,
    photographyAreas: 3,
    cateringOptions: ["بوفيه مفتوح", "مقبلات", "حلويات"],
    decorationOptions: ["كلاسيكي", "حديث", "عربي", "أوروبي"],
    soundSystem: true,
    lightingSystem: true,
    maxGuests: 250,
    minGuests: 100,
    parkingCapacity: 50,
    hasGarden: false,
    hasPool: false,
    weddingPlanner: true,
    cateringService: true,
    decorationService: true,
    photographyService: true
  }
};

const addSingleVenue = async () => {
  try {
    console.log("🔍 جاري التحقق من وجود القاعة...");
    
    // التأكد من أن القاعة غير موجودة بالفعل
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
      console.log(`اسم القاعة: ${existingVenue.name}`);
      process.exit(0);
    }

    console.log(`🌱 جاري إضافة قاعة جديدة: ${newVenue.name}`);

    // إضافة القاعة الجديدة
    const createdVenue = await prisma.weddingVenue.create({
      data: newVenue
    });

    console.log("✅ تم إضافة القاعة بنجاح!");
    console.log(`🆔 رقم القاعة: ${createdVenue.id}`);
    console.log(`🏷️ الاسم: ${createdVenue.name}`);
    console.log(`📍 الموقع: ${createdVenue.city}، ${createdVenue.governorate}`);
    console.log(`💰 السعر: ${createdVenue.price} جنيه`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ خطأ في إضافة القاعة:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

// تشغيل السكريبت
addSingleVenue();