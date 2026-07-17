# CodeCollab

CodeCollab is a full-stack developer community app where users can:

- create an account and sign in
- publish and manage posts
- like posts and comment on discussions
- search for other users
- chat in real time through private conversations

The project is split into three apps:

- `frontend/`: Next.js client application
- `backend/`: Express + Socket.IO API server connected to MongoDB
- `mobile/`: React Native (Expo) mobile application

## Tech Stack

### Frontend (Web)

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

### Mobile

- React Native (Expo)
- React Navigation
- Axios
- Socket.IO Client

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
  mobile/
    assets/
    components/
    context/
    navigation/
    screens/
    services/
    App.js
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
- Expo Go app on your mobile device (for running the mobile app)

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

### 3) Mobile environment

Create `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://<your-local-ip>:5000/api
EXPO_PUBLIC_SOCKET_URL=http://<your-local-ip>:5000
```
Replace `<your-local-ip>` with your computer's local IP address.

## Installation

From the project root:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../mobile
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

Run mobile (Terminal 3):

```bash
cd mobile
npm start
```

Then open:

- Frontend: `http://localhost:3000`
- Backend API base: `http://localhost:5000/api`
- Mobile: Scan the QR code with the Expo Go app.

## Available Scripts

### Backend (`backend/package.json`)

- `npm start` - Start server with Node
- `npm run dev` - Start server with Nodemon

### Frontend (`frontend/package.json`)

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build production app
- `npm start` - Run production build
- `npm run lint` - Run lint checks

### Mobile (`mobile/package.json`)

- `npm start` - Start Expo dev server
- `npm run android` - Start Expo dev server for Android
- `npm run ios` - Start Expo dev server for iOS
- `npm run web` - Start Expo dev server for web

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

The mobile app stores:

- token in AsyncStorage key `token`
- user object in AsyncStorage key `user`

## Troubleshooting

- If API calls fail from frontend:
  - verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
  - verify backend is running on the expected port
- If API calls fail from mobile:
  - verify `EXPO_PUBLIC_API_URL` in `mobile/.env` and that it uses your local IP address
  - ensure your mobile device is on the same Wi-Fi network as your computer
- If chat does not connect:
  - verify `NEXT_PUBLIC_SOCKET_URL` (web) or `EXPO_PUBLIC_SOCKET_URL` (mobile) points to the correct backend origin
- If MongoDB connection fails:
  - verify `MONGO_URI` in `backend/.env`
  - ensure database network access is allowed (Atlas users)

## Future Improvements

- Add automated tests (backend API + frontend UI + mobile)
- Add refresh token flow and secure cookie auth
- Add Docker setup for one-command startup
- Add CI pipeline for lint/build/test