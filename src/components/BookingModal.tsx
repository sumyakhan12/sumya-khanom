import React, { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Video,
  X,
} from 'lucide-react';
import {
  Appointment,
  ConsultMode,
  Doctor,
  Language,
  PaymentGateway,
  TriageLevel,
} from '../types';
import { UPCOMING_DATES } from '../data/clinicalData';
import { UI_COPY, formatBDT, pick, toLocaleDigits } from '../i18n/translations';
import { DoctorAvatar } from './DoctorAvatar';

interface BookingModalProps {
  lang: Language;
  doctor: Doctor | null;
  rescheduleAppointment?: Appointment | null;
  onClose: () => void;
  onConfirmBooking: (appointment: Appointment) => void;
  onConfirmReschedule?: (
    appointmentId: string,
    newDateIso: string,
    newDateLabel: { en: string; bn: string },
    newTimeLabel: { en: string; bn: string },
    newMode: ConsultMode
  ) => void;
  onGoToAppointments: () => void;
}

const PLATFORM_FEE = 50;

const GATEWAYS: {
  id: PaymentGateway;
  name: string;
  accent: string;
  tagBg: string;
  descEn: string;
  descBn: string;
}[] = [
  {
    id: 'bkash',
    name: 'bKash',
    accent: '#C41661',
    tagBg: '#FCEBF3',
    descEn: 'Instant MFS checkout',
    descBn: 'তাৎক্ষণিক বিকাশ পেমেন্ট',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    accent: '#C6382E',
    tagBg: '#FBEDE9',
    descEn: 'Zero-fee digital wallet',
    descBn: 'নগদ মোবাইল ওয়ালেট',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    accent: '#7D3585',
    tagBg: '#F6EEF8',
    descEn: 'DBBL Mobile Banking',
    descBn: 'ডাচ-বাংলা রকেট',
  },
  {
    id: 'desk',
    name: 'Hospital Desk',
    accent: '#245B52',
    tagBg: '#E2EEE5',
    descEn: 'Pay cash/card at reception',
    descBn: 'চেম্বার রিসেপশনে পরিশোধ',
  },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  lang,
  doctor,
  rescheduleAppointment,
  onClose,
  onConfirmBooking,
  onConfirmReschedule,
  onGoToAppointments,
}) => {
  const isReschedule = Boolean(rescheduleAppointment);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDateIso, setSelectedDateIso] = useState(
    rescheduleAppointment?.dateIso ?? UPCOMING_DATES[1].iso
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [mode, setMode] = useState<ConsultMode>(
    rescheduleAppointment?.mode ?? 'in-person'
  );

  // Patient form
  const [patientName, setPatientName] = useState(
    rescheduleAppointment?.patientName ?? 'Rafiqul Islam'
  );
  const [phoneDigits, setPhoneDigits] = useState('1712489210');
  const [phoneError, setPhoneError] = useState('');
  const [triage, setTriage] = useState<TriageLevel>(
    rescheduleAppointment?.triage ?? 'routine'
  );
  const [chiefComplaint, setChiefComplaint] = useState(
    rescheduleAppointment?.chiefComplaint ?? ''
  );

  // Payment
  const [gateway, setGateway] = useState<PaymentGateway>('bkash');
  const [walletPhone, setWalletPhone] = useState('01712489210');
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!doctor) return;
    const firstOpen = doctor.slots.find((s) => s.available);
    setSelectedSlotId(firstOpen?.id ?? '');
    setMode(
      rescheduleAppointment?.mode ?? (doctor.inPersonAvailable ? 'in-person' : 'video')
    );
    setSelectedDateIso(rescheduleAppointment?.dateIso ?? UPCOMING_DATES[1].iso);
    setStep(1);
    setConfirmedApt(null);
    setPhoneError('');
  }, [doctor, rescheduleAppointment]);

  if (!doctor) return null;

  const selectedDateObj =
    UPCOMING_DATES.find((d) => d.iso === selectedDateIso) ?? UPCOMING_DATES[1];
  const selectedSlotObj = doctor.slots.find((s) => s.id === selectedSlotId);
  const consultFee = triage === 'followup' ? doctor.followUpFeeBdt : doctor.feeBdt;
  const totalFee = consultFee + PLATFORM_FEE;

  const consultFeeFormatted = formatBDT(consultFee, lang);
  const platformFeeFormatted = formatBDT(PLATFORM_FEE, lang);
  const totalFeeFormatted = formatBDT(totalFee, lang);

  const handleStep1Next = () => {
    if (!selectedSlotObj) return;
    if (isReschedule && rescheduleAppointment && onConfirmReschedule) {
      onConfirmReschedule(
        rescheduleAppointment.id,
        selectedDateObj.iso,
        { en: selectedDateObj.labelEn, bn: selectedDateObj.labelBn },
        { en: selectedSlotObj.timeEn, bn: selectedSlotObj.timeBn },
        mode
      );
      onClose();
      return;
    }
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneDigits.replace(/\D/g, '');
    if (!/^1[3-9]\d{8}$/.test(cleaned)) {
      setPhoneError(pick(UI_COPY.booking.mobileError, lang));
      return;
    }
    if (!patientName.trim()) return;
    setPhoneError('');
    setStep(3);
  };

  const handleFinalizeBooking = () => {
    if (!selectedSlotObj) return;
    const cleaned = phoneDigits.replace(/\D/g, '');
    const serialNum = `SL #${String(Math.floor(Math.random() * 14) + 5).padStart(2, '0')}`;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      serialNumber: serialNum,
      doctorId: doctor.id,
      dateLabel: { en: selectedDateObj.labelEn, bn: selectedDateObj.labelBn },
      dateIso: selectedDateObj.iso,
      timeLabel: { en: selectedSlotObj.timeEn, bn: selectedSlotObj.timeBn },
      mode,
      status: 'upcoming',
      feePaidBdt: totalFee,
      paymentMethod: gateway,
      paymentStatus: gateway === 'desk' ? 'pay-at-desk' : 'paid',
      chamber:
        mode === 'video'
          ? { en: 'Mediora HD Video Consult', bn: 'মেডিওরা এইচডি ভিডিও পরামর্শ' }
          : {
              en: `${doctor.hospital.en} · ${doctor.chamberRoom.en}`,
              bn: `${doctor.hospital.bn} · ${doctor.chamberRoom.bn}`,
            },
      patientName: patientName.trim(),
      patientPhone: `+880 ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`,
      triage,
      chiefComplaint:
        chiefComplaint.trim() ||
        (lang === 'bn' ? 'নিয়মিত বিশেষজ্ঞ পরামর্শ' : 'General specialist consultation'),
    };

    onConfirmBooking(newApt);
    setConfirmedApt(newApt);
    setStep(4);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#25332F]/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-[#FFFDF8] w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[#E7DFD2] shadow-mediora-3 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#FBF8F2] border-b border-[#E7DFD2] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <DoctorAvatar
              src={doctor.avatar}
              name={pick(doctor.name, lang)}
              size="sm"
              online={doctor.onlineAvailable}
            />
            <div className="min-w-0">
              <h2
                id="booking-modal-title"
                className="text-base font-bold text-[#25332F] truncate"
              >
                {isReschedule
                  ? pick(UI_COPY.booking.rescheduleTitle, lang)
                  : pick(doctor.name, lang)}
              </h2>
              <p className="text-xs text-[#747C73] truncate">
                {pick(doctor.specialty, lang)} · {pick(doctor.hospital, lang)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#747C73] hover:bg-[#E2EEE5] hover:text-[#25332F] shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isReschedule && step < 4 && (
          <div className="px-6 py-3 bg-[#F5F0E7]/75 border-b border-[#E7DFD2] flex items-center gap-5 text-xs font-semibold">
            {(
              [
                { n: 1, label: pick(UI_COPY.booking.step1, lang) },
                { n: 2, label: pick(UI_COPY.booking.step2, lang) },
                { n: 3, label: pick(UI_COPY.booking.step3, lang) },
              ] as const
            ).map((s) => (
              <span
                key={s.n}
                className={`whitespace-nowrap ${
                  step === s.n
                    ? 'text-[#245B52] font-bold'
                    : step > s.n
                      ? 'text-[#397C70]'
                      : 'text-[#9BA199]'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* STEP 1: Date, Consult Mode & Availability Chips */}
          {step === 1 && (
            <>
              <div>
                <span className="block text-xs font-bold text-[#25332F] mb-2">
                  {pick(UI_COPY.booking.consultType, lang)}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('in-person')}
                    className={`h-12 px-4 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      mode === 'in-person'
                        ? 'bg-[#F3D8CC]/60 border-[#245B52] text-[#25332F]'
                        : 'bg-[#FFFDF8] border-[#E7DFD2] text-[#747C73] hover:border-[#E8B8A5] hover:bg-[#FBF8F2]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0 text-[#245B52]" />
                    <span className="truncate">{pick(UI_COPY.directory.inPerson, lang)}</span>
                  </button>

                  <button
                    type="button"
                    disabled={!doctor.onlineAvailable}
                    onClick={() => doctor.onlineAvailable && setMode('video')}
                    className={`h-12 px-4 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                      !doctor.onlineAvailable
                        ? 'bg-[#F5F0E7] border-[#E7DFD2] text-[#9BA199] cursor-not-allowed opacity-60'
                        : mode === 'video'
                          ? 'bg-[#F3D8CC]/60 border-[#245B52] text-[#25332F] cursor-pointer'
                          : 'bg-[#FFFDF8] border-[#E7DFD2] text-[#747C73] hover:border-[#E8B8A5] hover:bg-[#FBF8F2] cursor-pointer'
                    }`}
                  >
                    <Video className="w-4 h-4 shrink-0 text-[#245B52]" />
                    <span className="truncate">{pick(UI_COPY.directory.videoConsult, lang)}</span>
                  </button>
                </div>
              </div>

              {/* Date Selector with Soft Peach-Coral Selected Highlight */}
              <div>
                <span className="block text-xs font-bold text-[#25332F] mb-2">
                  {pick(UI_COPY.booking.selectDate, lang)}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {UPCOMING_DATES.map((d) => {
                    const active = d.iso === selectedDateIso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDateIso(d.iso)}
                        className={`py-2.5 px-2 rounded-xl border text-center transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#F3D8CC]/75 border-[#245B52] text-[#25332F]'
                            : 'bg-[#FFFDF8] border-[#E7DFD2] text-[#25332F] hover:border-[#E8B8A5] hover:bg-[#FBF8F2]'
                        }`}
                      >
                        <span className="block text-[11px] font-semibold opacity-80">
                          {lang === 'bn' ? d.dayBn : d.dayEn}
                        </span>
                        <span className="block text-lg font-extrabold tabular-nums leading-tight mt-0.5">
                          {lang === 'bn' ? d.numBn : d.numEn}
                        </span>
                        <span className="block text-[10px] font-medium opacity-75">
                          {lang === 'bn' ? d.monthBn : d.monthEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Time Slot Chips */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#25332F]">
                    {pick(UI_COPY.booking.availableSlots, lang)}
                  </span>
                  <span className="text-xs text-[#747C73]">
                    {pick(doctor.chamberRoom, lang)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {doctor.slots.map((slot) => {
                    const isSelected = slot.id === selectedSlotId;
                    if (!slot.available) {
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled
                          className="h-11 px-3 rounded-xl bg-[#F0EAE0] border border-[#E7DFD2] text-xs font-semibold text-[#8E958C] line-through opacity-60 cursor-not-allowed tabular-nums"
                        >
                          {lang === 'bn' ? slot.timeBn : slot.timeEn}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`h-11 px-3 rounded-xl text-xs font-semibold transition-colors tabular-nums cursor-pointer ${
                          isSelected
                            ? 'bg-[#245B52] text-[#FFFDF8] border border-[#245B52] shadow-mediora-1'
                            : 'bg-[#FFFDF8] text-[#25332F] border border-[#E7DFD2] hover:border-[#E8B8A5] hover:bg-[#F3D8CC]/30'
                        }`}
                      >
                        {lang === 'bn' ? slot.timeBn : slot.timeEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7DFD2] flex items-center justify-between gap-4">
                <div className="text-xs text-[#747C73] tabular-nums">
                  {selectedSlotObj && (
                    <span className="font-bold text-[#25332F]">
                      {lang === 'bn' ? selectedDateObj.labelBn : selectedDateObj.labelEn} ·{' '}
                      {lang === 'bn' ? selectedSlotObj.timeBn : selectedSlotObj.timeEn}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!selectedSlotObj}
                  onClick={handleStep1Next}
                  className="h-11 px-6 bg-[#245B52] hover:bg-[#1D4B43] disabled:opacity-50 text-[#FFFDF8] text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isReschedule
                    ? pick(UI_COPY.booking.saveReschedule, lang)
                    : pick(UI_COPY.booking.continue, lang)}
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Patient Info, BD +880 Phone Input & Triage Radio */}
          {step === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="patient-name-input"
                    className="block text-xs font-bold text-[#25332F] mb-1.5"
                  >
                    {pick(UI_COPY.booking.patientName, lang)}
                  </label>
                  <input
                    id="patient-name-input"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="clinical-input w-full px-3.5 text-sm font-medium"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bd-phone-input"
                    className="block text-xs font-bold text-[#25332F] mb-1.5"
                  >
                    {pick(UI_COPY.booking.mobileNumber, lang)}
                  </label>
                  <div
                    className={`flex items-center h-12 rounded-xl border bg-[#FFFDF8] overflow-hidden transition-all focus-within:bg-white focus-within:border-[#245B52] focus-within:ring-3 focus-within:ring-[#E2EEE5] ${
                      phoneError ? 'border-[#C95B49]' : 'border-[#E7DFD2]'
                    }`}
                  >
                    <span className="h-full px-3 bg-[#FBF8F2] border-r border-[#E7DFD2] inline-flex items-center gap-1.5 text-xs font-bold text-[#25332F] shrink-0 tabular-nums">
                      <svg
                        width="18"
                        height="12"
                        viewBox="0 0 18 12"
                        aria-hidden="true"
                        className="rounded-[2px] shrink-0"
                      >
                        <rect width="18" height="12" fill="#006A4E" />
                        <circle cx="8" cy="6" r="3.5" fill="#F42A41" />
                      </svg>
                      <span>+880</span>
                    </span>
                    <input
                      id="bd-phone-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phoneDigits}
                      onChange={(e) => {
                        setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setPhoneError('');
                      }}
                      placeholder="1712345678"
                      className="flex-1 h-full px-3 bg-transparent text-sm font-semibold text-[#25332F] focus:outline-none tabular-nums"
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-xs text-[#C95B49] mt-1 font-medium">{phoneError}</p>
                  ) : (
                    <p className="text-[11px] text-[#747C73] mt-1">
                      {pick(UI_COPY.booking.mobileHint, lang)}
                    </p>
                  )}
                </div>
              </div>

              {/* Triage Priority Custom Radio Group */}
              <div>
                <span className="block text-xs font-bold text-[#25332F] mb-2">
                  {pick(UI_COPY.booking.triagePriority, lang)}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'routine', label: pick(UI_COPY.booking.routine, lang) },
                      { id: 'followup', label: pick(UI_COPY.booking.followup, lang) },
                      { id: 'urgent', label: pick(UI_COPY.booking.urgent, lang) },
                    ] as const
                  ).map((opt) => {
                    const checked = triage === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTriage(opt.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                          checked
                            ? 'bg-[#F3D8CC]/60 border-[#245B52]'
                            : 'bg-[#FFFDF8] border-[#E7DFD2] hover:border-[#E8B8A5] hover:bg-[#FBF8F2]'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            checked
                              ? 'bg-[#245B52]'
                              : 'border-[1.5px] border-[#C9BFA9] bg-[#FFFDF8]'
                          }`}
                        >
                          {checked && <span className="w-2 h-2 rounded-full bg-[#FFFDF8]" />}
                        </span>
                        <span className="text-xs font-semibold text-[#25332F]">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <label
                  htmlFor="complaint-input"
                  className="block text-xs font-bold text-[#25332F] mb-1.5"
                >
                  {pick(UI_COPY.booking.chiefComplaint, lang)}
                </label>
                <textarea
                  id="complaint-input"
                  rows={3}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder={pick(UI_COPY.booking.complaintPlaceholder, lang)}
                  className="w-full p-3.5 text-sm bg-[#FFFDF8] border border-[#E7DFD2] rounded-xl text-[#25332F] placeholder:text-[#8E958C] focus:outline-none focus:bg-white focus:border-[#245B52] focus:ring-3 focus:ring-[#E2EEE5]"
                />
              </div>

              <div className="pt-4 border-t border-[#E7DFD2] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-11 px-4 text-sm font-semibold text-[#747C73] hover:text-[#25332F] rounded-xl cursor-pointer"
                >
                  {pick(UI_COPY.booking.back, lang)}
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {pick(UI_COPY.booking.continue, lang)}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Localized BDT Payment Gateway Selection */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Warm Cream & Peach-tinted Fee Summary */}
              <div className="bg-[#FBF8F2] border border-[#E7DFD2] rounded-2xl p-5 space-y-2.5">
                <span className="block text-xs font-bold text-[#245B52]">
                  {pick(UI_COPY.booking.feeBreakdown, lang)}
                </span>
                <div className="flex items-center justify-between text-sm text-[#25332F]">
                  <span>{pick(UI_COPY.booking.doctorFee, lang)}</span>
                  <span className="font-semibold tabular-nums">
                    <span className="text-xs mr-0.5">{consultFeeFormatted.symbol}</span>
                    {consultFeeFormatted.value}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#747C73]">
                  <span>{pick(UI_COPY.booking.platformFee, lang)}</span>
                  <span className="font-medium tabular-nums">
                    <span className="text-xs mr-0.5">{platformFeeFormatted.symbol}</span>
                    {platformFeeFormatted.value}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-[#E7DFD2] flex items-center justify-between">
                  <span className="text-sm font-bold text-[#25332F]">
                    {pick(UI_COPY.booking.totalPayable, lang)}
                  </span>
                  <span className="flex items-baseline gap-0.5 tabular-nums">
                    <span className="text-sm font-bold text-[#245B52]">
                      {totalFeeFormatted.symbol}
                    </span>
                    <span className="text-xl font-extrabold text-[#25332F]">
                      {totalFeeFormatted.value}
                    </span>
                  </span>
                </div>
              </div>

              {/* Local BD Payment Gateways */}
              <div>
                <span className="block text-xs font-bold text-[#25332F] mb-2.5">
                  {pick(UI_COPY.booking.paymentTitle, lang)}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GATEWAYS.map((gw) => {
                    const active = gateway === gw.id;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setGateway(gw.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          active
                            ? 'bg-[#F3D8CC]/55 border-[#245B52]'
                            : 'bg-[#FFFDF8] border-[#E7DFD2] hover:border-[#E8B8A5]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="h-8 px-2.5 rounded-lg border border-[#E7DFD2] inline-flex items-center justify-center text-xs font-extrabold shrink-0"
                            style={{ backgroundColor: gw.tagBg, color: gw.accent }}
                          >
                            {gw.name}
                          </span>
                          <span className="text-xs text-[#59635C] truncate">
                            {lang === 'bn' ? gw.descBn : gw.descEn}
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            active
                              ? 'bg-[#245B52] text-[#FFFDF8]'
                              : 'border-[1.5px] border-[#C9BFA9] bg-[#FFFDF8]'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {gateway !== 'desk' && (
                <div>
                  <label
                    htmlFor="wallet-num-input"
                    className="block text-xs font-bold text-[#25332F] mb-1.5"
                  >
                    {GATEWAYS.find((g) => g.id === gateway)?.name}{' '}
                    {pick(UI_COPY.booking.walletNumber, lang)}
                  </label>
                  <input
                    id="wallet-num-input"
                    type="tel"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="clinical-input w-full px-3.5 text-sm font-semibold tabular-nums"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-[#E7DFD2] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-11 px-4 text-sm font-semibold text-[#747C73] hover:text-[#25332F] rounded-xl cursor-pointer"
                >
                  {pick(UI_COPY.booking.back, lang)}
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeBooking}
                  className="h-11 px-6 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer shadow-mediora-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{pick(UI_COPY.booking.confirmPay, lang)}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmed Chamber Serial Ticket */}
          {step === 4 && confirmedApt && (
            <div className="py-4 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E2EEE5] text-[#245B52]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-extrabold text-[#25332F]">
                  {pick(UI_COPY.booking.confirmedTitle, lang)}
                </h3>
                <p className="text-sm text-[#747C73] max-w-md mx-auto">
                  {pick(UI_COPY.booking.confirmedSubtitle, lang)}
                </p>
              </div>

              <div className="bg-[#FBF8F2] border border-[#E8B8A5] rounded-2xl p-5 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-[#E7DFD2] pb-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-[#747C73]">
                      {pick(UI_COPY.booking.serialLabel, lang)}
                    </span>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#F3D8CC] text-xl font-extrabold text-[#25332F] tabular-nums">
                      {toLocaleDigits(confirmedApt.serialNumber, lang)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#397C70]">
                    <BadgeCheck className="w-4 h-4" />
                    {confirmedApt.paymentStatus === 'paid'
                      ? `${confirmedApt.paymentMethod.toUpperCase()} Verified`
                      : pick(UI_COPY.appointments.payAtDesk, lang)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#25332F]">
                  <p className="font-bold text-sm">{pick(doctor.name, lang)}</p>
                  <p className="text-[#59635C] flex items-center gap-1.5 tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-[#245B52]" />
                    <span>{pick(confirmedApt.dateLabel, lang)}</span>
                    <span>·</span>
                    <Clock className="w-3.5 h-3.5 text-[#245B52]" />
                    <span>{pick(confirmedApt.timeLabel, lang)}</span>
                  </p>
                  <p className="text-[#747C73]">{pick(confirmedApt.chamber, lang)}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-5 bg-[#F5F0E7] hover:bg-[#EAE1D2] text-[#25332F] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {pick(UI_COPY.records.closePanel, lang)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToAppointments();
                  }}
                  className="h-11 px-6 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {pick(UI_COPY.booking.viewAppointments, lang)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
