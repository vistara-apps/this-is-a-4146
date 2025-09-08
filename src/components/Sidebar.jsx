import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Home, 
  Lightbulb, 
  FileText, 
  Send, 
  Users, 
  Settings,
  Crown,
  Zap
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'ideas', label: 'Idea Generation', icon: Lightbulb },
  { id: 'copy', label: 'Copy Analysis', icon: FileText },
  { id: 'outreach', label: 'Outreach Automation', icon: Send },
  { id: 'community', label: 'Community Insights', icon: Users },
];

function Sidebar() {
  const { currentView, setView, subscription, usageCredits } = useApp();

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-text-primary">Diginer Plus</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Usage & Subscription */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Credits</span>
            <span className="text-sm font-bold text-text-primary">{usageCredits}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${(usageCredits / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className={`w-4 h-4 ${subscription === 'free' ? 'text-gray-400' : 'text-yellow-500'}`} />
            <span className="text-sm font-medium capitalize text-text-primary">{subscription}</span>
          </div>
          {subscription === 'free' && (
            <button className="text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors">
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;