/**
 * Icon Component Tests - Following TDD RED-GREEN-REFACTOR
 * Comprehensive test suite for SVG sprite icon system
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Icon, TechIcon, UIIcon, LoadingIcon } from './Icon'
import { isValidIconName } from '@infrastructure/config/iconConfig'

// Mock the icon service validation in development
vi.mock('@shared/services/iconService', async () => {
  const actual = await vi.importActual('@shared/services/iconService')
  return {
    ...actual,
    validateIconProps: vi.fn(), // Mock to prevent validation errors in tests
  }
})

describe('Icon Component System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Core Icon Component', () => {
    describe('Basic Rendering', () => {
      it('should render SVG with correct basic attributes', () => {
        render(<Icon name="react" />)

        const svg = screen.getByTestId('icon-react')
        expect(svg).toBeInTheDocument()
        expect(svg.tagName).toBe('svg')
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
        expect(svg).toHaveAttribute('fill', 'currentColor')
      })

      it('should render use element with correct sprite reference', () => {
        render(<Icon name="typescript" />)

        const useElement = screen.getByTestId('icon-typescript').querySelector('use')
        expect(useElement).toBeInTheDocument()
        expect(useElement).toHaveAttribute('href', '#typescript')
      })

      it('should apply default size classes correctly', () => {
        render(<Icon name="angular" />)

        const svg = screen.getByTestId('icon-angular')
        expect(svg).toHaveClass('icon-md')
      })

      it('should apply custom size when specified', () => {
        render(<Icon name="react" size="lg" />)

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveClass('icon-lg')
      })

      it('should apply numeric size correctly', () => {
        render(<Icon name="react" size={32} />)

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveClass('w-[32px]', 'h-[32px]')
        expect(svg).toHaveAttribute('width', '32')
        expect(svg).toHaveAttribute('height', '32')
      })

      it('should apply variant color classes', () => {
        render(<Icon name="react" variant="primary" />)

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveClass('text-radar-blue')
      })

      it('should combine custom className with generated classes', () => {
        render(<Icon name="react" className="custom-class" />)

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveClass('custom-class', 'icon-md', 'text-current')
      })

      it('should use custom data-testid when provided', () => {
        render(<Icon name="react" data-testid="custom-test-id" />)

        expect(screen.getByTestId('custom-test-id')).toBeInTheDocument()
        expect(screen.queryByTestId('icon-react')).not.toBeInTheDocument()
      })
    })

    describe('Accessibility Features', () => {
      it('should be decorative by default (aria-hidden=true)', () => {
        render(<Icon name="react" />)

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveAttribute('aria-hidden', 'true')
        expect(svg).toHaveAttribute('role', 'presentation')
      })

      it('should render with semantic role when title provided', () => {
        render(
          <Icon
            name="react"
            accessibility={{
              title: 'React Framework',
              decorative: false
            }}
          />
        )

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveAttribute('role', 'img')
        expect(svg).toHaveAttribute('aria-label', 'React Framework')
        expect(svg).not.toHaveAttribute('aria-hidden')
      })

      it('should render title element when accessibility title provided', () => {
        render(
          <Icon
            name="react"
            accessibility={{
              title: 'React Logo',
              decorative: false
            }}
          />
        )

        const titleElement = screen.getByTestId('icon-react').querySelector('title')
        expect(titleElement).toBeInTheDocument()
        expect(titleElement).toHaveTextContent('React Logo')
      })

      it('should render description element when provided', () => {
        render(
          <Icon
            name="react"
            accessibility={{
              description: 'JavaScript library for building user interfaces',
              decorative: false
            }}
          />
        )

        const descElement = screen.getByTestId('icon-react').querySelector('desc')
        expect(descElement).toBeInTheDocument()
        expect(descElement).toHaveTextContent('JavaScript library for building user interfaces')
      })

      it('should allow explicit aria-hidden override', () => {
        render(
          <Icon
            name="react"
            accessibility={{ decorative: false, title: 'React' }}
            aria-hidden={true}
          />
        )

        const svg = screen.getByTestId('icon-react')
        expect(svg).toHaveAttribute('aria-hidden', 'true')
      })
    })

    describe('Performance Optimizations', () => {
      it('should be a memoized component', () => {
        expect(typeof Icon).toBe('object')
        expect(Icon.$$typeof).toBeDefined() // React memo components have $$typeof
      })

      it('should forward ref correctly', () => {
        const ref = { current: null }
        render(<Icon ref={ref} name="react" />)

        expect(ref.current).toBeInstanceOf(SVGSVGElement)
      })

      it('should have proper displayName for debugging', () => {
        expect(Icon.displayName).toBe('Icon')
      })
    })

    describe('Error Handling', () => {
      it('should handle invalid icon names gracefully in production', () => {
        // In production, validation is skipped for performance
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'

        expect(() => {
          render(<Icon name="invalid-icon" as any />)
        }).not.toThrow()

        process.env.NODE_ENV = originalEnv
      })
    })
  })

  describe('TechIcon Specialized Component', () => {
    it('should apply technology-specific defaults', () => {
      render(<TechIcon name="react" />)

      const svg = screen.getByTestId('icon-react')
      expect(svg).toHaveClass('icon-lg') // default lg size
      expect(svg).toHaveAttribute('role', 'img') // not decorative by default
      expect(svg).toHaveAttribute('aria-label', 'react logo') // auto-generated title
    })

    it('should allow custom accessibility title', () => {
      render(
        <TechIcon
          name="typescript"
          accessibility={{ title: 'TypeScript Programming Language' }}
        />
      )

      const svg = screen.getByTestId('icon-typescript')
      expect(svg).toHaveAttribute('aria-label', 'TypeScript Programming Language')
    })

    it('should have proper displayName', () => {
      expect(TechIcon.displayName).toBe('TechIcon')
    })
  })

  describe('UIIcon Specialized Component', () => {
    it('should apply UI-specific defaults', () => {
      render(<UIIcon name="search" />)

      const svg = screen.getByTestId('icon-search')
      expect(svg).toHaveClass('icon-sm') // default sm size
      expect(svg).toHaveAttribute('aria-hidden', 'true') // decorative by default
      expect(svg).toHaveAttribute('role', 'presentation')
    })

    it('should allow override of decorative default', () => {
      render(
        <UIIcon
          name="close"
          accessibility={{
            decorative: false,
            title: 'Close dialog'
          }}
        />
      )

      const svg = screen.getByTestId('icon-close')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg).toHaveAttribute('aria-label', 'Close dialog')
      expect(svg).not.toHaveAttribute('aria-hidden')
    })

    it('should have proper displayName', () => {
      expect(UIIcon.displayName).toBe('UIIcon')
    })
  })

  describe('LoadingIcon Specialized Component', () => {
    it('should apply loading-specific defaults and animation', () => {
      render(<LoadingIcon />)

      const svg = screen.getByTestId('icon-loading')
      expect(svg).toHaveClass('animate-spin', 'text-gray-400') // muted variant + animation
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg).toHaveAttribute('aria-label', 'Loading')
    })

    it('should include loading description for screen readers', () => {
      render(<LoadingIcon />)

      const descElement = screen.getByTestId('icon-loading').querySelector('desc')
      expect(descElement).toBeInTheDocument()
      expect(descElement).toHaveTextContent('Content is loading, please wait')
    })

    it('should allow custom size', () => {
      render(<LoadingIcon size="lg" />)

      const svg = screen.getByTestId('icon-loading')
      expect(svg).toHaveClass('icon-lg')
    })

    it('should combine custom className with animation', () => {
      render(<LoadingIcon className="text-blue-500" />)

      const svg = screen.getByTestId('icon-loading')
      expect(svg).toHaveClass('animate-spin', 'text-blue-500')
    })

    it('should have proper displayName', () => {
      expect(LoadingIcon.displayName).toBe('LoadingIcon')
    })
  })

  describe('Type Safety Integration', () => {
    it('should work with valid icon names from config', () => {
      // These should compile without TypeScript errors
      render(<Icon name="react" />)
      render(<Icon name="angular" />)
      render(<Icon name="typescript" />)
      render(<Icon name="loading" />)
      render(<Icon name="refresh" />)

      expect(screen.getByTestId('icon-react')).toBeInTheDocument()
      expect(screen.getByTestId('icon-angular')).toBeInTheDocument()
      expect(screen.getByTestId('icon-typescript')).toBeInTheDocument()
      expect(screen.getByTestId('icon-loading')).toBeInTheDocument()
      expect(screen.getByTestId('icon-refresh')).toBeInTheDocument()
    })

    it('should validate icon names at runtime in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      expect(isValidIconName('react')).toBe(true)
      expect(isValidIconName('invalid')).toBe(false)

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Tailwind CSS Integration', () => {
    it('should apply correct Tailwind classes for different variants', () => {
      const variants = [
        { variant: 'default' as const, expectedClass: 'text-current' },
        { variant: 'primary' as const, expectedClass: 'text-radar-blue' },
        { variant: 'secondary' as const, expectedClass: 'text-gray-600' },
        { variant: 'success' as const, expectedClass: 'text-green-600' },
        { variant: 'warning' as const, expectedClass: 'text-amber-600' },
        { variant: 'error' as const, expectedClass: 'text-red-600' },
        { variant: 'muted' as const, expectedClass: 'text-gray-400' },
      ]

      variants.forEach(({ variant, expectedClass }) => {
        const { unmount } = render(<Icon name="react" variant={variant} data-testid={`icon-${variant}`} />)

        const svg = screen.getByTestId(`icon-${variant}`)
        expect(svg).toHaveClass(expectedClass)

        unmount()
      })
    })

    it('should apply base utility classes for layout', () => {
      render(<Icon name="react" />)

      const svg = screen.getByTestId('icon-react')
      expect(svg).toHaveClass('inline-block', 'shrink-0')
    })
  })
})