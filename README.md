# MintLiv-feat

A full-stack TypeScript project (frontend + backend) that uses Socket.IO for real-time features such as notifications, user-action tracking, server condition updates, and more.

Features

- Real-time notifications (Socket.IO)
- User activity tracking (who did what, when)
- Server condition / health updates pushed in real time
- Authentication and authorization (JWT)
- APIs written in TypeScript (backend)
- Frontend in TypeScript (React / similar)

Repository layout (assumed)

- /frontend - the client application
- /backend  - the server application (API + Socket.IO)

If your folders differ, update the paths in this README accordingly.

Tech stack

- TypeScript (majority of codebase)
- Node.js, Express (backend)
- Socket.IO for real-time communication
- React / Vite / Next.js / other (frontend) — adjust as appropriate
- MongoDB or another persistent store (optional)

Getting started

Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

Clone the repo

```bash
git clone https://github.com/ramesh-webdev/MintLiv-feat.git
cd MintLiv-feat
```

Install and run backend

```bash
# from repo root
cd backend
npm install
# development
npm run dev
# or if using nodemon/ts-node-dev, ensure scripts are defined in package.json
```

Install and run frontend

```bash
# from repo root
cd frontend
npm install
npm run dev
# or npm start depending on your setup
```

Environment variables

Backend (example - create a `.env` file in `backend`):

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/mintliv
JWT_SECRET=your_jwt_secret
NODE_ENV=development
# Optional Socket.IO settings
SOCKET_PATH=/socket.io
```

Frontend (example - create a `.env` or `.env.local` in `frontend`):

```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

Socket.IO notes

- The backend exposes Socket.IO endpoints used by the frontend to receive real-time events.
- Typical flows:
  - Notifications: server emits `notification` events to client rooms/users.
  - User action tracking: client emits `user:action` events and server persists or broadcasts updates.
  - Server condition updates: server emits `server:status` or similar events for monitoring.
- Make sure the client connects to the correct Socket.IO endpoint (match path/namespace/transport options if customized).

Scripts

- Backend: `npm run dev`, `npm run build`, `npm start` (configure in backend/package.json)
- Frontend: `npm run dev`, `npm run build`, `npm start` (configure in frontend/package.json)

Development tips

- Use `nodemon` or `ts-node-dev` for hot-reloading server during development.
- Use unique socket rooms per user (by user id) to send targeted notifications.
- Authenticate socket connections with a token (JWT) passed during the handshake or immediately after connection.

Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes and push: `git push origin feat/your-feature`
4. Open a pull request with a clear description of changes

Please include tests for new features where applicable.

License

Specify your license here (e.g. MIT). If you don't have one yet, add a LICENSE file.

Contact

If you need changes to this README (folder structure, scripts, or env names) tell me the exact paths and package scripts and I will update the README accordingly.
