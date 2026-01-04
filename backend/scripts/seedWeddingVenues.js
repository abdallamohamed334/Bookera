import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

// ========== بيانات القاعة ==========
const newVenue = {
  id: "AFR-1",
  name: "قاعة رويال بالاس Royal Palace - Wedding Hall",
  type: "قاعة_أفراح",
  category: "فاخرة جدًا",
  governorate: "القاهرة",
  city: "مدينة نصر",
  address: "شارع مصطفى النحاس – بجوار ماستر بلازا – مدينة نصر – القاهرة",

  capacity: 600,
  minCapacity: 250,
  maxCapacity: 650,

  price: 65000,
  minPrice: 45000,
  maxPrice: 90000,
  pricingType: "سعر_لليلة",
  originalPrice: 78000,
  specialOffer: "خصم 25% على الحجوزات من الأحد إلى الأربعاء",

  image: "https://images.unsplash.com/photo-1607082349566-18796e998e8d?w=800",

  images: [
    "https://images.unsplash.com/photo-1508711040457-1ecb5c11b212?w=800",
    "https://images.unsplash.com/photo-1529634806980-bf0c935d221f?w=800",
    "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?w=800",
    "https://images.unsplash.com/photo-1612801789187-d9bd143e1e89?w=800"
  ],

  videos: [
    "https://youtu.be/FQZzJ7gS5jQ?si=hall-video"
  ],

  features: [
    "ديكور ملكي فاخر",
    "نظام صوت احترافي",
    "إضاءة ليزر وسبوتات حديثة",
    "منصة للعروسين",
    "شاشات LED عملاقة",
    "تنظيم كامل للحفل"
  ],

  amenities: [
    "موقف سيارات يسع 150 سيارة",
    "تكييف مركزي",
    "إنترنت فائق السرعة",
    "غرفة VIP",
    "غرفة عروس مجهزة",
    "بوفيه فاخر"
  ],

  rules: [
    "الدخول بالبطاقات الشخصية",
    "الالتزام بالموعد",
    "يمنع إدخال معدات تصوير خارجية بدون إذن"
  ],

  description:
    "قاعة رويال بالاس تُعد واحدة من أفخم قاعات الزفاف بمدينة نصر، تقدم أفضل خدمات الضيافة، الديكور، الإضاءة، وتنظيم الحفلات.",

  available: true,
  isFeatured: true,

  rating: 4.8,
  reviewCount: 123,

  contact: "01234567890",
  email: "royalpalace.weddinghall@gmail.com",
  whatsapp: "+201234567890",
  website: "https://royalpalace-eg.com",

  locationLat: 30.0561,
  locationLng: 31.3457,
  mapLink: "https://maps.google.com/?q=Royal+Palace+Wedding+Hall,+Nasr+City",

  weddingSpecific: {
    brideRoom: true,
    groomRoom: true,
    photography: true,
    catering: true,
    decoration: true,
    openAir: false,
    weddingEvents: true,
    engagementEvents: true,
    katbKitaabEvents: true,

    maxGuests: 650,
    minGuests: 250,

    photographyAreas: 5,
    cateringOptions: ["بوفيه مفتوح", "مقبلات", "سواريه", "حلويات شرقية وغربية"],
    decorationOptions: ["كلاسيكي", "ملكي", "Modern Luxury", "Crystal Theme"],

    soundSystem: true,
    lightingSystem: true,
    parkingCapacity: 150,
    hasGarden: false,
    hasPool: false,
    weddingPlanner: true,
    cateringService: true,
    decorationService: true,
    photographyService: true
  },

  viewCount: 0
};

// ========== الريفيوز ==========
const reviews = [
  {
    userName: "محمود السيد",
    userEmail: "mahmoud.sayed@example.com",
    rating: 5,
    comment: "قاعة ممتازة بكل معنى الكلمة.. الإضاءة والصوت كانوا فوق الرائع!",
    isVerified: true
  },
  {
    userName: "دينا مصطفى",
    userEmail: "dina.mostafa@example.com",
    rating: 4,
    comment: "المكان تحفة والتنظيم محترم جدًا.. بس البوفيه محتاج يكون أفضل.",
    isVerified: true
  },
  {
    userName: "كريم أحمد",
    userEmail: "karim.ahmed@example.com",
    rating: 5,
    comment: "اتجوزت هنا.. أحسن يوم في حياتي! كل حاجة كانت perfect.",
    isVerified: true
  }
];

// ========== الباكدجات ==========
const packages = [
  {
    name: "الباكدج الأساسي",
    price: 30000,
    originalPrice: 35000,
    discount: 15,
    features: [
      "استخدام القاعة لمدة 5 ساعات",
      "نظام صوتي أساسي",
      "ديكور بسيط",
      "طاقم خدمة (5 أفراد)"
    ],
    additionalServices: ["تصوير فوتوغرافي - 1500 جنيه"],
    description: "باكدج مناسب للحفلات البسيطة والمتوسطة",
    notes: "يمكن زيادة الوقت بتكلفة إضافية"
  },
  {
    name: "الباكدج الفاخر",
    price: 50000,
    originalPrice: 60000,
    discount: 17,
    features: [
      "استخدام القاعة لمدة 7 ساعات",
      "نظام صوت احترافي",
      "ديكور فاخر",
      "شاشة LED",
      "طاقم خدمة كامل (8 أفراد)"
    ],
    additionalServices: ["فيديو عالي الجودة - 2500 جنيه"],
    description: "الأفضل لحفلات الزفاف الكبيرة",
    notes: "يشمل ديكور إضافي مجاني"
  },
  {
    name: "الباكدج البلاتيني",
    price: 80000,
    originalPrice: 100000,
    discount: 20,
    features: [
      "استخدام القاعة لمدة 10 ساعات",
      "نظام صوت ودي جي",
      "إضاءة ليزر حديثة",
      "ديكور كامل ملكي",
      "فريق خدمة (12 فرد)"
    ],
    additionalServices: ["تصوير درون - 3000 جنيه"],
    description: "أعلى مستوى من الفخامة",
    notes: "يشمل بوفيه فاخر جداً"
  }
];

// ========== عملية الإضافة ==========
const addVenue = async () => {
  try {
    console.log("🚀 بدء إضافة القاعة...");

    // لو القاعة موجودة من قبل
    const existing = await prisma.weddingVenue.findFirst({
      where: { name: newVenue.name },
    });

    if (existing) {
      console.log(`⚠️ القاعة موجودة بالفعل: ${existing.name}`);
      return;
    }

    // إنشاء القاعة مع الريفيوز والباكدجات
    const venue = await prisma.weddingVenue.create({
      data: {
        ...newVenue,
        reviews: { create: reviews },
        packages: { create: packages }
      },
      include: { reviews: true, packages: true }
    });

    console.log("✅ تم إضافة القاعة بنجاح!");
    console.log(`🏷️ الاسم: ${venue.name}`);
    console.log(`⭐ عدد الريفيوز: ${venue.reviews.length}`);
    console.log(`🎁 عدد الباكدجات: ${venue.packages.length}`);

  } catch (error) {
    console.error("❌ خطأ:", error);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 تم فصل الاتصال بقاعدة البيانات");
  }
};

addVenue();
