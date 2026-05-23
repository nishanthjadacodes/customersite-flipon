'use client'

import { useState, useEffect } from 'react'
import ServiceCard, { ServiceCardItem } from './ServiceCard'
import { servicesAPI } from '../utils/api'

interface Category {
  id: number
  name: string
  icon: string
  color: string
}

const categories: Category[] = [
  { id: 1, name: 'Aadhaar Services', icon: 'id-card', color: 'bg-accent-blue' },
  { id: 2, name: 'Welfare Services', icon: 'heart', color: 'bg-accent-red' },
  { id: 3, name: 'Certificate Services', icon: 'certificate', color: 'bg-accent-yellow' },
  { id: 4, name: 'State Schemes', icon: 'building', color: 'bg-accent-gold' },
]

const fallbackServices: ServiceCardItem[] = [
  { id: 1, name: 'Aadhaar Enrollment', category: 'Aadhaar Services', price: 'Free', duration: '30 min', description: 'New Aadhaar card enrollment with biometric verification' },
  { id: 2, name: 'Aadhaar Update', category: 'Aadhaar Services', price: 'Free', duration: '15 min', description: 'Update existing Aadhaar details and information' },
  { id: 3, name: 'Aadhaar Correction', category: 'Aadhaar Services', price: '25', duration: '20 min', description: 'Correct errors in Aadhaar card details' },
  { id: 4, name: 'Pension Application', category: 'Welfare Services', price: '50', duration: '45 min', description: 'Apply for government pension schemes' },
  { id: 5, name: 'Widow Pension', category: 'Welfare Services', price: 'Free', duration: '30 min', description: 'Apply for widow pension benefits' },
  { id: 6, name: 'Disability Benefits', category: 'Welfare Services', price: 'Free', duration: '40 min', description: 'Disability certificate and benefits application' },
  { id: 7, name: 'Birth Certificate', category: 'Certificate Services', price: '100', duration: '30 min', description: 'Official birth certificate issuance' },
  { id: 8, name: 'Death Certificate', category: 'Certificate Services', price: '50', duration: '20 min', description: 'Official death certificate issuance' },
  { id: 9, name: 'Marriage Certificate', category: 'Certificate Services', price: '150', duration: '45 min', description: 'Register marriage and obtain certificate' },
  { id: 10, name: 'Income Certificate', category: 'Certificate Services', price: '75', duration: '25 min', description: 'Official income certificate for various purposes' },
  { id: 11, name: 'Caste Certificate', category: 'Certificate Services', price: '100', duration: '30 min', description: 'Official caste certificate issuance' },
  { id: 12, name: 'Residence Certificate', category: 'Certificate Services', price: '50', duration: '20 min', description: 'Proof of residence certificate' },
  { id: 13, name: 'State Education Scheme', category: 'State Schemes', price: 'Free', duration: '30 min', description: 'Apply for state government education schemes' },
  { id: 14, name: 'Housing Scheme', category: 'State Schemes', price: 'Free', duration: '40 min', description: 'Apply for government housing schemes' },
  { id: 15, name: 'Agricultural Subsidy', category: 'State Schemes', price: 'Free', duration: '35 min', description: 'Apply for agricultural subsidies and benefits' },
  { id: 16, name: 'Business Loan Scheme', category: 'State Schemes', price: 'Free', duration: '45 min', description: 'Apply for state-sponsored business loans' },
]

export default function ServiceCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Services')
  const [services, setServices] = useState<ServiceCardItem[]>(fallbackServices)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await servicesAPI.getAllServices('consumer')
      console.log('Services API Response:', response)

      // Handle different response structures
      let servicesArray: any[] = []
      const respData: any = (response as any).data
      if (respData && respData.success && respData.data) {
        servicesArray = respData.data
      } else if (respData && Array.isArray(respData)) {
        servicesArray = respData
      } else if (Array.isArray(response)) {
        servicesArray = response as unknown as any[]
      }

      if (servicesArray.length > 0) {
        // Transform backend services to frontend format
        const transformedServices: ServiceCardItem[] = servicesArray.map((service: any) => ({
          id: service.id,
          name: service.name,
          category: service.category,
          price:
            service.pricing_model === 'fixed'
              ? service.user_cost === 0
                ? 'Free'
                : service.user_cost.toString()
              : `Starting at ${service.indicative_price_from || 'Quote'}`,
          duration: service.expected_timeline || '30 min',
          description: service.description || '',
          pricing_model: service.pricing_model,
          user_cost: service.user_cost,
          indicative_price_from: service.indicative_price_from,
          pricing_unit: service.pricing_unit,
        }))
        console.log('Transformed services:', transformedServices)
        setServices(transformedServices)
      } else {
        console.log('No services found, using fallback')
      }
    } catch (error: any) {
      console.log('Using fallback services due to API error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices =
    selectedCategory === 'All Services'
      ? services
      : services.filter((service) => service.category === selectedCategory)

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-prussian-blue mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">Choose from our wide range of digital services</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('All Services')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              selectedCategory === 'All Services'
                ? 'bg-prussian-blue text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-prussian-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {loading ? (
            // Skeleton loaders — same shape as a real card to avoid layout shift
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card">
                <div className="skeleton h-5 mb-4"></div>
                <div className="skeleton h-3 w-1/2 mb-2"></div>
                <div className="skeleton h-3 w-2/3 mb-4"></div>
                <div className="skeleton h-9"></div>
              </div>
            ))
          ) : filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No services found in this category.</div>
              <button
                onClick={() => setSelectedCategory('All Services')}
                className="mt-4 text-prussian-blue hover:underline"
              >
                View all services
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
