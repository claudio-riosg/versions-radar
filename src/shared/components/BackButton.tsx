interface BackButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

/**
 * Shared back button component used across features
 * Provides consistent navigation with customizable styling
 */
export const BackButton = ({ onClick, children, variant = 'secondary' }: BackButtonProps) => {
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  
  return (
    <button 
      onClick={onClick} 
      className={`${buttonClass} micro-interaction`}
    >
      {children}
    </button>
  )
}