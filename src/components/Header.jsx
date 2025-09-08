import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Menu, Bell, User } from 'lucide-react';

function Header({ onMenuClick }) {
  const { user, currentView } = useApp();

  const getPageTitle = () => {
    switch (currentView) {
      case 'ideas':
        return 'AI Idea Generation';
      case 'copy':
        return 'Copy Analysis';
      case 'outreach':
        return 'Outreach Automation';
      case 'community':
        return 'Community Insights';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-surface border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-100 relative">
            <Bell size={20} className="text-text-secondary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-text-primary">{user?.name}</div>
              <div className="text-xs text-text-secondary">{user?.email}</div>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;