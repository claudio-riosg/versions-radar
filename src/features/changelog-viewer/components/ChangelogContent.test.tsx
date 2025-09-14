/**
 * ChangelogContent Component Tests - Co-located with ChangelogContent.tsx
 * 
 * Following TDD with comprehensive markdown rendering and styling testing.
 * Tests ReactMarkdown integration, custom components, and content formatting.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChangelogContent } from './ChangelogContent'
import { 
  changelogViewerCollections,
  changelogEdgeCases 
} from '../test-utils/changelogViewerMocks'

// Mock ReactMarkdown to test our component integration
vi.mock('react-markdown', () => ({
  __esModule: true,
  default: vi.fn(({ children, components, remarkPlugins }) => {
    // Mock that demonstrates our components configuration
    const mockElements = {
      h1: components?.h1 ? components.h1({ children: 'Mock H1' }) : <h1>Mock H1</h1>,
      h2: components?.h2 ? components.h2({ children: 'Mock H2' }) : <h2>Mock H2</h2>,
      h3: components?.h3 ? components.h3({ children: 'Mock H3' }) : <h3>Mock H3</h3>,
      p: components?.p ? components.p({ children: 'Mock paragraph' }) : <p>Mock paragraph</p>,
      code: components?.code ? components.code({ children: 'mock code' }) : <code>mock code</code>,
      blockCode: components?.code ? components.code({ children: 'mock block code', className: 'language-javascript' }) : <code>mock block code</code>,
      ul: components?.ul ? components.ul({ children: <li>Mock list</li> }) : <ul><li>Mock list</li></ul>,
      ol: components?.ol ? components.ol({ children: <li>Mock ordered</li> }) : <ol><li>Mock ordered</li></ol>,
      li: components?.li ? components.li({ children: 'Mock item' }) : <li>Mock item</li>,
      blockquote: components?.blockquote ? components.blockquote({ children: 'Mock quote' }) : <blockquote>Mock quote</blockquote>,
      a: components?.a ? components.a({ href: 'https://example.com', children: 'Mock link' }) : <a href="https://example.com">Mock link</a>,
    }

    return (
      <div data-testid="react-markdown">
        <span data-testid="markdown-content">{children}</span>
        <span data-testid="remark-plugins">{remarkPlugins?.[0]?.name || 'no-plugins'}</span>
        <div data-testid="custom-components">
          {Object.values(mockElements)}
        </div>
      </div>
    )
  }),
}))

// Mock remark-gfm plugin
vi.mock('remark-gfm', () => ({
  __esModule: true,
  default: { name: 'remark-gfm' },
}))

describe('ChangelogContent Presentational Component', () => {
  // Helper function to check content contains key sections
  const expectContentContains = (element: HTMLElement, ...patterns: (string | RegExp)[]) => {
    patterns.forEach(pattern => {
      if (typeof pattern === 'string') {
        expect(element).toHaveTextContent(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      } else {
        expect(element).toHaveTextContent(pattern)
      }
    })
  }

  describe('Markdown Integration', () => {
    it('should render ReactMarkdown with changelog content', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
      // Use partial content matching instead of exact text with line breaks
      expect(screen.getByTestId('markdown-content')).toHaveTextContent(/React 18\.2\.0/)
      expect(screen.getByTestId('markdown-content')).toHaveTextContent(/Performance Improvements/)
      expect(screen.getByTestId('markdown-content')).toHaveTextContent(/Bug Fixes/)
    })

    it('should include remark-gfm plugin for GitHub Flavored Markdown', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      expect(screen.getByTestId('remark-plugins')).toHaveTextContent('remark-gfm')
    })

    it('should render different markdown content correctly', () => {
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<ChangelogContent changelog={changelog} />)

      const contentElement = screen.getByTestId('markdown-content')
      expectContentContains(contentElement, 'React 19.0.0-beta.1', 'New Features', 'Known Issues', 'Installation')
    })

    it('should handle minimal markdown content', () => {
      const changelog = changelogViewerCollections.minimalChangelogContent()

      render(<ChangelogContent changelog={changelog} />)

      const contentElement = screen.getByTestId('markdown-content')
      expectContentContains(contentElement, 'TypeScript 4.8.0', 'Bug fixes and performance improvements')
    })
  })

  describe('Custom Component Styling', () => {
    it('should apply proper heading styling to h1 elements', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const h1Element = customComponents.querySelector('h1')
      
      expect(h1Element).toHaveClass('text-2xl', 'font-bold', 'mb-4', 'text-radar-dark', 'border-b', 'border-gray-200', 'pb-2')
      expect(h1Element).toHaveTextContent('Mock H1')
    })

    it('should apply proper heading styling to h2 elements', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const h2Element = customComponents.querySelector('h2')
      
      expect(h2Element).toHaveClass('text-xl', 'font-semibold', 'mb-3', 'text-radar-dark', 'mt-6')
      expect(h2Element).toHaveTextContent('Mock H2')
    })

    it('should apply proper heading styling to h3 elements', () => {
      const changelog = changelogViewerCollections.patchReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const h3Element = customComponents.querySelector('h3')
      
      expect(h3Element).toHaveClass('text-lg', 'font-medium', 'mb-2', 'text-radar-dark', 'mt-4')
      expect(h3Element).toHaveTextContent('Mock H3')
    })

    it('should style paragraph elements correctly', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const pElement = customComponents.querySelector('p')
      
      expect(pElement).toHaveClass('mb-4', 'text-gray-700', 'leading-relaxed')
      expect(pElement).toHaveTextContent('Mock paragraph')
    })
  })

  describe('Code Block and Inline Code Styling', () => {
    it('should style inline code elements correctly', () => {
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const inlineCodeElements = customComponents.querySelectorAll('code')
      const inlineCode = Array.from(inlineCodeElements).find(el => !el.className.includes('block'))
      
      expect(inlineCode).toHaveClass('bg-gray-100', 'px-1', 'py-0.5', 'rounded', 'text-sm', 'font-mono', 'text-radar-dark')
    })

    it('should style block code elements correctly', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const blockCodeElements = customComponents.querySelectorAll('code')
      const blockCode = Array.from(blockCodeElements).find(el => el.className.includes('block'))
      
      expect(blockCode).toHaveClass('block', 'bg-gray-100', 'p-4', 'rounded-lg', 'overflow-x-auto', 'text-sm', 'font-mono', 'text-radar-dark')
    })

    it('should distinguish between inline and block code', () => {
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const codeElements = customComponents.querySelectorAll('code')
      
      // Should have both inline and block code elements
      expect(codeElements).toHaveLength(2)
      
      const hasInlineCode = Array.from(codeElements).some(el => !el.className.includes('block'))
      const hasBlockCode = Array.from(codeElements).some(el => el.className.includes('block'))
      
      expect(hasInlineCode).toBe(true)
      expect(hasBlockCode).toBe(true)
    })
  })

  describe('List and Quote Styling', () => {
    it('should style unordered lists correctly', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const ulElement = customComponents.querySelector('ul')
      
      expect(ulElement).toHaveClass('list-disc', 'list-inside', 'space-y-1', 'mb-4', 'text-gray-700')
    })

    it('should style ordered lists correctly', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const olElement = customComponents.querySelector('ol')
      
      expect(olElement).toHaveClass('list-decimal', 'list-inside', 'space-y-1', 'mb-4', 'text-gray-700')
    })

    it('should style list items correctly', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const liElements = customComponents.querySelectorAll('li')
      
      // Find the li element that was created by our custom component
      const mockListItem = Array.from(liElements).find(el => el.textContent === 'Mock item')
      expect(mockListItem).toHaveClass('text-gray-700')
      expect(mockListItem).toHaveTextContent('Mock item')
    })

    it('should style blockquotes correctly', () => {
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const blockquoteElement = customComponents.querySelector('blockquote')
      
      expect(blockquoteElement).toHaveClass('border-l-4', 'border-radar-blue', 'pl-4', 'italic', 'text-gray-600', 'mb-4')
      expect(blockquoteElement).toHaveTextContent('Mock quote')
    })
  })

  describe('Link Styling and Behavior', () => {
    it('should style links correctly', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const linkElement = customComponents.querySelector('a')
      
      expect(linkElement).toHaveClass('text-radar-blue', 'hover:underline')
      expect(linkElement).toHaveAttribute('href', 'https://example.com')
      expect(linkElement).toHaveTextContent('Mock link')
    })

    it('should open links in new tab with security attributes', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const linkElement = customComponents.querySelector('a')
      
      expect(linkElement).toHaveAttribute('target', '_blank')
      expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should handle different link URLs', () => {
      const changelog = changelogViewerCollections.patchReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const linkElement = customComponents.querySelector('a')
      
      expect(linkElement).toHaveAttribute('href', 'https://example.com')
    })
  })

  describe('Container and Layout Styling', () => {
    it('should have proper container styling', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      const { container } = render(<ChangelogContent changelog={changelog} />)

      const outerContainer = container.querySelector('.max-w-none')
      expect(outerContainer).toBeInTheDocument()
    })

    it('should apply prose styling for typography', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      const { container } = render(<ChangelogContent changelog={changelog} />)

      const proseContainer = container.querySelector('.prose.prose-gray.max-w-none')
      expect(proseContainer).toBeInTheDocument()
    })

    it('should maintain consistent layout structure', () => {
      const changelog = changelogViewerCollections.prereleaseChangelogBeta()

      const { container } = render(<ChangelogContent changelog={changelog} />)

      expect(container.firstChild).toHaveClass('max-w-none')
      expect(container.querySelector('.prose')).toBeInTheDocument()
      expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Special Content', () => {
    it('should handle very long changelog content', () => {
      const scenario = changelogEdgeCases.veryLongChangelog()

      render(<ChangelogContent changelog={scenario.changelog!} />)

      expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
      const contentElement = screen.getByTestId('markdown-content')
      expectContentContains(contentElement, 'Section', 'Lorem ipsum')
    })

    it('should handle empty changelog content', () => {
      const scenario = changelogEdgeCases.emptyChangelogContent()

      render(<ChangelogContent changelog={scenario.changelog!} />)

      expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
      expect(screen.getByTestId('markdown-content')).toHaveTextContent('')
    })

    it('should handle special characters in content', () => {
      const scenario = changelogEdgeCases.specialCharactersInContent()

      render(<ChangelogContent changelog={scenario.changelog!} />)

      const contentElement = screen.getByTestId('markdown-content')
      expectContentContains(contentElement, 'Release 🚀', 'émojis 🎉', 'Component', 'GitHub')
    })

    it('should preserve markdown formatting structure', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      // Verify that our custom components are being used
      const customComponents = screen.getByTestId('custom-components')
      expect(customComponents.querySelector('h1')).toBeInTheDocument()
      expect(customComponents.querySelector('h2')).toBeInTheDocument()
      expect(customComponents.querySelector('h3')).toBeInTheDocument()
      expect(customComponents.querySelector('p')).toBeInTheDocument()
      expect(customComponents.querySelector('ul')).toBeInTheDocument()
      expect(customComponents.querySelector('ol')).toBeInTheDocument()
      expect(customComponents.querySelector('blockquote')).toBeInTheDocument()
      expect(customComponents.querySelector('a')).toBeInTheDocument()
      expect(customComponents.querySelectorAll('code')).toHaveLength(2) // inline and block
    })
  })

  describe('Accessibility and Semantic HTML', () => {
    it('should maintain semantic heading hierarchy', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      
      expect(customComponents.querySelector('h1')).toBeInTheDocument()
      expect(customComponents.querySelector('h2')).toBeInTheDocument()
      expect(customComponents.querySelector('h3')).toBeInTheDocument()
    })

    it('should provide accessible link attributes', () => {
      const changelog = changelogViewerCollections.richMarkdownChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const linkElement = screen.getByRole('link')
      
      expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer')
      expect(linkElement).toHaveAttribute('target', '_blank')
    })

    it('should maintain list structure for screen readers', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const customComponents = screen.getByTestId('custom-components')
      const ulElement = customComponents.querySelector('ul')
      const olElement = customComponents.querySelector('ol')
      const liElement = customComponents.querySelector('li')
      
      expect(ulElement).toBeInTheDocument()
      expect(olElement).toBeInTheDocument()
      expect(liElement).toBeInTheDocument()
    })
  })

  describe('Component Props and Interface', () => {
    it('should accept and render changelog prop correctly', () => {
      const changelog = changelogViewerCollections.patchReleaseChangelog()

      render(<ChangelogContent changelog={changelog} />)

      const contentElement = screen.getByTestId('markdown-content')
      expectContentContains(contentElement, 'React 18.1.1', 'Security Updates', 'Bug Fixes')
    })

    it('should handle different changelog structures', () => {
      const scenarios = [
        { changelog: changelogViewerCollections.majorReleaseChangelog(), key: 'React 18.2.0' },
        { changelog: changelogViewerCollections.prereleaseChangelogBeta(), key: 'React 19.0.0-beta.1' },
        { changelog: changelogViewerCollections.patchReleaseChangelog(), key: 'React 18.1.1' },
        { changelog: changelogViewerCollections.minimalChangelogContent(), key: 'TypeScript 4.8.0' },
        { changelog: changelogViewerCollections.richMarkdownChangelog(), key: 'Angular 15.0.0' },
      ]

      scenarios.forEach(({ changelog, key }) => {
        const { unmount } = render(<ChangelogContent changelog={changelog} />)
        
        expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
        const contentElement = screen.getByTestId('markdown-content')
        expectContentContains(contentElement, key)
        
        unmount()
      })
    })

    it('should be pure and not cause side effects', () => {
      const changelog = changelogViewerCollections.majorReleaseChangelog()

      const { rerender } = render(<ChangelogContent changelog={changelog} />)
      
      const contentElement = screen.getByTestId('markdown-content')
      expectContentContains(contentElement, 'React 18.2.0', 'Performance Improvements')
      
      // Rerender with same props should produce same result
      rerender(<ChangelogContent changelog={changelog} />)
      
      const rerenderedContentElement = screen.getByTestId('markdown-content')
      expectContentContains(rerenderedContentElement, 'React 18.2.0', 'Performance Improvements')
    })
  })
})