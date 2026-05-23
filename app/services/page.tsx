// Server Component — pre-fetches the consumer service list at request
// time via Next.js fetch with ISR (revalidate: 60s). Vercel caches the
// rendered HTML at the edge, so subsequent visitors get the page in
// <100ms even when Render's dyno is asleep.
//
// The interactive shell (filters, search, B2C/B2B toggle) lives in
// ServicesClient.tsx and is hydrated with this initial data.
//
// If the backend is genuinely down at request time we fall back to an
// empty list — the client component still renders, the user sees an
// "empty state" + can hit Retry which goes through the live API.

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ServicesClient from './ServicesClient'
import type { ServiceCardItem } from '../../components/ServiceCard'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://flipon-backend.onrender.com/api'

// Default Server Component cache window. 60s is short enough that
// admin-side service edits propagate quickly; long enough that the
// backend almost never gets a real cold-start hit because Vercel's
// edge buffers traffic.
export const revalidate = 60

const fetchServicesSSR = async (
  type: 'consumer' | 'industrial',
): Promise<ServiceCardItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/services?type=${type}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const body: any = await res.json().catch(() => null)
    if (Array.isArray(body)) return body as ServiceCardItem[]
    if (Array.isArray(body?.data)) return body.data as ServiceCardItem[]
    return []
  } catch (e) {
    console.error('[services SSR] fetch failed:', e)
    return []
  }
}

export default async function ServicesIndexPage() {
  const consumerServices = await fetchServicesSSR('consumer')
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ServicesClient
          initialServices={consumerServices}
          initialType="consumer"
        />
      </div>
      <Footer />
    </div>
  )
}
