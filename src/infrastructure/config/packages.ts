import type { PackageInfo } from '../api/types'

/**
 * Configuration of packages tracked by the Versions Radar application
 * Add new packages here to extend tracking capabilities
 */
export const TRACKED_PACKAGES: readonly PackageInfo[] = [
  {
    name: 'React',
    npmName: 'react',
    githubRepo: 'facebook/react',
    description: 'A JavaScript library for building user interfaces',
    icon: '⚛️',
  },
  {
    name: 'Angular',
    npmName: '@angular/core',
    githubRepo: 'angular/angular',
    description: 'Platform for building mobile and desktop web applications',
    icon: '🅰️',
  },
  {
    name: 'TypeScript',
    npmName: 'typescript',
    githubRepo: 'microsoft/TypeScript',
    description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output',
    icon: '📘',
  },
] as const

/**
 * Finds a package by display name or NPM name (case-insensitive)
 * @param name - Package display name or NPM name to search for
 * @returns Package info or undefined if not found
 */
export const getPackageByName = (name: string): PackageInfo | undefined => {
  return TRACKED_PACKAGES.find(
    pkg =>
      pkg.name.toLowerCase() === name.toLowerCase() ||
      pkg.npmName.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Finds a package by exact NPM name match
 * @param npmName - Exact NPM package name (e.g., '@angular/core')
 * @returns Package info or undefined if not found
 */
export const getPackageByNpmName = (npmName: string): PackageInfo | undefined => {
  return TRACKED_PACKAGES.find(pkg => pkg.npmName === npmName)
}

/**
 * Finds a package by GitHub repository path
 * @param githubRepo - Repository in 'owner/repo' format
 * @returns Package info or undefined if not found
 */
export const getPackageByGithubRepo = (githubRepo: string): PackageInfo | undefined => {
  return TRACKED_PACKAGES.find(pkg => pkg.githubRepo === githubRepo)
}
