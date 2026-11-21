import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Language, ScreenTab, VitalMetric, WellnessTip } from '../types';
import { WELLNESS_TIPS } from '../data/clinicalData';
import { UI_COPY, pick, toLocaleDigits } from '../i18n/translations';

type TipFilter = 'all' | 'vitals' | 'general';

interface DailyWellnessTipsProps {
  lang: Language;
  vitals: VitalMetric[];
  lastLoggedVitalId: string | null;
  onLogVitalRequest: (vitalId: string) => void;
  onNavigate: (tab: ScreenTab) => void;
}

function isVitalElevated(vital: VitalMetric | undefined): boolean {
  if (!vital) return false;
  if (vital.id === 'vital-bp') {
    const parts = vital.value.split('/').map((n) => parseFloat(n));
    const sys = parts[0];
    const dia = parts[1];
    if (!Number.isNaN(sys) && sys >= 125) return true;
    if (!Number.isNaN(dia) && dia >= 82) return true;
    return false;
  }
  const num = parseFloat(vital.value);
  if (Number.isNaN(num)) return false;
  if (vital.id === 'vital-hr') return num > 80 || num < 55;
  if (vital.id === 'vital-glucose') return num > 5.6;
  if (vital.id === 'vital-spo2') return num < 95;
  return false;
}

export const DailyWellnessTips: React.FC<DailyWellnessTipsProps> = ({
  lang,
  vitals,
  lastLoggedVitalId,
  onLogVitalRequest,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<TipFilter>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [practicedIds, setPracticedIds] = useState<Record<string, boolean>>({});

  const vitalsById = useMemo(() => {
    const map: Record<string, VitalMetric> = {};
    for (const v of vitals) {
      map[v.id] = v;
    }
    return map;
  }, [vitals]);

  const curatedTips = useMemo<WellnessTip[]>(() => {
    const bpElevated = isVitalElevated(vitalsById['vital-bp']);

    // Filter out non-matching BP condition variant so there is always 1 relevant BP tip
    const eligible = WELLNESS_TIPS.filter((tip) => {
      if (tip.relatedVitalId === 'vital-bp') {
        if (bpElevated && tip.vitalCondition === 'optimal') return false;
        if (!bpElevated && tip.vitalCondition === 'elevated') return false;
      }
      if (filter === 'vitals') return tip.category === 'vitals';
      if (filter === 'general') return tip.category === 'general';
      return true;
    });

    // Prioritize tips matching the most recently logged vital or any out-of-range vital
    return [...eligible].sort((a, b) => {
      const score = (tip: WellnessTip): number => {
        let s = 0;
        if (lastLoggedVitalId && tip.relatedVitalId === lastLoggedVitalId) s += 100;
        if (tip.relatedVitalId && isVitalElevated(vitalsById[tip.relatedVitalId])) s += 50;
        if (tip.category === 'vitals') s += 10;
        return s;
      };
      return score(b) - score(a);
    });
  }, [filter, vitalsById, lastLoggedVitalId]);

  // Reset to first prioritized tip when filter changes or a new vital is logged
  useEffect(() => {
    setActiveIndex(0);
  }, [filter, lastLoggedVitalId]);

  const safeIndex = curatedTips.length > 0 ? activeIndex % curatedTips.length : 0;
  const activeTip = curatedTips[safeIndex];

  if (!activeTip) return null;

  const linkedVital = activeTip.relatedVitalId
    ? vitalsById[activeTip.relatedVitalId]
    : undefined;
  const isPracticed = Boolean(practicedIds[activeTip.id]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + curatedTips.length) % curatedTips.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % curatedTips.length);
  };

  const handleTogglePracticed = () => {
    setPracticedIds((prev) => ({
      ...prev,
      [activeTip.id]: !prev[activeTip.id],
    }));
  };

  const formattedIndex = toLocaleDigits(String(safeIndex + 1).padStart(2, '0'), lang);
  const formattedTotal = toLocaleDigits(String(curatedTips.length).padStart(2, '0'), lang);

  return (
    <section
      aria-labelledby="wellness-tips-heading"
      className="relative overflow-hidden rounded-[28px] bg-[#E3ECE3] border border-[#CADAC8] shadow-mediora-1 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9"
    >
      {/* Subtle botanical sage & warm peach-coral atmospheric accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#A9BDA8]/35 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-12 w-60 h-60 rounded-full bg-[#F3D8CC]/45 blur-3xl"
      />

      <div className="relative z-10 space-y-6">
        {/* Header Row: Title + Interactive Segmented Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="wellness-tips-heading"
              className="text-[22px] sm:text-[26px] font-bold text-[#25332F] tracking-[-0.02em]"
            >
              {pick(UI_COPY.wellnessTips.heading, lang)}
            </h2>
            <p className="text-sm text-[#46564E] max-w-2xl">
              {pick(UI_COPY.wellnessTips.subtitle, lang)}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={pick(UI_COPY.wellnessTips.heading, lang)}
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#D4E2D3] border border-[#C2D4C1] self-start md:self-auto"
          >
            {(
              [
                { key: 'all', label: UI_COPY.wellnessTips.filterAll },
                { key: 'vitals', label: UI_COPY.wellnessTips.filterVitals },
                { key: 'general', label: UI_COPY.wellnessTips.filterGeneral },
              ] as const
            ).map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.key)}
                  className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] ${
                    active
                      ? 'bg-[#FFFDF8] text-[#25332F] shadow-mediora-1'
                      : 'text-[#3F4E47] hover:text-[#25332F]'
                  }`}
                >
                  {pick(tab.label, lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Editorial Tip Display (No nested boxed cards — clean whitespace + hairline dividers) */}
        <div className="border-t border-[#C7D7C5] pt-6 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
          {/* Left 8 Columns: Relevance Metadata + Curated Tip Headline & Prose */}
          <div className="lg:col-span-8 space-y-3.5">
            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#245B52]">
              <span>{pick(activeTip.topicLabel, lang)}</span>
              <span aria-hidden="true" className="text-[#8CA38B]">·</span>
              {linkedVital ? (
                <span className="text-[#3F4E47] tabular-nums">
                  {pick(UI_COPY.wellnessTips.matchedTo, lang)}{' '}
                  <strong className="font-bold text-[#25332F]">
                    {pick(linkedVital.label, lang)} ({toLocaleDigits(linkedVital.value, lang)}{' '}
                    {linkedVital.unit})
                  </strong>
                </span>
              ) : (
                <span className="text-[#3F4E47]">
                  {pick(UI_COPY.wellnessTips.generalMaintenance, lang)}
                </span>
              )}
              <span aria-hidden="true" className="text-[#8CA38B]">·</span>
              <span className="text-[#46564E]">{pick(activeTip.durationLabel, lang)}</span>
            </div>

            <h3
              className="text-[20px] sm:text-[24px] font-extrabold text-[#25332F] tracking-[-0.02em] leading-[1.25] max-w-2xl"
              style={{ textWrap: 'balance' }}
            >
              {pick(activeTip.title, lang)}
            </h3>

            <p className="text-[15px] text-[#3B4A43] leading-[1.68] max-w-2xl">
              {pick(activeTip.body, lang)}
            </p>
          </div>

          {/* Right 4 Columns: Actionable Habit + Direct Workflow Action */}
          <div className="lg:col-span-4 lg:border-l lg:border-[#C7D7C5] lg:pl-8 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#245B52]">
                {pick(UI_COPY.wellnessTips.tryTodayLabel, lang)}
              </p>
              <p className="text-sm font-medium text-[#25332F] leading-relaxed">
                {pick(activeTip.actionStep, lang)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleTogglePracticed}
                aria-pressed={isPracticed}
                className={`h-10 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] ${
                  isPracticed
                    ? 'bg-[#245B52] text-[#FFFDF8] hover:bg-[#1D4B43]'
                    : 'bg-[#FFFDF8] text-[#25332F] border border-[#C7D7C5] hover:bg-[#F3D8CC]/70 hover:border-[#E8B8A5]'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {isPracticed
                    ? pick(UI_COPY.wellnessTips.practicedToday, lang)
                    : pick(UI_COPY.wellnessTips.markPracticed, lang)}
                </span>
              </button>

              {linkedVital ? (
                <button
                  type="button"
                  onClick={() => onLogVitalRequest(linkedVital.id)}
                  className="h-10 px-3 text-xs font-bold text-[#245B52] hover:text-[#1D4B43] inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{pick(UI_COPY.wellnessTips.updateVitalCta, lang)}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('doctors')}
                  className="h-10 px-3 text-xs font-bold text-[#245B52] hover:text-[#1D4B43] inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] rounded-lg"
                >
                  <span>{pick(UI_COPY.wellnessTips.consultDoctorCta, lang)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Rotation Bar: Step Indicators + Tabular Counter + Prev/Next Controls */}
        <div className="border-t border-[#C7D7C5] pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5" role="group" aria-label="Select wellness tip">
              {curatedTips.map((tip, idx) => {
                const isCurrent = idx === safeIndex;
                return (
                  <button
                    key={tip.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`${pick(tip.topicLabel, lang)} (${idx + 1}/${curatedTips.length})`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`h-2 rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] ${
                      isCurrent
                        ? 'w-7 bg-[#245B52]'
                        : 'w-2.5 bg-[#B3C7B2] hover:bg-[#E8B8A5]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#46564E] tabular-nums">
              <span className="font-bold text-[#25332F]">
                {formattedIndex} / {formattedTotal}
              </span>
              <span aria-hidden="true" className="text-[#8CA38B]">·</span>
              <span>{pick(activeTip.sourceNote, lang)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={pick(UI_COPY.wellnessTips.prevTip, lang)}
              className="h-10 w-10 rounded-xl bg-[#FFFDF8] border border-[#C7D7C5] hover:bg-[#F3D8CC]/70 hover:border-[#E8B8A5] text-[#25332F] inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="h-10 px-4 rounded-xl bg-[#FFFDF8] border border-[#C7D7C5] hover:bg-[#F3D8CC]/70 hover:border-[#E8B8A5] text-[#25332F] text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52]"
            >
              <span>{pick(UI_COPY.wellnessTips.nextTip, lang)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
