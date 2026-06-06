import type { Metadata } from 'next'
import PrivacyPage from '../../components/PrivacyPage'

// Canonical URL for the privacy policy — this is the slug Play Store,
// Google Safe Browsing, and SEO crawlers look for by name. The
// shorter /privacy alias still works and declares this URL as
// canonical so search results consolidate here.
export const metadata: Metadata = {
  title: 'Privacy Policy · FliponeX',
  description:
    'How FliponeX Digital handles your documents and personal data — what we collect, how long we keep it, and your rights.',
  alternates: { canonical: '/privacy-policy' },
}

export default PrivacyPage
