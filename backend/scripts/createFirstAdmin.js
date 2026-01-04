// createVerifiedAdmin.js
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const MONGO_URI = "mongodb+srv://tallaey445_db_user:KSFUyc7tmkHQnsEb@cluster0.pxplox6.mongodb.net/?appName=Cluster0";

const createVerifiedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    // نحذف الأدمن الحاليين
    await mongoose.connection.db.collection('admins').deleteMany({});
    
    // ننشئ أدمن جديد مفعل
    const adminData = {
      email: "admin@test.com",
      password: await bcryptjs.hash("123456", 10),
      name: "Test Admin",
      role: "superadmin",
      permissions: ["users", "bookings", "venues", "reports", "settings"],
      isVerified: true, // ⬅️ مفعل من البداية
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await mongoose.connection.db.collection('admins').insertOne(adminData);
    
    console.log('✅ تم إنشاء أدمن مفعل جديد!');
    console.log('📧 الإيميل: admin@test.com');
    console.log('🔑 الباسورد: 123456');
    console.log('✅ الحالة: مفعل');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
};

createVerifiedAdmin();