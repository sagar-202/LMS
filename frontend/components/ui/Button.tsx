import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-black rounded-2xl transition-all duration-200 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-xl shadow-blue-500/20',
      secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent',
      outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400',
      ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
      white: 'bg-white text-blue-600 hover:bg-blue-50 shadow-xl',
    };

    const sizes = {
      sm: 'px-6 py-2 text-xs uppercase tracking-widest',
      md: 'px-8 py-3 text-sm',
      lg: 'px-10 py-4 text-base',
      xl: 'px-12 py-5 text-lg',
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
      return (
        <Link href={href} className={combinedClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button 
        ref={ref as React.RefObject<HTMLButtonElement>} 
        className={combinedClasses} 
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
