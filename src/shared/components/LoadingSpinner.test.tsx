/**
 * LoadingSpinner Component Tests - Simplified for new implementation
 *
 * Tests the basic functionality of the simplified LoadingSpinner component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner Shared Component', () => {
  describe('Basic Rendering', () => {
    it('should display loading spinner with default props', () => {
      render(<LoadingSpinner />)

      expect(screen.getByText('⏳')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should display custom message', () => {
      render(<LoadingSpinner message="Fetching data..." />)

      expect(screen.getByText('⏳')).toBeInTheDocument()
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })

    it('should have proper layout structure', () => {
      const { container } = render(<LoadingSpinner />)

      const wrapper = container.querySelector('.text-center')
      expect(wrapper).toBeInTheDocument()
    })

    it('should display message text with proper styling', () => {
      render(<LoadingSpinner message="Test message" />)

      const message = screen.getByText('Test message')
      expect(message).toHaveClass('text-gray-600')
    })
  })

  describe('Animation and Styling', () => {
    it('should have animation class applied to icon', () => {
      const { container } = render(<LoadingSpinner />)

      const iconElement = container.querySelector('.animate-pulse-soft')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveClass('mb-2')
    })

    it('should render with consistent size', () => {
      const { container } = render(<LoadingSpinner />)

      const iconElement = container.querySelector('.text-2xl')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveTextContent('⏳')
    })

    it('should maintain consistent styling', () => {
      const { container } = render(<LoadingSpinner message="Test" />)

      expect(container.querySelector('.text-center')).toBeInTheDocument()
      expect(container.querySelector('.animate-pulse-soft')).toBeInTheDocument()
      expect(container.querySelector('.text-gray-600')).toBeInTheDocument()
    })
  })

  describe('Message Handling', () => {
    it('should display custom messages correctly', () => {
      render(<LoadingSpinner message="Loading TypeScript definitions..." />)

      expect(screen.getByText('⏳')).toBeInTheDocument()
      expect(screen.getByText('Loading TypeScript definitions...')).toBeInTheDocument()
    })

    it('should always display loading icon', () => {
      render(<LoadingSpinner message="Test" />)

      const iconElement = document.querySelector('.animate-pulse-soft')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveTextContent('⏳')
    })

    it('should handle long messages correctly', () => {
      const longMessage = 'Processing large dataset. This may take several moments to complete...'
      render(<LoadingSpinner message={longMessage} />)

      expect(screen.getByText(longMessage)).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('should render with default message when not specified', () => {
      render(<LoadingSpinner />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('Props and Interface', () => {
    it('should handle message prop correctly', () => {
      render(<LoadingSpinner message="Custom loading message" />)

      expect(screen.getByText('Custom loading message')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('should handle prop changes correctly', () => {
      const { rerender } = render(<LoadingSpinner message="Initial message" />)

      expect(screen.getByText('Initial message')).toBeInTheDocument()

      // Change props
      rerender(<LoadingSpinner message="Updated message" />)

      expect(screen.getByText('Updated message')).toBeInTheDocument()
      expect(screen.queryByText('Initial message')).not.toBeInTheDocument()
    })

    it('should be pure and not cause side effects', () => {
      const { rerender } = render(<LoadingSpinner message="Test message" />)

      expect(screen.getByText('⏳')).toBeInTheDocument()

      // Rerender with same props
      rerender(<LoadingSpinner message="Test message" />)

      expect(screen.getByText('⏳')).toBeInTheDocument()
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('should handle empty message gracefully', () => {
      render(<LoadingSpinner message="" />)

      // Should render even with empty message
      expect(screen.getByText('⏳')).toBeInTheDocument()
      const messageElement = document.querySelector('.text-gray-600')
      expect(messageElement).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle extremely long messages', () => {
      const extremelyLongMessage = 'This is an extremely long error message that should test how the component handles text wrapping, overflow, and maintains readability even when the content exceeds normal expectations. It includes multiple sentences and should demonstrate the component\'s ability to handle verbose error descriptions without breaking the layout or user experience.'

      render(<LoadingSpinner message={extremelyLongMessage} />)

      expect(screen.getByText(extremelyLongMessage)).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
    })

    it('should maintain consistency across rerenders', () => {
      const { container, rerender } = render(<LoadingSpinner message="Test" />)

      // Should always have consistent structure
      expect(container.querySelector('.text-center')).toBeInTheDocument()
      expect(container.querySelector('.animate-pulse-soft')).toBeInTheDocument()
      expect(container.querySelector('.text-gray-600')).toBeInTheDocument()

      rerender(<LoadingSpinner message="Different message" />)

      // Structure should remain the same
      expect(container.querySelector('.text-center')).toBeInTheDocument()
      expect(container.querySelector('.animate-pulse-soft')).toBeInTheDocument()
      expect(container.querySelector('.text-gray-600')).toBeInTheDocument()
    })

    it('should handle rapid prop changes without breaking', () => {
      const messages = [
        'First message',
        'Second message',
        'Third message',
      ]

      const { rerender } = render(<LoadingSpinner message={messages[0]} />)

      // Rapid prop changes
      messages.forEach((message) => {
        rerender(<LoadingSpinner message={message} />)

        expect(screen.getByText('⏳')).toBeInTheDocument()
        expect(screen.getByText(message)).toBeInTheDocument()
      })
    })
  })
})