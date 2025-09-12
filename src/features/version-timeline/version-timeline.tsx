import { useState, useEffect } from 'react'
import { useVersionHistory } from './hooks/useVersionHistory'
import { TimelineChart } from './components/TimelineChart'
import { TimelineControls } from './components/TimelineControls'
import { ErrorMessage, LoadingSpinner, BackButton } from '@shared/components'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'
import type { VersionClickHandler, BackHandler } from './models'

interface VersionTimelineProps {
  packageInfo: PackageInfo
  onBack: BackHandler
  onVersionClick: VersionClickHandler
}

/**
 * Main version timeline container component
 * Displays chronological history of package versions
 */
export const VersionTimeline = ({ packageInfo, onBack, onVersionClick }: VersionTimelineProps) => {
  const { package: pkg, versions, isLoading, error, fetchVersionHistory } = useVersionHistory()
  const [filteredVersions, setFilteredVersions] = useState<VersionInfo[]>([])

  useEffect(() => {
    fetchVersionHistory(packageInfo)
  }, [fetchVersionHistory, packageInfo])

  useEffect(() => {
    setFilteredVersions(versions)
  }, [versions])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <ErrorMessage
            message={error}
            onRetry={() => fetchVersionHistory(packageInfo)}
            isLoading={isLoading}
          />
          <div className="text-center">
            <BackButton onClick={onBack}>
              Back to Dashboard
            </BackButton>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          icon={packageInfo.icon}
          message={`Loading ${packageInfo.name} History`}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="mb-4">
            <BackButton onClick={onBack}>
              ← Back to Dashboard
            </BackButton>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">{pkg?.icon}</div>
            <h1 className="text-3xl font-bold mb-2">{pkg?.name} Version History</h1>
            <p className="text-gray-600">{pkg?.description}</p>
          </div>
        </header>

        {filteredVersions.length > 0 && (
          <TimelineControls
            versions={versions}
            onFilter={setFilteredVersions}
          />
        )}

        <div className="mt-8">
          <TimelineChart
            versions={filteredVersions}
            onVersionClick={onVersionClick}
          />
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Click on any version to view its changelog</p>
        </footer>
      </div>
    </div>
  )
}