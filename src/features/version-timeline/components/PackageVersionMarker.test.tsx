/**
 * PackageVersionMarker Component Tests - Co-located with PackageVersionMarker.tsx
 * 
 * Following TDD with declarative mocks and comprehensive UI state testing.
 * Tests version badges, date calculations, and user interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PackageVersionMarker } from './PackageVersionMarker'
import { 
  createVersionInfoMock,
  createVersionSelectionHandler,
  versionTimelineCollections 
} from '../test-utils/versionTimelineMocks'

describe('PackageVersionMarker Presentational Component', () => {
  // Mock Date.now for consistent "recent" calculations
  const mockNow = vi.fn(() => new Date('2024-01-20T12:00:00Z').getTime())
  
  beforeEach(() => {
    // Mock only Date.now, preserve constructor
    vi.spyOn(Date, 'now').mockImplementation(mockNow)
  })

  describe('Version Information Display', () => {
    it('should render basic version information correctly', () => {
      const version = createVersionInfoMock({
        version: '18.2.0',
        publishedAt: '2024-01-15T14:30:00Z',
        isLatest: false,
        isPrerelease: false,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      // Version number should be displayed prominently
      expect(screen.getByText('18.2.0')).toBeInTheDocument()
      expect(screen.getByText('18.2.0')).toHaveClass('font-mono', 'font-bold', 'text-lg')

      // Publication date should be formatted and displayed
      expect(screen.getByText(/Published/)).toBeInTheDocument()
      expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument() // Date formatting
    })

    it('should have proper testid for automated testing', () => {
      const version = createVersionInfoMock({ version: '18.2.0' })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      expect(screen.getByTestId('version-18.2.0')).toBeInTheDocument()
    })

    it('should apply custom className when provided', () => {
      const version = createVersionInfoMock()
      const mockHandler = createVersionSelectionHandler()

      render(
        <PackageVersionMarker 
          version={version} 
          onVersionSelect={mockHandler} 
          className="custom-timeline-item" 
        />
      )

      const versionPoint = screen.getByTestId(`version-${version.version}`)
      expect(versionPoint).toHaveClass('custom-timeline-item')
    })
  })

  describe('Version Status Badges', () => {
    it('should display LATEST badge for latest version', () => {
      const latestVersion = createVersionInfoMock({
        version: '18.2.0',
        isLatest: true,
        isPrerelease: false,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={latestVersion} onVersionSelect={mockHandler} />)

      const latestBadge = screen.getByText('LATEST')
      expect(latestBadge).toBeInTheDocument()
      expect(latestBadge).toHaveClass('bg-radar-blue', 'text-white')
    })

    it('should display PRERELEASE badge for prerelease versions', () => {
      const prereleaseVersion = createVersionInfoMock({
        version: '19.0.0-beta.1',
        isLatest: false,
        isPrerelease: true,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={prereleaseVersion} onVersionSelect={mockHandler} />)

      const prereleaseBadge = screen.getByText('PRERELEASE')
      expect(prereleaseBadge).toBeInTheDocument()
      expect(prereleaseBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    it('should display NEW badge for recent non-prerelease versions', () => {
      // Create version from 15 days ago (within 30-day threshold)
      const recentDate = new Date('2024-01-05T14:30:00Z') // 15 days before mocked "now"
      const recentVersion = createVersionInfoMock({
        version: '18.1.5',
        publishedAt: recentDate.toISOString(),
        isLatest: false,
        isPrerelease: false,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={recentVersion} onVersionSelect={mockHandler} />)

      const newBadge = screen.getByText('NEW')
      expect(newBadge).toBeInTheDocument()
      expect(newBadge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('should not display NEW badge for prerelease versions even if recent', () => {
      const recentPrereleaseDate = new Date('2024-01-05T14:30:00Z')
      const recentPrerelease = createVersionInfoMock({
        version: '19.0.0-alpha.1',
        publishedAt: recentPrereleaseDate.toISOString(),
        isLatest: false,
        isPrerelease: true,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={recentPrerelease} onVersionSelect={mockHandler} />)

      // Should have PRERELEASE badge but not NEW badge
      expect(screen.getByText('PRERELEASE')).toBeInTheDocument()
      expect(screen.queryByText('NEW')).not.toBeInTheDocument()
    })

    it('should not display NEW badge for old versions', () => {
      const oldVersion = createVersionInfoMock({
        version: '17.0.0',
        publishedAt: '2022-03-29T00:00:00Z', // More than 30 days ago
        isLatest: false,
        isPrerelease: false,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={oldVersion} onVersionSelect={mockHandler} />)

      expect(screen.queryByText('NEW')).not.toBeInTheDocument()
    })

    it('should display multiple badges when applicable (LATEST + NEW)', () => {
      // Latest version that's also recent
      const recentLatestDate = new Date('2024-01-10T14:30:00Z')
      const recentLatestVersion = createVersionInfoMock({
        version: '18.2.0',
        publishedAt: recentLatestDate.toISOString(),
        isLatest: true,
        isPrerelease: false,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={recentLatestVersion} onVersionSelect={mockHandler} />)

      expect(screen.getByText('LATEST')).toBeInTheDocument()
      expect(screen.getByText('NEW')).toBeInTheDocument()
    })
  })

  describe('Visual Status Indicators', () => {
    it('should display correct indicator color for latest version', () => {
      const latestVersion = createVersionInfoMock({ isLatest: true })
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<PackageVersionMarker version={latestVersion} onVersionSelect={mockHandler} />)

      const indicator = container.querySelector('.w-4.h-4.rounded-full')
      expect(indicator).toHaveClass('bg-radar-blue', 'border-radar-blue')
    })

    it('should display correct indicator color for prerelease version', () => {
      const prereleaseVersion = createVersionInfoMock({ 
        isLatest: false,
        isPrerelease: true 
      })
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<PackageVersionMarker version={prereleaseVersion} onVersionSelect={mockHandler} />)

      const indicator = container.querySelector('.w-4.h-4.rounded-full')
      expect(indicator).toHaveClass('bg-yellow-400', 'border-yellow-400')
    })

    it('should display correct indicator color for stable version', () => {
      const stableVersion = createVersionInfoMock({ 
        isLatest: false,
        isPrerelease: false 
      })
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<PackageVersionMarker version={stableVersion} onVersionSelect={mockHandler} />)

      const indicator = container.querySelector('.w-4.h-4.rounded-full')
      expect(indicator).toHaveClass('bg-green-400', 'border-green-400')
    })
  })

  describe('User Interactions', () => {
    it('should call onVersionSelect when clicked', () => {
      const version = createVersionInfoMock({ version: '18.2.0' })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      const versionPoint = screen.getByTestId('version-18.2.0')
      fireEvent.click(versionPoint)

      expect(mockHandler).toHaveBeenCalledTimes(1)
      expect(mockHandler).toHaveBeenCalledWith(version)
    })

    it('should have proper hover interaction styling', () => {
      const version = createVersionInfoMock()
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      const versionPoint = screen.getByTestId(`version-${version.version}`)
      expect(versionPoint).toHaveClass('hover:bg-gray-50', 'micro-interaction', 'cursor-pointer')
    })

    it('should handle multiple rapid clicks correctly', () => {
      const version = createVersionInfoMock()
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      const versionPoint = screen.getByTestId(`version-${version.version}`)
      
      // Rapid clicks
      fireEvent.click(versionPoint)
      fireEvent.click(versionPoint)
      fireEvent.click(versionPoint)

      expect(mockHandler).toHaveBeenCalledTimes(3)
      expect(mockHandler).toHaveBeenCalledWith(version)
    })
  })

  describe('Date Formatting and Calculations', () => {
    it('should format publication date correctly', () => {
      const version = createVersionInfoMock({
        publishedAt: '2024-01-15T14:30:25Z'
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      // Should show both date and time (format may vary by locale)
      expect(screen.getByText(/Published/)).toBeInTheDocument()
      expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument()
      expect(screen.getByText(/30:25/)).toBeInTheDocument() // Match time regardless of AM/PM or format
    })

    it('should calculate recent status correctly based on publication date', () => {
      // Test version exactly at 30-day boundary
      const boundaryDate = new Date('2023-12-21T12:00:00Z') // Exactly 30 days before mocked "now"
      const boundaryVersion = createVersionInfoMock({
        publishedAt: boundaryDate.toISOString(),
        isPrerelease: false,
      })
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={boundaryVersion} onVersionSelect={mockHandler} />)

      // Should not show NEW badge (30 days is the limit)
      expect(screen.queryByText('NEW')).not.toBeInTheDocument()
    })
  })

  describe('Component Memoization and Performance', () => {
    it('should be a memoized component', () => {
      // Test that PackageVersionMarker is wrapped with memo
      expect(typeof PackageVersionMarker).toBe('object') // memo returns object
      expect(PackageVersionMarker.$$typeof).toBeDefined() // React memo components have $$typeof
    })

    it('should memoize date calculations correctly', () => {
      const version = createVersionInfoMock({
        publishedAt: '2024-01-15T14:30:00Z'
      })
      const mockHandler = createVersionSelectionHandler()

      const { rerender } = render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      // First render - calculations should happen
      expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument()

      // Rerender with same props - should reuse memoized calculations
      rerender(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument()
    })
  })

  describe('Complex Version Scenarios', () => {
    it('should handle versions from timeline collections correctly', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockHandler = createVersionSelectionHandler()

      versions.forEach(version => {
        const { unmount } = render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)
        
        // Each version should render without errors
        expect(screen.getByText(version.version)).toBeInTheDocument()
        expect(screen.getByTestId(`version-${version.version}`)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should handle edge case versions correctly', () => {
      const edgeCaseVersions = [
        createVersionInfoMock({ 
          version: '0.0.1-alpha.1', 
          isPrerelease: true 
        }),
        createVersionInfoMock({ 
          version: '1.0.0-rc.10',
          isPrerelease: true 
        }),
        createVersionInfoMock({ 
          version: '999.999.999',
          isLatest: true 
        }),
      ]
      const mockHandler = createVersionSelectionHandler()

      edgeCaseVersions.forEach(version => {
        const { unmount } = render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)
        
        expect(screen.getByText(version.version)).toBeInTheDocument()
        expect(screen.getByTestId(`version-${version.version}`)).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Accessibility and Structure', () => {
    it('should have proper accessibility structure', () => {
      const version = createVersionInfoMock()
      const mockHandler = createVersionSelectionHandler()

      render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      const versionPoint = screen.getByTestId(`version-${version.version}`)
      
      // Should be a clickable element
      expect(versionPoint).toHaveAttribute('data-testid')
      expect(versionPoint).toHaveClass('cursor-pointer')
    })

    it('should have proper visual hierarchy with flexbox layout', () => {
      const version = createVersionInfoMock()
      const mockHandler = createVersionSelectionHandler()

      const { container } = render(<PackageVersionMarker version={version} onVersionSelect={mockHandler} />)

      const mainContainer = container.firstChild
      expect(mainContainer).toHaveClass('flex', 'items-center', 'gap-4')

      // Should have proper flex layout elements
      const indicator = container.querySelector('.flex-shrink-0')
      const content = container.querySelector('.flex-grow')
      const arrow = container.querySelector('.flex-shrink-0.text-gray-400')

      expect(indicator).toBeInTheDocument()
      expect(content).toBeInTheDocument() 
      expect(arrow).toBeInTheDocument()
    })
  })
})