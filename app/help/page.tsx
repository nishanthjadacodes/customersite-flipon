import type { Metadata } from 'next'
import LegalPage from '../../components/LegalPage'

export const metadata: Metadata = { title: 'Help Center · FliponeX' }

interface FAQ {
  q: string
  a: string
}

const FAQS: FAQ[] = [
  {
    q: 'How do I verify my representative?',
    a: 'Every FliponeX representative carries a digital ID badge in the app. When the representative arrives, they will share a one-time code which you can verify in your booking. The representative\'s name, photo, and rating are also visible in the app before the visit.',
  },
  {
    q: 'Which payment modes are accepted?',
    a: 'UPI (PhonePe / GPay / Paytm / any UPI app), all major debit and credit cards, net banking, and select wallets. For B2B / industrial bookings, NEFT / RTGS bank transfer is also supported on accepted quotes.',
  },
  {
    q: 'Is my payment secure?',
    a: 'All online payments go through Razorpay — a PCI-DSS Level 1 certified payment gateway. FliponeX never stores your card details on its servers. Pay-after-service is collected by the representative only after the job is complete.',
  },
  {
    q: 'Timeline for Aadhaar Services?',
    a: 'Most Aadhaar updates (mobile / address / DOB) are completed in 7–10 working days, subject to UIDAI portal availability. Print delivery follows once the update is approved.',
  },
  {
    q: 'Timeline for PAN Services?',
    a: 'New PAN allotment via Income Tax e-portal is typically issued within 7–10 working days. Corrections to an existing PAN take 10–15 working days.',
  },
  {
    q: 'Timeline for Voter ID Services?',
    a: 'New voter registration and corrections are processed by ECI within 15–30 days. We dispatch the printed Voter ID card as soon as ECI generates it.',
  },
  {
    q: 'Timeline for other Services?',
    a: 'Industrial licences (Trade, Factory, MSME, Pollution NOC, ISO) take 7–20 working days depending on the regulator. GST returns are filed monthly / quarterly per your cycle. Each service shows its specific timeline before you book.',
  },
]

export default function Help() {
  return (
    <LegalPage
      title="Help Center"
      subtitle="Quick answers to the questions we get most often."
    >
      <div className="not-prose space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-accent-blue transition-colors open:border-accent-blue open:shadow-md"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h3 className="font-semibold text-prussian-blue text-base">{f.q}</h3>
              <span className="text-accent-blue text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8">
        Didn&apos;t find what you need? <a href="/contact">Talk to support</a> or{' '}
        <a href="/grievance">raise a ticket</a>.
      </p>
    </LegalPage>
  )
}
