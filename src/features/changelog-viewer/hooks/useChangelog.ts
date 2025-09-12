import { useState, useCallback } from 'react'
import { githubReleases } from '@infrastructure/api'
import { ErrorHandlingService } from '@shared/services/errorHandling'
import { PackageRadarCacheService } from '@shared/services/packageRadarCacheService'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'
import type { ChangelogState } from '../models'

/**
 * Cache-enabled hook for managing changelog data from GitHub releases
 */
export const useChangelog = () => {
  const [state, setState] = useState<ChangelogState>({
    package: null,
    version: null,
    changelog: null,
    isLoading: false,
    error: null,
  })

  const fetchChangelog = useCallback(async (packageInfo: PackageInfo, versionInfo: VersionInfo) => {
    setState(prev => ({
      ...prev,
      package: packageInfo,
      version: versionInfo,
      isLoading: true,
      error: null,
    }))

    const handleError = ErrorHandlingService.createHookErrorHandler(
      setState,
      `${packageInfo.name} changelog`
    )

    try {
      const [owner, repo] = packageInfo.githubRepo.split('/')
      
      const changelog = await PackageRadarCacheService.retrieveOrFetchChangelogData<string | null>(
        packageInfo.npmName,
        versionInfo.version,
        () => githubReleases.getChangelogForVersion(owner, repo, versionInfo.version)
      )

      setState(prev => ({
        ...prev,
        changelog,
        isLoading: false,
        error: changelog ? null : `No changelog found for version ${versionInfo.version}`,
      }))
    } catch (error) {
      handleError(error)
    }
  }, [])

  return {
    ...state,
    fetchChangelog,
  }
}
