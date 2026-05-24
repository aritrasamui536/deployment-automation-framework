import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FrameworksSection from './components/FrameworksSection';
import PipelineSection from './components/PipelineSection';
import CompareSection from './components/CompareSection';
import DocsSection from './components/DocsSection';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Toast, { useToast } from './components/Toast';
import BackToTop from './components/BackToTop';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [darkMode, setDarkMode] = useState(true);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const renderContent = () => {
    switch (activeSection) {
      case 'frameworks': return <FrameworksSection />;
      case 'pipeline':   return <PipelineSection />;
      case 'compare':    return <CompareSection />;
      case 'docs':       return <DocsSection />;
      case 'dashboard':  return <Dashboard addToast={addToast} />;
      default:           return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main style={{ flex: 1, paddingTop: '60px' }}>
        {renderContent()}
      </main>
      <Footer />
      <Toast toasts={toasts} />
      <BackToTop />
    </div>
  );
}

export default App;