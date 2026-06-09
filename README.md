# 📚 Bibli Hub — Book Exchange Platform

> Give a book. Get a book. Change a life.

Bibli Hub is a web platform where users can donate books, earn points, and use those points to claim other donated books. It promotes book reuse and sustainability.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **npm** (comes with Node.js)

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start the Server

```bash
cd server
npm run dev
```

The API will run on `http://localhost:3001`.

### 3. Start the Client

In a new terminal:

```bash
cd client
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 🔐 Optional Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Google Identity Services** API
4. Create OAuth 2.0 credentials → Web Application
5. Add `http://localhost:5173` to Authorized JavaScript origins
6. Copy the **Client ID** and add to `server/.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   ```

### Twilio SendGrid (Password Reset Emails)
1. Sign up at [SendGrid](https://app.sendgrid.com/)
2. Create an API key
3. Add to `server/.env`:
   ```
   SENDGRID_API_KEY=your_api_key_here
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

> **Note:** Without SendGrid configured, password reset tokens are logged to the server console instead.

---

## 📁 Project Structure

```
Bibli Hub/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth state management
│   │   └── services/    # API client
│   └── ...
├── server/              # Express.js backend
│   ├── db/              # SQLite database
│   ├── middleware/       # JWT auth
│   ├── routes/          # API routes
│   └── services/        # Email service
└── README.md
```

---

## ⭐ Features

- **User Authentication** — Register, Login, Forgot/Reset Password
- **Google Sign-In** — One-click login with Google
- **Book Donation** — Donate books and earn 10 points each
- **Book Claiming** — Browse and claim books using points
- **Doorstep Pickup** — Books picked up within 3-5 business days
- **User Dashboard** — Track donations, orders, and points
- **Profile Management** — Edit address and personal info
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Vanilla CSS |
| Backend | Express.js |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcrypt |
| Email | Twilio SendGrid |

---

Made with ❤️ for a greener planet 🌱
