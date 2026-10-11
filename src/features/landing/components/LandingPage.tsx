import { FeatureGrid } from "./FeatureGrid"
import { FinalCta } from "./FinalCta"
import { HeroSection } from "./HeroSection"
import { HowItWorks } from "./HowItWorks"
import { LandingFooter } from "./LandingFooter"
import { LandingHeader } from "./LandingHeader"
import { LandingMotion } from "./LandingMotion"

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <LandingMotion />
      <LandingHeader />
      <main>
        <HeroSection />
        <FeatureGrid />
        <HowItWorks />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
