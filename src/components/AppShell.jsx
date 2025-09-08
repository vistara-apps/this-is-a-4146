import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './views/Dashboard';
import IdeaGeneration from './views/IdeaGeneration';
import CopyAnalysis from './views/CopyAnalysis';
import OutreachAutomation from './views/OutreachAutomation';
import CommunityInsights from './views/CommunityInsights';
import Auth from './views/Auth';
import { Menu, X } from 'lucide-react';

function AppShell() {
  const { currentView, user, isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show auth view if not authenticated
  if (!isAuthenticated || currentView === 'login') {
    return <Auth />;
  }

  // Show loading if user data is still being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-2xl font-bold text-primary mb-2">Diginer Plus</div>
          <div className="text-text-secondary">Loading your AI growth partner...</div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'ideas':
        return <IdeaGeneration />;
      case 'copy':
        return <CopyAnalysis />;
      case 'outreach':
        return <OutreachAutomation />;
      case 'community':
        return <CommunityInsights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="text-xl font-bold text-primary">Diginer Plus</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="container">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
