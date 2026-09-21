import React from 'react';

interface HuvBadgeProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export const HuvBadge: React.FC<HuvBadgeProps> = ({ variant = 'full', className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Isotipo HUV estilizado: Cruz de vida y hojas de serenidad */}
      <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A3B74] to-[#009BB0] p-0.5 shadow-md shadow-[#0A3B74]/15">
        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Fondo sutil azul institucional */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A3B74]/5 to-[#009BB0]/10" />
          
          <svg className="w-7 h-7 relative z-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cruz institucional médica */}
            <rect x="16" y="6" width="8" height="28" rx="3" fill="#0A3B74" />
            <rect x="6" y="16" width="28" height="8" rx="3" fill="#0A3B74" />
            
            {/* Centro armónico turquesa de respiración */}
            <circle cx="20" cy="20" r="4.5" fill="#009BB0" />
            
            {/* Acento rojo Univalle/Valle del Cauca en el núcleo */}
            <circle cx="20" cy="20" r="2" fill="#C41230" />
            
            {/* Arco de bienestar y respiración */}
            <path d="M 10 13 A 14 14 0 0 1 30 13" stroke="#009BB0" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M 10 27 A 14 14 0 0 0 30 27" stroke="#009BB0" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          </svg>
        </div>
      </div>

      {variant !== 'minimal' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-extrabold tracking-wide text-[#0A3B74] uppercase">
              HUV
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C41230]" />
            <span className="text-[10px] font-semibold tracking-wider text-[#009BB0] uppercase">
              Evaristo García E.S.E.
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-700">
            Hospital Universitario del Valle
          </span>

          {variant === 'full' && (
            <span className="text-[10px] text-slate-500 font-medium">
              Cali • Valle del Cauca • Salud & Docencia
            </span>
          )}
        </div>
      )}
    </div>
  );
};
