import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Printer,
  X,
} from 'lucide-react';
import { Doctor, LabReport, Language, Prescription } from '../types';
import { UI_COPY, pick, toLocaleDigits } from '../i18n/translations';
import { DoctorAvatar } from './DoctorAvatar';

interface HealthRecordsScreenProps {
  lang: Language;
  labReports: LabReport[];
  prescriptions: Prescription[];
  doctors: Doctor[];
  initialPrescriptionId?: string | null;
  onClearInitialPrescription?: () => void;
}

export const HealthRecordsScreen: React.FC<HealthRecordsScreenProps> = ({
  lang,
  labReports,
  prescriptions,
  doctors,
  initialPrescriptionId,
  onClearInitialPrescription,
}) => {
  const [section, setSection] = useState<'labs' | 'rx'>(
    initialPrescriptionId ? 'rx' : 'labs'
  );
  const [labFilter, setLabFilter] = useState<'all' | 'normal' | 'attention'>('all');
  const [selectedLab, setSelectedLab] = useState<LabReport | null>(null);
  const [selectedRxId, setSelectedRxId] = useState<string>(
    initialPrescriptionId ?? prescriptions[0]?.id ?? ''
  );

  useEffect(() => {
    if (initialPrescriptionId) {
      setSection('rx');
      setSelectedRxId(initialPrescriptionId);
      onClearInitialPrescription?.();
    }
  }, [initialPrescriptionId, onClearInitialPrescription]);

  const filteredLabs = labReports.filter((r) => {
    if (labFilter === 'all') return true;
    return r.status === labFilter;
  });

  const activeRx =
    prescriptions.find((p) => p.id === selectedRxId) ?? prescriptions[0];
  const activeRxDoctor = activeRx
    ? doctors.find((d) => d.id === activeRx.doctorId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header + Section Switch */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#25332F] tracking-[-0.025em]">
            {pick(UI_COPY.records.title, lang)}
          </h1>
          <p className="text-[15px] text-[#747C73] max-w-2xl">
            {pick(UI_COPY.records.subtitle, lang)}
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-[#EAE3D6] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSection('labs')}
            className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              section === 'labs'
                ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                : 'text-[#59635C] hover:text-[#25332F]'
            }`}
          >
            {pick(UI_COPY.records.labTab, lang)} ({toLocaleDigits(labReports.length, lang)})
          </button>
          <button
            type="button"
            onClick={() => setSection('rx')}
            className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              section === 'rx'
                ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                : 'text-[#59635C] hover:text-[#25332F]'
            }`}
          >
            {pick(UI_COPY.records.rxTab, lang)} ({toLocaleDigits(prescriptions.length, lang)})
          </button>
        </div>
      </div>

      {/* SECTION 1: Lab Diagnostics Data Table */}
      {section === 'labs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'all', label: pick(UI_COPY.records.allReports, lang) },
                { id: 'normal', label: pick(UI_COPY.records.normalOnly, lang) },
                { id: 'attention', label: pick(UI_COPY.records.attentionOnly, lang) },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setLabFilter(f.id)}
                className={`h-9 px-4 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  labFilter === f.id
                    ? 'bg-[#245B52] text-[#FFFDF8] shadow-mediora-1'
                    : 'bg-[#FFFDF8] text-[#59635C] border border-[#E7DFD2] hover:border-[#E8B8A5] hover:bg-[#F3D8CC]/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FBF8F2] border-b border-[#E7DFD2]">
                    <th className="py-3.5 px-6 text-[11px] font-bold tracking-[0.04em] text-[#747C73] uppercase">
                      {pick(UI_COPY.records.colTest, lang)}
                    </th>
                    <th className="py-3.5 px-4 text-[11px] font-bold tracking-[0.04em] text-[#747C73] uppercase hidden md:table-cell">
                      {pick(UI_COPY.records.colLab, lang)}
                    </th>
                    <th className="py-3.5 px-4 text-[11px] font-bold tracking-[0.04em] text-[#747C73] uppercase whitespace-nowrap">
                      {pick(UI_COPY.records.colDate, lang)}
                    </th>
                    <th className="py-3.5 px-4 text-[11px] font-bold tracking-[0.04em] text-[#747C73] uppercase text-right whitespace-nowrap">
                      {pick(UI_COPY.records.colResult, lang)}
                    </th>
                    <th className="py-3.5 px-4 text-[11px] font-bold tracking-[0.04em] text-[#747C73] uppercase whitespace-nowrap">
                      {pick(UI_COPY.records.colStatus, lang)}
                    </th>
                    <th className="py-3.5 px-6 text-[11px] font-bold tracking-[0.04em] text-[#747C73] uppercase text-right">
                      {pick(UI_COPY.records.colAction, lang)}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DC]">
                  {filteredLabs.map((report) => (
                    <tr
                      key={report.id}
                      onClick={() => setSelectedLab(report)}
                      className="hover:bg-[#F5F0E7]/65 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <span className="block text-sm font-bold text-[#25332F]">
                          {pick(report.testName, lang)}
                        </span>
                        <span className="block text-xs text-[#747C73] mt-0.5">
                          {pick(report.category, lang)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#59635C] hidden md:table-cell">
                        {pick(report.labName, lang)}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#59635C] whitespace-nowrap tabular-nums">
                        {pick(report.date, lang)}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap tabular-nums">
                        <span className="block text-sm font-bold text-[#25332F]">
                          {toLocaleDigits(report.resultValue, lang)}
                        </span>
                        <span className="block text-[11px] text-[#747C73]">
                          Ref: {report.referenceRange}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {report.status === 'normal' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245B52]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#245B52]" />
                            {pick(UI_COPY.records.normalLabel, lang)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3D8CC] text-xs font-semibold text-[#25332F]">
                            <AlertCircle className="w-3.5 h-3.5 text-[#8A4F3B]" />
                            {pick(UI_COPY.records.attentionLabel, lang)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLab(report);
                          }}
                          className="text-xs font-bold text-[#245B52] hover:text-[#1D4B43] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{pick(UI_COPY.records.inspect, lang)}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Digital Prescriptions Viewer */}
      {section === 'rx' && activeRx && activeRxDoctor && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Cols: Prescription List Selector */}
          <div className="lg:col-span-4 bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 overflow-hidden divide-y divide-[#EFE8DC]">
            {prescriptions.map((rx) => {
              const doc = doctors.find((d) => d.id === rx.doctorId);
              const active = rx.id === activeRx.id;
              return (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => setSelectedRxId(rx.id)}
                  className={`w-full text-left p-5 transition-colors cursor-pointer ${
                    active ? 'bg-[#F3D8CC]/55' : 'hover:bg-[#FBF8F2]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#245B52] tabular-nums">
                      {rx.rxNumber}
                    </span>
                    <span className="text-[#747C73] tabular-nums">
                      {pick(rx.date, lang)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#25332F] mt-1.5">
                    {doc ? pick(doc.name, lang) : ''}
                  </p>
                  <p className="text-xs text-[#747C73] mt-1 line-clamp-2">
                    {pick(rx.diagnosis, lang)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right 8 Cols: Editorial Clinical Rx Sheet */}
          <div className="lg:col-span-8 bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-1 overflow-hidden">
            <div className="bg-[#FBF8F2] px-6 py-5 border-b border-[#E7DFD2] flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <DoctorAvatar
                  src={activeRxDoctor.avatar}
                  name={pick(activeRxDoctor.name, lang)}
                  size="md"
                />
                <div>
                  <h2 className="text-base font-bold text-[#25332F]">
                    {pick(activeRxDoctor.name, lang)}
                  </h2>
                  <p className="text-xs text-[#747C73]">{activeRxDoctor.degrees}</p>
                  <p className="text-xs text-[#245B52] font-semibold mt-0.5 inline-flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {activeRxDoctor.bmdcReg} · {pick(activeRxDoctor.hospital, lang)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-3.5 bg-[#FFFDF8] hover:bg-[#E2EEE5] border border-[#E7DFD2] text-[#245B52] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{pick(UI_COPY.records.printRx, lang)}</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-[#EFE8DC]">
                <div>
                  <span className="block text-[11px] font-bold text-[#747C73] uppercase tracking-[0.04em]">
                    {pick(UI_COPY.records.rxDiagnosis, lang)}
                  </span>
                  <p className="text-sm font-bold text-[#25332F] mt-1">
                    {pick(activeRx.diagnosis, lang)}
                  </p>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-[#747C73] uppercase tracking-[0.04em]">
                    {pick(UI_COPY.records.rxFollowUp, lang)}
                  </span>
                  <p className="text-sm font-semibold text-[#245B52] mt-1">
                    {pick(activeRx.followUpDate, lang)}
                  </p>
                </div>
                <div className="sm:col-span-2 text-xs text-[#747C73] tabular-nums">
                  {activeRx.vitalsSummary}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-[#245B52]">Rx</span>
                  <span className="text-xs font-semibold text-[#747C73]">
                    {activeRx.rxNumber} · {pick(activeRx.date, lang)}
                  </span>
                </div>

                <div className="divide-y divide-[#EFE8DC] border-t border-b border-[#EFE8DC]">
                  {activeRx.medications.map((m, idx) => (
                    <div
                      key={idx}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#25332F]">
                          {toLocaleDigits(idx + 1, lang)}. {m.brand}
                        </p>
                        <p className="text-xs text-[#747C73]">{m.generic}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm font-bold text-[#245B52] tabular-nums">
                          {toLocaleDigits(m.schedule, lang)}
                        </p>
                        <p className="text-xs text-[#59635C]">
                          {pick(m.instruction, lang)} · {pick(m.duration, lang)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#F3D8CC]/50 border border-[#E8B8A5]/70 rounded-xl p-4 space-y-2">
                <span className="block text-xs font-bold text-[#25332F]">
                  {pick(UI_COPY.records.rxAdvice, lang)}
                </span>
                <ul className="space-y-1.5 text-xs text-[#25332F]/85 list-disc pl-4">
                  {activeRx.advice.map((line, idx) => (
                    <li key={idx}>{pick(line, lang)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Report Detail Modal */}
      {selectedLab && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#25332F]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lab-detail-title"
        >
          <div className="bg-[#FFFDF8] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E7DFD2] shadow-mediora-3 overflow-hidden">
            <div className="px-6 py-4 bg-[#FBF8F2] border-b border-[#E7DFD2] flex items-center justify-between gap-3">
              <div>
                <h3 id="lab-detail-title" className="text-base font-bold text-[#25332F]">
                  {pick(selectedLab.testName, lang)}
                </h3>
                <p className="text-xs text-[#747C73]">
                  {pick(selectedLab.labName, lang)} · {pick(selectedLab.date, lang)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLab(null)}
                aria-label="Close lab details"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#747C73] hover:bg-[#E2EEE5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="divide-y divide-[#EFE8DC] border border-[#E7DFD2] rounded-xl overflow-hidden">
                {selectedLab.biomarkers.map((bio) => (
                  <div
                    key={bio.name}
                    className="px-4 py-3 flex items-center justify-between gap-3 text-sm bg-[#FFFDF8]"
                  >
                    <div>
                      <span className="font-semibold text-[#25332F]">{bio.name}</span>
                      <span className="block text-[11px] text-[#747C73] tabular-nums">
                        Ref: {bio.range} {bio.unit}
                      </span>
                    </div>
                    <div className="text-right tabular-nums">
                      <span className="font-bold text-[#25332F]">
                        {toLocaleDigits(bio.value, lang)} {bio.unit}
                      </span>
                      <span
                        className={`block text-[11px] font-semibold ${
                          bio.flag === 'normal' ? 'text-[#245B52]' : 'text-[#8A4F3B]'
                        }`}
                      >
                        {bio.flag === 'normal'
                          ? pick(UI_COPY.records.normalLabel, lang)
                          : bio.flag === 'high'
                            ? lang === 'bn'
                              ? 'স্বাভাবিকের উপরে'
                              : 'Above Range'
                            : lang === 'bn'
                              ? 'স্বাভাবিকের নিচে'
                              : 'Below Range'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#E2EEE5]/70 rounded-xl p-4 space-y-1">
                <span className="block text-xs font-bold text-[#245B52]">
                  {pick(UI_COPY.records.clinicianNote, lang)}
                </span>
                <p className="text-xs text-[#25332F] leading-relaxed">
                  {pick(selectedLab.clinicianNote, lang)}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLab(null)}
                  className="h-10 px-5 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {pick(UI_COPY.records.closePanel, lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
