import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Auth Routes ---
  app.post("/api/auth/register", (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing fields" });
    }
    try {
      const stmt = db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
      const info = stmt.run(username, password, role);
      res.json({ id: info.lastInsertRowid, username, role });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        res.status(400).json({ error: "Username already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ id: user.id, username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // --- Hotel Routes (Public) ---
  app.get("/api/hotels", (req, res) => {
    const { city, keyword, stars, minPrice, maxPrice, sort } = req.query;
    let query = "SELECT * FROM hotels WHERE status = 'published'";
    const params: any[] = [];

    if (city) {
      query += " AND address LIKE ?";
      params.push(`%${city}%`);
    }
    if (keyword) {
      query += " AND (name_cn LIKE ? OR name_en LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (stars) {
      query += " AND stars = ?";
      params.push(stars);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    if (sort === "price_asc") {
      query += " ORDER BY price ASC";
    } else if (sort === "price_desc") {
      query += " ORDER BY price DESC";
    } else {
      query += " ORDER BY id DESC";
    }

    const hotels = db.prepare(query).all(...params);
    res.json(hotels);
  });

  app.get("/api/hotels/:id", (req, res) => {
    const hotel = db.prepare("SELECT * FROM hotels WHERE id = ?").get(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    const roomTypes = db.prepare("SELECT * FROM room_types WHERE hotel_id = ? ORDER BY price ASC").all(req.params.id);
    res.json({ ...hotel, roomTypes });
  });

  // --- Admin/Merchant Routes ---
  app.get("/api/admin/hotels", (req, res) => {
    const { merchant_id } = req.query;
    let query = "SELECT * FROM hotels";
    const params: any[] = [];
    if (merchant_id) {
      query += " WHERE merchant_id = ?";
      params.push(merchant_id);
    }
    query += " ORDER BY id DESC";
    const hotels = db.prepare(query).all(...params);
    res.json(hotels);
  });

  app.post("/api/merchant/hotels", (req, res) => {
    const { merchant_id, name_cn, name_en, address, stars, price, opening_time, facilities, nearby, roomTypes } = req.body;
    try {
      const insertHotel = db.prepare(`
        INSERT INTO hotels (merchant_id, name_cn, name_en, address, stars, price, opening_time, facilities, nearby, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `);
      const info = insertHotel.run(merchant_id, name_cn, name_en, address, stars, price, opening_time, facilities, nearby);
      const hotelId = info.lastInsertRowid;

      if (roomTypes && roomTypes.length > 0) {
        const insertRoom = db.prepare("INSERT INTO room_types (hotel_id, name, price, capacity, description) VALUES (?, ?, ?, ?, ?)");
        const insertMany = db.transaction((rooms) => {
          for (const room of rooms) {
            insertRoom.run(hotelId, room.name, room.price, room.capacity, room.description);
          }
        });
        insertMany(roomTypes);
      }
      res.json({ id: hotelId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/merchant/hotels/:id", (req, res) => {
    const { name_cn, name_en, address, stars, price, opening_time, facilities, nearby, roomTypes } = req.body;
    try {
      db.prepare(`
        UPDATE hotels SET name_cn = ?, name_en = ?, address = ?, stars = ?, price = ?, opening_time = ?, facilities = ?, nearby = ?, status = 'pending'
        WHERE id = ?
      `).run(name_cn, name_en, address, stars, price, opening_time, facilities, nearby, req.params.id);

      // Re-insert room types
      db.prepare("DELETE FROM room_types WHERE hotel_id = ?").run(req.params.id);
      if (roomTypes && roomTypes.length > 0) {
        const insertRoom = db.prepare("INSERT INTO room_types (hotel_id, name, price, capacity, description) VALUES (?, ?, ?, ?, ?)");
        const insertMany = db.transaction((rooms) => {
          for (const room of rooms) {
            insertRoom.run(req.params.id, room.name, room.price, room.capacity, room.description);
          }
        });
        insertMany(roomTypes);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/hotels/:id/status", (req, res) => {
    const { status, reject_reason } = req.body;
    try {
      db.prepare("UPDATE hotels SET status = ?, reject_reason = ? WHERE id = ?").run(status, reject_reason || null, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
