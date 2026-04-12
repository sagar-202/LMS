# LMS - Learning Management System

A professional, full-stack learning management system designed for seamless course delivery, progress tracking, and interactive learning.

## Overview

LMS is a comprehensive platform that empowers instructors to create and manage courses while providing students with an engaging learning experience. Built with a modern tech stack, it features role-based access control, a robust quiz system, automated certificate generation, and an AI-powered chatbot for real-time assistance.

## Key Features

- **Premium SaaS UI/UX**:
  - Stunning modern aesthetics with **glassmorphism** in the navigation.
  - 60+ FPS smooth animations and micro-interactions.
  - Responsive layouts optimized for all screen sizes.
  - Adaptive Dark/Light modes with seamless transitions.
- **User Authentication**: Secure login and registration using JWT (Access & Refresh tokens) with HTTP-only cookies.
- **Role-Based Access Control (RBAC)**: Distinct interfaces and permissions for Students and Instructors.
- **Course & Lesson Management**: Comprehensive CMS for instructors to create courses, upload video lessons, and manage attachments.
- **Interactive Learning**:
  - Video-based lessons with progress tracking.
  - Discussion and comment system for each lesson.
  - Downloadable lesson attachments.
- **Assessment & Certification**:
  - Dynamic quiz system to test student knowledge.
  - Automated PDF certificate generation upon course completion.
- **AI Chatbot**: Intelligent, LMS-aware assistant integrated via Hugging Face API.
- **State Management**: Optimized client-side state handling with Zustand.

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **Documentation/Utilities**: PDFKit (Certificates), Dotenv

## Architecture Overview

The project follows a modular monolithic architecture:
- **Frontend**: A client-side application using Next.js for server-side rendering and static site generation, ensuring SEO and performance.
- **Backend**: A RESTful API built with Express.js, organized into feature-based modules.
- **Database**: A relational MySQL database for structured data persistence.

## Folder Structure

### Backend
```text
/
├── src/
│   ├── modules/       # Feature-based business logic (auth, courses, etc.)
│   ├── middleware/    # Auth and error handling middlewares
│   ├── utils/         # Database connection, PDF generators, etc.
│   ├── server.ts      # Server entry point
├── scripts/           # Root-level support scripts
└── .env               # Backend configuration
```

### Frontend
```text
/frontend/
├── app/               # Next.js App Router (pages and layouts)
├── components/        # Reusable UI components
├── store/             # Zustand stores for global state
└── tailwind.config.ts # Styling configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL instance

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd 5.Learning Management System
   ```

2. **Backend Setup**:
   ```bash
   npm install
   npm run build
   # Configure .env file
   npm run migrate
   npm run seed:features
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Deployment

### Render Configuration
To deploy the backend on Render, use the following settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node

Ensure all Environment Variables are configured in the Render dashboard.

## Environment Variables

### Backend (.env)
```env
PORT=3000
DATABASE_URL=mysql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
HF_API_KEY=your_huggingface_api_key
```

### Frontend (frontend/.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Running Locally

1. **Start Backend**: `npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`

## API Reference (Summary)

- `POST /api/auth/login` - Authenticate and receive tokens
- `GET /api/courses` - Fetch all available courses
- `POST /api/progress/track` - Update user progress
- `POST /api/chatbot` - Interact with the AI assistant

## Future Improvements

- Stripe/Razorpay payment integration.
- Live streaming for real-time classes.
- Native mobile application (React Native).

## License

This project is licensed under the ISC License.
