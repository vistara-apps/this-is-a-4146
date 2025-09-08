import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FileText, BarChart3, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

function CopyAnalysis() {
  const { 
    analyzeCopy, 
    copyAnalyses, 
    isLoading,
    usageCredits 
  } = useApp();

  const [copyText, setCopyText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usageCredits < 1) {
      alert('Not enough credits. Please upgrade your plan.');
      return;
    }

    if (!copyText.trim()) {
      alert('Please enter some copy to analyze.');
      return;
    }

    await analyzeCopy(copyText);
    setCopyText('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Copy Performance Analyzer
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Analyze your marketing copy to identify weak phrases, improve engagement, 
          and optimize for better conversion rates using AI-driven insights.
        </p>
      </div>

      {/* Copy Analysis Form */}
      <Card>
        <Card.Header>
          <Card.Title>Analyze Your Copy</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Marketing Copy"
              variant="textarea"
              value={copyText}
              onChange={(e) => setCopyText(e.target.value)}
              placeholder="Paste your marketing copy here (email, ad copy, landing page content, etc.)"
              rows={8}
              required
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                This will use 1 credit. You have {usageCredits} credits remaining.
              </div>
              <Button 
                type="submit" 
                loading={isLoading}
                disabled={usageCredits < 1}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Copy
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>

      {/* Analysis Results */}
      {copyAnalyses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Analysis Results ({copyAnalyses.length})
          </h2>
          <div className="space-y-6">
            {copyAnalyses.map((analysis) => (
              <Card key={analysis.id} className="overflow-hidden">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <Card.Title>Copy Analysis</Card.Title>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(analysis.score)} ${getScoreColor(analysis.score)}`}>
                      Score: {analysis.score}/100
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4">Performance Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-text-secondary">Clarity</div>
                        <div className="text-2xl font-bold text-text-primary">{analysis.analysisResult.clarity}/10</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-text-secondary">Engagement</div>
                        <div className="text-2xl font-bold text-text-primary">{analysis.analysisResult.engagement}/10</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-text-secondary">Persuasiveness</div>
                        <div className="text-2xl font-bold text-text-primary">{analysis.analysisResult.persuasiveness}/10</div>
                      </div>
                    </div>
                  </div>

                  {/* Issues Identified */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                      Issues Identified
                    </h4>
                    <div className="space-y-2">
                      {analysis.analysisResult.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-text-primary">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Improvements */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Suggested Improvements
                    </h4>
                    <div className="space-y-4">
                      {analysis.suggestedImprovements.map((improvement, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3">
                            <div className="text-sm font-medium text-text-secondary mb-1">Original:</div>
                            <div className="bg-red-50 p-3 rounded border-l-4 border-red-300">
                              {improvement.original}
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="text-sm font-medium text-text-secondary mb-1">Improved:</div>
                            <div className="bg-green-50 p-3 rounded border-l-4 border-green-300">
                              {improvement.improved}
                            </div>
                          </div>
                          <div className="text-sm text-text-secondary">
                            <strong>Reason:</strong> {improvement.reason}
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <Button variant="outline" size="sm">
                              Accept Change
                            </Button>
                            <Button variant="ghost" size="sm">
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Original Copy */}
                  <div>
                    <h4 className="font-semibold text-text-primary mb-4">Original Copy</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-text-primary">
                        {analysis.copyText}
                      </pre>
                    </div>
                  </div>

                  <div className="text-xs text-text-secondary">
                    Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {copyAnalyses.length === 0 && !isLoading && (
        <Card>
          <Card.Content className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Copy Analyzed Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Paste your marketing copy above to get AI-powered analysis and improvement suggestions.
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
              Analyzing Copy...
            </h3>
            <p className="text-text-secondary">
              Our AI is analyzing your copy for clarity, engagement, and persuasiveness.
            </p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

export default CopyAnalysis;