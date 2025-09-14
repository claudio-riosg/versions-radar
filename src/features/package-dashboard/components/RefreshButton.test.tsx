/**
 * PackageVersionsRefresh Component Tests - Co-located with RefreshButton.tsx
 * 
 * Following TDD with reusable mocks and comprehensive state testing.
 * Tests loading states, user interactions, and timestamp display.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PackageVersionsRefresh } from './RefreshButton'

// ==============================================================================
// REUSABLE MOCKS - Export for use in container tests
// ==============================================================================

/** Reusable mock handler factory */
export const createMockRefreshHandler = () => vi.fn()

/** Reusable date mocks for testing timestamp display */
export const mockDates = {
  /** Recent date (few minutes ago) */
  recent: new Date('2024-01-15T14:30:00Z'),
  
  /** Today but earlier */
  earlier: new Date('2024-01-15T09:15:30Z'),
  
  /** Yesterday */
  yesterday: new Date('2024-01-14T16:45:15Z'),
  
  /** Fixed date for consistent testing */
  fixed: new Date('2024-01-15T12:00:00Z'),
}

/** Mock scenarios for different component states */
export const refreshButtonScenarios = {
  /** Default state - not loading, no last refresh */
  default: () => ({
    onRefresh: createMockRefreshHandler(),
    isLoading: false,
    lastRefresh: undefined,
  }),

  /** Loading state */
  loading: () => ({
    onRefresh: createMockRefreshHandler(),
    isLoading: true,
    lastRefresh: mockDates.recent,
  }),

  /** With recent refresh time */
  withRecentRefresh: () => ({
    onRefresh: createMockRefreshHandler(),
    isLoading: false,
    lastRefresh: mockDates.recent,
  }),

  /** With older refresh time */
  withOlderRefresh: () => ({
    onRefresh: createMockRefreshHandler(),
    isLoading: false,
    lastRefresh: mockDates.yesterday,
  }),
}

// ==============================================================================
// REFRESH BUTTON TESTS
// ==============================================================================

describe('PackageVersionsRefresh Presentational Component', () => {
  // Mock Date methods for consistent timestamp testing
  beforeEach(() => {
    // Mock toLocaleTimeString for predictable output
    vi.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('2:30:00 PM')
  })

  describe('Button States and Text', () => {
    it('should render refresh button in default state', () => {
      const props = refreshButtonScenarios.default()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('🔄 Refresh Versions')
      expect(button).not.toBeDisabled()
      expect(button).toHaveClass('btn-primary', 'micro-interaction')
    })

    it('should render loading state correctly', () => {
      const props = refreshButtonScenarios.loading()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('🔄 Refreshing...')
      expect(button).toBeDisabled()
    })

    it('should be disabled when loading', () => {
      const props = refreshButtonScenarios.loading()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should be enabled when not loading', () => {
      const props = refreshButtonScenarios.withRecentRefresh()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Last Refresh Timestamp', () => {
    it('should not show timestamp when lastRefresh is undefined', () => {
      const props = refreshButtonScenarios.default()
      
      render(<PackageVersionsRefresh {...props} />)

      expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument()
    })

    it('should show formatted timestamp when lastRefresh is provided', () => {
      const props = refreshButtonScenarios.withRecentRefresh()
      
      render(<PackageVersionsRefresh {...props} />)

      expect(screen.getByText('Last updated: 2:30:00 PM')).toBeInTheDocument()
    })

    it('should show timestamp even in loading state', () => {
      const props = refreshButtonScenarios.loading()
      
      render(<PackageVersionsRefresh {...props} />)

      // Should show both loading state and timestamp
      expect(screen.getByText('🔄 Refreshing...')).toBeInTheDocument()
      expect(screen.getByText('Last updated: 2:30:00 PM')).toBeInTheDocument()
    })

    it('should have proper styling for timestamp', () => {
      const props = refreshButtonScenarios.withRecentRefresh()
      
      render(<PackageVersionsRefresh {...props} />)

      const timestamp = screen.getByText('Last updated: 2:30:00 PM')
      expect(timestamp).toHaveClass('text-sm', 'text-gray-500', 'mt-2')
    })
  })

  describe('User Interactions', () => {
    it('should call onRefresh when button is clicked', () => {
      const props = refreshButtonScenarios.default()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(props.onRefresh).toHaveBeenCalledTimes(1)
    })

    it('should not call onRefresh when disabled/loading', () => {
      const props = refreshButtonScenarios.loading()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(props.onRefresh).not.toHaveBeenCalled()
    })

    it('should handle multiple clicks in enabled state', () => {
      const props = refreshButtonScenarios.withRecentRefresh()
      
      render(<PackageVersionsRefresh {...props} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(props.onRefresh).toHaveBeenCalledTimes(3)
    })
  })

  describe('State Transitions', () => {
    it('should handle transition from loading to loaded', () => {
      const mockHandler = createMockRefreshHandler()
      
      const { rerender } = render(
        <PackageVersionsRefresh 
          onRefresh={mockHandler}
          isLoading={true}
          lastRefresh={mockDates.recent}
        />
      )

      // Initially loading
      expect(screen.getByText('🔄 Refreshing...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()

      // Transition to loaded
      rerender(
        <PackageVersionsRefresh 
          onRefresh={mockHandler}
          isLoading={false}
          lastRefresh={mockDates.fixed}
        />
      )

      expect(screen.getByText('🔄 Refresh Versions')).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('should handle timestamp updates', () => {
      const mockHandler = createMockRefreshHandler()
      
      const { rerender } = render(
        <PackageVersionsRefresh 
          onRefresh={mockHandler}
          isLoading={false}
          lastRefresh={undefined}
        />
      )

      // Initially no timestamp
      expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument()

      // Add timestamp
      rerender(
        <PackageVersionsRefresh 
          onRefresh={mockHandler}
          isLoading={false}
          lastRefresh={mockDates.recent}
        />
      )

      expect(screen.getByText('Last updated: 2:30:00 PM')).toBeInTheDocument()
    })
  })

  describe('Accessibility and Structure', () => {
    it('should have proper center alignment', () => {
      const props = refreshButtonScenarios.default()
      
      const { container } = render(<PackageVersionsRefresh {...props} />)

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('text-center')
    })

    it('should maintain button accessibility in all states', () => {
      // Test enabled state
      const enabledProps = refreshButtonScenarios.default()
      const { rerender } = render(<PackageVersionsRefresh {...enabledProps} />)
      
      let button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')

      // Test disabled state
      const loadingProps = refreshButtonScenarios.loading()
      rerender(<PackageVersionsRefresh {...loadingProps} />)
      
      button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should have proper visual hierarchy', () => {
      const props = refreshButtonScenarios.withRecentRefresh()
      
      render(<PackageVersionsRefresh {...props} />)

      // Button should be primary element
      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-primary')

      // Timestamp should be secondary
      const timestamp = screen.getByText('Last updated: 2:30:00 PM')
      expect(timestamp.tagName).toBe('P')
      expect(timestamp).toHaveClass('text-sm', 'text-gray-500')
    })
  })

  describe('Edge Cases', () => {
    it('should handle handler change correctly', () => {
      const handler1 = createMockRefreshHandler()
      const handler2 = createMockRefreshHandler()
      
      const { rerender } = render(
        <PackageVersionsRefresh 
          onRefresh={handler1}
          isLoading={false}
          lastRefresh={undefined}
        />
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()

      // Change handler
      rerender(
        <PackageVersionsRefresh 
          onRefresh={handler2}
          isLoading={false}
          lastRefresh={undefined}
        />
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handler1).toHaveBeenCalledTimes(1) // No additional calls
      expect(handler2).toHaveBeenCalledTimes(1) // New handler called
    })

    it('should handle very recent dates correctly', () => {
      const veryRecentDate = new Date()
      const mockHandler = createMockRefreshHandler()
      
      render(
        <PackageVersionsRefresh 
          onRefresh={mockHandler}
          isLoading={false}
          lastRefresh={veryRecentDate}
        />
      )

      // Should still show timestamp for very recent dates
      expect(screen.getByText('Last updated: 2:30:00 PM')).toBeInTheDocument()
    })
  })
})