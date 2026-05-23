import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface PillarCard {
  icon: string
  title: string
  body: string
}

const PILLARS: PillarCard[] = [
  {
    icon: '🏠',
    title: 'Doorstep First',
    body:
      "We come to you. No more queues at government offices, no more taking a day off work. Our trained representatives handle the entire process at your address.",
  },
  {
    icon: '⚡',
    title: 'Fast & Transparent',
    body:
      "Fixed pricing. No surprise fees. Choose Regular or Fast-Track service and know exactly what you'll pay before you book.",
  },
  {
    icon: '🛡️',
    title: 'Secure by Design',
    body:
      "Your documents are handled by verified, KYC-cleared representatives. Every booking has a unique OTP and a digital paper trail.",
  },
  {
    icon: '🤝',
    title: 'Built for India',
    body:
      "From PAN updates to GST filings, we cover the documents that matter to consumers and businesses across the country.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-prussian-blue via-accent-blue to-prussian-blue text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-accent-yellow uppercase mb-3">
            About FliponeX
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-5 leading-tight">
            India&apos;s digital paperwork, finally delivered to your door.
          </h1>
          <p className="text-lg sm:text-xl text-white/85 leading-relaxed">
            FliponeX exists to make government and corporate documentation
            ridiculously easy. Book a service in under a minute, hand it off,
            and get back to your life.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-2">
              Our Mission
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-prussian-blue mb-4">
              Cut the queues. Keep the trust.
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Every Indian deserves to spend their workday on what they
              actually care about — not standing in line for an Aadhaar update
              or a GST filing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We built FliponeX as a single doorstep platform that combines
              consumer-grade convenience with enterprise-grade security, so
              individuals and factories alike can outsource the paperwork they
              were never trained to handle.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border-l-4 border-accent-yellow">
            <p className="text-5xl mb-3">🚀</p>
            <h3 className="text-xl font-bold text-prussian-blue mb-2">
              500+ Services
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              From PAN cards and Aadhaar updates to factory licensing and B2B
              GST audits — we cover the full spectrum of consumer and
              industrial documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-2">
              What we stand for
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-prussian-blue">
              Four pillars, no compromises.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-bold text-prussian-blue mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: '500+', l: 'Services Offered' },
            { v: '50+', l: 'Cities Served' },
            { v: '10K+', l: 'Happy Customers' },
            { v: '4.8★', l: 'Average Rating' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-prussian-blue">
                {s.v}
              </p>
              <p className="text-sm text-gray-600 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-accent-yellow to-yellow-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-prussian-blue mb-3">
            Ready to skip the queue?
          </h2>
          <p className="text-prussian-blue/80 text-lg mb-6">
            Browse our services or message us — we&apos;ll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center bg-prussian-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-blue transition-colors"
            >
              Browse Services
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-prussian-blue px-6 py-3 rounded-lg font-semibold border-2 border-prussian-blue hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
