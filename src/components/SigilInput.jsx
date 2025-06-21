import React from 'react';

export default function SigilInput({ label, value, className = '', ...props }) {
  const hasValue = value && value.length > 0;
  return (
    <div className={`relative mb-6 ${className}`}>
      <input
        {...props}
        value={value}
        className="peer w-full bg-glass text-white border border-cyan-400/20 rounded-lg px-4 py-3 focus:border-neon focus:ring-2 focus:ring-neon outline-none transition placeholder-transparent text-lg"
        placeholder=" "
        autoComplete="off"
      />
      <label
        className={
          `absolute left-4 px-1 transition-all duration-200 pointer-events-none bg-glass
          ${hasValue ? 'top-0 text-xs text-neon' : 'top-1/2 -translate-y-1/2 text-base text-cyan-200'}
          peer-focus:top-0 peer-focus:text-xs peer-focus:text-neon`
        }
      >
        {label}
      </label>
    </div>
  );
} 