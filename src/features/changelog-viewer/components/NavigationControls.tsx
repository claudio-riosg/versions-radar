import { BackButton } from '@shared/components'
import type { BackToTimelineHandler } from '../models'

interface NavigationControlsProps {
  onBackToTimeline: BackToTimelineHandler
  packageName: string
}

/**
 * Navigation controls for changelog viewer
 */
export const NavigationControls = ({ onBackToTimeline, packageName }: NavigationControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <BackButton onClick={onBackToTimeline}>
        ← Back to {packageName} Timeline
      </BackButton>

      <div className="text-sm text-gray-500">
        Changelog • GitHub Release
      </div>
    </div>
  )
}