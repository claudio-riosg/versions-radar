# Versions Radar - Project Documentation

## Overview

**Versions Radar** is a React application that tracks and visualizes versions of popular JavaScript/TypeScript packages (React, Angular, TypeScript). It consumes public APIs (NPM Registry and GitHub Releases) to display up-to-date version information and changelogs with markdown rendering.

## Recent Refactoring (January 2025)

### Screaming Architecture & Declarative Naming Improvements

The project underwent a comprehensive refactoring to improve **screaming architecture** and **declarative naming** principles:

#### Component Naming Improvements
- **`TimelineControls`** → **`VersionTimelineFilters`** - Now clearly expresses filtering functionality for version timeline
- **`TimelineChart`** → **`VersionTimelineVisualization`** - Better communicates visual timeline representation
- **`VersionPoint`** → **`PackageVersionMarker`** - More descriptive of interactive version markers in timeline

#### Hook Standardization
- **`useVersionHistory`** → **`useVersionTimelineRadar`** - Consistent radar branding and clear timeline purpose
- **`useChangelog`** → **`useChangelogRadar`** - Unified radar terminology

#### Business Domain Modeling
- **Models Consolidation**: All feature `types.ts` files consolidated into comprehensive `models.ts` files
- **Domain-Focused Documentation**: Each model file includes clear business domain descriptions
- **Consistent Pattern**: Unified approach to business domain modeling across all features

#### Code Quality Improvements
- **Comment Cleanup**: Removed agent/TDD references, keeping only functionality-focused descriptions
- **Concise Documentation**: Comments now focus on what each component does, not implementation details
- **Business Intent**: All naming now expresses business purpose rather than technical implementation

### Validation Results
- ✅ **Build Success**: All imports resolved correctly after refactoring
- ✅ **403 Tests Passing**: Complete functionality preservation
- ✅ **18 Test Files Updated**: All tests updated with new component and hook names

## Project Architecture

### Core Architectural Principles

1. **"Scope determines structure"** - Code used by 2+ features goes in shared directories, code used by 1 feature stays local
2. **Container/Presentational Pattern** - Clear separation between business logic (containers) and UI (presentational components)
3. **Screaming Architecture** - Feature names describe business functionality, not technical implementation
4. **Business Domain Services** - Complex logic extracted to dedicated service classes

### Directory Structure

```
src/
  features/                    # Business features (Screaming Architecture)
    package-dashboard/         # Latest versions overview
      package-dashboard.tsx    # Main container (matches feature name)
      components/              # Feature-specific components
        PackageGrid.tsx        # Package overview grid
        PackageCard.tsx        # Individual package display
        PackageVersionsRefresh.tsx # Package refresh functionality
      hooks/                   # Feature-specific hooks
        usePackageVersionsRadar.ts
      services/               # Feature-specific services
      models.ts              # Business domain models (consolidated)

    version-timeline/          # Version history visualization
      version-timeline.tsx     # Main container
      components/              # Timeline-specific components
        VersionTimelineFilters.tsx     # Version filtering controls
        VersionTimelineVisualization.tsx # Visual timeline display
        PackageVersionMarker.tsx       # Interactive version markers
      hooks/
        useVersionTimelineRadar.ts
      models.ts              # Timeline business models

    changelog-viewer/          # GitHub release notes viewer
      changelog-viewer.tsx     # Main container
      components/              # Changelog-specific components
        ChangelogContent.tsx   # Markdown content display
        VersionHeader.tsx      # Version information header
        NavigationControls.tsx # Navigation elements
      hooks/
        useChangelogRadar.ts
      models.ts              # Changelog business models

  shared/                      # ONLY when used by 2+ features
    components/                # UI components used across features
      ErrorMessage.tsx         # Error display (used by 3 features)
      LoadingSpinner.tsx       # Loading indicator (used by 2 features)
      BackButton.tsx          # Navigation back (used by 2 features)
    services/                  # Business logic shared across features
      ErrorHandlingService.ts  # Centralized error processing
      packageRadarCacheService.ts # Caching functionality
    store/                     # Application state management
      appStore.ts             # Zustand store with navigation and caching

  infrastructure/              # Cross-cutting concerns
    api/                       # External API clients
      npmRegistry.ts          # NPM Registry API client
      githubReleases.ts       # GitHub Releases API client
      types.ts               # API response types
    config/                    # Application configuration
      packages.ts             # Tracked packages configuration
```

### Component Architecture Patterns

#### Container/Presentational Separation

**Containers** (Business Logic):
- `src/features/package-dashboard/package-dashboard.tsx`
- `src/features/version-timeline/version-timeline.tsx`
- `src/features/changelog-viewer/changelog-viewer.tsx`

**Presentational Components** (Pure UI):
- All components in `/components` directories
- Receive props and render UI
- No direct API calls or complex business logic

**Shared Components** (Multi-feature):
- Only components genuinely used by 2+ features
- Strict adherence to Scope Rule for placement

#### Business Domain Services

**VersionFilteringService**: Handles complex version timeline operations
- `filterVersionHistory()` - Filtering and sorting with user preferences
- `analyzeVersionHistory()` - Statistics (total/stable/prerelease counts)
- `detectReleasePatterns()` - Release frequency analysis for insights

**ErrorHandlingService**: Centralized error processing
- Intelligent error categorization
- Context-aware user messaging
- Automatic retry logic
- Developer-friendly logging

**PackageRadarCacheService**: Optimized caching system
- TTL-based cache management
- Package data caching for performance
- Cache invalidation strategies

## Technical Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **Vite** for build tooling
- **Vitest + Testing Library** for testing
- **Zustand** for state management
- **react-markdown + remark-gfm** for changelog rendering
- **Path aliases**: `@features`, `@shared`, `@infrastructure`

## API Integration

### NPM Registry API
- **Endpoint**: `https://registry.npmjs.org/{packageName}`
- **Purpose**: Package version history and publication dates
- **Client**: `src/infrastructure/api/npmRegistry.ts`

### GitHub Releases API
- **Endpoint**: `https://api.github.com/repos/{owner}/{repo}/releases`
- **Purpose**: Detailed changelogs and release notes
- **Client**: `src/infrastructure/api/githubReleases.ts`
- **Rate limits**: Consider adding GitHub token for production

### Tracked Packages Configuration
Packages configured in `src/infrastructure/config/packages.ts`:
- **React** (`react` → `facebook/react`)
- **Angular** (`@angular/core` → `angular/angular`)
- **TypeScript** (`typescript` → `microsoft/TypeScript`)

## Error Handling Architecture

### Centralized Error Processing
The `ErrorHandlingService` provides comprehensive error management:

**Error Categories**:
- `network` - Connection and timeout issues
- `api-rate-limit` - API rate limiting scenarios
- `not-found` - Resource not found errors
- `validation` - Data validation failures
- `unknown` - Fallback category

**Features**:
- Context-aware messaging for different error types
- Automatic retry detection with appropriate delays
- Consistent error handling across all hooks
- User-friendly messaging while preserving developer context

**Usage Pattern**:
```typescript
const handleError = ErrorHandlingService.createHookErrorHandler(setState, 'context')
try {
  // API call
} catch (error) {
  handleError(error) // Automatic categorization + user-friendly messaging
}
```

## Navigation & State Management

### Current Implementation
Simple state-based routing using Zustand:
```
Dashboard → Timeline → Changelog
    ↓         ↓         ↓
 (NPM API) (NPM API) (GitHub API)
```

### Store Architecture
- **Navigation State**: Current view and view history tracking
- **Cache Management**: Optimized caching with TTL for different data types
- **Performance**: Strategic caching reduces API calls and improves UX

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build
npm run preview

# Testing
npm run test          # Interactive mode with watch
npm run test:run      # Single run (CI)
npm run test:ui       # Visual test interface
npm run test:coverage # Coverage report

# Code quality
npm run lint
```

## Testing Strategy

- **Unit Tests**: 403 tests across 18 test files with comprehensive coverage
- **API Client Testing**: Full coverage for NPM Registry and GitHub API clients
- **Component Testing**: All components tested with React Testing Library
- **Mock Strategy**: Comprehensive mocking for external dependencies
- **Edge Cases**: Network errors, malformed data, rate limits handled

## Architectural Decision Records

### Why Scope Rule vs Feature Slice Design?
This project deliberately uses **Scope Rule** instead of Feature-Sliced Design because:
- **Simpler structure** for 3-5 features
- **Less "analysis paralysis"** when making placement decisions
- **Feature names immediately communicate business purpose**
- **Shared code only created when actually needed** by multiple features

### Component Naming Philosophy
- **Declarative over Technical**: `VersionTimelineFilters` not `TimelineControls`
- **Business Domain Focus**: `PackageVersionMarker` not `VersionPoint`
- **Consistent Branding**: All hooks use `Radar` suffix for unified terminology
- **Immediate Recognition**: Names should immediately communicate business purpose

### Business Logic Extraction
- **Service Classes**: Complex logic extracted to dedicated service classes
- **Pure Functions**: Stateless business logic as pure functions when possible
- **Hook Utilities**: Consistent error handling and state management patterns
- **Domain Boundaries**: Clear separation between UI and business logic

## Styling & UI Guidelines

- **Tailwind CSS v4** with custom theme variables
- **Typography**: `@tailwindcss/typography` plugin for markdown rendering
- **Responsive**: Mobile-first approach with systematic breakpoints
- **Microinteractions**: Hover effects and smooth transitions
- **Custom Colors**: `--color-radar-blue`, `--color-radar-gray`, `--color-radar-dark`
- **Component Consistency**: Shared styling patterns across features

## Development Best Practices

### Naming Conventions
1. **Use declarative names** that express business intent
2. **Be specific**: `getPublishedReleases` not `getReleases`
3. **Maintain consistency**: All radar hooks use `Radar` suffix
4. **Express purpose**: Component names should communicate functionality

### Component Development
1. **Scope Rule Compliance**: Only move components to `shared/` when actually used by 2+ features
2. **Container Naming**: Main containers MUST match their feature directory name exactly
3. **Pure Presentational**: Components in `/components` should be pure UI receiving props
4. **Business Logic**: Extract complex logic to dedicated service classes

### Error Handling
1. **Always use centralized `ErrorHandlingService`**
2. **Consistent hook error handling** with `createHookErrorHandler()`
3. **User-friendly messaging** while preserving developer context
4. **Proper error categorization** for different scenarios

### Testing Guidelines
1. **Test business logic** not implementation details
2. **Mock external dependencies** comprehensively
3. **Cover edge cases** including error scenarios
4. **Test user interactions** not internal component state

## File Naming Patterns

### Components
- **Containers**: `feature-name.tsx` (matches directory)
- **Presentational**: `ComponentName.tsx` (PascalCase)
- **Tests**: `ComponentName.test.tsx` (matches component name)

### Hooks
- **Pattern**: `useBusinessPurposeRadar.ts`
- **Examples**: `useVersionTimelineRadar`, `useChangelogRadar`, `usePackageVersionsRadar`

### Services
- **Pattern**: `BusinessPurposeService.ts`
- **Examples**: `ErrorHandlingService`, `VersionFilteringService`

### Models
- **File**: `models.ts` (consistent across features)
- **Content**: Business domain interfaces and types
- **Documentation**: Clear business purpose descriptions

This documentation reflects the current state of the project after the January 2025 refactoring that significantly improved the screaming architecture and declarative naming throughout the codebase.