import React from 'react';
import { ArrowRight, Star, Zap, Shield, TrendingUp } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const FeatureCard = ({ 
  variant = 'default',
  title,
  description,
  icon: Icon,
  features = [],
  action,
  badge,
  stats,
  className = '',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'shadow-modal hover:shadow-lg transition-shadow duration-200';
      case 'highlighted':
        return 'border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5';
      case 'compact':
        return 'p-4';
      default:
        return 'hover:shadow-lg transition-shadow duration-200';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'highlighted':
        return 'text-primary';
      default:
        return 'text-accent';
    }
  };

  return (
    <Card 
      variant={variant === 'elevated' ? 'elevated' : 'default'}
      className={`relative overflow-hidden ${getVariantClasses()} ${className}`}
      {...props}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-white">
            {badge.icon && <badge.icon className="w-3 h-3 mr-1" />}
            {badge.text}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {Icon && (
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${getIconColor()}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Features List */}
      {features.length > 0 && (
        <div className="mb-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action */}
      {action && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant={variant === 'highlighted' ? 'primary' : 'outline'}
            onClick={action.onClick}
            className="flex items-center gap-2"
          >
            {action.label}
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          {action.secondary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.secondary.onClick}
              className="text-gray-500"
            >
              {action.secondary.label}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

// Preset feature cards for common use cases
export const IdeaGenerationCard = (props) => (
  <FeatureCard
    icon={Zap}
    title="AI Idea Generation"
    description="Generate innovative business ideas tailored to your niche and target audience using advanced AI."
    features={[
      "Industry-specific idea generation",
      "Market trend analysis",
      "Competitive landscape insights",
      "Scalability assessment"
    ]}
    badge={{ text: "Popular", icon: Star }}
    {...props}
  />
);

export const CopyAnalysisCard = (props) => (
  <FeatureCard
    icon={TrendingUp}
    title="Copy Performance Analysis"
    description="Analyze and optimize your marketing copy for maximum engagement and conversion rates."
    features={[
      "Sentiment analysis",
      "Readability scoring",
      "Engagement prediction",
      "A/B test suggestions"
    ]}
    badge={{ text: "Pro", icon: Shield }}
    {...props}
  />
);

export const OutreachCard = (props) => (
  <FeatureCard
    icon={Shield}
    title="Automated Outreach"
    description="Create personalized outreach sequences that nurture leads and build stronger relationships."
    features={[
      "Personalization at scale",
      "Multi-channel sequences",
      "Response tracking",
      "Follow-up automation"
    ]}
    {...props}
  />
);

export default FeatureCard;
