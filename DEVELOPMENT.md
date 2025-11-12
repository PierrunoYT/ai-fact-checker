# AI Fact Checker - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-fact-checker
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cp backend/env.template backend/.env
   # Edit backend/.env and add your API keys (Perplexity and optionally Exa)
   
   # Frontend environment (optional)
   cp frontend/env.template frontend/.env
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This starts both backend (port 3000) and frontend (port 5173) servers.

## 🏗️ Project Structure

```
ai-fact-checker/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Configuration constants
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Main server file
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── api/           # API client and services
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app component
│   ├── .env.example       # Environment variables template
│   └── package.json
├── start-dev.js           # Development server launcher
└── package.json           # Root package.json
```

## 🛠️ Development Workflow

### Available Scripts

**Root level:**
- `npm run dev` - Start both backend and frontend in development mode
- `npm run build` - Build both backend and frontend for production
- `npm run test` - Run tests for both backend and frontend

**Backend:**
- `npm run dev` - Start backend development server
- `npm run build` - Build backend for production
- `npm run start` - Start production server
- `npm run test` - Run backend tests
- `npm run lint` - Lint backend code
- `npm run format` - Format backend code

**Frontend:**
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run test` - Run frontend tests
- `npm run lint` - Lint frontend code
- `npm run format` - Format frontend code

### Code Quality

The project uses several tools to maintain code quality:

- **TypeScript** - Type safety and better developer experience
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Vitest** (frontend) / **Jest** (backend) - Testing frameworks

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push branch: `git push origin feature/your-feature-name`
4. Create pull request

### Commit Convention

We follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run frontend tests only
cd frontend && npm run test

# Run backend tests only
cd backend && npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

**Frontend tests** use Vitest and React Testing Library:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Backend tests** use Jest:
```typescript
import { describe, it, expect } from '@jest/globals';
import { validateStatement } from './validation';

describe('validateStatement', () => {
  it('should validate correct statements', () => {
    expect(() => validateStatement('Valid statement')).not.toThrow();
  });
});
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PERPLEXITY_API_KEY=your_api_key_here
EXA_API_KEY=your_exa_api_key_here  # Optional, for web search
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=AI Fact Checker
```

### TypeScript Configuration

Both frontend and backend use strict TypeScript configuration with:
- Strict type checking enabled
- Path mapping for clean imports
- Modern ES modules support

## 🐛 Debugging

### Backend Debugging
1. Use VS Code debugger with the provided launch configuration
2. Add breakpoints in TypeScript files
3. Start debugging with F5

### Frontend Debugging
1. Use browser developer tools
2. React Developer Tools extension
3. Console logging with proper log levels

### Common Issues

**Port conflicts:**
- Backend default: 3000
- Frontend default: 5173
- Change ports in environment variables if needed

**API connection issues:**
- Check if backend server is running
- Verify CORS configuration
- Check network requests in browser dev tools

## 📦 Building for Production

### Backend Build
```bash
cd backend
npm run build
npm start
```

### Frontend Build
```bash
cd frontend
npm run build
npm run preview
```

### Full Production Build
```bash
npm run build
```

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure CORS for production domains
3. Set up SSL certificates
4. Configure reverse proxy (nginx/Apache)

### Docker Deployment
```dockerfile
# Example Dockerfile structure
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)

## 🆘 Getting Help

- Check existing issues on GitHub
- Review this documentation
- Ask questions in team chat
- Create detailed bug reports with reproduction steps
