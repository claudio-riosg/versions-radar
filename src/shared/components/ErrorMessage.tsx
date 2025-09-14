interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  isLoading?: boolean
  retryText?: string
}

/**
 * Shared error message component used across features
 * Provides consistent error display with optional retry functionality
 */
export const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  isLoading = false,
  retryText = 'Retry',
}: ErrorMessageProps) => {
  return (
    <div className="card max-w-md text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Retrying...' : retryText}
        </button>
      )}
    </div>
  )
}
