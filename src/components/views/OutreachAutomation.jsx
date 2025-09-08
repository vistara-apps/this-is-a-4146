import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Send, Plus, Clock, Mail, Users, Play } from 'lucide-react';

function OutreachAutomation() {
  const { 
    createOutreachSequence, 
    outreachSequences, 
    isLoading 
  } = useApp();

  const [formData, setFormData] = useState({
    sequenceName: '',
    niche: '',
    targetAudience: '',
    sequenceGoal: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOutreachSequence(formData);
    
    // Reset form
    setFormData({
      sequenceName: '',
      niche: '',
      targetAudience: '',
      sequenceGoal: '',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Send className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Personalized Outreach Automator
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Create automated, personalized follow-up sequences and engagement messages 
          based on user interaction history and predefined triggers.
        </p>
      </div>

      {/* Create Sequence Form */}
      <Card>
        <Card.Header>
          <Card.Title>Create New Outreach Sequence</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Sequence Name"
                name="sequenceName"
                value={formData.sequenceName}
                onChange={handleInputChange}
                placeholder="e.g., Product Launch Follow-up"
                required
              />
              <Input
                label="Niche/Industry"
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                placeholder="e.g., SaaS, E-commerce"
                required
              />
            </div>
            
            <Input
              label="Target Audience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleInputChange}
              placeholder="e.g., Small business owners, Marketing managers"
              required
            />

            <Input
              label="Sequence Goal"
              name="sequenceGoal"
              value={formData.sequenceGoal}
              onChange={handleInputChange}
              placeholder="e.g., Book demo, Download whitepaper, Sign up for trial"
              required
            />

            <div className="flex justify-end">
              <Button 
                type="submit" 
                loading={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Sequence
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>

      {/* Existing Sequences */}
      {outreachSequences.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Your Outreach Sequences ({outreachSequences.length})
          </h2>
          <div className="space-y-6">
            {outreachSequences.map((sequence) => (
              <Card key={sequence.id} className="overflow-hidden">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <Card.Title>{sequence.sequenceName}</Card.Title>
                      <p className="text-sm text-text-secondary mt-1">
                        Target: {sequence.targetAudience} • Goal: {sequence.sequenceGoal}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  {/* Sequence Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{sequence.messages.length}</div>
                      <div className="text-sm text-blue-600">Messages</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-green-600">Recipients</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">0%</div>
                      <div className="text-sm text-yellow-600">Open Rate</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Send className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">0%</div>
                      <div className="text-sm text-purple-600">Response Rate</div>
                    </div>
                  </div>

                  {/* Message Timeline */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4">Message Timeline</h4>
                    <div className="space-y-4">
                      {sequence.messages.map((message, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-text-primary">
                              Day {message.day}: {message.subject}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Preview
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-text-secondary bg-gray-50 p-3 rounded">
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-text-secondary">
                    Created on {new Date(sequence.createdAt).toLocaleDateString()} • 
                    Niche: {sequence.niche}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {outreachSequences.length === 0 && !isLoading && (
        <Card>
          <Card.Content className="text-center py-12">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Outreach Sequences Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first automated outreach sequence to start nurturing leads 
              with personalized, timely messages.
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
              Creating Sequence...
            </h3>
            <p className="text-text-secondary">
              Our AI is crafting personalized messages for your outreach sequence.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

export default OutreachAutomation;