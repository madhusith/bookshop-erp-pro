const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/* ================= DATABASE SETUP ================= */

// Store database in user's home directory so it persists
const dbDir = process.env.APPDATA
  || (process.platform === 'darwin'
    ? path.join(process.env.HOME, 'Library', 'Application Support', 'TNBookStoreERP')
    : path.join(process.env.HOME, '.tnbookstoreerp'));

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'bookshop.db');
console.log('📂 Database path:', dbPath);

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create tables if they don't exist ──
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cashier',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT,
    buy_price REAL DEFAULT 0,
    sell_price REAL NOT NULL,
    quantity INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE NOT NULL,
    customer_name TEXT DEFAULT 'Walk-in Customer',
    total_amount REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    book_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
  );

  CREATE TABLE IF NOT EXISTS returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_number TEXT UNIQUE,
    original_invoice TEXT,
    customer_name TEXT,
    total_refund REAL DEFAULT 0,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS return_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    return_id INTEGER,
    book_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (return_id) REFERENCES returns(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
  );
`);

// ── Create default admin if no users exist ──
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin User', 'admin@bookshop.com', 'admin123', 'admin')
  `).run();
  console.log('✅ Default admin created: admin@bookshop.com / admin123');
}

console.log('✅ SQLite Database ready at:', dbPath);

/* ================= TEST ================= */

app.get('/test', (req, res) => {
  res.json({ message: "Server is working!" });
});

/* ================= BOOKS ================= */

app.get('/api/books', (req, res) => {
  try {
    const { search } = req.query;
    let rows;
    if (search) {
      const term = `%${search}%`;
      rows = db.prepare(`
        SELECT * FROM books
        WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?
      `).all(term, term, term);
    } else {
      rows = db.prepare('SELECT * FROM books').all();
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get('/api/books/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: "Book not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

app.post('/api/books', (req, res) => {
  try {
    const { title, author, isbn, buy_price, sell_price, quantity } = req.body;
    const result = db.prepare(`
      INSERT INTO books (title, author, isbn, buy_price, sell_price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, author, isbn, buy_price || 0, sell_price, quantity || 0);
    res.json({ message: "Book added successfully", bookId: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add book" });
  }
});

app.put('/api/books/:id', (req, res) => {
  try {
    const { title, author, isbn, buy_price, sell_price, quantity } = req.body;
    const result = db.prepare(`
      UPDATE books SET title=?, author=?, isbn=?, buy_price=?, sell_price=?, quantity=?
      WHERE id=?
    `).run(title, author, isbn, buy_price, sell_price, quantity, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update book" });
  }
});

app.delete('/api/books/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM sale_items WHERE book_id = ?').run(req.params.id);
    db.prepare('DELETE FROM return_items WHERE book_id = ?').run(req.params.id);
    const result = db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

/* ================= DASHBOARD ================= */

app.get('/api/dashboard/summary', (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const todaySales = db.prepare(`
      SELECT COUNT(*) as bills, COALESCE(SUM(total_amount), 0) as revenue
      FROM sales WHERE date(created_at) = ?
    `).get(today);

    const booksSold = db.prepare(`
      SELECT COALESCE(SUM(quantity), 0) as books_sold FROM sale_items
    `).get();

    const inventory = db.prepare(`
      SELECT COUNT(*) as total_items, COALESCE(SUM(quantity), 0) as total_stock FROM books
    `).get();

    const lowStock = db.prepare(`
      SELECT COUNT(*) as low_stock FROM books WHERE quantity < 10
    `).get();

    const totalStockValue = db.prepare(`
      SELECT COALESCE(SUM(sell_price * quantity), 0) as value FROM books
    `).get();

    res.json({
      today: {
        bills: todaySales.bills,
        revenue: todaySales.revenue,
        books_sold: booksSold.books_sold
      },
      inventory: {
        total_items: inventory.total_items,
        total_stock: inventory.total_stock,
        low_stock: lowStock.low_stock,
        total_stock_value: totalStockValue.value
      }
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard error" });
  }
});

/* ================= INVOICE ================= */

app.get('/api/invoice/:invoice', (req, res) => {
  try {
    const sale = db.prepare(`
      SELECT invoice_number, customer_name, total_amount, created_at
      FROM sales WHERE invoice_number = ?
    `).get(req.params.invoice);

    if (!sale) return res.status(404).json({ error: 'Invoice not found' });

    const items = db.prepare(`
      SELECT b.title, si.quantity, si.price
      FROM sale_items si
      JOIN books b ON b.id = si.book_id
      WHERE si.sale_id = (SELECT id FROM sales WHERE invoice_number = ?)
    `).all(req.params.invoice);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = Number(sale.total_amount);
    const discount_amount = parseFloat((subtotal - total).toFixed(2));
    const discount_pct = subtotal > 0 ? parseFloat(((discount_amount / subtotal) * 100).toFixed(2)) : 0;

    res.json({
      sale,
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount_amount,
      discount_pct,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invoice error" });
  }
});

/* ================= SALES ================= */

app.post('/api/sales', (req, res) => {
  try {
    console.log("💰 Creating new sale...");
    const { items, customer_name, discount_pct } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ error: "Cart empty" });

    const invoice = "INV" + Date.now();
    let total = 0;

    const createSale = db.transaction(() => {
      const saleResult = db.prepare(`
        INSERT INTO sales (invoice_number, customer_name, total_amount)
        VALUES (?, ?, 0)
      `).run(invoice, customer_name || "Walk-in Customer");

      const saleId = saleResult.lastInsertRowid;

      for (const item of items) {
        const book = db.prepare('SELECT sell_price FROM books WHERE id = ?').get(item.book_id);
        if (!book) throw new Error(`Book with id ${item.book_id} not found`);

        const price = book.sell_price;
        total += price * item.quantity;

        db.prepare(`
          INSERT INTO sale_items (sale_id, book_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `).run(saleId, item.book_id, item.quantity, price);

        db.prepare('UPDATE books SET quantity = quantity - ? WHERE id = ?')
          .run(item.quantity, item.book_id);
      }

      const discount = parseFloat(discount_pct) || 0;
      total = parseFloat((total - (total * discount / 100)).toFixed(2));

      db.prepare('UPDATE sales SET total_amount = ? WHERE id = ?').run(total, saleId);
    });

    createSale();

    console.log(`✅ Sale created: ${invoice}`);
    res.json({ success: true, invoice, total });
  } catch (err) {
    console.error("❌ Sale failed:", err);
    res.status(500).json({ error: "Sale failed: " + err.message });
  }
});

app.get('/api/sales', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, invoice_number, customer_name, total_amount, created_at
      FROM sales ORDER BY created_at DESC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

app.get('/api/sales/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM sales WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: "Sale not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sale" });
  }
});

/* ================= USERS / AUTH ================= */

app.post("/api/register", (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing)
      return res.status(400).json({ error: "User already exists with this email" });

    const result = db.prepare(`
      INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)
    `).run(email, password, name, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.lastInsertRowid,
      user: { id: result.lastInsertRowid, email, name, role }
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    if (!user) {
      const emailExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (emailExists) return res.status(401).json({ error: "Invalid password" });
      return res.status(401).json({ error: "No account found with this email" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/user/:id", (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/api/users", (req, res) => {
  try {
    const users = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY id DESC').all();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.delete("/api/user/:id", (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.put("/api/user/:id", (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let updateFields = [];
    let updateValues = [];

    if (name)     { updateFields.push("name = ?");     updateValues.push(name); }
    if (email)    { updateFields.push("email = ?");    updateValues.push(email); }
    if (role)     { updateFields.push("role = ?");     updateValues.push(role); }
    if (password) { updateFields.push("password = ?"); updateValues.push(password); }

    if (updateFields.length === 0)
      return res.status(400).json({ error: "No fields to update" });

    updateValues.push(req.params.id);
    db.prepare(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`).run(...updateValues);

    const updated = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: "User updated successfully", user: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.put('/api/user/:id/password', (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(password, req.params.id);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

/* ================= BACKUP ================= */

app.get('/api/backup', (req, res) => {
  try {
    const backupPath = path.join(dbDir, `backup_${Date.now()}.db`);
    fs.copyFileSync(dbPath, backupPath);
    res.download(backupPath, `bookshop-backup-${new Date().toISOString().slice(0,10)}.db`, () => {
      fs.unlinkSync(backupPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backup failed" });
  }
});

/* ================= RETURNS ================= */

app.get('/api/returns/invoice/:invoice', (req, res) => {
  try {
    const sale = db.prepare('SELECT * FROM sales WHERE invoice_number = ?').get(req.params.invoice);
    if (!sale) return res.status(404).json({ error: 'Invoice not found' });

    const items = db.prepare(`
      SELECT si.*, b.title, b.author
      FROM sale_items si
      JOIN books b ON b.id = si.book_id
      WHERE si.sale_id = ?
    `).all(sale.id);

    res.json({ sale, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/returns', (req, res) => {
  try {
    const { original_invoice, items, reason, customer_name } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ error: 'No items to return' });

    const return_number = 'RET' + Date.now();
    let total_refund = 0;

    const processReturn = db.transaction(() => {
      const returnResult = db.prepare(`
        INSERT INTO returns (return_number, original_invoice, customer_name, reason, total_refund)
        VALUES (?, ?, ?, ?, 0)
      `).run(return_number, original_invoice, customer_name, reason || 'No reason given');

      const returnId = returnResult.lastInsertRowid;

      for (const item of items) {
        total_refund += item.price * item.quantity;
        db.prepare(`
          INSERT INTO return_items (return_id, book_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `).run(returnId, item.book_id, item.quantity, item.price);
        db.prepare('UPDATE books SET quantity = quantity + ? WHERE id = ?')
          .run(item.quantity, item.book_id);
      }

      db.prepare('UPDATE returns SET total_refund = ? WHERE id = ?').run(total_refund, returnId);
    });

    processReturn();
    res.json({ success: true, return_number, total_refund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/returns', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM returns ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= REPORTS ================= */

app.get('/api/reports/profit', (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const row = db.prepare(`
      SELECT
        COALESCE(SUM(si.quantity * si.price), 0) AS revenue,
        COALESCE(SUM(si.quantity * b.buy_price), 0) AS cost
      FROM sales s
      JOIN sale_items si ON si.sale_id = s.id
      JOIN books b ON b.id = si.book_id
      WHERE date(s.created_at) = ?
    `).get(today);

    const revenue = Number(row.revenue);
    const cost = Number(row.cost);
    res.json({ revenue, cost, profit: revenue - cost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/top-books', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const rows = db.prepare(`
      SELECT b.title, b.author,
        SUM(si.quantity) AS total_sold,
        SUM(si.quantity * si.price) AS revenue
      FROM sale_items si
      JOIN books b ON b.id = si.book_id
      GROUP BY b.id, b.title, b.author
      ORDER BY total_sold DESC
      LIMIT ?
    `).all(limit);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/sales-trend', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        date(created_at) AS date,
        COUNT(*) AS bills,
        COALESCE(SUM(total_amount), 0) AS revenue
      FROM sales
      WHERE date(created_at) >= date('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= SERVER ================= */

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`${'='.repeat(50)}\n`);
});