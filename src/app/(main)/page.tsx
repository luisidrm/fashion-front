import {
  Hero,
  TheCollection,
  FeaturedProducts,
  OurStory,
  OffersBanner,
  Newsletter,
} from '@/components/home'
import { HomeBackground } from '@/components/home/HomeBackground'

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
    </div>
  )
}
