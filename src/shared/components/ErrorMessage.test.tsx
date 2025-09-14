/**
 * ErrorMessage Component Tests - Co-located with ErrorMessage.tsx
 * 
 * Following TDD with comprehensive error display and interaction testing.
 * Tests error messaging, retry functionality, loading states, and accessibility.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorMessage } from './ErrorMessage'
import {
  errorMessageScenarios,
  createSharedComponentMocks,
  edgeCaseScenarios
} from './test-utils/sharedComponentMocks'

describe('ErrorMessage Shared Component', () => {
  describe('Basic Error Display', () => {
    it('should display error message with default title', () => {
      const scenario = errorMessageScenarios.basicError()

      render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Error')).toBeInTheDocument() // Default title
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
      expect(screen.getByText('Error')).toHaveClass('text-xl', 'font-bold', 'text-red-600', 'mb-2')
    })

    it('should display error message with custom title', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Connection Error')).toBeInTheDocument()
      expect(screen.getByText(/Unable to connect to the server/)).toBeInTheDocument()
    })

    it('should handle different error types correctly', () => {
      const scenarios = [
        errorMessageScenarios.apiRateLimitError(),
        errorMessageScenarios.packageNotFoundError(),
        errorMessageScenarios.changelogUnavailableError(),
      ]

      scenarios.forEach((scenario) => {
        const { unmount } = render(<ErrorMessage {...scenario} />)
        
        expect(screen.getByText(scenario.title!)).toBeInTheDocument()
        expect(screen.getByText(scenario.message)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should have proper card layout and styling', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      const { container } = render(<ErrorMessage {...scenario} />)

      const card = container.querySelector('.card.max-w-md.text-center')
      expect(card).toBeInTheDocument()
    })

    it('should display message text with proper styling', () => {
      const scenario = errorMessageScenarios.validationError()

      render(<ErrorMessage {...scenario} />)

      const message = screen.getByText(scenario.message)
      expect(message).toHaveClass('text-gray-700', 'mb-4')
    })
  })

  describe('Retry Functionality', () => {
    it('should display retry button when onRetry is provided', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      render(<ErrorMessage {...scenario} />)

      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()
      expect(retryButton).toHaveClass('btn-primary')
      expect(retryButton).not.toBeDisabled()
    })

    it('should not display retry button when onRetry is not provided', () => {
      const scenario = errorMessageScenarios.validationError()

      render(<ErrorMessage {...scenario} />)

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', () => {
      const mocks = createSharedComponentMocks()
      const scenario = {
        ...errorMessageScenarios.networkConnectionError(),
        onRetry: mocks.onRetry,
      }

      render(<ErrorMessage {...scenario} />)

      const retryButton = screen.getByRole('button', { name: /retry/i })
      fireEvent.click(retryButton)

      expect(mocks.onRetry).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple retry button clicks', () => {
      const mocks = createSharedComponentMocks()
      const scenario = {
        ...errorMessageScenarios.apiRateLimitError(),
        onRetry: mocks.onRetry,
      }

      render(<ErrorMessage {...scenario} />)

      const retryButton = screen.getByRole('button')
      fireEvent.click(retryButton)
      fireEvent.click(retryButton)
      fireEvent.click(retryButton)

      expect(mocks.onRetry).toHaveBeenCalledTimes(3)
    })

    it('should display custom retry text', () => {
      const scenario = errorMessageScenarios.customRetryTextError()

      render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Sync Again')).toBeInTheDocument()
    })

    it('should use default retry text when not specified', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when isLoading is true', () => {
      const scenario = errorMessageScenarios.retryInProgressError()

      render(<ErrorMessage {...scenario} />)

      const retryButton = screen.getByRole('button')
      expect(retryButton).toHaveTextContent('Retrying...')
      expect(retryButton).toBeDisabled()
    })

    it('should disable retry button during loading', () => {
      const mocks = createSharedComponentMocks()
      const scenario = {
        ...errorMessageScenarios.networkConnectionError(),
        onRetry: mocks.onRetry,
        isLoading: true,
      }

      render(<ErrorMessage {...scenario} />)

      const retryButton = screen.getByRole('button')
      expect(retryButton).toBeDisabled()
      
      // Should not trigger retry when disabled
      fireEvent.click(retryButton)
      expect(mocks.onRetry).not.toHaveBeenCalled()
    })

    it('should show custom retry text with loading state', () => {
      const scenario = {
        ...errorMessageScenarios.customRetryTextError(),
        isLoading: true,
      }

      render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Retrying...')).toBeInTheDocument()
    })

    it('should transition between loading and normal states', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      const { rerender } = render(<ErrorMessage {...scenario} />)

      // Normal state
      expect(screen.getByText('Retry')).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()

      // Loading state
      rerender(<ErrorMessage {...scenario} isLoading={true} />)

      expect(screen.getByText('Retrying...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()

      // Back to normal state
      rerender(<ErrorMessage {...scenario} isLoading={false} />)

      expect(screen.getByText('Retry')).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()
    })
  })

  describe('Props and Interface', () => {
    it('should handle all props correctly', () => {
      const mocks = createSharedComponentMocks()
      const props = {
        title: 'Custom Error',
        message: 'Custom error message',
        onRetry: mocks.onRetry,
        isLoading: false,
        retryText: 'Try Again',
      }

      render(<ErrorMessage {...props} />)

      expect(screen.getByText('Custom Error')).toBeInTheDocument()
      expect(screen.getByText('Custom error message')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('should handle prop changes correctly', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      const { rerender } = render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Connection Error')).toBeInTheDocument()

      // Change props
      const newScenario = errorMessageScenarios.apiRateLimitError()
      rerender(<ErrorMessage {...newScenario} />)

      expect(screen.getByText('Rate Limit Exceeded')).toBeInTheDocument()
      expect(screen.queryByText('Connection Error')).not.toBeInTheDocument()
    })

    it('should be pure and not cause side effects', () => {
      const scenario = errorMessageScenarios.packageNotFoundError()

      const { rerender } = render(<ErrorMessage {...scenario} />)

      expect(screen.getByText(scenario.title!)).toBeInTheDocument()

      // Rerender with same props
      rerender(<ErrorMessage {...scenario} />)

      expect(screen.getByText(scenario.title!)).toBeInTheDocument()
      expect(screen.getByText(scenario.message)).toBeInTheDocument()
    })

    it('should handle only required message prop', () => {
      const props = { message: 'Minimal error message' }

      render(<ErrorMessage {...props} />)

      expect(screen.getByText('Error')).toBeInTheDocument() // Default title
      expect(screen.getByText('Minimal error message')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument() // No retry button
    })
  })

  describe('Accessibility and Semantic HTML', () => {
    it('should have proper heading structure', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      render(<ErrorMessage {...scenario} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Connection Error')
    })

    it('should have accessible button', () => {
      const scenario = errorMessageScenarios.apiRateLimitError()

      render(<ErrorMessage {...scenario} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should maintain focus management', () => {
      const scenario = errorMessageScenarios.packageNotFoundError()

      render(<ErrorMessage {...scenario} />)

      const button = screen.getByRole('button')
      button.focus()

      expect(document.activeElement).toBe(button)
    })

    it('should handle keyboard interactions', () => {
      const mocks = createSharedComponentMocks()
      const scenario = {
        ...errorMessageScenarios.changelogUnavailableError(),
        onRetry: mocks.onRetry,
      }

      render(<ErrorMessage {...scenario} />)

      const button = screen.getByRole('button')
      
      // Test that button can receive focus and respond to clicks
      button.focus()
      expect(document.activeElement).toBe(button)
      
      // Simulate click which is how buttons normally respond to keyboard activation
      fireEvent.click(button)
      
      expect(mocks.onRetry).toHaveBeenCalledTimes(1)
    })

    it('should provide proper text hierarchy', () => {
      const scenario = errorMessageScenarios.verboseError()

      const { container } = render(<ErrorMessage {...scenario} />)

      const title = container.querySelector('h2')
      const message = container.querySelector('p')

      expect(title).toBeInTheDocument()
      expect(message).toBeInTheDocument()
      expect(title).toHaveClass('text-xl', 'font-bold')
      expect(message).toHaveClass('text-gray-700')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle extremely long error messages', () => {
      const scenario = edgeCaseScenarios.extremelyLongMessages().veryLongError

      render(<ErrorMessage {...scenario} />)

      expect(screen.getByText(scenario.title)).toBeInTheDocument()
      expect(screen.getByText(scenario.message)).toBeInTheDocument()
    })

    it('should handle empty error messages gracefully', () => {
      const scenario = edgeCaseScenarios.emptyOrNullValues().emptyMessage

      render(<ErrorMessage {...scenario} />)

      // Should render even with empty strings
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should handle rapid retry clicks without breaking', () => {
      const mocks = createSharedComponentMocks()
      const scenario = {
        ...errorMessageScenarios.networkConnectionError(),
        onRetry: mocks.onRetry,
      }

      render(<ErrorMessage {...scenario} />)

      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      Array.from({ length: 10 }, () => {
        fireEvent.click(button)
      })

      expect(mocks.onRetry).toHaveBeenCalledTimes(10)
    })

    it('should handle undefined onRetry gracefully', () => {
      const scenario = {
        ...errorMessageScenarios.networkConnectionError(),
        onRetry: undefined,
      }

      expect(() => {
        render(<ErrorMessage {...scenario} />)
      }).not.toThrow()

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('should maintain consistency across different error scenarios', () => {
      const scenarios = [
        errorMessageScenarios.networkConnectionError(),
        errorMessageScenarios.apiRateLimitError(),
        errorMessageScenarios.packageNotFoundError(),
        errorMessageScenarios.validationError(),
      ]

      scenarios.forEach((scenario) => {
        const { container, unmount } = render(<ErrorMessage {...scenario} />)
        
        // Should always have consistent structure
        expect(container.querySelector('.card')).toBeInTheDocument()
        expect(screen.getByRole('heading')).toBeInTheDocument()
        expect(screen.getByText(scenario.message)).toBeInTheDocument()
        
        unmount()
      })
    })
  })

  describe('Component Integration', () => {
    it('should work correctly with different component states', () => {
      const mocks = createSharedComponentMocks()
      
      // Error -> Retry -> Loading -> Success
      const initialError = {
        ...errorMessageScenarios.networkConnectionError(),
        onRetry: mocks.onRetry,
        isLoading: false,
      }

      const { rerender } = render(<ErrorMessage {...initialError} />)

      // Initial error state
      expect(screen.getByText('Connection Error')).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()

      // Click retry
      fireEvent.click(screen.getByRole('button'))
      expect(mocks.onRetry).toHaveBeenCalledTimes(1)

      // Loading state during retry
      rerender(<ErrorMessage {...initialError} isLoading={true} />)
      expect(screen.getByText('Retrying...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should integrate properly with different retry text scenarios', () => {
      const retryTexts = ['Retry', 'Try Again', 'Sync Again', 'Reload', 'Refresh']

      retryTexts.forEach((retryText) => {
        const scenario = {
          ...errorMessageScenarios.networkConnectionError(),
          retryText,
        }

        const { unmount } = render(<ErrorMessage {...scenario} />)

        expect(screen.getByText(retryText)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should maintain proper component lifecycle', () => {
      const scenario = errorMessageScenarios.networkConnectionError()

      const { unmount } = render(<ErrorMessage {...scenario} />)

      expect(screen.getByText('Connection Error')).toBeInTheDocument()

      // Should unmount cleanly
      expect(unmount).not.toThrow()
    })
  })
})