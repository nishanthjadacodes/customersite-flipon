'use client'
import { useState, useEffect, useCallback, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { servicesAPI } from '../../../utils/api'

interface QuoteService {
  id: string | number
  name: string
  pricing_model?: 'quote' | 'fixed' | string
  indicative_price_from?: number | string
}

interface EnquiryFormData {
  name: string
  email: string
  phone: string
  company: string
  requirements: string
  timeline: string
  budget: string
  additionalInfo: string
}

interface PageProps {
  params: { id: string }
}

export default function EnquiryPage({ params }: PageProps) {
  const router = useRouter()
  const [service, setService] = useState<QuoteService | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [step, setStep] = useState<number>(1)
  const [enquiryData, setEnquiryData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirements: '',
    timeline: '',
    budget: '',
    additionalInfo: '',
  })

  const fetchService = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await servicesAPI.getServiceById(params.id)
      const respData: any = (response as any).data
      if (respData && respData.success && respData.data) {
        const serviceData = respData.data as QuoteService
        // Only allow enquiry for quote-based services
        if (serviceData.pricing_model !== 'quote') {
          router.push(`/book/${params.id}`)
          return
        }
        setService(serviceData)
      } else {
        router.push('/services')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      router.push('/services')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchService()
  }, [fetchService])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (step === 1) {
      if (!enquiryData.name || !enquiryData.email || !enquiryData.phone) {
        alert('Please fill in all required fields')
        return
      }
      setStep(2)
    } else if (step === 2) {
      try {
        // Submit enquiry to backend (create enquiryAPI when wired up)
        // For now, just show success message
        alert('Enquiry submitted successfully! We will contact you soon.')
        router.push('/services')
      } catch (error) {
        console.error('Error submitting enquiry:', error)
        alert('Failed to submit enquiry. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600">Service not found</h1>
            <button onClick={() => router.push('/services')} className="mt-4 btn-primary">
              Back to Services
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const formatPrice = (): string =>
    service.indicative_price_from ? `Starting at Rs ${service.indicative_price_from}` : 'Quote Based'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-prussian-blue mb-2">Request Quote</h1>
          <div className="flex items-center text-gray-600">
            <span>{service.name}</span>
            <span className="mx-2">·</span>
            <span className="font-semibold text-accent-yellow">{formatPrice()}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-prussian-blue text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-prussian-blue' : 'bg-gray-300'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-prussian-blue text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Contact Details</span>
            <span className="text-sm text-gray-600">Requirements</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-prussian-blue mb-6">Contact Information</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={enquiryData.name}
                    onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={enquiryData.email}
                    onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={enquiryData.phone}
                    onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={enquiryData.company}
                    onChange={(e) => setEnquiryData({ ...enquiryData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-prussian-blue mb-6">Project Requirements</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Project Description *</label>
                <textarea
                  value={enquiryData.requirements}
                  onChange={(e) => setEnquiryData({ ...enquiryData, requirements: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  rows={4}
                  placeholder="Describe your project requirements in detail..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Expected Timeline</label>
                  <select
                    value={enquiryData.timeline}
                    onChange={(e) => setEnquiryData({ ...enquiryData, timeline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  >
                    <option value="">Select Timeline</option>
                    <option value="urgent">Urgent (within 1 week)</option>
                    <option value="2weeks">2-4 weeks</option>
                    <option value="1month">1-2 months</option>
                    <option value="3months">3-6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Budget Range</label>
                  <select
                    value={enquiryData.budget}
                    onChange={(e) => setEnquiryData({ ...enquiryData, budget: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under10k">Under Rs 10,000</option>
                    <option value="10k-25k">Rs 10,000 - 25,000</option>
                    <option value="25k-50k">Rs 25,000 - 50,000</option>
                    <option value="50k-100k">Rs 50,000 - 100,000</option>
                    <option value="100k+">Above Rs 100,000</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Additional Information</label>
                <textarea
                  value={enquiryData.additionalInfo}
                  onChange={(e) =>
                    setEnquiryData({ ...enquiryData, additionalInfo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian-blue focus:border-prussian-blue"
                  rows={3}
                  placeholder="Any additional details or specific requirements..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                step > 1
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={step === 1}
            >
              Previous
            </button>
            <button type="submit" className="btn-primary">
              {step === 2 ? 'Submit Enquiry' : 'Continue'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
