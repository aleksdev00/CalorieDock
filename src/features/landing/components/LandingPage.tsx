import { AudienceSection } from "./AudienceSection"
import { FeatureGrid } from "./FeatureGrid"
import { FinalCta } from "./FinalCta"
import { HeroSection } from "./HeroSection"
import { HowItWorks } from "./HowItWorks"
import { LandingFooter } from "./LandingFooter"
import { LandingHeader } from "./LandingHeader"
import { MetricsStrip } from "./MetricsStrip"
import { ProductSpotlight } from "./ProductSpotlight"

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <LandingHeader />
      <main>
        <HeroSection />
        <MetricsStrip />
        <FeatureGrid />
        <ProductSpotlight />
        <HowItWorks />
        <AudienceSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
