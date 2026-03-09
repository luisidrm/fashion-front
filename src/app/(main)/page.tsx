import {
  Hero,
  TheCollection,
  FeaturedProducts,
  OurStory,
  OffersBanner,
  Newsletter,
} from '@/components/home'
import { HomeBackground } from '@/components/home/HomeBackground'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="relative">
      <HomeBackground />
      <Hero />
      <TheCollection />
      <FeaturedProducts />
      <OurStory />
      <OffersBanner />
      <Newsletter />
      <Footer />
    </div>
  )
}
