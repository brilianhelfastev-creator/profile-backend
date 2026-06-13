// ============================================
// Database Import Script
// ============================================
// Import profile_db.sql ke database lokal
// Jalankan: node import-db.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const importDatabase = async () => {
  try {
    // Buat koneksi
   const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'profile_db',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
});

    console.log("📝 Membaca file profile_db.sql...\n");

    // Baca file SQL
    const sqlFile = path.join(__dirname, "database", "profile_db.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    console.log("📝 Menjalankan import...\n");

    // Split SQL content dan filter komentar
    const statements = sqlContent
      .split(";")
      .map((sql) => sql.trim())
      .filter(
        (sql) =>
          sql.length > 0 &&
          !sql.startsWith("--") &&
          !sql.startsWith("/*") &&
          !sql.includes("CREATE TABLE"),
      );

    // Jalankan non-CREATE statements
    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err) {
          // Skip jika error, lanjut ke statement berikutnya
          if (!err.message.includes("already exists")) {
            console.warn("⚠️  Warning:", err.message);
          }
        }
      }
    }

    console.log("✅ Database import selesai!\n");
    console.log("✓ Tabel users sudah di-import dengan data:");
    console.log("  - Username: admin");
    console.log("  - Password: admin123\n");

    await connection.end();
  } catch (error) {
    console.error("❌ Import database gagal:", error.message);
    process.exit(1);
  }
};

importDatabase();
