# WhatNext! Frontend

React + TypeScript frontend for WhatNext! task manager.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```
REACT_APP_API_URL=http://localhost:8080/api
```

### 3. Run Development Server

```bash
npm start
```

Opens on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder.

## Project Structure

```
src/
├── components/        # Reusable components
│   └── layout/       # Header, navigation
├── pages/            # Main pages
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── BoardPage.tsx
│   ├── AllTasksPage.tsx
│   ├── NotesPage.tsx
│   └── SettingsPage.tsx
├── services/         # API services
│   ├── api.ts
│   ├── authService.ts
│   ├── taskService.ts
│   ├── noteService.ts
│   └── settingsService.ts
├── store/            # Redux store
│   ├── store.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── taskSlice.ts
│       ├── noteSlice.ts
│       └── settingsSlice.ts
├── types/            # TypeScript types
│   └── index.ts
├── App.tsx           # Main app component
└── index.tsx         # Entry point
```

## Key Features

- **Authentication**: JWT-based login/register
- **Board View**: Kanban-style task board
- **All Tasks View**: Filterable list of all tasks
- **Notes**: Create and manage notes
- **Settings**: Configure auto-archive and preferences

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL

## Deploy to Vercel

1. Push code to GitHub
2. Connect repository in Vercel
3. Set environment variable: `REACT_APP_API_URL`
4. Deploy!

## Default Login

```
Email: admin@whatnext.com
Password: admin123
```

## License

MIT
