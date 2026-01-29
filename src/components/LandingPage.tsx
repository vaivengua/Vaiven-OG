import React from 'react';
import Navbar from './Navbar';
import HeroSection from './landing/HeroSection';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import DashboardPreview from './landing/DashboardPreview';
import ClientDashboardPreview from './landing/ClientDashboardPreview';
import TransporterDashboardPreview from './landing/TransporterDashboardPreview';
import TrackingPreview from './landing/TrackingPreview';
import MobilePreview from './landing/MobilePreview';
import CTASection from './landing/CTASection';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreview />
      <ClientDashboardPreview />
      <TransporterDashboardPreview />
      <TrackingPreview />
      <MobilePreview />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;