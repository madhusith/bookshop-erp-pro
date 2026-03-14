# 🚀 QUICK START GUIDE

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ MySQL 8+ installed and running
- ✅ Terminal/Command prompt

## 3-Step Installation

### Step 1️⃣: Setup Database (2 minutes)

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the database setup:
```sql
source /path/to/database.sql
```

OR manually:
- Open `database.sql` file
- Copy and paste all SQL into MySQL
- Execute

**Verify:**
```sql
USE bookshop_db;
SELECT COUNT(*) FROM books;  -- Should show 15 books
```

### Step 2️⃣: Start Backend (1 minute)

```bash
cd backend
npm install
node server.js
```

**You should see:**
```
✅ Connected to MySQL Database
🚀 Server running on port 5050
📡 API: http://localhost:5050
```

### Step 3️⃣: Start Frontend (1 minute)

Open a NEW terminal:

```bash
cd frontend
npm install
npm run dev
```

**Browser will auto-open to:**
```
http://localhost:5173
```

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5050
- [ ] Frontend running on http://localhost:5173
- [ ] Can see 15 books in the inventory
- [ ] Can add books to cart
- [ ] Can create invoice
- [ ] Dashboard shows stats
- [ ] Search works

## 🎯 Test It Out

1. **Go to Billing** (default page)
2. **Search** for "Harry Potter"
3. **Click "Add"** to add to cart
4. **Click "Create Invoice"** or press **Ctrl+Enter**
5. **See success modal** with invoice number
6. **Click "Print Invoice"** to see printable version

## 🐛 Common Issues

### "Database connection failed"
- Check MySQL is running: `mysql -u root -p`
- Verify password in `backend/server.js` line 11
- Create database: `CREATE DATABASE bookshop_db;`

### "Port 5050 already in use"
- Kill process: `lsof -ti:5050 | xargs kill -9` (Mac/Linux)
- Or change port in `server.js` line 183

### "Cannot GET /api/books"
- Backend not running
- Check terminal for errors
- Try: `curl http://localhost:5050/api/books`

### "CORS Error"
- Ensure backend is running BEFORE frontend
- Check both terminals are active

## 📱 Features to Try

1. **Search** - Type "1984" in search bar
2. **Add to Cart** - Click green "Add" button
3. **Adjust Quantity** - Use +/- buttons in cart
4. **Create Invoice** - Ctrl+Enter or click button
5. **View Dashboard** - Click "Dashboard" in sidebar
6. **Manage Inventory** - Click "Inventory", try adding/editing books
7. **View Reports** - Click "Reports" to see analytics
8. **Stock Indicators** - Notice color-coded badges (green/yellow/red)

## 🎨 Customization

### Change Theme Colors
Edit `frontend/src/styles/App.css`:
```css
:root {
  --primary: #3b82f6;  /* Blue */
  --success: #22c55e;  /* Green */
  /* Change to your brand colors */
}
```

### Change Database Credentials
Edit `backend/server.js`:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // Your MySQL user
  password: 'yourpass',   // Your MySQL password
  database: 'bookshop_db'
});
```

### Change Ports
Backend: `backend/server.js` line 183
Frontend: `frontend/vite.config.js` line 5

## 🎓 Next Steps

1. Read full `README.md` for detailed documentation
2. Check `COMPARISON.md` to see all improvements
3. Explore the code - it's well-commented!
4. Add your own features
5. Deploy to production

## 💡 Pro Tips

- Press **Ctrl+Enter** in billing to quickly create invoices
- Use **search** to filter inventory instantly
- Check **Dashboard** for daily insights
- **Low stock** items are highlighted in yellow
- **Out of stock** items are grayed out
- **Toast notifications** appear bottom-right
- **Click invoice numbers** in reports to view details

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check terminal for backend errors
3. Verify all 3 steps completed
4. Ensure MySQL database exists
5. Try restarting both servers

## 🎉 You're All Set!

Your professional Bookshop ERP is now running!

**Default Login:** No authentication (add it later!)
**Test Data:** 15 sample books included
**Ready for:** Production deployment

---

**Happy Selling! 📚🚀**
