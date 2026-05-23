import type { Metadata } from 'next'
import LegalPage from '../../components/LegalPage'

export const metadata: Metadata = { title: 'Raise a Ticket · FliponeX' }

export default function Grievance() {
  return (
    <LegalPage
      title="Grievance Redressal"
      subtitle='"Raise a Ticket" for delays, representative behaviour, pending tasks, or payment issues.'
    >
      <p>
        FliponeX takes every grievance seriously. Pick the channel that suits you best
        and we&apos;ll get back within <strong>24 working hours</strong>.
      </p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-5 my-8">
        <a
          href="https://wa.me/7482872330?text=I'd%20like%20to%20raise%20a%20ticket"
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl bg-emerald-50 border border-emerald-200 p-5 hover:bg-emerald-100 transition-colors"
        >
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-bold text-emerald-900">WhatsApp Ticket</h3>
          <p className="text-sm text-emerald-800 mt-1">Fastest path. Open chat with our support desk.</p>
        </a>

        <a
          href="mailto:support@fliponex.com?subject=Grievance%3A%20"
          className="block rounded-xl bg-blue-50 border border-blue-200 p-5 hover:bg-blue-100 transition-colors"
        >
          <div className="text-3xl mb-2">✉️</div>
          <h3 className="font-bold text-prussian-blue">Email a Ticket</h3>
          <p className="text-sm text-blue-800 mt-1">Best for written records and document attachments.</p>
        </a>

        <a
          href="tel:+917482872330"
          className="block rounded-xl bg-yellow-50 border border-yellow-200 p-5 hover:bg-yellow-100 transition-colors"
        >
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-bold text-yellow-900">Call Helpline</h3>
          <p className="text-sm text-yellow-800 mt-1">Mon–Sat, 9 AM – 8 PM · +91 7482872330</p>
        </a>

        <div className="block rounded-xl bg-gray-50 border border-gray-200 p-5">
          <div className="text-3xl mb-2">📱</div>
          <h3 className="font-bold text-prussian-blue">In-App</h3>
          <p className="text-sm text-gray-700 mt-1">
            Open the booking from <em>My Bookings</em> in the app and tap <strong>Raise a Ticket</strong>.
          </p>
        </div>
      </div>

      <h2>What to include</h2>
      <ul>
        <li>Booking ID (visible in <em>My Bookings</em>)</li>
        <li>What went wrong, with timestamps if possible</li>
        <li>Screenshots or photos of the issue</li>
        <li>Your preferred resolution (refund, re-do, escalation)</li>
      </ul>

      <h2>Escalation</h2>
      <p>
        If your ticket is not resolved within <strong>3 working days</strong>, write to{' '}
        <a href="mailto:support@fliponex.com">support@fliponex.com</a> with the ticket
        ID and we&apos;ll escalate it to the management team.
      </p>
    </LegalPage>
  )
}
