/**
 * Shared handler types for component interfaces
 * Extracted from component-specific interfaces when used by 2+ components
 */

/** Generic selection handler pattern */
export type SelectionHandler<T> = (item: T) => void

/** Navigation handler pattern */
export type NavigationHandler = () => void

/** Generic click handler with optional data */
export type ClickHandler<T = void> = T extends void ? () => void : (data: T) => void

/** Retry handler pattern for error boundaries */
export type RetryHandler = () => void | Promise<void>