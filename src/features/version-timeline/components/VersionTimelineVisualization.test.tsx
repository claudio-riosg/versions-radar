/**
 * VersionTimelineVisualization Component Tests - Co-located with VersionTimelineVisualization.tsx
 * 
 * Following TDD with declarative mocks for layout and interaction testing.
 * Tests timeline rendering, empty states, and version point integration.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VersionTimelineVisualization } from './VersionTimelineVisualization'
import { 
  versionTimelineCollections,
  versionTimelineInteractionScenarios,
  createVersionSelectionHandler 
} from '../test-utils/versionTimelineMocks'

// Mock PackageVersionMarker component for isolated testing
vi.mock('./PackageVersionMarker', () => ({
  PackageVersionMarker: vi.fn(({ version, onVersionSelect, className }) => (
    <div 
      data-testid={`timeline-version-${version.version}`}
      className={`mock-version-point ${className || ''}`}
      onClick={() => onVersionSelect(version)}
    >
      <span>{version.version}</span>
      {version.isLatest && <span data-testid="latest-badge">LATEST</span>}
      {version.isPrerelease && <span data-testid="prerelease-badge">PRERELEASE</span>}
    </div>
  )),
}))

describe('VersionTimelineVisualization Presentational Component', () => {
  describe('Empty Timeline States', () => {
    it('should render empty state when no versions provided', () => {
      const { emptyTimelineInteraction } = versionTimelineInteractionScenarios
      const { versions, onVersionSelect } = emptyTimelineInteraction()

      render(<VersionTimelineVisualization versions={versions} onVersionSelect={onVersionSelect} />)

      // Should show empty state message
      expect(screen.getByText('No versions found')).toBeInTheDocument()
      expect(screen.getByText('No versions found')).toHaveClass('text-gray-500')

      // Should have proper empty state styling
      const emptyContainer = screen.getByText('No versions found').closest('div')
      expect(emptyContainer).toHaveClass('text-center', 'py-12')

      // Should not render timeline structure
      expect(screen.queryByTestId(/^timeline-version-/)).not.toBeInTheDocument()
    })

    it('should not render timeline line when empty', () => {
      const versions = versionTimelineCollections.emptyTimeline()
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<VersionTimelineVisualization versions={versions} onVersionSelect={mockHandler} />)

      // Should not have timeline visual elements
      const timelineLine = container.querySelector('.absolute.left-2.top-0.bottom-0.w-0\\.5')
      expect(timelineLine).not.toBeInTheDocument()
    })
  })

  describe('Timeline Layout and Structure', () => {
    it('should render timeline structure with versions', () => {
      const { selectableVersionsTimeline } = versionTimelineInteractionScenarios
      const { versions, onVersionSelect } = selectableVersionsTimeline()

      const { container } = render(<VersionTimelineVisualization versions={versions} onVersionSelect={onVersionSelect} />)

      // Should have main timeline container
      const mainContainer = container.querySelector('.space-y-2')
      expect(mainContainer).toBeInTheDocument()

      // Should have timeline visual line
      const timelineLine = container.querySelector('.absolute.left-2.top-0.bottom-0.w-0\\.5.bg-gray-200')
      expect(timelineLine).toBeInTheDocument()

      // Should render all version points
      versions.forEach(version => {
        expect(screen.getByTestId(`timeline-version-${version.version}`)).toBeInTheDocument()
      })
    })

    it('should render single version timeline correctly', () => {
      const singleVersion = versionTimelineCollections.singleVersionTimeline()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={singleVersion} onVersionSelect={mockHandler} />)

      expect(screen.getByTestId('timeline-version-18.2.0')).toBeInTheDocument()
      expect(screen.getByText('18.2.0')).toBeInTheDocument()
      expect(screen.getByTestId('latest-badge')).toBeInTheDocument()
    })

    it('should render multiple versions with proper structure', () => {
      const majorReleases = versionTimelineCollections.majorReleasesTimeline()
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<VersionTimelineVisualization versions={majorReleases} onVersionSelect={mockHandler} />)

      // Should render all versions
      expect(screen.getByTestId('timeline-version-18.2.0')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-version-18.1.0')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-version-18.0.0')).toBeInTheDocument()

      // Each version should be in relative positioned container
      const versionContainers = container.querySelectorAll('.relative')
      expect(versionContainers).toHaveLength(4) // One for timeline line container + one for each version (3 versions)
    })

    it('should use version.version as key for each timeline item', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={versions} onVersionSelect={mockHandler} />)

      // Each version should have its own testid based on version string
      versions.forEach(version => {
        expect(screen.getByTestId(`timeline-version-${version.version}`)).toBeInTheDocument()
      })
    })
  })

  describe('Version Point Integration', () => {
    it('should pass correct props to PackageVersionMarker components', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={versions} onVersionSelect={mockHandler} />)

      // Should render PackageVersionMarkers with correct version data
      versions.forEach(version => {
        const versionPoint = screen.getByTestId(`timeline-version-${version.version}`)
        expect(versionPoint).toBeInTheDocument()
        expect(versionPoint).toHaveTextContent(version.version)
      })

      // Should show prerelease badges for prerelease versions
      expect(screen.getAllByTestId('prerelease-badge')).toHaveLength(2) // Based on mock data
    })

    it('should pass onVersionSelect handler to all PackageVersionMarker components', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={versions} onVersionSelect={mockHandler} />)

      // Click on first version
      fireEvent.click(screen.getByTestId('timeline-version-18.2.0'))
      expect(mockHandler).toHaveBeenCalledTimes(1)
      expect(mockHandler).toHaveBeenCalledWith(versions[0])

      // Click on second version
      fireEvent.click(screen.getByTestId('timeline-version-18.1.0'))
      expect(mockHandler).toHaveBeenCalledTimes(2)
      expect(mockHandler).toHaveBeenCalledWith(versions[1])

      // Click on third version
      fireEvent.click(screen.getByTestId('timeline-version-18.0.0'))
      expect(mockHandler).toHaveBeenCalledTimes(3)
      expect(mockHandler).toHaveBeenCalledWith(versions[2])
    })
  })

  describe('Different Timeline Scenarios', () => {
    it('should handle timeline with recent versions correctly', () => {
      const recentVersions = versionTimelineCollections.timelineWithRecentVersions()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={recentVersions} onVersionSelect={mockHandler} />)

      // Should render both versions
      expect(screen.getByTestId('timeline-version-18.2.1')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-version-18.2.0')).toBeInTheDocument()

      // Should show latest badge
      expect(screen.getByTestId('latest-badge')).toBeInTheDocument()
    })

    it('should handle mixed version states timeline', () => {
      const mixedStates = versionTimelineCollections.mixedVersionStatesTimeline()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={mixedStates} onVersionSelect={mockHandler} />)

      // Should render all versions
      expect(screen.getByTestId('timeline-version-19.0.0-alpha.1')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-version-18.2.0')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-version-18.1.5')).toBeInTheDocument()
      expect(screen.getByTestId('timeline-version-18.0.0')).toBeInTheDocument()

      // Should show appropriate badges
      expect(screen.getByTestId('latest-badge')).toBeInTheDocument()
      expect(screen.getByTestId('prerelease-badge')).toBeInTheDocument()
    })

    it('should handle extensive timeline with many versions', () => {
      const extensiveTimeline = versionTimelineCollections.extensiveVersionTimeline()
      const mockHandler = createVersionSelectionHandler()

      render(<VersionTimelineVisualization versions={extensiveTimeline} onVersionSelect={mockHandler} />)

      // Should render all 20 versions
      const versionPoints = screen.getAllByTestId(/^timeline-version-/)
      expect(versionPoints).toHaveLength(20)

      // Should show timeline line for layout
      const { container } = render(<VersionTimelineVisualization versions={extensiveTimeline} onVersionSelect={mockHandler} />)
      const timelineLine = container.querySelector('.absolute.left-2.top-0.bottom-0.w-0\\.5.bg-gray-200')
      expect(timelineLine).toBeInTheDocument()
    })
  })

  describe('Handler Prop Changes', () => {
    it('should handle handler changes correctly', () => {
      const versions = versionTimelineCollections.singleVersionTimeline()
      const handler1 = createVersionSelectionHandler()
      const handler2 = createVersionSelectionHandler()

      const { rerender } = render(<VersionTimelineVisualization versions={versions} onVersionSelect={handler1} />)

      // Click with first handler
      fireEvent.click(screen.getByTestId('timeline-version-18.2.0'))
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()

      // Change handler
      rerender(<VersionTimelineVisualization versions={versions} onVersionSelect={handler2} />)

      // Click with new handler
      fireEvent.click(screen.getByTestId('timeline-version-18.2.0'))
      expect(handler1).toHaveBeenCalledTimes(1) // No additional calls
      expect(handler2).toHaveBeenCalledTimes(1) // New handler called
    })

    it('should handle versions array changes correctly', () => {
      const singleVersion = versionTimelineCollections.singleVersionTimeline()
      const multipleVersions = versionTimelineCollections.majorReleasesTimeline()
      const mockHandler = createVersionSelectionHandler()

      const { rerender } = render(<VersionTimelineVisualization versions={singleVersion} onVersionSelect={mockHandler} />)

      // Should show single version
      expect(screen.getAllByTestId(/^timeline-version-/)).toHaveLength(1)

      // Change to multiple versions
      rerender(<VersionTimelineVisualization versions={multipleVersions} onVersionSelect={mockHandler} />)

      // Should show all versions
      expect(screen.getAllByTestId(/^timeline-version-/)).toHaveLength(3)
    })

    it('should transition from empty to populated timeline correctly', () => {
      const emptyVersions = versionTimelineCollections.emptyTimeline()
      const populatedVersions = versionTimelineCollections.majorReleasesTimeline()
      const mockHandler = createVersionSelectionHandler()

      const { rerender } = render(<VersionTimelineVisualization versions={emptyVersions} onVersionSelect={mockHandler} />)

      // Should show empty state
      expect(screen.getByText('No versions found')).toBeInTheDocument()
      expect(screen.queryByTestId(/^timeline-version-/)).not.toBeInTheDocument()

      // Transition to populated
      rerender(<VersionTimelineVisualization versions={populatedVersions} onVersionSelect={mockHandler} />)

      // Should show timeline with versions
      expect(screen.queryByText('No versions found')).not.toBeInTheDocument()
      expect(screen.getAllByTestId(/^timeline-version-/)).toHaveLength(3)
    })
  })

  describe('Visual Timeline Structure', () => {
    it('should have proper CSS classes for timeline layout', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<VersionTimelineVisualization versions={versions} onVersionSelect={mockHandler} />)

      // Main container should have spacing
      const mainContainer = container.querySelector('.space-y-2')
      expect(mainContainer).toBeInTheDocument()

      // Timeline container should be relative positioned
      const timelineContainer = container.querySelector('.relative')
      expect(timelineContainer).toBeInTheDocument()

      // Timeline line should have proper styling
      const timelineLine = container.querySelector('.absolute.left-2.top-0.bottom-0.w-0\\.5.bg-gray-200')
      expect(timelineLine).toBeInTheDocument()
    })

    it('should maintain timeline visual consistency across different version counts', () => {
      const scenarios = [
        versionTimelineCollections.singleVersionTimeline(),
        versionTimelineCollections.majorReleasesTimeline(),
        versionTimelineCollections.timelineWithPrereleases(),
      ]

      scenarios.forEach((versions) => {
        const mockHandler = createVersionSelectionHandler()
        const { container, unmount } = render(<VersionTimelineVisualization versions={versions} onVersionSelect={mockHandler} />)

        // Each should have consistent timeline structure
        if (versions.length > 0) {
          const timelineLine = container.querySelector('.absolute.left-2.top-0.bottom-0.w-0\\.5.bg-gray-200')
          expect(timelineLine).toBeInTheDocument()
          
          const mainContainer = container.querySelector('.space-y-2')
          expect(mainContainer).toBeInTheDocument()
        }

        unmount()
      })
    })
  })
})