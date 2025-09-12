import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NpmRegistryClient } from '../npmRegistry'

describe('NpmRegistryClient', () => {
  let client: NpmRegistryClient
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    client = new NpmRegistryClient()
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  describe('getPackageInfo', () => {
    it('should fetch package info successfully', async () => {
      const mockResponse = {
        name: 'react',
        'dist-tags': { latest: '18.3.1' },
        time: { '18.3.1': '2024-04-25T12:00:00.000Z' },
        versions: { '18.3.1': { version: '18.3.1' } }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await client.getPackageInfo('react')

      expect(mockFetch).toHaveBeenCalledWith('https://registry.npmjs.org/react')
      expect(result).toEqual(mockResponse)
    })

    it('should handle scoped packages correctly', async () => {
      const mockResponse = {
        name: '@angular/core',
        'dist-tags': { latest: '17.0.0' },
        time: { '17.0.0': '2023-11-08T12:00:00.000Z' },
        versions: { '17.0.0': { version: '17.0.0' } }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      await client.getPackageInfo('@angular/core')

      expect(mockFetch).toHaveBeenCalledWith('https://registry.npmjs.org/%40angular%2Fcore')
    })

    it('should throw error when package not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(client.getPackageInfo('nonexistent-package'))
        .rejects.toThrow('Failed to fetch package info for nonexistent-package: NPM API error: 404 Not Found')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(client.getPackageInfo('react'))
        .rejects.toThrow('Failed to fetch package info for react: Network error')
    })
  })

  describe('getLatestVersion', () => {
    it('should return latest version', async () => {
      const mockResponse = {
        'dist-tags': { latest: '18.3.1', beta: '19.0.0-beta.1' },
        time: {},
        versions: {},
        name: 'react'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const version = await client.getLatestVersion('react')

      expect(version).toBe('18.3.1')
    })
  })

  describe('getVersionHistory', () => {
    it('should return filtered and sorted version history', async () => {
      const mockResponse = {
        'dist-tags': { latest: '18.3.1' },
        time: {
          'created': '2013-05-29T20:32:44.045Z',
          'modified': '2024-04-25T15:30:12.123Z',
          '18.3.0': '2024-04-25T12:00:00.000Z',
          '18.3.1': '2024-04-25T15:00:00.000Z',
          '19.0.0-beta.1': '2024-05-01T10:00:00.000Z'
        },
        versions: {},
        name: 'react'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const versions = await client.getVersionHistory('react')

      expect(versions).toHaveLength(3)
      expect(versions[0]).toEqual({
        version: '19.0.0-beta.1',
        publishedAt: '2024-05-01T10:00:00.000Z',
        isLatest: false,
        isPrerelease: true
      })
      expect(versions[1]).toEqual({
        version: '18.3.1',
        publishedAt: '2024-04-25T15:00:00.000Z',
        isLatest: true,
        isPrerelease: false
      })
      expect(versions[2]).toEqual({
        version: '18.3.0',
        publishedAt: '2024-04-25T12:00:00.000Z',
        isLatest: false,
        isPrerelease: false
      })
    })

    it('should filter out non-version entries', async () => {
      const mockResponse = {
        'dist-tags': { latest: '1.0.0' },
        time: {
          'created': '2023-01-01T00:00:00.000Z',
          'modified': '2023-01-01T00:00:00.000Z',
          '1.0.0': '2023-01-01T00:00:00.000Z',
          'invalid-version': '2023-01-01T00:00:00.000Z'
        },
        versions: {},
        name: 'test-package'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const versions = await client.getVersionHistory('test-package')

      expect(versions).toHaveLength(1)
      expect(versions[0].version).toBe('1.0.0')
    })
  })
})