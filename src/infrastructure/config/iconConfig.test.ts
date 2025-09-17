/**
 * Icon Technical Configuration Tests
 * Testing pure infrastructure concerns: icon registry, types, utilities
 * Business logic tests moved to @shared/config/packageIcons.test.ts
 */

import { describe, it, expect } from 'vitest'
import {
  TECHNOLOGY_ICONS,
  UI_ICONS,
  ICONS,
  ICON_SIZES,
  isValidIconName,
  getIconPixelSize,
} from './iconConfig'

describe('Icon Configuration', () => {
  describe('Icon Registry Constants', () => {
    it('should have technology icons defined', () => {
      expect(TECHNOLOGY_ICONS).toBeDefined()
      expect(typeof TECHNOLOGY_ICONS).toBe('object')

      // Should include expected technology icons
      expect(TECHNOLOGY_ICONS.react).toBe('react')
      expect(TECHNOLOGY_ICONS.angular).toBe('angular')
      expect(TECHNOLOGY_ICONS.typescript).toBe('typescript')
      expect(TECHNOLOGY_ICONS.nodejs).toBe('nodejs')
    })

    it('should have UI icons defined', () => {
      expect(UI_ICONS).toBeDefined()
      expect(typeof UI_ICONS).toBe('object')

      // Should include expected UI icons
      expect(UI_ICONS.loading).toBe('loading')
      expect(UI_ICONS.refresh).toBe('refresh')
      expect(UI_ICONS.error).toBe('error')
      expect(UI_ICONS.check).toBe('check')
    })

    it('should combine technology and UI icons in ICONS', () => {
      expect(ICONS).toBeDefined()

      // Should include all technology icons
      Object.keys(TECHNOLOGY_ICONS).forEach(key => {
        expect(ICONS[key as keyof typeof ICONS]).toBe(TECHNOLOGY_ICONS[key as keyof typeof TECHNOLOGY_ICONS])
      })

      // Should include all UI icons
      Object.keys(UI_ICONS).forEach(key => {
        expect(ICONS[key as keyof typeof ICONS]).toBe(UI_ICONS[key as keyof typeof UI_ICONS])
      })
    })

    it('should have icon sizes with correct pixel values', () => {
      expect(ICON_SIZES.xs).toBe(16)
      expect(ICON_SIZES.sm).toBe(20)
      expect(ICON_SIZES.md).toBe(24)
      expect(ICON_SIZES.lg).toBe(32)
      expect(ICON_SIZES.xl).toBe(48)
      expect(ICON_SIZES['2xl']).toBe(64)
    })

    it('should have icon sizes in ascending order', () => {
      const sizes = Object.values(ICON_SIZES)
      const sortedSizes = [...sizes].sort((a, b) => a - b)
      expect(sizes).toEqual(sortedSizes)
    })
  })

  // Package mapping tests moved to @shared/config/packageIcons.test.ts

  describe('isValidIconName', () => {
    it('should return true for valid technology icons', () => {
      Object.keys(TECHNOLOGY_ICONS).forEach(iconName => {
        expect(isValidIconName(iconName)).toBe(true)
      })
    })

    it('should return true for valid UI icons', () => {
      Object.keys(UI_ICONS).forEach(iconName => {
        expect(isValidIconName(iconName)).toBe(true)
      })
    })

    it('should return false for invalid icon names', () => {
      expect(isValidIconName('invalid-icon')).toBe(false)
      expect(isValidIconName('nonexistent')).toBe(false)
      expect(isValidIconName('')).toBe(false)
      expect(isValidIconName('123')).toBe(false)
    })

    it('should be case-sensitive', () => {
      expect(isValidIconName('React')).toBe(false) // should be 'react'
      expect(isValidIconName('ANGULAR')).toBe(false) // should be 'angular'
      expect(isValidIconName('react')).toBe(true)
      expect(isValidIconName('angular')).toBe(true)
    })

    it('should handle edge cases gracefully', () => {
      // @ts-expect-error - Testing runtime behavior with invalid input
      expect(isValidIconName(null)).toBe(false)
      // @ts-expect-error - Testing runtime behavior with invalid input
      expect(isValidIconName(undefined)).toBe(false)
      // @ts-expect-error - Testing runtime behavior with invalid input
      expect(isValidIconName(123)).toBe(false)
    })
  })

  describe('getIconPixelSize', () => {
    it('should return correct pixel values for string sizes', () => {
      expect(getIconPixelSize('xs')).toBe(16)
      expect(getIconPixelSize('sm')).toBe(20)
      expect(getIconPixelSize('md')).toBe(24)
      expect(getIconPixelSize('lg')).toBe(32)
      expect(getIconPixelSize('xl')).toBe(48)
      expect(getIconPixelSize('2xl')).toBe(64)
    })

    it('should return the same value for numeric sizes', () => {
      expect(getIconPixelSize(16)).toBe(16)
      expect(getIconPixelSize(32)).toBe(32)
      expect(getIconPixelSize(100)).toBe(100)
    })

    it('should handle all defined icon sizes', () => {
      Object.entries(ICON_SIZES).forEach(([sizeKey, expectedPixels]) => {
        expect(getIconPixelSize(sizeKey as keyof typeof ICON_SIZES)).toBe(expectedPixels)
      })
    })

    it('should preserve numeric input exactly', () => {
      const testSizes = [1, 10, 25, 50, 100, 200]
      testSizes.forEach(size => {
        expect(getIconPixelSize(size)).toBe(size)
      })
    })
  })

  describe('Type Safety and Consistency', () => {
    it('should maintain consistent naming convention for technology icons', () => {
      Object.keys(TECHNOLOGY_ICONS).forEach(key => {
        expect(key).toMatch(/^[a-z]+$/) // lowercase letters only
      })
    })

    it('should maintain consistent naming convention for UI icons', () => {
      Object.keys(UI_ICONS).forEach(key => {
        expect(key).toMatch(/^[a-z]+([A-Z][a-z]*)*$/) // camelCase pattern
      })
    })

    it('should not have duplicate icon IDs between technology and UI icons', () => {
      const techKeys = Object.keys(TECHNOLOGY_ICONS)
      const uiKeys = Object.keys(UI_ICONS)

      const duplicates = techKeys.filter(key => uiKeys.includes(key))
      expect(duplicates).toHaveLength(0)
    })

    it('should have all icon IDs as valid CSS identifiers', () => {
      Object.values(ICONS).forEach(iconId => {
        // CSS identifier pattern: start with letter, followed by letters, numbers, hyphens
        expect(iconId).toMatch(/^[a-zA-Z][a-zA-Z0-9-]*$/)
      })
    })
  })

  describe('Icon Registry Completeness', () => {
    it('should have icons for all tracked packages in the application', () => {
      // Based on the packages.ts configuration we saw
      const expectedPackageIcons = ['react', 'angular', 'typescript']

      expectedPackageIcons.forEach(iconName => {
        expect(isValidIconName(iconName)).toBe(true)
      })
    })

    it('should have essential UI icons for application functionality', () => {
      const essentialUIIcons = [
        'loading', 'refresh', 'error', 'check',
        'chevronLeft', 'chevronRight', 'search', 'close'
      ]

      essentialUIIcons.forEach(iconName => {
        expect(isValidIconName(iconName)).toBe(true)
      })
    })

    it('should have reasonable icon size range', () => {
      const sizes = Object.values(ICON_SIZES)

      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(12) // Minimum readable size
      expect(Math.max(...sizes)).toBeLessThanOrEqual(128) // Maximum practical size
    })
  })

  describe('Configuration Immutability', () => {
    it('should make icon configurations read-only', () => {
      // TypeScript ensures these are readonly, but test runtime behavior
      expect(() => {
        // @ts-expect-error - Testing runtime immutability
        ICONS.newIcon = 'new-icon'
      }).toThrow()
    })

    // Package icon mapping immutability tests moved to @shared/config/packageIcons.test.ts
  })
})