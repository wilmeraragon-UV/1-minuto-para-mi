import React from 'react';
import huvIconUrl from '../assets/huv_icon.png';
import huvLogoFullUrl from '../assets/huv_logo_transparent.png';

interface HuvBadgeProps {
  variant?: 'full' | 'compact' | 'minimal' | 'logo-only';
  className?: string;
}

export const HuvBadge: React.FC<HuvBadgeProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'logo-only') {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={huvLogoFullUrl}
          alt="Hospital Universitario del Valle Evaristo García E.S.E."
          className="h-10 sm:h-12 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Isotipo Real del HUV: Fachada arquitectónica histórica con torre H.U.V */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-[#0A3B74]/20 p-1 shadow-sm shadow-[#0A3B74]/10 hover:border-[#009BB0]/40 transition-colors flex items-center justify-center overflow-hidden">
        <img
          src={huvIconUrl}
          alt="Logo oficial Hospital Universitario del Valle"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {variant !== 'minimal' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-black tracking-wide text-[#0A3B74]">
              H.U.V
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#009BB0]" />
            <span className="text-[10px] font-bold tracking-wider text-[#009BB0] uppercase">
              Evaristo García E.S.E.
            </span>
          </div>

          <span className="text-xs font-bold text-slate-800">
            Hospital Universitario del Valle
          </span>

          {variant === 'full' && (
            <span className="text-[10px] text-slate-500 font-medium">
              Cali • Valle del Cauca • Colombia
            </span>
          )}
        </div>
      )}
    </div>
  );
};
