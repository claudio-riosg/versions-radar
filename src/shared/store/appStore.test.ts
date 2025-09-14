/**
 * Zustand Store Tests - Co-located with appStore.ts
 *
 * Tests business logic, navigation flows, and cache management.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRadarStore, useRadarNavigation, useRadarCache } from './appStore'
import { createMockPackageInfo, createMockVersionInfo } from './appStore.mocks'

// Mock Date.now for cache TTL tests
const mockNow = vi.fn(() => 1000000)
vi.stubGlobal('Date', {
  ...Date,
  now: mockNow,
})

describe('RadarStore Navigation', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { getState, setState } = useRadarStore
    setState({
      ...getState(),
      navigation: {
        currentView: 'dashboard',
        selectedPackage: null,
        selectedVersion: null,
        viewHistory: ['dashboard'],
      },
    })
  })

  describe('navigateToPackageDashboard', () => {
    it('should navigate to dashboard and clear selections', () => {
      const { result } = renderHook(() => useRadarStore())
      
      act(() => {
        result.current.navigateToVersionTimeline(createMockPackageInfo())
      })
      
      act(() => {
        result.current.navigateToPackageDashboard()
      })
      
      expect(result.current.navigation.currentView).toBe('dashboard')
      expect(result.current.navigation.selectedPackage).toBeNull()
      expect(result.current.navigation.selectedVersion).toBeNull()
    })

    it('should not duplicate dashboard in view history', () => {
      const { result } = renderHook(() => useRadarStore())
      
      act(() => {
        result.current.navigateToPackageDashboard()
        result.current.navigateToPackageDashboard()
      })
      
      expect(result.current.navigation.viewHistory).toEqual(['dashboard'])
    })
  })

  describe('navigateToVersionTimeline', () => {
    it('should navigate to timeline with selected package', () => {
      const { result } = renderHook(() => useRadarStore())
      const mockPackage = createMockPackageInfo({ npmName: 'react', name: 'React' })
      
      act(() => {
        result.current.navigateToVersionTimeline(mockPackage)
      })
      
      expect(result.current.navigation.currentView).toBe('timeline')
      expect(result.current.navigation.selectedPackage).toEqual(mockPackage)
      expect(result.current.navigation.viewHistory).toEqual(['dashboard', 'timeline'])
    })

    it('should not duplicate timeline in view history', () => {
      const { result } = renderHook(() => useRadarStore())
      const mockPackage = createMockPackageInfo()
      
      act(() => {
        result.current.navigateToVersionTimeline(mockPackage)
        result.current.navigateToVersionTimeline(mockPackage)
      })
      
      expect(result.current.navigation.viewHistory).toEqual(['dashboard', 'timeline'])
    })
  })

  describe('navigateToChangelogViewer', () => {
    it('should navigate to changelog with package and version', () => {
      const { result } = renderHook(() => useRadarStore())
      const mockPackage = createMockPackageInfo()
      const mockVersion = createMockVersionInfo({ version: '18.0.0' })
      
      act(() => {
        result.current.navigateToChangelogViewer(mockPackage, mockVersion)
      })
      
      expect(result.current.navigation.currentView).toBe('changelog')
      expect(result.current.navigation.selectedPackage).toEqual(mockPackage)
      expect(result.current.navigation.selectedVersion).toEqual(mockVersion)
      expect(result.current.navigation.viewHistory).toEqual(['dashboard', 'changelog'])
    })
  })

  describe('navigateToPreviousRadarView', () => {
    it('should navigate to previous view', () => {
      const { result } = renderHook(() => useRadarStore())
      const mockPackage = createMockPackageInfo()
      
      act(() => {
        result.current.navigateToVersionTimeline(mockPackage)
        result.current.navigateToPreviousRadarView()
      })
      
      expect(result.current.navigation.currentView).toBe('dashboard')
      expect(result.current.navigation.viewHistory).toEqual(['dashboard'])
    })

    it('should stay on dashboard if no previous view', () => {
      const { result } = renderHook(() => useRadarStore())
      
      act(() => {
        result.current.navigateToPreviousRadarView()
      })
      
      expect(result.current.navigation.currentView).toBe('dashboard')
      expect(result.current.navigation.viewHistory).toEqual(['dashboard'])
    })
  })
})

describe('RadarStore Cache Management', () => {
  beforeEach(() => {
    // Reset store cache before each test
    const { getState, setState } = useRadarStore
    setState({
      ...getState(),
      packageRadarCache: new Map(),
      versionTimelineCache: new Map(),
      changelogContentCache: new Map(),
    })
    mockNow.mockReturnValue(1000000)
  })

  describe('Package Cache', () => {
    it('should store and retrieve package data', () => {
      const { result } = renderHook(() => useRadarStore())
      const testData = { name: 'React', version: '18.0.0' }
      
      act(() => {
        result.current.storePackageRadarData('react-key', testData)
      })
      
      const retrieved = result.current.retrievePackageRadarData('react-key')
      expect(retrieved).toEqual(testData)
    })

    it('should return null for non-existent keys', () => {
      const { result } = renderHook(() => useRadarStore())
      
      const retrieved = result.current.retrievePackageRadarData('non-existent')
      expect(retrieved).toBeNull()
    })

    it('should expire cache entries based on TTL', () => {
      const { result } = renderHook(() => useRadarStore())
      const testData = { name: 'React' }
      
      act(() => {
        result.current.storePackageRadarData('react-key', testData, 1000) // 1 second TTL
      })
      
      // Fast-forward time beyond TTL
      mockNow.mockReturnValue(1000000 + 2000) // +2 seconds
      
      act(() => {
        const retrieved = result.current.retrievePackageRadarData('react-key')
        expect(retrieved).toBeNull()
      })
    })
  })

  describe('Version Timeline Cache', () => {
    it('should store and retrieve version timeline data', () => {
      const { result } = renderHook(() => useRadarStore())
      const versions = [
        createMockVersionInfo({ version: '18.0.0' }),
        createMockVersionInfo({ version: '17.0.0' }),
      ]
      
      act(() => {
        result.current.storeVersionTimeline('react', versions)
      })
      
      const retrieved = result.current.retrieveVersionTimeline('react')
      expect(retrieved).toEqual(versions)
    })

    it('should expire version cache based on TTL', () => {
      const { result } = renderHook(() => useRadarStore())
      const versions = [createMockVersionInfo()]
      
      act(() => {
        result.current.storeVersionTimeline('react', versions, 1000)
      })
      
      mockNow.mockReturnValue(1000000 + 2000)
      
      act(() => {
        const retrieved = result.current.retrieveVersionTimeline('react')
        expect(retrieved).toBeNull()
      })
    })
  })

  describe('Changelog Cache', () => {
    it('should store and retrieve changelog content', () => {
      const { result } = renderHook(() => useRadarStore())
      const changelog = '# React 18.0.0\n\nNew features and improvements.'
      
      act(() => {
        result.current.storeChangelogContent('react-18.0.0', changelog)
      })
      
      const retrieved = result.current.retrieveChangelogContent('react-18.0.0')
      expect(retrieved).toBe(changelog)
    })
  })

  describe('Cache Management Operations', () => {
    it('should clear all cache data', () => {
      const { result } = renderHook(() => useRadarStore())
      
      act(() => {
        result.current.storePackageRadarData('key1', 'data1')
        result.current.storeVersionTimeline('react', [createMockVersionInfo()])
        result.current.storeChangelogContent('key2', 'changelog')
      })
      
      act(() => {
        result.current.clearPackageRadarCache()
      })
      
      expect(result.current.retrievePackageRadarData('key1')).toBeNull()
      expect(result.current.retrieveVersionTimeline('react')).toBeNull()
      expect(result.current.retrieveChangelogContent('key2')).toBeNull()
    })

    it('should get accurate cache metrics', () => {
      const { result } = renderHook(() => useRadarStore())
      
      act(() => {
        result.current.storePackageRadarData('key1', 'data1')
        result.current.storePackageRadarData('key2', 'data2')
        result.current.storeVersionTimeline('react', [])
        result.current.storeChangelogContent('changelog1', 'content')
      })
      
      const metrics = result.current.getRadarCacheMetrics()
      
      expect(metrics).toEqual({
        packageCacheSize: 2,
        versionCacheSize: 1,
        changelogCacheSize: 1,
        totalEntries: 4,
      })
    })

    it('should clear expired cache entries only', () => {
      const { result } = renderHook(() => useRadarStore())
      
      act(() => {
        // Store entries with different TTLs
        result.current.storePackageRadarData('expired', 'data1', 1000) // Will expire
        result.current.storePackageRadarData('valid', 'data2', 10000) // Won't expire
      })
      
      // Fast-forward time to expire first entry
      mockNow.mockReturnValue(1000000 + 2000)
      
      act(() => {
        result.current.clearExpiredRadarCache()
      })
      
      expect(result.current.retrievePackageRadarData('expired')).toBeNull()
      expect(result.current.retrievePackageRadarData('valid')).toBe('data2')
    })
  })
})

describe('useRadarNavigation Hook', () => {
  it('should provide navigation state and actions', () => {
    const { result } = renderHook(() => useRadarNavigation())
    
    expect(result.current).toHaveProperty('navigation')
    expect(result.current).toHaveProperty('navigateToPackageDashboard')
    expect(result.current).toHaveProperty('navigateToVersionTimeline')
    expect(result.current).toHaveProperty('navigateToChangelogViewer')
    expect(result.current).toHaveProperty('navigateToPreviousRadarView')
  })

  it('should be memoized correctly', () => {
    const { result, rerender } = renderHook(() => useRadarNavigation())
    
    const firstResult = result.current
    rerender()
    const secondResult = result.current
    
    // Should be the same reference due to memoization
    expect(firstResult).toBe(secondResult)
  })
})

describe('useRadarCache Hook', () => {
  it('should provide cache operations', () => {
    const { result } = renderHook(() => useRadarCache())
    
    expect(result.current).toHaveProperty('storePackageRadarData')
    expect(result.current).toHaveProperty('retrievePackageRadarData')
    expect(result.current).toHaveProperty('storeVersionTimeline')
    expect(result.current).toHaveProperty('retrieveVersionTimeline')
    expect(result.current).toHaveProperty('storeChangelogContent')
    expect(result.current).toHaveProperty('retrieveChangelogContent')
    expect(result.current).toHaveProperty('clearPackageRadarCache')
    expect(result.current).toHaveProperty('clearExpiredRadarCache')
    expect(result.current).toHaveProperty('getRadarCacheMetrics')
  })
})