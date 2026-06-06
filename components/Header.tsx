'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://flipon-backend.onrender.com/api'

// Fire-and-forget warmup ping. Render's free dyno sleeps after ~15 min
// of inactivity; the cold-start spin-up takes 30-50s. Hitting /health
// the moment the user lands on ANY page (Header is in the layout)
// starts waking the dyno in the background, so by the time they click
// View Details / Book Now / My Bookings the server is already up.
let warmupFired = false
const warmDyno = (): void => {
  if (warmupFired || typeof window === 'undefined') return
  warmupFired = true
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  fetch(`${apiOrigin}/health`)
    .then(() => console.log('[warmup] dyno ping ok'))
    .catch((e) => console.log('[warmup] dyno ping failed (non-fatal):', e?.message))
}

export default function Header() {
  useEffect(() => {
    warmDyno()
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group min-w-0">
            <div className="flex-shrink-0">
              {/* Real FliponeX logo — shared with the admin dashboard so the
                  brand stays consistent across web properties. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fliponex-logo.jpeg"
                alt="FliponeX"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-transform group-hover:scale-105"
              />
            </div>
            <div className="ml-2 sm:ml-3 min-w-0">
              {/* Scale the wordmark down on phones so it doesn't crowd the
                  My Bookings / Logout cluster on narrow devices (≤360px). */}
              <h1 className="text-base sm:text-xl font-bold text-prussian-blue truncate">
                FliponeX
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-prussian-blue transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-prussian-blue transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-prussian-blue transition-colors">
              About
            </Link>
            <Link href="/contact-us" className="text-gray-700 hover:text-prussian-blue transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Mobile: compact px-3 py-2 text-sm so the button (plus the
                logo + brand + Logout button) all fit on a 320px-wide
                Galaxy / budget Realme without wrapping or overflowing.
                Desktop / tablet: btn-primary's default px-6 py-3 text-base.
                `!` prefix forces these over the @apply rules in
                globals.css. `whitespace-nowrap` prevents "My Bookings"
                from wrapping into two lines on the very narrowest devices. */}
            <Link
              href="/bookings"
              className="btn-primary !px-3 !py-2 !text-sm sm:!px-6 sm:!py-3 sm:!text-base whitespace-nowrap transition-opacity hover:opacity-90"
            >
              My Bookings
            </Link>
            {/* Logout — mirrors the admin dashboard pattern. Wipes the
                Flipon token + user from localStorage/sessionStorage so
                the next API call re-runs the guest-login auto-recover
                path (i.e. session is genuinely cleared). Confirms first
                so accidental taps don't sign anyone out. Lands the user
                on the homepage after the wipe. */}
            <button
              onClick={() => {
                if (
                  typeof window !== 'undefined' &&
                  !window.confirm('Do you want to logout?')
                ) {
                  return;
                }
                try {
                  if (typeof window !== 'undefined') {
                    window.localStorage?.clear();
                    window.sessionStorage?.clear();
                  }
                } catch (_) { /* private mode etc. */ }
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-prussian-blue border border-prussian-blue hover:bg-prussian-blue hover:text-white transition-colors whitespace-nowrap"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
