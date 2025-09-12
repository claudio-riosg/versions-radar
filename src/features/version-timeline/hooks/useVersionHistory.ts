import { useState, useCallback } from 'react'
import { npmRegistry } from '@infrastructure/api'
import { ErrorHandlingService } from '@shared/services/errorHandling'
import { PackageRadarCacheService } from '@shared/services/packageRadarCacheService'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'
import type { TimelineState } from '../models'

/**
 * Cache-enabled hook for managing version history data for a specific package
 */
export const useVersionHistory = () => {
  const [state, setState] = useState<TimelineState>({
    package: null,
    versions: [],
    isLoading: false,
    error: null,
  })

  const fetchVersionHistory = useCallback(async (packageInfo: PackageInfo) => {
    setState(prev => ({
      ...prev,
      package: packageInfo,
      isLoading: true,
      error: null,
    }))

    const handleError = ErrorHandlingService.createHookErrorHandler(
      setState,
      `${packageInfo.name} version history`
    )

    try {
      const versions = await PackageRadarCacheService.retrieveOrFetchVersionTimelineData<
        VersionInfo[]
      >(packageInfo.npmName, () => npmRegistry.getVersionHistory(packageInfo.npmName))

      setState(prev => ({
        ...prev,
        versions,
        isLoading: false,
      }))
    } catch (error) {
      handleError(error)
    }
  }, [])

  return {
    ...state,
    fetchVersionHistory,
  }
}
