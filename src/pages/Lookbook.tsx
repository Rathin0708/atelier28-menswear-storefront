import { EditorialCampaign } from '@/components/sections/EditorialCampaign'
import { InstagramGallery } from '@/components/sections/InstagramGallery'
import { SplitLines } from '@/components/ui/Motion'
import { brand } from '@/config/brand'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function Lookbook() {
  usePageMeta('Lookbook', 'The AW 2028 lookbook: the campaign story and looks worn by our community.')
  return (
    <>
      <section className="wrap pb-16 pt-10 md:pt-20">
        <p className="label text-stone">{brand.season}</p>
        <SplitLines as="h1" lines={['The', 'lookbook']} className="display display-hero mt-6 uppercase" immediate />
      </section>
      <EditorialCampaign />
      <InstagramGallery />
    </>
  )
}
