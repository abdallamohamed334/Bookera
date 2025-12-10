import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photographer from '../models/Photographer.js';

dotenv.config();

const samplePhotographers = [
  {
    name: "Hesham mohamed mabrouk sayed ",
    businessName: "Americanestudio",
    type: "شخصي",
    specialty: "تصوير منتجات",
    experience: 9,
    governorate: "الجيزة",
    city: " اكتوبر",
    price: "999",
    portfolio: [
      {
        title: "   ",
        description: "",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361353/467671180_18252579442286871_5145561335980148667_n_hkhtvr.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361360/467620872_18252579415286871_18450063181725225_n_rheh65.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361359/467608737_18252579403286871_3532299275913016529_n_etuemp.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361358/467512578_18252579568286871_2631975435601420777_n_yn2h8f.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361357/467648462_18252579436286871_2055705598099486772_n_cjc5un.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361357/467863597_18252579406286871_577328646460997961_n_okhzsb.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361357/467734971_18252579433286871_1488096685221994541_n_ssnj0d.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361355/467749509_18252579430286871_2033676254240031215_n_uqtcrz.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361354/467625632_18252579439286871_1913273634400438464_n_vmz28n.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361353/467671180_18252579442286871_5145561335980148667_n_hkhtvr.jpg"


          

        ]
      },
       {
        title: "   ",
        description: "   ",
        category: "شخصي",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361580/371176039_2505912336253140_7537814329357664781_n_vjvst2.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361580/372566889_621508143453557_7542209734207468764_n_w2aecb.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361581/370055317_1143047067082761_2159562564689894127_n_udapvf.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361580/371743511_294524113272398_4911053690351348270_n_putirq.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361580/371004228_839229161099346_3762141567743914691_n_antncv.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361580/371176039_2505912336253140_7537814329357664781_n_vjvst2.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361575/372082770_225876530438598_7485152900305830331_n_gheh66.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361575/372016061_1433328977431163_1446448330576210598_n_nnieec.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361571/371438138_3563694927284944_3505185742312517942_n_uhfekj.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1765361571/371373190_574714741354895_7536338596790947755_n_of7kak.jpg"
          
         
          
          
          
        ]
      },

    ],
    profileImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1765360567/1707229412930_gonjsh.jpg",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "تصوير ما بعد الحفل", "ألبوم كامل", "فيديو"],
    equipment: ["Canon 800d ","Canon 2000d","2 lens 50 f1.4","Lens 18-135","Flash godex 685 ","Octa 90 "],
    description: "احنا شركة متخصصة في التصوير بجميع فروعه ( تصوير الافراح - اعياد الميلاد - المؤتمرات - المقابلات الشخصية - تصوير الطعام - تصوير المنتجات - تصوير الاطفال - تصوير الفاشون )",
    available: true,
    rating: 4.5,
    contact: "01120476575",
    email: "heshamamericane123@gmail.com",
    address: " الجيزه- اكتوبر ",
    socialMedia: {
      instagram: "https://www.instagram.com/americaestudio/",
      facebook: "https://www.facebook.com/share/1DxEkbfRVJ/",
      website: "www.hesham-photo.com"
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
      "name": "الباقة بالساعه",
      "price": 999,
      "description":"باقاتي بالساعه و سعر الساعه ثابت ٩٩٩ ب"
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