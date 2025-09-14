/**
 * Shared Components Test Utilities - Co-located with shared components
 * 
 * Following declarative naming and Screaming Architecture principles.
 * Provides business-domain focused mocks for shared UI component scenarios.
 */

import { vi } from 'vitest'

/**
 * Error scenarios for ErrorMessage component testing
 */
export const errorMessageScenarios = {
  // Network and API errors
  networkConnectionError: () => ({
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    onRetry: vi.fn(),
    isLoading: false,
    retryText: 'Retry',
  }),

  apiRateLimitError: () => ({
    title: 'Rate Limit Exceeded',
    message: 'Too many requests. Please wait a moment before trying again.',
    onRetry: vi.fn(),
    isLoading: false,
    retryText: 'Try Again',
  }),

  packageNotFoundError: () => ({
    title: 'Package Not Found',
    message: 'The requested package could not be found. Please check the package name and try again.',
    onRetry: vi.fn(),
    isLoading: false,
    retryText: 'Search Again',
  }),

  changelogUnavailableError: () => ({
    title: 'Changelog Unavailable',
    message: 'No changelog found for this version. This might be an older release without detailed notes.',
    onRetry: vi.fn(),
    isLoading: false,
    retryText: 'Retry',
  }),

  // Loading states during retry
  retryInProgressError: () => ({
    title: 'Connection Error',
    message: 'Failed to load package information. Please try again.',
    onRetry: vi.fn(),
    isLoading: true,
    retryText: 'Retry',
  }),

  // Custom error messages
  validationError: () => ({
    title: 'Invalid Input',
    message: 'Please provide a valid package name. Package names should contain only letters, numbers, and hyphens.',
    onRetry: undefined, // No retry for validation errors
    isLoading: false,
    retryText: 'Retry',
  }),

  // Minimal error (default props testing)
  basicError: () => ({
    message: 'Something went wrong.',
    // Other props will use defaults
  }),

  // Custom retry text scenarios
  customRetryTextError: () => ({
    title: 'Sync Failed',
    message: 'Failed to synchronize data with the server.',
    onRetry: vi.fn(),
    isLoading: false,
    retryText: 'Sync Again',
  }),

  // Long error messages
  verboseError: () => ({
    title: 'Detailed Error Information',
    message: 'The operation failed due to multiple factors: network connectivity issues, server overload, and potential data corruption. Please verify your connection, wait a few moments, and attempt the operation again. If the problem persists, contact support.',
    onRetry: vi.fn(),
    isLoading: false,
    retryText: 'Try Again',
  }),
}

/**
 * Loading scenarios for LoadingSpinner component testing
 */
export const loadingSpinnerScenarios = {
  // Package dashboard loading
  dashboardLoading: () => ({
    size: 'lg' as const,
    message: 'Loading package dashboard...',
    icon: '📦',
  }),

  packageDetailsLoading: () => ({
    size: 'md' as const,
    message: 'Fetching React package information...',
    icon: '⚛️',
  }),

  versionHistoryLoading: () => ({
    size: 'md' as const,
    message: 'Loading version timeline...',
    icon: '📊',
  }),

  changelogLoading: () => ({
    size: 'lg' as const,
    message: 'Loading React 18.2.0 Changelog',
    icon: '⚛️',
  }),

  // Different sizes
  smallSpinnerLoading: () => ({
    size: 'sm' as const,
    message: 'Loading...',
    icon: '🔄',
  }),

  largeSpinnerLoading: () => ({
    size: 'lg' as const,
    message: 'Please wait while we gather the latest information...',
    icon: '🚀',
  }),

  // Minimal loading (default props)
  basicLoading: () => ({}),

  // Search operations
  packageSearchLoading: () => ({
    size: 'md' as const,
    message: 'Searching for packages...',
    icon: '🔍',
  }),

  // Sync operations
  dataSyncLoading: () => ({
    size: 'md' as const,
    message: 'Synchronizing with NPM registry...',
    icon: '🔄',
  }),

  // Long operation messages
  heavyOperationLoading: () => ({
    size: 'lg' as const,
    message: 'Processing large dataset. This may take several moments to complete...',
    icon: '⏳',
  }),

  // Different icon scenarios
  customIconLoading: () => ({
    size: 'md' as const,
    message: 'Loading TypeScript definitions...',
    icon: '📘',
  }),

  noIconLoading: () => ({
    size: 'md' as const,
    message: 'Loading content...',
    icon: '',
  }),
}

/**
 * Navigation scenarios for BackButton component testing
 */
export const backButtonScenarios = {
  // Dashboard navigation
  backToDashboard: () => ({
    children: '← Back to Dashboard',
    variant: 'secondary' as const,
  }),

  backToTimeline: () => ({
    children: '← Back to React Timeline',
    variant: 'secondary' as const,
  }),

  backToPackageList: () => ({
    children: '← Back to Package List',
    variant: 'primary' as const,
  }),

  // Custom navigation text
  customNavigationText: () => ({
    children: 'Return to Previous View',
    variant: 'secondary' as const,
  }),

  // Different variants
  primaryVariantBack: () => ({
    children: '← Go Back',
    variant: 'primary' as const,
  }),

  secondaryVariantBack: () => ({
    children: '← Back',
    variant: 'secondary' as const,
  }),

  // Minimal back button (default props)
  basicBack: () => ({
    children: 'Back',
    // variant will use default
  }),

  // Icon-based navigation
  iconBasedBack: () => ({
    children: '← Previous',
    variant: 'secondary' as const,
  }),

  // Contextual navigation
  contextualTimelineBack: () => ({
    children: '← Back to Angular Timeline',
    variant: 'secondary' as const,
  }),

  contextualChangelogBack: () => ({
    children: '← Back to Version History',
    variant: 'secondary' as const,
  }),

  // Long navigation text
  verboseNavigationBack: () => ({
    children: '← Return to the Previous Screen and Continue Your Workflow',
    variant: 'secondary' as const,
  }),
}

/**
 * Integration scenarios combining multiple shared components
 */
export const sharedComponentIntegrationScenarios = {
  errorWithRetryFlow: () => {
    const errorScenario = errorMessageScenarios.networkConnectionError()
    const loadingScenario = loadingSpinnerScenarios.packageDetailsLoading()
    
    return {
      initial: errorScenario,
      duringRetry: {
        ...errorScenario,
        isLoading: true,
      },
      afterRetry: loadingScenario,
    }
  },

  dashboardLoadingFlow: () => {
    const loadingScenario = loadingSpinnerScenarios.dashboardLoading()
    const backScenario = backButtonScenarios.backToDashboard()
    
    return {
      loading: loadingScenario,
      navigation: backScenario,
    }
  },

  changelogErrorFlow: () => {
    const errorScenario = errorMessageScenarios.changelogUnavailableError()
    const backScenario = backButtonScenarios.backToTimeline()
    
    return {
      error: errorScenario,
      navigation: backScenario,
    }
  },
}

/**
 * Mock handlers factory for shared component interactions
 */
export const createSharedComponentMocks = () => {
  const mockNavigateToPreviousRadarView = vi.fn()
  const mockOnRetry = vi.fn()
  const mockOnClick = vi.fn()

  return {
    navigateToPreviousRadarView: mockNavigateToPreviousRadarView,
    onRetry: mockOnRetry,
    onClick: mockOnClick,
    
    // Helper to reset all mocks
    resetAll: () => {
      mockNavigateToPreviousRadarView.mockReset()
      mockOnRetry.mockReset() 
      mockOnClick.mockReset()
    },
    
    // Helper to get call counts
    getCallCounts: () => ({
      navigate: mockNavigateToPreviousRadarView.mock.calls.length,
      retry: mockOnRetry.mock.calls.length,
      click: mockOnClick.mock.calls.length,
    }),
  }
}

/**
 * Accessibility and interaction test scenarios
 */
export const accessibilityScenarios = {
  keyboardNavigation: () => ({
    errorWithKeyboard: {
      ...errorMessageScenarios.networkConnectionError(),
      expectKeyboardSupport: true,
    },
    backButtonWithKeyboard: {
      ...backButtonScenarios.backToDashboard(),
      expectKeyboardSupport: true,
    },
  }),

  screenReaderSupport: () => ({
    errorWithScreenReader: {
      ...errorMessageScenarios.apiRateLimitError(),
      expectAriaLabels: true,
    },
    loadingWithScreenReader: {
      ...loadingSpinnerScenarios.changelogLoading(),
      expectAriaLabels: true,
    },
  }),

  focusManagement: () => ({
    errorFocusFlow: {
      ...errorMessageScenarios.packageNotFoundError(),
      expectFocusManagement: true,
    },
    buttonFocusFlow: {
      ...backButtonScenarios.primaryVariantBack(),
      expectFocusManagement: true,
    },
  }),
}

/**
 * Performance and edge case scenarios
 */
export const edgeCaseScenarios = {
  extremelyLongMessages: () => ({
    veryLongError: {
      title: 'A Very Long Error Title That Should Handle Text Wrapping Gracefully',
      message: 'This is an extremely long error message that should test how the component handles text wrapping, overflow, and maintains readability even when the content exceeds normal expectations. It includes multiple sentences and should demonstrate the component\'s ability to handle verbose error descriptions without breaking the layout or user experience.',
      onRetry: vi.fn(),
      isLoading: false,
      retryText: 'Try Again',
    },
  }),

  emptyOrNullValues: () => ({
    emptyMessage: {
      title: '',
      message: '',
      onRetry: vi.fn(),
      isLoading: false,
      retryText: '',
    },
  }),

  rapidInteractions: () => ({
    rapidRetryClicks: {
      ...errorMessageScenarios.networkConnectionError(),
      simulateRapidClicks: true,
    },
    rapidBackNavigation: {
      ...backButtonScenarios.backToDashboard(),
      simulateRapidClicks: true,
    },
  }),

  stateTransitions: () => ({
    loadingToError: {
      initial: loadingSpinnerScenarios.packageDetailsLoading(),
      transition: errorMessageScenarios.networkConnectionError(),
    },
    errorToLoading: {
      initial: errorMessageScenarios.apiRateLimitError(),
      transition: loadingSpinnerScenarios.packageDetailsLoading(),
    },
  }),
}