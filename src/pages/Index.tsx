import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import DoctorsSection from "@/components/DoctorsSection";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <DoctorsSection />
        <Services />
        <Contact />
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default Index;
