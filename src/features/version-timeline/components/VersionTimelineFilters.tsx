import { useState } from 'react'
import type { VersionInfo } from '@infrastructure/api/types'
import { VersionFilteringService, type SortOrder } from '../services/versionFiltering'

interface VersionTimelineFiltersProps {
  versions: VersionInfo[]
  onFilter: (filteredVersions: VersionInfo[]) => void
}

/**
 * Filters for version timeline display and history management.
 * Provides prerelease filtering and chronological sorting controls.
 */
export const VersionTimelineFilters = ({ versions, onFilter }: VersionTimelineFiltersProps) => {
  const [showPrerelease, setShowPrerelease] = useState(true)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  const applyFilters = (newShowPrerelease: boolean, newSortOrder: SortOrder) => {
    try {
      const filtered = VersionFilteringService.filterVersionHistory(versions, {
        showPrerelease: newShowPrerelease,
        sortOrder: newSortOrder,
      })
      onFilter(filtered)
    } catch (error) {
      console.error('Error filtering versions:', error)
      // Fallback to original versions on error
      onFilter(versions)
    }
  }

  const handlePrereleaseToggle = () => {
    const newValue = !showPrerelease
    setShowPrerelease(newValue)
    applyFilters(newValue, sortOrder)
  }

  const handleSortChange = (newSort: SortOrder) => {
    setSortOrder(newSort)
    applyFilters(showPrerelease, newSort)
  }

  const stats = (() => {
    try {
      return VersionFilteringService.analyzeVersionHistory(versions)
    } catch (error) {
      console.error('Error analyzing version history:', error)
      return { total: 0, stable: 0, prerelease: 0, latest: 'Unknown' }
    }
  })()

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPrerelease}
              onChange={handlePrereleaseToggle}
              className="rounded"
            />
            <span className="text-sm">Show prereleases</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <select
              value={sortOrder}
              onChange={e => handleSortChange(e.target.value as SortOrder)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">{stats.total}</span> total •
          <span className="font-medium text-green-600 ml-1">{stats.stable}</span> stable •
          <span className="font-medium text-yellow-600 ml-1">{stats.prerelease}</span> prerelease
        </div>
      </div>
    </div>
  )
}
