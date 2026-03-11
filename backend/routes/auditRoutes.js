const express = require('express');
const router = express.Router();
const { 
  getAuditLogs, 
  getAuditLogById, 
  getAuditLogsByUser, 
  getAuditStats,
  exportAuditLogs 
} = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin and Auditor can access audit logs
router.get('/', authorize('admin', 'auditor'), getAuditLogs);
router.get('/stats', authorize('admin'), getAuditStats);
router.get('/export', authorize('admin', 'auditor'), exportAuditLogs);
router.get('/user/:userId', authorize('admin', 'auditor'), getAuditLogsByUser);
router.get('/:id', authorize('admin', 'auditor'), getAuditLogById);

module.exports = router;

