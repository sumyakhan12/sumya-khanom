import React from 'react';
import { Language } from '../types';
import { UI_COPY, pick } from '../i18n/translations';

interface MedioraLogoProps {
  variant?: 'desktop' | 'mobile' | 'icon';
  lang?: Language;
  compact?: boolean;
}

/**
 * Mediora Brand Mark
 * Abstract architectural "M" formed by two connected care arches with a subtle
 * vitality-pulse inflection in the center, a soft sage inner depth fold (#A9BDA8),
 * and a warm peach-coral (#E8B8A5) rising orb accent.
 */
export const MedioraLogo: React.FC<MedioraLogoProps> = ({
  variant = 'desktop',
  lang = 'en',
  compact = false,
}) => {
  const iconSize =
    variant === 'icon'
      ? 36
      : variant === 'mobile'
        ? 32
        : compact
          ? 34
          : 38;

  const mark = (
    <span className="relative inline-flex items-center justify-center shrink-0">
      {/* Subtle warm peach-coral organic halo behind upper-right corner on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F3D8CC] opacity-75 transition-transform duration-300 ease-out group-hover:scale-125"
      />
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-200 ease-out group-hover:scale-[1.03]"
        aria-hidden="true"
      >
        {/* Rounded architectural squircle container in Deep Forest Teal */}
        <rect width="40" height="40" rx="12" fill="#245B52" />

        {/* Subtle Soft Sage curved depth ribbon forming the inner care arc */}
        <path
          d="M11 28.5V17.2C11 13.8 14.9 12.2 17.2 14.7L20 17.8L22.8 14.7C25.1 12.2 29 13.8 29 17.2V28.5"
          stroke="#A9BDA8"
          strokeOpacity="0.45"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crisp Ivory continuous ribbon "M" with kinetic pulse inflection */}
        <path
          d="M11.2 28V16.8C11.2 14.1 14.4 12.8 16.3 14.8L20 19L23.7 14.8C25.6 12.8 28.8 14.1 28.8 16.8V28"
          stroke="#FFFDF8"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Delicate horizontal vitality pulse accent at center valley */}
        <path
          d="M17.2 24.5H22.8"
          stroke="#A9BDA8"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Signature Soft Peach-Coral vitality orb accent */}
        <circle cx="29.2" cy="10.8" r="3.4" fill="#E8B8A5" />
      </svg>
    </span>
  );

  if (variant === 'icon') {
    return mark;
  }

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      {mark}
      <span className="inline-flex items-baseline gap-0.5">
        <span
          className={`font-extrabold tracking-[-0.035em] text-[#25332F] transition-all duration-200 ${
            variant === 'mobile'
              ? 'text-[19px]'
              : compact
                ? 'text-[20px]'
                : 'text-[22px]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {pick(UI_COPY.brand, lang)}
        </span>
        {/* Small signature peach-coral brand dot */}
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#E8B8A5] mb-0.5 transition-transform duration-200 group-hover:scale-125"
        />
      </span>
    </span>
  );
};
