import { memo, useMemo } from 'react'
import type { VersionInfo } from '@infrastructure/api/types'
import type { VersionSelectionHandler } from '../models'

interface PackageVersionMarkerProps {
  version: VersionInfo
  onVersionSelect: VersionSelectionHandler
  className?: string
}

/**
 * Visual marker for individual package version releases in timeline.
 * Interactive point displaying version info with click-to-view functionality.
 */
export const PackageVersionMarker = memo<PackageVersionMarkerProps>(({ version, onVersionSelect, className }) => {
  const handleClick = () => {
    onVersionSelect(version)
  }

  const { date, isRecent } = useMemo(() => {
    const date = new Date(version.publishedAt)
    const isRecent = Date.now() - date.getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
    return { date, isRecent }
  }, [version.publishedAt])

  return (
    <div
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg micro-interaction cursor-pointer ${className || ''}`}
      onClick={handleClick}
      data-testid={`version-${version.version}`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            version.isLatest
              ? 'bg-radar-blue border-radar-blue'
              : version.isPrerelease
                ? 'bg-yellow-400 border-yellow-400'
                : 'bg-green-400 border-green-400'
          }`}
        />
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-lg">{version.version}</span>
          {version.isLatest && (
            <span className="bg-radar-blue text-white px-2 py-1 rounded text-xs font-medium">
              LATEST
            </span>
          )}
          {version.isPrerelease && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
              PRERELEASE
            </span>
          )}
          {isRecent && !version.isPrerelease && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              NEW
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Published {date.toLocaleDateString()} at {date.toLocaleTimeString()}
        </p>
      </div>

      <div className="flex-shrink-0 text-gray-400">
        <span>→</span>
      </div>
    </div>
  )
})
