import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import StickyContactBar from "./components/lead/StickyContactBar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BrandIcon } from "./components/common/BrandIcon";
import { SITE_CONFIG } from "./config/site";
import { initWebVitalsObserver, trackPageView, trackEvent } from "./lib/telemetry";
import { useDocumentMeta } from "./hooks/use-document-meta";

import Index from "./pages/Index";
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Appointment = lazy(() => import("./pages/Appointment"));
const QualityChecklist = lazy(() => import("./pages/QualityChecklist"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const Packages = lazy(() => import("./pages/Packages"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdhiAI = lazy(() => import("./pages/ai-bot"));

const queryClient = new QueryClient();

const RouteObserver = () => {
  const { pathname, search, hash } = useLocation();
  useDocumentMeta(pathname);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    trackPageView(pathname);
  }, [pathname, search, hash]);

  useEffect(() => {
    initWebVitalsObserver();
  }, []);

  return null;
};

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#FFFFFF]">
    <div className="text-xs uppercase tracking-[0.16em] text-[#777777]">Loading...</div>
  </div>
);

const WhatsAppFloating = () => {
  const whatsappMessage = "Hi! I'd like to discuss a construction project with Adithya Constructions.";
  const url = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <div className="fixed bottom-20 right-6 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => trackEvent({ event: "cta_click", metadata: { location: "floating_whatsapp" } })}
        className="w-12 h-12 bg-[#FFFFFF] border border-[#EAEAEA] text-[#111111] flex items-center justify-center hover:border-[#111111] hover:bg-[#F5F5F5] transition-colors"
      >
        <BrandIcon name="whatsapp" className="w-5 h-5" />
      </a>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#111111] overflow-x-clip">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#111111] focus:text-[#FFFFFF] focus:text-sm"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1 pb-12 lg:pb-0 min-w-0">
              <RouteObserver />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/appointment" element={<Appointment />} />
                  <Route path="/quality-checklist" element={<QualityChecklist />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <div className="hidden lg:block">
              <WhatsAppFloating />
            </div>
            <Suspense fallback={null}>
              <AdhiAI />
            </Suspense>
            <StickyContactBar />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
