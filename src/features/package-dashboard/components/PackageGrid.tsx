import { PackageCard } from './PackageCard'
import type { DashboardPackage } from '../models'
import type { PackageSelectionHandler } from '../models'

interface PackageGridProps {
  packages: DashboardPackage[]
  onPackageSelect: PackageSelectionHandler
}

/**
 * Presentational grid layout for displaying package cards
 * Passes through navigation handler to individual cards
 */
export const PackageGrid = ({ packages, onPackageSelect }: PackageGridProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 items-stretch">
      {packages.map(pkg => (
        <PackageCard 
          key={pkg.npmName} 
          package={pkg} 
          onPackageSelect={onPackageSelect}
        />
      ))}
    </div>
  )
}
