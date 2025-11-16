import pkg from 'pg';
const { Pool } = pkg;

// إنشاء connection pool لـ PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// اختبار الاتصال
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database (Neon)');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

export const connectDB = async () => {
  try {
    console.log("postgres_uri:", process.env.POSTGRES_URL);
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully!");
    client.release();
  } catch (error) {
    console.error("❌ Error connecting to PostgreSQL:", error.message);
    process.exit(1);
  }
};

export default pool;