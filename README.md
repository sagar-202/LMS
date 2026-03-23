# LMS - Learning Management System

A professional, full-stack learning management system designed for seamless course delivery, progress tracking, and interactive learning.

## Overview

LMS is a comprehensive platform that empowers instructors to create and manage courses while providing students with an engaging learning experience. Built with a modern tech stack, it features role-based access control, a robust quiz system, automated certificate generation, and an AI-powered chatbot for real-time assistance.

## Key Features

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
- **Backend**: A RESTful API built with Express.js, organized into feature-based modules (Auth, Courses, Lessons, etc.).
- **Database**: A relational MySQL database for structured data persistence.

## Folder Structure

### Backend
```text
/
├── src/
│   ├── modules/       # Feature-based business logic (auth, courses, etc.)
│   ├── middleware/    # Auth and error handling middlewares
│   ├── utils/         # Database connection, PDF generators, etc.
│   ├── scripts/       # Database migrations and seeding
│   ├── app.ts         # Express app initialization
│   └── server.ts      # Server entry point
├── scripts/           # Root-level support scripts
└── .env               # Backend configuration
```

### Frontend
```text
/frontend/
├── app/               # Next.js App Router (pages and layouts)
│   ├── auth/          # Authentication pages
│   ├── courses/       # Course browsing
│   ├── dashboard/     # Student/Instructor dashboard
│   └── lesson/        # Video player and lesson content
├── components/        # Reusable UI components
├── context/           # React Context providers (Theme, etc.)
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
   # Configure .env file (see Environment Variables)
   npm run migrate      # Run database migrations
   npm run seed:features # Seed initial data
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Configure .env.local file
   ```

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

1. **Start Backend**:
   ```bash
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## API Reference (Summary)

- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and receive tokens
- `GET /api/courses` - Fetch all available courses
- `POST /api/courses` - Create a new course (Instructor only)
- `GET /api/lessons/:id` - Get lesson details and attachments
- `POST /api/progress/track` - Update user progress for a lesson
- `POST /api/chatbot` - Interact with the AI assistant

## Future Improvements

- Implementation of a payment gateway (Stripe/Razorpay) for paid courses.
- Live streaming integration for real-time classes.
- Mobile application using React Native.
- Advanced analytics dashboard for instructors.

## License

This project is licensed under the ISC License.
