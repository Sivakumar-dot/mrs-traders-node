## M.R.S Traders WhatsApp Enquiry System

Production-ready enquiry platform for **M.R.S Traders** using:

- Node.js
- Express.js
- MongoDB with Mongoose
- `whatsapp-web.js`

## Architecture

Backend uses layered enterprise structure:

`Route -> Controller -> Service -> Repository -> MongoDB`

## Backend Features

- Enquiry submission API: `POST /api/enquiry`
- Health API: `GET /api/health`
- MongoDB persistence
- UUID request tracking
- File-based logs in `logs/`
- MongoDB activity logs
- WhatsApp QR authentication
- WhatsApp session persistence
- Rate limiting
- Centralized error handling
- Future-ready admin/auth scaffolding

## Enquiry Flow

1. Frontend client submits enquiry to Node API
2. Request is validated
3. Enquiry is stored in MongoDB
4. WhatsApp admin notification is generated
5. WhatsApp status is updated in DB
6. Logs are stored in files and activity collection

## Environment

Backend environment values are defined in `.env`.

Example:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mrs-traders
COMPANY_NAME=M.R.S Traders
COMPANY_TYPE=Electrical & Plumbing Shop
ADMIN_NAME=Raja
ADMIN_WHATSAPP=918489820801
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5
```

## Install Commands

Backend dependencies:

```bash
npm install express cors dotenv mongoose whatsapp-web.js qrcode-terminal uuid express-rate-limit
```

Backend dev dependency:

```bash
npm install -D nodemon
```

## Run Commands

Backend development:

```bash
npm run dev
```

Backend production:

```bash
npm start
```

## WhatsApp Setup

1. Start the backend server.
2. Watch the terminal for the QR code.
3. Scan it using the WhatsApp account that should stay logged into the app.
4. Session files are stored in `whatsapp-session/auth-files`.

`ADMIN_WHATSAPP` is only the destination number for enquiry notifications.
It does not control QR authentication or which account scans the QR code.

## Do Not Commit To Git

These items should not be pushed to the git repository:

- `.env` and other local environment files
- `node_modules/`
- `dist/`, `build/`, and `coverage/`
- `logs/error.log`, `logs/combined.log`, and `logs/requests.log`
- `whatsapp-session/auth-files/` because it contains WhatsApp login session data
- local editor folders like `.vscode/` and `.idea/`

## Future Expansion Ready

The project already includes scaffolding for:

- Admin panel
- JWT authentication
- Role-based access
- Dashboard
- Settings
- Analytics
- Multi-admin support
- Notification history
- User activity tracking
