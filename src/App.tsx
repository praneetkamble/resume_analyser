import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import Interview from './pages/Interview';
import { MOCK_ANALYSIS } from './services/api';
import type { AnalysisReport } from './services/api';

function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [globalReport, setGlobalReport] = useState<AnalysisReport | null>(null);

  const handleViewDemo = () => {
    // Load mock report details and redirect to dashboard
    setGlobalReport(MOCK_ANALYSIS);
    setActivePage('dashboard');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} onViewDemo={handleViewDemo} />;
      case 'dashboard':
        return (
          <Dashboard
            initialReport={globalReport}
            setGlobalReport={setGlobalReport}
          />
        );
      case 'compare':
        return <Compare />;
      case 'interview':
        return <Interview globalReport={globalReport} />;
      default:
        return <Home setActivePage={setActivePage} onViewDemo={handleViewDemo} />;
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex flex-col font-inter">
      {/* Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Container */}
      <main className="flex-grow flex flex-col justify-start">
        {renderActivePage()}
      </main>

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}

export default App;
