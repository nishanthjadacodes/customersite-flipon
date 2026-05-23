'use client'
import { useState, useEffect, useCallback, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { servicesAPI, bookingAPI } from '../../../utils/api'

interface ServiceLite {
  id: string | number
  name: string
  pricing_model?: 'quote' | 'fixed' | string
  user_cost?: number
  expected_timeline?: string
}

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  notes: string
}

interface PageProps {
  params: { id: string }
}

const timeSlots: string[] = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

export default function BookingPage({ params }: PageProps) {
  const router = useRouter()
  const [service, setService] = useState<ServiceLite | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [step, setStep] = useState<number>(1)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchService = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await servicesAPI.getServiceById(params.id)
      const respData: any = (response as any).data
      // Tolerate three response shapes: {success,data}, {data}, or the
      // raw service object — same handling as the service-details page.
      const svc =
        respData?.success && respData?.data
          ? respData.data
          : respData?.data && !('success' in respData)
          ? respData.data
          : respData && (respData.id || respData.name)
          ? respData
          : null

      if (!svc) {
        setErrorMessage('Service not found.')
        return
      }

      const serviceData = svc as ServiceLite
      // Quote-based services skip booking and go through the enquiry flow.
      if (serviceData.pricing_model !== 'fixed') {
        router.push(`/enquiry/${params.id}`)
        return
      }
      setService(serviceData)
    } catch (error: any) {
      console.error('Error fetching service:', error)
      setErrorMessage(
        error?.code === 'ECONNABORTED'
          ? 'The server is taking longer than expected. It may be waking up — try again in a few seconds.'
          : error?.response?.data?.message ||
            'Could not load this service. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchService()
  }, [fetchService])

  // Step-back via browser/swipe back. The booking form has 2 internal
  // steps (date+time → customer details). Without this, the browser
  // back button at step 2 navigates away from /book/[id] entirely and
  // the user loses their date/time selection. With this:
  //   • entering step 2 pushes a synthetic history entry
  //   • browser back fires popstate → we decrement to step 1
  //   • leaving step 2 by any other means (submit, manual nav) cleans
  //     up the entry so the next real back goes where expected
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (step !== 2) return undefined

    window.history.pushState({ flipBookingStep: 2 }, '', window.location.href)
    let popped = false

    const onPop = (): void => {
      popped = true
      setStep(1)
    }
    window.addEventListener('popstate', onPop)

    return () => {
      window.removeEventListener('popstate', onPop)
      // If we left step 2 by other means (submit, nav), our sentinel
      // is still on top of the history stack — pop it so the user's
      // next real back goes to /services or wherever they came from.
      if (!popped) {
        window.history.back()
      }
    }
  }, [step])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-prussian-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-prussian-blue font-semibold text-lg">Loading booking…</p>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              First request may take 30-60 seconds while the server wakes up
              from sleep. Subsequent loads are instant.
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <button onClick={() => router.push('/services')} className="btn-secondary">
                Back to services
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSubmitError('')
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2)
      return
    }
    if (step !== 2) return

    try {
      setSubmitting(true)
      const bookingData = {
        service_id: String(service.id),
        service_name: service.name,
        booking_date: selectedDate,
        booking_time: selectedTime,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_mobile: customerData.phone,
        service_address: customerData.address,
        notes: customerData.notes,
        total_amount: service.user_cost,
        status: 'pending',
      }
      const response = await bookingAPI.createBooking(bookingData as any)
      const respData: any = (response as any).data
      if (respData && respData.success) {
        const bookingId =
          respData.data?.id ||
          'BK' + Math.random().toString(36).slice(2, 11).toUpperCase()
        const qParams = new URLSearchParams({
          service: service.name,
          date: selectedDate,
          time: selectedTime,
          bookingId,
        }).toString()
        router.push(`/confirmation?${qParams}`)
      } else {
        setSubmitError(respData?.message || 'Failed to create booking. Please try again.')
      }
    } catch (error: any) {
      console.error('Error creating booking:', error)
      setSubmitError(
        error?.response?.data?.message ||
          'Could not reach the server. Check your connection and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-prussian-blue mb-2">Book Appointment</h1>
          <div className="flex items-center text-gray-600">
            <span>{service.name}</span>
            <span className="mx-2">·</span>
            <span>{service.expected_timeline || '30 min'}</span>
            <span className="mx-2">·</span>
            <span className="font-semibold text-accent-yellow">
              {service.user_cost === 0 ? 'Free' : `Rs ${service.user_cost}`}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-prussian-blue text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-prussian-blue' : 'bg-gray-300'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-prussian-blue text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-prussian-blue' : 'bg-gray-300'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? 'bg-prussian-blue text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Select Date & Time</span>
            <span className="text-sm text-gray-600">Customer Details</span>
            <span className="text-sm text-gray-600">Confirmation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {step === 1 && (
            <div key="step-1" className="animate-fade-in-scale">
              <h2 className="text-xl font-semibold text-prussian-blue mb-6">Select Date & Time</h2>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Select Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-prussian-blue text-white border-prussian-blue'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-prussian-blue'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div key="step-2" className="animate-fade-in-scale">
              <h2 className="text-xl font-semibold text-prussian-blue mb-6">Customer Details</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <textarea
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
                <textarea
                  value={customerData.notes}
                  onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  rows={3}
                  placeholder="Any specific requirements or questions..."
                />
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm animate-fade-in">
              {submitError}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1 || submitting}
              className={`px-6 py-3 rounded-lg font-semibold ${
                step > 1 && !submitting
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`btn-primary inline-flex items-center gap-2 ${
                submitting ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {submitting && <span className="spinner" aria-hidden="true" />}
              {submitting ? 'Booking…' : step === 2 ? 'Confirm Booking' : 'Continue'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
