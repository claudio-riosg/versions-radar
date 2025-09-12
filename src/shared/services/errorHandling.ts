/**
 * Centralized error handling service for Versions Radar application
 * Provides consistent error processing, categorization, and user-friendly messaging
 */

export type ErrorCategory = 'network' | 'api-rate-limit' | 'not-found' | 'validation' | 'unknown'

export interface ProcessedError {
  message: string
  category: ErrorCategory
  originalError: Error | unknown
  userFriendlyMessage: string
  isRetryable: boolean
  suggestedAction?: string
}

export class ErrorHandlingService {
  /**
   * Processes any error into a standardized format for consistent handling
   * @param error - The error to process (Error object, string, or unknown)
   * @param context - Additional context about where the error occurred
   * @returns ProcessedError with categorization and user-friendly messaging
   */
  static processError(error: unknown, context?: string): ProcessedError {
    // Handle Error objects
    if (error instanceof Error) {
      return this.categorizeError(error, context)
    }

    // Handle string errors
    if (typeof error === 'string') {
      return this.createProcessedError(error, 'unknown', error, false)
    }

    // Handle unknown errors
    return this.createProcessedError(
      'An unexpected error occurred',
      'unknown',
      `Unknown error in ${context || 'application'}`,
      false
    )
  }

  /**
   * Categorizes errors based on their characteristics for appropriate handling
   */
  private static categorizeError(error: Error, context?: string): ProcessedError {
    const message = error.message.toLowerCase()

    // GitHub API rate limit errors
    if (message.includes('rate limit')) {
      return this.createProcessedError(
        error.message,
        'api-rate-limit',
        'GitHub API rate limit reached. Please try again later.',
        true,
        'Wait a few minutes before trying again, or add a GitHub token to increase rate limits.'
      )
    }

    // Network/fetch errors
    if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
      return this.createProcessedError(
        error.message,
        'network',
        'Unable to connect to package registries. Please check your internet connection.',
        true,
        'Check your internet connection and try again.'
      )
    }

    // 404 Not Found errors
    if (message.includes('404') || message.includes('not found')) {
      return this.createProcessedError(
        error.message,
        'not-found',
        `Package or version not found. This might be a temporary issue.`,
        true,
        'Verify the package name is correct or try again later.'
      )
    }

    // API errors (generic)
    if (message.includes('api error') || message.includes('github api')) {
      return this.createProcessedError(
        error.message,
        'api-rate-limit',
        'Package registry service is temporarily unavailable.',
        true,
        'Try refreshing in a few moments.'
      )
    }

    // Validation errors
    if (message.includes('invalid') || message.includes('malformed')) {
      return this.createProcessedError(
        error.message,
        'validation',
        'Invalid data received from package registry.',
        false,
        'This appears to be a data issue. Please report this problem.'
      )
    }

    // Default unknown error
    return this.createProcessedError(
      error.message,
      'unknown',
      `Something went wrong ${context ? `in ${context}` : ''}. Please try again.`,
      true,
      'Try refreshing the page or check back later.'
    )
  }

  /**
   * Creates a standardized ProcessedError object
   */
  private static createProcessedError(
    message: string,
    category: ErrorCategory,
    userFriendlyMessage: string,
    isRetryable: boolean,
    suggestedAction?: string
  ): ProcessedError {
    return {
      message,
      category,
      originalError: message,
      userFriendlyMessage,
      isRetryable,
      suggestedAction
    }
  }

  /**
   * Hook utility for consistent error state management
   * Returns standardized error handling for React hooks
   */
  static createHookErrorHandler<T>(
    setState: (updater: (prev: T) => T) => void,
    context?: string
  ) {
    return (error: unknown) => {
      const processedError = this.processError(error, context)
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: processedError.userFriendlyMessage
      }))

      // Log the technical error for debugging
      console.error(`[${context || 'Unknown'}] Error:`, processedError)
    }
  }

  /**
   * Utility for individual item error handling (e.g., per-package errors)
   * Returns error message suitable for individual items
   */
  static getItemErrorMessage(error: unknown, itemName?: string): string {
    const processedError = this.processError(error, itemName ? `${itemName} package` : 'package')
    
    // For individual items, provide shorter, more specific messages
    switch (processedError.category) {
      case 'api-rate-limit':
        return 'Rate limited'
      case 'network':
        return 'Connection failed'
      case 'not-found':
        return 'Not found'
      case 'validation':
        return 'Invalid data'
      default:
        return 'Failed to load'
    }
  }

  /**
   * Determines if an error should trigger an automatic retry
   * @param error - The processed error to evaluate
   * @returns true if the error is suitable for automatic retry
   */
  static shouldRetry(error: ProcessedError): boolean {
    return error.isRetryable && 
           error.category !== 'api-rate-limit' // Don't auto-retry rate limits
  }

  /**
   * Gets appropriate retry delay based on error category
   * @param error - The processed error
   * @returns delay in milliseconds, or null if no retry recommended
   */
  static getRetryDelay(error: ProcessedError): number | null {
    if (!error.isRetryable) return null

    switch (error.category) {
      case 'network':
        return 2000 // 2 seconds
      case 'api-rate-limit':
        return 60000 // 1 minute
      case 'not-found':
        return 5000 // 5 seconds
      default:
        return 3000 // 3 seconds
    }
  }
}