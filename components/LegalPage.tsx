import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export interface LegalPageProps {
  title: string
  subtitle?: string
  lastUpdated?: string
  children: ReactNode
}

// Shared chrome for any "static text" page — Privacy, Terms, Refund, Help,
// Grievance, etc. Keeps each page file tiny and consistent.
export default function LegalPage({ title, subtitle, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-prussian-blue text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
            {subtitle && <p className="text-blue-100 mt-2 text-base">{subtitle}</p>}
            {lastUpdated && (
              <p className="text-blue-300 text-xs mt-3">Last updated · {lastUpdated}</p>
            )}
          </div>
        </div>
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 prose prose-sm sm:prose-base prose-headings:text-prussian-blue prose-a:text-accent-blue">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  )
}
