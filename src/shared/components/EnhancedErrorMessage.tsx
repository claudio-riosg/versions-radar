import { ErrorHandlingService, type ProcessedError } from '@shared/services/errorHandling'
import { UIIcon, LoadingIcon } from './icons'

interface EnhancedErrorMessageProps {
  error: unknown
  context?: string
  title?: string
  onRetry?: () => void
  isLoading?: boolean
  retryText?: string
  showTechnicalDetails?: boolean
}

/**
 * Enhanced error message component with categorized error handling
 * Uses ErrorHandlingService for consistent error processing and user-friendly messages
 * Now uses SVG icons for better accessibility and consistency
 */
export const EnhancedErrorMessage = ({
  error,
  context,
  title = 'Something went wrong',
  onRetry,
  isLoading = false,
  retryText = 'Try Again',
  showTechnicalDetails = false,
}: EnhancedErrorMessageProps) => {
  const processedError: ProcessedError = ErrorHandlingService.processError(error, context)

  const getCategoryIcon = (category: ProcessedError['category']) => {
    switch (category) {
      case 'network':
        return 'external'
      case 'api-rate-limit':
        return 'clock'
      case 'not-found':
        return 'search'
      case 'validation':
        return 'warning'
      default:
        return 'error'
    }
  }

  const getCategoryColor = (category: ProcessedError['category']) => {
    switch (category) {
      case 'network':
        return 'text-orange-600'
      case 'api-rate-limit':
        return 'text-yellow-600'
      case 'not-found':
        return 'text-blue-600'
      case 'validation':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="card max-w-md text-center">
      {/* Error Icon and Title */}
      <div className="mb-3">
        <div className="flex justify-center mb-2">
          <UIIcon
            name={getCategoryIcon(processedError.category)}
            size="2xl"
            variant={processedError.category === 'validation' ? 'warning' : 'error'}
            accessibility={{
              decorative: false,
              title: `${processedError.category} error`
            }}
          />
        </div>
        <h2 className={`text-xl font-bold mb-2 ${getCategoryColor(processedError.category)}`}>
          {title}
        </h2>
      </div>

      {/* User-Friendly Message */}
      <p className="text-gray-700 mb-4 leading-relaxed">{processedError.userFriendlyMessage}</p>

      {/* Suggested Action */}
      {processedError.suggestedAction && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <UIIcon
              name="info"
              size="sm"
              variant="secondary"
              accessibility={{
                decorative: false,
                title: 'Tip'
              }}
            />
            <span><strong>Tip:</strong> {processedError.suggestedAction}</span>
          </p>
        </div>
      )}

      {/* Retry Button */}
      {onRetry && processedError.isRetryable && (
        <div className="mb-4">
          <button
            onClick={onRetry}
            disabled={isLoading}
            className="btn-primary micro-interaction flex items-center gap-2 mx-auto"
          >
            {isLoading ? (
              <>
                <LoadingIcon size="sm" />
                Retrying...
              </>
            ) : (
              <>
                <UIIcon
                  name="refresh"
                  accessibility={{
                    decorative: false,
                    title: 'Retry action'
                  }}
                />
                {retryText}
              </>
            )}
          </button>
        </div>
      )}

      {/* Technical Details (Developer Mode) */}
      {showTechnicalDetails && (
        <details className="text-left">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 mb-2">
            Technical Details
          </summary>
          <div className="bg-gray-100 rounded p-3 text-xs font-mono text-gray-600">
            <div>
              <strong>Category:</strong> {processedError.category}
            </div>
            <div>
              <strong>Context:</strong> {context || 'Unknown'}
            </div>
            <div>
              <strong>Retryable:</strong> {processedError.isRetryable ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Original:</strong> {String(processedError.originalError)}
            </div>
          </div>
        </details>
      )}

      {/* Category Badge */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 ${getCategoryColor(processedError.category)}`}
        >
          {processedError.category.replace('-', ' ')}
        </span>
      </div>
    </div>
  )
}
