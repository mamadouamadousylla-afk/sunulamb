import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button = ({ className, variant = 'default', ...props }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = variant === 'outline' 
    ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  
  const classes = `${baseClasses} ${variantClasses} ${className}`;
  
  return (
    <button className={classes} {...props} />
  );
};