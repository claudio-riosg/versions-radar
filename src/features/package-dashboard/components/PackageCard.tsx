import { memo, useCallback } from 'react'
import { useRadarNavigation } from '@shared/store/appStore'
import type { DashboardPackage } from '../models'
import type { PackageInfo } from '@infrastructure/api/types'

interface RadarPackageCardProps {
  package: DashboardPackage
}

/**
 * Memoized radar-enabled package card component with optimized navigation
 */
export const PackageCard = memo<RadarPackageCardProps>(({ package: pkg }) => {
  const { navigateToVersionTimeline } = useRadarNavigation()

  const handleRadarNavigation = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { latestVersion, isLoading, error, ...packageInfo } = pkg
    navigateToVersionTimeline(packageInfo as PackageInfo)
  }, [navigateToVersionTimeline, pkg])

  if (pkg.isLoading) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-4xl mb-3">{pkg.icon}</div>
          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="animate-pulse-soft text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (pkg.error) {
    return (
      <div className="card border-red-200">
        <div className="text-center">
          <div className="text-4xl mb-3">{pkg.icon}</div>
          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-600">{pkg.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card micro-interaction cursor-pointer" onClick={handleRadarNavigation}>
      <div className="text-center">
        <div className="text-4xl mb-3">{pkg.icon}</div>
        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
        <div className="bg-radar-blue/10 rounded-lg p-3">
          <p className="text-sm text-gray-500">Latest Version</p>
          <p className="text-2xl font-mono font-bold text-radar-blue">
            {pkg.latestVersion || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  )
})
