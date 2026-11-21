import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  RefreshCw,
  Video,
  XCircle,
} from 'lucide-react';
import { Appointment, Doctor, Language } from '../types';
import { UI_COPY, formatBDT, pick, toLocaleDigits } from '../i18n/translations';
import { DoctorAvatar } from './DoctorAvatar';

interface AppointmentsScreenProps {
  lang: Language;
  appointments: Appointment[];
  doctors: Doctor[];
  onReschedule: (appointment: Appointment, doctor: Doctor) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onOpenPrescription: (prescriptionId: string) => void;
  onBrowseDoctors: () => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  lang,
  appointments,
  doctors,
  onReschedule,
  onCancelAppointment,
  onOpenPrescription,
  onBrowseDoctors,
}) => {
  const [statusTab, setStatusTab] = useState<'upcoming' | 'completed' | 'cancelled'>(
    'upcoming'
  );
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);

  const counts = {
    upcoming: appointments.filter((a) => a.status === 'upcoming').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  const visibleList = appointments.filter((a) => a.status === statusTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#25332F] tracking-[-0.025em]">
            {pick(UI_COPY.appointments.title, lang)}
          </h1>
          <p className="text-[15px] text-[#747C73] max-w-2xl">
            {pick(UI_COPY.appointments.subtitle, lang)}
          </p>
        </div>

        {/* Status Segmented Tabs */}
        <div className="inline-flex items-center p-1 bg-[#EAE3D6] rounded-xl self-start sm:self-auto">
          {(
            [
              { id: 'upcoming', label: pick(UI_COPY.appointments.upcoming, lang), count: counts.upcoming },
              { id: 'completed', label: pick(UI_COPY.appointments.completed, lang), count: counts.completed },
              { id: 'cancelled', label: pick(UI_COPY.appointments.cancelled, lang), count: counts.cancelled },
            ] as const
          ).map((tab) => {
            const active = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                  active
                    ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                    : 'text-[#59635C] hover:text-[#25332F]'
                }`}
              >
                {tab.label} ({toLocaleDigits(tab.count, lang)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      {visibleList.length > 0 ? (
        <div className="space-y-4">
          {visibleList.map((apt) => {
            const doctor = doctors.find((d) => d.id === apt.doctorId);
            if (!doctor) return null;
            const fee = formatBDT(apt.feePaidBdt, lang);
            const isConfirmingCancel = confirmingCancelId === apt.id;

            return (
              <article
                key={apt.id}
                className="group bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 mediora-lift p-6 space-y-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Doctor & Visit Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <DoctorAvatar
                      src={doctor.avatar}
                      name={pick(doctor.name, lang)}
                      size="lg"
                      online={doctor.onlineAvailable}
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <h2 className="text-lg font-bold text-[#25332F]">
                          {pick(doctor.name, lang)}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F3D8CC] text-xs font-bold text-[#25332F] tabular-nums">
                          {toLocaleDigits(apt.serialNumber, lang)}
                        </span>
                      </div>

                      <p className="text-xs text-[#747C73]">
                        {pick(doctor.specialty, lang)} · {doctor.bmdcReg} · {apt.patientName}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-[#25332F] tabular-nums">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#245B52]" />
                          {pick(apt.dateLabel, lang)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#245B52]" />
                          {pick(apt.timeLabel, lang)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[#747C73]">
                          {apt.mode === 'video' ? (
                            <Video className="w-3.5 h-3.5 text-[#397C70]" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-[#397C70]" />
                          )}
                          {pick(apt.chamber, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment Summary & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EFE8DC] shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="flex items-baseline lg:justify-end gap-0.5 tabular-nums">
                        <span className="text-sm font-semibold text-[#397C70]">
                          {fee.symbol}
                        </span>
                        <span className="text-lg font-extrabold text-[#25332F]">
                          {fee.value}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#397C70]">
                        {apt.paymentStatus === 'paid'
                          ? `${pick(UI_COPY.appointments.paidVia, lang)} ${apt.paymentMethod.toUpperCase()}`
                          : pick(UI_COPY.appointments.payAtDesk, lang)}
                      </span>
                    </div>

                    {apt.status === 'upcoming' && !isConfirmingCancel && (
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onReschedule(apt, doctor)}
                          className="h-9 px-3.5 bg-[#E6EFE7] hover:bg-[#D5E4D7] text-[#245B52] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{pick(UI_COPY.appointments.reschedule, lang)}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingCancelId(apt.id)}
                          className="h-9 px-3.5 bg-[#F3D8CC]/75 hover:bg-[#E8B8A5] text-[#25332F] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{pick(UI_COPY.appointments.cancelVisit, lang)}</span>
                        </button>
                      </div>
                    )}

                    {apt.status === 'completed' && apt.prescriptionId && (
                      <button
                        type="button"
                        onClick={() => onOpenPrescription(apt.prescriptionId!)}
                        className="h-9 px-4 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{pick(UI_COPY.appointments.viewRx, lang)}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Cancel Confirmation Bar (Unified Peach-Coral Accent) */}
                {isConfirmingCancel && (
                  <div className="bg-[#F3D8CC]/70 border border-[#E8B8A5] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[#25332F]">
                      {pick(UI_COPY.appointments.confirmCancelPrompt, lang)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmingCancelId(null)}
                        className="h-8 px-3 bg-[#FFFDF8] border border-[#E7DFD2] text-xs font-semibold text-[#25332F] rounded-lg cursor-pointer"
                      >
                        {pick(UI_COPY.appointments.keepVisit, lang)}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onCancelAppointment(apt.id);
                          setConfirmingCancelId(null);
                        }}
                        className="h-8 px-3 bg-[#25332F] hover:bg-[#1A2421] text-[#FFFDF8] text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        {pick(UI_COPY.appointments.confirmCancelBtn, lang)}
                      </button>
                    </div>
                  </div>
                )}

                {/* Chief Complaint Footnote */}
                {apt.chiefComplaint && (
                  <p className="text-xs text-[#747C73] pt-3 border-t border-[#EFE8DC]">
                    {apt.chiefComplaint}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] p-12 text-center space-y-3 shadow-mediora-1">
          <h3 className="text-base font-bold text-[#25332F]">
            {pick(UI_COPY.appointments.emptyUpcoming, lang)}
          </h3>
          <p className="text-sm text-[#747C73] max-w-md mx-auto">
            {pick(UI_COPY.appointments.emptyDesc, lang)}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBrowseDoctors}
              className="h-10 px-5 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {pick(UI_COPY.workspace.bookSpecialistBtn, lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
