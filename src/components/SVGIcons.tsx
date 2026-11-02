import React from 'react';

export const HeartIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className = "w-4 h-4", filled = true }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export const SparkleIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3 text-[#E9D08F]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export const CrownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-[#C9A24D]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V17H19V19Z" />
  </svg>
);

export const DownArrowIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

export const MusicNoteIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const ButterflySVG: React.FC<{ className?: string; size?: number; variant?: 'blush' | 'monarch' }> = ({
  className = "",
  size = 32,
  variant = 'blush'
}) => {
  const isMonarch = variant === 'monarch';
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size * 0.9 }}>
      {/* Left Wing */}
      <div className="absolute right-1/2 top-0 flap-left" style={{ width: size * 0.48, height: size * 0.85 }}>
        <svg viewBox="0 0 50 65" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <defs>
            <linearGradient id={`wingL-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2EB" />
              <stop offset="50%" stopColor="#F4CFC6" />
              <stop offset="100%" stopColor={isMonarch ? "#D87884" : "#C9A24D"} />
            </linearGradient>
          </defs>
          <path d="M48,34 C48,12 36,2 20,4 C6,6 2,18 5,34 C8,48 20,60 38,58 C46,56 48,46 48,34 Z"
                fill={`url(#wingL-${variant})`}
                stroke={isMonarch ? "#3B2A25" : "#C9A24D"}
                strokeWidth={isMonarch ? "1.2" : "0.7"} />
          {isMonarch && (
            <>
              <path d="M48,34 C36,22 22,20 10,26 M48,34 C32,32 18,36 12,44" fill="none" stroke="#3B2A25" strokeWidth="1" />
              <circle cx="14" cy="18" r="1.5" fill="#FFFFFF" />
              <circle cx="24" cy="12" r="1.5" fill="#FFFFFF" />
            </>
          )}
        </svg>
      </div>

      {/* Body */}
      <div className="w-[2px] h-[60%] bg-[#3B2A25] rounded-full z-10" />

      {/* Right Wing */}
      <div className="absolute left-1/2 top-0 flap-right" style={{ width: size * 0.48, height: size * 0.85 }}>
        <svg viewBox="0 0 50 65" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <defs>
            <linearGradient id={`wingR-${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF2EB" />
              <stop offset="50%" stopColor="#F4CFC6" />
              <stop offset="100%" stopColor={isMonarch ? "#D87884" : "#C9A24D"} />
            </linearGradient>
          </defs>
          <path d="M2,34 C2,12 14,2 30,4 C44,6 48,18 45,34 C42,48 30,60 12,58 C4,56 2,46 2,34 Z"
                fill={`url(#wingR-${variant})`}
                stroke={isMonarch ? "#3B2A25" : "#C9A24D"}
                strokeWidth={isMonarch ? "1.2" : "0.7"} />
          {isMonarch && (
            <>
              <path d="M2,34 C14,22 28,20 40,26 M2,34 C18,32 32,36 38,44" fill="none" stroke="#3B2A25" strokeWidth="1" />
              <circle cx="36" cy="18" r="1.5" fill="#FFFFFF" />
              <circle cx="26" cy="12" r="1.5" fill="#FFFFFF" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

