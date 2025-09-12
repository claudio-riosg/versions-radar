import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GitHubReleasesClient } from '../githubReleases'

describe('GitHubReleasesClient', () => {
  let client: GitHubReleasesClient
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    client = new GitHubReleasesClient()
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  describe('getPublishedReleases', () => {
    it('should fetch releases successfully', async () => {
      const mockReleases = [
        {
          id: 1,
          tag_name: 'v18.3.1',
          name: 'React 18.3.1',
          body: 'Bug fixes and improvements',
          published_at: '2024-04-25T15:00:00Z',
          html_url: 'https://github.com/facebook/react/releases/tag/v18.3.1',
          prerelease: false,
          draft: false,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReleases),
      })

      const result = await client.getPublishedReleases('facebook', 'react')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/facebook/react/releases',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Versions-Radar/1.0',
          }),
        })
      )
      expect(result).toEqual(mockReleases)
    })

    it('should include authorization header when token provided', async () => {
      const clientWithToken = new GitHubReleasesClient('test-token')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await clientWithToken.getPublishedReleases('facebook', 'react')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/facebook/react/releases',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
    })

    it('should handle rate limit errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      })

      await expect(client.getPublishedReleases('facebook', 'react')).rejects.toThrow(
        'Failed to fetch releases for facebook/react: GitHub API rate limit exceeded. Consider adding a GitHub token.'
      )
    })

    it('should handle other API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(client.getPublishedReleases('nonexistent', 'repo')).rejects.toThrow(
        'Failed to fetch releases for nonexistent/repo: GitHub API error: 404 Not Found'
      )
    })
  })

  describe('getChangelogForVersion', () => {
    const mockReleases = [
      {
        id: 1,
        tag_name: 'v18.3.1',
        name: 'React 18.3.1',
        body: 'Bug fixes for React 18.3.1',
        published_at: '2024-04-25T15:00:00Z',
        html_url: 'https://github.com/facebook/react/releases/tag/v18.3.1',
        prerelease: false,
        draft: false,
      },
      {
        id: 2,
        tag_name: '18.3.0',
        name: 'React 18.3.0',
        body: 'New features in React 18.3.0',
        published_at: '2024-04-25T12:00:00Z',
        html_url: 'https://github.com/facebook/react/releases/tag/18.3.0',
        prerelease: false,
        draft: false,
      },
    ]

    beforeEach(() => {
      vi.clearAllMocks()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReleases),
      })
    })

    it('should find changelog with exact tag match', async () => {
      const changelog = await client.getChangelogForVersion('facebook', 'react', 'v18.3.1')

      expect(changelog).toEqual({
        version: 'v18.3.1',
        title: 'React 18.3.1',
        content: 'Bug fixes for React 18.3.1',
        publishedAt: '2024-04-25T15:00:00Z',
        url: 'https://github.com/facebook/react/releases/tag/v18.3.1',
      })
    })

    it('should find changelog without v prefix', async () => {
      const changelog = await client.getChangelogForVersion('facebook', 'react', '18.3.0')

      expect(changelog).toEqual({
        version: '18.3.0',
        title: 'React 18.3.0',
        content: 'New features in React 18.3.0',
        publishedAt: '2024-04-25T12:00:00Z',
        url: 'https://github.com/facebook/react/releases/tag/18.3.0',
      })
    })

    it('should find changelog with v prefix when searching without', async () => {
      const changelog = await client.getChangelogForVersion('facebook', 'react', '18.3.1')

      expect(changelog).toEqual({
        version: 'v18.3.1',
        title: 'React 18.3.1',
        content: 'Bug fixes for React 18.3.1',
        publishedAt: '2024-04-25T15:00:00Z',
        url: 'https://github.com/facebook/react/releases/tag/v18.3.1',
      })
    })

    it('should return null when version not found', async () => {
      const changelog = await client.getChangelogForVersion('facebook', 'react', '19.0.0')

      expect(changelog).toBeNull()
    })
  })

  describe('getChangelogForVersion - empty body', () => {
    it('should handle releases without body', async () => {
      const releaseWithoutBody = [
        {
          id: 1,
          tag_name: 'v18.3.1',
          name: 'React 18.3.1',
          body: null,
          published_at: '2024-04-25T15:00:00Z',
          html_url: 'https://github.com/facebook/react/releases/tag/v18.3.1',
          prerelease: false,
          draft: false,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(releaseWithoutBody),
      })

      const changelog = await client.getChangelogForVersion('facebook', 'react', 'v18.3.1')

      expect(changelog?.content).toBe('No changelog available.')
    })
  })

  describe('getAllChangelogs', () => {
    it('should return all non-draft changelogs sorted by date', async () => {
      const mockReleases = [
        {
          id: 1,
          tag_name: 'v18.3.0',
          name: 'React 18.3.0',
          body: 'Older release',
          published_at: '2024-04-25T12:00:00Z',
          html_url: 'https://github.com/facebook/react/releases/tag/v18.3.0',
          prerelease: false,
          draft: false,
        },
        {
          id: 2,
          tag_name: 'v18.3.1',
          name: 'React 18.3.1',
          body: 'Newer release',
          published_at: '2024-04-25T15:00:00Z',
          html_url: 'https://github.com/facebook/react/releases/tag/v18.3.1',
          prerelease: false,
          draft: false,
        },
        {
          id: 3,
          tag_name: 'v19.0.0-draft',
          name: 'Draft Release',
          body: 'Draft content',
          published_at: '2024-05-01T10:00:00Z',
          html_url: 'https://github.com/facebook/react/releases/tag/v19.0.0-draft',
          prerelease: false,
          draft: true,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReleases),
      })

      const changelogs = await client.getAllChangelogs('facebook', 'react')

      expect(changelogs).toHaveLength(2)
      expect(changelogs[0].version).toBe('v18.3.1') // Newer first
      expect(changelogs[1].version).toBe('v18.3.0')
      expect(changelogs.every(c => c.version !== 'v19.0.0-draft')).toBe(true) // Draft filtered out
    })
  })
})
