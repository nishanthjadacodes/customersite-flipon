import type { Metadata } from 'next'
import LegalPage from '../../components/LegalPage'

export const metadata: Metadata = { title: 'Refund & Cancellation · FliponeX' }

export default function Refund() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair refunds — no surprises."
      lastUpdated={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
    >
      <h2>Free Cancellation</h2>
      <p>
        Cancel your booking <strong>at no cost</strong> up to <strong>1 hour</strong>{' '}
        before the scheduled slot.
      </p>

      <h2>Visiting Fee</h2>
      <p>
        If the representative reaches the location and the service is cancelled by the user,
        a <strong>₹99 visiting fee</strong> will apply.
      </p>

      <h2>Refunds</h2>
      <p>
        In case a service cannot be completed due to <strong>government portal technical
        errors / downtime</strong>, the service fee will be <strong>refunded</strong>{' '}
        (excluding the nominal visiting charge).
      </p>

      <h2>How to claim a refund</h2>
      <p>
        Open the booking from <em>My Bookings</em> on the app, tap <em>Raise a Ticket</em>,
        and our support team will resolve it within 2 business days.
      </p>
    </LegalPage>
  )
}
