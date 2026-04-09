import pkg from "pg";
const { Pool } = pkg;

// function لإنشاء pool بشكل آمن
const createPool = (connectionString, name) => {
  const pool = new Pool({
    connectionString,

    ssl: connectionString?.includes("localhost")
      ? false
      : {
          rejectUnauthorized: false,
        },

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool
    .connect()
    .then((client) => {
      console.log(`✅ ${name} connected`);
      client.release();
    })
    .catch((err) => {
      console.error(`❌ ${name} connection error:`, err.message);
    });

  pool.on("error", (err) => {
    console.error(`❌ ${name} pool error:`, err.message);
  });

  return pool;
};

// ===============================
// 🔥 TEST CONNECTION STRING (HARD CODED)
// ===============================
const photoDbUrl =
  "postgresql://neondb_owner:npg_aX6CdsESTO2U@ep-wandering-dust-aetw28nj-pooler.c-2.us-east-2.aws.neon.tech/photografer?sslmode=require&channel_binding=require";

const neonDbUrl = process.env.DATABASE_URL_WHEN;

// Pools
export const photograferDb = createPool(photoDbUrl, "Photographers DB");
export const neondbDb = createPool(neonDbUrl, "Neon DB");

export default photograferDb;