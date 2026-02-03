
# REAL-TIME TEACHER – AI LIVE COACH GAMIFIED LEARNING PLATFORM

LevelUpEd is an adaptive learning platform that uses AI to monitor student focus and personalize the curriculum in real-time. It features a gamified "World Map" interface, boss battles for assessments, and a conversational AI tutor.

## Features
- **Real-time Focus Coaching**: AI detects when you lose focus and intervenes.
- **Gamified Learning**: Earn XP, unlock worlds (Web, Data, Cyber, AI), and fight Bosses.
- **Adaptive Curriculum**: Content difficulty scales based on your performance.
- **PWA Support**: Installable on desktop and mobile.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Bun (Node.js compatible), Express, Socket.io.
- **Database**: PostgreSQL (Prisma ORM).
- **AI**: Gemini API.

## Setup Instructions

### Prerequisites
- Node.js (v20+) or Bun (v1.0+)
- PostgreSQL Database

### 1. Database Setup
Ensure PostgreSQL is running. Update `backend/.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/levelup_ed?schema=public"
```

### 2. Backend Setup
```bash
cd backend
bun install
bun prisma migrate dev --name init
bun run dev
```
Server runs on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd frontend
bun install
bun run dev
```
App runs on `http://localhost:5173`.

## Environment Variables
**Backend (.env)**
- `DATABASE_URL`: Postgres Connection String
- `JWT_SECRET`: Secret key for tokens
- `GEMINI_API_KEY`: Google Gemini API Key

**Frontend (.env)**
- `VITE_API_URL`: Backend URL (default: http://localhost:3000/api)
