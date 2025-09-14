import { useRadarNavigation } from '@shared/store/appStore'

interface RadarBackButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

/**
 * Radar navigation back button component
 * Provides consistent backward navigation using centralized radar store
 */
export const BackButton = ({ children, variant = 'secondary' }: RadarBackButtonProps) => {
  const { navigateToPreviousRadarView } = useRadarNavigation()
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <button type="button" onClick={navigateToPreviousRadarView} className={`${buttonClass} micro-interaction`}>
      {children}
    </button>
  )
}
