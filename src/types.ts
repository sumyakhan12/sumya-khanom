export type Language = 'en' | 'bn';

export type ScreenTab = 'overview' | 'doctors' | 'appointments' | 'records';

export type ConsultMode = 'in-person' | 'video';

export type PaymentGateway = 'bkash' | 'nagad' | 'rocket' | 'desk';

export type TriageLevel = 'routine' | 'followup' | 'urgent';

export interface BilingualText {
  en: string;
  bn: string;
}

export interface TimeSlot {
  id: string;
  timeEn: string;
  timeBn: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface Doctor {
  id: string;
  name: BilingualText;
  degrees: string;
  specialtyKey: string;
  specialty: BilingualText;
  hospital: BilingualText;
  chamberRoom: BilingualText;
  city: 'Dhaka' | 'Chattogram' | 'Sylhet';
  cityBn: string;
  bmdcReg: string;
  experienceYears: number;
  feeBdt: number;
  followUpFeeBdt: number;
  avatar: string;
  onlineAvailable: boolean;
  inPersonAvailable: boolean;
  rating: number;
  reviewCount: number;
  nextAvailable: BilingualText;
  /** 12 segments representing today's chamber schedule: true = open, false = booked */
  availabilitySegments: boolean[];
  slots: TimeSlot[];
  languagesSpoken: string;
}

export interface VitalMetric {
  id: string;
  label: BilingualText;
  value: string;
  unit: string;
  delta: BilingualText;
  status: 'optimal' | 'watch' | 'stable';
  lastUpdated: BilingualText;
  sparkline: number[];
  targetRange: string;
}

export interface MedicationDose {
  id: string;
  name: string;
  generic: string;
  dosage: BilingualText;
  scheduleCode: string;
  timing: BilingualText;
  takenToday: boolean;
  prescribedBy: BilingualText;
}

export interface Appointment {
  id: string;
  serialNumber: string;
  doctorId: string;
  dateLabel: BilingualText;
  dateIso: string;
  timeLabel: BilingualText;
  mode: ConsultMode;
  status: 'upcoming' | 'completed' | 'cancelled';
  feePaidBdt: number;
  paymentMethod: PaymentGateway;
  paymentStatus: 'paid' | 'pay-at-desk';
  chamber: BilingualText;
  patientName: string;
  patientPhone: string;
  triage: TriageLevel;
  chiefComplaint: string;
  prescriptionId?: string;
}

export interface LabReport {
  id: string;
  testName: BilingualText;
  category: BilingualText;
  date: BilingualText;
  labName: BilingualText;
  resultValue: string;
  referenceRange: string;
  status: 'normal' | 'attention';
  clinicianNote: BilingualText;
  biomarkers: {
    name: string;
    value: string;
    unit: string;
    range: string;
    flag: 'normal' | 'high' | 'low';
  }[];
}

export interface Prescription {
  id: string;
  rxNumber: string;
  date: BilingualText;
  doctorId: string;
  diagnosis: BilingualText;
  vitalsSummary: string;
  followUpDate: BilingualText;
  advice: BilingualText[];
  medications: {
    brand: string;
    generic: string;
    schedule: string;
    duration: BilingualText;
    instruction: BilingualText;
  }[];
}

export type WellnessTipCategory = 'vitals' | 'general';

export interface WellnessTip {
  id: string;
  category: WellnessTipCategory;
  /** Matches VitalMetric.id when tied to a specific logged vital */
  relatedVitalId?: 'vital-hr' | 'vital-bp' | 'vital-glucose' | 'vital-spo2';
  /** 'elevated' tips surface first when the linked vital is outside its target range */
  vitalCondition?: 'any' | 'optimal' | 'elevated';
  topicLabel: BilingualText;
  title: BilingualText;
  body: BilingualText;
  actionStep: BilingualText;
  durationLabel: BilingualText;
  sourceNote: BilingualText;
}

