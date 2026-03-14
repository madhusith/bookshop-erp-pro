# 📚 Bookshop ERP Pro v2.0

A **professional-grade** Enterprise Resource Planning (ERP) system designed specifically for bookshops. Built with modern technologies and best practices for production-ready deployment.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎯 Core Features
- **Point of Sale (POS)** - Fast and intuitive billing interface
- **Inventory Management** - Complete CRUD operations for books
- **Dashboard Analytics** - Real-time business insights
- **Reports & Analytics** - Sales trends, profit analysis, top sellers
- **Invoice System** - Generate and print professional invoices
- **Real-time Search** - Instant search across all books

### 💎 Professional Highlights
- ✅ **Component Architecture** - Modular, reusable React components
- ✅ **State Management** - Efficient cart and inventory handling
- ✅ **Error Handling** - Comprehensive error catching and user feedback
- ✅ **Loading States** - Professional loading indicators
- ✅ **Toast Notifications** - Beautiful non-blocking notifications
- ✅ **Stock Validation** - Prevent over-selling with real-time checks
- ✅ **Keyboard Shortcuts** - Power user features (Ctrl+Enter for invoice)
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Database Transactions** - ACID-compliant sales processing
- ✅ **Connection Pooling** - Optimized database performance
- ✅ **Modern UI/UX** - Dark theme with smooth animations

## 🚀 Technology Stack

### Frontend
- **React 19.2** - Modern UI library
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with CSS variables
- **Fetch API** - Modern HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2** - Web framework
- **MySQL** - Relational database
- **mysql2** - Promise-based MySQL driver

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MySQL 8+ installed and running
- Terminal/Command Line access

### Step 1: Database Setup

```sql
-- Create database
CREATE DATABASE bookshop_db;
USE bookshop_db;

-- Books table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    buy_price DECIMAL(10, 2) DEFAULT 0,
    sell_price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT DEFAULT 1,
    customer_name VARCHAR(255) DEFAULT 'Walk-in Customer',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale items table
CREATE TABLE sale_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT
);

-- Insert sample data
INSERT INTO books (title, author, isbn, buy_price, sell_price, quantity) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 250, 450, 25),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 280, 520, 18),
('1984', 'George Orwell', '9780451524935', 300, 550, 30),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 220, 420, 22),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 270, 490, 15),
('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', '9780439708180', 350, 650, 40),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 320, 590, 28),
('Fahrenheit 451', 'Ray Bradbury', '9781451673319', 260, 480, 20);
```

### Step 2: Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend will run on `http://localhost:5050`

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will open automatically at `http://localhost:5173`

## 📖 Usage Guide

### Billing Module
1. Navigate to **Billing** from sidebar
2. Search for books using the search bar
3. Click **Add** to add books to cart
4. Adjust quantities using +/- buttons
5. Optional: Enter customer name
6. Click **Create Invoice** or press **Ctrl+Enter**
7. Invoice modal appears with print option

### Inventory Management
1. Navigate to **Inventory** from sidebar
2. View all books in table format
3. Click **Add New Book** to add inventory
4. Click **Edit** (✏️) to update book details
5. Click **Delete** (🗑️) to remove books
6. Use search to filter books

### Dashboard
1. Navigate to **Dashboard** from sidebar
2. View today's sales, revenue, books sold
3. Check inventory stats and low stock alerts
4. Quick actions for common tasks

### Reports
1. Navigate to **Reports** from sidebar
2. View profit analysis (revenue, cost, profit)
3. Check top-selling books
4. Analyze sales trends over last 7 days
5. Export reports (future feature)

## 🎨 What Makes This Professional?

### Code Quality
- **Component Separation** - Each feature is its own component
- **Error Boundaries** - Graceful error handling
- **Loading States** - User always knows what's happening
- **Validation** - Stock checks, empty cart prevention
- **Debounced Search** - Optimized API calls

### User Experience
- **Instant Feedback** - Toast notifications for all actions
- **Keyboard Shortcuts** - Faster workflow
- **Search & Filter** - Find anything instantly
- **Stock Indicators** - Visual cues for inventory levels
- **Smooth Animations** - Professional feel
- **Responsive** - Works on mobile, tablet, desktop

### Backend Architecture
- **Connection Pooling** - Better performance
- **Database Transactions** - Data integrity
- **Error Handling** - Proper HTTP status codes
- **RESTful API** - Standard conventions
- **Async/Await** - Modern JavaScript
- **SQL Injection Prevention** - Parameterized queries

### Business Features
- **Multi-step Sales Process** - Stock check → Create sale → Update inventory
- **Invoice Generation** - Unique invoice numbers
- **Customer Tracking** - Optional customer names
- **Profit Analytics** - Revenue vs cost analysis
- **Inventory Alerts** - Low stock warnings
- **Sales Trends** - Historical data analysis

## 🔧 Configuration

### Backend Configuration
Edit `backend/server.js` to change:
- Database credentials
- Server port (default: 5050)
- CORS settings

### Frontend Configuration
Edit `frontend/vite.config.js` to change:
- Dev server port (default: 5173)
- API endpoint URLs in component files

## 📊 API Endpoints

### Books
- `GET /api/books` - Get all books (optional ?search param)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Sales
- `POST /api/sales` - Create new sale
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale details
- `GET /api/invoice/:invoiceNumber` - Get invoice by number

### Analytics
- `GET /api/dashboard/summary` - Dashboard stats
- `GET /api/reports/profit` - Profit analysis
- `GET /api/reports/top-books` - Top selling books
- `GET /api/reports/sales-trend` - 7-day sales trend

## 🎯 Keyboard Shortcuts

- `Ctrl + Enter` - Create invoice (when in billing)
- Type in search - Auto-focuses search bar

## 🐛 Troubleshooting

### Database Connection Failed
- Check MySQL is running
- Verify credentials in server.js
- Ensure database `bookshop_db` exists

### CORS Errors
- Ensure backend is running on port 5050
- Frontend expecting backend at localhost:5050

### Port Already in Use
- Change port in server.js (backend)
- Change port in vite.config.js (frontend)

## 🔮 Future Enhancements

- [ ] User authentication & roles
- [ ] Multi-store support
- [ ] Barcode scanning
- [ ] Email invoices
- [ ] Export to Excel/PDF
- [ ] Dark/Light theme toggle
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Returns & refunds
- [ ] Supplier management

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Built with ❤️ for professional bookshop management

---

**Need help?** Check the code comments or create an issue!

**Love it?** Give it a ⭐ star!
