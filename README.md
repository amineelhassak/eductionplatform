# Platform Learning — Authentication System

A full-stack learning platform with Firebase + JWT authentication.

## Architecture

```
platformlearning/
├── backend/                 # Express.js API server
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── src/
│   │   ├── config/          # Firebase, DB, env config
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/      # JWT auth, error handling
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # JWT helpers, AppError
│   │   └── server.ts        # Express app entry point
│   └── .env.example
│
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── auth/        # GoogleLoginButton, FacebookLoginButton, ProtectedRoute
│   │   ├── config/          # Firebase client config
│   │   ├── context/         # AuthContext (React Context + Provider)
│   │   ├── hooks/           # useAuth hook
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage
│   │   ├── services/        # Axios API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Router setup
│   │   └── main.tsx         # Entry point
│   └── .env.example
│
└── README.md
```

## Authentication Flow

```
┌─────────────┐     ┌──────────┐     ┌─────────────┐     ┌────────────┐
│   Browser    │────>│ Firebase │────>│   Backend   │────>│ PostgreSQL │
│  (React)     │     │  Auth    │     │  (Express)  │     │  (Prisma)  │
└─────────────┘     └──────────┘     └─────────────┘     └────────────┘
       │                   │                 │                    │
       │  1. Click Login   │                 │                    │
       │──────────────────>│                 │                    │
       │                   │                 │                    │
       │  2. OAuth Popup   │                 │                    │
       │<─────────────────>│                 │                    │
       │                   │                 │                    │
       │  3. Firebase Token│                 │                    │
       │<──────────────────│                 │                    │
       │                   │                 │                    │
       │  4. POST /api/auth/firebase         │                    │
       │  (send Firebase token)              │                    │
       │────────────────────────────────────>│                    │
       │                   │                 │                    │
       │                   │  5. Verify token│                    │
       │                   │  (Firebase Admin SDK)               │
       │                   │                 │                    │
       │                   │                 │  6. Upsert user   │
       │                   │                 │───────────────────>│
       │                   │                 │<──────────────────│
       │                   │                 │                    │
       │  7. Return JWT + user               │                    │
       │<────────────────────────────────────│                    │
       │                                     │                    │
       │  8. Store JWT, redirect to dashboard│                    │
       │                                     │                    │
       │  9. GET /api/auth/me (JWT in header)│                    │
       │────────────────────────────────────>│                    │
       │                                     │  10. Fetch user   │
       │<────────────────────────────────────│───────────────────>│
```

## Quick Start

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally
- Firebase project with Google & Facebook sign-in enabled

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database URL, JWT secret, and Firebase credentials

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env with your Firebase client config

npm install
npm run dev
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project (or use existing)
3. Enable **Authentication** → **Sign-in method** → Enable **Google** and **Facebook**
4. For Facebook: You'll need a [Facebook App](https://developers.facebook.com/) with OAuth redirect URI
5. Download the **Service Account Key** from Project Settings → Service Accounts → Generate new private key
6. Place the JSON file as `backend/firebase-service-account.json`
7. Copy the **Web app config** (apiKey, authDomain, etc.) into `frontend/.env`

## Security Best Practices Implemented

1. **HTTP-only cookies** — JWT stored in HTTP-only cookies, not accessible to JavaScript (XSS protection)
2. **Helmet** — Sets security headers (X-Content-Type-Options, Strict-Transport-Security, etc.)
3. **CORS** — Restricted to frontend origin only
4. **Rate limiting** — Auth endpoints limited to 20 requests per 15 minutes per IP
5. **Password hashing** — bcrypt with 12 salt rounds
6. **Input validation** — Server-side validation on all inputs
7. **Request body size limit** — 10KB max to prevent payload attacks
8. **Firebase token verification** — Server-side verification, never trusting client-side claims
9. **JWT expiration** — Tokens expire after 7 days (configurable)
10. **Secure cookies in production** — SameSite=Strict, Secure flag
11. **Global error handler** — Never leaks stack traces to clients
12. **Prisma query safety** — Parameterized queries prevent SQL injection

I am building a **learning platform** and I want to implement **authentication** in a full-stack application.

### Tech Stack

Frontend:

* React
* TypeScript
* Vite
* Axios
* React Router

Backend:

* Node.js
* Express.js
* TypeScript

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* Firebase Authentication
* Google OAuth
* Facebook OAuth
* JWT (JSON Web Token)

### Architecture

The project has two folders:

frontend/
backend/

Backend structure example:

backend/
prisma/
schema.prisma
src/
controllers/
routes/
middlewares/
services/
utils/
server.ts
.env

Frontend structure example:

frontend/
src/
components/
pages/
context/
services/
hooks/
App.tsx

### Features Required

1. Authentication methods:

* Login with Google
* Login with Facebook
* Email/password authentication

2. Authentication Flow:

* User logs in using Firebase (Google or Facebook).
* Firebase returns a **Firebase ID Token**.
* Frontend sends this token to the **Node.js backend**.
* Backend verifies the token using **Firebase Admin SDK**.
* Backend creates or finds the user in the **PostgreSQL database using Prisma**.
* Backend generates a **JWT token**.
* JWT is returned to the frontend.
* Frontend stores JWT (HTTP-only cookie or localStorage).

3. Database model (Prisma)
   User table should include:

* id
* email
* name
* provider (google | facebook | email)
* providerId
* avatar
* createdAt

4. Backend Responsibilities

* Verify Firebase token
* Create user if not exists
* Generate JWT
* Protect routes with JWT middleware

5. Frontend Responsibilities

* Login with Google
* Login with Facebook
* Send Firebase token to backend
* Store JWT
* Protect routes

6. Required Backend Libraries

* express
* jsonwebtoken
* firebase-admin
* prisma
* cors
* dotenv
* bcrypt (for email/password)

7. Required Frontend Libraries

* firebase
* axios
* react-router-dom

### What I want from you

Please generate:

1. Project architecture
2. Prisma schema
3. Firebase configuration
4. Backend authentication controller
5. JWT middleware
6. Express routes
7. React login page
8. Google login button
9. Facebook login button
10. Axios API service
11. Auth context in React
12. Protected routes in React
13. Explanation of the authentication flow
14. Best security practices

Make the code **clean, modular, and production-ready**.
Explain each part briefly.
Use **TypeScript everywhere**.
# learningplatform
