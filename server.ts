import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("restaurant.db");
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'placed',
    payment_status TEXT DEFAULT 'pending',
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    menu_item_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    customizations TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Admin User", "admin@gusto.com", hashedPassword, "admin");
  
  const categories = ["Starters", "Main Course", "Desserts", "Beverages"];
  categories.forEach(cat => db.prepare("INSERT INTO categories (name) VALUES (?)").run(cat));
  
  const items = [
    { cat: 1, name: "Bruschetta", price: 8.99, desc: "Toasted bread with tomatoes and basil" },
    { cat: 2, name: "Truffle Pasta", price: 18.50, desc: "Creamy pasta with black truffle oil" },
    { cat: 3, name: "Tiramisu", price: 7.50, desc: "Classic Italian dessert" },
    { cat: 4, name: "Espresso", price: 3.50, desc: "Strong Italian coffee" }
  ];
  items.forEach(item => {
    db.prepare("INSERT INTO menu_items (category_id, name, price, description) VALUES (?, ?, ?, ?)").run(item.cat, item.name, item.price, item.desc);
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email, role: 'customer' }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'customer' } });
    } catch (err) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/menu", (req, res) => {
    const items = db.prepare(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m 
      JOIN categories c ON m.category_id = c.id
    `).all();
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json({ items, categories });
  });

  app.post("/api/orders", authenticate, (req: any, res) => {
    const { items, totalAmount, address } = req.body;
    const userId = req.user.id;
    
    const transaction = db.transaction(() => {
      const orderResult = db.prepare("INSERT INTO orders (user_id, total_amount, address) VALUES (?, ?, ?)").run(userId, totalAmount, address);
      const orderId = orderResult.lastInsertRowid;
      
      const insertItem = db.prepare("INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)");
      for (const item of items) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ orderId, status: 'placed' });
    } catch (err) {
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  app.get("/api/orders/my", authenticate, (req: any, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(orders);
  });

  // Admin Routes
  app.get("/api/admin/stats", authenticate, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    const totalSales = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'").get() as any;
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get() as any;
    res.json({ totalSales: totalSales.total || 0, totalOrders: totalOrders.count, totalUsers: totalUsers.count });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
