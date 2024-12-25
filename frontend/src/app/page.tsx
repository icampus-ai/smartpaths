import { Header } from "../sections/Header";
import { Hero } from "../sections/Hero";
// import { LogoTicker } from "@/sections/LogoTicker"; 
import { ProductShowcase } from "@/sections/ProductShowcase";
import { ProductFeedback } from "@/sections/ProductFeedback"; 
import { Pricing } from "@/sections/Pricing";
import { CallToAction } from "@/sections/CallToAction"; 
import { Footer } from "@/sections/Footer"; 


export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      {/* <LogoTicker /> */}
      <ProductShowcase />
      <ProductFeedback /> 
      <Pricing />
      <CallToAction />
      <Footer />
    </>
  );
}
