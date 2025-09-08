import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { 
  Lightbulb, 
  FileText, 
  Send, 
  Users, 
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react';

function Dashboard() {
  const { 
    setView, 
    projects, 
    generatedIdeas, 
    copyAnalyses, 
    outreachSequences,
    usageCredits,
    subscription 
  } = useApp();

  const stats = [
    {
      title: 'Generated Ideas',
      value: generatedIdeas.length,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Copy Analyses',
      value: copyAnalyses.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Outreach Sequences',
      value: outreachSequences.length,
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Projects',
      value: projects.length,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const quickActions = [
    {
      title: 'Generate New Ideas',
      description: 'Brainstorm fresh business concepts with AI',
      icon: Lightbulb,
      action: () => setView('ideas'),
      color: 'bg-yellow-500',
    },
    {
      title: 'Analyze Copy',
      description: 'Improve your marketing copy performance',
      icon: FileText,
      action: () => setView('copy'),
      color: 'bg-blue-500',
    },
    {
      title: 'Create Outreach',
      description: 'Automate personalized outreach sequences',
      icon: Send,
      action: () => setView('outreach'),
      color: 'bg-green-500',
    },
    {
      title: 'Community Insights',
      description: 'Analyze trends and sentiment',
      icon: Users,
      action: () => setView('community'),
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-extrabold text-text-primary mb-4">
          Welcome to Diginer Plus
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Your AI growth partner for smarter business ideas and outreach. 
          Generate ideas, analyze copy, automate outreach, and gain community insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-text-secondary">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Usage Status */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Usage & Subscription</Card.Title>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-semibold text-text-primary">{usageCredits} credits left</span>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <p className="text-text-secondary">
                You're on the <span className="font-semibold capitalize">{subscription}</span> plan
              </p>
              <div className="w-full sm:w-64 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${(usageCredits / 10) * 100}%` }}
                />
              </div>
            </div>
            {subscription === 'free' && (
              <Button variant="primary">
                Upgrade Plan
              </Button>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-modal transition-shadow cursor-pointer" onClick={action.action}>
                <Card.Content className="text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {action.description}
                  </p>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Recent Activity</Card.Title>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          {generatedIdeas.length === 0 && copyAnalyses.length === 0 && outreachSequences.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity. Start by generating some ideas!</p>
              <Button 
                variant="primary" 
                className="mt-4"
                onClick={() => setView('ideas')}
              >
                Generate Ideas
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedIdeas.slice(-3).map((idea) => (
                <div key={idea.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-text-primary">{idea.title}</p>
                    <p className="text-sm text-text-secondary">Generated idea</p>
                  </div>
                </div>
              ))}
              {copyAnalyses.slice(-3).map((analysis) => (
                <div key={analysis.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-text-primary">Copy Analysis Complete</p>
                    <p className="text-sm text-text-secondary">Score: {analysis.score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

export default Dashboard;