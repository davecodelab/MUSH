'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHostel } from '@/context/HostelContext';
import { Preloader } from '@/components/Preloader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { QuickSearchWidget } from '@/components/QuickSearchWidget';
import { WhyMushia } from '@/components/WhyMushia';
import { RoomTypesShowcase } from '@/components/RoomTypesShowcase';
import { FloorExplorer } from '@/components/FloorExplorer';
import { RoomCatalog } from '@/components/RoomCatalog';
import { RoomDetailModal } from '@/components/RoomDetailModal';
import { BookingFlowModal } from '@/components/BookingFlowModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { RoommateMatching } from '@/components/RoommateMatching';
import { StudentDashboard } from '@/components/StudentDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { FacilitiesSection } from '@/components/FacilitiesSection';
import { GallerySection } from '@/components/GallerySection';
import { LocationSection } from '@/components/LocationSection';
import { LoginRegisterModal } from '@/components/LoginRegisterModal';
import { HowItWorks } from '@/components/HowItWorks';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const { activeView } = useHostel();
  const [initialTypeFilter, setInitialTypeFilter] = useState<string>('all');
  const [isPreloading, setIsPreloading] = useState(true);

  // Scroll to top smoothly on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <>
      {/* Animated Preloader */}
      <AnimatePresence>
        {isPreloading && (
          <Preloader onComplete={() => setIsPreloading(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-[#F4EFE7] text-[#2A2827]">
        {/* Top Navigation Bar */}
        <Navbar />

        {/* Main Content with View Transitions */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {activeView === 'home' && (
                <>
                  <Hero />
                  <QuickSearchWidget 
                    onSearchApply={(filters) => {
                      setInitialTypeFilter(filters.roomType);
                    }} 
                  />
                  <WhyMushia />
                  <RoomTypesShowcase 
                    onSelectType={(type) => {
                      setInitialTypeFilter(type);
                    }} 
                  />
                  <FloorExplorer />
                  <FacilitiesSection />
                  <GallerySection />
                  <HowItWorks />
                  <LocationSection />
                  <FAQSection />
                </>
              )}

              {activeView === 'rooms' && (
                <RoomCatalog initialTypeFilter={initialTypeFilter} />
              )}

              {activeView === 'floor-explorer' && (
                <div className="pt-4">
                  <FloorExplorer />
                </div>
              )}

              {activeView === 'facilities' && (
                <div className="pt-4">
                  <FacilitiesSection />
                </div>
              )}

              {activeView === 'gallery' && (
                <div className="pt-4">
                  <GallerySection />
                </div>
              )}

              {activeView === 'location' && (
                <div className="pt-4">
                  <LocationSection />
                </div>
              )}

              {activeView === 'how-it-works' && (
                <div className="pt-4">
                  <HowItWorks />
                </div>
              )}

              {activeView === 'roommates' && (
                <RoommateMatching />
              )}

              {activeView === 'dashboard' && (
                <StudentDashboard />
              )}

              {activeView === 'admin' && (
                <AdminDashboard />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Interactive Modals */}
        <LoginRegisterModal />
        <RoomDetailModal />
        <BookingFlowModal />
        <ReceiptModal />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
