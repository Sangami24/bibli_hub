# 📚 Bibli Hub — Book Exchange Platform

> **Live Demo:** [Link to Vercel here] 
> *(Note: Replace the link above with your live Vercel URL once deployed)*

> **Demo Video:** [Insert video here by dragging and dropping your MP4 file]

Bibli Hub is a full-stack web platform where users can donate books, earn points, and use those points to claim other donated books. It promotes book reuse and sustainability within communities.

---

## 🚀 Features

- **User Authentication** — Secure login/registration with JWT and bcrypt.
- **Google Sign-In** — One-click OAuth login via Google Identity Services.
- **Book Donation System** — Donate books and earn points instantly.
- **Book Claiming** — Browse and claim books using points instead of money.
- **Cloud Database** — Uses Turso Edge Database for lightning-fast, persistent storage.
- **User Dashboard** — Track donations, orders, points, and money saved.
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, React Router DOM |
| **Styling** | Vanilla CSS (Flexbox/Grid, Custom Properties) |
| **Backend** | Node.js, Express.js |
| **Database** | Turso Cloud Database (LibSQL/SQLite at the edge) |
| **Auth** | JSON Web Tokens (JWT), Google OAuth 2.0 |
| **Email** | Twilio SendGrid (for password resets) |

---

## 💻 Running the Project Locally

### Prerequisites
- Node.js 18+ installed

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `/server` directory and add the following:
```env
PORT=3001
JWT_SECRET=your_super_secret_jwt_key
TURSO_DATABASE_URL=your_turso_db_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 3. Start the Application
Open two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

---

## 📁 Project Structure

```
Bibli Hub/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views
│   │   ├── context/     # Auth state management
│   │   └── services/    # API requests
├── server/              # Node.js/Express backend
│   ├── db/              # Turso Database configuration
│   ├── middleware/       # JWT authentication logic
│   ├── routes/          # RESTful API endpoints
│   └── services/        # Email and Point calculation services
└── README.md
```

---
Made with ❤️ for a greener planet 🌱
