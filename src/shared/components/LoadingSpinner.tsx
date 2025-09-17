interface LoadingSpinnerProps {
  message?: string
}

/**
 * Shared loading spinner component used across features
 * Provides consistent loading states with simple text-based animation
 * Simplified for better UI consistency
 */
export const LoadingSpinner = ({
  message = 'Loading...',
}: LoadingSpinnerProps) => {
  return (
    <div className="text-center">
      <div className="animate-pulse-soft text-2xl mb-2">⏳</div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}
