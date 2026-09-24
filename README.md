# CampusHub

CampusHub is a full-stack campus community platform built with the MERN stack. It helps students manage **lost & found items, marketplace listings, needs, discussions, real-time chat, notifications, and profiles** from one place.

## Features

- User registration, login, logout, and protected routes
- Lost, Found, Sell, and Needs item listings
- Search, filtering, pagination, and item details
- Create, edit, delete, and update item status
- Image upload using Cloudinary
- Save / unsave items
- Student profile and profile editing
- Campus discussions with likes and comments
- Real-time one-to-one chat using Socket.IO
- Notifications with read / read-all support
- JWT-based authentication
- Responsive React + Tailwind CSS interface
- REST API built with Express and MongoDB

## Tech Stack

### Frontend

- React 19
- React Router
- Tailwind CSS
- Axios
- Lucide React
- Socket.IO Client
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Socket.IO
- Multer
- Cloudinary
- Cookie Parser
- CORS
- Morgan

## Project Structure

```text
CampusHub/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

## Main Pages

```text
/
├── /login
├── /register
├── /items
├── /items/:id
├── /items/:id/edit
├── /create-item
├── /discussions
├── /chat
├── /profile/:id
├── /notifications
└── /settings
```

## API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Items

```http
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
PATCH  /api/items/:id/status
DELETE /api/items/:id
```

### Users

```http
GET  /api/users/:id
PUT  /api/users/me/profile
POST /api/users/me/save/:itemId
```

### Chat

```http
GET  /api/chat/users
GET  /api/chat/conversations
POST /api/chat/conversations
GET  /api/chat/conversations/:id/messages
POST /api/chat/conversations/:id/messages
```

### Discussions and Community

```http
GET  /api/community/discussions
POST /api/community/discussions
POST /api/community/discussions/:id/like
POST /api/community/discussions/:id/comments
```

The backend also currently contains API support for clubs and events.

### Notifications

```http
GET   /api/notifications
PATCH /api/notifications/read-all
PATCH /api/notifications/:id/read
```

### Health Check

```http
GET /api/health
```

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

For production, replace localhost URLs with your deployed frontend and backend URLs.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Gulzar-OP/CampusHub.git
cd CampusHub
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## Run Locally

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs by default at:

```text
http://localhost:3000
```

API health check:

```text
http://localhost:3000/api/health
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Authentication Flow

CampusHub supports JWT authentication.

After login, authenticated requests can use the JWT token and protected backend routes verify the user before allowing access.

The frontend Axios instance also sends credentials and attaches the stored token to requests:

```text
Authorization: Bearer <token>
```

## Image Upload

Item images are uploaded through Multer and Cloudinary.

Supported formats:

- JPG
- JPEG
- PNG
- WEBP

Maximum upload size:

```text
5 MB
```

Images are stored under:

```text
campushub/items
```

## Real-Time Chat

CampusHub uses Socket.IO for real-time communication.

Users can:

- Start conversations
- Join conversation rooms
- Send messages
- Receive chat updates without refreshing the page

## Deployment

### Frontend

The frontend can be deployed on Vercel.

The included `vercel.json` provides SPA fallback support so React Router routes such as:

```text
/items
/chat
/settings
/profile/:id
```

continue to work when directly opened or refreshed.

### Backend

The backend can be deployed on services such as Render.

Set all backend environment variables in the deployment dashboard and configure:

```env
CLIENT_URL=https://your-production-frontend-domain.vercel.app
```

The frontend should use:

```env
VITE_API_URL=https://your-backend-domain/api
VITE_SOCKET_URL=https://your-backend-domain
```

## Scripts

### Backend

```bash
npm run dev
npm start
npm run seed
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Future Improvements

- Better real-time notification delivery
- Advanced search and filters
- Image optimization and moderation
- Admin dashboard
- Report inappropriate listings
- Improved chat presence and typing indicators
- Enhanced mobile UI
- Email / OTP verification
- Better marketplace transaction workflow

## Author

**Gulzar Hussain**

GitHub: [Gulzar-OP](https://github.com/Gulzar-OP)

## License

This project is currently intended for educational and portfolio use.
