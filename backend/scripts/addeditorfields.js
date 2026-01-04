import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tallaey445_db_user:KSFUyc7tmkHQnsEb@cluster0.pxplox6.mongodb.net/?appName=Cluster0"
    );

    console.log("📡 Connected to MongoDB");

    const db = mongoose.connection.db;

    // Update collection directly (photographers)
    const result = await db.collection("photographers").updateMany(
      {},
      {
        $set: {
          isVideoEditor: false,
          isPhotoEditor: false,
        },
      }
    );

    console.log(`✅ Updated documents: ${result.modifiedCount}`);
    console.log("🎉 Columns added to photographers collection!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
