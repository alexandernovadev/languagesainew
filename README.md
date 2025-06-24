# 🌟 LanguageAI - Intelligent Language Learning Platform

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-Latest-orange.svg?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue.svg?style=for-the-badge)](package.json)

A modern, AI-powered language learning platform built with React, TypeScript, and cutting-edge web technologies. LanguageAI combines intelligent content generation, interactive learning games, and comprehensive vocabulary management to create an immersive language learning experience.

## ✨ Features

### 🎯 Core Learning Features
- **AI-Powered Content Generation**: Create personalized lectures and educational materials using advanced AI
- **Interactive Anki Cards**: Spaced repetition learning with flip cards and pronunciation
- **Verb Conjugation Games**: Practice verb forms through engaging interactive exercises
- **Vocabulary Management**: Comprehensive word tracking with difficulty levels and examples
- **Reading Time Calculator**: Automatic estimation of reading time for generated content

### 🎮 Learning Games
- **Anki Game**: Interactive flashcard system with audio pronunciation
- **Verbs Game**: Practice verb conjugations with real-time feedback
- **Progress Tracking**: Monitor your learning progress with detailed statistics

### 📚 Content Management
- **Lecture Library**: Browse, create, and manage educational content
- **Word Dictionary**: Personal vocabulary with definitions, examples, and translations
- **Content Generation**: AI-powered lecture and exam creation
- **Audio Integration**: Text-to-speech functionality with multiple speed options

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Beautiful theming with automatic system preference detection
- **Component Library**: Comprehensive UI component system built with Radix UI
- **Accessibility**: WCAG compliant components with keyboard navigation support

## 🚀 Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### State Management & Data
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client for API communication

### UI Components
- **Shadcn/ui** - Modern component library
- **React Router DOM** - Client-side routing
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **React Markdown** - Markdown rendering

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/languageai.git
cd languageai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start development server
pnpm dev
```

### Environment Variables
Create a `.env.local` file with the following variables:
```env
VITE_BACK_URL=http://localhost:3000/api
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── forms/          # Form components
│   ├── lectures/       # Lecture-specific components
│   └── auth/           # Authentication components
├── pages/              # Application pages
│   ├── lectures/       # Lecture management
│   ├── games/          # Learning games
│   ├── generator/      # AI content generation
│   └── my-words/       # Vocabulary management
├── lib/                # Utilities and stores
│   ├── store/          # Zustand stores
│   └── data/           # Static data and JSON files
├── services/           # API services
├── hooks/              # Custom React hooks
├── models/             # TypeScript interfaces
└── utils/              # Helper functions
```

## 🎯 Key Features Explained

### AI Content Generation
The platform uses advanced AI to generate personalized educational content:
- **Lecture Generator**: Create reading materials based on topics and difficulty levels
- **Exam Generator**: Generate practice tests and assessments
- **Smart Difficulty**: Automatically adjust content complexity based on user level

### Interactive Learning Games
Engage with language learning through gamified experiences:
- **Anki Cards**: Spaced repetition system with audio pronunciation
- **Verb Practice**: Interactive verb conjugation exercises
- **Progress Tracking**: Monitor learning achievements and statistics

### Vocabulary Management
Comprehensive word tracking and learning:
- **Personal Dictionary**: Save and organize learned words
- **Difficulty Levels**: Track word mastery (Easy, Medium, Hard)
- **Rich Metadata**: Definitions, examples, synonyms, and translations
- **Audio Pronunciation**: Text-to-speech with multiple speed options

## 🎨 UI Components

The project uses a comprehensive component library built on:
- **Radix UI Primitives**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Custom Design System**: Consistent theming and spacing
- **Responsive Layouts**: Mobile-first design approach

## 📱 Responsive Design

LanguageAI is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adaptive layouts with touch-friendly interactions
- **Mobile**: Mobile-optimized interface with bottom navigation

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Path Aliases**: Clean import paths with `@/` prefix

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain component reusability
- Write meaningful commit messages
- Test your changes thoroughly


## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first styling approach
- **Vite** for the lightning-fast development experience

**Made with ❤️ for language learners worldwide** 