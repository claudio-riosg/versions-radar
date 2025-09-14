/**
 * PackageDashboard Container Tests - Co-located with package-dashboard.tsx
 * 
 * Following TDD with comprehensive mocking strategy using all reusable mocks.
 * Tests business logic orchestration, hook integration, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PackageDashboard } from './package-dashboard'

// Import reusable declarative mocks
import {
  packageDashboardHookScenarios
} from './test-utils/packageDashboardMocks'
import { mockZustandHooks } from '@shared/store/appStore.mocks'

// ==============================================================================
// CONTAINER-SPECIFIC MOCKS - Building on reusable component mocks
// ==============================================================================

/** Mock the custom hook that fetches package data */
const mockUsePackageVersionsRadar = vi.fn()

/** Mock the Zustand navigation hook */
const mockUseRadarNavigation = vi.fn()

/** Mock shared components */
vi.mock('@shared/components', () => ({
  ErrorMessage: vi.fn(({ message, onRetry, isLoading }) => (
    <div data-testid="error-message">
      <span>{message}</span>
      <button onClick={onRetry} disabled={isLoading} data-testid="retry-button">
        {isLoading ? 'Retrying...' : 'Retry'}
      </button>
    </div>
  )),
}))

/** Mock presentational components - they're already tested separately */
vi.mock('./components/PackageGrid', () => ({
  PackageGrid: vi.fn(({ packages, onPackageSelect }) => (
    <div data-testid="package-grid">
      {packages.map((pkg: { npmName: string; name: string; githubRepo: string }) => (
        <button 
          key={pkg.npmName}
          data-testid={`grid-package-${pkg.npmName}`}
          onClick={() => onPackageSelect({
            npmName: pkg.npmName,
            name: pkg.name,
            description: pkg.description,
            icon: pkg.icon,
            githubRepo: pkg.githubRepo,
          })}
        >
          {pkg.name} - {pkg.latestVersion || 'Loading...'}
        </button>
      ))}
    </div>
  )),
}))

vi.mock('./components/RefreshButton', () => ({
  PackageVersionsRefresh: vi.fn(({ onRefresh, isLoading, lastRefresh }) => (
    <div data-testid="refresh-button">
      <button 
        onClick={onRefresh} 
        disabled={isLoading}
        data-testid="refresh-action"
      >
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
      {lastRefresh && (
        <span data-testid="last-refresh">
          {lastRefresh.toLocaleTimeString()}
        </span>
      )}
    </div>
  )),
}))

/** Mock the hooks */
vi.mock('./hooks/usePackageVersions', () => ({
  usePackageVersionsRadar: () => mockUsePackageVersionsRadar(),
}))

vi.mock('@shared/store/appStore', () => ({
  useRadarNavigation: () => mockUseRadarNavigation(),
}))

// Hook scenarios now imported from declarative mocks file

// ==============================================================================
// CONTAINER TESTS
// ==============================================================================

describe('PackageDashboard Container Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default navigation mock
    mockUseRadarNavigation.mockReturnValue(
      mockZustandHooks.mockUseRadarNavigation()
    )
  })

  describe('Initial Loading and Data Fetching', () => {
    it('should fetch packages on mount', () => {
      const hookData = packageDashboardHookScenarios.dashboardInitialLoading()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should call fetchVersions on mount (via useEffect)
      expect(hookData.fetchVersions).toHaveBeenCalledTimes(1)
    })

    it('should render loading state correctly', () => {
      const hookData = packageDashboardHookScenarios.dashboardInitialLoading()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should show main structure
      expect(screen.getByText('📡 Versions Radar')).toBeInTheDocument()
      expect(screen.getByText('Track the latest versions of your favorite packages')).toBeInTheDocument()

      // Should show refresh button in loading state
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument()
      expect(screen.getByText('Refreshing...')).toBeInTheDocument()

      // Should show empty package grid
      expect(screen.getByTestId('package-grid')).toBeInTheDocument()
    })

    it('should render loaded packages correctly', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should show all packages
      expect(screen.getByTestId('grid-package-react')).toBeInTheDocument()
      expect(screen.getByTestId('grid-package-angular')).toBeInTheDocument()
      expect(screen.getByTestId('grid-package-typescript')).toBeInTheDocument()

      // Should show refresh button in normal state
      expect(screen.getByText('Refresh')).toBeInTheDocument()
      expect(screen.getByTestId('last-refresh')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should render error state when hook returns error', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadingFailed()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should show error message instead of main content
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch package versions from NPM registry')).toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()

      // Should NOT show main dashboard content
      expect(screen.queryByText('📡 Versions Radar')).not.toBeInTheDocument()
      expect(screen.queryByTestId('package-grid')).not.toBeInTheDocument()
    })

    it('should handle retry from error state', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadingFailed()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Click retry button
      fireEvent.click(screen.getByTestId('retry-button'))

      // Should call fetchVersions for retry
      expect(hookData.fetchVersions).toHaveBeenCalledTimes(2) // Once on mount, once on retry
    })

    it('should show loading state during retry', () => {
      const hookData = {
        ...packageDashboardHookScenarios.dashboardLoadingFailed(),
        isLoading: true, // Loading during retry
      }
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Retry button should be disabled
      expect(screen.getByText('Retrying...')).toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeDisabled()
    })
  })

  describe('Package Selection and Navigation', () => {
    it('should handle package selection correctly', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      const navigationMock = mockZustandHooks.mockUseRadarNavigation()
      
      mockUsePackageVersionsRadar.mockReturnValue(hookData)
      mockUseRadarNavigation.mockReturnValue(navigationMock)

      render(<PackageDashboard />)

      // Click on React package
      fireEvent.click(screen.getByTestId('grid-package-react'))

      // Should call navigation with clean package info
      expect(navigationMock.navigateToVersionTimeline).toHaveBeenCalledTimes(1)
      expect(navigationMock.navigateToVersionTimeline).toHaveBeenCalledWith({
        npmName: 'react',
        name: 'React',
        description: 'A JavaScript library for building user interfaces',
        icon: '⚛️',
        githubRepo: 'facebook/react',
      })
    })

    it('should handle selection of different packages', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      const navigationMock = mockZustandHooks.mockUseRadarNavigation()
      
      mockUsePackageVersionsRadar.mockReturnValue(hookData)
      mockUseRadarNavigation.mockReturnValue(navigationMock)

      render(<PackageDashboard />)

      // Click Angular package
      fireEvent.click(screen.getByTestId('grid-package-angular'))

      expect(navigationMock.navigateToVersionTimeline).toHaveBeenCalledWith(
        expect.objectContaining({
          npmName: 'angular',
          name: 'Angular',
        })
      )

      // Click TypeScript package
      fireEvent.click(screen.getByTestId('grid-package-typescript'))

      expect(navigationMock.navigateToVersionTimeline).toHaveBeenCalledWith(
        expect.objectContaining({
          npmName: 'typescript',
          name: 'TypeScript',
        })
      )

      expect(navigationMock.navigateToVersionTimeline).toHaveBeenCalledTimes(2)
    })
  })

  describe('Refresh Functionality', () => {
    it('should handle manual refresh', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Click refresh button
      fireEvent.click(screen.getByTestId('refresh-action'))

      // Should call fetchVersions (once on mount, once on refresh)
      expect(hookData.fetchVersions).toHaveBeenCalledTimes(2)
    })

    it('should show loading state during refresh', () => {
      const hookData = packageDashboardHookScenarios.dashboardRefreshingPackages()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should show refreshing state
      expect(screen.getByText('Refreshing...')).toBeInTheDocument()
      expect(screen.getByTestId('refresh-action')).toBeDisabled()

      // Should still show existing packages
      expect(screen.getByTestId('grid-package-react')).toBeInTheDocument()
    })

    it('should pass lastRefresh to refresh button', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should show last refresh time
      expect(screen.getByTestId('last-refresh')).toBeInTheDocument()
    })
  })

  describe('Hook Integration and Prop Passing', () => {
    it('should pass correct props to PackageGrid', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      const navigationMock = mockZustandHooks.mockUseRadarNavigation()
      
      mockUsePackageVersionsRadar.mockReturnValue(hookData)
      mockUseRadarNavigation.mockReturnValue(navigationMock)

      render(<PackageDashboard />)

      // Verify PackageGrid receives packages and handler
      expect(screen.getByTestId('package-grid')).toBeInTheDocument()
      
      // Test that the handler works
      fireEvent.click(screen.getByTestId('grid-package-react'))
      expect(navigationMock.navigateToVersionTimeline).toHaveBeenCalled()
    })

    it('should pass correct props to RefreshButton', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should pass refresh handler
      fireEvent.click(screen.getByTestId('refresh-action'))
      expect(hookData.fetchVersions).toHaveBeenCalledTimes(2)

      // Should show last refresh time
      expect(screen.getByTestId('last-refresh')).toBeInTheDocument()
    })

    it('should handle mixed package states correctly', () => {
      const hookData = packageDashboardHookScenarios.dashboardMixedLoadingStates()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Should render all packages regardless of their individual states
      expect(screen.getByTestId('package-grid')).toBeInTheDocument()
      
      // The individual package states are handled by PackageCard
      // (which we've already tested separately)
      expect(screen.getByTestId('grid-package-react')).toBeInTheDocument()
      expect(screen.getByTestId('grid-package-angular')).toBeInTheDocument()
      expect(screen.getByTestId('grid-package-typescript')).toBeInTheDocument()
    })
  })

  describe('Component Structure and Layout', () => {
    it('should render complete dashboard structure in success state', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      render(<PackageDashboard />)

      // Header section
      expect(screen.getByText('📡 Versions Radar')).toBeInTheDocument()
      expect(screen.getByText('Track the latest versions of your favorite packages')).toBeInTheDocument()

      // Refresh section
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument()

      // Packages section
      expect(screen.getByTestId('package-grid')).toBeInTheDocument()

      // Footer section
      expect(screen.getByText('Click on any package to view its version history')).toBeInTheDocument()
    })

    it('should have proper CSS classes and structure', () => {
      const hookData = packageDashboardHookScenarios.dashboardLoadedSuccessfully()
      mockUsePackageVersionsRadar.mockReturnValue(hookData)

      const { container } = render(<PackageDashboard />)

      // Should have main container with proper classes
      const mainContainer = container.querySelector('.min-h-screen.p-8')
      expect(mainContainer).toBeInTheDocument()

      // Should have centered content area
      const contentArea = container.querySelector('.max-w-4xl.mx-auto')
      expect(contentArea).toBeInTheDocument()
    })
  })
})