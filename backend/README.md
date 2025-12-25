# MintLiv Backend API

MVC-based Node.js/Express backend for the MintLiv frontend application.

## Project Structure

```
src/
├── config/           # Configuration files (database)
├── controllers/      # Business logic controllers
├── middleware/       # Express middleware (auth, error handling)
├── models/          # MongoDB/Mongoose schemas
├── routes/          # API route definitions
├── websocket/       # WebSocket server setup
└── server.ts        # Main server file
```

## Features

- **Authentication**: JWT-based user authentication
- **MVC Architecture**: Clear separation of concerns
- **MongoDB**: Document-based database with Mongoose
- **WebSocket**: Real-time updates for stats and notifications
- **Error Handling**: Centralized error handling middleware
- **CORS**: Cross-origin resource sharing enabled
- **Middleware**: Authentication and authorization middleware

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Dashboard
- `GET /api/dashboard/stats` - Get system statistics
- `GET /api/dashboard/system-status` - Get system status
- `POST /api/dashboard/stats` - Update statistics

### Activity
- `GET /api/activity` - Get activity logs
- `GET /api/activity/:id` - Get activity by ID
- `POST /api/activity` - Create activity
- `DELETE /api/activity/:id` - Delete activity

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings
- `POST /api/settings/reset` - Reset to defaults

### Health
- `GET /api/health` - Health check

## Setup

### Prerequisites
- Node.js 18+
- MongoDB local or remote connection string
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mintliv
JWT_SECRET=your_secret_key
```

### Running

Development mode:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Production:
```bash
npm start
```

## Models

### User
- `email` - User email (unique)
- `password` - Hashed password
- `name` - User name
- `role` - User role (admin, user, viewer)
- `isActive` - Account status

### Activity
- `userId` - User ID
- `userName` - User name
- `action` - Action performed
- `description` - Action description
- `type` - Activity type
- `metadata` - Additional data
- `timestamp` - Activity timestamp (auto-delete after 90 days)

### Notification
- `userId` - Target user ID
- `title` - Notification title
- `message` - Notification message
- `type` - Notification type
- `read` - Read status
- `actionUrl` - Optional action URL

### Stats
- `activeUsers` - Number of active users
- `requestsPerMin` - Requests per minute
- `errorRate` - Error rate percentage
- `uptime` - System uptime
- `serverStatus` - Status of services (auto-delete after 30 days)

### Settings
- `userId` - User ID (unique)
- `theme` - UI theme preference
- `emailNotifications` - Email notification preference
- `pushNotifications` - Push notification preference
- `twoFactorEnabled` - 2FA status
- `language` - Preferred language
- `timezone` - User timezone
- `preferences` - Custom preferences

## WebSocket Events

The WebSocket server emits:

- `stats_update` - Updated system statistics (every 5 seconds)
- `notification` - New notifications (every 10 seconds)

Connect with:
```javascript
const ws = new WebSocket('ws://localhost:5001');
ws.send(JSON.stringify({
  type: 'auth',
  userId: 'user-id',
  email: 'user@example.com'
}));
```

## Authentication

JWT token is required for protected endpoints. Include in header:
```
Authorization: Bearer <token>
```

## Error Handling

All errors are handled by centralized middleware and return:
```json
{
  "success": false,
  "message": "Error message",
  "error": {} // Only in development
}
```

## Development Tips

- Database auto-connects on startup
- WebSocket automatically broadcasts updates
- Activities auto-delete after 90 days
- Stats auto-delete after 30 days
- Password is automatically hashed before saving

## License

MIT
