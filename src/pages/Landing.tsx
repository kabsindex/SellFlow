import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SocialProof } from '../components/SocialProof';
import { ProblemSolution } from '../components/ProblemSolution';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { ProductMockup } from '../components/ProductMockup';
import { UseCases } from '../components/UseCases';
import { WhatsAppHighlight } from '../components/WhatsAppHighlight';
import { PaymentsDelivery } from '../components/PaymentsDelivery';
import { Testimonials } from '../components/Testimonials';
import { Pricing } from '../components/Pricing';
import { FAQ } from '../components/FAQ';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
export function Landing() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <ProductMockup />
        <UseCases />
        <WhatsAppHighlight />
        <PaymentsDelivery />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}
