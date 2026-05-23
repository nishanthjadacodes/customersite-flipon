import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-prussian-blue via-prussian-blue to-accent-blue text-white py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle decorative blobs in background */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-yellow/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <p className="inline-block text-[11px] sm:text-xs font-bold tracking-widest text-accent-yellow uppercase border border-accent-yellow/40 rounded-full px-3 py-1 mb-5">
            Safe · Secure · Reliable
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            India&apos;s <span className="text-accent-yellow">#1 Doorstep</span> Digital Service
            <span className="block mt-2">— At Your Home & Office!</span>
          </h1>

          <p className="text-base sm:text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
            From Aadhaar updates to Industrial Licensing, access{' '}
            <span className="font-semibold text-white">100+ Government and Digital Services</span> with one click.
            <span className="block mt-2 font-semibold">
              &quot;Skip the Queues, Stay Online!&quot; Choose FliponeX.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="bg-accent-yellow text-prussian-blue px-7 py-3.5 rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl text-center"
            >
              Book Now, Pay Later
            </Link>
            <Link
              href="#why-fliponex"
              className="bg-white/10 border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-colors text-center backdrop-blur"
            >
              Why FliponeX?
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-blue-200 mt-6">
            Stop waiting in queues — book FliponeX today.
          </p>
        </div>
      </div>
    </section>
  )
}
