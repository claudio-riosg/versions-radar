import { useEffect, useCallback } from 'react'
import { usePackageVersionsRadar } from './hooks/usePackageVersions'
import { PackageGrid } from './components/PackageGrid'
import { PackageVersionsRefresh } from './components/RefreshButton'
import { ErrorMessage } from '@shared/components'
import { useRadarNavigation } from '@shared/store/appStore'
import type { CleanPackageInfo } from './models'
import type { PackageInfo } from '@infrastructure/api/types'

/**
 * Container component for package dashboard
 * Orchestrates data fetching and navigation logic
 */
export const PackageDashboard = () => {
  const { packages, isLoading, error, lastRefresh, fetchVersions } = usePackageVersionsRadar()
  const { navigateToVersionTimeline } = useRadarNavigation()

  const handlePackageSelect = useCallback((packageInfo: CleanPackageInfo) => {
    navigateToVersionTimeline(packageInfo as PackageInfo)
  }, [navigateToVersionTimeline])

  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchVersions} isLoading={isLoading} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">📡 Versions Radar</h1>
          <p className="text-gray-600 mb-6">Track the latest versions of your favorite packages</p>
          <PackageVersionsRefresh
            onRefresh={fetchVersions}
            isLoading={isLoading}
            lastRefresh={lastRefresh}
          />
        </header>

        <PackageGrid packages={packages} onPackageSelect={handlePackageSelect} />

        <footer className="text-center mt-12 text-gray-500">
          <p>Click on any package to view its version history</p>
        </footer>
      </div>
    </div>
  )
}
