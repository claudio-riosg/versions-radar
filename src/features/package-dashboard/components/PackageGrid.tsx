import { PackageCard } from './PackageCard'
import type { DashboardPackage } from '../models'

interface RadarPackageGridProps {
  packages: DashboardPackage[]
}

/**
 * Radar-enabled grid layout for displaying package cards with navigation
 */
export const PackageGrid = ({ packages }: RadarPackageGridProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map(pkg => (
        <PackageCard key={pkg.npmName} package={pkg} />
      ))}
    </div>
  )
}
