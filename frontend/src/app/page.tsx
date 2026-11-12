import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ConsultationForm from "@/components/ConsultationForm";
import Champions from "@/components/Champions";
import Testimonials from "@/components/Testimonials";
import BmiCalculator from "@/components/BmiCalculator";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white">
      <Header />
      <Hero />
      <About />
      <ConsultationForm />
      <Champions />
      <Testimonials />
      <BmiCalculator />
      <BlogSection />
    </main>
  );
}
