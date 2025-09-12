import { useState } from 'react'
import { PackageDashboard } from '@features/package-dashboard/package-dashboard'
import { VersionTimeline } from '@features/version-timeline/version-timeline'
import { ChangelogViewer } from '@features/changelog-viewer/changelog-viewer'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'

type AppView = 'dashboard' | 'timeline' | 'changelog'

/**
 * Main application entry point
 * Temporary routing between features before implementing proper router
 */
function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<VersionInfo | null>(null)

  const handlePackageClick = (pkg: PackageInfo) => {
    setSelectedPackage(pkg)
    setCurrentView('timeline')
  }

  const handleVersionClick = (version: VersionInfo) => {
    setSelectedVersion(version)
    setCurrentView('changelog')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedPackage(null)
  }

  const handleBackToTimeline = () => {
    setCurrentView('timeline')
    setSelectedVersion(null)
  }

  if (currentView === 'timeline' && selectedPackage) {
    return (
      <VersionTimeline
        packageInfo={selectedPackage}
        onBack={handleBackToDashboard}
        onVersionClick={handleVersionClick}
      />
    )
  }

  if (currentView === 'changelog' && selectedVersion && selectedPackage) {
    return (
      <ChangelogViewer
        packageInfo={selectedPackage}
        versionInfo={selectedVersion}
        onBackToTimeline={handleBackToTimeline}
      />
    )
  }

  return <PackageDashboard onPackageClick={handlePackageClick} />
}

export default App
