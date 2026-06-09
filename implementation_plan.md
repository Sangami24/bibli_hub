# Bibli Hub — Book Exchange Platform

A web platform where users can donate books, earn points, and use those points to claim other donated books. Promotes book reuse and sustainability.

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | Vite + React | Fast dev experience, component-based UI |
| **Styling** | Vanilla CSS with CSS variables | Full control, premium design |
| **Backend** | Express.js (Node) | Simple REST API |
| **Database** | SQLite (via `better-sqlite3`) | Zero-config, file-based, perfect for starting out |
| **Auth** | JWT (access + refresh tokens) | Stateless, secure |
| **Google OAuth** | Google Identity Services | One-tap sign-in |
| **Email** | Twilio SendGrid (`@sendgrid/mail`) | Password reset emails |
| **Password Hashing** | `bcrypt` | Industry standard |

---

## User Review Required

> [!IMPORTANT]
> **Google OAuth** requires a Google Cloud project with OAuth2 credentials (Client ID). You'll need to set this up in the [Google Cloud Console](https://console.cloud.google.com/). I'll provide placeholder config and instructions.

> [!IMPORTANT]
> **Twilio SendGrid** requires an API key for sending password reset emails. You'll need a free SendGrid account. I'll set up the code and you just plug in your API key.

> [!WARNING]
> For the initial version, I'll build everything with a **local SQLite database**. This is perfect for development and small-scale use. If you want to deploy to production later, we can migrate to PostgreSQL.

---

## Open Questions

> [!IMPORTANT]
> **Points System**: How many points should a user earn per book donated? And how many points should it cost to claim a book? My suggestion:
> - **Donate a book** → Earn **10 points**
> - **Claim a book** → Costs **10 points**
> This keeps it simple (1:1 exchange). Let me know if you'd prefer a different model.

> [!IMPORTANT]
> **Pickup Timeframe**: You mentioned "picked up in X days." What should the default pickup window be? I'll default to **3-5 business days** unless you specify otherwise.

> [!IMPORTANT]
> **Book Categories**: Should we categorize books (e.g., "Class 10 - Science", "Class 12 - Math", "Fiction", "Non-Fiction")? This would help users browse/search. My suggestion is yes, with categories like:
> - School textbooks (by class/grade)
> - Fiction / Non-Fiction
> - Competitive Exam Prep
> - General Knowledge / Reference

---

## Proposed Changes

### Project Structure

```
Bibli Hub/
├── client/                    # Vite + React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Images, icons
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BookCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Sign up page
│   │   │   ├── ForgotPassword.jsx # Password reset request
│   │   │   ├── ResetPassword.jsx  # Reset with token
│   │   │   ├── WhyExchange.jsx    # Info/mission page
│   │   │   ├── Browse.jsx         # Browse available books
│   │   │   ├── DonateBook.jsx     # Donate a book form
│   │   │   ├── Profile.jsx        # User profile & dashboard
│   │   │   ├── MyDonations.jsx    # Books user has donated
│   │   │   ├── MyOrders.jsx       # Books user has claimed
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── services/
│   │   │   └── api.js             # API client (fetch wrapper)
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css              # Global styles & design system
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express.js backend
│   ├── db/
│   │   ├── schema.sql             # SQLite schema
│   │   └── database.js            # DB connection & helpers
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js                # Login, register, forgot/reset password, Google OAuth
│   │   ├── books.js               # Browse, donate, claim books
│   │   ├── users.js               # Profile, points, order history
│   │   └── pickup.js              # Pickup scheduling & status
│   ├── services/
│   │   └── email.js               # SendGrid email service
│   ├── server.js                  # Express app entry point
│   └── package.json
│
├── .env.example               # Environment variable template
└── README.md
```

---

### Database Schema

#### [NEW] [schema.sql](file:///c:/Users/achal/Documents/Projects/Bibli%20Hub/server/db/schema.sql)

**Users table** — stores accounts (email/password or Google OAuth):
```sql
users (id, email, password_hash, name, phone, address_line1, address_line2, city, state, pincode, google_id, avatar_url, points, created_at)
```

**Books table** — all books in the system:
```sql
books (id, title, author, category, condition, description, cover_image, donated_by, status [available/claimed/picked_up], points_value, created_at)
```

**Donations table** — tracks book donations & pickups:
```sql
donations (id, user_id, book_id, pickup_address, pickup_status [pending/scheduled/picked_up], pickup_date, estimated_pickup, created_at)
```

**Orders table** — tracks book claims:
```sql
orders (id, user_id, book_id, points_spent, delivery_address, delivery_status [processing/shipped/delivered], created_at)
```

**Password Reset Tokens**:
```sql
password_resets (id, user_id, token, expires_at, used)
```

---

### Authentication System

#### [NEW] [auth.js (routes)](file:///c:/Users/achal/Documents/Projects/Bibli%20Hub/server/routes/auth.js)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account (email, password, name) |
| `/api/auth/login` | POST | Login with email/password → returns JWT |
| `/api/auth/google` | POST | Google OAuth token verification → returns JWT |
| `/api/auth/forgot-password` | POST | Sends reset email via SendGrid |
| `/api/auth/reset-password` | POST | Resets password using token from email |
| `/api/auth/me` | GET | Get current user profile (protected) |

---

### Pages & Features

#### Landing Page (`Home.jsx`)
- Hero section with tagline: *"Give a book. Get a book. Change a life."*
- How it works (3-step visual): Donate → Earn Points → Claim Books
- Stats counter (books exchanged, users, trees saved)
- Call-to-action buttons

#### Why Exchange Page (`WhyExchange.jsx`)
- Environmental impact of book waste
- Cost savings for students
- Community building
- Animated infographics

#### Browse Books (`Browse.jsx`)
- Grid of available books with filters (category, grade, condition)
- Search bar
- Book cards showing title, author, condition, points cost
- "Claim" button (deducts points)

#### Donate a Book (`DonateBook.jsx`)
- Form: title, author, category, condition, description, photo upload
- Address for pickup (pre-filled from profile)
- Submission shows: *"Your book will be picked up in 3-5 business days!"*
- Points credited immediately

#### User Profile (`Profile.jsx`)
- Avatar, name, email
- Points balance (prominently displayed)
- Edit profile (address, phone)
- Quick stats (books donated, books claimed)

#### My Donations (`MyDonations.jsx`)
- List of books donated with pickup status
- Status badges: Pending → Scheduled → Picked Up

#### My Orders (`MyOrders.jsx`)
- List of books claimed with delivery status
- Status badges: Processing → Shipped → Delivered

---

### UI/UX Design Vision

- **Color Palette**: Warm earth tones + forest green — evoking books, nature, sustainability
  - Primary: `#2D6A4F` (forest green)
  - Accent: `#D4A373` (warm brown/gold)
  - Background: `#FEFAE0` (cream) / `#1B1B2F` (dark mode)
  - Text: `#2B2D42` (dark charcoal)
- **Typography**: Google Fonts — `Outfit` for headings, `Inter` for body
- **Design Elements**:
  - Glassmorphism cards for book listings
  - Smooth page transitions
  - Micro-animations on hover/click
  - Gradient accents
  - Floating points badge in navbar
  - Animated counter on homepage

---

## Verification Plan

### Manual Verification
1. **Auth flow**: Register → Login → Forgot Password → Reset Password → Google Sign-in
2. **Book donation**: Fill form → See confirmation with pickup timeline → Check dashboard
3. **Book browsing & claiming**: Browse → Filter → Claim → Points deducted → Check orders
4. **Profile management**: Edit details → View donation/order history
5. **Responsive design**: Test on mobile, tablet, desktop viewports
6. **Visual quality**: Verify animations, transitions, and overall premium feel

### Automated Tests
```bash
# Start the backend server
cd server && npm start

# Start the frontend dev server
cd client && npm run dev
```
- Verify all API endpoints return correct responses
- Verify JWT auth middleware blocks unauthorized requests
- Verify points are correctly credited/debited
