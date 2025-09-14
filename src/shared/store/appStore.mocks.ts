/**
 * Zustand Store Mocks - Co-located with appStore.ts
 *
 * Store mocks live with the store they mock.
 * Used by 2+ features for testing.
 */

import { vi } from 'vitest'
import type { RadarStore, RadarNavigationState, CacheEntry } from './appStore'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'

/** Mock navigation state factory */
export const createMockNavigationState = (overrides: Partial<RadarNavigationState> = {}): RadarNavigationState => ({
  currentView: 'dashboard',
  selectedPackage: null,
  selectedVersion: null,
  viewHistory: ['dashboard'],
  ...overrides,
})

/** Mock package info factory */
export const createMockPackageInfo = (overrides: Partial<PackageInfo> = {}): PackageInfo => ({
  npmName: 'react',
  name: 'React',
  description: 'A JavaScript library for building user interfaces',
  icon: '⚛️',
  githubRepo: 'facebook/react',
  ...overrides,
})

/** Mock version info factory */
export const createMockVersionInfo = (overrides: Partial<VersionInfo> = {}): VersionInfo => ({
  version: '18.0.0',
  publishedAt: '2022-03-29T00:00:00Z',
  isLatest: false,
  isPrerelease: false,
  ...overrides,
})

/** Mock cache entry factory */
export const createMockCacheEntry = <T = unknown>(
  data: T,
  overrides: Partial<Pick<CacheEntry<T>, 'timestamp' | 'ttl'>> = {}
): CacheEntry<T> => ({
  data,
  timestamp: Date.now(),
  ttl: 5 * 60 * 1000, // 5 minutes default
  ...overrides,
})

/** Mock store factory - creates a complete mock store */
export const createMockRadarStore = (overrides: Partial<RadarStore> = {}): RadarStore => {
  const mockStore: RadarStore = {
    navigation: createMockNavigationState(),
    packageRadarCache: new Map(),
    versionTimelineCache: new Map(),
    changelogContentCache: new Map(),
    
    // Navigation actions - spies by default
    navigateToPackageDashboard: vi.fn(),
    navigateToVersionTimeline: vi.fn(),
    navigateToChangelogViewer: vi.fn(),
    navigateToPreviousRadarView: vi.fn(),
    
    // Cache actions - spies by default
    storePackageRadarData: vi.fn(),
    retrievePackageRadarData: vi.fn(() => null),
    storeVersionTimeline: vi.fn(),
    retrieveVersionTimeline: vi.fn(() => null),
    storeChangelogContent: vi.fn(),
    retrieveChangelogContent: vi.fn(() => null),
    
    // Cache management - spies by default
    clearPackageRadarCache: vi.fn(),
    clearExpiredRadarCache: vi.fn(),
    getRadarCacheMetrics: vi.fn(() => ({
      packageCacheSize: 0,
      versionCacheSize: 0,
      changelogCacheSize: 0,
      totalEntries: 0,
    })),
    
    ...overrides,
  }
  
  return mockStore
}

/** Preset mock scenarios for common testing situations */
export const mockScenarios = {
  /** Dashboard view with no selections */
  dashboard: (): RadarStore => createMockRadarStore({
    navigation: createMockNavigationState({
      currentView: 'dashboard',
      selectedPackage: null,
      selectedVersion: null,
      viewHistory: ['dashboard'],
    }),
  }),
  
  /** Timeline view with selected package */
  timeline: (packageInfo?: PackageInfo): RadarStore => createMockRadarStore({
    navigation: createMockNavigationState({
      currentView: 'timeline',
      selectedPackage: packageInfo || createMockPackageInfo(),
      selectedVersion: null,
      viewHistory: ['dashboard', 'timeline'],
    }),
  }),
  
  /** Changelog view with selected package and version */
  changelog: (packageInfo?: PackageInfo, version?: VersionInfo): RadarStore => createMockRadarStore({
    navigation: createMockNavigationState({
      currentView: 'changelog',
      selectedPackage: packageInfo || createMockPackageInfo(),
      selectedVersion: version || createMockVersionInfo(),
      viewHistory: ['dashboard', 'timeline', 'changelog'],
    }),
  }),
  
  /** Store with cached data */
  withCache: (cacheData: {
    packages?: Array<[string, unknown]>
    versions?: Array<[string, VersionInfo[]]>
    changelogs?: Array<[string, string]>
  } = {}): RadarStore => {
    const packageCache = new Map()
    const versionCache = new Map()
    const changelogCache = new Map()
    
    // Populate package cache
    cacheData.packages?.forEach(([key, data]) => {
      packageCache.set(key, createMockCacheEntry(data))
    })
    
    // Populate version cache
    cacheData.versions?.forEach(([key, versions]) => {
      versionCache.set(key, createMockCacheEntry(versions))
    })
    
    // Populate changelog cache
    cacheData.changelogs?.forEach(([key, changelog]) => {
      changelogCache.set(key, createMockCacheEntry(changelog))
    })
    
    return createMockRadarStore({
      packageRadarCache: packageCache,
      versionTimelineCache: versionCache,
      changelogContentCache: changelogCache,
    })
  },
}

/** Zustand mock utilities for testing hooks */
export const mockZustandHooks = {
  /** Mock useRadarNavigation hook */
  mockUseRadarNavigation: (navigationState?: Partial<RadarNavigationState>) => ({
    navigation: createMockNavigationState(navigationState),
    navigateToPackageDashboard: vi.fn(),
    navigateToVersionTimeline: vi.fn(),
    navigateToChangelogViewer: vi.fn(),
    navigateToPreviousRadarView: vi.fn(),
  }),
  
  /** Mock useRadarCache hook */
  mockUseRadarCache: () => ({
    storePackageRadarData: vi.fn(),
    retrievePackageRadarData: vi.fn(() => null),
    storeVersionTimeline: vi.fn(),
    retrieveVersionTimeline: vi.fn(() => null),
    storeChangelogContent: vi.fn(),
    retrieveChangelogContent: vi.fn(() => null),
    clearPackageRadarCache: vi.fn(),
    clearExpiredRadarCache: vi.fn(),
    getRadarCacheMetrics: vi.fn(() => ({
      packageCacheSize: 0,
      versionCacheSize: 0,
      changelogCacheSize: 0,
      totalEntries: 0,
    })),
  }),
}