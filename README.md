# 📚 Bibli Hub

### A Community-Powered Book Exchange Platform

**Live Demo:** [https://bibli-hub.vercel.app/]








https://github.com/user-attachments/assets/58d1ee8b-1022-43cb-ab5a-28c480acb669









---

## About the Project

Bibli Hub was created to encourage book sharing and reduce unnecessary purchases of books that are often used only once. The platform allows users to donate books they no longer need, earn points for their contributions, and use those points to request books donated by other members of the community.

Instead of buying and selling books, Bibli Hub focuses on creating a simple exchange system that keeps books circulating among readers while promoting sustainable resource sharing.

This project was developed as a full-stack web application to gain hands-on experience with authentication, database management, REST APIs, and modern frontend development.

---

## Key Features

### User Authentication

* Secure user registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Google OAuth login integration
* Password reset functionality via email

### Book Exchange System

* Donate books and earn reward points
* Browse books donated by other users
* Claim books using accumulated points
* Simple point-based exchange model

### User Dashboard

* View donated and claimed books
* Track available points
* Monitor activity and savings
* Manage personal profile information

### Database & Storage

* Cloud-hosted Turso database
* Persistent storage for users and books
* Fast database access using LibSQL

### Responsive User Interface

* Mobile-friendly design
* Optimized layouts for tablets and desktops
* Clean and straightforward user experience

---

## Tech Stack

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Frontend       | React, Vite, React Router DOM |
| Backend        | Node.js, Express.js           |
| Database       | Turso (LibSQL)                |
| Authentication | JWT, bcrypt, Google OAuth     |
| Email Services | Twilio SendGrid               |
| Styling        | Vanilla CSS                   |

---

## Running the Project Locally

### Prerequisites

* Node.js 18 or later
* npm

### Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=3001
JWT_SECRET=your_secret_key

TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
```

### Start the Backend

```bash
cd server
npm run dev
```

### Start the Frontend

Open a second terminal window:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## Project Structure

```text
Bibli-Hub
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── services
│
├── server
│   ├── db
│   ├── middleware
│   ├── routes
│   └── services
│
└── README.md
```

---


## Developer

**Achal Sangami**


This project was built to explore modern web development concepts while addressing a simple real-world problem: making books more accessible through community sharing.

> "A book shared is knowledge multiplied."
