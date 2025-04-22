import React from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingElement({ children, className = '' }: FloatingElementProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}