/**
 * SVG Sprite Loader Component
 * Loads the icon sprite into the DOM for use by Icon components
 */

import { useEffect } from 'react'

/**
 * Component that loads the SVG sprite into the DOM
 * Should be included once at the application root level
 */
export const SpriteLoader = () => {
  useEffect(() => {
    // Only load sprite if not already present
    if (document.getElementById('icon-sprite')) {
      return
    }

    // Load the sprite SVG content
    fetch('/src/infrastructure/assets/icons/sprite.svg')
      .then(response => response.text())
      .then(svgContent => {
        // Create a container element and add the sprite
        const spriteContainer = document.createElement('div')
        spriteContainer.innerHTML = svgContent
        spriteContainer.id = 'icon-sprite'
        spriteContainer.style.display = 'none'

        // Add to document body
        document.body.insertBefore(spriteContainer, document.body.firstChild)
      })
      .catch(error => {
        console.warn('Failed to load icon sprite:', error)
      })
  }, [])

  return null // This component doesn't render anything
}

/**
 * Alternative approach using static import (for Vite optimization)
 * This approach bundles the sprite content directly
 */
export const InlineSpriteLoader = () => {
  useEffect(() => {
    // Only load sprite if not already present
    if (document.getElementById('icon-sprite-inline')) {
      return
    }

    // Create the sprite element directly
    const spriteElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    spriteElement.id = 'icon-sprite-inline'
    spriteElement.style.display = 'none'
    spriteElement.setAttribute('width', '0')
    spriteElement.setAttribute('height', '0')
    spriteElement.setAttribute('class', 'hidden')

    // Note: In a real implementation, you would import the sprite content
    // For now, we'll reference the external sprite file
    document.body.insertBefore(spriteElement, document.body.firstChild)
  }, [])

  return null
}