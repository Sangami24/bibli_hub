# 📚 Bibli Hub — Book Exchange Platform

> **Live Demo:** [Link to Vercel here] 
> *(Note: Replace the link above with your live Vercel URL once deployed)*

> **Demo Video:** 
> https://github.com/user-attachments/assets/2435f78b-2259-4263-8495-3cbab8ff3165

Bibli Hub is a community-driven full-stack web platform where users can donate books, earn points, and use those points to claim other donated books. It promotes book reuse and sustainability within communities.

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

```text
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
## 👨‍💻 Developed By

**Achal Sangami**

Built as a full-stack web application to demonstrate authentication, database management, REST API development, and responsive frontend design while promoting sustainable book sharing.

*"A book shared is knowledge multiplied."* 📚
Made with ❤️ for a greener planet 🌱
