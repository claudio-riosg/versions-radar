/**
 * High-performance SVG Icon component with accessibility support
 * Following Container/Presentational pattern and React 19 best practices
 */

import { memo, forwardRef } from 'react'
import type { IconProps } from '@infrastructure/config/iconConfig'
import {
  generateIconClasses,
  getSpriteUrl,
  validateIconProps,
  generateAccessibilityAttributes,
  getIconDimensions,
} from '@shared/services/iconService'

/**
 * Core Icon component for SVG sprite consumption
 *
 * Features:
 * - Performance optimized with React.memo
 * - Full TypeScript support with strict typing
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Tailwind CSS v4 integration
 * - Development-time validation
 * - Ref forwarding for advanced use cases
 */
export const Icon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    (
      {
        name,
        size = 'md',
        variant = 'default',
        className,
        accessibility = {},
        'aria-hidden': ariaHidden,
        'data-testid': dataTestId,
        ...restProps
      },
      ref
    ) => {
      // Development-time validation (removed in production builds)
      if (process.env.NODE_ENV === 'development') {
        validateIconProps(name, size)
      }

      const { title, description, decorative = true } = accessibility

      // Generate optimized classes
      const iconClasses = generateIconClasses(size, variant, className)
      const spriteUrl = getSpriteUrl(name)
      const dimensions = getIconDimensions(size)

      // Generate accessibility attributes
      const accessibilityAttrs = generateAccessibilityAttributes(title, description, decorative)

      // Merge aria-hidden prop (explicit prop takes precedence)
      const finalAriaHidden = ariaHidden !== undefined ? ariaHidden : accessibilityAttrs['aria-hidden']

      return (
        <svg
          ref={ref}
          className={iconClasses}
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 24 24"
          fill="currentColor"
          role={decorative ? 'presentation' : 'img'}
          aria-hidden={finalAriaHidden}
          aria-label={accessibilityAttrs['aria-label'] as string}
          aria-describedby={accessibilityAttrs['aria-describedby'] as string}
          data-testid={dataTestId || `icon-${name}`}
          {...restProps}
        >
          {title && <title>{title}</title>}
          {description && (
            <desc id={accessibilityAttrs['aria-describedby'] as string}>
              {description}
            </desc>
          )}
          <use href={spriteUrl} />
        </svg>
      )
    }
  )
)

Icon.displayName = 'Icon'

/**
 * Technology-specific icon component for package representations
 * Pre-configured with appropriate defaults for technology logos
 */
export const TechIcon = memo<
  Omit<IconProps, 'variant'> & { variant?: 'default' | 'muted' }
>(({ size = 'lg', variant = 'default', accessibility = {}, ...props }) => {
  const defaultAccessibility = {
    decorative: false,
    title: accessibility.title || `${props.name} logo`,
    ...accessibility,
  }

  return (
    <Icon
      {...props}
      size={size}
      variant={variant}
      accessibility={defaultAccessibility}
    />
  )
})

TechIcon.displayName = 'TechIcon'

/**
 * UI action icon component for interface elements
 * Pre-configured with appropriate defaults for UI interactions
 */
export const UIIcon = memo<
  Omit<IconProps, 'variant'> & { variant?: IconProps['variant'] }
>(({ size = 'sm', variant = 'default', accessibility = {}, ...props }) => {
  const defaultAccessibility = {
    decorative: true,
    ...accessibility,
  }

  return (
    <Icon
      {...props}
      size={size}
      variant={variant}
      accessibility={defaultAccessibility}
    />
  )
})

UIIcon.displayName = 'UIIcon'

/**
 * Loading icon component with built-in animation
 * Specialized for loading states with consistent styling
 */
export const LoadingIcon = memo<
  Pick<IconProps, 'size' | 'className' | 'data-testid'>
>(({ size = 'md', className, ...props }) => {
  return (
    <Icon
      name="loading"
      size={size}
      variant="muted"
      className={`animate-spin ${className || ''}`}
      accessibility={{
        decorative: false,
        title: 'Loading',
        description: 'Content is loading, please wait',
      }}
      {...props}
    />
  )
})

LoadingIcon.displayName = 'LoadingIcon'