import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Architecture from "@/components/landing/Architecture";
import CodeExample from "@/components/landing/CodeExample";
import UseCases from "@/components/landing/UseCases";
import Trust from "@/components/landing/Trust";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />
      <Architecture />
      <CodeExample />
      <UseCases />
      <Trust />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
};

export default Index;
