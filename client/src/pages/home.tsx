import HeroSection from "@/components/home/hero-section";
import SearchSection from "@/components/home/search-section";
import FeaturedCars from "@/components/home/featured-cars";
import HowItWorks from "@/components/home/how-it-works";
import TopDrivers from "@/components/home/top-drivers";
import Testimonials from "@/components/home/testimonials";
import CallToAction from "@/components/home/call-to-action";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Zoro Cars - Premium Car Rentals";
  }, []);

  return (
    <div>
      <HeroSection />
      <SearchSection />
      <FeaturedCars />
      <HowItWorks />
      <TopDrivers />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;
