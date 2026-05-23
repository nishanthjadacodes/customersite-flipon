// "Why FliponeX?" — the four core value propositions from the brand brief.
// Sits below the Hero on the home page; gives every visitor the same answer to
// "why should I trust this with my Aadhaar / GST / NOC application?"

interface ValueProp {
  icon: string
  title: string
  body: string
}

const PROPS: ValueProp[] = [
  {
    icon: '🚪',
    title: 'Expert at Your Doorstep',
    body: 'Our certified professionals visit your home or office to get the job done — no commute, no queues.',
  },
  {
    icon: '💰',
    title: 'Pay After Service',
    body: 'Your trust is our priority. Pay only once the task is successfully completed.',
  },
  {
    icon: '🔒',
    title: '100% Secure & Confidential',
    body: 'Your documents are encrypted and treated with the highest level of confidentiality.',
  },
  {
    icon: '📍',
    title: 'Real-time Tracking',
    body: 'Monitor your application or file status live through our mobile app.',
  },
]

export default function WhyFliponex() {
  return (
    <section id="why-fliponex" className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-2">
            Why FliponeX?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-prussian-blue">
            Built around your trust, your time, and your data.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROPS.map((p) => (
            <div
              key={p.title}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-accent-blue hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="text-lg font-bold text-prussian-blue mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
