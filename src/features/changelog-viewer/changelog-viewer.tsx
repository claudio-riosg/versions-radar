import { useEffect } from 'react'
import { useChangelog } from './hooks/useChangelog'
import { NavigationControls } from './components/NavigationControls'
import { VersionHeader } from './components/VersionHeader'
import { ChangelogContent } from './components/ChangelogContent'
import { ErrorMessage, LoadingSpinner } from '@shared/components'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'
import type { BackToTimelineHandler } from './models'

interface ChangelogViewerProps {
  packageInfo: PackageInfo
  versionInfo: VersionInfo
  onBackToTimeline: BackToTimelineHandler
}

/**
 * Main changelog viewer container component
 * Displays detailed release notes from GitHub
 */
export const ChangelogViewer = ({ packageInfo, versionInfo, onBackToTimeline }: ChangelogViewerProps) => {
  const { changelog, isLoading, error, fetchChangelog } = useChangelog()

  useEffect(() => {
    fetchChangelog(packageInfo, versionInfo)
  }, [fetchChangelog, packageInfo, versionInfo])

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <NavigationControls
            onBackToTimeline={onBackToTimeline}
            packageName={packageInfo.name}
          />
          
          <div className="flex justify-center">
            <ErrorMessage
              message={error}
              onRetry={() => fetchChangelog(packageInfo, versionInfo)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <NavigationControls
            onBackToTimeline={onBackToTimeline}
            packageName={packageInfo.name}
          />
          
          <div className="flex justify-center">
            <LoadingSpinner
              size="lg"
              icon={packageInfo.icon}
              message={`Loading ${packageInfo.name} ${versionInfo.version} Changelog`}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <NavigationControls
          onBackToTimeline={onBackToTimeline}
          packageName={packageInfo.name}
        />

        <VersionHeader
          package={packageInfo}
          version={versionInfo}
          changelog={changelog}
        />

        {changelog ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <ChangelogContent changelog={changelog} />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <h3 className="text-lg font-medium mb-2">No Changelog Available</h3>
              <p className="text-gray-600">
                No release notes were found for {packageInfo.name} {versionInfo.version}.
                This version might not have a corresponding GitHub release.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}