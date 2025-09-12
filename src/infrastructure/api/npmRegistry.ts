import type { NpmPackageResponse, VersionInfo } from './types';

const NPM_REGISTRY_BASE = 'https://registry.npmjs.org';

/**
 * Client for NPM Registry API operations
 * Handles fetching package information, versions, and publication history
 */
export class NpmRegistryClient {
  /**
   * Fetches complete package information from NPM Registry
   * @param packageName - NPM package name (e.g., 'react', '@angular/core')
   * @returns Package information including versions and timestamps
   * @throws {Error} When package not found or API request fails
   */
  async getPackageInfo(packageName: string): Promise<NpmPackageResponse> {
    const url = `${NPM_REGISTRY_BASE}/${encodeURIComponent(packageName)}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NPM API error: ${response.status} ${response.statusText}`);
      }
      
      const data: NpmPackageResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch package info for ${packageName}: ${error.message}`);
      }
      throw new Error(`Failed to fetch package info for ${packageName}: Unknown error`);
    }
  }

  /**
   * Gets the latest stable version of a package
   * @param packageName - NPM package name
   * @returns Latest version string (e.g., '18.3.1')
   */
  async getLatestVersion(packageName: string): Promise<string> {
    const packageInfo = await this.getPackageInfo(packageName);
    return packageInfo['dist-tags'].latest;
  }

  /**
   * Retrieves complete version history for a package
   * @param packageName - NPM package name
   * @returns Array of version info sorted by publish date (newest first)
   */
  async getVersionHistory(packageName: string): Promise<VersionInfo[]> {
    const packageInfo = await this.getPackageInfo(packageName);
    const { time, 'dist-tags': distTags } = packageInfo;
    
    const versions: VersionInfo[] = [];
    const latestVersion = distTags.latest;
    
    for (const [version, publishedAt] of Object.entries(time)) {
      if (version === 'created' || version === 'modified') continue;
      if (!version.match(/^\d+\.\d+\.\d+/)) continue;
      
      const isPrerelease = version.includes('-');
      
      versions.push({
        version,
        publishedAt,
        isLatest: version === latestVersion,
        isPrerelease,
      });
    }
    
    return versions.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

/**
 * Singleton instance for NPM Registry operations
 * @example
 * ```ts
 * import { npmRegistry } from '@infrastructure/api'
 * const latestReact = await npmRegistry.getLatestVersion('react')
 * ```
 */
export const npmRegistry = new NpmRegistryClient();