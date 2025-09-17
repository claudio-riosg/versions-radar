/**
 * PackageGrid Component Tests - Co-located with PackageGrid.tsx
 * 
 * Tests component grid layout and package rendering.
 * Tests layout, iteration logic, and prop passing.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PackageGrid } from './PackageGrid'
import type { DashboardPackage } from '../models'

// ==============================================================================
// Test mocks
// ==============================================================================

/** Mock factory for DashboardPackage */
export const createMockDashboardPackage = (overrides: Partial<DashboardPackage> = {}): DashboardPackage => ({
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

/** Mock packages collection */
export const mockPackagesCollection = {
  /** Single package collection */
  single: (): DashboardPackage[] => [
    createMockDashboardPackage({
      npmName: 'react',
      name: 'React',
      icon: '⚛️',
      latestVersion: '18.0.0',
    })
  ],

  /** Multiple packages collection */
  multiple: (): DashboardPackage[] => [
    createMockDashboardPackage({
      npmName: 'react',
      name: 'React',
      icon: '⚛️',
      latestVersion: '18.0.0',
    }),
    createMockDashboardPackage({
      npmName: 'angular',
      name: 'Angular',
      icon: '🅰️',
      githubRepo: 'angular/angular',
      latestVersion: '17.0.0',
    }),
    createMockDashboardPackage({
      npmName: 'typescript',
      name: 'TypeScript',
      icon: '💙',
      githubRepo: 'microsoft/TypeScript',
      latestVersion: '5.0.0',
    })
  ],

  /** Empty collection */
  empty: (): DashboardPackage[] => [],

  /** Loading states collection */
  withLoading: (): DashboardPackage[] => [
    createMockDashboardPackage({
      npmName: 'react',
      isLoading: true,
      latestVersion: undefined,
    }),
    createMockDashboardPackage({
      npmName: 'angular',
      name: 'Angular',
      isLoading: false,
      latestVersion: '17.0.0',
    })
  ],

  /** Error states collection */
  withErrors: (): DashboardPackage[] => [
    createMockDashboardPackage({
      npmName: 'react',
      error: 'Failed to fetch version',
      latestVersion: undefined,
    }),
    createMockDashboardPackage({
      npmName: 'angular',
      name: 'Angular',
      error: undefined,
      latestVersion: '17.0.0',
    })
  ],

  /** Mixed states collection */
  mixedStates: (): DashboardPackage[] => [
    createMockDashboardPackage({
      npmName: 'react',
      latestVersion: '18.0.0',
    }),
    createMockDashboardPackage({
      npmName: 'angular',
      name: 'Angular',
      isLoading: true,
      latestVersion: undefined,
    }),
    createMockDashboardPackage({
      npmName: 'typescript',
      name: 'TypeScript',
      error: 'Network error',
      latestVersion: undefined,
    })
  ]
}

// ==============================================================================
// PACKAGEGRID TESTS
// ==============================================================================

describe('PackageGrid Presentational Component', () => {
  describe('Rendering Logic', () => {
    it('should render empty grid when no packages provided', () => {
      const mockHandler = vi.fn()
      const { container } = render(
        <PackageGrid packages={mockPackagesCollection.empty()} onPackageSelect={mockHandler} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid?.children).toHaveLength(0)
    })

    it('should render single package correctly', () => {
      const packages = mockPackagesCollection.single()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      expect(screen.getByTestId('package-react')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('18.0.0')).toBeInTheDocument()
    })

    it('should render multiple packages correctly', () => {
      const packages = mockPackagesCollection.multiple()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Verify all packages are rendered
      expect(screen.getByTestId('package-react')).toBeInTheDocument()
      expect(screen.getByTestId('package-angular')).toBeInTheDocument()
      expect(screen.getByTestId('package-typescript')).toBeInTheDocument()

      // Verify content
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Angular')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    it('should have proper grid CSS classes', () => {
      const packages = mockPackagesCollection.multiple()
      const mockHandler = vi.fn()

      const { container } = render(
        <PackageGrid packages={packages} onPackageSelect={mockHandler} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid', 'md:grid-cols-3', 'gap-6')
    })

    it('should use npmName as key for each package card', () => {
      const packages = mockPackagesCollection.multiple()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Each package should have its own testid based on npmName
      packages.forEach(pkg => {
        expect(screen.getByTestId(`package-${pkg.npmName}`)).toBeInTheDocument()
      })
    })
  })

  describe('Prop Passing and Handler Delegation', () => {
    it('should pass onPackageSelect handler to all cards', () => {
      const packages = mockPackagesCollection.multiple()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Click on first package
      fireEvent.click(screen.getByTestId('package-react'))
      expect(mockHandler).toHaveBeenCalledTimes(1)

      // Click on second package  
      fireEvent.click(screen.getByTestId('package-angular'))
      expect(mockHandler).toHaveBeenCalledTimes(2)

      // Click on third package
      fireEvent.click(screen.getByTestId('package-typescript'))
      expect(mockHandler).toHaveBeenCalledTimes(3)
    })

    it('should pass correct package data to each card', () => {
      const packages = mockPackagesCollection.multiple()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Click React package
      fireEvent.click(screen.getByTestId('package-react'))
      
      expect(mockHandler).toHaveBeenCalledWith({
        npmName: 'react',
        name: 'React',
        description: 'A JavaScript library for building user interfaces',
        icon: '⚛️',
        githubRepo: 'facebook/react',
        // Note: latestVersion, isLoading, error should be omitted by PackageCard
      })
    })
  })

  describe('State Handling', () => {
    it('should render packages with loading states correctly', () => {
      const packages = mockPackagesCollection.withLoading()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Loading package should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      
      // Non-loading package should show version
      expect(screen.getByText('17.0.0')).toBeInTheDocument()
    })

    it('should render packages with error states correctly', () => {
      const packages = mockPackagesCollection.withErrors()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Error package should show error message
      expect(screen.getByText('Failed to fetch version')).toBeInTheDocument()
      
      // Non-error package should show version
      expect(screen.getByText('17.0.0')).toBeInTheDocument()
    })

    it('should handle mixed states correctly', () => {
      const packages = mockPackagesCollection.mixedStates()
      const mockHandler = vi.fn()

      render(<PackageGrid packages={packages} onPackageSelect={mockHandler} />)

      // Normal state
      expect(screen.getByText('18.0.0')).toBeInTheDocument()
      
      // Loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      
      // Error state
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  describe('Performance and Props', () => {
    it('should re-render when packages array changes', () => {
      const mockHandler = vi.fn()
      const { rerender } = render(
        <PackageGrid packages={mockPackagesCollection.single()} onPackageSelect={mockHandler} />
      )

      expect(screen.getAllByTestId(/^package-/)).toHaveLength(1)

      // Change packages
      rerender(
        <PackageGrid packages={mockPackagesCollection.multiple()} onPackageSelect={mockHandler} />
      )

      expect(screen.getAllByTestId(/^package-/)).toHaveLength(3)
    })

    it('should handle handler changes correctly', () => {
      const packages = mockPackagesCollection.single()
      const mockHandler1 = vi.fn()
      const mockHandler2 = vi.fn()

      const { rerender } = render(
        <PackageGrid packages={packages} onPackageSelect={mockHandler1} />
      )

      fireEvent.click(screen.getByTestId('package-react'))
      expect(mockHandler1).toHaveBeenCalledTimes(1)
      expect(mockHandler2).not.toHaveBeenCalled()

      // Change handler
      rerender(
        <PackageGrid packages={packages} onPackageSelect={mockHandler2} />
      )

      fireEvent.click(screen.getByTestId('package-react'))
      expect(mockHandler1).toHaveBeenCalledTimes(1) // No additional calls
      expect(mockHandler2).toHaveBeenCalledTimes(1) // New handler called
    })
  })
})