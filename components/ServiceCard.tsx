import Link from 'next/link'

export interface ServiceCardItem {
  id: string | number
  name: string
  category?: string
  description?: string
  pricing_model?: 'quote' | 'fixed' | string
  pricing_unit?: string
  user_cost?: number | string
  price?: number | string
  indicative_price_from?: number | string
  expected_timeline?: string
  duration?: string
}

export interface ServiceCardProps {
  service: ServiceCardItem
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const formatPrice = (svc: ServiceCardItem): string => {
    if (svc.pricing_model === 'quote') {
      return svc.indicative_price_from
        ? `Starting at ₹${Number(svc.indicative_price_from).toLocaleString('en-IN')}`
        : 'Quote based'
    }
    if (svc.user_cost === 0) return 'Free'
    if (svc.user_cost) return `₹${Number(svc.user_cost).toLocaleString('en-IN')}`
    if (svc.price === 'Free') return 'Free'
    return svc.price ? `₹${svc.price}` : 'On request'
  }

  const formatDuration = (svc: ServiceCardItem): string => {
    if (svc.pricing_unit === 'per_filing') return 'Per filing'
    if (svc.pricing_unit === 'per_employee') return 'Per employee'
    if (svc.pricing_unit === 'per_visit') return 'Per visit'
    if (svc.pricing_unit === 'per_report') return 'Per report'
    return svc.expected_timeline || svc.duration || 'Standard timeline'
  }

  const isQuote = service.pricing_model === 'quote'

  return (
    <div className="card group relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Subtle accent stripe at the top in the brand colour */}
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-prussian-blue via-accent-blue to-accent-yellow opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />

      <div className="flex justify-between items-start gap-3 mb-4">
        <h3 className="text-lg font-semibold text-prussian-blue group-hover:text-accent-blue transition-colors">
          {service.name}
        </h3>
        <span className="text-accent-yellow font-bold text-sm whitespace-nowrap">
          {formatPrice(service)}
        </span>
      </div>

      <div className="flex items-center text-gray-600 mb-2">
        <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">{formatDuration(service)}</span>
      </div>

      <div className="flex items-center text-gray-600 mb-4">
        <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <span className="text-sm">{service.category}</span>
      </div>

      {service.description && (
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {service.description}
        </p>
      )}

      <div className="flex gap-2.5">
        <Link
          href={`/services/${service.id}`}
          prefetch={false}
          // Inline backgroundColor to match the customer app's brand
          // Prussian blue (#0D3B66) — the website's tailwind token
          // `prussian-blue` is the darker #003153 which other elements
          // depend on. Hover still uses the existing accent-blue.
          style={{ backgroundColor: '#0D3B66' }}
          className="flex-1 inline-flex items-center justify-center text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1"
        >
          View details
        </Link>
        {isQuote ? (
          <Link
            href={`/enquiry/${service.id}`}
            prefetch={false}
            className="flex-1 inline-flex items-center justify-center bg-accent-blue text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1"
          >
            Get quote
          </Link>
        ) : (
          <Link
            href={`/book/${service.id}`}
            prefetch={false}
            className="flex-1 inline-flex items-center justify-center bg-accent-yellow text-prussian-blue px-4 py-2.5 rounded-lg font-bold hover:bg-yellow-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-offset-1 shadow-sm hover:shadow-md"
          >
            Book now
          </Link>
        )}
      </div>
    </div>
  )
}
