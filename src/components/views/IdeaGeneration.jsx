import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Lightbulb, Plus, Tag, Trash2 } from 'lucide-react';

function IdeaGeneration() {
  const { 
    generateIdeas, 
    generatedIdeas, 
    addProject, 
    projects,
    isLoading,
    usageCredits 
  } = useApp();

  const [formData, setFormData] = useState({
    projectName: '',
    niche: '',
    targetAudience: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usageCredits < 3) {
      alert('Not enough credits. Please upgrade your plan.');
      return;
    }

    const projectData = {
      ...formData,
      id: Date.now(),
    };

    addProject(projectData);
    await generateIdeas(projectData);
    
    // Reset form
    setFormData({
      projectName: '',
      niche: '',
      targetAudience: '',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          AI Idea Generation Engine
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Leverage AI to brainstorm niche-specific business ideas, marketing angles, 
          and content topics based on your inputs and industry trends.
        </p>
      </div>

      {/* Idea Generation Form */}
      <Card>
        <Card.Header>
          <Card.Title>Generate New Ideas</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="e.g., My SaaS Startup"
                required
              />
              <Input
                label="Niche/Industry"
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                placeholder="e.g., Digital Marketing, E-commerce"
                required
              />
            </div>
            
            <Input
              label="Target Audience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              placeholder="e.g., Small business owners, Content creators"
              required
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                This will use 3 credits. You have {usageCredits} credits remaining.
              </div>
              <Button 
                type="submit" 
                loading={isLoading}
                disabled={usageCredits < 3}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Ideas
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>

      {/* Generated Ideas */}
      {generatedIdeas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Generated Ideas ({generatedIdeas.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-modal transition-shadow">
                <Card.Content>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-text-primary flex-1">
                      {idea.title}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">
                        Project: {projects.find(p => p.id === idea.projectId)?.projectName || 'Unknown'}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Refine
                        </Button>
                        <Button variant="primary" size="sm">
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedIdeas.length === 0 && !isLoading && (
        <Card>
          <Card.Content className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Ideas Generated Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Fill out the form above to generate your first set of AI-powered business ideas.
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
              Generating Ideas...
            </h3>
            <p className="text-text-secondary">
              Our AI is analyzing your inputs and generating creative business ideas.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

export default IdeaGeneration;