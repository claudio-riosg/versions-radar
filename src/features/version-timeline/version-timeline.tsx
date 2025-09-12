import { useState, useEffect } from 'react'
import { useVersionHistory } from './hooks/useVersionHistory'
import { TimelineChart } from './components/TimelineChart'
import { TimelineControls } from './components/TimelineControls'
import { ErrorMessage, LoadingSpinner, BackButton } from '@shared/components'
import { useRadarNavigation } from '@shared/store/appStore'
import type { VersionInfo } from '@infrastructure/api/types'

/**
 * Radar-enabled version timeline container component
 * Displays chronological history of package versions with integrated navigation
 */
export const VersionTimeline = () => {
  const { navigation } = useRadarNavigation()
  const { package: pkg, versions, isLoading, error, fetchVersionHistory } = useVersionHistory()
  const [filteredVersions, setFilteredVersions] = useState<VersionInfo[]>([])

  useEffect(() => {
    if (navigation.selectedPackage) {
      fetchVersionHistory(navigation.selectedPackage)
    }
  }, [fetchVersionHistory, navigation.selectedPackage])

  useEffect(() => {
    setFilteredVersions(versions)
  }, [versions])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <ErrorMessage
            message={error}
            onRetry={() => navigation.selectedPackage && fetchVersionHistory(navigation.selectedPackage)}
            isLoading={isLoading}
          />
          <div className="text-center">
            <BackButton>Back to Dashboard</BackButton>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !navigation.selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          icon={navigation.selectedPackage?.icon}
          message={`Loading ${navigation.selectedPackage?.name || 'Package'} History`}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="mb-4">
            <BackButton>← Back to Dashboard</BackButton>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">{pkg?.icon}</div>
            <h1 className="text-3xl font-bold mb-2">{pkg?.name} Version History</h1>
            <p className="text-gray-600">{pkg?.description}</p>
          </div>
        </header>

        {filteredVersions.length > 0 && (
          <TimelineControls versions={versions} onFilter={setFilteredVersions} />
        )}

        <div className="mt-8">
          <TimelineChart versions={filteredVersions} />
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Click on any version to view its changelog</p>
        </footer>
      </div>
    </div>
  )
}
