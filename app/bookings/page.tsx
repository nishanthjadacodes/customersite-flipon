'use client'
import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { bookingAPI } from '../../utils/api'
import { swrFetch } from '../../utils/swrCache'
import { formatBookingId, formatRupees } from '../../utils/format'

interface BookingRecord {
  id: string | number
  service_name: string
  status: string
  booking_date: string
  booking_time: string
  // Pricing fields — the backend response shape isn't 100% consistent
  // across older vs newer bookings. The amount the customer paid (or
  // owes) might land in ANY of these. The render path tries them in
  // priority order: final_price (post-payment confirmed) → price_quoted
  // (booking-time snapshot) → total_amount (legacy) → user_cost
  // (service catalog list price) → amount (very old). Whichever
  // resolves first is what we display.
  total_amount?: number
  final_price?: number | string
  amount?: number | string
  user_cost?: number | string
  booking_number?: string | number
  service_address?: string
  customer_name?: string
  customer_mobile?: string
  payment_status?: string
  agent?: { name?: string; mobile?: string }
  service?: { name?: string; expected_timeline?: string; user_cost?: number | string }
  notes?: string
  price_quoted?: number | string
  created_at?: string
}

// Resolve the customer-facing booking amount. Walks the fallback
// chain in priority order so older bookings that landed before any
// of the newer fields existed still render something sensible.
const resolveBookingAmount = (b: BookingRecord): number => {
  const candidates: unknown[] = [
    b.final_price,
    b.price_quoted,
    b.total_amount,
    b.user_cost,
    b.amount,
    b.service?.user_cost,
  ];
  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
};

type FilterValue = 'all' | 'pending' | 'confirmed' | 'completed'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<FilterValue>('all')
  // Track which booking row has its details panel expanded — null = none.
  const [expandedId, setExpandedId] = useState<string | number | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  // Stale-while-revalidate — cached bookings render instantly so the
  // page never spins on a return visit. Background fetch refreshes the
  // list (and React re-renders) when the network response lands.
  const fetchBookings = (): void => {
    const result = swrFetch<BookingRecord[]>(
      'bookings:my',
      async () => {
        const response = await bookingAPI.getMyBookings()
        const respData: any = (response as any).data
        if (Array.isArray(respData)) return respData as BookingRecord[]
        if (Array.isArray(respData?.data)) return respData.data as BookingRecord[]
        if (Array.isArray(response)) return response as unknown as BookingRecord[]
        return []
      },
      {
        onFresh: (fresh) => {
          setBookings(fresh)
          setLoading(false)
        },
        onError: (error) => {
          console.error('Error fetching bookings:', error)
          setLoading(false)
        },
      },
    )
    if (result.cached) {
      setBookings(result.cached)
      setLoading(false)
    } else {
      setLoading(true)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-prussian-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-prussian-blue font-semibold text-lg">Loading your bookings…</p>
            <p className="text-gray-500 text-sm mt-2">
              First load may take 30-60 seconds while the server wakes up.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-prussian-blue mb-2">My Bookings</h1>
          <p className="text-lg text-gray-600">Manage and track your service appointments</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'completed'] as FilterValue[]).map((f) => {
              const labels: Record<FilterValue, string> = {
                all: 'All Bookings',
                pending: 'Pending',
                confirmed: 'Confirmed',
                completed: 'Completed',
              }
              const count =
                f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-prussian-blue text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {labels[f]} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You haven&apos;t made any bookings yet.</p>
            <a href="/services" className="btn-primary">
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-prussian-blue">
                          {booking.service_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking ID:{' '}
                          <span className="font-mono font-semibold text-gray-900">
                            {formatBookingId(booking.booking_number ?? booking.id)}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {booking.booking_time}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        {(() => {
                          const amt = resolveBookingAmount(booking);
                          return amt === 0 ? 'Free' : formatRupees(amt);
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() =>
                        setExpandedId((prev) => (prev === booking.id ? null : booking.id))
                      }
                      // Inline Prussian blue (#0D3B66) matching the
                      // customer app's brand color. btn-secondary was
                      // the yellow chip — wrong tone for a primary
                      // detail-view action on a booking row.
                      style={{ backgroundColor: '#0D3B66' }}
                      className="text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      {expandedId === booking.id ? 'Hide details' : 'View Details'}
                    </button>
                    {booking.status === 'pending' && (
                      <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline details panel — opens below the row header. We
                    don't push the user to a separate page because the data
                    we already have on the list is enough for a useful
                    summary, and avoiding a navigation keeps the cold-start
                    delay out of the picture. */}
                {expandedId === booking.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {booking.booking_number != null && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Booking #</p>
                        <p className="text-gray-900 font-medium">
                          {formatBookingId(booking.booking_number)}
                        </p>
                      </div>
                    )}
                    {booking.customer_name && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Customer</p>
                        <p className="text-gray-900 font-medium">{booking.customer_name}</p>
                        {booking.customer_mobile && (
                          <p className="text-gray-600">{booking.customer_mobile}</p>
                        )}
                      </div>
                    )}
                    {booking.service_address && (
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Service Address</p>
                        <p className="text-gray-900">{booking.service_address}</p>
                      </div>
                    )}
                    {booking.agent?.name && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Representative</p>
                        <p className="text-gray-900 font-medium">{booking.agent.name}</p>
                        {booking.agent.mobile && (
                          <p className="text-gray-600">{booking.agent.mobile}</p>
                        )}
                      </div>
                    )}
                    {booking.payment_status && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Payment</p>
                        <p className="text-gray-900 font-medium">
                          {booking.payment_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </p>
                      </div>
                    )}
                    {/* Expected timeline — always renders so the user
                        sees the field even when the backend response
                        didn't include service.expected_timeline. Falls
                        back to a friendly placeholder so it never
                        looks like missing data. */}
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Expected Timeline</p>
                      <p className="text-gray-900">
                        {booking.service?.expected_timeline ||
                          (booking as any).expected_timeline ||
                          'Confirmed once representative is assigned'}
                      </p>
                    </div>
                    {booking.notes && (
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Notes</p>
                        <p className="text-gray-900">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
