import { PackageVersionMarker } from './PackageVersionMarker'
import type { VersionInfo } from '@infrastructure/api/types'
import type { VersionSelectionHandler } from '../models'

interface VersionTimelineVisualizationProps {
  versions: VersionInfo[]
  onVersionSelect: VersionSelectionHandler
}

/**
 * Visual timeline representation of package version history.
 * Displays chronological version releases with interactive selection.
 */
export const VersionTimelineVisualization = ({ versions, onVersionSelect }: VersionTimelineVisualizationProps) => {
  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No versions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

        {versions.map(version => (
          <div key={version.version} className="relative">
            <PackageVersionMarker
              version={version}
              onVersionSelect={onVersionSelect}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
