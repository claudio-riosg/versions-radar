/**
 * LoadingSpinner Component Tests - Co-located with LoadingSpinner.tsx
 * 
 * Following TDD with comprehensive loading state testing.
 * Tests different sizes, custom messages, icons, and loading patterns.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'
import {
  loadingSpinnerScenarios,
  edgeCaseScenarios
} from './test-utils/sharedComponentMocks'

describe('LoadingSpinner Shared Component', () => {
  describe('Basic Loading Display', () => {
    it('should display loading spinner with default props', () => {
      const scenario = loadingSpinnerScenarios.basicLoading()

      render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText('🔄')).toBeInTheDocument() // Default icon
      expect(screen.getByText('Loading...')).toBeInTheDocument() // Default message
    })

    it('should display custom message and icon', () => {
      const scenario = loadingSpinnerScenarios.packageDetailsLoading()

      render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText('⚛️')).toBeInTheDocument()
      expect(screen.getByText('Fetching React package information...')).toBeInTheDocument()
    })

    it('should handle different business loading scenarios', () => {
      const scenarios = [
        loadingSpinnerScenarios.dashboardLoading(),
        loadingSpinnerScenarios.versionHistoryLoading(),
        loadingSpinnerScenarios.changelogLoading(),
      ]

      scenarios.forEach((scenario) => {
        const { unmount } = render(<LoadingSpinner {...scenario} />)
        
        expect(screen.getByText(scenario.icon!)).toBeInTheDocument()
        expect(screen.getByText(scenario.message!)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should have proper layout structure', () => {
      const scenario = loadingSpinnerScenarios.packageDetailsLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      const wrapper = container.querySelector('.text-center')
      expect(wrapper).toBeInTheDocument()
    })

    it('should display message text with proper styling', () => {
      const scenario = loadingSpinnerScenarios.dataSyncLoading()

      render(<LoadingSpinner {...scenario} />)

      const message = screen.getByText(scenario.message!)
      expect(message).toHaveClass('text-gray-600')
    })
  })

  describe('Size Variations', () => {
    it('should render small size correctly', () => {
      const scenario = loadingSpinnerScenarios.smallSpinnerLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      const iconElement = container.querySelector('.text-lg')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveTextContent('🔄')
    })

    it('should render medium size correctly', () => {
      const scenario = loadingSpinnerScenarios.packageSearchLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      const iconElement = container.querySelector('.text-2xl')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveTextContent('🔍')
    })

    it('should render large size correctly', () => {
      const scenario = loadingSpinnerScenarios.largeSpinnerLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      const iconElement = container.querySelector('.text-4xl')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveTextContent('🚀')
    })

    it('should default to medium size when not specified', () => {
      const props = { message: 'Default size test', icon: '⏳' }

      const { container } = render(<LoadingSpinner {...props} />)

      const iconElement = container.querySelector('.text-2xl')
      expect(iconElement).toBeInTheDocument()
    })

    it('should handle all size options correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      const expectedClasses = ['text-lg', 'text-2xl', 'text-4xl']

      sizes.forEach((size, index) => {
        const { container, unmount } = render(
          <LoadingSpinner size={size} message="Test" icon="🔄" />
        )

        const iconElement = container.querySelector(`.${expectedClasses[index]}`)
        expect(iconElement).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Icon and Message Handling', () => {
    it('should display custom icons correctly', () => {
      const scenario = loadingSpinnerScenarios.customIconLoading()

      render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText('📘')).toBeInTheDocument()
      expect(screen.getByText('Loading TypeScript definitions...')).toBeInTheDocument()
    })

    it('should handle empty icon gracefully', () => {
      const scenario = loadingSpinnerScenarios.noIconLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      // Icon div should still exist but be empty
      const iconElement = container.querySelector('.animate-pulse-soft')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveTextContent('')
    })

    it('should display long messages correctly', () => {
      const scenario = loadingSpinnerScenarios.heavyOperationLoading()

      render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText(/Processing large dataset/)).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('should handle different contextual icons', () => {
      const scenarios = [
        { scenario: loadingSpinnerScenarios.packageDetailsLoading(), expectedIcon: '⚛️' },
        { scenario: loadingSpinnerScenarios.packageSearchLoading(), expectedIcon: '🔍' },
        { scenario: loadingSpinnerScenarios.dataSyncLoading(), expectedIcon: '🔄' },
      ]

      scenarios.forEach(({ scenario, expectedIcon }) => {
        const { unmount } = render(<LoadingSpinner {...scenario} />)
        
        expect(screen.getByText(expectedIcon)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should maintain message consistency across rerenders', () => {
      const scenario = loadingSpinnerScenarios.changelogLoading()

      const { rerender } = render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText('Loading React 18.2.0 Changelog')).toBeInTheDocument()

      // Rerender with same props
      rerender(<LoadingSpinner {...scenario} />)

      expect(screen.getByText('Loading React 18.2.0 Changelog')).toBeInTheDocument()
    })
  })

  describe('Animation and Styling', () => {
    it('should have animation class applied to icon', () => {
      const scenario = loadingSpinnerScenarios.dashboardLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      const iconElement = container.querySelector('.animate-pulse-soft')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveClass('mb-2')
    })

    it('should apply correct size and animation classes together', () => {
      const scenario = loadingSpinnerScenarios.largeSpinnerLoading()

      const { container } = render(<LoadingSpinner {...scenario} />)

      const iconElement = container.querySelector('.animate-pulse-soft.text-4xl.mb-2')
      expect(iconElement).toBeInTheDocument()
    })

    it('should maintain consistent styling across different scenarios', () => {
      const scenarios = [
        loadingSpinnerScenarios.smallSpinnerLoading(),
        loadingSpinnerScenarios.packageDetailsLoading(),
        loadingSpinnerScenarios.largeSpinnerLoading(),
      ]

      scenarios.forEach((scenario) => {
        const { container, unmount } = render(<LoadingSpinner {...scenario} />)
        
        // Should always have center alignment
        expect(container.querySelector('.text-center')).toBeInTheDocument()
        
        // Should always have animated icon
        expect(container.querySelector('.animate-pulse-soft')).toBeInTheDocument()
        
        // Should always have proper message styling
        expect(container.querySelector('.text-gray-600')).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Props and Interface', () => {
    it('should handle all props correctly', () => {
      const props = {
        size: 'lg' as const,
        message: 'Custom loading message',
        icon: '🎯',
      }

      const { container } = render(<LoadingSpinner {...props} />)

      expect(container.querySelector('.text-4xl')).toBeInTheDocument()
      expect(screen.getByText('Custom loading message')).toBeInTheDocument()
      expect(screen.getByText('🎯')).toBeInTheDocument()
    })

    it('should handle prop changes correctly', () => {
      const initialScenario = loadingSpinnerScenarios.packageDetailsLoading()

      const { rerender } = render(<LoadingSpinner {...initialScenario} />)

      expect(screen.getByText('⚛️')).toBeInTheDocument()

      // Change props
      const newScenario = loadingSpinnerScenarios.packageSearchLoading()
      rerender(<LoadingSpinner {...newScenario} />)

      expect(screen.getByText('🔍')).toBeInTheDocument()
      expect(screen.queryByText('⚛️')).not.toBeInTheDocument()
    })

    it('should be pure and not cause side effects', () => {
      const scenario = loadingSpinnerScenarios.versionHistoryLoading()

      const { rerender } = render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText(scenario.icon!)).toBeInTheDocument()

      // Rerender with same props
      rerender(<LoadingSpinner {...scenario} />)

      expect(screen.getByText(scenario.icon!)).toBeInTheDocument()
      expect(screen.getByText(scenario.message!)).toBeInTheDocument()
    })

    it('should handle minimal props correctly', () => {
      const props = { message: 'Minimal loading' }

      render(<LoadingSpinner {...props} />)

      // Should use defaults
      expect(screen.getByText('🔄')).toBeInTheDocument() // Default icon
      expect(screen.getByText('Minimal loading')).toBeInTheDocument()
    })

    it('should handle only icon prop', () => {
      const props = { icon: '🌟' }

      render(<LoadingSpinner {...props} />)

      expect(screen.getByText('🌟')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument() // Default message
    })
  })

  describe('Business Context Integration', () => {
    it('should integrate with different business loading scenarios', () => {
      const businessScenarios = [
        { scenario: loadingSpinnerScenarios.dashboardLoading(), context: 'dashboard' },
        { scenario: loadingSpinnerScenarios.packageDetailsLoading(), context: 'package-details' },
        { scenario: loadingSpinnerScenarios.versionHistoryLoading(), context: 'version-history' },
        { scenario: loadingSpinnerScenarios.changelogLoading(), context: 'changelog' },
      ]

      businessScenarios.forEach(({ scenario }) => {
        const { unmount } = render(<LoadingSpinner {...scenario} />)
        
        expect(screen.getByText(scenario.icon!)).toBeInTheDocument()
        expect(screen.getByText(scenario.message!)).toBeInTheDocument()
        
        // Should maintain consistent UI structure
        const wrapper = document.querySelector('.text-center')
        expect(wrapper).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should work correctly with different operation types', () => {
      const operationScenarios = [
        loadingSpinnerScenarios.packageSearchLoading(),
        loadingSpinnerScenarios.dataSyncLoading(),
        loadingSpinnerScenarios.heavyOperationLoading(),
      ]

      operationScenarios.forEach((scenario) => {
        const { unmount } = render(<LoadingSpinner {...scenario} />)
        
        expect(screen.getByText(scenario.icon!)).toBeInTheDocument()
        expect(screen.getByText(scenario.message!)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should maintain proper component lifecycle', () => {
      const scenario = loadingSpinnerScenarios.packageDetailsLoading()

      const { unmount } = render(<LoadingSpinner {...scenario} />)

      expect(screen.getByText('⚛️')).toBeInTheDocument()

      // Should unmount cleanly
      expect(unmount).not.toThrow()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle extremely long messages', () => {
      const scenario = edgeCaseScenarios.extremelyLongMessages().veryLongError

      render(<LoadingSpinner message={scenario.message} icon="🔄" />)

      expect(screen.getByText(scenario.message)).toBeInTheDocument()
      expect(screen.getByText('🔄')).toBeInTheDocument()
    })

    it('should handle empty message gracefully', () => {
      const props = { message: '', icon: '🔄' }

      render(<LoadingSpinner {...props} />)

      // Should render even with empty message
      expect(screen.getByText('🔄')).toBeInTheDocument()
      const messageElement = document.querySelector('.text-gray-600')
      expect(messageElement).toBeInTheDocument()
    })

    it('should maintain consistency across different loading patterns', () => {
      const scenarios = [
        loadingSpinnerScenarios.smallSpinnerLoading(),
        loadingSpinnerScenarios.packageDetailsLoading(),
        loadingSpinnerScenarios.largeSpinnerLoading(),
        loadingSpinnerScenarios.heavyOperationLoading(),
      ]

      scenarios.forEach((scenario) => {
        const { container, unmount } = render(<LoadingSpinner {...scenario} />)
        
        // Should always have consistent structure
        expect(container.querySelector('.text-center')).toBeInTheDocument()
        expect(container.querySelector('.animate-pulse-soft')).toBeInTheDocument()
        expect(container.querySelector('.text-gray-600')).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should handle rapid prop changes without breaking', () => {
      const scenarios = [
        loadingSpinnerScenarios.packageDetailsLoading(),
        loadingSpinnerScenarios.packageSearchLoading(),
        loadingSpinnerScenarios.dataSyncLoading(),
      ]

      const { rerender } = render(<LoadingSpinner {...scenarios[0]} />)

      // Rapid prop changes
      scenarios.forEach((scenario) => {
        rerender(<LoadingSpinner {...scenario} />)
        
        expect(screen.getByText(scenario.icon!)).toBeInTheDocument()
        expect(screen.getByText(scenario.message!)).toBeInTheDocument()
      })
    })
  })
})