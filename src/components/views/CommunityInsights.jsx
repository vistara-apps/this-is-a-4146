import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Users, TrendingUp, MessageCircle, Heart, AlertTriangle, Search } from 'lucide-react';

function CommunityInsights() {
  const { usageCredits } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock community data - replace with real API integration
  const mockInsights = [
    {
      id: 1,
      platform: 'Reddit',
      subreddit: 'r/entrepreneur',
      topic: 'AI Business Tools',
      sentiment: 'positive',
      engagement: 1250,
      trendScore: 95,
      summary: 'Strong interest in AI tools for automating business processes. Users discussing productivity gains and cost savings.',
      keyPhrases: ['AI automation', 'productivity', 'cost savings', 'efficiency'],
      discussionCount: 45,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      platform: 'Twitter',
      hashtag: '#DigitalMarketing',
      topic: 'Content Creation',
      sentiment: 'mixed',
      engagement: 850,
      trendScore: 78,
      summary: 'Mixed reactions to AI-generated content. Some praise efficiency, others worry about authenticity.',
      keyPhrases: ['AI content', 'authenticity', 'efficiency', 'quality'],
      discussionCount: 128,
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      group: 'SaaS Founders',
      topic: 'Customer Acquisition',
      sentiment: 'negative',
      engagement: 620,
      trendScore: 65,
      summary: 'Challenges with traditional customer acquisition methods. High CAC and low conversion rates mentioned.',
      keyPhrases: ['customer acquisition', 'high CAC', 'conversion rates', 'challenges'],
      discussionCount: 32,
      timestamp: '6 hours ago'
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredInsights = mockInsights.filter(insight => 
        insight.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insight.keyPhrases.some(phrase => phrase.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setInsights(filteredInsights);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Load initial insights
    setInsights(mockInsights);
  }, []);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      case 'mixed':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Heart className="w-4 h-4" />;
      case 'negative':
        return <AlertTriangle className="w-4 h-4" />;
      case 'mixed':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Community Sentiment Insights
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Analyze community discussions across platforms to identify trending topics, 
          gauge sentiment, and discover key engagement opportunities.
        </p>
      </div>

      {/* Search */}
      <Card>
        <Card.Header>
          <Card.Title>Search Community Discussions</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search for topics, keywords, or trends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" loading={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
          <div className="mt-4 text-sm text-text-secondary">
            Credits remaining: {usageCredits} • Real-time data from Reddit, Twitter, LinkedIn, and more
          </div>
        </Card.Content>
      </Card>

      {/* Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Content className="text-center p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">85%</div>
            <div className="text-sm text-text-secondary">Positive Sentiment</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center p-6">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">2.4K</div>
            <div className="text-sm text-text-secondary">Discussions Tracked</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center p-6">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">12</div>
            <div className="text-sm text-text-secondary">Trending Topics</div>
          </Card.Content>
        </Card>
      </div>

      {/* Insights Feed */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Latest Insights ({insights.length})
          </h2>
          <div className="space-y-6">
            {insights.map((insight) => (
              <Card key={insight.id} className="overflow-hidden">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-text-primary">
                        {insight.topic}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(insight.sentiment)}`}>
                        {getSentimentIcon(insight.sentiment)}
                        <span className="ml-1 capitalize">{insight.sentiment}</span>
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {insight.timestamp}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                    <span>{insight.platform}</span>
                    <span>•</span>
                    <span>{insight.subreddit || insight.hashtag || insight.group}</span>
                    <span>•</span>
                    <span>{insight.discussionCount} discussions</span>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-text-primary mb-3">Summary</h4>
                      <p className="text-text-secondary leading-relaxed">
                        {insight.summary}
                      </p>
                      
                      <h4 className="font-semibold text-text-primary mt-6 mb-3">Key Phrases</h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.keyPhrases.map((phrase, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-text-secondary">Engagement</div>
                        <div className="text-2xl font-bold text-text-primary">{insight.engagement.toLocaleString()}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-text-secondary">Trend Score</div>
                        <div className="text-2xl font-bold text-text-primary">{insight.trendScore}/100</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{ width: `${insight.trendScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs text-text-secondary">
                      Platform: {insight.platform} • Discussions: {insight.discussionCount}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="primary" size="sm">
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {insights.length === 0 && !isLoading && (
        <Card>
          <Card.Content className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Insights Available
            </h3>
            <p className="text-text-secondary mb-6">
              Search for topics or keywords to discover community insights and trending discussions.
            </p>
          </Card.Content>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <Card.Content className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Analyzing Communities...
            </h3>
            <p className="text-text-secondary">
              Scanning discussions across platforms for insights and trends.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

export default CommunityInsights;