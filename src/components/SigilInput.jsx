import React from 'react';

export default function SigilInput({ label, value, className = '', ...props }) {
  const hasValue = value && value.length > 0;
  return (
    <div className={`relative mb-6 ${className}`}>
      <input
        {...props}
        value={value}
        className="peer w-full bg-surface/80 text-primary border border-muted rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
        placeholder=" "
        autoComplete="off"
      />
      <label
        className={
          `absolute left-4 bg-surface/80 px-1 transition-all duration-200 pointer-events-none
          ${hasValue ? 'top-0 text-xs text-blue-400' : 'top-1/2 -translate-y-1/2 text-base text-muted'}
          peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-400`
        }
      >
        {label}
      </label>
    </div>
  );
} 