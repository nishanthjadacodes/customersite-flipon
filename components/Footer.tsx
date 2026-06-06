import Link from 'next/link'

// Footer with the official contact channels + legal links from the brand
// brief. All contact info is pulled from one place so support@fliponex.com
// only needs updating in this file when it ever changes.
const SUPPORT = {
  helplineDisplay: '+91 7482872330',
  helplineTel: '+917482872330',
  helplineHours: 'Mon–Sat, 9:00 AM – 8:00 PM',
  whatsapp: 'https://wa.me/7482872330',
  email: 'support@fliponex.com',
  address: 'S. No. 11/1, Quepem, South Goa, Goa – 403705',
} as const

export default function Footer() {
  return (
    <footer className="bg-prussian-blue text-white py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/fliponex-logo.jpeg" alt="FliponeX" className="w-9 h-9 rounded-full" />
              <h3 className="ml-2 text-xl font-bold">FliponeX</h3>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              India&apos;s #1 Doorstep Digital Service. From Aadhaar updates to Industrial Licensing — 100+ services, one tap.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link href="/services" className="hover:text-accent-yellow transition-colors">All Services</Link></li>
              <li><Link href="/services?type=consumer" className="hover:text-accent-yellow transition-colors">Consumer (B2C)</Link></li>
              <li><Link href="/services?type=industrial" className="hover:text-accent-yellow transition-colors">Industrial (B2B)</Link></li>
              <li><Link href="/bookings" className="hover:text-accent-yellow transition-colors">My Bookings</Link></li>
              <li><Link href="/help" className="hover:text-accent-yellow transition-colors">Help Center</Link></li>
              <li><Link href="/grievance" className="hover:text-accent-yellow transition-colors">Raise a Ticket</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-accent-yellow transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-accent-yellow transition-colors">Refund & Cancellation</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-accent-yellow transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/contact-us" className="hover:text-accent-yellow transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <a href={`tel:${SUPPORT.helplineTel}`} className="hover:text-white transition-colors block">
                    {SUPPORT.helplineDisplay}
                  </a>
                  <span className="text-xs text-blue-300">{SUPPORT.helplineHours}</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">💬</span>
                <a href={SUPPORT.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${SUPPORT.email}`} className="hover:text-white transition-colors">{SUPPORT.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">{SUPPORT.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 text-center text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} FliponeX Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
