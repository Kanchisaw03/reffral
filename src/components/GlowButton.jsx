import React from 'react';

export default function GlowButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`relative px-6 py-2 rounded-xl font-heading text-lg bg-black/60 bg-glass text-white shadow-[0_0_6px_1px_#38bdf8,0_0_12px_2px_#a78bfa10] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_10px_2px_#38bdf8,0_0_20px_4px_#a78bfa20] focus:outline-none text-glow/40 font-semibold ${className}`}
    >
      <span className="text-glow/80 text-white font-semibold">{children}</span>
    </button>
  );
}