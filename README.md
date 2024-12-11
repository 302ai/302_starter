# 302 Starter - Next.js Enterprise Boilerplate

A comprehensive Next.js starter project featuring essential enterprise-grade architectures and integrations. Built with modern best practices and a focus on developer experience.

## Features

### 🔐 Authentication

- NextAuth.js integration with credentials provider
- Protected routes and middleware
- Type-safe authentication hooks
- Persistent session management

### 🎨 Theme Management

- Dark/Light mode support
- System preference detection
- Persistent theme settings
- Tailwind CSS integration

### 🌐 Internationalization (i18n)

- Multi-language support (en, es, zh)
- Dynamic language switching
- SEO-friendly URLs with language prefixes
- Automatic language detection
- Type-safe translations

### 📊 State Management

- Jotai for atomic state management
- Persistent storage integration
- Type-safe state hooks
- Centralized store organization

### 📝 Logging

- Scoped logger utility
- Development/Production modes
- Error boundary integration
- Console formatting

### 🔧 Development Tools

- ESLint configuration for TypeScript and React
- Prettier code formatting
- Husky pre-commit hooks
- lint-staged for staged files
- Commitlint for conventional commits

### 🐳 Docker Support

- Multi-stage build optimization
- Production-ready configuration
- Security best practices
- Environment variable management

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm
- Docker (optional, for containerization)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd 302-starter
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
pnpm dev
```

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t 302-starter .
```

2. Run the container:

```bash
docker run -p 3000:3000 302-starter
```

## Project Structure

```
src/
├── api/            # API routes and client configurations
├── app/            # Next.js 13+ app directory
├── components/     # Reusable UI components
│   ├── forms/      # Form components
│   └── global/     # Global components (theme, i18n)
├── constants/      # Application constants
├── hooks/          # Custom React hooks
│   ├── auth/       # Authentication hooks
│   └── global/     # Global utility hooks
├── i18n/           # Internationalization utilities
│   └── messages/   # Translation files
├── stores/         # State management
│   └── slices/     # Store slices (config, user, language)
└── utils/          # Utility functions
```

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build production application
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
- `pnpm lint:fix`: Fix ESLint errors
- `pnpm format`: Format code with Prettier
- `pnpm format:check`: Check code formatting

## Environment Variables

Required environment variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

See `.env.example` for all available options.

## Contributing

1. Create a feature branch
2. Commit changes following conventional commits
3. Push to the branch
4. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
