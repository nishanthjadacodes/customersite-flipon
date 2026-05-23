import type { Metadata } from 'next'
import LegalPage from '../../components/LegalPage'

export const metadata: Metadata = { title: 'Contact Support · FliponeX' }

export default function Contact() {
  return (
    <LegalPage
      title="Contact Support"
      subtitle="Real humans, fast turnarounds. Pick the channel that suits you best."
    >
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <a
          href="tel:+917482872330"
          className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-accent-blue hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-bold text-prussian-blue text-lg">Helpline</h3>
          <p className="text-sm text-gray-600 mt-1">+91 7482872330</p>
          <p className="text-xs text-gray-500 mt-1">Mon–Sat, 9:00 AM – 8:00 PM</p>
        </a>

        <a
          href="https://wa.me/7482872330"
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-bold text-prussian-blue text-lg">WhatsApp Support</h3>
          <p className="text-sm text-gray-600 mt-1">Chat with us for instant resolutions</p>
          <p className="text-xs text-emerald-600 mt-1">wa.me/7482872330</p>
        </a>

        <a
          href="mailto:support@fliponex.com"
          className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-accent-blue hover:shadow-md transition-all"
        >
          <div className="text-3xl mb-2">✉️</div>
          <h3 className="font-bold text-prussian-blue text-lg">Email Support</h3>
          <p className="text-sm text-gray-600 mt-1">support@fliponex.com</p>
          <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
        </a>

        <div className="block rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-3xl mb-2">🏢</div>
          <h3 className="font-bold text-prussian-blue text-lg">Corporate Office</h3>
          <p className="text-sm text-gray-600 mt-1">
            S. No. 11/1, Quepem,<br />
            South Goa, Goa – 403705
          </p>
        </div>
      </div>

      <p>
        Stuck on a booking, a representative issue, or a payment question?
        Open <a href="/grievance">Raise a Ticket</a> and our support team will pick it up
        within 24 hours.
      </p>
    </LegalPage>
  )
}
