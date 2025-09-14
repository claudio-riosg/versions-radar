/**
 * Changelog Viewer Test Utilities - Co-located with changelog-viewer feature
 * 
 * Following declarative naming and Screaming Architecture principles.
 * Provides business-domain focused mocks for changelog viewing scenarios.
 */

import { vi } from 'vitest'
import type { ChangelogInfo, PackageInfo, VersionInfo } from '@infrastructure/api/types'

/**
 * Declarative changelog collections expressing business scenarios
 */
export const changelogViewerCollections = {
  // Release changelog scenarios
  majorReleaseChangelog: (): ChangelogInfo => ({
    title: 'React 18.2.0: Concurrent Features',
    content: `# React 18.2.0

## ⚡ Performance Improvements

- Automatic batching for better performance
- Concurrent rendering improvements
- Reduced bundle size by 10%

## 🐛 Bug Fixes

- Fixed memory leak in useEffect cleanup
- Improved error boundaries handling
- Better TypeScript support

## 📝 Documentation

- Updated migration guide
- New examples for concurrent features
- Performance optimization tips

## Breaking Changes

None in this release.

## Contributors

Thanks to all contributors who made this release possible!
`,
    url: 'https://github.com/facebook/react/releases/tag/v18.2.0',
    version: '18.2.0',
    publishedAt: '2023-06-14T10:00:00Z',
  }),

  prereleaseChangelogBeta: (): ChangelogInfo => ({
    title: 'React 19.0.0-beta.1: React Compiler',
    content: `# React 19.0.0-beta.1

⚠️ **This is a beta release. Use with caution in production.**

## 🚀 New Features

- React Compiler for automatic optimization
- Server Actions support
- New \`use\` hook for data fetching

## Known Issues

- Some TypeScript definitions are still in flux
- Server Components integration needs more testing

### Installation

\`\`\`bash
npm install react@beta react-dom@beta
\`\`\`

### Usage Example

\`\`\`javascript
import { use } from 'react';

function UserProfile({ userId }) {
  const user = use(fetchUser(userId));
  return <div>{user.name}</div>;
}
\`\`\`

> **Note**: Beta releases are for testing purposes. Please report issues on GitHub.
`,
    url: 'https://github.com/facebook/react/releases/tag/v19.0.0-beta.1',
    version: '19.0.0-beta.1',
    publishedAt: '2024-01-15T14:30:00Z',
  }),

  patchReleaseChangelog: (): ChangelogInfo => ({
    title: 'React 18.1.1: Security Update',
    content: `# React 18.1.1

## 🔒 Security Updates

- Fixed XSS vulnerability in server-side rendering
- Updated dependencies with security patches

## Bug Fixes

- Fixed hydration mismatch in production builds
- Improved error message clarity

This is a **recommended security update** for all users.
`,
    url: 'https://github.com/facebook/react/releases/tag/v18.1.1',
    version: '18.1.1',
    publishedAt: '2023-04-20T09:15:00Z',
  }),

  minimalChangelogContent: (): ChangelogInfo => ({
    title: 'TypeScript 4.8.0',
    content: '# TypeScript 4.8.0\n\nBug fixes and performance improvements.',
    url: 'https://github.com/microsoft/TypeScript/releases/tag/v4.8.0',
    version: '4.8.0',
    publishedAt: '2022-08-25T16:45:00Z',
  }),

  richMarkdownChangelog: (): ChangelogInfo => ({
    title: 'Angular 15.0.0: Standalone APIs',
    content: `# Angular 15.0.0

## 🎉 New Features

### Standalone Components

Create components without NgModule:

\`\`\`typescript
@Component({
  standalone: true,
  selector: 'app-photo-gallery',
  template: \`<photo-item *ngFor="let photo of photos" [src]="photo" />\`,
})
export class PhotoGalleryComponent {
  photos = ['/photo1.jpg', '/photo2.jpg'];
}
\`\`\`

### Stack Blitz Integration

> Try Angular directly in your browser with our new [StackBlitz templates](https://angular.io/start).

## Performance Improvements

- **Bundle Size**: Reduced by ~15% with tree-shaking improvements
- **Runtime**: 20% faster change detection
- **Build Time**: Up to 30% faster builds

## Migration Guide

1. Update to Angular 15
2. Run migration schematics
3. Test your application

### Before and After

| Feature | Angular 14 | Angular 15 |
|---------|------------|------------|
| Bundle Size | 130kb | 110kb |
| Build Time | 45s | 32s |
| Runtime | 100ms | 80ms |

## Breaking Changes

- Removed deprecated \`ComponentFactoryResolver\`
- Updated minimum TypeScript version to 4.8

## Contributors

Special thanks to our **250+ contributors** this release! 🙏
`,
    url: 'https://github.com/angular/angular/releases/tag/15.0.0',
    version: '15.0.0',
    publishedAt: '2022-11-16T12:00:00Z',
  }),
}

/**
 * Package and version combinations for changelog scenarios
 */
export const changelogPackageCollections = {
  reactStablePackage: (): PackageInfo => ({
    name: 'React',
    npmName: 'react',
    githubRepo: 'facebook/react',
    icon: '⚛️',
    description: 'A JavaScript library for building user interfaces',
  }),

  reactBetaPackage: (): PackageInfo => ({
    name: 'React',
    npmName: 'react',
    githubRepo: 'facebook/react',
    icon: '⚛️',
    description: 'A JavaScript library for building user interfaces',
  }),

  angularPackage: (): PackageInfo => ({
    name: 'Angular',
    npmName: '@angular/core',
    githubRepo: 'angular/angular',
    icon: '🅰️',
    description: "The modern web developer's platform",
  }),

  typescriptPackage: (): PackageInfo => ({
    name: 'TypeScript',
    npmName: 'typescript',
    githubRepo: 'microsoft/TypeScript',
    icon: '📘',
    description: 'TypeScript is a superset of JavaScript that compiles to plain JavaScript',
  }),
}

/**
 * Version information for different release scenarios
 */
export const changelogVersionCollections = {
  stableLatestVersion: (): VersionInfo => ({
    version: '18.2.0',
    publishedAt: '2023-06-14T10:00:00Z',
    isLatest: true,
    isPrerelease: false,
  }),

  prereleaseVersion: (): VersionInfo => ({
    version: '19.0.0-beta.1',
    publishedAt: '2024-01-15T14:30:00Z',
    isLatest: false,
    isPrerelease: true,
  }),

  olderStableVersion: (): VersionInfo => ({
    version: '18.1.1',
    publishedAt: '2023-04-20T09:15:00Z',
    isLatest: false,
    isPrerelease: false,
  }),

  minimalVersion: (): VersionInfo => ({
    version: '4.8.0',
    publishedAt: '2022-08-25T16:45:00Z',
    isLatest: false,
    isPrerelease: false,
  }),

  richContentVersion: (): VersionInfo => ({
    version: '15.0.0',
    publishedAt: '2022-11-16T12:00:00Z',
    isLatest: true,
    isPrerelease: false,
  }),
}

/**
 * Complete changelog viewer scenarios combining packages, versions, and changelogs
 */
export const changelogViewerScenarios = {
  successfulMajorRelease: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.stableLatestVersion(),
    changelog: changelogViewerCollections.majorReleaseChangelog(),
    isLoading: false,
    error: null,
  }),

  prereleaseWithWarnings: () => ({
    package: changelogPackageCollections.reactBetaPackage(),
    version: changelogVersionCollections.prereleaseVersion(),
    changelog: changelogViewerCollections.prereleaseChangelogBeta(),
    isLoading: false,
    error: null,
  }),

  patchReleaseUpdate: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.olderStableVersion(),
    changelog: changelogViewerCollections.patchReleaseChangelog(),
    isLoading: false,
    error: null,
  }),

  richMarkdownContent: () => ({
    package: changelogPackageCollections.angularPackage(),
    version: changelogVersionCollections.richContentVersion(),
    changelog: changelogViewerCollections.richMarkdownChangelog(),
    isLoading: false,
    error: null,
  }),

  minimalChangelog: () => ({
    package: changelogPackageCollections.typescriptPackage(),
    version: changelogVersionCollections.minimalVersion(),
    changelog: changelogViewerCollections.minimalChangelogContent(),
    isLoading: false,
    error: null,
  }),

  loadingState: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.stableLatestVersion(),
    changelog: null,
    isLoading: true,
    error: null,
  }),

  errorState: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.stableLatestVersion(),
    changelog: null,
    isLoading: false,
    error: 'Failed to load changelog. GitHub API rate limit exceeded.',
  }),

  noChangelogAvailable: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.stableLatestVersion(),
    changelog: null,
    isLoading: false,
    error: null,
  }),
}

/**
 * Navigation state scenarios for changelog viewer testing
 */
export const changelogNavigationScenarios = {
  completeNavigationState: () => ({
    selectedPackage: changelogPackageCollections.reactStablePackage(),
    selectedVersion: changelogVersionCollections.stableLatestVersion(),
    currentView: 'changelog-viewer' as const,
  }),

  missingVersionState: () => ({
    selectedPackage: changelogPackageCollections.reactStablePackage(),
    selectedVersion: null,
    currentView: 'changelog-viewer' as const,
  }),

  missingPackageState: () => ({
    selectedPackage: null,
    selectedVersion: null,
    currentView: 'changelog-viewer' as const,
  }),
}

/**
 * Interaction scenarios for user actions
 */
export const changelogInteractionScenarios = {
  retryFailedLoad: () => {
    const scenario = changelogViewerScenarios.errorState()
    const mockRetry = vi.fn()
    
    return {
      ...scenario,
      onRetry: mockRetry,
      expectedRetryCall: [scenario.package, scenario.version],
    }
  },

  navigateBackToTimeline: () => {
    const mockNavigateBack = vi.fn()
    const scenario = changelogViewerScenarios.successfulMajorRelease()
    
    return {
      ...scenario,
      onNavigateBack: mockNavigateBack,
      expectedBackNavigation: true,
    }
  },

  externalGitHubLink: () => {
    const scenario = changelogViewerScenarios.successfulMajorRelease()
    
    return {
      ...scenario,
      expectedGitHubUrl: scenario.changelog!.url,
      shouldOpenInNewTab: true,
    }
  },
}

/**
 * Edge case scenarios for robust testing
 */
export const changelogEdgeCases = {
  veryLongChangelog: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.stableLatestVersion(),
    changelog: {
      ...changelogViewerCollections.majorReleaseChangelog(),
      content: Array(50).fill('## Section\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)).join('\n\n'),
    },
    isLoading: false,
    error: null,
  }),

  emptyChangelogContent: () => ({
    package: changelogPackageCollections.typescriptPackage(),
    version: changelogVersionCollections.minimalVersion(),
    changelog: {
      ...changelogViewerCollections.minimalChangelogContent(),
      content: '',
    },
    isLoading: false,
    error: null,
  }),

  specialCharactersInContent: () => ({
    package: changelogPackageCollections.reactStablePackage(),
    version: changelogVersionCollections.stableLatestVersion(),
    changelog: {
      ...changelogViewerCollections.majorReleaseChangelog(),
      content: '# Release 🚀\n\n- Feature with émojis 🎉\n- Code: `<Component />` & "quotes"\n- Link: [GitHub](https://github.com)',
    },
    isLoading: false,
    error: null,
  }),
}

/**
 * Mock function creators for hooks and handlers
 */
export const createChangelogMockHandlers = () => {
  const mockFetchChangelog = vi.fn()
  const mockNavigateBack = vi.fn()
  const mockRetry = vi.fn()

  return {
    fetchChangelog: mockFetchChangelog,
    navigateBack: mockNavigateBack,
    retry: mockRetry,
    // Helper to reset all mocks
    resetAll: () => {
      mockFetchChangelog.mockReset()
      mockNavigateBack.mockReset()
      mockRetry.mockReset()
    },
  }
}