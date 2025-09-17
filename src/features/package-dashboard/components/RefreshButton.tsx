import { UIIcon, LoadingIcon } from '@shared/components/icons'
import type { RefreshHandler } from '../models'

interface PackageVersionsRefreshProps {
  onRefresh: RefreshHandler
  isLoading: boolean
  lastRefresh?: Date
}

/**
 * Control for refreshing package versions radar data with loading state
 * Now uses SVG icons for better accessibility and consistency
 */
export const PackageVersionsRefresh = ({
  onRefresh,
  isLoading,
  lastRefresh,
}: PackageVersionsRefreshProps) => {
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="btn-primary micro-interaction"
      >
        {isLoading ? (
          <>
            <LoadingIcon size="sm" className="inline mr-1" />
            Refreshing...
          </>
        ) : (
          <>
            <UIIcon
              name="refresh"
              size="sm"
              className="inline mr-1"
              accessibility={{
                decorative: false,
                title: 'Refresh versions data'
              }}
            />
            Refresh Versions
          </>
        )}
      </button>
      {lastRefresh && (
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
