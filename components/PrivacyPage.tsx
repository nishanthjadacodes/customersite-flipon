import LegalPage from './LegalPage'

// Shared Privacy Policy page body. Rendered by BOTH /privacy and
// /privacy-policy so the actual legal text lives in exactly one place
// — edit here once and both URLs reflect the change. The route files
// (app/privacy/page.tsx, app/privacy-policy/page.tsx) are thin
// re-exports that each set their own `metadata`, including the
// canonical-URL annotation that tells Google to index /privacy-policy
// as the primary URL.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we handle your documents and personal data."
      lastUpdated={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
    >
      <p>
        FliponeX Digital respects your privacy. We use your documents <strong>solely for the
        requested service</strong>. Once the task is concluded, sensitive data is securely
        purged from our active systems.
      </p>
      <p>
        We <strong>never share or sell your data to third parties</strong>. Personal data
        is stored encrypted at rest and is accessible only to authorised FliponeX staff who
        need it to deliver the service you booked.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Name, mobile number, and email — to create your account and contact you.</li>
        <li>Documents you upload (Aadhaar, PAN, address proof, etc.) — only for the service in question.</li>
        <li>Booking history, ratings, and chat transcripts — to improve service quality and resolve disputes.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Documents are retained for the duration of the active booking plus a short
        statutory window required by Indian law. After that they are purged from our
        live systems.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request export or deletion of your data at any time by writing to{' '}
        <a href="mailto:support@fliponex.com">support@fliponex.com</a>.
      </p>
    </LegalPage>
  )
}
