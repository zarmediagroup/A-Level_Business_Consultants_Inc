import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Services from "@/components/public/Services";
import Team from "@/components/public/Team";
import Testimonials from "@/components/public/Testimonials";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
