import { VersionPoint } from './VersionPoint'
import type { VersionInfo } from '@infrastructure/api/types'

interface RadarTimelineChartProps {
  versions: VersionInfo[]
}

/**
 * Radar-enabled visual timeline chart displaying version history with navigation
 */
export const TimelineChart = ({ versions }: RadarTimelineChartProps) => {
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
            <VersionPoint version={version} />
          </div>
        ))}
      </div>
    </div>
  )
}
