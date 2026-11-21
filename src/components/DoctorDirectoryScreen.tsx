import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  MapPin,
  Search,
  Star,
  Video,
  X,
} from 'lucide-react';
import { Doctor, Language } from '../types';
import { SPECIALTIES } from '../data/clinicalData';
import { UI_COPY, formatBDT, pick, toLocaleDigits } from '../i18n/translations';
import { DoctorAvatar } from './DoctorAvatar';
import { ProviderAvailabilityBar } from './ProviderAvailabilityBar';

interface DoctorDirectoryScreenProps {
  lang: Language;
  doctors: Doctor[];
  presetQuery?: string;
  presetSpecialty?: string;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorDirectoryScreen: React.FC<DoctorDirectoryScreenProps> = ({
  lang,
  doctors,
  presetQuery = '',
  presetSpecialty = 'all',
  onBookDoctor,
}) => {
  const [query, setQuery] = useState(presetQuery);
  const [specialty, setSpecialty] = useState<string>(presetSpecialty);
  const [city, setCity] = useState<string>('all');
  const [mode, setMode] = useState<'all' | 'in-person' | 'video'>('all');

  useEffect(() => {
    setQuery(presetQuery);
  }, [presetQuery]);

  useEffect(() => {
    setSpecialty(presetSpecialty);
  }, [presetSpecialty]);

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((doc) => {
      if (specialty !== 'all' && doc.specialtyKey !== specialty) return false;
      if (city !== 'all' && doc.city !== city) return false;
      if (mode === 'video' && !doc.onlineAvailable) return false;
      if (mode === 'in-person' && !doc.inPersonAvailable) return false;

      if (!q) return true;
      const searchable = [
        doc.name.en,
        doc.name.bn,
        doc.specialty.en,
        doc.specialty.bn,
        doc.hospital.en,
        doc.hospital.bn,
        doc.bmdcReg,
        doc.degrees,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [doctors, query, specialty, city, mode]);

  const handleReset = () => {
    setQuery('');
    setSpecialty('all');
    setCity('all');
    setMode('all');
  };

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="space-y-2">
        <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#25332F] tracking-[-0.025em]">
          {pick(UI_COPY.directory.title, lang)}
        </h1>
        <p className="text-[15px] text-[#747C73] max-w-2xl">
          {pick(UI_COPY.directory.subtitle, lang)}
        </p>
      </div>

      {/* Warm Cream Search & Filter Control Strip */}
      <section className="bg-[#FBF8F2] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Live Search Input (48px Ivory) */}
          <div className="lg:col-span-6 relative">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-[#747C73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pick(UI_COPY.directory.searchPlaceholder, lang)}
              className="clinical-input w-full pl-10 pr-10 text-sm"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747C73] hover:text-[#25332F] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Filter */}
          <div className="lg:col-span-2">
            <select
              aria-label="Filter by City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="clinical-input w-full px-3.5 text-sm font-medium"
            >
              <option value="all">{pick(UI_COPY.directory.allCities, lang)}</option>
              <option value="Dhaka">{lang === 'bn' ? 'ঢাকা' : 'Dhaka'}</option>
              <option value="Chattogram">{lang === 'bn' ? 'চট্টগ্রাম' : 'Chattogram'}</option>
            </select>
          </div>

          {/* Mode Segmented Toggle */}
          <div className="lg:col-span-4 flex items-center p-1 bg-[#EFE8DC] rounded-xl h-12">
            {(
              [
                { id: 'all', label: pick(UI_COPY.directory.allModes, lang) },
                { id: 'in-person', label: pick(UI_COPY.directory.inPerson, lang) },
                { id: 'video', label: pick(UI_COPY.directory.videoConsult, lang) },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMode(opt.id)}
                className={`flex-1 h-10 px-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap truncate cursor-pointer ${
                  mode === opt.id
                    ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                    : 'text-[#747C73] hover:text-[#25332F]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SPECIALTIES.map((spec) => {
            const active = specialty === spec.key;
            return (
              <button
                key={spec.key}
                type="button"
                onClick={() => setSpecialty(spec.key)}
                className={`h-9 px-4 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#245B52] text-[#FFFDF8] shadow-mediora-1'
                    : 'bg-[#FFFDF8] text-[#5C665E] border border-[#E7DFD2] hover:border-[#E8B8A5] hover:bg-[#F3D8CC]/35 hover:text-[#25332F]'
                }`}
              >
                {pick(spec.label, lang)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Result Count Meta */}
      <div className="flex items-center justify-between text-xs text-[#747C73] px-1">
        <span className="tabular-nums font-semibold">
          {toLocaleDigits(filteredDoctors.length, lang)}{' '}
          {pick(UI_COPY.directory.showingCount, lang)}
        </span>
        {(query || specialty !== 'all' || city !== 'all' || mode !== 'all') && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[#245B52] font-bold hover:underline cursor-pointer"
          >
            {pick(UI_COPY.directory.resetFilters, lang)}
          </button>
        )}
      </div>

      {/* Doctor Profile Cards Grid — Soft Ivory Surfaces & Gentle Lift */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => {
            const fee = formatBDT(doc.feeBdt, lang);
            return (
              <article
                key={doc.id}
                className="group bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 mediora-lift p-6 flex flex-col justify-between gap-5"
              >
                {/* Top: Avatar + Credentials */}
                <div className="flex items-start gap-4">
                  <DoctorAvatar
                    src={doc.avatar}
                    name={pick(doc.name, lang)}
                    size="lg"
                    online={doc.onlineAvailable}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg font-bold text-[#25332F] leading-snug truncate">
                        {pick(doc.name, lang)}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3D8CC]/65 text-xs font-bold text-[#25332F] shrink-0 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#E8B8A5] text-[#B87D67]" />
                        {toLocaleDigits(doc.rating.toFixed(1), lang)}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#747C73]">{doc.degrees}</p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#747C73] pt-1">
                      <span className="font-semibold text-[#245B52]">
                        {pick(doc.specialty, lang)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {toLocaleDigits(doc.experienceYears, lang)}{' '}
                        {pick(UI_COPY.directory.experience, lang)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-[#245B52] font-semibold">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {doc.bmdcReg}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Chamber, Next Slot Peach-Coral Highlight & Availability Bar */}
                <div className="space-y-3.5 bg-[#FBF8F2] rounded-xl p-4 border border-[#EFE8DC]">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#59635C]">
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-[#245B52] shrink-0" />
                      <span className="truncate font-semibold text-[#25332F]">
                        {pick(doc.hospital, lang)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2.5 shrink-0 text-[#747C73]">
                      <span className="px-2 py-0.5 rounded-full bg-[#F3D8CC]/70 text-[#25332F] font-semibold tabular-nums">
                        {pick(doc.nextAvailable, lang)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {lang === 'bn' ? doc.cityBn : doc.city}
                      </span>
                      {doc.onlineAvailable && (
                        <span className="inline-flex items-center gap-1 text-[#245B52] font-semibold">
                          <Video className="w-3.5 h-3.5" />
                          {lang === 'bn' ? 'ভিডিও' : 'Video'}
                        </span>
                      )}
                    </span>
                  </div>

                  <ProviderAvailabilityBar
                    segments={doc.availabilitySegments}
                    lang={lang}
                  />
                </div>

                {/* Footer: BDT Fee + Forest Teal CTA */}
                <div className="pt-1 flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-[11px] font-medium text-[#747C73]">
                      {pick(UI_COPY.directory.consultationFee, lang)}
                    </span>
                    <div className="flex items-baseline gap-1 tabular-nums">
                      <span className="text-sm font-semibold text-[#397C70]">
                        {fee.symbol}
                      </span>
                      <span className="text-xl font-extrabold text-[#25332F]">
                        {fee.value}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookDoctor(doc)}
                    className="h-11 px-5 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-all duration-150 shadow-mediora-1 hover:shadow-mediora-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E2EEE5]"
                  >
                    {pick(UI_COPY.directory.bookAppointment, lang)}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] p-12 text-center space-y-3 shadow-mediora-1">
          <h3 className="text-base font-bold text-[#25332F]">
            {pick(UI_COPY.directory.emptyTitle, lang)}
          </h3>
          <p className="text-sm text-[#747C73] max-w-md mx-auto">
            {pick(UI_COPY.directory.emptyBody, lang)}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="h-10 px-5 bg-[#E2EEE5] hover:bg-[#D2E4D7] text-[#245B52] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {pick(UI_COPY.directory.resetFilters, lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
