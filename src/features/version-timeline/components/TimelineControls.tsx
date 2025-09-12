import { useState } from 'react'
import type { VersionInfo } from '@infrastructure/api/types'
import { VersionFilteringService, type SortOrder } from '../services/versionFiltering'

interface TimelineControlsProps {
  versions: VersionInfo[]
  onFilter: (filteredVersions: VersionInfo[]) => void
}

/**
 * Controls for filtering and managing timeline display
 */
export const TimelineControls = ({ versions, onFilter }: TimelineControlsProps) => {
  const [showPrerelease, setShowPrerelease] = useState(true)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  const applyFilters = (newShowPrerelease: boolean, newSortOrder: SortOrder) => {
    const filtered = VersionFilteringService.filterVersionHistory(versions, {
      showPrerelease: newShowPrerelease,
      sortOrder: newSortOrder
    })
    onFilter(filtered)
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

  const stats = VersionFilteringService.analyzeVersionHistory(versions)

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
              onChange={(e) => handleSortChange(e.target.value as SortOrder)}
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