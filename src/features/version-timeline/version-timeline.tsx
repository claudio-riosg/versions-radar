import { useState, useEffect, useCallback } from 'react'
import { useVersionTimelineRadar } from './hooks/useVersionTimelineRadar'
import { VersionTimelineVisualization } from './components/VersionTimelineVisualization'
import { VersionTimelineFilters } from './components/VersionTimelineFilters'
import { ErrorMessage, LoadingSpinner, BackButton } from '@shared/components'
import { useRadarNavigation } from '@shared/store/appStore'
import type { VersionInfo } from '@infrastructure/api/types'

/**
 * Container component for version timeline 
 * Orchestrates data fetching and navigation logic
 */
export const VersionTimeline = () => {
  const { navigation, navigateToChangelogViewer } = useRadarNavigation()
  const { package: pkg, versions, isLoading, error, fetchVersionHistory } = useVersionTimelineRadar()
  const [filteredVersions, setFilteredVersions] = useState<VersionInfo[]>([])

  const handleVersionSelect = useCallback((version: VersionInfo) => {
    if (navigation.selectedPackage) {
      navigateToChangelogViewer(navigation.selectedPackage, version)
    }
  }, [navigation.selectedPackage, navigateToChangelogViewer])

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
          <VersionTimelineFilters versions={versions} onFilter={setFilteredVersions} />
        )}

        <div className="mt-8">
          <VersionTimelineVisualization versions={filteredVersions} onVersionSelect={handleVersionSelect} />
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Click on any version to view its changelog</p>
        </footer>
      </div>
    </div>
  )
}
