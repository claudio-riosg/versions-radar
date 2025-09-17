/**
 * Icon System Exports
 * Centralized export following proper architectural separation
 */

// Components (shared because used by multiple features)
export { Icon, TechIcon, UIIcon, LoadingIcon } from './Icon'
export { SpriteLoader, InlineSpriteLoader } from './SpriteLoader'
export { IconShowcase } from './IconShowcase'

// Infrastructure types and technical configuration
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
  isValidIconName,
  getIconPixelSize,
} from '@infrastructure/config/iconConfig'

// Business logic (shared because used by multiple features)
export {
  PACKAGE_ICON_MAP,
  getPackageIcon,
  hasPackageIcon,
  getPackagesWithIcons,
} from '@shared/config/packageIcons'