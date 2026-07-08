# CodeCollab

CodeCollab is a full-stack developer community app where users can:

- create an account and sign in
- publish and manage posts
- like posts and comment on discussions
- search for other users
- chat in real time through private conversations

The project is split into two apps:

- `frontend/`: Next.js client application
- `backend/`: Express + Socket.IO API server connected to MongoDB

## Tech Stack

### Frontend

- Next.js 16
- React 18
- Axios
- Socket.IO Client
- CSS Modules

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- Socket.IO
- bcryptjs

## Project Structure

```text
CodeCollab/
  backend/
    config/
    controllers/
    middlewares/
    models/
    routes/
    server.js
  frontend/
    src/app/
    src/components/
    src/context/
    src/services/
```

## Features

- Authentication
  - Sign up with username, email, and password
  - Sign in with JWT-based auth
- Post Feed
  - Create, update, delete posts
  - Filter posts by username and date
  - Like/unlike posts
- Comments
  - Add comments to posts
  - View post comments chronologically
- Real-Time Chat
  - User search for starting conversations
  - Conversation history
  - Live messaging using Socket.IO rooms

## Prerequisites

Install:

- Node.js 18+ (Node.js 20+ recommended)
- npm
- MongoDB (local or cloud, e.g., MongoDB Atlas)

## Environment Variables

Create these files before running the app.

### 1) Backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codecollab
JWT_SECRET=your_super_secret_jwt_key
```

### 2) Frontend environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Installation

From the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the Project

Run backend (Terminal 1):

```bash
cd backend
npm run dev
```

Run frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

Then open:

- Frontend: `http://localhost:3000`
- Backend API base: `http://localhost:5000/api`

## Available Scripts

### Backend (`backend/package.json`)

- `npm start` - Start server with Node
- `npm run dev` - Start server with Nodemon

### Frontend (`frontend/package.json`)

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build production app
- `npm start` - Run production build
- `npm run lint` - Run lint checks

## API Overview

Base URL: `/api`

### Auth

- `POST /auth/signup`
- `POST /auth/signin`

### Posts

- `GET /posts`
- `POST /posts` (auth required)
- `PUT /posts/:id` (auth required)
- `DELETE /posts/:id` (auth required)
- `PUT /posts/:id/like` (auth required)
- `GET /posts/:id/comments`
- `POST /posts/:id/comments` (auth required)

### Messages

- `GET /messages/conversations` (auth required)
- `GET /messages/:userId` (auth required)

### Users

- `GET /users?search=<term>` (auth required)

## Socket.IO Events

Client emits:

- `join_chat` with room id
- `send_message` with `{ senderId, receiverId, content, room }`

Server emits:

- `receive_message` with saved message payload

## Auth Notes

Protected endpoints require this header:

```http
Authorization: Bearer <token>
```

The frontend stores:

- token in localStorage key `token`
- user object in localStorage key `user`

## Troubleshooting

- If API calls fail from frontend:
  - verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
  - verify backend is running on the expected port
- If chat does not connect:
  - verify `NEXT_PUBLIC_SOCKET_URL` points to backend origin
- If MongoDB connection fails:
  - verify `MONGO_URI` in `backend/.env`
  - ensure database network access is allowed (Atlas users)

## Future Improvements

- Add automated tests (backend API + frontend UI)
- Add refresh token flow and secure cookie auth
- Add Docker setup for one-command startup
- Add CI pipeline for lint/build/test
