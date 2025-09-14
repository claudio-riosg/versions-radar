import { BackButton } from '@shared/components'

interface RadarNavigationControlsProps {
  packageName: string
}

/**
 * Radar-enabled navigation controls for changelog viewer
 */
export const NavigationControls = ({ packageName }: RadarNavigationControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <BackButton>← Back to {packageName} Timeline</BackButton>

      <div className="text-sm text-gray-500">Changelog • GitHub Release</div>
    </div>
  )
}
