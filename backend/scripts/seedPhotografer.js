import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photographer from '../models/Photographer.js';

dotenv.config();

const samplePhotographers = [
  {
    name: " media_coverage_with_rof3",
    businessName: "Rof3 Nasser Phg🦂❤️",
    type: "فردي",
    specialty: "تصوير مناسبات",
    experience: 3,
    governorate: "الزقازيق",
    city: "التل الكبير",
    price: "2000",
    portfolio: [
      {
        title: "   ",
        description: "",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132014/588387458_17931839595137229_4673168025956052475_n_yd0ren.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132047/589924912_17931839559137229_5524959518508183929_n_swqb8n.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132044/587816443_17931839568137229_2695545241053447091_n_qx7hxg.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132044/589016865_17931839514137229_9204932908858677543_n_lsmhws.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132043/590363737_17931839529137229_1018392782906256488_n_vq4r8q.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132027/588532352_17931839541137229_3236571267809026287_n_wokecc.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132019/590959417_17931839604137229_3074638344392339179_n_kqv3av.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132018/588626339_17931839613137229_6287219628677148394_n_b0vxa6.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132017/588925307_17931839577137229_8555575927182487516_n_wkpon0.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132017/589574014_17931839622137229_7966939066678876595_n_ani9hj.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132015/589038064_17931839586137229_4358061009860431352_n_ysu6sl.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132015/588164459_17931839550137229_7139704980733295857_n_bv2tah.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132014/588387458_17931839595137229_4673168025956052475_n_yd0ren.jpg"

          

        ]
      },
       {
        title: "   ",
        description: "   ",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132250/543427272_17922514281137229_6584443799557867093_n_qi6lae.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132254/543648325_17922514308137229_1718243092173555647_n_ii66q0.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132253/543782156_17922514299137229_125401071518811147_n_stigjr.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132252/543452440_17922514326137229_8124832501211728028_n_icrjah.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132250/543427272_17922514281137229_6584443799557867093_n_qi6lae.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132248/544110482_17922514272137229_6998322019409578709_n_jyrk5p.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132247/543889665_17922514263137229_6670793287996494608_n_hu67f8.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132247/543889665_17922514263137229_6670793287996494608_n_hu67f8.jpg"
         
          
          
          
        ]
      },

    ],
    profileImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1765132361/587302637_17931626184137229_1033197480022946813_n_mhrh2e.jpg",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "تصوير ما بعد الحفل", "ألبوم كامل", "فيديو"],
    equipment: ["IPHONE"],
    description: "MediaCoverage or Sessions by IPhone 📲🎀",
    available: true,
    rating: 4.5,
    contact: "01121437182",
    email: "rahaf@photography.com",
    address: " الزقازيق - التل الكبير  ",
    socialMedia: {
      instagram: "https://www.instagram.com/media_coverage_with_rof3?igsh=MWI3cXF3OWpsNnAzMQ%3D%3D&utm_source=qr&fbclid=IwY2xjawOipKtleHRuA2FlbQIxMABicmlkETF4VWFQU3dZaDQ4N2lMSmMxc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHgCso9sYVLRc1PqV1n3vcGB0iifgB6trL-gM3EYcQ_0hPjt24bh7BNG4bsgh_aem_3-IsDU118RkqDF-hha1XQA",
      facebook: "https://www.facebook.com/rahaf.abdelnasser/",
      website: "www.rafaf-photo.com"
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