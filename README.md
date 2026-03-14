<div align="center">

# 🛡️ Audit Log System

### A production-grade security dashboard built with the MERN Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> **Every action. Tracked. Secured. Accountable.**  
> A system that records every user action automatically — used in real companies like Stripe, GitHub, and Notion.

</div>

---

## 📸 Screenshots

| Login Page | Dashboard |
|---|---|
| Premium navy/gold split layout with animated background | Full sidebar with stats, charts, filters and log table |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/logout with token-based auth
- 👥 **Role-Based Access** — Admin, Auditor, and User roles
- 📋 **Automatic Logging** — Every action is tracked without extra code
- 📊 **Live Dashboard** — Stats cards, action breakdown with progress bars
- 🔍 **Search & Filter** — Filter by action type, status, and user in real time
- 📄 **Pagination** — Handles large datasets efficiently
- ⬇️ **CSV Export** — Download all logs as a spreadsheet
- 🎨 **Premium UI** — Professional navy/gold design built from scratch

---

## 🏗️ Project Structure

```
auditlogsystem/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── index.js           # Environment config
│   ├── controllers/
│   │   ├── authController.js  # Register, login, logout
│   │   └── auditController.js # Get logs, stats, export
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── audit.js           # Auto-logging middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── AuditLog.js        # Log entry schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   └── auditRoutes.js     # /api/audit-logs/*
│   ├── utils/
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── pages/
        │   ├── Login.jsx        # Login page
        │   └── Dashboard.jsx    # Main dashboard
        ├── services/
        │   └── api.js           # Axios + auto JWT
        └── App.jsx              # Routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB Atlas account (free)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/bramhagulavani/auditlogsystem.git
cd auditlogsystem
```

**2. Setup Backend**
```bash
cd backend
npm install
```

**3. Create your `.env` file inside `/backend`**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

**4. Start the backend**
```bash
npm run dev
```

**5. Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

**6. Open your browser**
```
http://localhost:5173
```

---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| POST | `/api/auth/logout` | Logout and record event | Yes |

### Audit Log Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/audit-logs` | Get all logs with filters | Admin/Auditor |
| GET | `/api/audit-logs/stats` | Get stats and analytics | Admin |
| GET | `/api/audit-logs/export` | Download as CSV | Admin/Auditor |
| GET | `/api/audit-logs/user/:userId` | Get logs by user | Admin/Auditor |
| GET | `/api/audit-logs/:id` | Get single log entry | Admin/Auditor |

### Query Parameters for GET `/api/audit-logs`

```
?page=1&limit=10
?action=LOGIN
?status=success
?userId=abc123
?startDate=2026-01-01&endDate=2026-12-31
```

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access — view, export, stats, manage users |
| **Auditor** | View and export logs only |
| **User** | Standard access — actions are tracked |

---

## 📝 Tracked Actions

| Action | Description |
|--------|-------------|
| `CREATE` | New resource created |
| `LOGIN` | User logged in |
| `LOGOUT` | User logged out |
| `UPDATE` | Resource updated |
| `DELETE` | Resource deleted |
| `EXPORT` | Logs exported |
| `IMPORT` | Data imported |

---

## 🗄️ Database Schema

### AuditLog
```javascript
{
  userId:       ObjectId,   // Reference to User
  action:       String,     // CREATE, LOGIN, LOGOUT...
  resourceType: String,     // user, audit_log, report...
  resourceId:   String,     // ID of affected resource
  description:  String,     // Human readable description
  ipAddress:    String,     // Client IP address
  userAgent:    String,     // Browser/client info
  status:       String,     // success | failure | warning
  metadata:     Object,     // Any extra data
  createdAt:    Date        // Auto timestamp
}
```

### User
```javascript
{
  username:  String,   // Unique username
  email:     String,   // Unique email
  password:  String,   // bcrypt hashed
  role:      String,   // admin | user | auditor
  isActive:  Boolean,  // Account status
  createdAt: Date      // Auto timestamp
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | UI framework |
| Styling | Custom CSS | Premium navy/gold design |
| HTTP Client | Axios | API calls with auto JWT |
| Backend | Node.js + Express | REST API server |
| Database | MongoDB Atlas | Cloud database |
| ODM | Mongoose | Schema + validation |
| Auth | JWT + bcryptjs | Secure authentication |
| Dev Tool | Nodemon | Auto server restart |

---

## 🌍 Real World Usage

This pattern is used by:
- 🏦 **Banks** — Track every transaction and account change
- 🏥 **Hospitals** — Log who accessed patient records
- 🛒 **E-commerce** — Record every order modification
- 💻 **GitHub** — Track every push, merge, and permission change
- 💳 **Stripe** — Log every payment event

---

## 👨‍💻 Built By

**Bramha Gulavani (Marco)** & **Tanmay**  
MERN Stack Developers

---

<div align="center">

⭐ **Star this repo if you found it useful!**

</div>