import type { Metadata } from 'next'
import PrivacyPage from '../../components/PrivacyPage'

// The legal copy lives in components/PrivacyPage.tsx so both this
// route and /privacy-policy render identical content. The canonical
// annotation tells Google to index /privacy-policy as the primary
// URL — this URL remains accessible (old emails, app builds, and
// inbound links keep working) but Google de-duplicates them.
export const metadata: Metadata = {
  title: 'Privacy Policy · FliponeX',
  alternates: { canonical: '/privacy-policy' },
}

export default PrivacyPage
