import { getContent } from "@/lib/cms/store";
import { AudienceRows } from "@/components/sections/AudienceRows";
import { BrandStory } from "@/components/sections/BrandStory";
import { CoachBand } from "@/components/sections/CoachBand";
import { ConsultSection } from "@/components/sections/ConsultSection";
import { Faq } from "@/components/sections/Faq";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { MidBanner } from "@/components/sections/MidBanner";
import { Principles } from "@/components/sections/Principles";
import { ProgramTabs } from "@/components/sections/ProgramTabs";
import { Services } from "@/components/sections/Services";
import { StoryTabs } from "@/components/sections/StoryTabs";

export default async function Home() {
  const content = await getContent();
  return (
    <>
      <HeroSlider slides={content.hero} />
      <AudienceRows />
      <ProgramTabs />
      <MidBanner />
      <StoryTabs />
      <Services />
      <CoachBand coach={content.coach} />
      <BrandStory />
      <Principles />
      <Faq faqs={content.faqs} />
      <ConsultSection site={content.site} />
    </>
  );
}
