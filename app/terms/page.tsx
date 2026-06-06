import type { Metadata } from 'next'
import LegalPage from '../../components/LegalPage'

export const metadata: Metadata = { title: 'Terms & Conditions · FliponeX' }

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="Please read before using the FliponeX service."
      lastUpdated={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
    >
      <ul>
        <li>Customers must provide <strong>original and authentic documents</strong> for all applications.</li>
        <li>
          Submission of <strong>fraudulent documents</strong> will lead to immediate
          service termination — and may be reported to the relevant authorities.
        </li>
        <li>Service success is subject to <strong>Government portal availability</strong>.</li>
        <li><strong>Payment is mandatory immediately upon job completion</strong> by the representative.</li>
        <li>All services are subject to <strong>Government regulations</strong> in force at the time of filing.</li>
      </ul>

      <p>
        For any disputes, please refer to our{' '}
        <a href="/grievance">Grievance Redressal</a> process. Continued use of the
        FliponeX app or website constitutes acceptance of these terms.
      </p>
    </LegalPage>
  )
}
