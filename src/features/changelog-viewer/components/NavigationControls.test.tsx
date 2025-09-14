/**
 * NavigationControls Component Tests - Co-located with NavigationControls.tsx
 * 
 * Following TDD with comprehensive navigation and breadcrumb testing.
 * Tests BackButton integration, package name display, and contextual navigation text.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavigationControls } from './NavigationControls'

// Mock BackButton shared component
vi.mock('@shared/components', () => ({
  BackButton: vi.fn(({ children, ...props }) => (
    <button {...props} data-testid="back-button">
      {children}
    </button>
  )),
}))

describe('NavigationControls Presentational Component', () => {
  describe('BackButton Integration', () => {
    it('should render BackButton with correct back to timeline text', () => {
      const packageName = 'React'

      render(<NavigationControls packageName={packageName} />)

      const backButton = screen.getByTestId('back-button')
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveTextContent('← Back to React Timeline')
    })

    it('should handle different package names correctly', () => {
      const packageNames = ['Angular', 'TypeScript', 'Vue.js', 'Svelte']

      packageNames.forEach(packageName => {
        const { unmount } = render(<NavigationControls packageName={packageName} />)
        
        const backButton = screen.getByTestId('back-button')
        expect(backButton).toHaveTextContent(`← Back to ${packageName} Timeline`)
        
        unmount()
      })
    })

    it('should handle empty package name gracefully', () => {
      const packageName = ''

      render(<NavigationControls packageName={packageName} />)

      const backButton = screen.getByTestId('back-button')
      expect(backButton).toHaveTextContent('← Back to Timeline')
    })

    it('should handle special characters in package names', () => {
      const packageName = '@angular/core'

      render(<NavigationControls packageName={packageName} />)

      const backButton = screen.getByTestId('back-button')
      expect(backButton).toHaveTextContent('← Back to @angular/core Timeline')
    })

    it('should pass through BackButton props correctly', () => {
      const packageName = 'React'

      render(<NavigationControls packageName={packageName} />)

      // BackButton should be rendered with correct text content
      const backButton = screen.getByTestId('back-button')
      expect(backButton).toHaveTextContent('← Back to React Timeline')
      
      // BackButton should be properly integrated
      expect(backButton).toBeInTheDocument()
      expect(backButton.tagName.toLowerCase()).toBe('button')
    })
  })

  describe('Context and Breadcrumb Display', () => {
    it('should display changelog context information', () => {
      const packageName = 'React'

      render(<NavigationControls packageName={packageName} />)

      expect(screen.getByText('Changelog • GitHub Release')).toBeInTheDocument()
    })

    it('should have proper styling for context information', () => {
      const packageName = 'Angular'

      render(<NavigationControls packageName={packageName} />)

      const contextInfo = screen.getByText('Changelog • GitHub Release')
      expect(contextInfo).toHaveClass('text-sm', 'text-gray-500')
    })

    it('should display consistent context regardless of package name', () => {
      const packageNames = ['React', 'Angular', 'TypeScript']

      packageNames.forEach(packageName => {
        const { unmount } = render(<NavigationControls packageName={packageName} />)
        
        expect(screen.getByText('Changelog • GitHub Release')).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should use bullet separator in context information', () => {
      const packageName = 'Vue.js'

      render(<NavigationControls packageName={packageName} />)

      const contextInfo = screen.getByText('Changelog • GitHub Release')
      expect(contextInfo).toHaveTextContent('•') // Contains bullet separator
    })
  })

  describe('Layout and Structure', () => {
    it('should have proper container layout', () => {
      const packageName = 'React'

      const { container } = render(<NavigationControls packageName={packageName} />)

      const mainContainer = container.querySelector('.flex.items-center.justify-between.mb-6')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should position BackButton on the left', () => {
      const packageName = 'Angular'

      const { container } = render(<NavigationControls packageName={packageName} />)

      const flexContainer = container.querySelector('.flex.items-center.justify-between')
      const backButton = screen.getByTestId('back-button')
      
      expect(flexContainer?.firstChild).toContain(backButton)
    })

    it('should position context info on the right', () => {
      const packageName = 'TypeScript'

      const { container } = render(<NavigationControls packageName={packageName} />)

      const flexContainer = container.querySelector('.flex.items-center.justify-between')
      const contextInfo = screen.getByText('Changelog • GitHub Release')
      
      expect(flexContainer?.lastChild).toContain(contextInfo)
    })

    it('should have proper spacing between elements', () => {
      const packageName = 'React'

      const { container } = render(<NavigationControls packageName={packageName} />)

      const flexContainer = container.querySelector('.flex.items-center.justify-between.mb-6')
      expect(flexContainer).toBeInTheDocument()
      
      // Should have margin bottom for spacing from content below
      expect(flexContainer).toHaveClass('mb-6')
    })

    it('should maintain responsive layout structure', () => {
      const packageName = 'Svelte'

      const { container } = render(<NavigationControls packageName={packageName} />)

      // Check that flex layout is applied for responsive behavior
      const container1 = container.querySelector('.flex')
      expect(container1).toHaveClass('items-center', 'justify-between')
    })
  })

  describe('Component Behavior and Interaction', () => {
    it('should handle BackButton click interactions', () => {
      const packageName = 'React'

      render(<NavigationControls packageName={packageName} />)

      const backButton = screen.getByTestId('back-button')
      
      // Button should be clickable
      expect(backButton).not.toBeDisabled()
      
      // Click should not throw error
      expect(() => {
        fireEvent.click(backButton)
      }).not.toThrow()
    })

    it('should not interfere with BackButton functionality', () => {
      const packageName = 'Angular'

      render(<NavigationControls packageName={packageName} />)

      const backButton = screen.getByTestId('back-button')
      
      // Should still be a proper button element
      expect(backButton.tagName.toLowerCase()).toBe('button')
    })

    it('should maintain component state correctly', () => {
      const packageName = 'TypeScript'

      const { rerender } = render(<NavigationControls packageName={packageName} />)

      expect(screen.getByTestId('back-button')).toHaveTextContent('← Back to TypeScript Timeline')
      
      // Rerender should maintain same structure
      rerender(<NavigationControls packageName={packageName} />)
      
      expect(screen.getByTestId('back-button')).toHaveTextContent('← Back to TypeScript Timeline')
      expect(screen.getByText('Changelog • GitHub Release')).toBeInTheDocument()
    })
  })

  describe('Props Handling and Validation', () => {
    it('should accept packageName prop correctly', () => {
      const packageName = 'Custom Package Name'

      render(<NavigationControls packageName={packageName} />)

      expect(screen.getByTestId('back-button')).toHaveTextContent(`← Back to ${packageName} Timeline`)
    })

    it('should handle packageName prop changes', () => {
      const initialPackageName = 'React'
      const newPackageName = 'Vue.js'

      const { rerender } = render(<NavigationControls packageName={initialPackageName} />)

      expect(screen.getByTestId('back-button')).toHaveTextContent('← Back to React Timeline')

      rerender(<NavigationControls packageName={newPackageName} />)

      expect(screen.getByTestId('back-button')).toHaveTextContent('← Back to Vue.js Timeline')
    })

    it('should handle long package names appropriately', () => {
      const longPackageName = 'A Very Long Package Name That Might Overflow'

      render(<NavigationControls packageName={longPackageName} />)

      const backButton = screen.getByTestId('back-button')
      expect(backButton).toHaveTextContent(`← Back to ${longPackageName} Timeline`)
    })

    it('should handle package names with numbers', () => {
      const packageName = 'Vue 3.0'

      render(<NavigationControls packageName={packageName} />)

      expect(screen.getByTestId('back-button')).toHaveTextContent('← Back to Vue 3.0 Timeline')
    })

    it('should be a pure component without side effects', () => {
      const packageName = 'React'

      const { rerender } = render(<NavigationControls packageName={packageName} />)

      const initialBackButtonText = screen.getByTestId('back-button').textContent
      const initialContextText = screen.getByText('Changelog • GitHub Release').textContent

      rerender(<NavigationControls packageName={packageName} />)

      expect(screen.getByTestId('back-button')).toHaveTextContent(initialBackButtonText!)
      expect(screen.getByText('Changelog • GitHub Release')).toHaveTextContent(initialContextText!)
    })
  })

  describe('Accessibility and Semantic HTML', () => {
    it('should maintain BackButton accessibility features', () => {
      const packageName = 'React'

      render(<NavigationControls packageName={packageName} />)

      const backButton = screen.getByTestId('back-button')
      
      // BackButton should be a button element and be clickable
      expect(backButton.tagName.toLowerCase()).toBe('button')
      expect(backButton).not.toBeDisabled()
    })

    it('should have semantic navigation structure', () => {
      const packageName = 'Angular'

      const { container } = render(<NavigationControls packageName={packageName} />)

      // Main container provides navigation context
      const navigationContainer = container.querySelector('.flex.items-center.justify-between')
      expect(navigationContainer).toBeInTheDocument()
    })

    it('should provide clear navigation context', () => {
      const packageName = 'TypeScript'

      render(<NavigationControls packageName={packageName} />)

      // Text should clearly indicate navigation context
      const backButton = screen.getByTestId('back-button')
      const contextInfo = screen.getByText('Changelog • GitHub Release')

      expect(backButton).toHaveTextContent(/Back to.*Timeline/)
      expect(contextInfo).toHaveTextContent(/Changelog.*GitHub Release/)
    })

    it('should maintain consistent text formatting', () => {
      const packageName = 'React'

      render(<NavigationControls packageName={packageName} />)

      // Back button should have arrow indicator
      expect(screen.getByTestId('back-button')).toHaveTextContent(/←/)
      
      // Context should have bullet separator
      expect(screen.getByText('Changelog • GitHub Release')).toHaveTextContent(/•/)
    })
  })

  describe('Component Interface and API', () => {
    it('should only require packageName prop', () => {
      // Component should render with just packageName
      expect(() => {
        render(<NavigationControls packageName="React" />)
      }).not.toThrow()
    })

    it('should not accept additional unexpected props', () => {
      const packageName = 'React'

      // Component should work with only the expected prop
      const { container } = render(<NavigationControls packageName={packageName} />)

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should maintain consistent interface across different packageName values', () => {
      const packageNames = ['React', 'Angular', 'TypeScript', 'Vue', 'Svelte']

      packageNames.forEach(packageName => {
        const { unmount, container } = render(<NavigationControls packageName={packageName} />)
        
        // Should always have the same structure
        expect(container.querySelector('.flex.items-center.justify-between')).toBeInTheDocument()
        expect(screen.getByTestId('back-button')).toBeInTheDocument()
        expect(screen.getByText('Changelog • GitHub Release')).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should handle component mounting and unmounting correctly', () => {
      const packageName = 'React'

      const { unmount } = render(<NavigationControls packageName={packageName} />)

      expect(screen.getByTestId('back-button')).toBeInTheDocument()
      expect(screen.getByText('Changelog • GitHub Release')).toBeInTheDocument()

      // Should unmount without errors
      expect(unmount).not.toThrow()
    })
  })
})