# Ledgr — Task Manager

A premium, responsive task manager built with React, Firebase, and Tailwind CSS.

## Design

- **Palette** — warm paper (`#F7F5F0`) / ink (`#0D1117`) neutrals with a single deep-teal accent (`#1E7F72`) and an amber (`#E8A33D`) for warnings/priority.
- **Type** — Fraunces (display/headings), Inter (UI/body), JetBrains Mono (dates, badges — the "ledger" feel).
- **Signature element** — task cards read like filed ledger entries: a thin priority-colored spine on the left edge, monospace metadata, and a glassmorphism login card floating over an animated Threads background.

## Features

- Full-screen glassmorphism login/register/forgot-password flow with an animated OGL "Threads" background (mouse-reactive, theme-aware: white threads on dark, ink threads on light).
- Firebase Authentication: email/password, Google sign-in, password reset, persistent sessions, protected routes.
- Firestore-backed task CRUD, scoped per user via security rules.
- Dashboard with live stats, sidebar + navbar SaaS layout (mobile drawer), instant search, filters (status/priority/category/due date), sorting, and a particle-burst "Add Task" button.
- Full dark/light theme system with `localStorage` persistence, system-preference detection on first visit, and animated sun/moon toggle.
- Framer Motion throughout: page transitions, card enter/exit, modals, sidebar active indicator, notification dropdown.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Firebase project credentials
npm run dev
```

### Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication → Email/Password** and **Google** sign-in providers.
3. Enable **Firestore Database** (production mode).
4. Copy your web app config into `.env` (see `.env.example`).
5. Deploy `firestore.rules` (or paste its contents into the Firestore Rules tab) so each user can only read/write their own tasks.

### Firestore data model

```
tasks/{taskId}
  userId: string
  title: string
  description: string
  dueDate: string (YYYY-MM-DD)
  category: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed'
  createdAt: Timestamp
  updatedAt: Timestamp
```

## Project structure

```
src/
  components/   Sidebar, Navbar, Layout, TaskCard, TaskModal, TaskList, ParticleButton, Threads, ...
  context/      AuthContext, ThemeContext, TaskSearchContext
  hooks/        useTasks (Firestore CRUD + realtime sync)
  pages/        Login, Register, ForgotPassword, Dashboard, MyTasks, Completed, Pending, Profile, Settings
  utils/        taskUtils (filtering, sorting, formatting, style maps)
  firebase/     config.js
```

## Build

```bash
npm run build
npm run preview
```
