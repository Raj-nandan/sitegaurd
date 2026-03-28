import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import LogosBar from '../components/landing/LogosBar';
import FeaturesBento from '../components/landing/FeaturesBento';
import FeatureBlocks from '../components/landing/FeatureBlocks';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

const Landing = () => (
  <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
    <Navbar />
    <main>
      <Hero />
      <LogosBar />
      <FeaturesBento />
      <FeatureBlocks />
      <Testimonials />
      <Pricing />
      <CtaSection />
    </main>
    <Footer />
  </div>
);

export default Landing;
