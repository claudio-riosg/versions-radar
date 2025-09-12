interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  icon?: string
}

/**
 * Shared loading spinner component used across features
 * Provides consistent loading states with customizable size and message
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  icon = '🔄' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl', 
    lg: 'text-4xl'
  }

  return (
    <div className="text-center">
      <div className={`animate-pulse-soft ${sizeClasses[size]} mb-2`}>
        {icon}
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}