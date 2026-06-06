import type { Metadata } from 'next'
import ContactPage from '../../components/ContactPage'

// Canonical URL for contact info — see /privacy-policy for rationale.
export const metadata: Metadata = {
  title: 'Contact Support · FliponeX',
  description:
    'Reach FliponeX support — helpline, WhatsApp, email, and corporate office address.',
  alternates: { canonical: '/contact-us' },
}

export default ContactPage
