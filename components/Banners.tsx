import Link from 'next/link'

interface BannerCard {
  label: string
  headline: string
  icon: string
  cta: string
  href: string
  bg: string
  text: 'text-white' | 'text-prussian-blue'
}

const BANNERS: BannerCard[] = [
  {
    label: 'Consumer (B2C)',
    headline: 'PAN, Aadhaar, or Voter ID? No more office visits!',
    icon: '👨‍👩‍👧',
    cta: 'Browse consumer services',
    href: '/services?type=consumer',
    bg: 'from-yellow-300 to-yellow-500',
    text: 'text-prussian-blue',
  },
  {
    label: 'Industrial (B2B)',
    headline: 'Industrial Licensing & GST? Focus on growth, we handle the files.',
    icon: '🏭',
    cta: 'Request a quote',
    href: '/services?type=industrial',
    bg: 'from-prussian-blue to-accent-blue',
    text: 'text-white',
  },
  {
    label: 'Fast Track',
    headline: '90-Minute Urgency Mode for those critical digital needs.',
    icon: '⚡',
    cta: 'Try Fast Track',
    href: '/services',
    // Brand-blue gradient (Prussian → accent blue) — same palette as the
    // logo, kept distinct from the B2B card by reversing the stops.
    bg: 'from-accent-blue to-prussian-blue',
    text: 'text-white',
  },
  // Referral banner removed — Refer & Earn is an in-app post-login
  // feature (rewards wallet is per-account). Showing it to anonymous
  // public visitors who can't yet earn or use the rewards was
  // misleading. Reintroduce only inside the authenticated app shell.
]

export default function Banners() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-2">
            One platform, many use-cases
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-prussian-blue">
            Pick the lane that fits you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BANNERS.map((b) => (
            <Link
              key={b.label}
              href={b.href}
              className={`block rounded-2xl p-6 sm:p-7 bg-gradient-to-br ${b.bg} ${b.text} shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{b.icon}</div>
                <div className="flex-1">
                  <p
                    className={`text-[11px] font-bold tracking-widest uppercase ${
                      b.text === 'text-white' ? 'text-white/80' : 'text-prussian-blue/70'
                    } mb-1.5`}
                  >
                    {b.label}
                  </p>
                  <h3 className="text-lg sm:text-xl font-bold leading-snug mb-3">{b.headline}</h3>
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${
                      b.text === 'text-white' ? 'text-white' : 'text-prussian-blue'
                    }`}
                  >
                    {b.cta} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
