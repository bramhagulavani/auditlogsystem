# Audit Log System

A full-stack audit logging platform built with React, Vite, Node.js, Express, and MongoDB. It provides authenticated access to audit trails, operational stats, and CSV exports.

## Current Project Snapshot

This README is aligned with the current implementation in this repository.

Highlights:
- JWT-based authentication with role-aware authorization
- Audit log listing with pagination and filters
- Stats and chart visualizations powered by Recharts
- CSV export endpoint for audit data
- Refined UI for login, dashboard, and analytics pages

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Recharts
- Backend: Node.js, Express, Mongoose
- Security/Auth: JWT, bcryptjs, helmet, cors
- Logging: morgan (development)
- Database: MongoDB

## Access Model

Supported roles in the user model:
- `admin`
- `auditor`
- `user`

Route access rules:
- `admin`: full access to audit routes including stats
- `auditor`: can read logs and export logs
- `user`: cannot access audit routes, but user auth actions are still logged

## Tracked Actions and Resource Types

Audit action enum:
- `CREATE`
- `READ`
- `UPDATE`
- `DELETE`
- `LOGIN`
- `LOGOUT`
- `EXPORT`
- `IMPORT`

Audit resource type enum:
- `user`
- `audit_log`
- `report`
- `system`
- `config`

## API Endpoints

Base API URL: `http://localhost:5000/api`

Health:
- `GET /api/health`

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `POST /api/auth/logout` (protected)

Audit logs (all protected):
- `GET /api/audit-logs` (`admin`, `auditor`)
- `GET /api/audit-logs/stats` (`admin` only)
- `GET /api/audit-logs/export` (`admin`, `auditor`)
- `GET /api/audit-logs/user/:userId` (`admin`, `auditor`)
- `GET /api/audit-logs/:id` (`admin`, `auditor`)

Common query params:
- List logs: `page`, `limit`, `userId`, `action`, `resourceType`, `status`, `startDate`, `endDate`
- Export logs: `startDate`, `endDate`, `format` (`csv` or `json`, default is `json`)

## Frontend Behavior

- Routes:
  - `/login`
  - `/dashboard` (protected)
  - `/charts` (protected)
- Token and user are stored in `localStorage`
- Axios client automatically attaches `Authorization: Bearer <token>`
- Frontend API base URL is currently hardcoded to `http://localhost:5000/api`

## Project Structure

```text
auditlogsystem/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## Setup and Run

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend (new terminal):

```bash
cd frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start services

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Notes

- The stats endpoint is admin-only; non-admin users will receive authorization errors for that route.
- CSV export endpoint records an `EXPORT` audit log entry.
- A default root `package.json` exists, but active app development is split across `backend` and `frontend` packages.

## Contributors

- Bramha Gulavani (Marco)
- Tanmay
