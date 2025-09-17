import { memo } from 'react'
import { TechIcon } from '@shared/components/icons'
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
        <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3 text-center h-full">
          <div className="flex justify-center">
            <TechIcon
              name={pkg.icon}
              size="2xl"
              accessibility={{
                title: `${pkg.name} technology logo`,
                decorative: false
              }}
            />
          </div>
          <h3 className="text-xl font-bold">{pkg.name}</h3>
          <p className="text-sm text-gray-600">{pkg.description}</p>
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
        <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3 text-center h-full">
          <div className="flex justify-center">
            <TechIcon
              name={pkg.icon}
              size="2xl"
              variant="muted"
              accessibility={{
                title: `${pkg.name} technology logo`,
                decorative: false
              }}
            />
          </div>
          <h3 className="text-xl font-bold">{pkg.name}</h3>
          <p className="text-sm text-gray-600">{pkg.description}</p>
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
      <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3 text-center h-full">
        <div className="flex justify-center">
          <TechIcon
            name={pkg.icon}
            size="2xl"
            accessibility={{
              title: `${pkg.name} technology logo`,
              decorative: false
            }}
          />
        </div>
        <h3 className="text-xl font-bold">{pkg.name}</h3>
        <p className="text-sm text-gray-600">{pkg.description}</p>
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
