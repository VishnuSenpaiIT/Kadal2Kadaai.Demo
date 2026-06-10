import React from 'react';
// @ts-ignore
import logoImg from '../assets/images/image.png';

interface LogoProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', iconSize = 'md', showText = true, variant = 'light' }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: 'w-14 h-14',
      title: 'text-base sm:text-lg',
    },
    md: {
      container: 'w-20 h-20 sm:w-24 sm:h-24', // Majestic & highly visible
      title: 'text-xl sm:text-2xl md:text-3xl tracking-[0.05em]',
    },
    lg: {
      container: 'w-28 h-28 sm:w-32 sm:h-32',
      title: 'text-3xl sm:text-4xl tracking-wider',
    },
    xl: {
      container: 'w-36 h-36 sm:w-44 sm:h-44',
      title: 'text-4xl sm:text-5xl tracking-widest',
    }
  };

  const currentSize = sizeClasses[iconSize] || sizeClasses.md;
  const textColorClass = variant === 'light' ? 'text-white' : 'text-slate-900';

  return (
    <div id="kadal-corporate-logo" className={`flex items-center space-x-3.5 select-none ${className}`}>
      {/* High-fidelity Vector representation of the official corporate logo */}
      <div className={`relative shrink-0 ${currentSize.container} transition-all duration-300 hover:scale-105`}>
        <img
          src={logoImg}
          alt="Kadal 2 Kadaai Logo"
          className="w-full h-full object-cover rounded-full bg-white shadow-lg border border-white/20 shadow-cyan-950/20"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-logo font-black tracking-wider ${textColorClass} leading-none ${currentSize.title} uppercase select-none active:scale-98 transition-transform`}>
            KADAL <span className="text-cyan-400 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">2</span> KADAAI
          </span>
        </div>
      )}
    </div>
  );
}
