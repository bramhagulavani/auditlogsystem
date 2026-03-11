const log = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      level: 'info',
      message,
      ...meta
    }));
  },

  error: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.error(JSON.stringify({
      timestamp,
      level: 'error',
      message,
      ...meta
    }));
  },

  warn: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({
      timestamp,
      level: 'warn',
      message,
      ...meta
    }));
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(JSON.stringify({
        timestamp,
        level: 'debug',
        message,
        ...meta
      }));
    }
  }
};

module.exports = log;

