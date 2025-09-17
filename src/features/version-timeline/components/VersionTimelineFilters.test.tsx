/**
 * VersionTimelineFilters Component Tests - Co-located with VersionTimelineFilters.tsx
 * 
 * Tests component functionality.
 * Tests filtering controls, sort options, and statistics display.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VersionTimelineFilters } from './VersionTimelineFilters'
import {
  versionTimelineCollections
} from '../test-utils/versionTimelineMocks'

// Mock VersionFilteringService for isolated component testing
const mockFilterVersionHistory = vi.fn()
const mockAnalyzeVersionHistory = vi.fn()

vi.mock('../services/versionFiltering', () => ({
  VersionFilteringService: {
    filterVersionHistory: (...args: unknown[]) => mockFilterVersionHistory(...args),
    analyzeVersionHistory: (...args: unknown[]) => mockAnalyzeVersionHistory(...args),
  },
}))

describe('VersionTimelineFilters Presentational Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock returns for service methods
    mockFilterVersionHistory.mockImplementation((versions: unknown[]) => versions)
    mockAnalyzeVersionHistory.mockReturnValue({
      total: 10,
      stable: 8,
      prerelease: 2,
    })
  })

  describe('Initial Render and Default State', () => {
    it('should render filtering controls with default state', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Should show prerelease checkbox (checked by default)
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      expect(prereleaseCheckbox).toBeInTheDocument()
      expect(prereleaseCheckbox).toBeChecked()

      // Should show sort dropdown (newest first by default)
      const sortSelect = screen.getByRole('combobox')
      expect(sortSelect).toBeInTheDocument()
      expect(sortSelect).toHaveValue('newest')

      // Should show sort options
      expect(screen.getByText('Newest first')).toBeInTheDocument()
      expect(screen.getByText('Oldest first')).toBeInTheDocument()
    })

    it('should display version statistics', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      mockAnalyzeVersionHistory.mockReturnValue({
        total: 15,
        stable: 12,
        prerelease: 3,
      })

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Should display statistics with proper formatting
      expect(screen.getByText('15')).toBeInTheDocument() // total
      expect(screen.getByText('12')).toBeInTheDocument() // stable
      expect(screen.getByText('3')).toBeInTheDocument() // prerelease
      expect(screen.getByText(/total •/)).toBeInTheDocument()
      expect(screen.getByText(/stable •/)).toBeInTheDocument()
      expect(screen.getByText(/prerelease$/)).toBeInTheDocument()
    })

    it('should call VersionFilteringService.analyzeVersionHistory on render', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      expect(mockAnalyzeVersionHistory).toHaveBeenCalledTimes(1)
      expect(mockAnalyzeVersionHistory).toHaveBeenCalledWith(versions)
    })
  })

  describe('Prerelease Filtering Control', () => {
    it('should toggle prerelease filter when checkbox is clicked', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })

      // Initially checked - click to uncheck
      fireEvent.click(prereleaseCheckbox)

      expect(prereleaseCheckbox).not.toBeChecked()
      expect(mockFilterVersionHistory).toHaveBeenCalledWith(versions, {
        showPrerelease: false,
        sortOrder: 'newest',
      })
      expect(mockOnFilter).toHaveBeenCalledTimes(1)
    })

    it('should call onFilter with filtered results when toggling prerelease', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const filteredVersions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      mockFilterVersionHistory.mockReturnValue(filteredVersions)

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Toggle prerelease off
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      fireEvent.click(prereleaseCheckbox)

      expect(mockOnFilter).toHaveBeenCalledWith(filteredVersions)
    })

    it('should handle multiple prerelease toggle clicks correctly', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })

      // Click multiple times
      fireEvent.click(prereleaseCheckbox) // uncheck
      fireEvent.click(prereleaseCheckbox) // check again
      fireEvent.click(prereleaseCheckbox) // uncheck again

      expect(mockFilterVersionHistory).toHaveBeenCalledTimes(3)
      expect(mockOnFilter).toHaveBeenCalledTimes(3)
      expect(prereleaseCheckbox).not.toBeChecked() // Final state
    })
  })

  describe('Sort Order Control', () => {
    it('should change sort order when dropdown selection changes', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      const sortSelect = screen.getByRole('combobox')

      // Change to oldest first
      fireEvent.change(sortSelect, { target: { value: 'oldest' } })

      expect(sortSelect).toHaveValue('oldest')
      expect(mockFilterVersionHistory).toHaveBeenCalledWith(versions, {
        showPrerelease: true,
        sortOrder: 'oldest',
      })
      expect(mockOnFilter).toHaveBeenCalledTimes(1)
    })

    it('should maintain prerelease setting when changing sort order', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // First disable prereleases
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      fireEvent.click(prereleaseCheckbox)

      // Then change sort order
      const sortSelect = screen.getByRole('combobox')
      fireEvent.change(sortSelect, { target: { value: 'oldest' } })

      // Should maintain prerelease=false with new sort order
      expect(mockFilterVersionHistory).toHaveBeenLastCalledWith(versions, {
        showPrerelease: false,
        sortOrder: 'oldest',
      })
    })

    it('should have proper option values and labels', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Check that both options are present
      expect(screen.getByDisplayValue('Newest first')).toBeInTheDocument()
      
      // Check option values by changing and verifying
      const sortSelect = screen.getByRole('combobox')
      
      fireEvent.change(sortSelect, { target: { value: 'oldest' } })
      expect(screen.getByDisplayValue('Oldest first')).toBeInTheDocument()
      
      fireEvent.change(sortSelect, { target: { value: 'newest' } })
      expect(screen.getByDisplayValue('Newest first')).toBeInTheDocument()
    })
  })

  describe('Combined Filter Operations', () => {
    it('should apply both prerelease and sort filters together', () => {
      const versions = versionTimelineCollections.mixedVersionStatesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Change both settings
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      const sortSelect = screen.getByRole('combobox')

      fireEvent.click(prereleaseCheckbox) // Disable prereleases
      fireEvent.change(sortSelect, { target: { value: 'oldest' } }) // Change sort

      // Should call filter service with both settings
      expect(mockFilterVersionHistory).toHaveBeenLastCalledWith(versions, {
        showPrerelease: false,
        sortOrder: 'oldest',
      })
    })

    it('should handle rapid filter changes correctly', () => {
      const versions = versionTimelineCollections.extensiveVersionTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      const sortSelect = screen.getByRole('combobox')

      // Rapid changes
      fireEvent.click(prereleaseCheckbox)
      fireEvent.change(sortSelect, { target: { value: 'oldest' } })
      fireEvent.click(prereleaseCheckbox)
      fireEvent.change(sortSelect, { target: { value: 'newest' } })

      // Should have called onFilter for each change
      expect(mockOnFilter).toHaveBeenCalledTimes(4)
      expect(mockFilterVersionHistory).toHaveBeenCalledTimes(4)
    })
  })

  describe('Statistics Display', () => {
    it('should show different statistics for different version sets', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      // Mock different statistics
      mockAnalyzeVersionHistory.mockReturnValue({
        total: 25,
        stable: 20,
        prerelease: 5,
      })

      const { rerender } = render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('20')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()

      // Change statistics and rerender
      mockAnalyzeVersionHistory.mockReturnValue({
        total: 8,
        stable: 6,
        prerelease: 2,
      })

      rerender(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      expect(screen.getByText('8')).toBeInTheDocument()
      expect(screen.getByText('6')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should have proper styling for statistics', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Check that statistics have proper color coding
      const stableCount = screen.getByText('8')
      const prereleaseCount = screen.getByText('2')

      expect(stableCount).toHaveClass('text-green-600')
      expect(prereleaseCount).toHaveClass('text-yellow-600')
    })

    it('should handle zero prerelease versions correctly', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      mockAnalyzeVersionHistory.mockReturnValue({
        total: 3,
        stable: 3,
        prerelease: 0,
      })

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Use getAllByText for values that appear multiple times
      expect(screen.getAllByText('3')).toHaveLength(2) // total and stable
      expect(screen.getByText('0')).toBeInTheDocument() // prerelease
    })
  })

  describe('Service Integration', () => {
    it('should pass correct parameters to VersionFilteringService', () => {
      const versions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Initial render should analyze versions
      expect(mockAnalyzeVersionHistory).toHaveBeenCalledWith(versions)

      // Changing prerelease filter should call filterVersionHistory
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      fireEvent.click(prereleaseCheckbox)

      expect(mockFilterVersionHistory).toHaveBeenCalledWith(versions, {
        showPrerelease: false,
        sortOrder: 'newest',
      })
    })

    it('should handle service errors gracefully', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      // Component should render without errors initially
      expect(() => {
        render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)
      }).not.toThrow()

      // Mock service to throw error
      mockFilterVersionHistory.mockImplementation(() => {
        throw new Error('Service error')
      })

      // Try to trigger filtering - should handle error gracefully
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      
      expect(() => {
        fireEvent.click(prereleaseCheckbox)
      }).not.toThrow()
      
      // Component should still be in the DOM and fallback to original versions
      expect(prereleaseCheckbox).toBeInTheDocument()
      expect(mockOnFilter).toHaveBeenCalledWith(versions) // Fallback to original versions
    })
  })

  describe('Component Structure and Styling', () => {
    it('should have proper layout structure', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      const { container } = render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      // Should have main container with proper styling
      const mainContainer = container.querySelector('.bg-gray-50.rounded-lg.p-4.space-y-4')
      expect(mainContainer).toBeInTheDocument()

      // Should have responsive layout classes
      const flexContainer = container.querySelector('.flex.flex-col.sm\\:flex-row.sm\\:items-center.sm\\:justify-between.gap-4')
      expect(flexContainer).toBeInTheDocument()
    })

    it('should have proper form controls styling', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      const checkbox = screen.getByRole('checkbox')
      const select = screen.getByRole('combobox')

      expect(checkbox).toHaveClass('rounded')
      expect(select).toHaveClass('text-sm', 'border', 'border-gray-300', 'rounded', 'px-2', 'py-1')
    })

    it('should have proper accessibility attributes', () => {
      const versions = versionTimelineCollections.majorReleasesTimeline()
      const mockOnFilter = vi.fn()

      render(<VersionTimelineFilters versions={versions} onFilter={mockOnFilter} />)

      const checkbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      const select = screen.getByRole('combobox')

      expect(checkbox).toHaveAttribute('type', 'checkbox')
      expect(select).toHaveValue('newest')
    })
  })

  describe('Props Changes and Updates', () => {
    it('should update statistics when versions prop changes', () => {
      const initialVersions = versionTimelineCollections.majorReleasesTimeline()
      const newVersions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      const { rerender } = render(<VersionTimelineFilters versions={initialVersions} onFilter={mockOnFilter} />)

      expect(mockAnalyzeVersionHistory).toHaveBeenCalledWith(initialVersions)

      // Change versions prop
      rerender(<VersionTimelineFilters versions={newVersions} onFilter={mockOnFilter} />)

      expect(mockAnalyzeVersionHistory).toHaveBeenCalledWith(newVersions)
    })

    it('should maintain internal state when versions prop changes', () => {
      const initialVersions = versionTimelineCollections.majorReleasesTimeline()
      const newVersions = versionTimelineCollections.timelineWithPrereleases()
      const mockOnFilter = vi.fn()

      const { rerender } = render(<VersionTimelineFilters versions={initialVersions} onFilter={mockOnFilter} />)

      // Change checkbox state
      const prereleaseCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      fireEvent.click(prereleaseCheckbox)
      expect(prereleaseCheckbox).not.toBeChecked()

      // Change versions prop - checkbox state should be maintained
      rerender(<VersionTimelineFilters versions={newVersions} onFilter={mockOnFilter} />)

      const updatedCheckbox = screen.getByRole('checkbox', { name: /show prereleases/i })
      expect(updatedCheckbox).not.toBeChecked()
    })
  })
})