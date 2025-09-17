/**
 * Icon Service Utilities
 *
 * Shared service used by multiple features for icon management
 * Provides utilities for validation, styling, and optimization
 *
 * Used by:
 * - package-dashboard (icon generation and styling)
 * - version-timeline (icon validation and classes)
 * - changelog-viewer (accessibility and sprites)
 *
 * This follows the Scope Rule: used by 2+ features = shared directory
 */

import {
  type IconName,
  type IconSize,
  type IconVariant,
  ICONS,
  ICON_SIZES,
  getIconPixelSize,
  isValidIconName,
} from '@infrastructure/config/iconConfig'

/**
 * Generate CSS classes for icon styling with Tailwind CSS v4
 * @param size - Icon size
 * @param variant - Icon variant/color scheme
 * @param className - Additional classes
 * @returns Combined CSS class string
 */
export const generateIconClasses = (
  size: IconSize | number,
  variant: IconVariant = 'default',
  className = ''
): string => {
  const baseClasses = ['inline-block', 'shrink-0'] // Base layout classes

  // Size classes using icon-specific CSS classes
  if (typeof size === 'string') {
    baseClasses.push(`icon-${size}`)
  } else {
    // Custom pixel size - fallback to Tailwind arbitrary values
    baseClasses.push(`w-[${size}px]`, `h-[${size}px]`)
  }

  // Variant classes (colors and states)
  const variantClasses: Record<IconVariant, string[]> = {
    default: ['text-current'],
    primary: ['text-radar-blue'],
    secondary: ['text-gray-600'],
    success: ['text-green-600'],
    warning: ['text-amber-600'],
    error: ['text-red-600'],
    muted: ['text-gray-400'],
  }

  baseClasses.push(...variantClasses[variant])

  // Add custom classes
  if (className) {
    baseClasses.push(className)
  }

  return baseClasses.join(' ')
}

/**
 * Generate sprite URL for icon
 * @param iconName - Icon name
 * @returns Sprite fragment URL
 */
export const getSpriteUrl = (iconName: IconName): string => {
  return `#${iconName}`
}

/**
 * Validate icon props for runtime safety
 * @param iconName - Icon name to validate
 * @param size - Icon size to validate
 * @throws Error if validation fails
 */
export const validateIconProps = (iconName: string, size?: IconSize | number): void => {
  if (!isValidIconName(iconName)) {
    throw new Error(
      `Invalid icon name: "${iconName}". Available icons: ${Object.keys(ICONS).join(', ')}`
    )
  }

  if (size && typeof size === 'string' && !(size in ICON_SIZES)) {
    throw new Error(
      `Invalid icon size: "${size}". Available sizes: ${Object.keys(ICON_SIZES).join(', ')}`
    )
  }

  if (typeof size === 'number' && (size <= 0 || size > 200)) {
    throw new Error(`Invalid icon size: ${size}. Size must be between 1 and 200 pixels.`)
  }
}

/**
 * Generate accessibility attributes for icons
 * @param title - Icon title
 * @param description - Icon description
 * @param decorative - Whether icon is decorative
 * @returns Accessibility attributes object
 */
export const generateAccessibilityAttributes = (
  title?: string,
  description?: string,
  decorative = false
): Record<string, string | boolean> => {
  const attributes: Record<string, string | boolean> = {}

  if (decorative) {
    attributes['aria-hidden'] = true
    return attributes
  }

  if (title) {
    attributes['aria-label'] = title
  }

  if (description) {
    attributes['aria-describedby'] = `icon-desc-${Math.random().toString(36).slice(2)}`
  }

  return attributes
}

/**
 * Performance optimization: Pre-calculate icon dimensions
 * Used for layout calculations to prevent reflows
 */
export const getIconDimensions = (size: IconSize | number): { width: number; height: number } => {
  const pixelSize = getIconPixelSize(size)
  return { width: pixelSize, height: pixelSize }
}

/**
 * Check if browser supports SVG sprites
 * @returns true if SVG sprites are supported
 */
export const supportsSVGSprites = (): boolean => {
  return typeof SVGSVGElement !== 'undefined' && 'use' in document.createElementNS('http://www.w3.org/2000/svg', 'svg')
}

/**
 * Development helper: List all available icons
 * @returns Array of available icon names
 */
export const getAvailableIcons = (): IconName[] => {
  return Object.keys(ICONS) as IconName[]
}