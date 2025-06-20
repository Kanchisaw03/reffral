import React from 'react';

export default function ScrollCard({ children, className = '' }) {
  return (
    <div className={`bg-surface/90 rounded-xl shadow-lg p-6 my-4 ${className}`}>
      {children}
    </div>
  );
} 