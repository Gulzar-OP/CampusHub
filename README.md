# CampusHub — Full Stack MERN Campus Community

CampusHub is a full-stack student portal for Lost & Found, Buy/Sell/Needs, clubs, campus events, discussions, notifications, profiles and real-time chat.

## Stack
- Frontend: React + Vite + React Router + Axios + Lucide + Socket.IO client
- Backend: Node.js + Express + MongoDB/Mongoose + JWT + cookies + Socket.IO
- UI: responsive custom CSS, desktop sidebar + mobile bottom navigation

## Main pages
- Home dashboard
- Lost & Found / Marketplace browse
- Item details
- Create item/post
- Login / Register
- Profile + user posts
- Clubs & Societies
- Events
- Discussions
- Real-time chat
- Notifications
- Settings

## Project structure
```
CampusHub/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Discussion.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── userRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/token.js
│   ├── index.js
│   ├── seed.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   ├── services/api.js
    │   ├── styles/app.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── .env.example
```

## Run locally
### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Demo account after seed
- Email: `aarav@campus.edu`
- Password: `password123`

## Important API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST /api/items`
- `GET/PUT/DELETE /api/items/:id`
- `GET /api/community/clubs`
- `GET /api/community/events`
- `GET/POST /api/community/discussions`
- `GET/POST /api/chat/conversations`
- `GET/POST /api/chat/conversations/:id/messages`
- `GET /api/notifications`
- `PUT /api/users/me/profile`

## Production notes
For production, set real `MONGO_URI`, a strong `JWT_SECRET`, and exact `CLIENT_URL`. When frontend and backend are on different HTTPS domains, the auth cookie already uses `sameSite: none` + `secure: true` in production.

Image posting currently accepts an image URL. If you want direct uploads, plug your existing Multer + Cloudinary middleware into `POST /api/items` and save `req.file.path` into `image`.
