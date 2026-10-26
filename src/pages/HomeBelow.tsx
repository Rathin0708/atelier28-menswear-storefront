import { BestSellers } from '@/components/sections/BestSellers'
import { BrandStory } from '@/components/sections/BrandStory'
import { CategoryIndex } from '@/components/sections/CategoryIndex'
import { EditorialCampaign } from '@/components/sections/EditorialCampaign'
import { FeaturedCollections } from '@/components/sections/FeaturedCollections'
import { InstagramGallery } from '@/components/sections/InstagramGallery'
import { NewArrivals } from '@/components/sections/NewArrivals'
import { Newsletter } from '@/components/sections/Newsletter'
import { PromoCountdown } from '@/components/sections/PromoCountdown'
import { Testimonials } from '@/components/sections/Testimonials'

/** Everything below the hero, split into its own chunk to keep first load light. */
export default function HomeBelow() {
  return (
    <>
      <FeaturedCollections />
      <NewArrivals />
      <CategoryIndex />
      <EditorialCampaign />
      <BestSellers />
      <BrandStory />
      <PromoCountdown />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  )
}
