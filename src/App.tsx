import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { MobileBottomBar } from './components/MobileBottomBar.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { BlogIndexPage } from './pages/BlogIndexPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';

// Scroll to top or anchor hash on route change
function ScrollAndHashHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Allow DOM to settle before scrolling
      const timeout = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');

  const handleOpenBooking = (treatmentName: string = '') => {
    setSelectedTreatment(treatmentName);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <ScrollAndHashHandler />

      {/* 1. Header with Blog & Section Links */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage onOpenBooking={handleOpenBooking} selectedTreatment={selectedTreatment} />}
          />
          <Route
            path="/blog"
            element={<BlogIndexPage onOpenBooking={() => handleOpenBooking()} />}
          />
          <Route
            path="/blog/:slug"
            element={<BlogPostPage onOpenBooking={handleOpenBooking} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer with Blog & Local Links */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Sticky Bottom Action Bar on Mobile */}
      <MobileBottomBar onOpenBooking={() => handleOpenBooking()} />

      {/* Accessible Interactive Booking Modal Dialog */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        defaultTreatment={selectedTreatment}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
