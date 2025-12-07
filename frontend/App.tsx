import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { WalletProvider } from './contexts/WalletContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Homepage from './pages/Homepage';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import Solutions from './pages/Solutions';
import Docs from './pages/Docs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Company from './pages/Company';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';

// Tools Pages
import GasCalculatorPage from './pages/tools/GasCalculator';
import ContractTemplatesPage from './pages/tools/ContractTemplates';
import APIExplorer from './pages/APIExplorer';
import SDKs from './pages/SDKs';
import APIKeys from './pages/APIKeys';

// Monitoring
import { ErrorBoundary, initSentry, initWebVitals } from './lib/monitoring';

// PWA
import PWAInstaller from './components/PWAInstaller';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function AppInner() {
  useEffect(() => {
    // Initialize monitoring
    initSentry();
    initWebVitals();

    // Register service worker for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/docs/*" element={<Docs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/company" element={<Company />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/api-keys" element={<APIKeys />} />
            
            {/* Tools */}
            <Route path="/tools/gas-calculator" element={<GasCalculatorPage />} />
            <Route path="/tools/contract-templates" element={<ContractTemplatesPage />} />
            <Route path="/api-explorer" element={<APIExplorer />} />
            <Route path="/sdks" element={<SDKs />} />
            
            {/* Redirect old paths */}
            <Route path="/gas-calculator" element={<GasCalculatorPage />} />
          </Routes>
        </main>
        <Footer />
        
        {/* Global Components */}
        <Toaster />
        <PWAInstaller />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <I18nProvider defaultLanguage="en">
            <WalletProvider>
              <AppInner />
            </WalletProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;