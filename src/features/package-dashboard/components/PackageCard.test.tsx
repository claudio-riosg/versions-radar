/**
 * PackageCard Component Tests - Co-located with PackageCard.tsx
 * 
 * Tests component functionality.
 * Tests UI states, user interactions, and proper data handling.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PackageCard } from './PackageCard'
import { createMockDashboardPackage } from './PackageGrid.test' // Reuse exported mock

describe('PackageCard Presentational Component', () => {
  describe('Normal State Rendering', () => {
    it('should render package information correctly', () => {
      const mockPackage = createMockDashboardPackage({
        name: 'React',
        description: 'A JavaScript library for building user interfaces',
        icon: 'react',
        latestVersion: '18.0.0',
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      // Verify all key information is displayed
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument()
      expect(screen.getByTestId('icon-react')).toBeInTheDocument()
      expect(screen.getByText('18.0.0')).toBeInTheDocument()
      expect(screen.getByText('Latest Version')).toBeInTheDocument()
    })

    it('should apply custom className when provided', () => {
      const mockPackage = createMockDashboardPackage()
      const mockHandler = vi.fn()

      render(
        <PackageCard 
          package={mockPackage} 
          onPackageSelect={mockHandler} 
          className="custom-class" 
        />
      )

      const card = screen.getByTestId('package-react')
      expect(card).toHaveClass('custom-class')
    })

    it('should render with proper testid for testing', () => {
      const mockPackage = createMockDashboardPackage({ npmName: 'angular' })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      expect(screen.getByTestId('package-angular')).toBeInTheDocument()
    })

    it('should show "Unknown" when latestVersion is not available', () => {
      const mockPackage = createMockDashboardPackage({ 
        latestVersion: undefined 
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      expect(screen.getByText('Unknown')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should render loading state correctly', () => {
      const mockPackage = createMockDashboardPackage({
        isLoading: true,
        latestVersion: undefined, // Should not be shown in loading state
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      // Should show package info but loading instead of version
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      
      // Should NOT show version information in loading state
      expect(screen.queryByText('Latest Version')).not.toBeInTheDocument()
      expect(screen.queryByText('18.0.0')).not.toBeInTheDocument()
    })

    it('should not be clickable in loading state', () => {
      const mockPackage = createMockDashboardPackage({ isLoading: true })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      const card = screen.getByText('React').closest('div')
      expect(card).not.toHaveClass('cursor-pointer')
      expect(card).not.toHaveClass('micro-interaction')
    })
  })

  describe('Error State', () => {
    it('should render error state correctly', () => {
      const mockPackage = createMockDashboardPackage({
        error: 'Failed to fetch package information',
        latestVersion: '18.0.0', // Should not be shown in error state
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      // Should show package info and error
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('A JavaScript library for building user interfaces')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch package information')).toBeInTheDocument()
      
      // Should NOT show version information in error state
      expect(screen.queryByText('Latest Version')).not.toBeInTheDocument()
      expect(screen.queryByText('18.0.0')).not.toBeInTheDocument()
    })

    it('should have error styling in error state', () => {
      const mockPackage = createMockDashboardPackage({
        error: 'Network error',
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      // Find the actual card container (the outer div)
      const card = screen.getByText('React').closest('.card')
      expect(card).toHaveClass('border-red-200')
    })

    it('should not be clickable in error state', () => {
      const mockPackage = createMockDashboardPackage({ error: 'Some error' })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      const card = screen.getByText('React').closest('div')
      expect(card).not.toHaveClass('cursor-pointer')
      expect(card).not.toHaveClass('micro-interaction')
    })
  })

  describe('User Interactions', () => {
    it('should call onPackageSelect with clean package info when clicked', () => {
      const mockPackage = createMockDashboardPackage({
        npmName: 'react',
        name: 'React',
        description: 'A JavaScript library',
        icon: 'react',
        githubRepo: 'facebook/react',
        latestVersion: '18.0.0',
        isLoading: false,
        error: undefined,
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      const card = screen.getByTestId('package-react')
      fireEvent.click(card)

      expect(mockHandler).toHaveBeenCalledTimes(1)
      
      // Should receive clean package info (without UI state)
      expect(mockHandler).toHaveBeenCalledWith({
        npmName: 'react',
        name: 'React', 
        description: 'A JavaScript library',
        icon: 'react',
        githubRepo: 'facebook/react',
        // latestVersion, isLoading, error should be omitted
      })
    })

    it('should not call onPackageSelect when in loading state', () => {
      const mockPackage = createMockDashboardPackage({ isLoading: true })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      // Try to click (should not be clickable)
      const loadingText = screen.getByText('Loading...')
      fireEvent.click(loadingText)

      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should not call onPackageSelect when in error state', () => {
      const mockPackage = createMockDashboardPackage({ 
        error: 'Failed to load'
      })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      // Try to click (should not be clickable)
      const errorText = screen.getByText('Failed to load')
      fireEvent.click(errorText)

      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  describe('Component Memoization', () => {
    it('should be a memoized component', () => {
      // Test that PackageCard is wrapped with memo by checking the structure
      expect(typeof PackageCard).toBe('object') // memo returns object, not function
      expect(PackageCard.$$typeof).toBeDefined() // React memo components have $$typeof
    })
  })

  describe('Accessibility', () => {
    it('should have proper clickable card in normal state', () => {
      const mockPackage = createMockDashboardPackage()
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      const card = screen.getByTestId('package-react')
      expect(card).toHaveClass('cursor-pointer')
    })

    it('should have proper testid for automated testing', () => {
      const mockPackage = createMockDashboardPackage({ npmName: 'typescript' })
      const mockHandler = vi.fn()

      render(<PackageCard package={mockPackage} onPackageSelect={mockHandler} />)

      expect(screen.getByTestId('package-typescript')).toBeInTheDocument()
    })
  })
})