import type { VersionInfo, PackageInfo } from '@infrastructure/api/types'

export interface TimelineState {
  package: PackageInfo | null
  versions: VersionInfo[]
  isLoading: boolean
  error: string | null
}

export type VersionClickHandler = (version: VersionInfo) => void
export type BackHandler = () => void
