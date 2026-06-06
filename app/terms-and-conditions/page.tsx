import type { Metadata } from 'next'
import TermsPage from '../../components/TermsPage'

// Canonical URL for terms — see /privacy-policy for rationale.
export const metadata: Metadata = {
  title: 'Terms & Conditions · FliponeX',
  description:
    'Terms governing your use of the FliponeX app and website — document authenticity, payment, and government-portal dependency.',
  alternates: { canonical: '/terms-and-conditions' },
}

export default TermsPage
