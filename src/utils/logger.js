const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const logFiles = {
  error: path.join(logsDirectory, 'error.log'),
  combined: path.join(logsDirectory, 'combined.log'),
  requests: path.join(logsDirectory, 'requests.log')
};

Object.values(logFiles).forEach((file) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '');
  }
});

const writeLog = (filePath, payload) => {
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`, 'utf8');
};

const createEntry = (level, message, metadata = {}) => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  ...metadata
});

const appLogger = {
  info: (message, metadata = {}) => {
    const entry = createEntry('info', message, metadata);
    writeLog(logFiles.combined, entry);
  },
  error: (message, metadata = {}) => {
    const entry = createEntry('error', message, metadata);
    writeLog(logFiles.error, entry);
    writeLog(logFiles.combined, entry);
  },
  request: (message, metadata = {}) => {
    const entry = createEntry('request', message, metadata);
    writeLog(logFiles.requests, entry);
    writeLog(logFiles.combined, entry);
  }
};

module.exports = { appLogger, logFiles };
