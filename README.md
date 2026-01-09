# TickDone - Vue.js Frontend

**TickDone** is a premium, modern task management application built with **Vue 3** and **TypeScript**. This repository contains the frontend implementation, featuring a sleek user interface with real-time task management capabilities.

## ✨ Features

- **Effortless Task Management**: Add, complete, and delete todos with a smooth, interactive UI.
- **Deadline Tracking**: Set deadlines for tasks and get visual cues when they are overdue.
- **Dynamic Filtering**: Quickly switch between 'All', 'Active', and 'Completed' views.
- **Modern Aesthetics**: A glassmorphism-inspired design with vibrant gradients and responsive layouts.
- **Robust Type Safety**: Fully implemented in TypeScript for better developer experience and fewer bugs.

## 🚀 Tech Stack

- **Core**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State & Logic**: Custom Composables for clean separation of concerns.
- **Styling**: Vanilla CSS with modern CSS variables and transitions.

## 🏗️ Architecture

The project follows a clean, modular architecture:

- **`src/components/`**: UI components like `TodoApp.vue` which handles the layout and user interactions.
- **`src/composables/`**: Business logic extracted into reusable functions (e.g., `useTodos.ts`).
- **`src/services/`**: API abstraction layer (e.g., `todoService.ts`) handles all backend communication.
- **`src/types/`**: Shared TypeScript interfaces and types.

## 🛠️ Project Setup

### Installation

```sh
npm install
```

### Development

Run the development server with hot-reload:

```sh
npm run dev
```

### Type-Checking & Production Build

Check for type errors and compile for production:

```sh
npm run type-check
npm run build
```

### Linting & Formatting

Clean up your code:

```sh
npm run lint
npm run format
```

## 📝 Environment Variables

Create a `.env` file in the root directory and specify your API base URL:

```env
VITE_API_BASE_URL=http://your-api-endpoint.com
```

---

Developed with ❤️ as part of the **TickDone** ecosystem.
