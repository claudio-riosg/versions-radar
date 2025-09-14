import type { PackageInfo } from '@infrastructure/api/types'
import type { SelectionHandler } from '@shared/types/handlers'

/**
 * Package Dashboard Business Domain Models.
 * Core interfaces and types for package versions dashboard functionality.
 */

export interface DashboardPackage extends PackageInfo {
  latestVersion?: string
  isLoading?: boolean
  error?: string
}

export interface DashboardState {
  packages: DashboardPackage[]
  isLoading: boolean
  error: string | null
  lastRefresh?: Date
}

export type PackageClickHandler = (pkg: PackageInfo) => void
export type RefreshHandler = () => void

// Domain types from types.ts consolidated here for better organization
/** Clean package info without UI state */
export type CleanPackageInfo = Omit<DashboardPackage, 'latestVersion' | 'isLoading' | 'error'>

/** Package selection handler for dashboard interactions */
export type PackageSelectionHandler = SelectionHandler<CleanPackageInfo>

/** Package refresh options */
export interface PackageRefreshOptions {
  forceRefresh?: boolean
  showLoadingIndicator?: boolean
}
