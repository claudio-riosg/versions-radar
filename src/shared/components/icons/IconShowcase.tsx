/**
 * Icon Showcase Component - Development tool for testing icon system
 * This component is useful for development and design review
 */

import { Icon, TechIcon, UIIcon, LoadingIcon } from './Icon'
import { TECHNOLOGY_ICONS, UI_ICONS, ICON_SIZES } from '@infrastructure/config/iconConfig'
import type { IconVariant, IconSize } from '@infrastructure/config/iconConfig'

/**
 * Development component to showcase all available icons
 * Useful for design review and integration testing
 */
export const IconShowcase = () => {
  const variants: IconVariant[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'muted']
  const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">Icon System Showcase</h1>
        <p className="text-gray-600 mb-8">
          Complete overview of the SVG sprite icon system with all variants, sizes, and components.
        </p>
      </div>

      {/* Technology Icons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Technology Icons</h2>
        <p className="text-gray-600 mb-6">
          Icons representing different technologies and frameworks
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.keys(TECHNOLOGY_ICONS).map((iconName) => (
            <div key={iconName} className="text-center p-4 border rounded-lg">
              <TechIcon
                name={iconName as keyof typeof TECHNOLOGY_ICONS}
                size="xl"
                className="mb-2"
              />
              <p className="text-sm font-mono text-gray-600">{iconName}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UI Icons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">UI Icons</h2>
        <p className="text-gray-600 mb-6">
          Icons for user interface elements and actions
        </p>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {Object.keys(UI_ICONS).map((iconName) => (
            <div key={iconName} className="text-center p-3 border rounded-lg">
              <UIIcon
                name={iconName as keyof typeof UI_ICONS}
                size="lg"
                className="mb-2"
                accessibility={{ decorative: false, title: iconName }}
              />
              <p className="text-xs font-mono text-gray-600">{iconName}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Size Variations */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Size Variations</h2>
        <p className="text-gray-600 mb-6">
          All available icon sizes using the React icon
        </p>
        <div className="flex items-end gap-4 p-6 border rounded-lg">
          {sizes.map((size) => (
            <div key={size} className="text-center">
              <TechIcon name="react" size={size} className="mb-2" />
              <p className="text-xs font-mono text-gray-600">{size}</p>
              <p className="text-xs text-gray-500">{ICON_SIZES[size]}px</p>
            </div>
          ))}
        </div>
      </section>

      {/* Color Variants */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Color Variants</h2>
        <p className="text-gray-600 mb-6">
          All available color variants using the TypeScript icon
        </p>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {variants.map((variant) => (
            <div key={variant} className="text-center p-4 border rounded-lg">
              <Icon
                name="typescript"
                size="xl"
                variant={variant}
                className="mb-2"
                accessibility={{ decorative: false, title: `TypeScript ${variant}` }}
              />
              <p className="text-sm font-mono text-gray-600">{variant}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialized Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Specialized Components</h2>
        <p className="text-gray-600 mb-6">
          Pre-configured icon components for common use cases
        </p>

        <div className="space-y-6">
          {/* Tech Icons */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">TechIcon Component</h3>
            <p className="text-gray-600 mb-4">Pre-configured for technology logos with semantic accessibility</p>
            <div className="flex gap-6">
              <TechIcon name="react" />
              <TechIcon name="angular" />
              <TechIcon name="typescript" />
            </div>
          </div>

          {/* UI Icons */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">UIIcon Component</h3>
            <p className="text-gray-600 mb-4">Pre-configured for UI elements (decorative by default)</p>
            <div className="flex gap-4">
              <UIIcon name="search" />
              <UIIcon name="filter" />
              <UIIcon name="refresh" />
              <UIIcon name="close" />
            </div>
          </div>

          {/* Loading Icon */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">LoadingIcon Component</h3>
            <p className="text-gray-600 mb-4">Animated loading icon with built-in accessibility</p>
            <div className="flex gap-6 items-center">
              <LoadingIcon size="sm" />
              <LoadingIcon size="md" />
              <LoadingIcon size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Interactive Examples</h2>
        <p className="text-gray-600 mb-6">
          Icons with hover effects and interactions
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <UIIcon name="refresh" size="lg" className="mb-2" />
            <p className="text-sm">Refresh Data</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <UIIcon name="search" size="lg" className="mb-2" />
            <p className="text-sm">Search</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <UIIcon name="filter" size="lg" className="mb-2" />
            <p className="text-sm">Filter</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <UIIcon name="external" size="lg" className="mb-2" />
            <p className="text-sm">External Link</p>
          </button>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
        <p className="text-gray-600 mb-6">
          Real-world usage patterns and combinations
        </p>

        <div className="space-y-4">
          {/* Package Card Example */}
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <TechIcon name="react" size="2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">React</h3>
              <p className="text-sm text-gray-600 mb-4">A JavaScript library for building user interfaces</p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Latest Version</p>
                <p className="text-2xl font-mono font-bold text-blue-600">19.1.1</p>
              </div>
            </div>
          </div>

          {/* Navigation Example */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
              <UIIcon name="chevronLeft" size="sm" />
              <span>Previous</span>
            </button>
            <span className="flex-1 text-center text-gray-600">Page Navigation</span>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
              <span>Next</span>
              <UIIcon name="chevronRight" size="sm" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}