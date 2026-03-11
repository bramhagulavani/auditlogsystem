# Audit Log System

A robust audit logging system built with Node.js, Express, and MongoDB. This system provides comprehensive tracking of user actions and system events.

## Features

- User authentication and authorization (JWT)
- Role-based access control (Admin, User, Auditor)
- Comprehensive audit logging
- Searchable and filterable audit logs
- Export functionality (JSON/CSV)
- Statistics and analytics

## Project Structure

```
auditlogsystem/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Application entry point
├── .env.example        # Environment variables template
└── package.json        # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Audit Logs
- `GET /api/audit-logs` - Get all audit logs (Admin/Auditor)
- `GET /api/audit-logs/stats` - Get audit statistics (Admin)
- `GET /api/audit-logs/export` - Export audit logs (Admin/Auditor)
- `GET /api/audit-logs/user/:userId` - Get logs by user (Admin/Auditor)
- `GET /api/audit-logs/:id` - Get single log (Admin/Auditor)

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration

5. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## User Roles

- **Admin**: Full access to all features
- **Auditor**: Can view and export audit logs
- **User**: Standard access

## Audit Actions

- CREATE
- READ
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- EXPORT
- IMPORT

