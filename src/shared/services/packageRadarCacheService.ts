import { useRadarStore } from '@shared/store/appStore'
import type { VersionInfo } from '@infrastructure/api/types'

/**
 * Package Radar Cache Service
 *
 * Provides intelligent API call management with automatic caching,
 * retry logic, and performance optimization for package version tracking.
 */

export interface PackageRadarCacheOptions {
  ttl?: number
  forceRefresh?: boolean
  retries?: number
  retryDelay?: number
}

export interface PackageRadarCacheMetrics {
  hits: number
  misses: number
  errors: number
  totalRequests: number
  hitRate: number
}

/**
 * Service for intelligent package version data caching and API management
 */
export class PackageRadarCacheService {
  private static metrics: PackageRadarCacheMetrics = {
    hits: 0,
    misses: 0,
    errors: 0,
    totalRequests: 0,
    hitRate: 0,
  }

  private static readonly DEFAULT_TTL = {
    DASHBOARD_DATA: 5 * 60 * 1000,
    TIMELINE_DATA: 10 * 60 * 1000,
    CHANGELOG_DATA: 15 * 60 * 1000,
  }

  /**
   * Retrieves data from cache or fetches from API with intelligent caching
   *
   * @param cacheKey - Unique identifier for cached data
   * @param fetchOperation - Function to execute if cache miss occurs
   * @param options - Cache configuration options
   * @returns Cached or freshly fetched data
   */
  static async retrieveOrFetchData<T>(
    cacheKey: string,
    fetchOperation: () => Promise<T>,
    options: PackageRadarCacheOptions = {}
  ): Promise<T> {
    const {
      ttl = this.DEFAULT_TTL.DASHBOARD_DATA,
      forceRefresh = false,
      retries = 3,
      retryDelay = 1000,
    } = options

    this.metrics.totalRequests++

    try {
      if (!forceRefresh) {
        const cachedData = this.retrieveFromRadarCache(cacheKey)
        if (cachedData !== null) {
          this.metrics.hits++
          this.updatePerformanceMetrics()
          this.logCacheHit(cacheKey)
          return cachedData as T
        }
      }

      this.metrics.misses++
      this.logCacheMiss(cacheKey)

      const freshData = await this.executeWithRetryLogic(fetchOperation, retries, retryDelay)
      this.storeInRadarCache(cacheKey, freshData, ttl)

      this.updatePerformanceMetrics()
      return freshData
    } catch (error) {
      this.metrics.errors++
      this.updatePerformanceMetrics()
      console.error(`Package radar cache error for: ${cacheKey}`, error)
      throw error
    }
  }

  /**
   * Retrieves or fetches package dashboard data with optimized TTL
   */
  static async retrieveOrFetchPackageDashboardData<T>(
    packageName: string,
    fetchOperation: () => Promise<T>,
    options: PackageRadarCacheOptions = {}
  ): Promise<T> {
    const cacheKey = `dashboard:${packageName}:overview`
    return this.retrieveOrFetchData(cacheKey, fetchOperation, {
      ttl: this.DEFAULT_TTL.DASHBOARD_DATA,
      ...options,
    })
  }

  /**
   * Retrieves or fetches version timeline data with extended TTL
   */
  static async retrieveOrFetchVersionTimelineData<T>(
    packageName: string,
    fetchOperation: () => Promise<T>,
    options: PackageRadarCacheOptions = {}
  ): Promise<T> {
    const cacheKey = `timeline:${packageName}:versions`
    return this.retrieveOrFetchData(cacheKey, fetchOperation, {
      ttl: this.DEFAULT_TTL.TIMELINE_DATA,
      ...options,
    })
  }

  /**
   * Retrieves or fetches changelog content with maximum TTL
   */
  static async retrieveOrFetchChangelogData<T>(
    packageName: string,
    version: string,
    fetchOperation: () => Promise<T>,
    options: PackageRadarCacheOptions = {}
  ): Promise<T> {
    const cacheKey = `changelog:${packageName}:${version}`
    return this.retrieveOrFetchData(cacheKey, fetchOperation, {
      ttl: this.DEFAULT_TTL.CHANGELOG_DATA,
      ...options,
    })
  }

  /**
   * Invalidates all cached data for a specific package
   *
   * @param packageName - Package to invalidate cache for
   */
  static invalidatePackageRadarData(packageName: string): void {
    const store = useRadarStore.getState()
    const invalidationPatterns = [
      `dashboard:${packageName}:overview`,
      `timeline:${packageName}:versions`,
    ]

    invalidationPatterns.forEach(pattern => {
      const newPackageCache = new Map(store.packageRadarCache)
      newPackageCache.delete(pattern)

      const newVersionCache = new Map(store.versionTimelineCache)
      newVersionCache.delete(pattern)

      useRadarStore.setState({
        packageRadarCache: newPackageCache,
        versionTimelineCache: newVersionCache,
      })
    })

    this.logCacheInvalidation(`package: ${packageName}`)
  }

  /**
   * Invalidates cache entries matching the specified pattern
   *
   * @param pattern - Regular expression to match cache keys
   */
  static invalidateByRadarPattern(pattern: RegExp): void {
    const store = useRadarStore.getState()

    const filteredPackageCache = new Map()
    store.packageRadarCache.forEach((value, key) => {
      if (!pattern.test(key)) {
        filteredPackageCache.set(key, value)
      }
    })

    const filteredVersionCache = new Map()
    store.versionTimelineCache.forEach((value, key) => {
      if (!pattern.test(key)) {
        filteredVersionCache.set(key, value)
      }
    })

    const filteredChangelogCache = new Map()
    store.changelogContentCache.forEach((value, key) => {
      if (!pattern.test(key)) {
        filteredChangelogCache.set(key, value)
      }
    })

    useRadarStore.setState({
      packageRadarCache: filteredPackageCache,
      versionTimelineCache: filteredVersionCache,
      changelogContentCache: filteredChangelogCache,
    })

    this.logCacheInvalidation(`pattern: ${pattern}`)
  }

  /**
   * Executes operation with exponential backoff retry logic
   */
  private static async executeWithRetryLogic<T>(
    operation: () => Promise<T>,
    retries: number,
    baseDelay: number
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error

        if (attempt === retries) break
        if (!this.isRetryableRadarError(error)) throw error

        const retryDelay = baseDelay * Math.pow(2, attempt)
        this.logRetryAttempt(attempt + 1, retries + 1, retryDelay)
        await this.delayExecution(retryDelay)
      }
    }

    throw lastError!
  }

  /**
   * Determines if error is recoverable for package radar operations
   */
  private static isRetryableRadarError(error: unknown): boolean {
    // Type guard for error objects
    if (typeof error !== 'object' || error === null) return false

    const errorObj = error as Record<string, unknown>

    // Network errors
    if (
      errorObj.name === 'NetworkError' ||
      (typeof errorObj.message === 'string' && errorObj.message.includes('fetch'))
    ) {
      return true
    }

    // HTTP errors - retry 5xx and 429
    if (typeof errorObj.status === 'number') {
      return errorObj.status >= 500 || errorObj.status === 429
    }

    return false
  }

  /**
   * Creates delay for retry logic
   */
  private static delayExecution(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Retrieves data from radar cache stores
   */
  private static retrieveFromRadarCache(key: string): unknown | null {
    const store = useRadarStore.getState()

    let cachedData = store.retrievePackageRadarData(key)
    if (cachedData !== null) return cachedData

    if (key.startsWith('timeline:')) {
      const packageName = key.split(':')[1]
      cachedData = store.retrieveVersionTimeline(packageName)
      if (cachedData !== null) return cachedData
    }

    if (key.startsWith('changelog:')) {
      cachedData = store.retrieveChangelogContent(key)
      if (cachedData !== null) return cachedData
    }

    return null
  }

  /**
   * Stores data in appropriate radar cache
   */
  private static storeInRadarCache(key: string, data: unknown, ttl: number): void {
    const store = useRadarStore.getState()

    if (key.startsWith('dashboard:')) {
      store.storePackageRadarData(key, data, ttl)
    } else if (key.startsWith('timeline:')) {
      const packageName = key.split(':')[1]
      store.storeVersionTimeline(packageName, data as VersionInfo[], ttl)
    } else if (key.startsWith('changelog:')) {
      store.storeChangelogContent(key, data as string, ttl)
    } else {
      store.storePackageRadarData(key, data, ttl)
    }
  }

  /**
   * Updates performance hit rate calculation
   */
  private static updatePerformanceMetrics(): void {
    this.metrics.hitRate = this.metrics.hits / this.metrics.totalRequests
  }

  /**
   * Returns current cache performance metrics
   */
  static getRadarCacheMetrics(): PackageRadarCacheMetrics {
    return { ...this.metrics }
  }

  /**
   * Resets cache performance metrics
   */
  static resetRadarCacheMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      errors: 0,
      totalRequests: 0,
      hitRate: 0,
    }
  }

  /**
   * Logs comprehensive radar cache state for debugging
   */
  static logRadarCacheState(): void {
    if (process.env.NODE_ENV !== 'development') return

    const store = useRadarStore.getState()
    const storeMetrics = store.getRadarCacheMetrics()

    console.group('📡 Package Radar Cache State')
    console.log('Store Metrics:', storeMetrics)
    console.log('Service Metrics:', this.getRadarCacheMetrics())
    console.log('Dashboard Cache Keys:', Array.from(store.packageRadarCache.keys()))
    console.log('Timeline Cache Keys:', Array.from(store.versionTimelineCache.keys()))
    console.log('Changelog Cache Keys:', Array.from(store.changelogContentCache.keys()))
    console.groupEnd()
  }

  /**
   * Development logging utilities
   */
  private static logCacheHit(key: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 Radar Cache HIT: ${key}`)
    }
  }

  private static logCacheMiss(key: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`❌ Radar Cache MISS: ${key}`)
    }
  }

  private static logCacheInvalidation(target: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Radar Cache INVALIDATED: ${target}`)
    }
  }

  private static logRetryAttempt(attempt: number, maxAttempts: number, delay: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏳ Radar Cache RETRY: ${attempt}/${maxAttempts} in ${delay}ms`)
    }
  }
}

/**
 * React hook for package radar cache service operations
 *
 * @returns Object containing cache service methods
 */
export const usePackageRadarCacheService = () => {
  return {
    retrieveOrFetchData: PackageRadarCacheService.retrieveOrFetchData,
    retrieveOrFetchPackageDashboardData:
      PackageRadarCacheService.retrieveOrFetchPackageDashboardData,
    retrieveOrFetchVersionTimelineData: PackageRadarCacheService.retrieveOrFetchVersionTimelineData,
    retrieveOrFetchChangelogData: PackageRadarCacheService.retrieveOrFetchChangelogData,
    invalidatePackageRadarData: PackageRadarCacheService.invalidatePackageRadarData,
    invalidateByRadarPattern: PackageRadarCacheService.invalidateByRadarPattern,
    getRadarCacheMetrics: PackageRadarCacheService.getRadarCacheMetrics,
    logRadarCacheState: PackageRadarCacheService.logRadarCacheState,
  }
}
