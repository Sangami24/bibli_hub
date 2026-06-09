# 📚 Bibli Hub

### Give a Book. Get a Book. Share Knowledge.

Bibli Hub is a community-driven book exchange platform built to encourage book reuse and make learning resources more accessible. Instead of letting books sit unused on shelves, users can donate them to the platform, earn points, and use those points to request books donated by others.

The goal is simple: create a sustainable cycle where books keep moving from one reader to the next.

---

## 🌟 Why Bibli Hub?

Many students and readers own books they no longer need, while others struggle to afford the books they want. Bibli Hub bridges that gap by creating a point-based exchange system that rewards donations and encourages sharing.

By promoting book circulation rather than repeated purchases, the platform also contributes to reducing waste and supporting sustainable reading habits.

---

## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Secure password hashing using bcrypt
* Forgot Password & Reset Password functionality
* Google OAuth login support

### 📖 Book Exchange System

* Donate books and earn reward points
* Browse books contributed by the community
* Claim available books using earned points
* Track donation and claim history

### 👤 User Dashboard

* View profile information
* Monitor available points
* Manage donated and claimed books
* Update personal details and address information

### 🚚 Book Collection Process

* Users schedule book donations through the platform
* Donated books are collected through doorstep pickup
* Points are credited after successful donation verification

### 📱 Responsive Interface

* Mobile-friendly design
* Optimized for tablets and desktops
* Simple and intuitive user experience

---

## 🛠 Tech Stack

| Category       | Technology               |
| -------------- | ------------------------ |
| Frontend       | React + Vite             |
| Backend        | Node.js + Express.js     |
| Database       | SQLite                   |
| Authentication | JWT, bcrypt              |
| OAuth          | Google Identity Services |
| Email Service  | Twilio SendGrid          |
| Styling        | CSS                      |

---

## 📂 Project Structure

```text
Bibli-Hub
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── services
│   └── package.json
│
├── server
│   ├── db
│   ├── middleware
│   ├── routes
│   ├── services
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before running the project locally, make sure you have:

* Node.js (v18 or higher)
* npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd Bibli-Hub
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

---

### Running the Application

Start the backend server:

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:3001
```

Start the frontend:

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## ⚙️ Environment Configuration

### Google OAuth

Create OAuth credentials in Google Cloud Console and add:

```env
GOOGLE_CLIENT_ID=your_google_client_id
```

### SendGrid

Configure email services using:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email
```

If SendGrid is not configured, password reset tokens are logged to the server console for testing purposes.


---

## 👨‍💻 Developed By

Achal Sangami

Built as a full-stack web application to demonstrate authentication, database management, REST API development, and responsive frontend design while promoting sustainable book sharing.

---

*"A book shared is knowledge multiplied."* 📚
