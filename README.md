# Versions Radar

A React application that tracks and visualizes versions of popular JavaScript/TypeScript packages. Monitor React, Angular, and TypeScript releases with detailed version history and changelog viewing capabilities.

## Features

- **Package Dashboard**: Overview of latest versions for React, Angular, and TypeScript
- **Version Timeline**: Interactive visualization of package version history with filtering
- **Changelog Viewer**: Detailed release notes and changelogs from GitHub releases
- **Real-time Data**: Fetches live data from NPM Registry and GitHub APIs
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite** for build tooling and development
- **Vitest + Testing Library** for testing
- **react-markdown** for changelog rendering
- **Zustand** for state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd versions-radar

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Project Structure

```
src/
├── features/                # Business features
│   ├── package-dashboard/   # Latest versions overview
│   ├── version-timeline/    # Version history visualization
│   └── changelog-viewer/    # Release notes viewer
├── shared/                  # Reusable components and services
│   ├── components/          # UI components
│   ├── services/            # Business logic
│   └── store/              # Global state management
└── infrastructure/          # Cross-cutting concerns
    ├── api/                # External API clients
    └── config/             # Application configuration
```

## Architecture

The project follows **Scope Rule** principles:
- Code used by 1 feature stays local
- Code used by 2+ features goes in `shared/`
- Infrastructure handles cross-cutting concerns

### Key Components

- **Package Dashboard**: Main entry point showing latest versions
- **Version Timeline**: Interactive chart with filtering capabilities
- **Changelog Viewer**: Markdown rendering of GitHub release notes
- **Error Handling**: Centralized error management with user-friendly messages

## API Integration

### NPM Registry API
- Fetches package version history and publication dates
- Endpoint: `https://registry.npmjs.org/{packageName}`

### GitHub Releases API
- Retrieves detailed changelogs and release notes
- Endpoint: `https://api.github.com/repos/{owner}/{repo}/releases`
- Rate limit considerations for production use

## Testing

- Unit tests for all components and services
- Integration tests for business logic
- Mocked external API calls for reliability

```bash
npm run test:coverage  # View test coverage report
```

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint + Prettier for code consistency
- Husky pre-commit hooks for quality assurance
- Conventional commits with commitlint

### Component Patterns
- Container/Presentational separation
- Custom hooks for business logic
- Centralized error handling
- SVG sprite icon system for performance

## License

MIT License - see LICENSE file for details