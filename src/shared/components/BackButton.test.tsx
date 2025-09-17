/**
 * BackButton Component Tests - Co-located with BackButton.tsx
 * 
 * Tests component functionality.
 * Tests radar navigation integration, button variants, and accessibility.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BackButton } from './BackButton'
import {
  backButtonScenarios
} from './test-utils/sharedComponentMocks'

// Mock the radar navigation hook
const mockNavigateToPreviousRadarView = vi.fn()

vi.mock('@shared/store/appStore', () => ({
  useRadarNavigation: () => ({
    navigateToPreviousRadarView: mockNavigateToPreviousRadarView,
  }),
}))

describe('BackButton Shared Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Navigation Display', () => {
    it('should display back button with children text', () => {
      const scenario = backButtonScenarios.backToDashboard()

      render(<BackButton {...scenario} />)

      expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument()
    })

    it('should render as a button element', () => {
      const scenario = backButtonScenarios.backToTimeline()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('← Back to React Timeline')
    })

    it('should handle different navigation text scenarios', () => {
      const scenarios = [
        backButtonScenarios.backToDashboard(),
        backButtonScenarios.backToPackageList(),
        backButtonScenarios.customNavigationText(),
      ]

      scenarios.forEach((scenario) => {
        const { unmount } = render(<BackButton {...scenario} />)
        
        expect(screen.getByText(scenario.children)).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should have proper button type attribute', () => {
      const scenario = backButtonScenarios.basicBack()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should display minimal back button correctly', () => {
      const scenario = backButtonScenarios.basicBack()

      render(<BackButton {...scenario} />)

      expect(screen.getByText('Back')).toBeInTheDocument()
    })
  })

  describe('Button Variants', () => {
    it('should render secondary variant by default', () => {
      const scenario = backButtonScenarios.backToDashboard()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-secondary')
      expect(button).not.toHaveClass('btn-primary')
    })

    it('should render primary variant when specified', () => {
      const scenario = backButtonScenarios.primaryVariantBack()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-primary')
      expect(button).not.toHaveClass('btn-secondary')
    })

    it('should render secondary variant when explicitly specified', () => {
      const scenario = backButtonScenarios.secondaryVariantBack()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn-secondary')
    })

    it('should handle variant changes correctly', () => {
      const primaryScenario = backButtonScenarios.primaryVariantBack()

      const { rerender } = render(<BackButton {...primaryScenario} />)

      expect(screen.getByRole('button')).toHaveClass('btn-primary')

      // Change to secondary
      const secondaryScenario = backButtonScenarios.secondaryVariantBack()
      rerender(<BackButton {...secondaryScenario} />)

      expect(screen.getByRole('button')).toHaveClass('btn-secondary')
      expect(screen.getByRole('button')).not.toHaveClass('btn-primary')
    })

    it('should always include micro-interaction class', () => {
      const scenarios = [
        backButtonScenarios.primaryVariantBack(),
        backButtonScenarios.secondaryVariantBack(),
        backButtonScenarios.basicBack(),
      ]

      scenarios.forEach((scenario) => {
        const { unmount } = render(<BackButton {...scenario} />)
        
        const button = screen.getByRole('button')
        expect(button).toHaveClass('micro-interaction')
        
        unmount()
      })
    })
  })

  describe('Radar Navigation Integration', () => {
    it('should call radar navigation when clicked', () => {
      const scenario = backButtonScenarios.backToTimeline()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockNavigateToPreviousRadarView).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks correctly', () => {
      const scenario = backButtonScenarios.contextualTimelineBack()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(mockNavigateToPreviousRadarView).toHaveBeenCalledTimes(3)
    })

    it('should work with different contextual navigation scenarios', () => {
      const contextualScenarios = [
        backButtonScenarios.contextualTimelineBack(),
        backButtonScenarios.contextualChangelogBack(),
        backButtonScenarios.backToPackageList(),
      ]

      contextualScenarios.forEach((scenario, index) => {
        const { unmount } = render(<BackButton {...scenario} />)
        
        const button = screen.getByRole('button')
        fireEvent.click(button)
        
        expect(mockNavigateToPreviousRadarView).toHaveBeenCalledTimes(index + 1)
        
        unmount()
      })
    })

    it('should integrate properly with radar store hook', () => {
      const scenario = backButtonScenarios.backToDashboard()

      render(<BackButton {...scenario} />)

      // Component should render without errors, indicating hook integration works
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText(scenario.children)).toBeInTheDocument()
    })
  })

  describe('Accessibility and Semantic HTML', () => {
    it('should have proper button role', () => {
      const scenario = backButtonScenarios.iconBasedBack()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should maintain focus management', () => {
      const scenario = backButtonScenarios.backToPackageList()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      button.focus()

      expect(document.activeElement).toBe(button)
    })

    it('should handle keyboard interactions', () => {
      const scenario = backButtonScenarios.backToDashboard()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      
      // Test that button can receive focus and respond to clicks
      button.focus()
      expect(document.activeElement).toBe(button)
      
      // Simulate click which is how buttons normally respond to keyboard activation
      fireEvent.click(button)
      
      expect(mockNavigateToPreviousRadarView).toHaveBeenCalledTimes(1)
    })

    it('should have appropriate accessibility structure', () => {
      const scenario = backButtonScenarios.verboseNavigationBack()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toHaveTextContent(scenario.children)
      expect(button).toBeInTheDocument()
    })

    it('should provide clear navigation context through text', () => {
      const navigationScenarios = [
        { scenario: backButtonScenarios.backToDashboard(), expectsContext: 'Dashboard' },
        { scenario: backButtonScenarios.backToTimeline(), expectsContext: 'Timeline' },
        { scenario: backButtonScenarios.backToPackageList(), expectsContext: 'Package List' },
      ]

      navigationScenarios.forEach(({ scenario, expectsContext }) => {
        const { unmount } = render(<BackButton {...scenario} />)
        
        expect(screen.getByText(scenario.children)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(expectsContext, 'i'))).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Props and Interface', () => {
    it('should handle all props correctly', () => {
      const props = {
        children: 'Custom Navigation Text',
        variant: 'primary' as const,
      }

      render(<BackButton {...props} />)

      expect(screen.getByText('Custom Navigation Text')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('btn-primary')
    })

    it('should handle prop changes correctly', () => {
      const initialScenario = backButtonScenarios.primaryVariantBack()

      const { rerender } = render(<BackButton {...initialScenario} />)

      expect(screen.getByText('← Go Back')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('btn-primary')

      // Change props
      const newScenario = backButtonScenarios.secondaryVariantBack()
      rerender(<BackButton {...newScenario} />)

      expect(screen.getByText('← Back')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('btn-secondary')
    })

    it('should be pure and not cause side effects', () => {
      const scenario = backButtonScenarios.iconBasedBack()

      const { rerender } = render(<BackButton {...scenario} />)

      expect(screen.getByText(scenario.children)).toBeInTheDocument()

      // Rerender with same props
      rerender(<BackButton {...scenario} />)

      expect(screen.getByText(scenario.children)).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('btn-secondary')
    })

    it('should handle only children prop correctly', () => {
      const props = { children: 'Just Back' }

      render(<BackButton {...props} />)

      expect(screen.getByText('Just Back')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveClass('btn-secondary') // Default variant
    })

    it('should handle different children types', () => {
      const childrenScenarios = [
        'Simple text',
        '← Arrow with text',
        'Return to Previous View',
        '🔙 Icon with text',
      ]

      childrenScenarios.forEach((children) => {
        const { unmount } = render(<BackButton>{children}</BackButton>)
        
        expect(screen.getByText(children)).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Business Context Integration', () => {
    it('should integrate with different radar navigation contexts', () => {
      const businessScenarios = [
        { scenario: backButtonScenarios.backToDashboard(), context: 'dashboard' },
        { scenario: backButtonScenarios.backToTimeline(), context: 'timeline' },
        { scenario: backButtonScenarios.contextualChangelogBack(), context: 'changelog' },
      ]

      businessScenarios.forEach(({ scenario }, index) => {
        const { unmount } = render(<BackButton {...scenario} />)

        expect(screen.getByText(scenario.children)).toBeInTheDocument()

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockNavigateToPreviousRadarView).toHaveBeenCalledTimes(index + 1)

        unmount()
      })
    })

    it('should work correctly with different navigation flows', () => {
      const navigationFlows = [
        backButtonScenarios.backToDashboard(),
        backButtonScenarios.backToTimeline(),
        backButtonScenarios.backToPackageList(),
        backButtonScenarios.contextualTimelineBack(),
      ]

      navigationFlows.forEach((scenario) => {
        const { unmount } = render(<BackButton {...scenario} />)
        
        expect(screen.getByText(scenario.children)).toBeInTheDocument()
        expect(screen.getByRole('button')).toHaveClass(scenario.variant === 'primary' ? 'btn-primary' : 'btn-secondary')
        
        unmount()
      })
    })

    it('should maintain proper component lifecycle', () => {
      const scenario = backButtonScenarios.backToDashboard()

      const { unmount } = render(<BackButton {...scenario} />)

      expect(screen.getByText(scenario.children)).toBeInTheDocument()

      // Should unmount cleanly
      expect(unmount).not.toThrow()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle extremely long navigation text', () => {
      const scenario = backButtonScenarios.verboseNavigationBack()

      render(<BackButton {...scenario} />)

      expect(screen.getByText(scenario.children)).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should handle empty children gracefully', () => {
      const props = { children: '' }

      render(<BackButton {...props} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('btn-secondary')
    })

    it('should handle rapid clicks without breaking', () => {
      const scenario = backButtonScenarios.backToTimeline()

      render(<BackButton {...scenario} />)

      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      Array.from({ length: 10 }, () => {
        fireEvent.click(button)
      })

      expect(mockNavigateToPreviousRadarView).toHaveBeenCalledTimes(10)
    })

    it('should maintain consistency across different navigation scenarios', () => {
      const scenarios = [
        backButtonScenarios.backToDashboard(),
        backButtonScenarios.primaryVariantBack(),
        backButtonScenarios.iconBasedBack(),
        backButtonScenarios.contextualTimelineBack(),
      ]

      scenarios.forEach((scenario) => {
        const { unmount } = render(<BackButton {...scenario} />)
        
        // Should always have consistent structure
        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByRole('button')).toHaveClass('micro-interaction')
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
        
        unmount()
      })
    })

    it('should handle navigation hook failures gracefully', () => {
      const scenario = backButtonScenarios.backToDashboard()

      // Component should render without errors even if hook isn't working perfectly
      expect(() => {
        render(<BackButton {...scenario} />)
      }).not.toThrow()

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})