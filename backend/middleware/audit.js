const AuditLog = require('../models/AuditLog');

const createAuditLog = async ({
  userId,
  action,
  resourceType,
  resourceId,
  description,
  ipAddress,
  userAgent,
  status = 'success',
  metadata = {}
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceType,
      resourceId,
      description,
      ipAddress,
      userAgent,
      status,
      metadata
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
    // Don't throw error - audit logging should not break main functionality
  }
};

const auditMiddleware = (action, resourceType) => {
  return async (req, res, next) => {
    // Store original JSON method
    const originalJson = res.json.bind(res);

    // Override JSON response
    res.json = async function(data) {
      // Determine status based on response
      const status = res.statusCode >= 200 && res.statusCode < 400 ? 'success' : 'failure';

      // Create audit log after response
      if (req.user) {
        await createAuditLog({
          userId: req.user._id,
          action,
          resourceType,
          resourceId: req.params.id || data._id || null,
          description: `${action} ${resourceType}`,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          status,
          metadata: {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode
          }
        });
      }

      return originalJson(data);
    };

    next();
  };
};

module.exports = { createAuditLog, auditMiddleware };

