import { SiteHeader } from "@/components/sections/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { BenefitsStrip } from "@/components/sections/benefits-strip";
import { PriceTable } from "@/components/sections/price-table";
import { CarGrid } from "@/components/sections/car-grid";
import { ServiceCarsSection } from "@/components/sections/service-cars-section";
import { BikesSection } from "@/components/sections/bikes-section";
import { FinanceSection } from "@/components/sections/finance-section";
import { TestDriveForm } from "@/components/sections/test-drive-form";
import { ChargingMapSection } from "@/components/sections/charging-map-section";
import { AftersalesSection } from "@/components/sections/aftersales-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactFooter } from "@/components/sections/contact-footer";
import { StickyMobileCTA } from "@/components/sections/sticky-mobile-cta";
import { IntroSection } from "@/components/sections/intro-section";
import { getHomePageData } from "@/server/cms/data";

export const revalidate = 300;

export default async function HomePage() {
  const data = await getHomePageData();
  return (
    <>
      <SiteHeader site={data.site} />
      <main className="pb-20 md:pb-0">
        <HeroSection slides={data.heroSlides} />
        <IntroSection site={data.site} />
        <BenefitsStrip />
        <PriceTable cars={data.cars} site={data.site} />
        <CarGrid cars={data.cars} />
        <ServiceCarsSection cars={data.serviceCars} />
        <BikesSection bikes={data.bikes} />
        <FinanceSection />
        <TestDriveForm cars={data.cars} />
        <ChargingMapSection districts={data.chargingStations} totalStations={data.totalStations} />
        <AftersalesSection />
        <WhyUsSection />
        <TestimonialsSection testimonials={data.testimonials} />
        <FaqSection faqs={data.faqs} />
      </main>
      <ContactFooter site={data.site} />
      <StickyMobileCTA />
    </>
  );
}
