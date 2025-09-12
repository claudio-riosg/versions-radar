import type { PackageInfo } from '@infrastructure/api/types'

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
