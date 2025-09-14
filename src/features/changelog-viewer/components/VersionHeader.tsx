import type { PackageInfo, VersionInfo, ChangelogInfo } from '@infrastructure/api/types'

interface VersionHeaderProps {
  package: PackageInfo
  version: VersionInfo
  changelog: ChangelogInfo | null
}

/**
 * Header component showing version details and metadata
 */
export const VersionHeader = ({ package: pkg, version, changelog }: VersionHeaderProps) => {
  const publishDate = new Date(version.publishedAt)

  return (
    <div className="text-center mb-8">
      <div className="text-4xl mb-4">{pkg.icon}</div>

      <h1 className="text-3xl font-bold mb-2">
        {pkg.name} {version.version}
      </h1>

      <div className="flex items-center justify-center gap-4 mb-4">
        {version.isLatest && (
          <span className="bg-radar-blue text-white px-3 py-1 rounded-full text-sm font-medium">
            LATEST
          </span>
        )}
        {version.isPrerelease && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            PRERELEASE
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-2">
        Published on {publishDate.toLocaleDateString()} at {publishDate.toLocaleTimeString()}
      </p>

      {changelog && (
        <a
          href={changelog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-radar-blue hover:underline text-sm"
        >
          View on GitHub →
        </a>
      )}
    </div>
  )
}
