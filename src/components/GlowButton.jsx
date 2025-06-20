import React from 'react';

export default function GlowButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:from-blue-500 hover:to-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    >
      {children}
    </button>
  );
}