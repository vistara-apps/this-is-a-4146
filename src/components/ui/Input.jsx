import React from 'react';

function Input({ 
  label,
  error,
  className = '',
  variant = 'default',
  ...props 
}) {
  const variants = {
    default: 'border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    textarea: 'border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical min-h-[100px]',
  };

  const Component = variant === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <Component
        className={`w-full ${variants[variant]} ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Input;