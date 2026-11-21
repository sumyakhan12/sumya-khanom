import React from 'react';
import { Language } from '../types';
import { UI_COPY, pick, toLocaleDigits } from '../i18n/translations';

interface ProviderAvailabilityBarProps {
  segments: boolean[];
  lang: Language;
  compact?: boolean;
}

export const ProviderAvailabilityBar: React.FC<ProviderAvailabilityBarProps> = ({
  segments,
  lang,
  compact = false,
}) => {
  const openCount = segments.filter(Boolean).length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-[#245B52] tabular-nums">
          {toLocaleDigits(openCount, lang)} / {toLocaleDigits(segments.length, lang)}{' '}
          {pick(UI_COPY.workspace.openSlotsLabel, lang)}
        </span>
        {!compact && (
          <div className="flex items-center gap-3 text-[11px] text-[#747C73]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm bg-[#397C70]" aria-hidden="true" />
              {pick(UI_COPY.workspace.openLabel, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm bg-[#E7DFD2]" aria-hidden="true" />
              {pick(UI_COPY.workspace.bookedLabel, lang)}
            </span>
          </div>
        )}
      </div>

      <div
        className="grid grid-cols-12 gap-1"
        role="img"
        aria-label={`${openCount} of ${segments.length} appointment slots available`}
      >
        {segments.map((isOpen, idx) => (
          <span
            key={idx}
            className={`h-2 rounded-[3px] transition-colors ${
              isOpen ? 'bg-[#397C70]' : 'bg-[#E7DFD2]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
