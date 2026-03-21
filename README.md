# Audit Log System

Production-grade MERN audit logging platform with enterprise-focused UI and security-first architecture.

## Overview

This project captures and visualizes user activity across the application lifecycle with searchable logs, analytics, and export capabilities.

Core goals:
- Track every critical user action automatically
- Provide secure access with JWT authentication and role controls
- Offer operational visibility through a premium dashboard and charts

## Latest UI Upgrade (Completed)

The frontend has been fully polished across all 3 React pages while preserving existing behavior.

Updated pages:
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Charts.jsx`

What was improved:
- Full-width content usage on Dashboard and Charts (no wasted right-side space)
- Stronger, premium stat cards with subtle gradient backgrounds
- Larger chart areas to remove squished visualizations
- Better typography hierarchy using Playfair Display + DM Sans
- Refined spacing and responsive layout behavior
- Improved hover states for cards and table rows
- Modern pill-style action badges
- Enhanced sidebar active state treatment
- Login panel rebalanced and visually centered for a premium feel
- Smooth load animations across key UI sections

Theme and behavior preserved:
- Color palette remains Navy `#0a1628` and Gold `#c9a84c`
- Existing app functionality remains intact:
  - filters
  - modal
  - pagination
  - charts
  - export
  - authentication and routing

## Tech Stack

- Frontend: React + Vite
- Styling: Custom CSS (inline page-level styles)
- Charts: Recharts
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- API client: Axios

## Feature Highlights

- JWT authentication and secure session flow
- Role-based access support (admin, auditor, user)
- Automatic audit trail generation
- Dashboard with stats, action breakdown, and interactive table
- Analytics page with line, donut, and bar visualizations
- Real-time search and filter workflows
- CSV export support
- Log detail modal and pagination for large datasets

## Project Structure

```text
auditlogsystem/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── auditController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── audit.js
│   ├── models/
│   │   ├── AuditLog.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auditRoutes.js
│   │   └── authRoutes.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Charts.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 14+
- MongoDB Atlas (or local MongoDB)

### 1) Clone and install

```bash
git clone https://github.com/bramhagulavani/auditlogsystem.git
cd auditlogsystem
```

### 2) Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

### 3) Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## API Summary

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login and return JWT
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout and record event

### Audit Logs

- `GET /api/audit-logs` - Paginated logs with filters
- `GET /api/audit-logs/stats` - Aggregated stats for dashboard/charts
- `GET /api/audit-logs/export` - CSV export
- `GET /api/audit-logs/user/:userId` - Logs by user
- `GET /api/audit-logs/:id` - Single log details

Example query parameters for `GET /api/audit-logs`:

```text
?page=1&limit=10
action=LOGIN
status=success
startDate=2026-01-01&endDate=2026-12-31
```

## Roles

- Admin: full access (logs, stats, export, management flows)
- Auditor: read and export access
- User: standard access with actions tracked

## Tracked Actions

- `CREATE`
- `LOGIN`
- `LOGOUT`
- `UPDATE`
- `DELETE`
- `EXPORT`
- `IMPORT`

## Contributors

- Bramha Gulavani (Marco)
- Tanmay
