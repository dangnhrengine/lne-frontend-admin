import React from 'react';

interface IBlankLayoutProps {
  children: React.ReactNode;
}

export const BlankLayout: React.FC<IBlankLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}; 