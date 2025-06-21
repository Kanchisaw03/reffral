import React from 'react';

export default function ScrollCard({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto bg-glass rounded-xl shadow-card p-4 border border-cyan-400/10 ${className}`}>
      {children}
    </div>
  );
} 