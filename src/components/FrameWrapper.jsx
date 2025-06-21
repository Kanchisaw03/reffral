import React from 'react';

export default function FrameWrapper({ children, className = '' }) {
  return (
    <div className={`bg-glass rounded-2xl shadow-card p-8 backdrop-blur-xl border border-cyan-400/20 ${className}`}>
      {children}
    </div>
  );
}