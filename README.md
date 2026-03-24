# 🚀 MERN Social Platform

[![React](https://img.shields.io/badge/React-19.x-brightgreen)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-green)](https://mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-orange)](https://socket.io)

A full-stack **MERN** social media platform with real-time chat/video calls, job board, video sharing, forums, gamification, and more!

## ✨ Features

- **👥 Social Networking**: User profiles, friends system, posts with comments, forums/groups
- **💬 Real-time Communication**: Chat messaging, video calls, incoming call notifications
- **💼 Job Board**: Post/browse/apply jobs, location search (Google Maps), candidate management
- **🎥 Video Sharing**: Upload, manage, gallery for videos (Cloudinary integration)
- **🎮 Gamification**: Leaderboards, level bars, achievements
- **🔔 Notifications**: Real-time updates
- **🔐 Secure Auth**: JWT, bcrypt, role-based access
- **💳 Payments**: Stripe integration
- **📱 Responsive UI**: Material-UI, mobile-friendly

## 🛠 Tech Stack

| Frontend | Backend | Database | Other |
|----------|---------|----------|-------|
| React 19.x | Express 5.x | MongoDB (Mongoose 8.x) | Socket.io, Cloudinary, Stripe, JWT |
| Material-UI 7.x | Node.js |  | Google Maps API |
| React Router | Multer |  | Axios |

## 📸 Screenshots

<!-- Add screenshots here -->
```
[Home/Dashboard] [Chat Interface] [Job Board] [Video Gallery] [Profile]
```

Live Demo: [TBD]

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Stripe account (test keys)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd MERN
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 2. Environment Variables

**backend/.env:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
PORT=5000
```

**frontend/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Run the App

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

App runs at `http://localhost:3000`

## 📁 Project Structure

```
MERN/
├── backend/
│   ├── models/     # User, Post, Job, Video, Forum, Chat, Message
│   ├── controllers/ # CRUD operations
│   ├── routes/     # API endpoints
│   ├── services/   # Business logic
│   ├── middleware/ # Auth
│   └── server.js   # Express + Socket.io
├── frontend/
│   ├── src/
│   │   ├── components/ # Chat, Jobs, Posts, Videos, Gamify
│   │   ├── pages/      # Home, Profile, Jobs, Forum, Videos
│   │   ├── context/    # Auth, Friends
│   │   └── services/   # API calls
│   └── public/
└── README.md
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/posts` | Get all posts |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs` | Browse jobs |
| POST | `/api/chat/messages` | Send message |
| GET | `/api/videos` | Video gallery |

**Socket.io Events:** `join-room`, `send-message`, `video-call`, `incoming-call`

## ☁️ Deployment

- **Frontend**: Vercel/Netlify (build & deploy)
- **Backend**: Render/Heroku/Railway
- **Database**: MongoDB Atlas
- **Media**: Cloudinary
- **Domain**: Custom via Vercel

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push & PR

See `TODO.md` for planned features.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

⭐ **Star this repo if you found it useful!**
