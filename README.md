
# 🚀 LevelUpED

> **The Cybernetic Career Engine: Turn your technical upskilling into a high-stakes RPG.**

![LevelUpED Banner](https://img.shields.io/badge/Powered%20By-Gemini%20Flash-blue?style=for-the-badge&logo=google-gemini)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind%20%7C%20Bun-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon%20Ready-green?style=for-the-badge)

---

## 🏆 Introduction

**LevelUpED** transforms the lonely, static experience of learning to code into an immersive **Role-Playing Game**. Instead of boring quizzes, you face **AI Bosses** in voice-interactive interviews. The interface adapts to your subject (Chameleon UI), and the AI generates holographic diagrams on the fly to explain concepts.

Developed for the **Google Gemini Developer Competition** to solve the "Tutorial Hell" crisis.

---

## ✨ Key Features that WOW

### ⚔️ **AI Boss Battles (Voice-Enabled)**
- Face off against "The Architect" or "The CISO".
- **Voice Mode**: Speak your answers using your microphone.
  - *Tech:* Web Speech API + Gemini 1.5/2.0 Flash for instant feedback.
- **Real-time Judging**: The Boss deals "Health Damage" if your answer is vague, and learns from your precision.

### 🔮 **Instant Course Generator**
- Want to learn something specific? Type "Quantum Computing" or "Svelte".
- The AI generates a **full custom curriculum**, unique boss persona, and visual theme instantly.

### 📽️ **Holographic Learning**
- Don't just read about architecture.
- Ask the AI Mentor: "Show me how React State works."
- It generates a **live Mermaid.js Diagram** to visualize the flow right in the chat.

### 🎮 **Gamification Ecosystem**
- **XP, Streaks & Gems**: Daily rewards for consistency.
- **Shop**: Buy "Streak Freezes", "Resume Boosts", and "Debug Goggles".
- **Leaderboards**: Compete with friends in the Gold League.
- **Digital Resume**: Auto-generates a PDF resume based on your *proven* skills.

---

## 🛠️ Tech Stack

| Component | Tech |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Recharts |
| **Backend** | Node.js (Bun Runtime), Express, TypeScript |
| **Database** | PostgreSQL (Neon/Railway), Prisma ORM |
| **AI Engine** | Google Gemini 1.5 Pro / 2.0 Flash (via Google GenAI SDK) |
| **Voice** | Web Speech API |
| **Diagrams** | Mermaid.js |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+ (or Bun v1.0+)
- PostgreSQL Database (Local or Cloud)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/shahamitr/levelup-ed.git
cd levelup-ed
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
bun install
```

Create a `.env` file in `backend/` with the following:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/levelup_ed"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="AIzaSy..." # Your Google AI Studio Key
FRONTEND_URL="http://localhost:5173"
GEMINI_MODEL="gemini-2.0-flash"
```

Start the backend server:
```bash
bun db:push  # Initialize Database
bun db:seed  # (Optional) Seed initial data
bun start    # Runs on port 4000
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` with the following:
```env
VITE_API_URL="http://localhost:4000/api"
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Run the App
Open `http://localhost:5173` to start your adventure!

---

## 📸 Screenshots

| Dashboard | Boss Fight |
| :---: | :---: |
| *Insert Dashboard Screenshot Here* | *Insert Boss Fight Screenshot Here* |

| Adventure Map | AI Chat |
| :---: | :---: |
| *Insert Map Screenshot Here* | *Insert Chat Screenshot Here* |

---

## 📚 Curriculum Tracks
The platform comes pre-loaded with comprehensive tracks including:
- **SOC Analyst Defense**
- **Red Team Operations**
- **Prompt Engineering**
- **Autonomous Agents**
- **Fullstack Web Development**

---

## 🤝 Contributing
Pull requests are welcome for new "World Themes" or "Boss Personalities".

---

<p align="center">Made with ❤️ by the LevelUpED Team</p>
