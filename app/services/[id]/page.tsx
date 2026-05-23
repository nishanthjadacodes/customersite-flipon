'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { servicesAPI } from '../../../utils/api'
import { swrFetch } from '../../../utils/swrCache'

interface ServiceDetail {
  id: string | number
  name: string
  category?: string
  description?: string
  pricing_model?: 'quote' | 'fixed' | string
  pricing_unit?: string
  user_cost?: number
  indicative_price_from?: number | string
  expected_timeline?: string
  required_documents?: Array<string | { type?: string; label?: string }>
}

interface PageProps {
  params: { id: string }
}

export default function ServiceDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Stale-while-revalidate fetch — cached service detail renders
  // INSTANTLY if the user has visited this service before, then a
  // background fetch refreshes it. First-ever visit still shows the
  // spinner but every return visit is a no-cold-start render.
  const fetchService = useCallback((): void => {
    setErrorMessage(null)

    const result = swrFetch<ServiceDetail | null>(
      `service:${params.id}`,
      async () => {
        const response = await servicesAPI.getServiceById(params.id)
        const respData: any = (response as any).data
        const svc =
          respData?.success && respData?.data
            ? respData.data
            : respData?.data && !('success' in respData)
            ? respData.data
            : respData && (respData.id || respData.name)
            ? respData
            : null
        return svc as ServiceDetail | null
      },
      {
        onFresh: (svc) => {
          if (svc) setService(svc)
          else setErrorMessage('Service not found.')
          setLoading(false)
        },
        onError: (error: any) => {
          console.error('Error fetching service:', error)
          // Only show error if there was no cached version to fall back on.
          setLoading(false)
          if (!service) {
            setErrorMessage(
              error?.code === 'ECONNABORTED'
                ? 'The server is taking longer than expected. Try again in a moment.'
                : error?.response?.data?.message ||
                  'Could not load this service. Please try again.',
            )
          }
        },
      },
    )

    if (result.cached) {
      setService(result.cached)
      setLoading(false)
    } else {
      setLoading(true)
    }
    // `service` is intentionally omitted from deps to keep the callback
    // identity stable and avoid refetching on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  useEffect(() => {
    fetchService()
  }, [fetchService])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-prussian-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-prussian-blue font-semibold text-lg">Loading service details…</p>
            <p className="text-gray-500 text-sm mt-2">
              First load may take 30-60 seconds while the server wakes up.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-700">
              {errorMessage ? 'Could not load service' : 'Service not found'}
            </h1>
            {errorMessage && (
              <p className="mt-3 text-sm text-gray-500">{errorMessage}</p>
            )}
            <div className="mt-5 flex items-center justify-center gap-3">
              <button onClick={fetchService} className="btn-primary">
                Try again
              </button>
              <button
                onClick={() => router.push('/services')}
                className="btn-secondary"
              >
                Back to services
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const formatPrice = (): string => {
    if (service.pricing_model === 'quote') {
      return service.indicative_price_from
        ? `Starting at Rs ${service.indicative_price_from}`
        : 'Quote Based'
    }
    return service.user_cost === 0 ? 'Free' : `Rs ${service.user_cost}`
  }

  const formatDuration = (): string => {
    if (service.pricing_unit === 'per_filing') return 'Per Filing'
    if (service.pricing_unit === 'per_employee') return 'Per Employee'
    if (service.pricing_unit === 'per_visit') return 'Per Visit'
    if (service.pricing_unit === 'per_report') return 'Per Report'
    return service.expected_timeline || '30 min'
  }

  const requirements = service.required_documents || []
  const process = service.description
    ? service.description
        .split('.')
        .filter((step) => step.trim())
        .map((step) => step.trim())
    : ['Document verification', 'Processing', 'Approval', 'Completion']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-prussian-blue mb-2">{service.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {service.category}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDuration()}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-prussian-blue mb-4">Service Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {service.description ||
                    'Get this service processed quickly and efficiently with our expert assistance.'}
                </p>
              </div>

              {requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-prussian-blue mb-4">Required Documents</h2>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-accent-yellow mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">
                          {typeof req === 'string' ? req : req.label || req.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-prussian-blue mb-4">Process</h2>
                <div className="space-y-3">
                  {process.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-prussian-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 pt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-accent-yellow mb-2">{formatPrice()}</div>
                <div className="text-gray-600">Service Fee</div>
              </div>

              <div className="mb-6">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration: {formatDuration()}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Available: Mon - Sat, 9:00 AM - 6:00 PM
                </div>
              </div>

              <div className="space-y-3">
                {service.pricing_model === 'fixed' ? (
                  <a href={`/book/${service.id}`} className="block w-full btn-primary text-center">
                    Book Appointment
                  </a>
                ) : (
                  <a
                    href={`/enquiry/${service.id}`}
                    className="block w-full bg-accent-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center"
                  >
                    Get Quote
                  </a>
                )}
                <button className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Save for Later
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-prussian-blue mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our support team is available to assist you with any questions.
                </p>
                {/* Was a dead <button>. Now links to the existing /contact
                    page with the service id pre-attached so the support
                    form can show context. WhatsApp + phone shortcuts are
                    surfaced inline as a fast-path for common channels. */}
                <a
                  href={`/contact?serviceId=${encodeURIComponent(service.id)}&serviceName=${encodeURIComponent(service.name)}`}
                  className="block text-sm text-accent-blue font-semibold hover:underline mb-2"
                >
                  → Contact Support
                </a>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href={`https://wa.me/917482872330?text=${encodeURIComponent(`Hi, I have a question about: ${service.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 font-semibold hover:bg-green-200"
                  >
                    💬 WhatsApp
                  </a>
                  <a
                    href="tel:+917482872330"
                    className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`mailto:support@fliponex.com?subject=${encodeURIComponent(`Help: ${service.name}`)}`}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
