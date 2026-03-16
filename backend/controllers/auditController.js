const AuditLog = require('../models/AuditLog');
const { createAuditLog } = require('../middleware/audit');

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin, Auditor)
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    if (req.query.action) {
      filter.action = req.query.action;
    }
    if (req.query.resourceType) {
      filter.resourceType = req.query.resourceType;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.startDate && req.query.endDate) {
  const end = new Date(req.query.endDate);
  end.setHours(23, 59, 59, 999);
  filter.createdAt = {
    $gte: new Date(req.query.startDate),
    $lte: end
  };
}

    const logs = await AuditLog.find(filter)
      .populate('userId', 'username email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single audit log
// @route   GET /api/audit-logs/:id
// @access  Private (Admin, Auditor)
const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('userId', 'username email role');
    
    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }

    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get audit logs by user
// @route   GET /api/audit-logs/user/:userId
// @access  Private (Admin, Auditor)
const getAuditLogsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find({ userId: req.params.userId })
      .populate('userId', 'username email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments({ userId: req.params.userId });

    res.json({
      logs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get audit log statistics
// @route   GET /api/audit-logs/stats
// @access  Private (Admin)
const getAuditStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Total logs
    const totalLogs = await AuditLog.countDocuments(dateFilter);

    // Action breakdown
    const actionStats = await AuditLog.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    // Resource type breakdown
    const resourceStats = await AuditLog.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } }
    ]);

    // Status breakdown
    const statusStats = await AuditLog.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Daily logs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await AuditLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalLogs,
      actionStats,
      resourceStats,
      statusStats,
      dailyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Export audit logs
// @route   GET /api/audit-logs/export
// @access  Private (Admin, Auditor)
const exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    
    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const logs = await AuditLog.find(filter)
      .populate('userId', 'username email role')
      .sort({ createdAt: -1 });

    // Audit log for export
    await createAuditLog({
      userId: req.user._id,
      action: 'EXPORT',
      resourceType: 'audit_log',
      description: 'Exported audit logs',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { format, count: logs.length }
    });

    if (format === 'csv') {
      // Convert to CSV
      const csvHeader = 'Date,User,Action,Resource Type,Resource ID,Description,IP Address,Status\n';
      const csvData = logs.map(log => 
        `${log.createdAt.toISOString()},${log.userId?.username || 'N/A'},${log.action},${log.resourceType},${log.resourceId || ''},${log.description},${log.ipAddress || ''},${log.status}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
      res.send(csvHeader + csvData);
    } else {
      res.json(logs);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditStats,
  exportAuditLogs
};

