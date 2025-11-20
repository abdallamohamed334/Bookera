import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photographer from '../models/Photographer.js';

dotenv.config();

const samplePhotographers = [
  {
    name: " Mariam Badr ",
    businessName: "mariambadrphotography",
    type: "فردي",
    specialty: "تصوير أفراح",
    experience: 2,
    governorate: "القاهرة",
    city: "المنهدسين",
    price: "2000",
    portfolio: [
      {
        title: " 🤍  قصر البرنس نجيب  🤍  ",
        description: "🤍  قصر البرنس نجيب  🤍 ",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587407/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_14_lvsncq.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587392/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_7_krvvih.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587394/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_8_jugv4n.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587397/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_9_heufrb.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587400/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_10_iszywh.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587400/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_11_z6xwpv.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587401/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_12_gcwftz.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587406/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_13_zjqin9.jpg",                            
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587408/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_15_h5t6o9.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587407/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_14_lvsncq.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587412/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_16_t0atwh.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587414/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_beguee.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587417/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_1_ffcfu6.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587420/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_2_b1bx8e.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587422/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_3_wdevbr.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587427/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_4_pc2gg3.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587428/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_5_lupc8m.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763587433/Book_your_day-_01067871601Save_your_special_moments_with_us_%EF%B8%8F_6_ia1rvk.jpg"

        ]
      },
       {
        title: "  Congratulations A & R💞 ",
        description: " Congratulations A & R💞   ",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588072/Congratulations_A_R_Book_your_day-_01067871601_1_s4kk76.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588073/Congratulations_A_R_Book_your_day-_01067871601_3_ffuy2r.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588072/Congratulations_A_R_Book_your_day-_01067871601_1_s4kk76.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588071/Congratulations_A_R_Book_your_day-_01067871601_2_bpzqlp.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588069/Congratulations_A_R_Book_your_day-_01067871601_f9vh9n.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588066/Congratulations_A_R_Book_your_day-_01067871601_11_bwj5lb.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588064/Congratulations_A_R_Book_your_day-_01067871601_10_gbuf8g.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588063/Congratulations_A_R_Book_your_day-_01067871601_9_lt250a.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588059/Congratulations_A_R_Book_your_day-_01067871601_8_cojx88.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588057/Congratulations_A_R_Book_your_day-_01067871601_5_ilspca.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588058/Congratulations_A_R_Book_your_day-_01067871601_7_iecwvt.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588057/Congratulations_A_R_Book_your_day-_01067871601_6_gdh9z0.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588057/Congratulations_A_R_Book_your_day-_01067871601_6_gdh9z0.jpg"
          
          
        ]
      },

    ],
    profileImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1763588072/Congratulations_A_R_Book_your_day-_01067871601_1_s4kk76.jpg",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "تصوير ما بعد الحفل", "ألبوم كامل", "فيديو"],
    equipment: ["Canon EOS R5", "Sony A7III", "DJI Drone", "LED Lights", "Various Lenses"],
    description: "مصور محترف متخصص في تصوير الأفراح بأسلوب فني عصري، أمتلك خبرة 8 سنوات.",
    available: true,
    rating: 4.7,
    contact: "01067871601",
    email: "mariam@photography.com",
    address: "شارع 9، المعادي، القاهرة",
    socialMedia: {
      instagram: "https://www.instagram.com/mariambadrphotography?igsh=MW9oNHp3YXk2Y21teg%3D%3D&utm_source=qr&fbclid=IwY2xjawOLE5lleHRuA2FlbQIxMABicmlkETFNMGJ2bTZTMFRYWkhtMm5pc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjObgjJW8v8C9Ru8mmZrWKfqlEkSw0C5wXxqrozIseZl54kErO-ULu3KpFvP_aem_i8qk7hnS-SgW_2l_iVZn5w",
      facebook: "https://l.instagram.com/?u=https%3A%2F%2Fwww.facebook.com%2FMariam-Badr-photography-105040588043823%2F%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio&e=AT3GutZmHiHRBXGGlT6d7_Mbod3bdWIlLKh17hE-wApT4pZ_SFOxEqpGy_hl3vyMDkoPK1LIvPAkXHOLQndMhHXPjxGU3bgAgl--U4C8gw",
      website: "www.ahmed-photo.com"
    },
    photographySpecific: {
      hoursCoverage: 8,
      numberOfPhotos: "+200",
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
    await mongoose.connect("mongodb+srv://tallaey445_db_user:KSFUyc7tmkHQnsEb@cluster0.pxplox6.mongodb.net/?appName=Cluster0");
    console.log("📡 Connected to MongoDB");

    for (const photographer of samplePhotographers) {
      const email = photographer.email.toLowerCase().trim(); // normalize
      const updatedPhotographer = await Photographer.findOneAndUpdate(
        { email },               // تحقق بالإيميل
        { $set: photographer },   // حدث كل البيانات
        { upsert: true, new: true } // لو مش موجود → إضافة جديد
      );

      console.log(`✅ Upserted: ${updatedPhotographer.name}`);
    }

    const total = await Photographer.countDocuments();
    console.log(`📊 Total photographers in database: ${total}`);
    console.log("🎉 Database seeding (update/upsert) completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database upsert:", error);
    process.exit(1);
  }
};

seedDatabase();