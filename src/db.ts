import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "data.db");
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('merchant', 'admin'))
  );

  CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merchant_id INTEGER NOT NULL,
    name_cn TEXT NOT NULL,
    name_en TEXT,
    address TEXT NOT NULL,
    stars INTEGER NOT NULL,
    price REAL NOT NULL,
    opening_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'published', 'offline', 'rejected')),
    reject_reason TEXT,
    facilities TEXT,
    nearby TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS room_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value REAL NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
  );
`);

// Add columns if they don't exist (for existing databases)
try { db.exec("ALTER TABLE hotels ADD COLUMN facilities TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE hotels ADD COLUMN nearby TEXT;"); } catch (e) {}

// Insert default admin user if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')").run();
}

export default db;
