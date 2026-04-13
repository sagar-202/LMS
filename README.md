# LMS - Learning Management System

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/frontend-Next.js%2014-black)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/backend-Express.js%205-lightgrey)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)

A professional, full-stack learning management system designed for seamless course delivery, student progress tracking, and interactive learning. Built with a focus on modern SaaS aesthetics and scalable architecture.

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## 🌟 Overview

LMS is a comprehensive platform empowering instructors to create high-quality educational content while providing students with an immersive learning experience. Featuring role-based access control, automated certifications, and AI-driven support, it is built to handle the demands of modern online education.

## ✨ Key Features

### 🎨 Premium UI/UX
- **Modern Aesthetics**: Glassmorphism effects and 60+ FPS micro-interactions.
- **Adaptive Display**: Fully responsive design with seamless dark/light mode transitions.
- **Optimized Performance**: Built with Next.js App Router for superior speed and SEO.

### 🎓 Learning Experience
- **Interactive Lessons**: High-quality video playback with precise progress tracking.
- **Discussion System**: Integrated comment threads for collaborative learning.
- **Resource Management**: Downloadable attachments for every lesson.
- **AI Support**: Intelligent, context-aware chatbot powered by Hugging Face API.

### 🛠 Instructor Tools
- **Course CMS**: Effortless creation and management of courses and lessons.
- **Student Insights**: Track enrollment and progress across your curriculum.
- **Automated Certifications**: Dynamic PDF generation upon course completion.

### 🔐 Security & State
- **Secure Auth**: JWT-based authentication with Access/Refresh tokens and HTTP-only cookies.
- **Efficient State**: Lightweight global state management using Zustand.

---

## 💻 Tech Stack

| Frontend | Backend | DevOps & DB |
| :--- | :--- | :--- |
| Next.js 14 (App Router) | Node.js & Express.js | MySQL |
| TypeScript | TypeScript | Git & GitHub |
| Tailwind CSS | PDFKit (Certificates) | Render (Deployment) |
| Zustand (State) | JWT & bcrypt | Dotenv |

---

## 🏗 Architecture Overview

The system follows a **Modular Monolithic** design:
1. **Frontend**: A high-performance SSR/SSG application handling the student and instructor portals.
2. **Backend**: A RESTful API layer organized into feature-based modules (Auth, Courses, Progress, etc.).
3. **Storage**: Relational data persistence using MySQL for structured educational data.

---

## 📂 Folder Structure

### Backend (`/`)
```text
├── src/
│   ├── modules/       # Feature-based business logic
│   ├── middleware/    # Auth and error handlers
│   ├── utils/         # Database and file utilities
│   └── server.ts      # API entry point
├── scripts/           # Migration and seeding tools
└── .env               # Configuration
```

### Frontend (`/frontend`)
```text
├── app/               # App Router pages
├── components/        # Reusable UI components
├── store/             # Zustand state stores
└── tailwind.config.ts # Styling configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL instance

### Installation

1. **Clone & Install Backend**
   ```bash
   git clone <repository-url>
   cd 5.Learning Management System
   npm install
   npm run build
   ```

2. **Database Setup**
   ```bash
   # Create a .env file and configure your DB details
   npm run migrate
   npm run seed:features
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## ⚙️ Environment Configuration

### Backend (`.env`)
```env
PORT=3000
DATABASE_URL=mysql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
HF_API_KEY=your_huggingface_api_key
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

---

## 🔌 API Reference (Summary)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User authentication |
| `GET` | `/api/courses` | List all courses |
| `POST` | `/api/progress/track` | Update lesson completion |
| `POST` | `/api/chatbot` | AI Assistant interaction |

---

## 🌐 Deployment

### Render (Backend)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Settings**: Add all secret keys in the "Environment" tab.

---

## 🗺 Future Roadmap

- [ ] Stripe/Razorpay payment gateway integration.
- [ ] Real-time live streaming classrooms.
- [ ] Mobile app (React Native) for iOS and Android.

---

## 📄 License

This project is licensed under the **ISC License**.
