import { PackageDashboard } from '@features/package-dashboard/package-dashboard'
import { VersionTimeline } from '@features/version-timeline/version-timeline'
import { ChangelogViewer } from '@features/changelog-viewer/changelog-viewer'
import { SpriteLoader } from '@shared/components/icons'
import { useRadarNavigation } from '@shared/store/appStore'

/**
 * Main application entry point with container/presentational architecture
 *
 * Uses global radar store for state management. All components are now
 * either pure containers or pure presentational components with proper
 * separation of concerns.
 */
function App() {
  const { navigation } = useRadarNavigation()

  return (
    <>
      <SpriteLoader />
      {navigation.currentView === 'timeline' && <VersionTimeline />}
      {navigation.currentView === 'changelog' && <ChangelogViewer />}
      {navigation.currentView === 'dashboard' && <PackageDashboard />}
      {!navigation.currentView && <PackageDashboard />}
    </>
  )
}

export default App
