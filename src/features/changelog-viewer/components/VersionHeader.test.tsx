/**
 * VersionHeader Component Tests - Co-located with VersionHeader.tsx
 * 
 * Tests component functionality.
 * Tests package information display, version badges, date formatting, and GitHub links.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VersionHeader } from './VersionHeader'
import { 
  changelogPackageCollections,
  changelogVersionCollections,
  changelogViewerCollections
} from '../test-utils/changelogViewerMocks'

// Mock Date for consistent testing
const mockDate = new Date('2023-06-14T10:00:00Z')
const originalDate = Date

beforeEach(() => {
  // Mock Date constructor for consistent date formatting tests
  global.Date = class extends Date {
    constructor(...args: unknown[]) {
      if (args.length === 0) {
        super(mockDate)
      } else {
        super(...args as ConstructorParameters<typeof Date>)
      }
    }
  } as typeof Date
})

afterEach(() => {
  global.Date = originalDate
})

describe('VersionHeader Presentational Component', () => {
  describe('Package and Version Display', () => {
    it('should display package icon and name with version', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      // Should display package icon
      expect(screen.getByText('⚛️')).toBeInTheDocument()
      expect(screen.getByText('⚛️')).toHaveClass('text-4xl', 'mb-4')

      // Should display package name and version as heading
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React 18.2.0')
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-3xl', 'font-bold', 'mb-2')
    })

    it('should display different package icons correctly', () => {
      const scenarios = [
        { pkg: changelogPackageCollections.reactStablePackage(), icon: '⚛️' },
        { pkg: changelogPackageCollections.angularPackage(), icon: '🅰️' },
        { pkg: changelogPackageCollections.typescriptPackage(), icon: '📘' },
      ]

      scenarios.forEach(({ pkg, icon }) => {
        const version = changelogVersionCollections.stableLatestVersion()
        const changelog = changelogViewerCollections.majorReleaseChangelog()

        const { unmount } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)
        
        expect(screen.getByText(icon)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should format package name and version correctly', () => {
      const pkg = changelogPackageCollections.angularPackage()
      const version = changelogVersionCollections.richContentVersion()
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Angular 15.0.0')
    })

    it('should handle prerelease version names', () => {
      const pkg = changelogPackageCollections.reactBetaPackage()
      const version = changelogVersionCollections.prereleaseVersion()
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React 19.0.0-beta.1')
    })
  })

  describe('Version Badges and Status', () => {
    it('should display LATEST badge for latest versions', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const latestBadge = screen.getByText('LATEST')
      expect(latestBadge).toBeInTheDocument()
      expect(latestBadge).toHaveClass('bg-radar-blue', 'text-white', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium')
    })

    it('should display PRERELEASE badge for prerelease versions', () => {
      const pkg = changelogPackageCollections.reactBetaPackage()
      const version = changelogVersionCollections.prereleaseVersion()
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const prereleaseBadge = screen.getByText('PRERELEASE')
      expect(prereleaseBadge).toBeInTheDocument()
      expect(prereleaseBadge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium')
    })

    it('should display both LATEST and PRERELEASE badges when applicable', () => {
      const pkg = changelogPackageCollections.reactBetaPackage()
      const version = {
        ...changelogVersionCollections.prereleaseVersion(),
        isLatest: true, // Both latest and prerelease
      }
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      expect(screen.getByText('LATEST')).toBeInTheDocument()
      expect(screen.getByText('PRERELEASE')).toBeInTheDocument()
    })

    it('should not display badges for regular stable versions', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.olderStableVersion() // Not latest, not prerelease
      const changelog = changelogViewerCollections.patchReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      expect(screen.queryByText('LATEST')).not.toBeInTheDocument()
      expect(screen.queryByText('PRERELEASE')).not.toBeInTheDocument()
    })

    it('should have proper badge container layout', () => {
      const pkg = changelogPackageCollections.reactBetaPackage()
      const version = {
        ...changelogVersionCollections.prereleaseVersion(),
        isLatest: true,
      }
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      const { container } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const badgeContainer = container.querySelector('.flex.items-center.justify-center.gap-4.mb-4')
      expect(badgeContainer).toBeInTheDocument()
    })
  })

  describe('Publication Date Display', () => {
    it('should display formatted publication date and time', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      // Check that publication date is displayed (using the version's publishedAt)
      const publishDate = new Date(version.publishedAt)
      const expectedDate = publishDate.toLocaleDateString()
      const expectedTime = publishDate.toLocaleTimeString()

      expect(screen.getByText(/Published on/)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(expectedDate))).toBeInTheDocument()
      expect(screen.getByText(new RegExp(expectedTime))).toBeInTheDocument()
    })

    it('should handle different date formats correctly', () => {
      const pkg = changelogPackageCollections.angularPackage()
      const version = changelogVersionCollections.richContentVersion()
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const publishDate = new Date(version.publishedAt)
      const formattedDate = publishDate.toLocaleDateString()
      
      expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument()
    })

    it('should display publication info with proper styling', () => {
      const pkg = changelogPackageCollections.typescriptPackage()
      const version = changelogVersionCollections.minimalVersion()
      const changelog = changelogViewerCollections.minimalChangelogContent()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const publishInfo = screen.getByText(/Published on/)
      expect(publishInfo).toHaveClass('text-gray-600', 'mb-2')
    })

    it('should handle timezone differences in published dates', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = {
        ...changelogVersionCollections.stableLatestVersion(),
        publishedAt: '2023-12-25T23:59:59Z', // Different timezone scenario
      }
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const publishDate = new Date(version.publishedAt)
      expect(screen.getByText(new RegExp(publishDate.toLocaleDateString()))).toBeInTheDocument()
    })
  })

  describe('GitHub Link Integration', () => {
    it('should display GitHub link when changelog is provided', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const githubLink = screen.getByRole('link', { name: /view on github/i })
      expect(githubLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', changelog.url)
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(githubLink).toHaveClass('text-radar-blue', 'hover:underline', 'text-sm')
    })

    it('should not display GitHub link when changelog is null', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()

      render(<VersionHeader package={pkg} version={version} changelog={null} />)

      expect(screen.queryByRole('link', { name: /view on github/i })).not.toBeInTheDocument()
    })

    it('should handle different GitHub URLs correctly', () => {
      const scenarios = [
        changelogViewerCollections.majorReleaseChangelog(),
        changelogViewerCollections.prereleaseChangelogBeta(),
        changelogViewerCollections.richMarkdownChangelog(),
      ]

      scenarios.forEach((changelog) => {
        const pkg = changelogPackageCollections.reactStablePackage()
        const version = changelogVersionCollections.stableLatestVersion()

        const { unmount } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)
        
        const githubLink = screen.getByRole('link', { name: /view on github/i })
        expect(githubLink).toHaveAttribute('href', changelog.url)
        
        unmount()
      })
    })

    it('should have proper link styling and arrow indicator', () => {
      const pkg = changelogPackageCollections.angularPackage()
      const version = changelogVersionCollections.richContentVersion()
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const githubLink = screen.getByRole('link', { name: /view on github/i })
      expect(githubLink).toHaveTextContent('View on GitHub →')
    })
  })

  describe('Component Layout and Structure', () => {
    it('should have proper header structure and centering', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      const { container } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      const headerContainer = container.querySelector('.text-center.mb-8')
      expect(headerContainer).toBeInTheDocument()
    })

    it('should maintain proper spacing between elements', () => {
      const pkg = changelogPackageCollections.reactBetaPackage()
      const version = changelogVersionCollections.prereleaseVersion()
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      const { container } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      // Check icon spacing
      const icon = container.querySelector('.text-4xl.mb-4')
      expect(icon).toBeInTheDocument()

      // Check heading spacing
      const heading = container.querySelector('.text-3xl.font-bold.mb-2')
      expect(heading).toBeInTheDocument()

      // Check badge container spacing
      const badgeContainer = container.querySelector('.flex.items-center.justify-center.gap-4.mb-4')
      expect(badgeContainer).toBeInTheDocument()
    })

    it('should handle layout without badges correctly', () => {
      const pkg = changelogPackageCollections.typescriptPackage()
      const version = changelogVersionCollections.minimalVersion()
      const changelog = changelogViewerCollections.minimalChangelogContent()

      const { container } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      // Badge container should still exist but be empty
      const badgeContainer = container.querySelector('.flex.items-center.justify-center.gap-4.mb-4')
      expect(badgeContainer).toBeInTheDocument()
      expect(badgeContainer?.children).toHaveLength(0)
    })

    it('should maintain responsive design structure', () => {
      const pkg = changelogPackageCollections.angularPackage()
      const version = changelogVersionCollections.richContentVersion()
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      const { container } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      // Main container should be centered
      expect(container.querySelector('.text-center')).toBeInTheDocument()
      
      // Elements should have proper responsive classes
      expect(container.querySelector('.text-4xl')).toBeInTheDocument() // Icon
      expect(container.querySelector('.text-3xl')).toBeInTheDocument() // Heading
    })
  })

  describe('Props Handling and Edge Cases', () => {
    it('should handle all props correctly', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<VersionHeader package={pkg} version={version} changelog={changelog} />)

      // Should display all provided information
      expect(screen.getByText(pkg.icon)).toBeInTheDocument()
      expect(screen.getByText(`${pkg.name} ${version.version}`)).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', changelog.url)
    })

    it('should handle changelog being null without errors', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()

      expect(() => {
        render(<VersionHeader package={pkg} version={version} changelog={null} />)
      }).not.toThrow()

      expect(screen.getByText(pkg.icon)).toBeInTheDocument()
      expect(screen.getByText(`${pkg.name} ${version.version}`)).toBeInTheDocument()
    })

    it('should handle different version states consistently', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const versionScenarios = [
        { version: changelogVersionCollections.stableLatestVersion(), badges: ['LATEST'] },
        { version: changelogVersionCollections.prereleaseVersion(), badges: ['PRERELEASE'] },
        { version: changelogVersionCollections.olderStableVersion(), badges: [] },
      ]

      versionScenarios.forEach(({ version, badges }) => {
        const changelog = changelogViewerCollections.majorReleaseChangelog()

        const { unmount } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)
        
        // Check expected badges
        badges.forEach(badge => {
          expect(screen.getByText(badge)).toBeInTheDocument()
        })

        // Check version display
        expect(screen.getByText(`${pkg.name} ${version.version}`)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should be pure and not cause side effects', () => {
      const pkg = changelogPackageCollections.reactStablePackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      const { rerender } = render(<VersionHeader package={pkg} version={version} changelog={changelog} />)
      
      expect(screen.getByText(`${pkg.name} ${version.version}`)).toBeInTheDocument()
      
      // Rerender with same props should produce same result
      rerender(<VersionHeader package={pkg} version={version} changelog={changelog} />)
      
      expect(screen.getByText(`${pkg.name} ${version.version}`)).toBeInTheDocument()
    })

    it('should handle prop changes correctly', () => {
      const initialPkg = changelogPackageCollections.reactStablePackage()
      const newPkg = changelogPackageCollections.angularPackage()
      const version = changelogVersionCollections.stableLatestVersion()
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      const { rerender } = render(<VersionHeader package={initialPkg} version={version} changelog={changelog} />)
      
      expect(screen.getByText(`${initialPkg.name} ${version.version}`)).toBeInTheDocument()
      expect(screen.getByText(initialPkg.icon)).toBeInTheDocument()
      
      // Change package
      rerender(<VersionHeader package={newPkg} version={version} changelog={changelog} />)
      
      expect(screen.getByText(`${newPkg.name} ${version.version}`)).toBeInTheDocument()
      expect(screen.getByText(newPkg.icon)).toBeInTheDocument()
    })
  })
})