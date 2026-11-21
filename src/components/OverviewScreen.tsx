import React, { useState } from 'react';
import {
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Calendar,
  Check,
  Clock,
  HeartPulse,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import {
  Appointment,
  Doctor,
  Language,
  MedicationDose,
  ScreenTab,
  VitalMetric,
} from '../types';
import { SPECIALTIES } from '../data/clinicalData';
import { UI_COPY, formatBDT, pick, toLocaleDigits } from '../i18n/translations';
import { Sparkline } from './Sparkline';
import { ProviderAvailabilityBar } from './ProviderAvailabilityBar';
import { DoctorAvatar } from './DoctorAvatar';

const HERO_DOCTOR_IMAGE = '/src/assets/images/hero_mediora_doctor_1795262499376.jpg';

/* Unified Mediora palette across departments: cream, sage wash, and soft peach-coral (#F3D8CC / #E8B8A5) */
const DEPARTMENT_STYLES: Record<
  string,
  { bg: string; iconBg: string; iconColor: string; Icon: React.FC<{ className?: string }> }
> = {
  cardiology: {
    bg: 'bg-[#F3D8CC]/55',
    iconBg: 'bg-[#E8B8A5]/55',
    iconColor: 'text-[#25332F]',
    Icon: HeartPulse,
  },
  medicine: {
    bg: 'bg-[#E6EFE7]',
    iconBg: 'bg-[#A9BDA8]/45',
    iconColor: 'text-[#245B52]',
    Icon: Stethoscope,
  },
  gynecology: {
    bg: 'bg-[#FBF8F2]',
    iconBg: 'bg-[#F3D8CC]',
    iconColor: 'text-[#25332F]',
    Icon: Sparkles,
  },
  pediatrics: {
    bg: 'bg-[#F3D8CC]/45',
    iconBg: 'bg-[#E8B8A5]/50',
    iconColor: 'text-[#25332F]',
    Icon: Baby,
  },
  neurology: {
    bg: 'bg-[#E6EFE7]',
    iconBg: 'bg-[#A9BDA8]/45',
    iconColor: 'text-[#245B52]',
    Icon: Brain,
  },
  orthopedics: {
    bg: 'bg-[#FBF8F2]',
    iconBg: 'bg-[#E6EFE7]',
    iconColor: 'text-[#245B52]',
    Icon: Bone,
  },
};

interface OverviewScreenProps {
  lang: Language;
  vitals: VitalMetric[];
  medications: MedicationDose[];
  doctors: Doctor[];
  nextAppointment?: Appointment;
  onToggleMedication: (medId: string) => void;
  onLogVital: (vitalId: string, newValue: string, numericPoint: number) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onNavigate: (tab: ScreenTab) => void;
  onSearchDoctors: (query: string, specialtyKey: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  lang,
  vitals,
  medications,
  doctors,
  nextAppointment,
  onToggleMedication,
  onLogVital,
  onBookDoctor,
  onNavigate,
  onSearchDoctors,
}) => {
  const [heroQuery, setHeroQuery] = useState('');
  const [heroSpecialty, setHeroSpecialty] = useState('all');
  const [heroImgError, setHeroImgError] = useState(false);

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedVitalId, setSelectedVitalId] = useState<string>(vitals[0]?.id ?? 'vital-hr');
  const [readingInput, setReadingInput] = useState('');
  const [readingError, setReadingError] = useState('');

  const nextDoctor = nextAppointment
    ? doctors.find((d) => d.id === nextAppointment.doctorId)
    : undefined;

  const takenCount = medications.filter((m) => m.takenToday).length;

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchDoctors(heroQuery.trim(), heroSpecialty);
  };

  const handleOpenLog = (vitalId?: string) => {
    const id = vitalId ?? vitals[0]?.id ?? 'vital-hr';
    setSelectedVitalId(id);
    const current = vitals.find((v) => v.id === id);
    setReadingInput(current ? current.value : '');
    setReadingError('');
    setLogModalOpen(true);
  };

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = readingInput.trim();
    if (!trimmed) {
      setReadingError(lang === 'bn' ? 'একটি মান লিখুন' : 'Please enter a measured value');
      return;
    }

    const parsed = parseFloat(trimmed.split('/')[0]);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setReadingError(lang === 'bn' ? 'সঠিক সংখ্যা লিখুন' : 'Enter a valid numeric reading');
      return;
    }

    onLogVital(selectedVitalId, trimmed, parsed);
    setLogModalOpen(false);
    setReadingError('');
  };

  const departments = SPECIALTIES.filter((s) => s.key !== 'all');

  return (
    <div className="space-y-12">
      {/* Asymmetrical Warm Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#FBF8F2] border border-[#E7DFD2] shadow-mediora-1 px-6 py-8 sm:px-10 sm:py-11 lg:px-12 lg:py-12">
        {/* Subtle decorative shapes in soft sage and unified peach-coral (#E8B8A5 / #F3D8CC) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#A9BDA8]/25 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#F3D8CC]/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-[42%] w-16 h-16 rounded-full border-2 border-[#E8B8A5]/55 hidden lg:block"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left 7 Cols: Expressive Heading + Prominent Working Appointment Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <p className="text-xs font-bold tracking-[0.04em] text-[#397C70]">
                {pick(UI_COPY.brand, lang)} · {pick(UI_COPY.tagline, lang)}
              </p>

              <h1
                className="text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold text-[#25332F] tracking-[-0.03em] leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                {pick(UI_COPY.workspace.greeting, lang)}
              </h1>

              <p className="text-[15px] sm:text-base text-[#747C73] max-w-xl leading-relaxed">
                {pick(UI_COPY.workspace.subtitle, lang)}
              </p>
            </div>

            {/* Prominent Hero Appointment Search Form */}
            <form
              onSubmit={handleHeroSearchSubmit}
              className="bg-[#FFFDF8] border border-[#E7DFD2] rounded-2xl p-2 shadow-mediora-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="relative flex-1 min-w-0">
                <Search
                  aria-hidden="true"
                  className="w-4 h-4 text-[#747C73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder={pick(UI_COPY.workspace.heroSearchPlaceholder, lang)}
                  className="w-full h-11 pl-10 pr-3 bg-transparent text-sm text-[#25332F] placeholder:text-[#8E958C] focus:outline-none"
                />
              </div>

              <div className="hidden sm:block w-px h-7 bg-[#E7DFD2]" aria-hidden="true" />

              <select
                aria-label="Select specialty"
                value={heroSpecialty}
                onChange={(e) => setHeroSpecialty(e.target.value)}
                className="h-11 px-3 bg-[#FBF8F2] sm:bg-transparent rounded-xl sm:rounded-none text-sm font-semibold text-[#25332F] focus:outline-none sm:w-44 cursor-pointer"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {pick(s.label, lang)}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="h-11 px-6 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-all duration-150 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-mediora-1"
              >
                <span>{pick(UI_COPY.workspace.heroSearchBtn, lang)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Secondary Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm">
              <button
                type="button"
                onClick={() => onNavigate('doctors')}
                className="font-semibold text-[#245B52] hover:text-[#1D4B43] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{pick(UI_COPY.workspace.bookSpecialistBtn, lang)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span aria-hidden="true" className="text-[#D4CBB9]">·</span>
              <button
                type="button"
                onClick={() => onNavigate('records')}
                className="font-semibold text-[#747C73] hover:text-[#25332F] transition-colors cursor-pointer"
              >
                {pick(UI_COPY.workspace.viewRecordsBtn, lang)}
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Editorial Doctor Photography + Floating Appointment Card */}
          <div className="lg:col-span-5 relative pb-8 sm:pb-10 lg:pb-6">
            {/* Warm decorative offset backdrop shapes in unified peach-coral & soft sage */}
            <div
              aria-hidden="true"
              className="absolute -top-3.5 -right-3.5 w-36 h-36 rounded-[26px] bg-[#E8B8A5]/65 hidden sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-3 -left-3.5 w-28 h-28 rounded-full bg-[#A9BDA8]/45 hidden sm:block"
            />

            {/* Hero Physician Portrait */}
            <div className="relative rounded-[26px] overflow-hidden border border-[#E7DFD2] shadow-mediora-2 bg-[#E6EFE7] aspect-[4/3]">
              {!heroImgError ? (
                <img
                  src={HERO_DOCTOR_IMAGE}
                  alt={
                    lang === 'bn'
                      ? 'মেডিওরা বিশেষজ্ঞ চিকিৎসক'
                      : 'Friendly Mediora specialist physician in a sunlit clinic'
                  }
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#E6EFE7] text-[#245B52] p-6 text-center">
                  <Stethoscope className="w-10 h-10 mb-2" />
                  <span className="text-sm font-bold">Mediora Care Team</span>
                </div>
              )}
            </div>

            {/* Small Floating Next Confirmed Appointment Card with Peach-Coral Highlight */}
            <div className="relative sm:absolute sm:-bottom-2 sm:left-4 sm:right-4 mt-4 sm:mt-0 bg-[#FFFDF8]/96 backdrop-blur-md rounded-2xl border border-[#E8B8A5]/70 shadow-mediora-2 p-4">
              {nextAppointment && nextDoctor ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <DoctorAvatar
                      src={nextDoctor.avatar}
                      name={pick(nextDoctor.name, lang)}
                      size="sm"
                      online={nextDoctor.onlineAvailable}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-[#245B52]">
                          {pick(UI_COPY.workspace.nextAppointment, lang)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#F3D8CC] text-[#25332F] font-bold tabular-nums">
                          {toLocaleDigits(nextAppointment.serialNumber, lang)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#25332F] truncate mt-0.5">
                        {pick(nextDoctor.name, lang)}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-[#747C73] mt-0.5 tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#245B52]" />
                          {pick(nextAppointment.dateLabel, lang)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#245B52]" />
                          {pick(nextAppointment.timeLabel, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('appointments')}
                    className="h-9 px-3.5 bg-[#F3D8CC] hover:bg-[#E8B8A5] text-[#25332F] text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {pick(UI_COPY.workspace.manageQueue, lang)}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#25332F]">
                      {pick(UI_COPY.workspace.noUpcoming, lang)}
                    </p>
                    <p className="text-[11px] text-[#747C73]">
                      {pick(UI_COPY.tagline, lang)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('doctors')}
                    className="h-9 px-3.5 bg-[#245B52] text-[#FFFDF8] text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {pick(UI_COPY.nav.bookCta, lang)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Explore Clinical Departments — Pastel Identity Cards */}
      <section
        id="departments-section"
        aria-labelledby="departments-heading"
        className="space-y-5 scroll-mt-24"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="departments-heading"
              className="text-[22px] sm:text-[26px] font-bold text-[#25332F] tracking-[-0.02em]"
            >
              {pick(UI_COPY.workspace.departmentsHeading, lang)}
            </h2>
            <p className="text-sm text-[#747C73] mt-1">
              {pick(UI_COPY.workspace.departmentsSubtitle, lang)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('doctors')}
            className="text-xs font-bold text-[#245B52] hover:text-[#1D4B43] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{pick(UI_COPY.workspace.viewAllDoctors, lang)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {departments.map((dept) => {
            const style = DEPARTMENT_STYLES[dept.key] ?? DEPARTMENT_STYLES.medicine;
            const DeptIcon = style.Icon;
            const docCount = doctors.filter((d) => d.specialtyKey === dept.key).length;

            return (
              <button
                key={dept.key}
                type="button"
                onClick={() => onSearchDoctors('', dept.key)}
                className={`group text-left ${style.bg} rounded-2xl border border-[#E7DFD2]/80 p-4 mediora-lift flex flex-col justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52]`}
              >
                <span
                  className={`w-10 h-10 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
                >
                  <DeptIcon className="w-5 h-5" />
                </span>
                <div>
                  <span className="block text-sm font-bold text-[#25332F] leading-snug">
                    {pick(dept.label, lang)}
                  </span>
                  <span className="block text-[11px] font-medium text-[#747C73] mt-0.5 tabular-nums">
                    {toLocaleDigits(docCount, lang)}{' '}
                    {lang === 'bn' ? 'বিশেষজ্ঞ' : docCount === 1 ? 'consultant' : 'consultants'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Clinical Vitals & Trends — Warm Ivory Cards on Beige Canvas */}
      <section aria-labelledby="vitals-section-title" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="vitals-section-title"
            className="text-[22px] sm:text-[26px] font-bold text-[#25332F] tracking-[-0.02em]"
          >
            {pick(UI_COPY.workspace.vitalsHeading, lang)}
          </h2>
          <button
            type="button"
            onClick={() => handleOpenLog()}
            className="h-10 px-4 bg-[#FFFDF8] hover:bg-[#F3D8CC]/60 hover:border-[#E8B8A5] text-[#245B52] border border-[#E7DFD2] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-mediora-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{pick(UI_COPY.workspace.logReading, lang)}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vitals.map((metric, idx) => {
            /* Balanced 25% sage / 10% unified light peach-coral delta tags */
            const deltaClasses =
              idx % 2 === 0
                ? 'bg-[#E6EFE7] text-[#245B52]'
                : 'bg-[#F3D8CC] text-[#25332F]';

            return (
              <button
                key={metric.id}
                type="button"
                onClick={() => handleOpenLog(metric.id)}
                className="group text-left bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 mediora-lift p-5 flex flex-col justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-[#747C73] leading-snug">
                    {pick(metric.label, lang)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 tabular-nums ${deltaClasses}`}
                  >
                    {pick(metric.delta, lang)}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-[28px] font-extrabold text-[#25332F] tracking-[-0.02em] leading-none tabular-nums">
                    {toLocaleDigits(metric.value, lang)}
                  </span>
                  <span className="text-xs font-medium text-[#747C73]">{metric.unit}</span>
                </div>

                <div className="pt-1">
                  <Sparkline
                    data={metric.sparkline}
                    stroke="#245B52"
                    height={36}
                    label={`${pick(metric.label, lang)} trend`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#747C73] pt-2.5 border-t border-[#EFE8DC] tabular-nums">
                  <span>{pick(metric.lastUpdated, lang)}</span>
                  <span className="text-[#397C70] font-semibold">
                    {metric.targetRange}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Soft Sage Rhythm Section: Specialist Availability (8 cols) + Medication Schedule (4 cols) */}
      <section className="rounded-[28px] bg-[#E8EFE8] border border-[#D8E3D7] p-5 sm:p-7 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Cols: Specialist Availability Today */}
          <div className="lg:col-span-8 bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 overflow-hidden">
            <div className="bg-[#FBF8F2] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E7DFD2]">
              <h2 className="text-base font-bold text-[#25332F]">
                {pick(UI_COPY.workspace.providerAvailHeading, lang)}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('doctors')}
                className="text-xs font-bold text-[#245B52] hover:text-[#1D4B43] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{pick(UI_COPY.workspace.viewAllDoctors, lang)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#EFE8DC]">
              {doctors.slice(0, 4).map((doc) => {
                const fee = formatBDT(doc.feeBdt, lang);
                return (
                  <div
                    key={doc.id}
                    className="group p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBF8F2]/80 transition-colors"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <DoctorAvatar
                        src={doc.avatar}
                        name={pick(doc.name, lang)}
                        size="md"
                        online={doc.onlineAvailable}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-bold text-[#25332F] truncate">
                          {pick(doc.name, lang)}
                        </h3>
                        <p className="text-xs text-[#747C73] mt-0.5 truncate">
                          {pick(doc.specialty, lang)} · {pick(doc.hospital, lang)}
                        </p>
                        <div className="mt-3 max-w-md">
                          <ProviderAvailabilityBar
                            segments={doc.availabilitySegments}
                            lang={lang}
                            compact
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFE8DC]">
                      <div className="flex items-baseline gap-0.5 tabular-nums">
                        <span className="text-sm font-semibold text-[#397C70]">{fee.symbol}</span>
                        <span className="text-lg font-extrabold text-[#25332F]">{fee.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onBookDoctor(doc)}
                        className="h-9 px-4 bg-[#F3D8CC]/75 hover:bg-[#245B52] text-[#25332F] hover:text-[#FFFDF8] text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {pick(UI_COPY.workspace.quickBook, lang)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 4 Cols: Active Medication Checklist with Light Peach-Coral Header */}
          <div className="lg:col-span-4 bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 overflow-hidden">
            <div className="bg-[#F3D8CC]/60 px-6 py-4 border-b border-[#E8B8A5]/50 flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#25332F]">
                {pick(UI_COPY.workspace.medsHeading, lang)}
              </h2>
              <span className="text-xs font-bold text-[#245B52] tabular-nums whitespace-nowrap shrink-0">
                {toLocaleDigits(takenCount, lang)}/{toLocaleDigits(medications.length, lang)}
              </span>
            </div>

            <div className="px-6 py-3.5 border-b border-[#EFE8DC] bg-[#FBF8F2]/60">
              <div className="h-2 w-full bg-[#E7DFD2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#245B52] rounded-full transition-all duration-200"
                  style={{
                    width: `${medications.length ? (takenCount / medications.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-[11px] font-medium text-[#747C73] mt-2 tabular-nums">
                {toLocaleDigits(takenCount, lang)} {pick(UI_COPY.workspace.medsTakenCount, lang)}
              </p>
            </div>

            <ul className="divide-y divide-[#EFE8DC]">
              {medications.map((med) => (
                <li key={med.id}>
                  <button
                    type="button"
                    onClick={() => onToggleMedication(med.id)}
                    className="w-full text-left px-6 py-4 flex items-start gap-3.5 hover:bg-[#FBF8F2] transition-colors cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${
                        med.takenToday
                          ? 'bg-[#245B52] text-[#FFFDF8]'
                          : 'bg-[#FFFDF8] border-[1.5px] border-[#C9BFA9]'
                      }`}
                    >
                      {med.takenToday && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold truncate ${
                            med.takenToday
                              ? 'line-through text-[#8E958C]'
                              : 'text-[#25332F]'
                          }`}
                        >
                          {med.name}
                        </span>
                        <span className="text-xs font-bold text-[#397C70] tabular-nums shrink-0">
                          {toLocaleDigits(med.scheduleCode, lang)}
                        </span>
                      </div>
                      <p className="text-xs text-[#747C73] mt-0.5 truncate">{med.generic}</p>
                      <p className="text-xs text-[#59635C] mt-1">
                        {pick(med.dosage, lang)} · {pick(med.timing, lang)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Log New Clinical Reading Modal (Warm Ivory & Cream) */}
      {logModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#25332F]/35 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="log-vital-title"
        >
          <div className="bg-[#FFFDF8] w-full max-w-md rounded-2xl border border-[#E7DFD2] shadow-mediora-3 overflow-hidden">
            <div className="px-6 py-4 bg-[#FBF8F2] border-b border-[#E7DFD2] flex items-center justify-between">
              <h3 id="log-vital-title" className="text-base font-bold text-[#25332F]">
                {pick(UI_COPY.logVital.title, lang)}
              </h3>
              <button
                type="button"
                onClick={() => setLogModalOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#747C73] hover:bg-[#E2EEE5] hover:text-[#25332F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="vital-select"
                  className="block text-xs font-bold text-[#25332F] mb-1.5"
                >
                  {pick(UI_COPY.logVital.selectMetric, lang)}
                </label>
                <select
                  id="vital-select"
                  value={selectedVitalId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setSelectedVitalId(nextId);
                    const found = vitals.find((v) => v.id === nextId);
                    if (found) setReadingInput(found.value);
                  }}
                  className="clinical-input w-full px-3.5 text-sm font-medium"
                >
                  {vitals.map((v) => (
                    <option key={v.id} value={v.id}>
                      {pick(v.label, lang)} ({v.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="vital-value"
                  className="block text-xs font-bold text-[#25332F] mb-1.5"
                >
                  {pick(UI_COPY.logVital.valueLabel, lang)}
                </label>
                <div className="relative">
                  <input
                    id="vital-value"
                    type="text"
                    value={readingInput}
                    onChange={(e) => {
                      setReadingInput(e.target.value);
                      setReadingError('');
                    }}
                    placeholder="e.g. 70 or 116/74"
                    className={`clinical-input w-full px-3.5 pr-20 text-sm font-semibold tabular-nums ${
                      readingError ? 'clinical-input-error' : ''
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#747C73]">
                    {vitals.find((v) => v.id === selectedVitalId)?.unit}
                  </span>
                </div>
                {readingError && (
                  <p className="text-xs text-[#C95B49] mt-1.5 font-medium">{readingError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="h-10 px-4 text-sm font-semibold text-[#747C73] hover:text-[#25332F] rounded-xl cursor-pointer"
                >
                  {pick(UI_COPY.logVital.cancel, lang)}
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {pick(UI_COPY.logVital.save, lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
