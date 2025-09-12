import type { GitHubRelease, ChangelogInfo } from './types'

const GITHUB_API_BASE = 'https://api.github.com'

/**
 * Client for GitHub Releases API operations
 * Handles fetching release information and changelogs with rate limit awareness
 */
export class GitHubReleasesClient {
  private apiToken?: string

  constructor(apiToken?: string) {
    this.apiToken = apiToken
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Versions-Radar/1.0',
    }

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`
    }

    return headers
  }

  /**
   * Fetches all published releases for a GitHub repository
   * @param owner - Repository owner (e.g., 'facebook')
   * @param repo - Repository name (e.g., 'react')
   * @returns Array of GitHub published releases
   * @throws {Error} When rate limited or repository not found
   */
  async getPublishedReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Consider adding a GitHub token.')
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const releases: GitHubRelease[] = await response.json()
      return releases
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch releases for ${owner}/${repo}: ${error.message}`)
      }
      throw new Error(`Failed to fetch releases for ${owner}/${repo}: Unknown error`)
    }
  }

  /**
   * Finds changelog for a specific version
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param version - Version to find (with or without 'v' prefix)
   * @returns Changelog info or null if not found
   */
  async getChangelogForVersion(
    owner: string,
    repo: string,
    version: string
  ): Promise<ChangelogInfo | null> {
    const releases = await this.getPublishedReleases(owner, repo)

    const release = releases.find(
      r =>
        r.tag_name === version ||
        r.tag_name === `v${version}` ||
        r.tag_name.replace(/^v/, '') === version
    )

    if (!release) {
      return null
    }

    return {
      version: release.tag_name,
      title: release.name || release.tag_name,
      content: release.body || 'No changelog available.',
      publishedAt: release.published_at,
      url: release.html_url,
    }
  }

  /**
   * Retrieves all published changelogs for a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @returns Array of changelog info sorted by date (newest first)
   */
  async getAllChangelogs(owner: string, repo: string): Promise<ChangelogInfo[]> {
    const releases = await this.getPublishedReleases(owner, repo)

    return releases
      .filter(release => !release.draft)
      .map(release => ({
        version: release.tag_name,
        title: release.name || release.tag_name,
        content: release.body || 'No changelog available.',
        publishedAt: release.published_at,
        url: release.html_url,
      }))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
}

/**
 * Singleton instance for GitHub Releases operations
 * @example
 * ```ts
 * import { githubReleases } from '@infrastructure/api'
 * const changelog = await githubReleases.getChangelogForVersion('facebook', 'react', '18.3.1')
 * ```
 */
export const githubReleases = new GitHubReleasesClient()
