import React from 'react';

function Card({ children, className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-surface rounded-lg shadow-card',
    elevated: 'bg-surface rounded-lg shadow-modal',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;

export default Card;