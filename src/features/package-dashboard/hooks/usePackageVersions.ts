import { useState, useCallback, useMemo } from 'react'
import { npmRegistry } from '@infrastructure/api'
import { TRACKED_PACKAGES } from '@infrastructure/config/packages'
import { ErrorHandlingService } from '@shared/services/errorHandling'
import { PackageRadarCacheService } from '@shared/services/packageRadarCacheService'
import type { DashboardState, DashboardPackage } from '../models'

/**
 * Cache-enabled hook for managing package versions radar scanning and monitoring
 */
export const usePackageVersionsRadar = () => {
  const [state, setState] = useState<DashboardState>({
    packages: TRACKED_PACKAGES.map(pkg => ({ ...pkg })),
    isLoading: false,
    error: null,
  })

  const fetchVersions = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    const handleError = ErrorHandlingService.createHookErrorHandler(
      setState,
      'package versions radar'
    )

    try {
      const updatedPackages: DashboardPackage[] = await Promise.all(
        TRACKED_PACKAGES.map(async pkg => {
          try {
            const latestVersion = await PackageRadarCacheService.retrieveOrFetchPackageDashboardData(
              pkg.npmName,
              () => npmRegistry.getLatestVersion(pkg.npmName)
            )
            return { ...pkg, latestVersion, isLoading: false }
          } catch (error) {
            return {
              ...pkg,
              error: ErrorHandlingService.getItemErrorMessage(error, pkg.name),
              isLoading: false,
            }
          }
        })
      )

      setState({
        packages: updatedPackages,
        isLoading: false,
        error: null,
        lastRefresh: new Date(),
      })
    } catch (error) {
      handleError(error)
    }
  }, [])

  return useMemo(
    () => ({
      ...state,
      fetchVersions,
    }),
    [state, fetchVersions]
  )
}
