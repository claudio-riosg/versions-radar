import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChangelogInfo } from '@infrastructure/api/types'

interface ChangelogContentProps {
  changelog: ChangelogInfo
}

/**
 * Component for rendering markdown changelog content
 */
export const ChangelogContent = ({ changelog }: ChangelogContentProps) => {
  return (
    <div className="max-w-none">
      <div className="prose prose-gray max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-radar-dark border-b border-gray-200 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-radar-dark mt-6">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-radar-dark mt-4">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">{children}</ol>
            ),
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
            p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
            code: ({ children, className }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-radar-dark">
                    {children}
                  </code>
                )
              }
              return (
                <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono text-radar-dark">
                  {children}
                </code>
              )
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-radar-blue pl-4 italic text-gray-600 mb-4">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-radar-blue hover:underline"
              >
                {children}
              </a>
            ),
          }}
        >
          {changelog.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
