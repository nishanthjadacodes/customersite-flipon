'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface BookingDetails {
  service: string
  date: string
  time: string
  bookingId: string
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)

  useEffect(() => {
    const service = searchParams.get('service')
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const bookingId = searchParams.get('bookingId')

    if (service && date && time) {
      setBookingDetails({
        service,
        date,
        time,
        bookingId:
          bookingId || 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      })
    }
  }, [searchParams])

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600">No booking details found</h1>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-prussian-blue mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Your appointment has been successfully booked</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-prussian-blue mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold">{bookingDetails.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold">{bookingDetails.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{new Date(bookingDetails.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{bookingDetails.time}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-prussian-blue mb-4">What&apos;s Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-prussian-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmation Email</h3>
                  <p className="text-sm text-gray-600">You&apos;ll receive a confirmation email with all details</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-prussian-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Reminder SMS</h3>
                  <p className="text-sm text-gray-600">Get a reminder 24 hours before your appointment</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-prussian-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Visit Center</h3>
                  <p className="text-sm text-gray-600">Arrive 10 minutes before your scheduled time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-prussian-blue mb-2">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-accent-yellow mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Please bring all required documents mentioned in the service details
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-accent-yellow mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Reach the center 10 minutes before your appointment time
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-accent-yellow mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              For rescheduling or cancellation, contact us at least 2 hours in advance
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">Download Receipt</button>
          <button className="btn-secondary">Book Another Service</button>
          <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
            Go to Homepage
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
