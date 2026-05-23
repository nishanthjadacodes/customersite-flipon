import Header from '../components/Header'
import Hero from '../components/Hero'
import WhyFliponex from '../components/WhyFliponex'
import Banners from '../components/Banners'
import ServiceCategories from '../components/ServiceCategories'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <WhyFliponex />
      <Banners />
      <ServiceCategories />
      <Footer />
    </div>
  )
}
