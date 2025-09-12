import type { RefreshHandler } from '../models'

interface PackageVersionsRefreshProps {
  onRefresh: RefreshHandler
  isLoading: boolean
  lastRefresh?: Date
}

/**
 * Control for refreshing package versions radar data with loading state
 */
export const PackageVersionsRefresh = ({
  onRefresh,
  isLoading,
  lastRefresh,
}: PackageVersionsRefreshProps) => {
  return (
    <div className="text-center">
      <button onClick={onRefresh} disabled={isLoading} className="btn-primary micro-interaction">
        {isLoading ? '🔄 Refreshing...' : '🔄 Refresh Versions'}
      </button>
      {lastRefresh && (
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
