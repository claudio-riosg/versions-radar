import { create } from 'zustand'
import { useMemo } from 'react'
import type { PackageInfo, VersionInfo } from '@infrastructure/api/types'

/**
 * Versions Radar Application Store
 *
 * Global state management for package version tracking and navigation.
 * Implements intelligent caching with TTL to optimize API usage.
 */

/** Package version tracking views */
export type RadarView = 'dashboard' | 'timeline' | 'changelog'

/** Cache entry with expiration tracking */
export interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
}

/** Package version tracking navigation state */
export interface RadarNavigationState {
  currentView: RadarView
  selectedPackage: PackageInfo | null
  selectedVersion: VersionInfo | null
  viewHistory: RadarView[]
}

/** Versions Radar application store */
export interface RadarStore {
  // Navigation state
  navigation: RadarNavigationState

  // Cache state
  packageRadarCache: Map<string, CacheEntry>
  versionTimelineCache: Map<string, CacheEntry<VersionInfo[]>>
  changelogContentCache: Map<string, CacheEntry>

  // Navigation actions
  navigateToPackageDashboard: () => void
  navigateToVersionTimeline: (packageInfo: PackageInfo) => void
  navigateToChangelogViewer: (packageInfo: PackageInfo, version: VersionInfo) => void
  navigateToPreviousRadarView: () => void

  // Cache actions
  storePackageRadarData: (key: string, data: unknown, ttl?: number) => void
  retrievePackageRadarData: (key: string) => unknown | null
  storeVersionTimeline: (packageName: string, versions: VersionInfo[], ttl?: number) => void
  retrieveVersionTimeline: (packageName: string) => VersionInfo[] | null
  storeChangelogContent: (key: string, changelog: string, ttl?: number) => void
  retrieveChangelogContent: (key: string) => string | null

  // Cache management
  clearPackageRadarCache: () => void
  clearExpiredRadarCache: () => void
  getRadarCacheMetrics: () => {
    packageCacheSize: number
    versionCacheSize: number
    changelogCacheSize: number
    totalEntries: number
  }
}

/** Cache TTL configuration optimized for package version data frequency */
const RADAR_CACHE_TTL = {
  PACKAGE_RADAR: 5 * 60 * 1000, // 5 minutes - package info changes infrequently
  VERSION_TIMELINE: 10 * 60 * 1000, // 10 minutes - new versions published occasionally
  CHANGELOG_CONTENT: 15 * 60 * 1000, // 15 minutes - static content once published
}

/** Versions Radar store implementation with optimized caching and navigation */
export const useRadarStore = create<RadarStore>((set, get) => ({
  navigation: {
    currentView: 'dashboard',
    selectedPackage: null,
    selectedVersion: null,
    viewHistory: ['dashboard'],
  },

  packageRadarCache: new Map(),
  versionTimelineCache: new Map(),
  changelogContentCache: new Map(),

  navigateToPackageDashboard: () => {
    set(state => {
      const newHistory = [...state.navigation.viewHistory]
      if (newHistory[newHistory.length - 1] !== 'dashboard') {
        newHistory.push('dashboard')
      }

      return {
        navigation: {
          currentView: 'dashboard',
          selectedPackage: null,
          selectedVersion: null,
          viewHistory: newHistory,
        },
      }
    })
  },

  navigateToVersionTimeline: packageInfo => {
    set(state => {
      const newHistory = [...state.navigation.viewHistory]
      if (newHistory[newHistory.length - 1] !== 'timeline') {
        newHistory.push('timeline')
      }

      return {
        navigation: {
          currentView: 'timeline',
          selectedPackage: packageInfo,
          selectedVersion: state.navigation.selectedVersion,
          viewHistory: newHistory,
        },
      }
    })
  },

  navigateToChangelogViewer: (packageInfo, version) => {
    set(state => {
      const newHistory = [...state.navigation.viewHistory]
      if (newHistory[newHistory.length - 1] !== 'changelog') {
        newHistory.push('changelog')
      }

      return {
        navigation: {
          currentView: 'changelog',
          selectedPackage: packageInfo,
          selectedVersion: version,
          viewHistory: newHistory,
        },
      }
    })
  },

  navigateToPreviousRadarView: () => {
    set(state => {
      const viewHistory = [...state.navigation.viewHistory]

      if (viewHistory.length <= 1) {
        return {
          navigation: {
            ...state.navigation,
            currentView: 'dashboard',
            viewHistory: ['dashboard'],
          },
        }
      }

      viewHistory.pop()
      const previousView = viewHistory[viewHistory.length - 1]

      return {
        navigation: {
          ...state.navigation,
          currentView: previousView,
          viewHistory,
        },
      }
    })
  },

  storePackageRadarData: (key, data, ttl = RADAR_CACHE_TTL.PACKAGE_RADAR) => {
    set(state => {
      const newCache = new Map(state.packageRadarCache)
      newCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      })
      return { packageRadarCache: newCache }
    })
  },

  retrievePackageRadarData: key => {
    const { packageRadarCache } = get()
    const entry = packageRadarCache.get(key)

    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      set(state => {
        const newCache = new Map(state.packageRadarCache)
        newCache.delete(key)
        return { packageRadarCache: newCache }
      })
      return null
    }

    return entry.data
  },

  storeVersionTimeline: (packageName, versions, ttl = RADAR_CACHE_TTL.VERSION_TIMELINE) => {
    set(state => {
      const newCache = new Map(state.versionTimelineCache)
      newCache.set(packageName, {
        data: versions,
        timestamp: Date.now(),
        ttl,
      })
      return { versionTimelineCache: newCache }
    })
  },

  retrieveVersionTimeline: packageName => {
    const { versionTimelineCache } = get()
    const entry = versionTimelineCache.get(packageName)

    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      set(state => {
        const newCache = new Map(state.versionTimelineCache)
        newCache.delete(packageName)
        return { versionTimelineCache: newCache }
      })
      return null
    }

    return entry.data
  },

  storeChangelogContent: (key, changelog, ttl = RADAR_CACHE_TTL.CHANGELOG_CONTENT) => {
    set(state => {
      const newCache = new Map(state.changelogContentCache)
      newCache.set(key, {
        data: changelog,
        timestamp: Date.now(),
        ttl,
      })
      return { changelogContentCache: newCache }
    })
  },

  retrieveChangelogContent: key => {
    const { changelogContentCache } = get()
    const entry = changelogContentCache.get(key)

    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      set(state => {
        const newCache = new Map(state.changelogContentCache)
        newCache.delete(key)
        return { changelogContentCache: newCache }
      })
      return null
    }

    return entry.data as string
  },

  clearPackageRadarCache: () => {
    set(() => ({
      packageRadarCache: new Map(),
      versionTimelineCache: new Map(),
      changelogContentCache: new Map(),
    }))
  },

  clearExpiredRadarCache: () => {
    const now = Date.now()

    set(state => {
      const newPackageRadarCache = new Map()
      state.packageRadarCache.forEach((entry, key) => {
        if (now - entry.timestamp <= entry.ttl) {
          newPackageRadarCache.set(key, entry)
        }
      })

      const newVersionTimelineCache = new Map()
      state.versionTimelineCache.forEach((entry, key) => {
        if (now - entry.timestamp <= entry.ttl) {
          newVersionTimelineCache.set(key, entry)
        }
      })

      const newChangelogContentCache = new Map()
      state.changelogContentCache.forEach((entry, key) => {
        if (now - entry.timestamp <= entry.ttl) {
          newChangelogContentCache.set(key, entry)
        }
      })

      return {
        packageRadarCache: newPackageRadarCache,
        versionTimelineCache: newVersionTimelineCache,
        changelogContentCache: newChangelogContentCache,
      }
    })
  },

  getRadarCacheMetrics: () => {
    const { packageRadarCache, versionTimelineCache, changelogContentCache } = get()

    return {
      packageCacheSize: packageRadarCache.size,
      versionCacheSize: versionTimelineCache.size,
      changelogCacheSize: changelogContentCache.size,
      totalEntries: packageRadarCache.size + versionTimelineCache.size + changelogContentCache.size,
    }
  },
}))

/** Optimized hook for package version tracking navigation with selective subscriptions */
export const useRadarNavigation = () => {
  const navigation = useRadarStore(state => state.navigation)
  const navigateToPackageDashboard = useRadarStore(state => state.navigateToPackageDashboard)
  const navigateToVersionTimeline = useRadarStore(state => state.navigateToVersionTimeline)
  const navigateToChangelogViewer = useRadarStore(state => state.navigateToChangelogViewer)
  const navigateToPreviousRadarView = useRadarStore(state => state.navigateToPreviousRadarView)

  return useMemo(
    () => ({
      navigation,
      navigateToPackageDashboard,
      navigateToVersionTimeline,
      navigateToChangelogViewer,
      navigateToPreviousRadarView,
    }),
    [
      navigation,
      navigateToPackageDashboard,
      navigateToVersionTimeline,
      navigateToChangelogViewer,
      navigateToPreviousRadarView,
    ]
  )
}

/** Optimized hook for package version cache operations with memoized selectors */
export const useRadarCache = () => {
  const store = useRadarStore()

  return useMemo(
    () => ({
      storePackageRadarData: store.storePackageRadarData,
      retrievePackageRadarData: store.retrievePackageRadarData,
      storeVersionTimeline: store.storeVersionTimeline,
      retrieveVersionTimeline: store.retrieveVersionTimeline,
      storeChangelogContent: store.storeChangelogContent,
      retrieveChangelogContent: store.retrieveChangelogContent,
      clearPackageRadarCache: store.clearPackageRadarCache,
      clearExpiredRadarCache: store.clearExpiredRadarCache,
      getRadarCacheMetrics: store.getRadarCacheMetrics,
    }),
    [store]
  )
}
