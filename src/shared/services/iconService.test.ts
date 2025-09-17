/**
 * Icon Service Tests - TDD for utility functions
 * Testing business logic for icon system services
 */

import { describe, it, expect } from 'vitest'
import {
  generateIconClasses,
  getSpriteUrl,
  validateIconProps,
  generateAccessibilityAttributes,
  getIconDimensions,
  supportsSVGSprites,
  getAvailableIcons,
} from './iconService'
import { ICONS, ICON_SIZES } from '@infrastructure/config/iconConfig'

describe('IconService Utilities', () => {
  describe('generateIconClasses', () => {
    it('should generate base classes for default configuration', () => {
      const classes = generateIconClasses('md')

      expect(classes).toContain('inline-block')
      expect(classes).toContain('shrink-0')
      expect(classes).toContain('icon-md')
      expect(classes).toContain('text-current')
    })

    it('should apply size classes for string sizes', () => {
      const classes = generateIconClasses('lg')

      expect(classes).toContain('icon-lg')
    })

    it('should apply pixel size classes for numeric sizes', () => {
      const classes = generateIconClasses(32)

      expect(classes).toContain('w-[32px]')
      expect(classes).toContain('h-[32px]')
    })

    it('should apply variant-specific color classes', () => {
      const variants = [
        { variant: 'default' as const, expected: 'text-current' },
        { variant: 'primary' as const, expected: 'text-radar-blue' },
        { variant: 'secondary' as const, expected: 'text-gray-600' },
        { variant: 'success' as const, expected: 'text-green-600' },
        { variant: 'warning' as const, expected: 'text-amber-600' },
        { variant: 'error' as const, expected: 'text-red-600' },
        { variant: 'muted' as const, expected: 'text-gray-400' },
      ]

      variants.forEach(({ variant, expected }) => {
        const classes = generateIconClasses('md', variant)
        expect(classes).toContain(expected)
      })
    })

    it('should include custom className when provided', () => {
      const classes = generateIconClasses('md', 'default', 'custom-class another-class')

      expect(classes).toContain('custom-class')
      expect(classes).toContain('another-class')
    })

    it('should combine all classes correctly', () => {
      const classes = generateIconClasses('lg', 'primary', 'rotate-45')

      expect(classes).toBe('inline-block shrink-0 icon-lg text-radar-blue rotate-45')
    })
  })

  describe('getSpriteUrl', () => {
    it('should generate correct sprite fragment URL for valid icons', () => {
      expect(getSpriteUrl('react')).toBe('#react')
      expect(getSpriteUrl('angular')).toBe('#angular')
      expect(getSpriteUrl('typescript')).toBe('#typescript')
      expect(getSpriteUrl('loading')).toBe('#loading')
    })

    it('should generate URL for all available icons', () => {
      Object.keys(ICONS).forEach(iconName => {
        const url = getSpriteUrl(iconName as keyof typeof ICONS)
        expect(url).toBe(`#${iconName}`)
        expect(url).toMatch(/^#[a-z-]+([A-Z][a-z]*)*$/) // Allow camelCase for chevronLeft, etc.
      })
    })
  })

  describe('validateIconProps', () => {
    it('should not throw for valid icon names', () => {
      expect(() => validateIconProps('react')).not.toThrow()
      expect(() => validateIconProps('angular')).not.toThrow()
      expect(() => validateIconProps('typescript')).not.toThrow()
      expect(() => validateIconProps('loading')).not.toThrow()
    })

    it('should throw for invalid icon names', () => {
      expect(() => validateIconProps('invalid-icon')).toThrow('Invalid icon name')
      expect(() => validateIconProps('nonexistent')).toThrow('Invalid icon name')
    })

    it('should include available icons in error message', () => {
      try {
        validateIconProps('invalid')
      } catch (error) {
        expect((error as Error).message).toContain('Available icons:')
        expect((error as Error).message).toContain('react')
        expect((error as Error).message).toContain('angular')
      }
    })

    it('should not throw for valid string sizes', () => {
      Object.keys(ICON_SIZES).forEach(size => {
        expect(() => validateIconProps('react', size as keyof typeof ICON_SIZES)).not.toThrow()
      })
    })

    it('should throw for invalid string sizes', () => {
      expect(() => validateIconProps('react', 'invalid' as never)).toThrow('Invalid icon size')
    })

    it('should not throw for valid numeric sizes', () => {
      expect(() => validateIconProps('react', 16)).not.toThrow()
      expect(() => validateIconProps('react', 24)).not.toThrow()
      expect(() => validateIconProps('react', 48)).not.toThrow()
      expect(() => validateIconProps('react', 200)).not.toThrow()
    })

    it('should throw for invalid numeric sizes', () => {
      expect(() => validateIconProps('react', 0)).toThrow('Size must be between 1 and 200')
      expect(() => validateIconProps('react', -5)).toThrow('Size must be between 1 and 200')
      expect(() => validateIconProps('react', 250)).toThrow('Size must be between 1 and 200')
    })
  })

  describe('generateAccessibilityAttributes', () => {
    it('should return aria-hidden for decorative icons', () => {
      const attrs = generateAccessibilityAttributes(undefined, undefined, true)

      expect(attrs).toEqual({ 'aria-hidden': true })
    })

    it('should generate aria-label when title provided', () => {
      const attrs = generateAccessibilityAttributes('React Logo')

      expect(attrs['aria-label']).toBe('React Logo')
      expect(attrs['aria-hidden']).toBeUndefined()
    })

    it('should generate describedby when description provided', () => {
      const attrs = generateAccessibilityAttributes(undefined, 'JavaScript library')

      expect(attrs['aria-describedby']).toMatch(/^icon-desc-[a-z0-9]+$/)
    })

    it('should combine title and description attributes', () => {
      const attrs = generateAccessibilityAttributes('React', 'JavaScript library')

      expect(attrs['aria-label']).toBe('React')
      expect(attrs['aria-describedby']).toMatch(/^icon-desc-[a-z0-9]+$/)
    })

    it('should not include accessibility attributes for decorative icons', () => {
      const attrs = generateAccessibilityAttributes('React', 'Description', true)

      expect(attrs).toEqual({ 'aria-hidden': true })
      expect(attrs['aria-label']).toBeUndefined()
      expect(attrs['aria-describedby']).toBeUndefined()
    })
  })

  describe('getIconDimensions', () => {
    it('should return correct dimensions for string sizes', () => {
      expect(getIconDimensions('xs')).toEqual({ width: 16, height: 16 })
      expect(getIconDimensions('sm')).toEqual({ width: 20, height: 20 })
      expect(getIconDimensions('md')).toEqual({ width: 24, height: 24 })
      expect(getIconDimensions('lg')).toEqual({ width: 32, height: 32 })
      expect(getIconDimensions('xl')).toEqual({ width: 48, height: 48 })
      expect(getIconDimensions('2xl')).toEqual({ width: 64, height: 64 })
    })

    it('should return correct dimensions for numeric sizes', () => {
      expect(getIconDimensions(16)).toEqual({ width: 16, height: 16 })
      expect(getIconDimensions(32)).toEqual({ width: 32, height: 32 })
      expect(getIconDimensions(100)).toEqual({ width: 100, height: 100 })
    })

    it('should always return square dimensions', () => {
      const dimensions = getIconDimensions('lg')
      expect(dimensions.width).toBe(dimensions.height)
    })
  })

  describe('supportsSVGSprites', () => {
    it('should return false in jsdom/vitest environment', () => {
      // In jsdom/vitest environment, SVG use element support may not be fully available
      expect(supportsSVGSprites()).toBe(false)
    })

    it('should handle environments without SVG support gracefully', () => {
      // Mock an environment without SVG support
      const originalSVGSVGElement = global.SVGSVGElement
      // @ts-expect-error - Intentionally testing undefined case
      global.SVGSVGElement = undefined

      expect(supportsSVGSprites()).toBe(false)

      // Restore
      global.SVGSVGElement = originalSVGSVGElement
    })
  })

  describe('getAvailableIcons', () => {
    it('should return all available icon names', () => {
      const icons = getAvailableIcons()

      expect(Array.isArray(icons)).toBe(true)
      expect(icons.length).toBeGreaterThan(0)
      expect(icons).toContain('react')
      expect(icons).toContain('angular')
      expect(icons).toContain('typescript')
      expect(icons).toContain('loading')
      expect(icons).toContain('refresh')
    })

    it('should return icons matching the ICONS configuration', () => {
      const icons = getAvailableIcons()
      const configuredIcons = Object.keys(ICONS)

      expect(icons).toEqual(configuredIcons)
    })

    it('should include both technology and UI icons', () => {
      const icons = getAvailableIcons()

      // Technology icons
      expect(icons).toContain('react')
      expect(icons).toContain('angular')
      expect(icons).toContain('typescript')

      // UI icons
      expect(icons).toContain('loading')
      expect(icons).toContain('refresh')
      expect(icons).toContain('search')
    })
  })

  describe('Performance Considerations', () => {
    it('should handle large numbers of validation calls efficiently', () => {
      const start = performance.now()

      // Simulate many validation calls
      for (let i = 0; i < 1000; i++) {
        validateIconProps('react', 'md')
      }

      const end = performance.now()

      // Should complete within reasonable time (less than 100ms for 1000 calls)
      expect(end - start).toBeLessThan(100)
    })

    it('should generate classes efficiently for repeated calls', () => {
      const start = performance.now()

      // Simulate many class generation calls
      for (let i = 0; i < 1000; i++) {
        generateIconClasses('md', 'primary', 'custom-class')
      }

      const end = performance.now()

      // Should complete within reasonable time
      expect(end - start).toBeLessThan(50)
    })
  })
})