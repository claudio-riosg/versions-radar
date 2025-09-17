// NPM Registry API Types
export interface NpmPackageResponse {
  'dist-tags': {
    latest: string
    [tag: string]: string
  }
  time: Record<string, string>
  versions: Record<string, NpmVersionInfo>
  name: string
  description?: string
}

export interface NpmVersionInfo {
  version: string
  description?: string
  keywords?: string[]
  homepage?: string
  repository?: {
    type: string
    url: string
  }
}

// GitHub Releases API Types
export interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string
  published_at: string
  html_url: string
  prerelease: boolean
  draft: boolean
}

import type { TechnologyIconName } from '../config/iconConfig'

// Internal Domain Types
export interface PackageInfo {
  name: string
  npmName: string
  githubRepo: string
  description?: string
  icon: TechnologyIconName // Now strongly typed to available technology icons
}

export interface VersionInfo {
  version: string
  publishedAt: string
  isLatest: boolean
  isPrerelease: boolean
}

export interface ChangelogInfo {
  version: string
  title: string
  content: string
  publishedAt: string
  url: string
}
