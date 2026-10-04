import React from 'react';

interface ShishutaaLogoProps {
  className?: string;
  showTagline?: boolean;
}

export const ShishutaaLogo: React.FC<ShishutaaLogoProps> = ({ className = 'w-10 h-10', showTagline = false }) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* SVG Tree & Baby Lineart matching shishutaa.com */}
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main Tree Trunk & Leaves in Shishutaa Burgundy */}
          <path 
            d="M80 125 C75 110 65 100 50 95 C40 92 30 80 35 65 C40 50 55 45 70 52 C75 42 85 40 95 48 C105 40 120 45 122 60 C125 75 115 90 105 95 C90 100 85 110 80 125 Z" 
            stroke="#8C2237" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path 
            d="M80 125 C80 90 70 75 55 60 M80 90 C90 75 105 65 110 55 M65 80 C50 70 42 72 38 68 M95 80 C110 72 118 75 122 70" 
            stroke="#8C2237" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          {/* Leaves Details */}
          <circle cx="45" cy="55" r="3" fill="#8C2237" />
          <circle cx="60" cy="42" r="3" fill="#8C2237" />
          <circle cx="80" cy="38" r="3.5" fill="#8C2237" />
          <circle cx="100" cy="42" r="3" fill="#8C2237" />
          <circle cx="115" cy="55" r="3" fill="#8C2237" />

          {/* Baby sitting at trunk */}
          <circle cx="80" cy="132" r="7" stroke="#8C2237" strokeWidth="3" fill="#FFF" />
          <path d="M72 142 C72 136 88 136 88 142 L84 150 L76 150 Z" stroke="#8C2237" strokeWidth="3" fill="#FFF" strokeLinejoin="round" />

          {/* Hanging Charm Icons */}
          {/* Stethoscope (Pink) */}
          <path d="M25 45 C25 40 30 40 30 45 L30 50 C30 54 25 54 25 50 Z M27 54 L27 58" stroke="#F43F5E" strokeWidth="2.5" />
          {/* Fork & Knife (Pastel Green) */}
          <path d="M135 45 L135 55 M133 45 L133 50 M137 45 L137 50 M142 45 L142 55" stroke="#10B981" strokeWidth="2.5" />
          {/* Heart (Rose) */}
          <path d="M60 85 C58 82 54 82 53 85 C52 87 54 90 60 94 C66 90 68 87 67 85 C66 82 62 82 60 85 Z" fill="#F43F5E" />
          {/* Book (Orange) */}
          <rect x="95" y="82" width="10" height="12" rx="2" stroke="#F97316" strokeWidth="2" fill="none" />
          {/* Graduation Cap (Blue) */}
          <path d="M35 85 L45 80 L55 85 L45 90 Z M45 90 L45 95" stroke="#3B82F6" strokeWidth="2" fill="none" />
          {/* Game Controller (Yellow) */}
          <rect x="115" y="85" width="14" height="8" rx="3" stroke="#EAB308" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Brand Text */}
      <div>
        <span className="font-extrabold text-xl tracking-tight text-[#8C2237] block leading-none">
          SHISHUTAA<span className="text-rose-500 font-semibold">.ERP</span>
        </span>
        {showTagline && (
          <span className="text-[10px] text-slate-500 font-medium tracking-wide">
            Super Specialty Hospital & Pediatric Care
          </span>
        )}
      </div>
    </div>
  );
};
