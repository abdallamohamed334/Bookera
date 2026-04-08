import pkg from 'pg';
const { Pool } = pkg;

// Pool للمصورين
export const photograferDb = new Pool({
  connectionString: process.env.DATABASE_URL_PHOTO,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Pool للقاعدة العامة
export const neondbDb = new Pool({
  connectionString: process.env.DATABASE_URL_WHEN,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// دالة retry عند startup
const connectWithRetry = async (pool, name) => {
  try {
    await pool.query('SELECT 1');
    console.log(`✅ ${name} Connected Successfully!`);
  } catch (err) {
    console.warn(`⚠ ${name} connection failed, retrying in 5s...`);
    setTimeout(() => connectWithRetry(pool, name), 5000);
  }
};

// اختبار الاتصال عند startup
connectWithRetry(photograferDb, 'Photographers DB');
connectWithRetry(neondbDb, 'NeonDB');

// event handlers
photograferDb.on('error', (err) => console.error('❌ Photographers PostgreSQL pool error:', err));
neondbDb.on('error', (err) => console.error('❌ NeonDB PostgreSQL pool error:', err));

// التصدير الافتراضي
export default photograferDb;