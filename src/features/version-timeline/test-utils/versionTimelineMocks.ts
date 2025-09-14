/**
 * Version Timeline Test Mocks - Declarative Business Domain Mocks
 * 
 * Co-located with version-timeline feature following Scope Rule.
 * Names express version timeline business scenarios and user interactions.
 */

import { vi } from 'vitest'
import type { VersionInfo } from '@infrastructure/api/types'

// ==============================================================================
// VERSION INFO BUSINESS DOMAIN MOCKS
// ==============================================================================

/** Creates realistic version info for timeline testing */
export const createVersionInfoMock = (overrides: Partial<VersionInfo> = {}): VersionInfo => ({
  version: '18.0.0',
  publishedAt: '2022-03-29T00:00:00Z',
  isLatest: false,
  isPrerelease: false,
  ...overrides,
})

/** Version collections representing real timeline scenarios */
export const versionTimelineCollections = {
  /** Empty timeline state */
  emptyTimeline: (): VersionInfo[] => [],

  /** Single version in timeline */
  singleVersionTimeline: (): VersionInfo[] => [
    createVersionInfoMock({
      version: '18.2.0',
      publishedAt: '2024-01-15T14:30:00Z',
      isLatest: true,
      isPrerelease: false,
    })
  ],

  /** Complete version timeline with major releases */
  majorReleasesTimeline: (): VersionInfo[] => [
    createVersionInfoMock({
      version: '18.2.0',
      publishedAt: '2024-01-15T14:30:00Z',
      isLatest: true,
      isPrerelease: false,
    }),
    createVersionInfoMock({
      version: '18.1.0',
      publishedAt: '2023-12-10T10:15:00Z',
      isLatest: false,
      isPrerelease: false,
    }),
    createVersionInfoMock({
      version: '18.0.0',
      publishedAt: '2022-03-29T00:00:00Z',
      isLatest: false,
      isPrerelease: false,
    }),
  ],

  /** Timeline with prerelease versions */
  timelineWithPrereleases: (): VersionInfo[] => [
    createVersionInfoMock({
      version: '19.0.0-beta.2',
      publishedAt: '2024-01-20T16:45:00Z',
      isLatest: false,
      isPrerelease: true,
    }),
    createVersionInfoMock({
      version: '18.2.0',
      publishedAt: '2024-01-15T14:30:00Z',
      isLatest: true,
      isPrerelease: false,
    }),
    createVersionInfoMock({
      version: '18.2.0-rc.1',
      publishedAt: '2024-01-10T09:20:00Z',
      isLatest: false,
      isPrerelease: true,
    }),
  ],

  /** Timeline with recent versions (NEW badges) */
  timelineWithRecentVersions: (): VersionInfo[] => {
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 15) // 15 days ago

    return [
      createVersionInfoMock({
        version: '18.2.1',
        publishedAt: recentDate.toISOString(),
        isLatest: true,
        isPrerelease: false,
      }),
      createVersionInfoMock({
        version: '18.2.0',
        publishedAt: '2023-12-10T10:15:00Z',
        isLatest: false,
        isPrerelease: false,
      }),
    ]
  },

  /** Timeline with mixed version states */
  mixedVersionStatesTimeline: (): VersionInfo[] => {
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 10)

    return [
      createVersionInfoMock({
        version: '19.0.0-alpha.1',
        publishedAt: recentDate.toISOString(),
        isLatest: false,
        isPrerelease: true,
      }),
      createVersionInfoMock({
        version: '18.2.0',
        publishedAt: '2024-01-15T14:30:00Z',
        isLatest: true,
        isPrerelease: false,
      }),
      createVersionInfoMock({
        version: '18.1.5',
        publishedAt: recentDate.toISOString(),
        isLatest: false,
        isPrerelease: false,
      }),
      createVersionInfoMock({
        version: '18.0.0',
        publishedAt: '2022-03-29T00:00:00Z',
        isLatest: false,
        isPrerelease: false,
      }),
    ]
  },

  /** Large timeline for testing performance */
  extensiveVersionTimeline: (): VersionInfo[] => {
    const versions: VersionInfo[] = []
    
    // Generate 20 versions with realistic progression
    for (let i = 20; i >= 1; i--) {
      const isLatest = i === 20
      const isPrerelease = i > 18 && Math.random() > 0.7
      const majorVersion = Math.floor(i / 5) + 17
      const minorVersion = i % 5
      
      versions.push(createVersionInfoMock({
        version: `${majorVersion}.${minorVersion}.0${isPrerelease ? '-beta.1' : ''}`,
        publishedAt: new Date(2024 - Math.floor(i/5), (i % 12), 15).toISOString(),
        isLatest,
        isPrerelease,
      }))
    }
    
    return versions
  }
}

// ==============================================================================
// VERSION SELECTION BUSINESS DOMAIN MOCKS
// ==============================================================================

/** Creates mock version selection handler for testing user interactions */
export const createVersionSelectionHandler = () => vi.fn()

/** Timeline interaction scenarios for testing different UI behaviors */
export const versionTimelineInteractionScenarios = {
  /** Timeline with selectable versions */
  selectableVersionsTimeline: () => ({
    versions: versionTimelineCollections.majorReleasesTimeline(),
    onVersionSelect: createVersionSelectionHandler(),
  }),

  /** Empty timeline interaction */
  emptyTimelineInteraction: () => ({
    versions: versionTimelineCollections.emptyTimeline(),
    onVersionSelect: createVersionSelectionHandler(),
  }),

  /** Timeline with prerelease interactions */
  prereleaseTimelineInteraction: () => ({
    versions: versionTimelineCollections.timelineWithPrereleases(),
    onVersionSelect: createVersionSelectionHandler(),
  }),

  /** Large timeline performance testing */
  extensiveTimelineInteraction: () => ({
    versions: versionTimelineCollections.extensiveVersionTimeline(),
    onVersionSelect: createVersionSelectionHandler(),
  }),
}

// ==============================================================================
// TIMELINE FILTERING AND CONTROLS MOCKS
// ==============================================================================

/** Timeline filter scenarios for testing controls */
export const timelineFilteringScenarios = {
  /** Default filtering state */
  defaultTimelineFilters: () => ({
    includePrerelease: true,
    includeLatest: true,
    sortBy: 'date' as const,
    sortOrder: 'desc' as const,
  }),

  /** Hide prereleases filter */
  stableOnlyTimelineFilters: () => ({
    includePrerelease: false,
    includeLatest: true,
    sortBy: 'date' as const,
    sortOrder: 'desc' as const,
  }),

  /** Version-sorted timeline */
  versionSortedTimelineFilters: () => ({
    includePrerelease: true,
    includeLatest: true,
    sortBy: 'version' as const,
    sortOrder: 'asc' as const,
  }),

  /** Custom date range filtering */
  dateRangeTimelineFilters: () => ({
    includePrerelease: true,
    includeLatest: true,
    dateRange: {
      start: new Date('2023-01-01'),
      end: new Date('2024-12-31'),
    },
    sortBy: 'date' as const,
    sortOrder: 'desc' as const,
  }),
}

// ==============================================================================
// CONTAINER HOOK SCENARIOS FOR VERSION TIMELINE TESTING
// ==============================================================================

/** Version timeline hook scenarios representing real application states */
export const versionTimelineHookScenarios = {
  /** Timeline loading initial version data */
  timelineInitialLoading: () => ({
    versions: versionTimelineCollections.emptyTimeline(),
    isLoading: true,
    error: null,
    lastRefresh: undefined,
    fetchVersionHistory: vi.fn(),
    packageInfo: {
      npmName: 'react',
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      icon: '⚛️',
      githubRepo: 'facebook/react',
    },
  }),

  /** Timeline successfully loaded with versions */
  timelineLoadedSuccessfully: () => ({
    versions: versionTimelineCollections.majorReleasesTimeline(),
    isLoading: false,
    error: null,
    lastRefresh: new Date('2024-01-15T14:30:00Z'),
    fetchVersionHistory: vi.fn(),
    packageInfo: {
      npmName: 'react',
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      icon: '⚛️',
      githubRepo: 'facebook/react',
    },
  }),

  /** Timeline failed to load versions */
  timelineLoadingFailed: () => ({
    versions: versionTimelineCollections.emptyTimeline(),
    isLoading: false,
    error: 'Failed to fetch version history from NPM registry',
    lastRefresh: undefined,
    fetchVersionHistory: vi.fn(),
    packageInfo: {
      npmName: 'react',
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      icon: '⚛️',
      githubRepo: 'facebook/react',
    },
  }),

  /** Timeline refreshing version data */
  timelineRefreshingVersions: () => ({
    versions: versionTimelineCollections.majorReleasesTimeline(),
    isLoading: true,
    error: null,
    lastRefresh: new Date('2024-01-15T14:25:00Z'),
    fetchVersionHistory: vi.fn(),
    packageInfo: {
      npmName: 'react',
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      icon: '⚛️',
      githubRepo: 'facebook/react',
    },
  }),

  /** Timeline with filtered versions */
  timelineWithFilteredVersions: () => ({
    versions: versionTimelineCollections.timelineWithPrereleases(),
    isLoading: false,
    error: null,
    lastRefresh: new Date('2024-01-15T14:30:00Z'),
    fetchVersionHistory: vi.fn(),
    packageInfo: {
      npmName: 'react',
      name: 'React',
      description: 'A JavaScript library for building user interfaces',
      icon: '⚛️',
      githubRepo: 'facebook/react',
    },
    activeFilters: timelineFilteringScenarios.stableOnlyTimelineFilters(),
  }),
}