import type { PackageInfo, VersionInfo, ChangelogInfo } from '@infrastructure/api/types'

/**
 * Changelog Viewer Business Domain Models.
 * Core interfaces and types for changelog viewing functionality.
 */

export interface ChangelogState {
  package: PackageInfo | null
  version: VersionInfo | null
  changelog: ChangelogInfo | null
  isLoading: boolean
  error: string | null
}

export type BackToTimelineHandler = () => void
