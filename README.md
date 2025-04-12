# Turborepo Monorepo

This repository is a monorepo powered by [Turborepo](https://turbo.build/repo). It includes multiple projects that are part of a larger ecosystem, making it easier to manage shared dependencies, tooling, and configurations.

## Projects

### Frontend

- **`trading-card-jotas-front`**: The frontend for the trading card game platform built with React and Next.js.

### Backend

- **`trading-card-jotas-back`**: The backend API/websockets for managing game logic, user accounts, and data persistence built with Node.js, Express and Prisma.

### Shared Types

- **`trading-card-jotas-types`**: A package containing TypeScript types used by both frontend and backend to maintain consistent data structures across projects.

## Getting Started

### Prerequisites

1. **Node.js** (Recommended version: 16.x or later)
2. **npm**

### Installing Dependencies

Run the following command from the root of the repo to install dependencies for all packages:

```bash
npm install
```

Now to run everything in parallel, just run

```bash
npm run dev
```
