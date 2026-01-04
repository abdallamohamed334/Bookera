import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photographer from '../models/Photographer.js';

dotenv.config();

const samplePhotographers = [
  {
    name: "Reham Sabry",
    businessName: "Reham Sabry photography ",
    type: "شخصي",
    specialty: "تصوير افراح",
    experience: 5,
    governorate: "القاهرة",
    city: " القاهرة",
    price: "2000",
    portfolio: [
      {
        title: "  ",
        description: " ",
        category: "افراح",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517365/6_cyoacu.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517365/6_cyoacu.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517360/5_fwne3g.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517355/4_flenok.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517350/1_seesmg.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517324/3_rkrxdb.jpg"
         


          

        ]
      },
       {
        title: "   ",
        description: "   ",
        category: "افراح",
        coverImage: "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517348/7_wfqmrq.jpg",
        images: [
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517348/7_wfqmrq.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517364/8_uxfhwm.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517343/12_tcdmrj.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517340/13_uz4prh.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517333/14_wxhgvw.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767517307/2_v6k06m.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767516729/11_gkz6ih.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767516702/10_cxtug0.jpg",
          "https://res.cloudinary.com/dwocg88vs/image/upload/v1767516700/9_onbwgf.jpg"
          
          
         
          
          
          
        ]
      },

    ],
    profileImage: "https://scontent.fcai21-4.fna.fbcdn.net/v/t39.30808-1/583736000_812788891622068_7681540407354260381_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeE7_oh57ZGv-tYjX3gktztH43TN6cuu5-LjdM3py67n4oBS98K3yO11O6Aa-ovvzYtd3nJb7w785XhuJjUjbk0q&_nc_ohc=o0_61N_1pJ4Q7kNvwHZB_O_&_nc_oc=Adn9bxkIGoffmiwuf0_WfRhTMzVuI-Q5x9OGKYQUIqkVFfFzdC7I0Tz0Uxz97UbQ-1I&_nc_zt=24&_nc_ht=scontent.fcai21-4.fna&_nc_gid=O9EKjKk9cM6_mwt8ZSpm7A&oh=00_AfpbS8HEC7n0RjnU0KjN6CbNQWoCRZEqXXyp1W5SAhJ37w&oe=695FE030",
    services: ["تصوير قبل الزفاف", "تصوير حفل الزفاف", "تصوير ما بعد الحفل", "ألبوم كامل", "فيديو"],
    equipment: ["Canon 800d ","Canon 2000d","2 lens 50 f1.4","Lens 18-135","Flash godex 685 ","Octa 90 "],
    description: "مصور فوتوغرافي · صحة/تجميل · متجر بقالة",
    available: true,
    rating: 4.5,
    contact: "01019922987",
    email: "rahma@gmail.com",
    address: " القاهره",
    socialMedia: {
      instagram: "https://www.facebook.com/people/Reham-Sabry-photography/100086728926278/",
      facebook: "https://www.facebook.com/people/Reham-Sabry-photography/100086728926278/",
      website: "www.rahma.com"
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