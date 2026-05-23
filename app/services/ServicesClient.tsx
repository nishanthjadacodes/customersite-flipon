'use client'

// Interactive shell for the Services page. The Server Component
// (page.tsx) pre-fetches the service list at request time using ISR,
// hands it down as `initialServices`. We render those instantly — no
// loading spinner, no client-side fetch on first paint.
//
// The Consumer/Industrial toggle does call back to the API on switch,
// but that swap is cached client-side (SWR pattern) so the second
// flick is also instant.

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ServiceCard, { type ServiceCardItem } from '../../components/ServiceCard'
import { servicesAPI } from '../../utils/api'
import { swrFetch } from '../../utils/swrCache'

type ServiceType = 'consumer' | 'industrial'

interface Props {
  initialServices: ServiceCardItem[]
  initialType: ServiceType
}

export default function ServicesClient({ initialServices, initialType }: Props) {
  const params = useSearchParams()
  // ?type=industrial in the URL still wins over the SSR-passed default
  // so deep links from the homepage's B2B card land on the right list.
  const urlType: ServiceType =
    params?.get('type') === 'industrial' ? 'industrial' : 'consumer'
  const startType = urlType || initialType

  const [serviceType, setServiceType] = useState<ServiceType>(startType)
  // Seed from server-fetched data → renders instantly on first paint.
  const [services, setServices] = useState<ServiceCardItem[]>(
    startType === initialType ? initialServices : [],
  )
  const [loading, setLoading] = useState<boolean>(
    startType === initialType ? false : true,
  )
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  useEffect(() => {
    fetchServices(serviceType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType])

  const fetchServices = (type: ServiceType): void => {
    setError(null)
    const result = swrFetch<ServiceCardItem[]>(
      `services:${type}`,
      async () => {
        const response = await servicesAPI.getAllServices(type)
        const respData: any = (response as any).data
        return Array.isArray(respData?.data)
          ? respData.data
          : Array.isArray(respData)
            ? respData
            : []
      },
      {
        onFresh: (fresh) => {
          setServices(fresh)
          setLoading(false)
        },
        onError: (e: any) => {
          console.error('services fetch error:', e?.message || e)
          if (services.length === 0) setError('Could not load services. Please try again.')
          setLoading(false)
        },
      },
    )
    if (result.cached !== null) {
      setServices(result.cached)
      setLoading(false)
    } else if (services.length === 0) {
      // Only show spinner when we have absolutely nothing (cache miss
      // AND no SSR data for this type).
      setLoading(true)
    }
  }

  const categories = useMemo<string[]>(() => {
    const set = new Set<string>()
    services.forEach((s) => {
      if (s.category) set.add(String(s.category))
    })
    return ['All', ...Array.from(set)]
  }, [services])

  const filtered = useMemo<ServiceCardItem[]>(() => {
    const q = search.trim().toLowerCase()
    return services.filter((s) => {
      if (activeCategory !== 'All' && s.category !== activeCategory) return false
      if (!q) return true
      return (
        (s.name || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      )
    })
  }, [services, search, activeCategory])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-prussian-blue mb-2">
          Our Services
        </h1>
        <p className="text-gray-600 text-lg">
          Pick a service — book online, get it delivered to your door, or have
          our operators handle it end-to-end.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 self-start">
          <button
            onClick={() => setServiceType('consumer')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
              serviceType === 'consumer'
                ? 'bg-prussian-blue text-white'
                : 'text-gray-600 hover:text-prussian-blue'
            }`}
          >
            Consumer (B2C)
          </button>
          <button
            onClick={() => setServiceType('industrial')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
              serviceType === 'industrial'
                ? 'bg-prussian-blue text-white'
                : 'text-gray-600 hover:text-prussian-blue'
            }`}
          >
            Industrial (B2B)
          </button>
        </div>

        <div className="relative sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === c
                  ? 'bg-prussian-blue text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-prussian-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-prussian-blue font-semibold text-lg">Loading services…</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={() => fetchServices(serviceType)} className="btn-primary">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No services match your filters</h3>
          <p className="text-gray-600">Try a different category or clear the search box.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      )}
    </>
  )
}
