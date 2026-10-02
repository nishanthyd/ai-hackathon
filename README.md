# LearnAI — Personalized AI Learning Platform

## 💡 Project Overview

LearnAI is an adaptive AI-powered learning platform that personalizes the learning experience based on each learner's goals, knowledge level, learning preferences, and performance.

The platform combines AI tutoring, adaptive quizzes, coding practice, learner diagnostics, personalized learning paths, progress tracking, and AI-generated visual explanations to create a more personalized way to learn AI and programming.

## ✨ Key Features

- **Adaptive AI Tutor** — Provides explanations based on the learner's level and learning context.
- **Personalized Learning Path** — Adapts learning content, difficulty, and practice based on performance.
- **Adaptive Quizzes** — Evaluates understanding and identifies knowledge gaps.
- **AI Coding Practice** — Provides coding problems, code execution, and AI-powered line diagnostics.
- **AI Knowledge Graph** — Tracks mastered concepts, concepts in progress, and weak areas.
- **Progress & Mastery Tracking** — Tracks quiz accuracy, learning activity, confidence, and concept mastery.
- **Adaptive Learner Profile** — Lets learners configure their level, goals, daily time budget, and preferred learning style.
- **Video-Aware AI Tutor** — Allows learners to interact with an AI tutor while learning from video content.
- **AI-Generated Manim Visualizations** — Generates animated visual explanations to make difficult concepts easier to understand.

## 🛠️ Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Next.js
- Tailwind CSS

### Backend & AI
- Node.js
- Express
- Python
- Manim
- Groq LLM API

### Other Technologies
- Framer Motion
- REST APIs
- Local browser storage / application state

## 📁 Project Structure

The repository contains the core services used by the LearnAI platform:

```text
ai-hackathon/
│
├── unesco/
│   └── Main frontend application
│
├── neweduvisionkesh/
│   └── AI video generation backend
│       using Express + Manim + Groq
│
├── eduvision-main/
│   └── Main Next.js application
│
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/nishanthyd/ai-hackathon.git
cd ai-hackathon
```

### 2. Install dependencies
Install dependencies for the root project and all three services:

```bash
npm install
npm install --prefix ./unesco
npm install --prefix ./neweduvisionkesh
npm install --prefix ./eduvision-main
```


### 3. Run the project
To launch all services together from the root directory:

```bash
npm run dev:all
```

The services will run on:

**Frontend:** `http://localhost:5173`
**Video Generation Backend:** `http://localhost:4000`
**Main Application:** `http://localhost:3000`

## 🚀 How to run the project

### Run services individually

Frontend:
```bash
cd unesco
npm run dev
```

Video Generation Backend:
```bash
cd neweduvisionkesh
npm run serve
```

Main Application:
```bash
cd eduvision-main
npm run dev
```
