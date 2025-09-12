import type { VersionInfo } from '@infrastructure/api/types'

export type SortOrder = 'newest' | 'oldest'

export interface VersionFilterOptions {
  showPrerelease: boolean
  sortOrder: SortOrder
}

/**
 * Business logic service for filtering and sorting version history data
 * Encapsulates version timeline manipulation logic
 */
export class VersionFilteringService {
  /**
   * Filters and sorts version history based on user preferences
   * @param versions - Array of version information
   * @param options - Filtering and sorting preferences
   * @returns Filtered and sorted versions
   */
  static filterVersionHistory(
    versions: VersionInfo[],
    options: VersionFilterOptions
  ): VersionInfo[] {
    const { showPrerelease, sortOrder } = options

    // Filter prereleases if requested
    const filtered = showPrerelease ? versions : versions.filter(version => !version.isPrerelease)

    // Apply chronological sorting
    return filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  }

  /**
   * Analyzes version history to provide statistics
   * @param versions - Array of version information
   * @returns Version statistics for display
   */
  static analyzeVersionHistory(versions: VersionInfo[]) {
    const total = versions.length
    const stable = versions.filter(v => !v.isPrerelease).length
    const prerelease = total - stable
    const latest = versions.find(v => v.isLatest)

    return {
      total,
      stable,
      prerelease,
      latest: latest?.version || 'Unknown',
    }
  }

  /**
   * Detects significant version patterns for radar insights
   * @param versions - Array of version information
   * @returns Release pattern insights
   */
  static detectReleasePatterns(versions: VersionInfo[]) {
    if (versions.length < 2) return { frequency: 'insufficient-data' }

    const sortedVersions = versions
      .filter(v => !v.isPrerelease)
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())

    if (sortedVersions.length < 2) return { frequency: 'irregular' }

    // Calculate average time between releases
    const intervals = []
    for (let i = 1; i < sortedVersions.length; i++) {
      const prev = new Date(sortedVersions[i - 1].publishedAt).getTime()
      const current = new Date(sortedVersions[i].publishedAt).getTime()
      intervals.push(current - prev)
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    const days = Math.round(avgInterval / (1000 * 60 * 60 * 24))

    if (days < 30) return { frequency: 'rapid', averageDays: days }
    if (days < 90) return { frequency: 'regular', averageDays: days }
    if (days < 180) return { frequency: 'quarterly', averageDays: days }
    return { frequency: 'slow', averageDays: days }
  }
}
