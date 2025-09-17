/**
 * Package Icon Business Logic Tests
 * Testing business domain logic for package-to-icon mappings
 */

import { describe, it, expect } from 'vitest'
import {
  PACKAGE_ICON_MAP,
  getPackageIcon,
  hasPackageIcon,
  getPackagesWithIcons,
} from './packageIcons'
import { TECHNOLOGY_ICONS } from '@infrastructure/config/iconConfig'

describe('Package Icon Business Logic', () => {
  describe('Package Icon Mapping', () => {
    it('should map common packages to correct icons', () => {
      expect(PACKAGE_ICON_MAP.react).toBe('react')
      expect(PACKAGE_ICON_MAP['@angular/core']).toBe('angular')
      expect(PACKAGE_ICON_MAP.typescript).toBe('typescript')
      expect(PACKAGE_ICON_MAP['node.js']).toBe('nodejs')
    })

    it('should only map to valid technology icons', () => {
      Object.values(PACKAGE_ICON_MAP).forEach(iconName => {
        expect(iconName in TECHNOLOGY_ICONS).toBe(true)
      })
    })

    it('should be immutable', () => {
      expect(() => {
        // @ts-expect-error - Testing runtime immutability
        PACKAGE_ICON_MAP.newPackage = 'react'
      }).toThrow()
    })
  })

  describe('getPackageIcon', () => {
    it('should return correct icon for exact package matches', () => {
      expect(getPackageIcon('react')).toBe('react')
      expect(getPackageIcon('@angular/core')).toBe('angular')
      expect(getPackageIcon('typescript')).toBe('typescript')
    })

    it('should handle case-insensitive matching', () => {
      expect(getPackageIcon('React')).toBe('react')
      expect(getPackageIcon('REACT')).toBe('react')
      expect(getPackageIcon('TypeScript')).toBe('typescript')
    })

    it('should return undefined for unmapped packages', () => {
      expect(getPackageIcon('unknown-package')).toBeUndefined()
      expect(getPackageIcon('lodash')).toBeUndefined()
      expect(getPackageIcon('')).toBeUndefined()
    })

    it('should handle special npm package names', () => {
      expect(getPackageIcon('@angular/core')).toBe('angular')
      expect(getPackageIcon('node.js')).toBe('nodejs')
    })
  })

  describe('hasPackageIcon', () => {
    it('should return true for packages with icons', () => {
      expect(hasPackageIcon('react')).toBe(true)
      expect(hasPackageIcon('@angular/core')).toBe(true)
      expect(hasPackageIcon('typescript')).toBe(true)
    })

    it('should return false for packages without icons', () => {
      expect(hasPackageIcon('unknown-package')).toBe(false)
      expect(hasPackageIcon('lodash')).toBe(false)
      expect(hasPackageIcon('')).toBe(false)
    })

    it('should be case-insensitive', () => {
      expect(hasPackageIcon('React')).toBe(true)
      expect(hasPackageIcon('TYPESCRIPT')).toBe(true)
    })
  })

  describe('getPackagesWithIcons', () => {
    it('should return array of package names', () => {
      const packages = getPackagesWithIcons()

      expect(Array.isArray(packages)).toBe(true)
      expect(packages.length).toBeGreaterThan(0)
    })

    it('should include all configured packages', () => {
      const packages = getPackagesWithIcons()

      expect(packages).toContain('react')
      expect(packages).toContain('@angular/core')
      expect(packages).toContain('typescript')
      expect(packages).toContain('node.js')
    })

    it('should return exact package names from mapping', () => {
      const packages = getPackagesWithIcons()
      const expectedPackages = Object.keys(PACKAGE_ICON_MAP)

      expect(packages).toEqual(expectedPackages)
    })
  })

  describe('Business Logic Validation', () => {
    it('should cover all tracked packages in the application', () => {
      // Based on the packages we track for versions
      const trackedPackages = ['react', '@angular/core', 'typescript']

      trackedPackages.forEach(pkg => {
        expect(hasPackageIcon(pkg)).toBe(true)
      })
    })

    it('should provide consistent business semantics', () => {
      // Package names should represent the actual npm package names
      const packageNames = getPackagesWithIcons()

      packageNames.forEach(pkgName => {
        // Should be valid npm package name format
        expect(pkgName).toMatch(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i)
      })
    })
  })
})