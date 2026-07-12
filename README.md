# 🛒 VemiroNest E-Commerce Platform

A modern **Full-Stack E-Commerce Web Application** that provides a seamless shopping experience, complete with product management, shopping cart, secure payments, and order tracking.

---

## ✨ Features

- **🛍️ Comprehensive Product Catalog** — Browse and search through various products.
- **🔐 Secure Authentication** — User registration and login using JWT and Bcrypt.
- **🛒 Shopping Cart** — Add, remove, and update quantities of items.
- **💳 Payment Integration** — Secure transactions using Safepay.
- **📦 Order Management** — Track order history and status.
- **☁️ Cloud Storage** — Cloudinary integration for product image hosting.
- **📧 Email Notifications** — Nodemailer for order updates and communication.
- **📱 Responsive Interface** — Modern React frontend with Bootstrap and Framer Motion animations.

---

## 💻 Tech Stack

- **Frontend:** React, Redux Toolkit, React Router DOM, Bootstrap, Framer Motion
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **Payments:** Safepay (@sfpy/node-sdk)
- **Cloud Storage:** Cloudinary
- **Email Services:** Nodemailer

---

## 📂 Project Structure

```
VemiroNest/
│
├── frontend/             # React Frontend Application
├── backend/              # Node.js Express Backend API
├── package.json          # Root configuration for concurrently
└── README.md
```

| Folder | Description |
|--------|-------------|
| `frontend/` | React User Interface |
| `backend/` | Node.js/Express Backend API |

---

## 🚀 How to Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/mythical-invader/VemiroNest.git
cd VemiroNest
```

### 2. Install Dependencies

Install dependencies for both frontend and backend from the root directory:

```bash
npm run install-all
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
SAFEPAY_ENVIRONMENT=sandbox
SAFEPAY_API_KEY=<your-safepay-api-key>
SAFEPAY_API_SECRET=<your-safepay-secret-key>
SAFEPAY_WEBHOOK_SECRET=<your-safepay-webhook-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
EMAIL_USER=<your-email-address>
EMAIL_PASS=<your-email-password>
```

---

### 4. Database Seeding (Optional)

To populate the database with initial data:

```bash
npm run seed
```

---

### 5. Start the Application

Run both frontend and backend concurrently:

```bash
npm run dev
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000` (or as configured)

---

## 🚧 Future Improvements

- Admin Dashboard for inventory management
- Wishlist functionality
- Real-time order tracking
- Multiple payment gateways (Stripe, PayPal)
- OAuth Login (Google, GitHub)

---

## ⭐ Support

If you found this project useful, consider giving it a **Star ⭐** on GitHub.
