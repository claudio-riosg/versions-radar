import { useRadarNavigation } from '@shared/store/appStore'
import { UIIcon } from './icons'

interface RadarBackButtonProps {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary'
  showIcon?: boolean
}

/**
 * Radar navigation back button component
 * Provides consistent backward navigation using centralized radar store
 * Now uses SVG icons for better accessibility and consistency
 */
export const BackButton = ({ children, variant = 'secondary', showIcon = true }: RadarBackButtonProps) => {
  const { navigateToPreviousRadarView } = useRadarNavigation()
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <button type="button" onClick={navigateToPreviousRadarView} className={`${buttonClass} micro-interaction`}>
      {showIcon && (
        <UIIcon
          name="chevronLeft"
          size="sm"
          className="inline mr-1"
          accessibility={{
            decorative: false,
            title: 'Navigate back'
          }}
        />
      )}
      {children || 'Back'}
    </button>
  )
}
