import { PackageCard } from './PackageCard'
import type { DashboardPackage, PackageClickHandler } from '../models'

interface PackageGridProps {
  packages: DashboardPackage[]
  onPackageClick: PackageClickHandler
}

/**
 * Grid layout for displaying multiple package cards
 */
export const PackageGrid = ({ packages, onPackageClick }: PackageGridProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.npmName}
          package={pkg}
          onClick={onPackageClick}
        />
      ))}
    </div>
  )
}