import { useEffect, useMemo, useState } from 'react';
import {
  DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICATIONS,
  INITIAL_VITALS,
  LAB_REPORTS,
  PRESCRIPTIONS,
} from './data/clinicalData';
import {
  Appointment,
  ConsultMode,
  Doctor,
  Language,
  MedicationDose,
  ScreenTab,
  VitalMetric,
} from './types';
import { UI_COPY, pick } from './i18n/translations';
import { TopNav } from './components/TopNav';
import { OverviewScreen } from './components/OverviewScreen';
import { DoctorDirectoryScreen } from './components/DoctorDirectoryScreen';
import { AppointmentsScreen } from './components/AppointmentsScreen';
import { HealthRecordsScreen } from './components/HealthRecordsScreen';
import { BookingModal } from './components/BookingModal';

const STORAGE_KEY = 'mediora_state_v1';

interface PersistedState {
  lang: Language;
  vitals: VitalMetric[];
  medications: MedicationDose[];
  appointments: Appointment[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('shasthodesk_state_v1');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        lang: parsed.lang === 'bn' ? 'bn' : 'en',
        vitals: Array.isArray(parsed.vitals) && parsed.vitals.length ? parsed.vitals : INITIAL_VITALS,
        medications:
          Array.isArray(parsed.medications) && parsed.medications.length
            ? parsed.medications
            : INITIAL_MEDICATIONS,
        appointments:
          Array.isArray(parsed.appointments) && parsed.appointments.length
            ? parsed.appointments
            : INITIAL_APPOINTMENTS,
      };
    }
  } catch {
    // Fallback to initial clinical data
  }
  return {
    lang: 'en',
    vitals: INITIAL_VITALS,
    medications: INITIAL_MEDICATIONS,
    appointments: INITIAL_APPOINTMENTS,
  };
}

export default function App() {
  const initial = useMemo(() => loadInitialState(), []);

  const [lang, setLang] = useState<Language>(initial.lang);
  const [activeTab, setActiveTab] = useState<ScreenTab>('overview');
  const [vitals, setVitals] = useState<VitalMetric[]>(initial.vitals);
  const [medications, setMedications] = useState<MedicationDose[]>(initial.medications);
  const [appointments, setAppointments] = useState<Appointment[]>(initial.appointments);

  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [initialRxId, setInitialRxId] = useState<string | null>(null);

  // Connects homepage hero search & department cards directly to Doctor Directory filters
  const [directoryQueryPreset, setDirectoryQueryPreset] = useState('');
  const [directorySpecialtyPreset, setDirectorySpecialtyPreset] = useState('all');

  useEffect(() => {
    try {
      const payload: PersistedState = { lang, vitals, medications, appointments };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [lang, vitals, medications, appointments]);

  const nextUpcomingAppointment = useMemo(
    () => appointments.find((a) => a.status === 'upcoming'),
    [appointments]
  );

  const handleToggleMedication = (medId: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, takenToday: !m.takenToday } : m))
    );
  };

  const handleLogVital = (vitalId: string, newValue: string, numericPoint: number) => {
    setVitals((prev) =>
      prev.map((v) => {
        if (v.id !== vitalId) return v;
        const nextSpark = [...v.sparkline.slice(1), numericPoint];
        return {
          ...v,
          value: newValue,
          sparkline: nextSpark,
          delta: { en: 'Just logged', bn: 'এইমাত্র যোগ' },
          lastUpdated: { en: 'Just now', bn: 'এইমাত্র' },
        };
      })
    );
  };

  const handleOpenBookDoctor = (doctor: Doctor) => {
    setRescheduleTarget(null);
    setBookingDoctor(doctor);
  };

  const handleOpenReschedule = (apt: Appointment, doctor: Doctor) => {
    setRescheduleTarget(apt);
    setBookingDoctor(doctor);
  };

  const handleConfirmBooking = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleConfirmReschedule = (
    appointmentId: string,
    newDateIso: string,
    newDateLabel: { en: string; bn: string },
    newTimeLabel: { en: string; bn: string },
    newMode: ConsultMode
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== appointmentId) return apt;
        const doc = DOCTORS.find((d) => d.id === apt.doctorId);
        return {
          ...apt,
          dateIso: newDateIso,
          dateLabel: newDateLabel,
          timeLabel: newTimeLabel,
          mode: newMode,
          chamber:
            newMode === 'video'
              ? { en: 'Mediora HD Video Consult', bn: 'মেডিওরা এইচডি ভিডিও পরামর্শ' }
              : doc
                ? {
                    en: `${doc.hospital.en} · ${doc.chamberRoom.en}`,
                    bn: `${doc.hospital.bn} · ${doc.chamberRoom.bn}`,
                  }
                : apt.chamber,
        };
      })
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      )
    );
  };

  const handleOpenPrescription = (rxId: string) => {
    setInitialRxId(rxId);
    setActiveTab('records');
  };

  const handleSearchFromHome = (query: string, specialtyKey: string) => {
    setDirectoryQueryPreset(query);
    setDirectorySpecialtyPreset(specialtyKey);
    setActiveTab('doctors');
  };

  const handleSelectTab = (tab: ScreenTab) => {
    if (tab === 'doctors' && activeTab !== 'overview') {
      setDirectoryQueryPreset('');
      setDirectorySpecialtyPreset('all');
    }
    setActiveTab(tab);
  };

  const handleSelectDepartments = () => {
    setActiveTab('overview');
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById('departments-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F5F0E7] text-[#25332F] ${
        lang === 'bn' ? 'lang-bn' : ''
      }`}
    >
      <TopNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onSelectDepartments={handleSelectDepartments}
        onQuickBook={() => handleOpenBookDoctor(DOCTORS[0])}
        lang={lang}
        onChangeLang={setLang}
      />

      {/* Main Content Container on Warm Beige Foundation */}
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-20">
        {/* Quiet Patient Context Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs text-[#747C73] tabular-nums">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#25332F]">
              {lang === 'bn' ? 'রফিকুল ইসলাম' : 'Rafiqul Islam'}
            </span>
            <span aria-hidden="true" className="text-[#C9BFA9]">·</span>
            <span>
              {pick(UI_COPY.workspace.patientId, lang)}: BD-DH-48291
            </span>
          </div>
          <span className="hidden sm:inline text-[#747C73]">
            {pick(UI_COPY.workspace.dhakaRegion, lang)}
          </span>
        </div>

        {/* Active Screen */}
        {activeTab === 'overview' && (
          <OverviewScreen
            lang={lang}
            vitals={vitals}
            medications={medications}
            doctors={DOCTORS}
            nextAppointment={nextUpcomingAppointment}
            onToggleMedication={handleToggleMedication}
            onLogVital={handleLogVital}
            onBookDoctor={handleOpenBookDoctor}
            onNavigate={handleSelectTab}
            onSearchDoctors={handleSearchFromHome}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectoryScreen
            lang={lang}
            doctors={DOCTORS}
            presetQuery={directoryQueryPreset}
            presetSpecialty={directorySpecialtyPreset}
            onBookDoctor={handleOpenBookDoctor}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsScreen
            lang={lang}
            appointments={appointments}
            doctors={DOCTORS}
            onReschedule={handleOpenReschedule}
            onCancelAppointment={handleCancelAppointment}
            onOpenPrescription={handleOpenPrescription}
            onBrowseDoctors={() => handleSelectTab('doctors')}
          />
        )}

        {activeTab === 'records' && (
          <HealthRecordsScreen
            lang={lang}
            labReports={LAB_REPORTS}
            prescriptions={PRESCRIPTIONS}
            doctors={DOCTORS}
            initialPrescriptionId={initialRxId}
            onClearInitialPrescription={() => setInitialRxId(null)}
          />
        )}
      </main>

      {/* Warm Cream Clinical Footer */}
      <footer className="border-t border-[#E7DFD2] bg-[#FBF8F2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#747C73]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-extrabold text-[#25332F]">
              {pick(UI_COPY.brand, lang)}
            </span>
            <span aria-hidden="true" className="text-[#C9BFA9]">·</span>
            <span className="font-medium text-[#245B52]">
              {pick(UI_COPY.tagline, lang)}
            </span>
            <span aria-hidden="true" className="text-[#C9BFA9]">·</span>
            <span>
              {lang === 'bn'
                ? 'বিএমডিসি যাচাইকৃত চিকিৎসক ও আধুনিক স্বাস্থ্যসেবা'
                : 'BMDC-Verified Clinical Care Network'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 tabular-nums">
            <span>
              {lang === 'bn'
                ? 'স্বাস্থ্য বাতায়ন: ১৬২৬৩'
                : 'Shastho Batayon Helpline: 16263'}
            </span>
            <span aria-hidden="true" className="text-[#C9BFA9]">·</span>
            <span>
              {lang === 'bn' ? 'জাতীয় জরুরি সেবা: ৯৯৯' : 'National Emergency: 999'}
            </span>
          </div>
        </div>
      </footer>

      {/* Multi-Step Booking & Reschedule Modal */}
      <BookingModal
        lang={lang}
        doctor={bookingDoctor}
        rescheduleAppointment={rescheduleTarget}
        onClose={() => {
          setBookingDoctor(null);
          setRescheduleTarget(null);
        }}
        onConfirmBooking={handleConfirmBooking}
        onConfirmReschedule={handleConfirmReschedule}
        onGoToAppointments={() => handleSelectTab('appointments')}
      />
    </div>
  );
}
