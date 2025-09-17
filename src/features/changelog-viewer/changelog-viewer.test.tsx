/**
 * ChangelogViewer Container Component Tests - Co-located with changelog-viewer.tsx
 * 
 * Tests component functionality.
 * Tests hook orchestration, navigation state management, and child component integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChangelogViewer } from './changelog-viewer'
import {
  changelogViewerScenarios,
  changelogNavigationScenarios
} from './test-utils/changelogViewerMocks'

// Mock shared components
vi.mock('@shared/components', () => ({
  ErrorMessage: vi.fn(({ message, onRetry, isLoading }) => (
    <div data-testid="error-message">
      <span>{message}</span>
      <button onClick={onRetry} disabled={isLoading} data-testid="retry-button">
        {isLoading ? 'Loading...' : 'Retry'}
      </button>
    </div>
  )),
  LoadingSpinner: vi.fn(({ size, icon, message }) => (
    <div data-testid="loading-spinner">
      <span data-testid="loading-icon">{icon}</span>
      <span data-testid="loading-message">{message}</span>
      <span data-testid="loading-size">{size}</span>
    </div>
  )),
}))

// Mock child components
vi.mock('./components/NavigationControls', () => ({
  NavigationControls: vi.fn(({ packageName }) => (
    <div data-testid="navigation-controls">
      <span data-testid="package-name">{packageName}</span>
    </div>
  )),
}))

vi.mock('./components/VersionHeader', () => ({
  VersionHeader: vi.fn(({ package: pkg, version, changelog }) => (
    <div data-testid="version-header">
      <span data-testid="header-package">{pkg?.name}</span>
      <span data-testid="header-version">{version?.version}</span>
      <span data-testid="header-changelog">{changelog ? 'has-changelog' : 'no-changelog'}</span>
    </div>
  )),
}))

vi.mock('./components/ChangelogContent', () => ({
  ChangelogContent: vi.fn(({ changelog }) => (
    <div data-testid="changelog-content">
      <span data-testid="content-title">{changelog.title}</span>
      <span data-testid="content-length">{changelog.content.length}</span>
    </div>
  )),
}))

// Mock useChangelogRadar hook
const mockFetchChangelog = vi.fn()
const mockChangelogState = {
  changelog: null,
  isLoading: false,
  error: null,
  fetchChangelog: mockFetchChangelog,
}

vi.mock('./hooks/useChangelogRadar', () => ({
  useChangelogRadar: vi.fn(() => mockChangelogState),
}))

// Mock navigation hook
const mockNavigationState = {
  navigation: {
    selectedPackage: null,
    selectedVersion: null,
    currentView: 'changelog-viewer' as const,
  },
}

vi.mock('@shared/store/appStore', () => ({
  useRadarNavigation: vi.fn(() => mockNavigationState),
}))

describe('ChangelogViewer Container Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset to default state
    Object.assign(mockChangelogState, {
      changelog: null,
      isLoading: false,
      error: null,
    })
    
    Object.assign(mockNavigationState, {
      navigation: {
        selectedPackage: null,
        selectedVersion: null,
        currentView: 'changelog-viewer' as const,
      },
    })
  })

  describe('Error States', () => {
    it('should display error message when error occurs', () => {
      const scenario = changelogViewerScenarios.errorState()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.error = scenario.error
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByText(scenario.error!)).toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
    })

    it('should handle retry functionality', () => {
      const scenario = changelogViewerScenarios.errorState()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.error = scenario.error
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      const retryButton = screen.getByTestId('retry-button')
      fireEvent.click(retryButton)

      expect(mockFetchChangelog).toHaveBeenCalledWith(
        navigation.selectedPackage,
        navigation.selectedVersion
      )
    })

    it('should show loading state during retry', () => {
      const scenario = changelogViewerScenarios.errorState()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.error = scenario.error
      mockChangelogState.isLoading = true
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      const retryButton = screen.getByTestId('retry-button')
      expect(retryButton).toHaveTextContent('Loading...')
      expect(retryButton).toBeDisabled()
    })

    it('should not retry when navigation is incomplete', () => {
      const scenario = changelogViewerScenarios.errorState()
      const navigation = changelogNavigationScenarios.missingVersionState()
      
      mockChangelogState.error = scenario.error
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      const retryButton = screen.getByTestId('retry-button')
      fireEvent.click(retryButton)

      expect(mockFetchChangelog).not.toHaveBeenCalled()
    })

    it('should display package name in navigation even in error state', () => {
      const scenario = changelogViewerScenarios.errorState()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.error = scenario.error
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
      expect(screen.getByTestId('package-name')).toHaveTextContent(navigation.selectedPackage!.name)
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner when isLoading is true', () => {
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.isLoading = true
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByTestId('loading-icon')).toHaveTextContent(navigation.selectedPackage!.icon)
      expect(screen.getByTestId('loading-message')).toHaveTextContent(
        `Loading ${navigation.selectedPackage!.name} ${navigation.selectedVersion!.version} Changelog`
      )
      expect(screen.getByTestId('loading-size')).toHaveTextContent('lg')
    })

    it('should show loading spinner when no selected package', () => {
      const navigation = changelogNavigationScenarios.missingPackageState()
      
      mockChangelogState.isLoading = false
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByTestId('loading-message')).toHaveTextContent('Loading Package Changelog')
    })

    it('should show loading spinner when no selected version', () => {
      const navigation = changelogNavigationScenarios.missingVersionState()
      
      mockChangelogState.isLoading = false
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should display navigation controls during loading', () => {
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.isLoading = true
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
      expect(screen.getByTestId('package-name')).toHaveTextContent(navigation.selectedPackage!.name)
    })
  })

  describe('Success State - Changelog Display', () => {
    it('should display complete changelog when data is available', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockChangelogState.isLoading = false
      mockChangelogState.error = null
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
      expect(screen.getByTestId('version-header')).toBeInTheDocument()
      expect(screen.getByTestId('changelog-content')).toBeInTheDocument()
      
      // Verify data is passed correctly
      expect(screen.getByTestId('header-package')).toHaveTextContent(navigation.selectedPackage!.name)
      expect(screen.getByTestId('header-version')).toHaveTextContent(navigation.selectedVersion!.version)
      expect(screen.getByTestId('content-title')).toHaveTextContent(scenario.changelog!.title)
    })

    it('should display prerelease changelog correctly', () => {
      const scenario = changelogViewerScenarios.prereleaseWithWarnings()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('changelog-content')).toBeInTheDocument()
      expect(screen.getByTestId('content-title')).toHaveTextContent(scenario.changelog!.title)
    })

    it('should handle rich markdown content', () => {
      const scenario = changelogViewerScenarios.richMarkdownContent()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('changelog-content')).toBeInTheDocument()
      expect(screen.getByTestId('content-length')).toHaveTextContent(
        scenario.changelog!.content.length.toString()
      )
    })

    it('should have proper content container styling', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      const { container } = render(<ChangelogViewer />)

      const contentContainer = container.querySelector('.bg-white.rounded-xl.border.border-gray-200.p-8')
      expect(contentContainer).toBeInTheDocument()
    })

    it('should display no changelog available state', () => {
      const scenario = changelogViewerScenarios.noChangelogAvailable()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByText('No Changelog Available')).toBeInTheDocument()
      expect(screen.getByText(/No release notes were found for/)).toBeInTheDocument()
      
      // Use getAllByText to handle multiple "React" occurrences
      const reactTexts = screen.getAllByText(navigation.selectedPackage!.name)
      expect(reactTexts.length).toBeGreaterThanOrEqual(1)
      
      expect(screen.getByText(navigation.selectedVersion!.version)).toBeInTheDocument()
    })
  })

  describe('Hook Integration and Side Effects', () => {
    it('should fetch changelog when navigation is complete', () => {
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(mockFetchChangelog).toHaveBeenCalledWith(
        navigation.selectedPackage,
        navigation.selectedVersion
      )
    })

    it('should not fetch when package is missing', () => {
      const navigation = changelogNavigationScenarios.missingPackageState()
      
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(mockFetchChangelog).not.toHaveBeenCalled()
    })

    it('should not fetch when version is missing', () => {
      const navigation = changelogNavigationScenarios.missingVersionState()
      
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(mockFetchChangelog).not.toHaveBeenCalled()
    })

    it('should refetch when navigation changes', () => {
      const initialNavigation = changelogNavigationScenarios.completeNavigationState()
      
      mockNavigationState.navigation = initialNavigation

      const { rerender } = render(<ChangelogViewer />)

      expect(mockFetchChangelog).toHaveBeenCalledWith(
        initialNavigation.selectedPackage,
        initialNavigation.selectedVersion
      )

      // Change navigation
      const newNavigation = {
        ...initialNavigation,
        selectedVersion: {
          version: '18.1.0',
          publishedAt: '2023-04-01T12:00:00Z',
          isLatest: false,
          isPrerelease: false,
        },
      }
      mockNavigationState.navigation = newNavigation

      rerender(<ChangelogViewer />)

      expect(mockFetchChangelog).toHaveBeenCalledWith(
        newNavigation.selectedPackage,
        newNavigation.selectedVersion
      )
      expect(mockFetchChangelog).toHaveBeenCalledTimes(2)
    })
  })

  describe('Component Integration', () => {
    it('should pass correct props to NavigationControls', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
      expect(screen.getByTestId('package-name')).toHaveTextContent(navigation.selectedPackage!.name)
    })

    it('should pass correct props to VersionHeader', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('version-header')).toBeInTheDocument()
      expect(screen.getByTestId('header-package')).toHaveTextContent(navigation.selectedPackage!.name)
      expect(screen.getByTestId('header-version')).toHaveTextContent(navigation.selectedVersion!.version)
      expect(screen.getByTestId('header-changelog')).toHaveTextContent('has-changelog')
    })

    it('should pass correct props to ChangelogContent', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('changelog-content')).toBeInTheDocument()
      expect(screen.getByTestId('content-title')).toHaveTextContent(scenario.changelog!.title)
    })

    it('should handle null changelog in VersionHeader', () => {
      const scenario = changelogViewerScenarios.noChangelogAvailable()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('version-header')).toBeInTheDocument()
      expect(screen.getByTestId('header-changelog')).toHaveTextContent('no-changelog')
    })
  })

  describe('Layout and Structure', () => {
    it('should have proper main container structure', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      const { container } = render(<ChangelogViewer />)

      const mainContainer = container.querySelector('.min-h-screen.p-8')
      expect(mainContainer).toBeInTheDocument()
      
      const contentContainer = container.querySelector('.max-w-4xl.mx-auto')
      expect(contentContainer).toBeInTheDocument()
    })

    it('should maintain consistent layout across different states', () => {
      const scenarios = [
        { state: changelogViewerScenarios.loadingState(), navigation: changelogNavigationScenarios.completeNavigationState() },
        { state: changelogViewerScenarios.errorState(), navigation: changelogNavigationScenarios.completeNavigationState() },
        { state: changelogViewerScenarios.successfulMajorRelease(), navigation: changelogNavigationScenarios.completeNavigationState() },
      ]

      scenarios.forEach(({ state, navigation }) => {
        Object.assign(mockChangelogState, state)
        mockNavigationState.navigation = navigation

        const { container, unmount } = render(<ChangelogViewer />)
        
        // All states should have consistent main structure
        expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
        expect(container.querySelector('.max-w-4xl.mx-auto')).toBeInTheDocument()
        expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should handle responsive design correctly', () => {
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.changelog = scenario.changelog
      mockNavigationState.navigation = navigation

      const { container } = render(<ChangelogViewer />)

      // Check responsive container classes
      expect(container.querySelector('.max-w-4xl')).toBeInTheDocument()
      expect(container.querySelector('.mx-auto')).toBeInTheDocument()
      expect(container.querySelector('.p-8')).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing navigation gracefully', () => {
      mockNavigationState.navigation = {
        selectedPackage: null,
        selectedVersion: null,
        currentView: 'changelog-viewer' as const,
      }

      expect(() => {
        render(<ChangelogViewer />)
      }).not.toThrow()

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should handle partial navigation state', () => {
      const navigation = changelogNavigationScenarios.missingVersionState()
      
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      expect(screen.getByTestId('navigation-controls')).toBeInTheDocument()
      expect(screen.getByTestId('package-name')).toHaveTextContent(navigation.selectedPackage!.name)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should handle state transitions correctly', () => {
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      // Start in loading state
      mockChangelogState.isLoading = true
      mockNavigationState.navigation = navigation

      const { rerender } = render(<ChangelogViewer />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

      // Transition to success state
      const scenario = changelogViewerScenarios.successfulMajorRelease()
      Object.assign(mockChangelogState, scenario)

      rerender(<ChangelogViewer />)

      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      expect(screen.getByTestId('changelog-content')).toBeInTheDocument()
    })

    it('should prioritize error state over loading', () => {
      const scenario = changelogViewerScenarios.errorState()
      const navigation = changelogNavigationScenarios.completeNavigationState()
      
      mockChangelogState.error = scenario.error
      mockChangelogState.isLoading = true // Both error and loading
      mockNavigationState.navigation = navigation

      render(<ChangelogViewer />)

      // Should show error, not loading
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    })
  })
})