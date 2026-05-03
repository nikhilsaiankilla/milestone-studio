import BentoGrid from "@/components/landing/BentoGrid";
import Featured from "@/components/landing/Featured";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Nav from "@/components/landing/nav";
import WhyIBuilt from "@/components/landing/WhyIBuilt";

export default function LandingPage() {
  return (
    // <div className="bg-black min-h-screen selection:bg-white selection:text-black">

    //   {/* OUTER CONTAINER: The dashed borders */}
    //   <div className="max-w-6xl mx-auto border-x border-dashed border-white/10 px-4 bg-grid-subtle">
    //   <Nav/>

    //     {/* INNER CONTENT AREA */}
    //     <main className="bg-black border-x border-dashed border-white/10 min-h-screen">
    //       <Hero />
          
    //       <div className="py-20 px-6">
    //          <h2 className="text-gray-500 text-sm font-mono mb-8 text-center uppercase tracking-widest">Selected Works</h2>
    //          <BentoGrid />
    //       </div>

    //       <WhyIBuilt />
    //       <Featured />
    //       <Footer />
    //     </main>

    //   </div>
    // </div>
    <div>
      <a href="https://www.scrolllaunch.com/products/milestone-studio?utm_source=badge&utm_medium=embed&utm_campaign=milestone-studio&ref=scrolllaunch" target="_blank" rel="noopener noreferrer">
  <img src="https://www.scrolllaunch.com/api/badge/milestone-studio" alt="Featured on ScrollLaunch" width="220" height="48" loading="lazy" />
</a>
      Please go back to https://milestonestudio.nikhilsai.in
    </div>
  )
}