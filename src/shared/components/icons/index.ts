/**
 * Icon system exports
 * Centralized export for all icon-related components and utilities
 */

export { Icon, TechIcon, UIIcon, LoadingIcon } from './Icon'
export { SpriteLoader, InlineSpriteLoader } from './SpriteLoader'
export { IconShowcase } from './IconShowcase'
export type { IconProps } from '@infrastructure/config/iconConfig'
export {
  type IconName,
  type IconSize,
  type IconVariant,
  type TechnologyIconName,
  type UIIconName,
  ICONS,
  TECHNOLOGY_ICONS,
  UI_ICONS,
  ICON_SIZES,
  getPackageIcon,
  isValidIconName,
  getIconPixelSize,
} from '@infrastructure/config/iconConfig'