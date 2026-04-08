import pkg from 'pg';
const { Pool } = pkg;

// pool ثابت
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_WHEN,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,          // عدد الاتصالات القصوى
  idleTimeoutMillis: 30000,  // يقفل الاتصالات الغير نشطة بعد 30 ثانية
  connectionTimeoutMillis: 2000 // timeout للاتصال
});

// اختبار اتصال عند start
const connectWithRetry = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL Connected Successfully!');
  } catch (err) {
    console.log('⚠ DB connection failed, retrying in 5s...');
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

// event handlers
pool.on('connect', () => console.log('✅ Connected to PostgreSQL database (Neon)'));
pool.on('error', (err) => console.error('❌ PostgreSQL pool error:', err));

export default pool;