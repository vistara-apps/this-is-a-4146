import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 disabled:bg-gray-400',
    secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200 disabled:bg-gray-100',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-300 disabled:text-gray-400',
    ghost: 'text-text-primary hover:bg-gray-100 disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;