import pkg from "pg";
const { Pool } = pkg;

const createPool = (connectionString, name) => {
  if (!connectionString) {
    console.error(`❌ ${name} has NO connection string`);
    return null;
  }

  console.log(`🔗 ${name} URL:`, connectionString.replace(/:.+@/, ":****@"));

  const pool = new Pool({
    connectionString,

    ssl: connectionString.includes("localhost")
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

// ✅ أهم تعديل هنا
const photoDbUrl =
  process.env.DATABASE_URL_PHOTO || process.env.DATABASE_URL;

const neonDbUrl =
  process.env.DATABASE_URL_WHEN || process.env.DATABASE_URL;

// ✅ Pools
export const photograferDb = createPool(photoDbUrl, "Photographers DB");
export const neondbDb = createPool(neonDbUrl, "Neon DB");

export default photograferDb;