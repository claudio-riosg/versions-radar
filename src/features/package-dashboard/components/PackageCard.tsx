import { memo } from 'react'
import type { DashboardPackage } from '../models'
import type { PackageSelectionHandler } from '../models'

interface PackageCardProps {
  package: DashboardPackage
  onPackageSelect: PackageSelectionHandler
  className?: string
}

/**
 * Pure presentational component for displaying package information
 * Receives all data and handlers as props - no business logic
 */
export const PackageCard = memo<PackageCardProps>(({ package: pkg, onPackageSelect, className }) => {
  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { latestVersion, isLoading, error, ...packageInfo } = pkg
    onPackageSelect(packageInfo)
  }

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
    <div 
      className={`card micro-interaction cursor-pointer ${className || ''}`} 
      onClick={handleClick}
      data-testid={`package-${pkg.npmName}`}
    >
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
