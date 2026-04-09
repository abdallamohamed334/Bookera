import pkg from "pg";
const { Pool } = pkg;

// function لإنشاء pool بشكل آمن
const createPool = (connectionString, name) => {
  const pool = new Pool({
    connectionString,
    
    // ✅ مهم جدا في Railway
    ssl: connectionString?.includes("localhost")
      ? false
      : {
          rejectUnauthorized: false,
        },

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  // ✅ log عند الاتصال
  pool
    .connect()
    .then((client) => {
      console.log(`✅ ${name} connected`);
      client.release();
    })
    .catch((err) => {
      console.error(`❌ ${name} connection error:`, err.message);
    });

  // ✅ error handler
  pool.on("error", (err) => {
    console.error(`❌ ${name} pool error:`, err.message);
  });

  return pool;
};

// ✅ Pools
export const photograferDb = createPool(
  process.env.DATABASE_URL_PHOTO,
  "Photographers DB"
);

export const neondbDb = createPool(
  process.env.DATABASE_URL_WHEN,
  "Neon DB"
);

// default export
export default photograferDb;