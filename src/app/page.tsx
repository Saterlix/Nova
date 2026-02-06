import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { WhyNova } from "@/components/sections/why-nova";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ContactForm } from "@/components/sections/contact-form";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <WhyNova />
      <HowItWorks />
      <ContactForm />
      <Footer />
    </main>
  );
}
