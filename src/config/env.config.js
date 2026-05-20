const dotenv = require('dotenv');

dotenv.config();

const envConfig = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mrs-traders',
  companyName: process.env.COMPANY_NAME || 'M.R.S Traders',
  companyType: process.env.COMPANY_TYPE || 'Electrical & Plumbing Shop',
  adminName: process.env.ADMIN_NAME || 'Raja',
  adminWhatsApp: process.env.ADMIN_WHATSAPP || '',
  adminUsername: process.env.ADMIN_USERNAME || 'Admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5)
};

module.exports = { envConfig };
