/**
 * Package Dashboard Test Mocks - Declarative Business Domain Mocks
 * 
 * Co-located with package-dashboard feature following Scope Rule.
 * Names express business purpose and testing scenarios clearly.
 */

import { vi } from 'vitest'
import type { DashboardPackage } from '../models'

// ==============================================================================
// DASHBOARD PACKAGE BUSINESS DOMAIN MOCKS
// ==============================================================================

/** Creates mock dashboard package with business-realistic data */
export const createDashboardPackageMock = (overrides: Partial<DashboardPackage> = {}): DashboardPackage => ({
  npmName: 'react',
  name: 'React',
  description: 'A JavaScript library for building user interfaces',
  icon: '⚛️',
  githubRepo: 'facebook/react',
  latestVersion: '18.0.0',
  isLoading: false,
  error: undefined,
  ...overrides,
})

/** Package collections representing real dashboard scenarios */
export const dashboardPackageCollections = {
  /** Empty dashboard state */
  emptyDashboard: (): DashboardPackage[] => [],

  /** Single package in dashboard */
  singlePackageDashboard: (): DashboardPackage[] => [
    createDashboardPackageMock({
      npmName: 'react',
      name: 'React',
      icon: '⚛️',
      latestVersion: '18.0.0',
    })
  ],

  /** Complete dashboard with popular packages */
  popularPackagesDashboard: (): DashboardPackage[] => [
    createDashboardPackageMock({
      npmName: 'react',
      name: 'React',
      icon: '⚛️',
      latestVersion: '18.0.0',
    }),
    createDashboardPackageMock({
      npmName: 'angular',
      name: 'Angular',
      icon: '🅰️',
      githubRepo: 'angular/angular',
      latestVersion: '17.0.0',
    }),
    createDashboardPackageMock({
      npmName: 'typescript',
      name: 'TypeScript',
      icon: '💙',
      githubRepo: 'microsoft/TypeScript',
      latestVersion: '5.0.0',
    })
  ],

  /** Dashboard with packages in loading state */
  packagesLoadingDashboard: (): DashboardPackage[] => [
    createDashboardPackageMock({
      npmName: 'react',
      isLoading: true,
      latestVersion: undefined,
    }),
    createDashboardPackageMock({
      npmName: 'angular',
      name: 'Angular',
      isLoading: false,
      latestVersion: '17.0.0',
    })
  ],

  /** Dashboard with package fetch errors */
  packagesWithErrorsDashboard: (): DashboardPackage[] => [
    createDashboardPackageMock({
      npmName: 'react',
      error: 'Failed to fetch version',
      latestVersion: undefined,
    }),
    createDashboardPackageMock({
      npmName: 'angular',
      name: 'Angular',
      error: undefined,
      latestVersion: '17.0.0',
    })
  ],

  /** Dashboard with mixed package states (realistic scenario) */
  mixedStatesDashboard: (): DashboardPackage[] => [
    createDashboardPackageMock({
      npmName: 'react',
      latestVersion: '18.0.0',
    }),
    createDashboardPackageMock({
      npmName: 'angular',
      name: 'Angular',
      isLoading: true,
      latestVersion: undefined,
    }),
    createDashboardPackageMock({
      npmName: 'typescript',
      name: 'TypeScript',
      error: 'Network timeout',
      latestVersion: undefined,
    })
  ]
}

// ==============================================================================
// REFRESH FUNCTIONALITY BUSINESS DOMAIN MOCKS
// ==============================================================================

/** Creates mock refresh handler for testing user interactions */
export const createPackageRefreshHandler = () => vi.fn()

/** Business-meaningful timestamps for package refresh testing */
export const packageRefreshTimestamps = {
  /** Just refreshed (few minutes ago) */
  recentRefresh: new Date('2024-01-15T14:30:00Z'),
  
  /** Earlier today */
  earlierTodayRefresh: new Date('2024-01-15T09:15:30Z'),
  
  /** Yesterday's refresh */
  yesterdayRefresh: new Date('2024-01-14T16:45:15Z'),
  
  /** Fixed timestamp for consistent testing */
  fixedTimestamp: new Date('2024-01-15T12:00:00Z'),
}

/** Package refresh scenarios for testing different UI states */
export const packageRefreshScenarios = {
  /** Initial dashboard state - no refresh yet */
  initialDashboardState: () => ({
    onRefresh: createPackageRefreshHandler(),
    isLoading: false,
    lastRefresh: undefined,
  }),

  /** Dashboard actively refreshing packages */
  dashboardRefreshing: () => ({
    onRefresh: createPackageRefreshHandler(),
    isLoading: true,
    lastRefresh: packageRefreshTimestamps.recentRefresh,
  }),

  /** Dashboard recently refreshed successfully */
  dashboardRecentlyRefreshed: () => ({
    onRefresh: createPackageRefreshHandler(),
    isLoading: false,
    lastRefresh: packageRefreshTimestamps.recentRefresh,
  }),

  /** Dashboard with older refresh timestamp */
  dashboardStaleRefresh: () => ({
    onRefresh: createPackageRefreshHandler(),
    isLoading: false,
    lastRefresh: packageRefreshTimestamps.yesterdayRefresh,
  }),
}

// ==============================================================================
// CONTAINER HOOK SCENARIOS FOR BUSINESS LOGIC TESTING
// ==============================================================================

/** Package dashboard hook scenarios representing real application states */
export const packageDashboardHookScenarios = {
  /** Dashboard loading initial package data */
  dashboardInitialLoading: () => ({
    packages: dashboardPackageCollections.emptyDashboard(),
    isLoading: true,
    error: null,
    lastRefresh: undefined,
    fetchVersions: vi.fn(),
  }),

  /** Dashboard successfully loaded with packages */
  dashboardLoadedSuccessfully: () => ({
    packages: dashboardPackageCollections.popularPackagesDashboard(),
    isLoading: false,
    error: null,
    lastRefresh: new Date('2024-01-15T14:30:00Z'),
    fetchVersions: vi.fn(),
  }),

  /** Dashboard failed to load packages */
  dashboardLoadingFailed: () => ({
    packages: dashboardPackageCollections.emptyDashboard(),
    isLoading: false,
    error: 'Failed to fetch package versions from NPM registry',
    lastRefresh: undefined,
    fetchVersions: vi.fn(),
  }),

  /** Dashboard refreshing existing packages */
  dashboardRefreshingPackages: () => ({
    packages: dashboardPackageCollections.popularPackagesDashboard(),
    isLoading: true,
    error: null,
    lastRefresh: new Date('2024-01-15T14:25:00Z'),
    fetchVersions: vi.fn(),
  }),

  /** Dashboard with mixed package loading states */
  dashboardMixedLoadingStates: () => ({
    packages: dashboardPackageCollections.mixedStatesDashboard(),
    isLoading: false,
    error: null,
    lastRefresh: new Date('2024-01-15T14:30:00Z'),
    fetchVersions: vi.fn(),
  }),
}