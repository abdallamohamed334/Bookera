import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Decoration from '../models/Decoration.js';

dotenv.config();

const sampleDecorators = [
  {
    name: "أحمد مصطفى",
    businessName: "إبداع للديكور",
    type: "شركة",
    specialty: "ديكور أفراح",
    experience: 8,
    governorate: "القاهرة",
    city: "المعادي",
    priceRange: { min: 5000, max: 50000 },
    portfolio: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
    ],
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    services: ["تصميم ديكور", "إضاءة وديكور ضوئي", "تصميم أركان"],
    materials: ["زهور طبيعية", "أقمشة فاخرة", "إضاءة LED"],
    description: "شركة متخصصة في ديكور حفلات الزفاف، نقدم تصاميم مبتكرة تجمع بين الفخامة والأناقة.",
    available: true,
    rating: 4.8,
    contact: "01001234567",
    email: "ahmed@decoration.com",
    address: "شارع 9، المعادي، القاهرة",
    socialMedia: {
      instagram: "@ahmed_decoration",
      facebook: "Ahmed Decoration"
    },
    decorationSpecific: {
      designTime: 7,
      executionTime: 2,
      teamSize: 5,
      providesMaterials: true
    },
    styles: ["كلاسيكي", "حديث", "فاخر"] // ✅ أصلحت من "فاخr" إلى "فاخر"
  },
  {
    name: "فاطمة أحمد",
    businessName: "ورود للديكور", 
    type: "فردي",
    specialty: "ديكور أفراح",
    experience: 6,
    governorate: "الجيزة",
    city: "المهندسين",
    priceRange: { min: 2000, max: 20000 },
    portfolio: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800"
    ],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    services: ["تصميم ديكور", "تنسيق زهور", "تصميم أركان"],
    materials: ["زهور طبيعية", "نباتات زينة", "أوعية زجاجية"],
    description: "متخصصة في تنسيق الزهور والديكور الطبيعي، أقدم لمسات جمالية طبيعية تناسب كل الأذواق.",
    available: true,
    rating: 4.7,
    contact: "01001234568",
    email: "fatma@decoration.com",
    address: "حي المهندسين، الجيزة",
    socialMedia: {
      instagram: "@fatma_flowers"
    },
    decorationSpecific: {
      designTime: 5,
      executionTime: 1,
      teamSize: 2,
      providesMaterials: true
    },
    styles: ["طبيعي", "بوهو", "ملون"]
  },
  {
    name: "محمد السيد",
    businessName: "أضواء للإضاءة",
    type: "شركة", 
    specialty: "إضاءة وأضواء",
    experience: 10,
    governorate: "القاهرة",
    city: "مدينة نصر",
    priceRange: { min: 3000, max: 30000 },
    portfolio: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800"
    ],
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    services: ["إضاءة وديكور ضوئي", "تصميم ديكور"],
    materials: ["إضاءة LED", "أضواء ملونة", "ليزر شو"],
    description: "متخصصون في ديكور الإضاءة والأضواء المسرحية، نخلق أجواء ساحرة تناسب حفلات الزفاف.",
    available: true,
    rating: 4.9,
    contact: "01007389996",
    email: "mohamed@lights.com",
    address: "حي مدينة نصر، القاهرة",
    socialMedia: {
      instagram: "@lights_decoration"
    },
    decorationSpecific: {
      designTime: 10,
      executionTime: 2,
      teamSize: 6,
      providesMaterials: true
    },
    styles: ["حديث", "عصري", "ملون"]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://tallaey445_db_user:KSFUyc7tmkHQnsEb@cluster0.pxplox6.mongodb.net/?appName=Cluster0");
    
    await Decoration.deleteMany({});
    console.log('🗑️ Old decorations data cleared');
    
    await Decoration.insertMany(sampleDecorators);
    console.log('✅ Database seeded successfully with decorators');
    
    const count = await Decoration.countDocuments();
    const specialties = await Decoration.distinct('specialty');
    console.log(`📊 Total decorators in database: ${count}`);
    console.log(`🎯 Specialties: ${specialties.join(', ')}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();