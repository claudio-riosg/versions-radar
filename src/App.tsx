import { PackageDashboard } from '@features/package-dashboard/package-dashboard'
import { VersionTimeline } from '@features/version-timeline/version-timeline'
import { ChangelogViewer } from '@features/changelog-viewer/changelog-viewer'
import { useRadarNavigation } from '@shared/store/appStore'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'

/**
 * Main application entry point with Zustand-powered navigation
 *
 * Uses global radar store for state management and intelligent caching
 * to provide seamless navigation between package dashboard, version timeline,
 * and changelog viewer components.
 */
function App() {
  const {
    navigation,
    navigateToVersionTimeline,
    navigateToChangelogViewer,
    navigateToPackageDashboard,
    navigateToPreviousRadarView,
  } = useRadarNavigation()

  const handlePackageViewRequest = (packageInfo: PackageInfo) => {
    navigateToVersionTimeline(packageInfo)
  }

  const handleVersionDetailsRequest = (version: VersionInfo) => {
    if (navigation.selectedPackage) {
      navigateToChangelogViewer(navigation.selectedPackage, version)
    }
  }

  const handleReturnToDashboardRequest = () => {
    navigateToPackageDashboard()
  }

  const handleNavigateBackRequest = () => {
    navigateToPreviousRadarView()
  }

  if (navigation.currentView === 'timeline' && navigation.selectedPackage) {
    return (
      <VersionTimeline
        packageInfo={navigation.selectedPackage}
        onBack={handleReturnToDashboardRequest}
        onVersionClick={handleVersionDetailsRequest}
      />
    )
  }

  if (
    navigation.currentView === 'changelog' &&
    navigation.selectedVersion &&
    navigation.selectedPackage
  ) {
    return (
      <ChangelogViewer
        packageInfo={navigation.selectedPackage}
        versionInfo={navigation.selectedVersion}
        onBackToTimeline={handleNavigateBackRequest}
      />
    )
  }

  return <PackageDashboard onPackageClick={handlePackageViewRequest} />
}

export default App
