/**
 * Icon System Technical Configuration
 *
 * Pure infrastructure concern: technical configuration for icon system
 * Contains only technical specifications, no business domain logic
 * Business mappings are in @shared/config/packageIcons.ts
 */

// Technology icons available in sprite
export const TECHNOLOGY_ICONS = Object.freeze({
  react: 'react',
  angular: 'angular',
  typescript: 'typescript',
  nodejs: 'nodejs',
  docker: 'docker',
  tailwindcss: 'tailwindcss',
  reactivex: 'reactivex',
  dotnet: 'dotnet',
  cesharp: 'cesharp',
  azure: 'azure',
} as const)

// UI/Action icons for application functionality
export const UI_ICONS = Object.freeze({
  loading: 'loading',
  refresh: 'refresh',
  error: 'error',
  check: 'check',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  chevronDown: 'chevron-down',
  external: 'external',
  calendar: 'calendar',
  clock: 'clock',
  info: 'info',
  warning: 'warning',
  search: 'search',
  filter: 'filter',
  close: 'close',
} as const)

// All available icons
export const ICONS = Object.freeze({
  ...TECHNOLOGY_ICONS,
  ...UI_ICONS,
} as const)

// Type definitions
export type TechnologyIconName = keyof typeof TECHNOLOGY_ICONS
export type UIIconName = keyof typeof UI_ICONS
export type IconName = keyof typeof ICONS

// Icon size configurations
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
} as const

export type IconSize = keyof typeof ICON_SIZES

// Icon variant types for different contexts
export type IconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted'

// Icon accessibility configuration
export interface IconAccessibilityConfig {
  title?: string
  description?: string
  decorative?: boolean
  labelledBy?: string
  describedBy?: string
}

// Main icon props interface
export interface IconProps {
  name: IconName
  size?: IconSize | number
  variant?: IconVariant
  className?: string
  accessibility?: IconAccessibilityConfig
  'aria-hidden'?: boolean
  'data-testid'?: string
}

// Pure technical configuration - no business logic
// Business mappings have been moved to @shared/config/packageIcons.ts

/**
 * Validate if an icon name exists in the registry
 * @param iconName - Icon name to validate
 * @returns true if icon exists, false otherwise
 */
export const isValidIconName = (iconName: string): iconName is IconName => {
  return iconName in ICONS
}

/**
 * Get pixel size for icon size key
 * @param size - Icon size key or number
 * @returns Pixel size number
 */
export const getIconPixelSize = (size: IconSize | number): number => {
  return typeof size === 'number' ? size : ICON_SIZES[size]
}