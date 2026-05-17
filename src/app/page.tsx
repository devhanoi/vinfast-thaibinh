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

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="pb-20 md:pb-0">
        <HeroSection />
        <BenefitsStrip />
        <PriceTable />
        <CarGrid />
        <ServiceCarsSection />
        <BikesSection />
        <FinanceSection />
        <TestDriveForm />
        <ChargingMapSection />
        <AftersalesSection />
        <WhyUsSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <ContactFooter />
      <StickyMobileCTA />
    </>
  );
}
