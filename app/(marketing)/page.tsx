import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";
import ServicesLanding from "@/components/sections/services-landing";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <ServicesLanding />
      {/* Restul secțiunilor demo rămân comentate sau șterse */}
      {/* <PreviewLanding /> */}
      {/* <Powered /> */}
      {/* <BentoGrid /> */}
      {/* <Features /> */}
      {/* <Testimonials /> */}
    </>
  );
}
