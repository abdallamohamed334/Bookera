import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photographer from '../models/Photographer.js';

dotenv.config();

const samplePhotographers = [
  {
    name: "أحمد محمد",
    businessName: "استوديو أحلام للتصوير",
    type: "استوديو",
    specialty: "تصوير أفراح",
    experience: 8,
    governorate: "القاهرة",
    city: "المعادي",
    price: "5000",
    portfolio: [
      {
        title: "حفل زفاف سارة ومحمد",
        description: "تصوير كامل لحفل زفاف في فندق شيراتون القاهرة",
        category: "أفراح",
        coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        images: [
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
        ]
      },
      {
        title: "جلسة تصوير طبيعية",
        description: "جلسة تصوير في الحديقة اليابانية بالزمالك",
        category: "طبيعي",
        coverImage: "https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=800",
        images: [
          "https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=800",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
        ]
      }
    ],
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "تصوير ما بعد الحفل", "ألبوم كامل", "فيديو"],
    equipment: ["Canon EOS R5", "Sony A7III", "DJI Drone", "LED Lights", "Various Lenses"],
    description: "مصور محترف متخصص في تصوير الأفراح بأسلوب فني عصري، أمتلك خبرة 8 سنوات.",
    available: true,
    rating: 4.9,
    contact: "01001234567",
    email: "ahmed@photography.com",
    address: "شارع 9، المعادي، القاهرة",
    socialMedia: {
      instagram: "@ahmed_photography",
      facebook: "Ahmed Photography Studio",
      website: "www.ahmed-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 8,
      numberOfPhotos: 500,
      digitalPhotos: true,
      printedPhotos: true,
      photoAlbum: true,
      videoCoverage: true,
      secondPhotographer: true,
      editingTime: 14,
      rawFiles: false
    },
    packages: [
      {
        name: "الباقة الأساسية",
        price: 3000,
        description: "تغطية أساسية للحفل مع عدد محدود من الصور",
        features: ["4 ساعات تصوير", "200 صورة معدلة", "صور رقمية", "تصوير فيديو أساسي"],
        hours: 4,
        photosCount: 200
      },
      {
        name: "الباقة المتكاملة",
        price: 5000,
        description: "تغطية شاملة لجميع مراحل الزفاف",
        features: ["8 ساعات تصوير", "500 صورة معدلة", "ألبوم فاخر", "فيديو احترافي", "مصور مساعد"],
        hours: 8,
        photosCount: 500
      }
    ]
  },

  {
    name: "مريم أحمد",
    businessName: "لحظات جميلة للتصوير",
    type: "فردي",
    specialty: "تصوير طبيعي",
    experience: 5,
    governorate: "الغربية",
    city: "طنطا",
    price: "3500",
    portfolio: [
      {
        title: "جلسة خطوبة في الحديقة",
        description: "جلسة تصوير طبيعية لخطوبة في حديقة الأسرة",
        category: "طبيعي",
        coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
        images: [
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
          "https://images.unsplash.com/photo-1445905595283-21f8ae8a33d2?w=800"
        ]
      },
      {
        title: "تصوير أطفال في الاستوديو",
        description: "جلسة تصوير احترافية للأطفال في الاستوديو",
        category: "أطفال",
        coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
        images: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800"
        ]
      }
    ],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "ألبوم كامل"],
    equipment: ["Nikon Z6", "Canon 5D Mark IV", "Studio Lights", "Various Lenses"],
    description: "مصورة متخصصة في التصوير الطبيعي والرومانسي.",
    available: true,
    rating: 4.7,
    contact: "01001234568",
    email: "mariam@photography.com",
    address: "حي الشرق، طنطا، الغربية",
    socialMedia: {
      instagram: "@mariam_photography",
      facebook: "Mariam Photography",
      website: "www.mariam-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 6,
      numberOfPhotos: 300,
      digitalPhotos: true,
      printedPhotos: true,
      photoAlbum: true,
      videoCoverage: false,
      secondPhotographer: false,
      editingTime: 10,
      rawFiles: true
    },
    packages: [
      {
        name: "الباقة البسيطة",
        price: 2000,
        description: "تغطية خفيفة للحفل",
        features: ["3 ساعات تصوير", "150 صورة", "صور رقمية"],
        hours: 3,
        photosCount: 150
      },
      {
        name: "الباقة القياسية",
        price: 3500,
        description: "تغطية كاملة مع ألبوم",
        features: ["6 ساعات تصوير", "300 صورة", "ألبوم صغير", "صور رقمية"],
        hours: 6,
        photosCount: 300
      }
    ]
  },

  {
    name: "خالد محمود",
    businessName: "فنون التصوير الحديث",
    type: "شركة تصوير",
    specialty: "تصوير حديث",
    experience: 12,
    governorate: "الإسكندرية",
    city: "سموحة",
    price: "7500",
    portfolio: [
      {
        title: "حفل زفاف فاخر",
        description: "تصوير شامل لحفل زفاف في قاعة فاخرة بالإسكندرية",
        category: "أفراح",
        coverImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
        images: [
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
        ]
      },
      {
        title: "تصوير درون للمناظر",
        description: "تصوير جوي للمناطق السياحية بالإسكندرية",
        category: "طبيعي",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800"
        ]
      }
    ],
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    services: ["تصوير حفل الزفاف", "ألبوم كامل", "فيديو", "درون"],
    equipment: ["Canon EOS R5", "Sony A7SIII", "DJI Mavic 3", "Professional Lighting", "Multiple Lenses"],
    description: "شركة تصوير متخصصة في التصوير الحديث باستخدام أحدث التقنيات.",
    available: true,
    rating: 4.8,
    contact: "01001234569",
    email: "khaled@photography.com",
    address: "شارع 45، سموحة، الإسكندرية",
    socialMedia: {
      instagram: "@khaled_photography",
      facebook: "Khaled Modern Photography",
      website: "www.khaled-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 10,
      numberOfPhotos: 800,
      digitalPhotos: true,
      printedPhotos: true,
      photoAlbum: true,
      videoCoverage: true,
      secondPhotographer: true,
      editingTime: 21,
      rawFiles: true
    },
    packages: [
      {
        name: "الباقة الفاخرة",
        price: 7500,
        description: "تغطية شاملة مع تقنيات متقدمة",
        features: ["10 ساعات تصوير", "800 صورة", "فيديو 4K", "تصوير درون", "مصورين مساعدين"],
        hours: 10,
        photosCount: 800
      }
    ]
  },

  {
    name: "سارة إبراهيم",
    businessName: "إبداع للتصوير الفني",
    type: "فردي",
    specialty: "تصوير فني",
    experience: 6,
    governorate: "الجيزة",
    city: "الدقي",
    price: "4000",
    portfolio: [
      {
        title: "جلسة تصوير فنية",
        description: "جلسة تصوير إبداعية باستخدام تقنيات الإضاءة المتقدمة",
        category: "فني",
        coverImage: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800",
        images: [
          "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800",
          "https://images.unsplash.com/photo-1545315007-78ec0e8d8e5b?w=800"
        ]
      },
      {
        title: "تصوير منتجات",
        description: "تصوير احترافي للمنتجات التجارية",
        category: "تجاري",
        coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
        ]
      }
    ],
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "ألبوم كامل"],
    equipment: ["Sony A7III", "Studio Flash System", "Backdrops", "Reflectors"],
    description: "مصورة فنية متخصصة في التصوير الإبداعي والتصوير التجاري.",
    available: true,
    rating: 4.6,
    contact: "01001234570",
    email: "sara@photography.com",
    address: "شارع جامعة القاهرة، الدقي، الجيزة",
    socialMedia: {
      instagram: "@sara_photography",
      facebook: "Sara Creative Photography",
      website: "www.sara-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 5,
      numberOfPhotos: 250,
      digitalPhotos: true,
      printedPhotos: false,
      photoAlbum: true,
      videoCoverage: false,
      secondPhotographer: false,
      editingTime: 7,
      rawFiles: true
    },
    packages: [
      {
        name: "الباقة الإبداعية",
        price: 4000,
        description: "جلسة تصوير فنية متكاملة",
        features: ["5 ساعات تصوير", "250 صورة فنية", "تعديل متقدم", "صور رقمية عالية الجودة"],
        hours: 5,
        photosCount: 250
      }
    ]
  },

  {
    name: "محمد السيد",
    businessName: "تراث للتصوير التقليدي",
    type: "استوديو",
    specialty: "تصوير تقليدي",
    experience: 15,
    governorate: "المنيا",
    city: "المنيا",
    price: "3000",
    portfolio: [
      {
        title: "حفل زفاف تقليدي",
        description: "تصوير حفل زفاف بالطريقة التقليدية المصرية",
        category: "أفراح",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        images: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800"
        ]
      },
      {
        title: "تصوير عائلات",
        description: "جلسات تصوير عائلية في الاستوديو",
        category: "عائلات",
        coverImage: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
        images: [
          "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
          "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800"
        ]
      }
    ],
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    services: ["تصوير حفل الزفاف", "ألبوم كامل"],
    equipment: ["Canon 6D", "Traditional Backdrops", "Classic Lighting"],
    description: "مصور تقليدي محترف مع خبرة 15 سنة في تصوير الأفراح والمناسبات.",
    available: true,
    rating: 4.5,
    contact: "01001234571",
    email: "mohamed@photography.com",
    address: "شارع المدينة المنورة، المنيا",
    socialMedia: {
      instagram: "@mohamed_traditional",
      facebook: "Mohamed Traditional Photography",
      website: "www.mohamed-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 6,
      numberOfPhotos: 200,
      digitalPhotos: true,
      printedPhotos: true,
      photoAlbum: true,
      videoCoverage: false,
      secondPhotographer: false,
      editingTime: 10,
      rawFiles: false
    },
    packages: [
      {
        name: "الباقة التقليدية",
        price: 3000,
        description: "تصوير تقليدي شامل للحفل",
        features: ["6 ساعات تصوير", "200 صورة", "ألبوم فاخر", "صور رقمية"],
        hours: 6,
        photosCount: 200
      }
    ]
  },

  {
    name: "فاطمة حسن",
    businessName: "أنوثة للتصوير",
    type: "فردي",
    specialty: "تصوير فني",
    experience: 4,
    governorate: "الأسكندرية",
    city: "المنتزه",
    price: "3200",
    portfolio: [
      {
        title: "جلسة تصوير أنوثة",
        description: "جلسة تصوير خاصة تبرز جمال الأنوثة",
        category: "فني",
        coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
        images: [
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800"
        ]
      },
      {
        title: "تصوير مكياج وفاشون",
        description: "جلسة تصوير لموديلات وعارضات أزياء",
        category: "أزياء",
        coverImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
        images: [
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
          "https://images.unsplash.com/photo-1492106087820-71f9dd33a83d?w=800"
        ]
      }
    ],
    profileImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
    services: ["تصوير قبل الزفاف", "ألبوم كامل"],
    equipment: ["Nikon D850", "Softboxes", "Beauty Dish", "Various Reflectors"],
    description: "مصورة متخصصة في التصوير الفني والأنوثة مع لمسات إبداعية فريدة.",
    available: true,
    rating: 4.4,
    contact: "01001234572",
    email: "fatima@photography.com",
    address: "حي المنتزه، الإسكندرية",
    socialMedia: {
      instagram: "@fatima_photography",
      facebook: "Fatima Feminine Photography",
      website: "www.fatima-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 4,
      numberOfPhotos: 150,
      digitalPhotos: true,
      printedPhotos: true,
      photoAlbum: true,
      videoCoverage: false,
      secondPhotographer: false,
      editingTime: 7,
      rawFiles: false
    },
    packages: [
      {
        name: "الباقة الأنثوية",
        price: 3200,
        description: "جلسة تصوير فنية خاصة",
        features: ["4 ساعات تصوير", "150 صورة فنية", "تعديل احترافي", "ألبوم صغير"],
        hours: 4,
        photosCount: 150
      }
    ]
  }
];

// ==========================
// 🚀 Function to Seed Database
// ==========================

const seedDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://tallaey445_db_user:KSFUyc7tmkHQnsEb@cluster0.pxplox6.mongodb.net/?appName=Cluster0");
    console.log('📡 Connected to MongoDB');
    
    // حذف القديم
    await Photographer.deleteMany({});
    console.log('🗑️  Old photographers data cleared');
    
    // إضافة الجديد
    await Photographer.insertMany(samplePhotographers);
    console.log('✅ Database seeded successfully with photographers');
    
    // إحصائيات سريعة
    const count = await Photographer.countDocuments();
    const specialties = await Photographer.distinct('specialty');
    
    // إحصائيات الألبومات
    const photographers = await Photographer.find({});
    let totalAlbums = 0;
    let totalImages = 0;
    
    photographers.forEach(photographer => {
      totalAlbums += photographer.portfolio.length;
      photographer.portfolio.forEach(album => {
        totalImages += album.images.length;
      });
    });
    
    console.log('\n📊 Seeding Statistics:');
    console.log(`👥 Total photographers: ${count}`);
    console.log(`🎯 Specialties: ${specialties.join(', ')}`);
    console.log(`📁 Total albums: ${totalAlbums}`);
    console.log(`🖼️ Total images: ${totalImages}`);
    console.log(`📸 Average albums per photographer: ${(totalAlbums / count).toFixed(1)}`);
    console.log(`🖼️ Average images per album: ${(totalImages / totalAlbums).toFixed(1)}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// تشغيل السكريبت
seedDatabase();