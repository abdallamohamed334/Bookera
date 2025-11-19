import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photographer from '../models/Photographer.js';

dotenv.config();

const samplePhotographers = [
  {
    name: " طارق",
    businessName: "tareq_tbb  ",
    type: "شخصي",
    specialty: "تصوير مناسبات",
    experience: 8,
    governorate: "القاهرة",
    city: "المعادي",
    price: "5000",
    portfolio: [
      {
        title: " 🤍 الحب في عينيهم 🤍  ",
        description: "🤍 الحب في عينيهم 🤍 ",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577563/%D8%A7%D9%84%D8%AD%D8%A8_%D9%81%D9%8A_%D8%B9%D9%8A%D9%86%D9%8A%D9%87%D9%85_love_loveislove_fyp_photography_photooftheday_ykart1.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577575/%D8%A7%D9%84%D8%AD%D8%A8_%D9%81%D9%8A_%D8%B9%D9%8A%D9%86%D9%8A%D9%87%D9%85_love_loveislove_fyp_photography_photooftheday_3_tf7cif.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577576/%D8%A7%D9%84%D8%AD%D8%A8_%D9%81%D9%8A_%D8%B9%D9%8A%D9%86%D9%8A%D9%87%D9%85_love_loveislove_fyp_photography_photooftheday_2_aqkbfa.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577578/%D8%A7%D9%84%D8%AD%D8%A8_%D9%81%D9%8A_%D8%B9%D9%8A%D9%86%D9%8A%D9%87%D9%85_love_loveislove_fyp_photography_photooftheday_5_v9lhmx.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577578/%D8%A7%D9%84%D8%AD%D8%A8_%D9%81%D9%8A_%D8%B9%D9%8A%D9%86%D9%8A%D9%87%D9%85_love_loveislove_fyp_photography_photooftheday_1_li4eel.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577583/%D8%A7%D9%84%D8%AD%D8%A8_%D9%81%D9%8A_%D8%B9%D9%8A%D9%86%D9%8A%D9%87%D9%85_love_loveislove_fyp_photography_photooftheday_4_x6xx0z.jpg"
        ]
      },
       {
        title: "  يا جمال هداوة الصور 🔥  ",
        description: "  يا جمال هداوة الصور 🔥  ",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763585624/%D9%8A%D8%A7_%D8%AC%D9%85%D8%A7%D9%84_%D9%87%D8%AF%D8%A7%D9%88%D8%A9_%D8%A7%D9%84%D8%B5%D9%88%D8%B1_photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_model_2_zpzz70.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763585624/%D9%8A%D8%A7_%D8%AC%D9%85%D8%A7%D9%84_%D9%87%D8%AF%D8%A7%D9%88%D8%A9_%D8%A7%D9%84%D8%B5%D9%88%D8%B1_photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_model_2_zpzz70.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763585625/%D9%8A%D8%A7_%D8%AC%D9%85%D8%A7%D9%84_%D9%87%D8%AF%D8%A7%D9%88%D8%A9_%D8%A7%D9%84%D8%B5%D9%88%D8%B1_photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_model_3_b7nkwx.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763585628/%D9%8A%D8%A7_%D8%AC%D9%85%D8%A7%D9%84_%D9%87%D8%AF%D8%A7%D9%88%D8%A9_%D8%A7%D9%84%D8%B5%D9%88%D8%B1_photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_model_4_j81hdb.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763585628/%D9%8A%D8%A7_%D8%AC%D9%85%D8%A7%D9%84_%D9%87%D8%AF%D8%A7%D9%88%D8%A9_%D8%A7%D9%84%D8%B5%D9%88%D8%B1_photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_model_vu21cw.jpg",
          
        ]
      },
      {
        title: "  سموني_ملك_تصوير_اليلي",
        description: "سموني_ملك_تصوير_اليلي",
        category: "طبيعي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577639/%D8%B3%D9%85%D9%88%D9%86%D9%8A_%D9%85%D9%84%D9%83_%D8%AA%D8%B5%D9%88%D9%8A%D8%B1_%D8%A7%D9%84%D9%8A%D9%84%D9%8A___photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_jnybts.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577640/%D8%B3%D9%85%D9%88%D9%86%D9%8A_%D9%85%D9%84%D9%83_%D8%AA%D8%B5%D9%88%D9%8A%D8%B1_%D8%A7%D9%84%D9%8A%D9%84%D9%8A___photographer_photography_%D9%85%D8%B5%D9%88%D8%B1_1_veehfd.jpg",
        ]
      },
        {
        title: "  فترة الخريف الاجمل للصور 🔥",
        description: "فترة الخريف الاجمل للصور 🔥",
        category: "طبيعي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577858/%D9%81%D8%AA%D8%B1%D8%A9_%D8%A7%D9%84%D8%AE%D8%B1%D9%8A%D9%81_%D8%A7%D9%84%D8%A7%D8%AC%D9%85%D9%84_%D9%84%D9%84%D8%B5%D9%88%D8%B1_een9ls.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577859/%D9%81%D8%AA%D8%B1%D8%A9_%D8%A7%D9%84%D8%AE%D8%B1%D9%8A%D9%81_%D8%A7%D9%84%D8%A7%D8%AC%D9%85%D9%84_%D9%84%D9%84%D8%B5%D9%88%D8%B1_1_cppbld.jpg",
        ]
      }
    ],
    profileImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763577464/485654054_3928686050611416_5538891718561654918_n_sgyqcf.jpg",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "تصوير ما بعد الحفل", "ألبوم كامل", "فيديو"],
    equipment: ["Canon EOS R5", "Sony A7III", "DJI Drone", "LED Lights", "Various Lenses"],
    description: "مصور محترف متخصص في تصوير الأفراح بأسلوب فني عصري، أمتلك خبرة 8 سنوات.",
    available: true,
    rating: 4.7,
    contact: "0785317273",
    email: "tareq@photography.com",
    address: "شارع 9، المعادي، القاهرة",
    socialMedia: {
      instagram: "https://www.instagram.com/tareq_tbb/?hl=ar",
      facebook: "Ahmed Photography Studio",
      website: "www.ahmed-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 8,
      numberOfPhotos: "+50",
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

  
    
  
];

// ==========================
// 🚀 Function to Seed Database
// ==========================

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tallaey445_db_user:KSFUyc7tmkHQnsEb@cluster0.pxplox6.mongodb.net/?appName=Cluster0"
    );

    console.log("📡 Connected to MongoDB");

    for (const photographer of samplePhotographers) {
      const updated = await Photographer.findOneAndUpdate(
        { email: photographer.email }, // ✔ التعريف الأساسي
        { $set: photographer },        // ✔ تحديث البيانات بالكامل
        { upsert: true, new: true }    // ✔ لو مش موجود → يعمله Insert
      );

      console.log(`✅ Upserted: ${updated.name}`);
    }

    console.log("\n🎉 Upsert completed (Updated or Inserted without deleting)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during upsert:", error);
    process.exit(1);
  }
};

// تشغيل السكريبت
seedDatabase();