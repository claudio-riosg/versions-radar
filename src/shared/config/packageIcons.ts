/**
 * Package Icon Configuration - Business Domain Logic
 * Maps package names to their visual representations
 *
 * Located in shared/config because this business logic is used by:
 * - package-dashboard (displaying package cards with icons)
 * - version-timeline (showing package markers)
 * - changelog-viewer (displaying package headers)
 *
 * This follows the Scope Rule: used by 2+ features = shared directory
 */

import type { TechnologyIconName } from '@infrastructure/config/iconConfig'

/**
 * Business mapping of package names to their corresponding icons
 * This contains domain knowledge about which packages use which visual representations
 */
export const PACKAGE_ICON_MAP: Record<string, TechnologyIconName> = Object.freeze({
  react: 'react',
  '@angular/core': 'angular',
  typescript: 'typescript',
  'node.js': 'nodejs',
} as const)

/**
 * Get icon name for a package (Business Logic)
 * @param packageName - NPM package name or display name
 * @returns Corresponding icon name or undefined
 */
export const getPackageIcon = (packageName: string): TechnologyIconName | undefined => {
  const normalizedName = packageName.toLowerCase()
  return PACKAGE_ICON_MAP[normalizedName] as TechnologyIconName
}

/**
 * Check if a package has a specific icon available
 * @param packageName - Package name to check
 * @returns true if package has an icon, false otherwise
 */
export const hasPackageIcon = (packageName: string): boolean => {
  return getPackageIcon(packageName) !== undefined
}

/**
 * Get all packages that have icons configured
 * @returns Array of package names with icons
 */
export const getPackagesWithIcons = (): string[] => {
  return Object.keys(PACKAGE_ICON_MAP)
}