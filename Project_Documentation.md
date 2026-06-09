# Bibli Hub - Project Architecture & Technical Documentation

## 1. Project Overview
**Bibli Hub** is a full-stack web application designed as a book exchange platform. It allows users to browse, donate, and exchange books with others in their community. The platform features secure user authentication, book cataloging, and a streamlined interface for managing book exchanges.

---

## 2. Technology Stack & Justification

### Frontend Architecture
- **Framework:** React.js (v18)
- **Build Tool:** Vite
- **Routing:** React Router DOM (v6)
- **Styling:** Custom Vanilla CSS
- **Authentication Client:** Google OAuth Provider

**Why this stack?**
* **React & Vite:** Chosen for optimal developer experience and extremely fast Hot Module Replacement (HMR). Vite significantly reduces build times compared to traditional Webpack, making it the industry standard for modern React applications. React's component-based architecture allows for a highly modular and maintainable UI structure.
* **Vanilla CSS:** Opting for pure CSS without bulky UI libraries ensures the application remains lightweight, highly customizable, and demonstrates a deep understanding of core web design principles (Flexbox, Grid, CSS Variables) without relying on abstractions.

### Backend Architecture
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (via `sql.js`)
- **Authentication:** JWT (JSON Web Tokens) & Google Auth Library
- **Security:** `bcryptjs` for password hashing
- **File Handling:** `multer` for image uploads

**Why this stack?**
* **Express.js:** The most mature and widely adopted web framework for Node.js. It provides a robust set of features for web and mobile applications while remaining unopinionated, allowing for a custom folder structure (routes, services, middleware).
* **SQLite:** Chosen as the database layer for its zero-configuration setup. It is a serverless, self-contained database engine, making it incredibly optimal for a portfolio project. It demonstrates relational database concepts (SQL) without the overhead of provisioning a dedicated cloud database instance during early development.
* **JWT & bcrypt:** Implementing stateless authentication with JWT ensures the application can scale horizontally. Passwords are never stored in plaintext, adhering to industry security standards.

---

## 3. Core Features & Implementation Details

### 1. Secure Authentication System
The application supports both traditional Email/Password login and Google OAuth. 
* **Mechanism:** Upon successful verification, the server issues an HTTP-only or client-side JSON Web Token (JWT). This token is then attached to subsequent API requests to verify the user's identity on protected routes.

### 2. Book Catalog & Exchange
* **Mechanism:** Users can upload books they wish to donate. The server uses `multer` to handle the `multipart/form-data` stream for book cover images. The metadata (title, author, condition) is stored relationally in the SQLite database, mapped to the user's ID.

### 3. RESTful API Design
* **Mechanism:** The Express backend is structured using REST principles. Distinct routes (`/api/auth`, `/api/books`, `/api/pickup`) handle specific domains of the application. This separation of concerns makes the codebase scalable and easier to test.

---

## 4. Conclusion
Bibli Hub is structured to mimic real-world enterprise applications, utilizing a separated frontend and backend architecture. The choices made prioritize application speed (Vite), security (JWT/bcrypt), and structural clarity (Express/React), making it a robust, production-ready portfolio piece.
