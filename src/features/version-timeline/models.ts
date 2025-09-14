import type { VersionInfo, PackageInfo } from '@infrastructure/api/types'
import type { SelectionHandler } from '@shared/types/handlers'

/**
 * Version Timeline Business Domain Models.
 * Core interfaces and types for package version timeline functionality.
 */

export interface TimelineState {
  package: PackageInfo | null
  versions: VersionInfo[]
  isLoading: boolean
  error: string | null
}

export type VersionClickHandler = (version: VersionInfo) => void
export type BackHandler = () => void

// Domain types from types.ts consolidated here for better organization
/** Version selection handler for timeline interactions */
export type VersionSelectionHandler = SelectionHandler<VersionInfo>

/** Version filtering options */
export interface VersionFilterOptions {
  includePrerelease: boolean
  includeLatest: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy: 'version' | 'date'
  sortOrder: 'asc' | 'desc'
}
