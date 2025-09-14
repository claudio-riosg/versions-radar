import { useEffect } from 'react'
import { useChangelogRadar } from './hooks/useChangelogRadar'
import { NavigationControls } from './components/NavigationControls'
import { VersionHeader } from './components/VersionHeader'
import { ChangelogContent } from './components/ChangelogContent'
import { ErrorMessage, LoadingSpinner } from '@shared/components'
import { useRadarNavigation } from '@shared/store/appStore'

/**
 * Radar-enabled changelog viewer container component
 * Displays detailed release notes from GitHub with integrated navigation
 */
export const ChangelogViewer = () => {
  const { navigation } = useRadarNavigation()
  const { changelog, isLoading, error, fetchChangelog } = useChangelogRadar()

  useEffect(() => {
    if (navigation.selectedPackage && navigation.selectedVersion) {
      fetchChangelog(navigation.selectedPackage, navigation.selectedVersion)
    }
  }, [fetchChangelog, navigation.selectedPackage, navigation.selectedVersion])

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <NavigationControls packageName={navigation.selectedPackage?.name || 'Package'} />

          <div className="flex justify-center">
            <ErrorMessage
              message={error}
              onRetry={() =>
                navigation.selectedPackage &&
                navigation.selectedVersion &&
                fetchChangelog(navigation.selectedPackage, navigation.selectedVersion)
              }
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !navigation.selectedPackage || !navigation.selectedVersion) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <NavigationControls packageName={navigation.selectedPackage?.name || 'Package'} />

          <div className="flex justify-center">
            <LoadingSpinner
              size="lg"
              icon={navigation.selectedPackage?.icon}
              message={`Loading ${navigation.selectedPackage?.name || 'Package'} ${
                navigation.selectedVersion?.version || ''
              } Changelog`}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <NavigationControls packageName={navigation.selectedPackage.name} />

        <VersionHeader
          package={navigation.selectedPackage}
          version={navigation.selectedVersion}
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
                No release notes were found for {navigation.selectedPackage.name}{' '}
                {navigation.selectedVersion.version}. This version might not have a corresponding
                GitHub release.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
