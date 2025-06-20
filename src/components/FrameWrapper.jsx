import React from 'react';

export default function FrameWrapper({ children, className = '' }) {
  return (
    <div className={`bg-surface/80 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto px-4 md:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
}