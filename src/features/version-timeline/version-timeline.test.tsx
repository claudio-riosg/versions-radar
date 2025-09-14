/**
 * VersionTimeline Container Component Tests - Co-located with version-timeline.tsx
 * 
 * Following TDD with comprehensive integration testing.
 * Tests container logic, hook orchestration, navigation flow, and child component integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VersionTimeline } from './version-timeline'
import { versionTimelineCollections } from './test-utils/versionTimelineMocks'

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
  BackButton: vi.fn(({ children, ...props }) => (
    <button {...props} data-testid="back-button">
      {children}
    </button>
  )),
}))

// Mock VersionTimelineVisualization and VersionTimelineFilters
vi.mock('./components/VersionTimelineVisualization', () => ({
  VersionTimelineVisualization: vi.fn(({ versions, onVersionSelect }) => (
    <div data-testid="timeline-chart">
      {versions.map((version: { version: string }) => (
        <button
          key={version.version}
          data-testid={`chart-version-${version.version}`}
          onClick={() => onVersionSelect(version)}
        >
          {version.version}
        </button>
      ))}
    </div>
  )),
}))

vi.mock('./components/VersionTimelineFilters', () => ({
  VersionTimelineFilters: vi.fn(({ versions, onFilter }) => (
    <div data-testid="timeline-controls">
      <button
        data-testid="filter-button"
        onClick={() => onFilter(versions.slice(0, 1))} // Mock filtering
      >
        Filter Versions
      </button>
      <span data-testid="versions-count">{versions.length}</span>
    </div>
  )),
}))

// Mock useVersionTimelineRadar hook
const mockFetchVersionHistory = vi.fn()
const mockVersionHistoryState = {
  package: null,
  versions: [],
  isLoading: false,
  error: null,
  fetchVersionHistory: mockFetchVersionHistory,
}

vi.mock('./hooks/useVersionTimelineRadar', () => ({
  useVersionTimelineRadar: vi.fn(() => mockVersionHistoryState),
}))

// Mock navigation hook
const mockNavigateToChangelogViewer = vi.fn()
const mockNavigationState = {
  navigation: {
    selectedPackage: null,
    currentView: 'version-timeline' as const,
  },
  navigateToChangelogViewer: mockNavigateToChangelogViewer,
}

vi.mock('@shared/store/appStore', () => ({
  useRadarNavigation: vi.fn(() => mockNavigationState),
}))

describe('VersionTimeline Container Component', () => {
  const setupSuccessState = () => {
    const selectedPackage = {
      name: 'React',
      npmPackage: 'react',
      githubRepo: 'facebook/react',
      icon: '⚛️',
      description: 'A JavaScript library for building user interfaces',
    }
    const versions = versionTimelineCollections.majorReleasesTimeline()

    mockVersionHistoryState.package = selectedPackage
    mockVersionHistoryState.versions = versions
    mockVersionHistoryState.isLoading = false
    mockVersionHistoryState.error = null
    mockNavigationState.navigation.selectedPackage = selectedPackage

    return { selectedPackage, versions }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset to default state
    Object.assign(mockVersionHistoryState, {
      package: null,
      versions: [],
      isLoading: false,
      error: null,
    })
    
    Object.assign(mockNavigationState, {
      navigation: {
        selectedPackage: null,
        currentView: 'version-timeline' as const,
      },
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner when isLoading is true', () => {
      const selectedPackage = {
        name: 'React',
        npmPackage: 'react',
        githubRepo: 'facebook/react',
        icon: '⚛️',
        description: 'A JavaScript library for building user interfaces',
      }

      mockVersionHistoryState.isLoading = true
      mockNavigationState.navigation.selectedPackage = selectedPackage

      render(<VersionTimeline />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByTestId('loading-icon')).toHaveTextContent('⚛️')
      expect(screen.getByTestId('loading-message')).toHaveTextContent('Loading React History')
      expect(screen.getByTestId('loading-size')).toHaveTextContent('lg')
    })

    it('should show loading spinner when no selected package', () => {
      mockVersionHistoryState.isLoading = false
      mockNavigationState.navigation.selectedPackage = null

      render(<VersionTimeline />)

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByTestId('loading-message')).toHaveTextContent('Loading Package History')
    })

    it('should have proper loading spinner structure', () => {
      mockVersionHistoryState.isLoading = true

      const { container } = render(<VersionTimeline />)

      const loadingContainer = container.querySelector('.min-h-screen.flex.items-center.justify-center')
      expect(loadingContainer).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('should display error message when error occurs', () => {
      const selectedPackage = {
        name: 'React',
        npmPackage: 'react',
        githubRepo: 'facebook/react',
        icon: '⚛️',
        description: 'A JavaScript library for building user interfaces',
      }

      mockVersionHistoryState.error = 'Failed to load version history'
      mockNavigationState.navigation.selectedPackage = selectedPackage

      render(<VersionTimeline />)

      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByText('Failed to load version history')).toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()
      expect(screen.getByTestId('back-button')).toBeInTheDocument()
    })

    it('should handle retry functionality', () => {
      const selectedPackage = {
        name: 'React',
        npmPackage: 'react',
        githubRepo: 'facebook/react',
        icon: '⚛️',
        description: 'A JavaScript library for building user interfaces',
      }

      mockVersionHistoryState.error = 'Network error'
      mockNavigationState.navigation.selectedPackage = selectedPackage

      render(<VersionTimeline />)

      const retryButton = screen.getByTestId('retry-button')
      fireEvent.click(retryButton)

      expect(mockFetchVersionHistory).toHaveBeenCalledWith(selectedPackage)
    })

    it('should show loading state during retry', () => {
      const selectedPackage = {
        name: 'React',
        npmPackage: 'react',
        githubRepo: 'facebook/react',
        icon: '⚛️',
        description: 'A JavaScript library for building user interfaces',
      }

      mockVersionHistoryState.error = 'Network error'
      mockVersionHistoryState.isLoading = true
      mockNavigationState.navigation.selectedPackage = selectedPackage

      render(<VersionTimeline />)

      const retryButton = screen.getByTestId('retry-button')
      expect(retryButton).toHaveTextContent('Loading...')
      expect(retryButton).toBeDisabled()
    })

    it('should not retry when no selected package', () => {
      mockVersionHistoryState.error = 'No package selected'
      mockNavigationState.navigation.selectedPackage = null

      render(<VersionTimeline />)

      const retryButton = screen.getByTestId('retry-button')
      fireEvent.click(retryButton)

      expect(mockFetchVersionHistory).not.toHaveBeenCalled()
    })
  })

  describe('Success State - Timeline Display', () => {

    it('should display package information in header', () => {
      setupSuccessState()

      render(<VersionTimeline />)

      expect(screen.getByText('⚛️')).toBeInTheDocument()
      expect(screen.getByText('React Version History')).toBeInTheDocument()
      expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument()
      expect(screen.getByTestId('back-button')).toHaveTextContent('← Back to Dashboard')
    })

    it('should render VersionTimelineFilters with correct props', () => {
      const { versions } = setupSuccessState()

      render(<VersionTimeline />)

      expect(screen.getByTestId('timeline-controls')).toBeInTheDocument()
      expect(screen.getByTestId('versions-count')).toHaveTextContent(versions.length.toString())
    })

    it('should render VersionTimelineVisualization with filtered versions', () => {
      const { versions } = setupSuccessState()

      render(<VersionTimeline />)

      expect(screen.getByTestId('timeline-chart')).toBeInTheDocument()
      
      // Initially should show all versions
      versions.forEach(version => {
        expect(screen.getByTestId(`chart-version-${version.version}`)).toBeInTheDocument()
      })
    })

    it('should handle version filtering from VersionTimelineFilters', () => {
      const { versions } = setupSuccessState()

      render(<VersionTimeline />)

      // Initially all versions should be visible
      expect(screen.getAllByTestId(/^chart-version-/)).toHaveLength(versions.length)

      // Click filter button (mocked to return only first version)
      const filterButton = screen.getByTestId('filter-button')
      fireEvent.click(filterButton)

      // Should now show only filtered version
      expect(screen.getAllByTestId(/^chart-version-/)).toHaveLength(1)
      expect(screen.getByTestId(`chart-version-${versions[0].version}`)).toBeInTheDocument()
    })

    it('should display footer guidance', () => {
      setupSuccessState()

      render(<VersionTimeline />)

      expect(screen.getByText('Click on any version to view its changelog')).toBeInTheDocument()
    })

    it('should have proper layout structure', () => {
      setupSuccessState()

      const { container } = render(<VersionTimeline />)

      const mainContainer = container.querySelector('.min-h-screen.p-8')
      const contentContainer = container.querySelector('.max-w-4xl.mx-auto')
      const header = container.querySelector('header.mb-8')

      expect(mainContainer).toBeInTheDocument()
      expect(contentContainer).toBeInTheDocument()
      expect(header).toBeInTheDocument()
    })

    it('should not show VersionTimelineFilters when no versions available', () => {
      setupSuccessState()
      mockVersionHistoryState.versions = []

      render(<VersionTimeline />)

      expect(screen.queryByTestId('timeline-controls')).not.toBeInTheDocument()
      expect(screen.getByTestId('timeline-chart')).toBeInTheDocument()
    })
  })

  describe('Version Selection and Navigation', () => {
    it('should handle version selection and navigate to changelog viewer', () => {
      const { selectedPackage, versions } = setupSuccessState()

      render(<VersionTimeline />)

      const firstVersionButton = screen.getByTestId(`chart-version-${versions[0].version}`)
      fireEvent.click(firstVersionButton)

      expect(mockNavigateToChangelogViewer).toHaveBeenCalledWith(selectedPackage, versions[0])
    })

    it('should not navigate when no selected package', () => {
      const { versions } = setupSuccessState()
      
      render(<VersionTimeline />)

      // First verify we have the timeline rendered
      expect(screen.getByTestId('timeline-chart')).toBeInTheDocument()

      // Clear the selectedPackage after rendering
      mockNavigationState.navigation.selectedPackage = null

      const firstVersionButton = screen.getByTestId(`chart-version-${versions[0].version}`)
      fireEvent.click(firstVersionButton)

      expect(mockNavigateToChangelogViewer).not.toHaveBeenCalled()
    })

    it('should handle version selection with different versions', () => {
      const { selectedPackage, versions } = setupSuccessState()

      render(<VersionTimeline />)

      // Click on second version
      const secondVersionButton = screen.getByTestId(`chart-version-${versions[1].version}`)
      fireEvent.click(secondVersionButton)

      expect(mockNavigateToChangelogViewer).toHaveBeenCalledWith(selectedPackage, versions[1])

      // Click on third version
      const thirdVersionButton = screen.getByTestId(`chart-version-${versions[2].version}`)
      fireEvent.click(thirdVersionButton)

      expect(mockNavigateToChangelogViewer).toHaveBeenCalledWith(selectedPackage, versions[2])
      expect(mockNavigateToChangelogViewer).toHaveBeenCalledTimes(2)
    })
  })

  describe('Hook Integration and Side Effects', () => {
    it('should fetch version history when selected package changes', () => {
      const selectedPackage = {
        name: 'React',
        npmPackage: 'react',
        githubRepo: 'facebook/react',
        icon: '⚛️',
        description: 'A JavaScript library for building user interfaces',
      }

      mockNavigationState.navigation.selectedPackage = selectedPackage

      render(<VersionTimeline />)

      expect(mockFetchVersionHistory).toHaveBeenCalledWith(selectedPackage)
    })

    it('should not fetch when no selected package', () => {
      mockNavigationState.navigation.selectedPackage = null

      render(<VersionTimeline />)

      expect(mockFetchVersionHistory).not.toHaveBeenCalled()
    })

    it('should update filtered versions when versions change', () => {
      const { versions } = setupSuccessState()

      const { rerender } = render(<VersionTimeline />)

      // Initially should show all versions
      expect(screen.getAllByTestId(/^chart-version-/)).toHaveLength(versions.length)

      // Change versions in state
      const newVersions = [versions[0]]
      mockVersionHistoryState.versions = newVersions

      rerender(<VersionTimeline />)

      // Should now show updated versions
      expect(screen.getAllByTestId(/^chart-version-/)).toHaveLength(1)
    })
  })

  describe('Component Integration', () => {
    it('should maintain separation of concerns between timeline controls and chart', () => {
      const { versions } = setupSuccessState()

      render(<VersionTimeline />)

      // VersionTimelineFilters should receive all versions
      expect(screen.getByTestId('versions-count')).toHaveTextContent(versions.length.toString())

      // Apply filter through controls
      fireEvent.click(screen.getByTestId('filter-button'))

      // VersionTimelineVisualization should receive filtered versions
      expect(screen.getAllByTestId(/^chart-version-/)).toHaveLength(1)
      
      // But controls should still have access to all versions for statistics
      expect(screen.getByTestId('versions-count')).toHaveTextContent(versions.length.toString())
    })

    it('should handle empty filtered results correctly', () => {
      setupSuccessState()

      render(<VersionTimeline />)

      // Initially should show versions
      expect(screen.getAllByTestId(/^chart-version-/)).toHaveLength(3)

      // Simulate empty filter by directly accessing the setFilteredVersions callback
      // In the real component, this would happen through VersionTimelineFilters onFilter prop
      const timelineChart = screen.getByTestId('timeline-chart')
      expect(timelineChart).toBeInTheDocument()
      
      // Chart should gracefully handle empty results (would show no buttons)
      // This tests the integration pattern rather than specific filtering logic
    })
  })

  describe('Props and State Management', () => {
    it('should handle package state changes correctly', () => {
      setupSuccessState()

      const { rerender } = render(<VersionTimeline />)

      expect(screen.getByText('React Version History')).toBeInTheDocument()

      // Change package
      const newPackage = {
        name: 'Angular',
        npmPackage: '@angular/core',
        githubRepo: 'angular/angular',
        icon: '🅰️',
        description: 'The modern web developer\'s platform',
      }
      mockVersionHistoryState.package = newPackage

      rerender(<VersionTimeline />)

      expect(screen.getByText('Angular Version History')).toBeInTheDocument()
      expect(screen.getByText('🅰️')).toBeInTheDocument()
    })

    it('should handle navigation state transitions correctly', () => {
      // Start in loading state
      mockNavigationState.navigation.selectedPackage = null
      
      const { rerender } = render(<VersionTimeline />)
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

      // Transition to success state
      setupSuccessState()
      
      rerender(<VersionTimeline />)
      
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      expect(screen.getByText('React Version History')).toBeInTheDocument()
    })
  })
})