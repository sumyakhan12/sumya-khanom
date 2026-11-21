import { BilingualText, Language } from '../types';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toLocaleDigits(input: string | number, lang: Language): string {
  const str = String(input);
  if (lang === 'en') return str;
  return str.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export function formatBDT(amount: number, lang: Language): { symbol: string; value: string } {
  const formatted = amount.toLocaleString('en-IN');
  return {
    symbol: '৳',
    value: toLocaleDigits(formatted, lang),
  };
}

export function pick(text: BilingualText, lang: Language): string {
  return lang === 'bn' ? text.bn : text.en;
}

export const UI_COPY = {
  brand: { en: 'Mediora', bn: 'মেডিওরা' },
  tagline: { en: 'Healthcare, Made Easier.', bn: 'স্বাস্থ্যসেবা, এখন আরও সহজ।' },
  nav: {
    overview: { en: 'Home', bn: 'হোম' },
    doctors: { en: 'Find Doctors', bn: 'বিশেষজ্ঞ খুঁজুন' },
    departments: { en: 'Departments', bn: 'বিভাগসমূহ' },
    appointments: { en: 'Appointments', bn: 'অ্যাপয়েন্টমেন্ট' },
    records: { en: 'Health Records', bn: 'স্বাস্থ্য রেকর্ড' },
    login: { en: 'Log In', bn: 'লগ ইন' },
    account: { en: 'Account', bn: 'অ্যাকাউন্ট' },
    bookCta: { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট নিন' },
  },
  workspace: {
    patientId: { en: 'Patient ID', bn: 'রোগী আইডি' },
    dhakaRegion: { en: 'Mediora · BMDC-Verified Care Network', bn: 'মেডিওরা · বিএমডিসি যাচাইকৃত সেবা নেটওয়ার্ক' },
    greeting: { en: 'Thoughtful care for Rafiqul, without the wait.', bn: 'রফিকুলের জন্য নির্বিঘ্ন ও আধুনিক স্বাস্থ্যসেবা।' },
    subtitle: {
      en: 'Your latest vitals look steady and balanced. Search BMDC-verified specialists, manage your next chamber serial, or review pathology results in one calm workspace.',
      bn: 'আপনার সাম্প্রতিক শারীরিক পরিমাপ স্বাভাবিক সীমায় আছে। বিএমডিসি যাচাইকৃত বিশেষজ্ঞ খুঁজুন, চেম্বার সিরিয়াল পরিচালনা করুন এবং ল্যাব রিপোর্ট দেখুন একই স্থানে।',
    },
    heroSearchPlaceholder: {
      en: 'Doctor, specialty, or hospital...',
      bn: 'ডাক্তার, বিভাগ বা হাসপাতাল খুঁজুন...',
    },
    heroSearchBtn: { en: 'Find Care', bn: 'খুঁজুন' },
    bookSpecialistBtn: { en: 'Book Specialist Visit', bn: 'বিশেষজ্ঞ সাক্ষাৎ নিন' },
    viewRecordsBtn: { en: 'View Lab Results', bn: 'ল্যাব রিপোর্ট দেখুন' },
    departmentsHeading: { en: 'Explore Clinical Departments', bn: 'বিশেষায়িত বিভাগসমূহ' },
    departmentsSubtitle: {
      en: 'Select a specialty to view verified consultants and open chamber slots today.',
      bn: 'আজকের উপলব্ধ বিশেষজ্ঞ ও চেম্বার স্লট দেখতে একটি বিভাগ নির্বাচন করুন।',
    },
    nextAppointment: { en: 'Next Confirmed Visit', bn: 'পরবর্তী নিশ্চিত সাক্ষাৎ' },
    noUpcoming: { en: 'No upcoming appointments scheduled', bn: 'কোনো আসন্ন অ্যাপয়েন্টমেন্ট নির্ধারিত নেই' },
    manageQueue: { en: 'Manage Visit', bn: 'বিস্তারিত দেখুন' },
    vitalsHeading: { en: 'Clinical Vitals & Trends', bn: 'শারীরিক পরিমাপ ও প্রবণতা' },
    logReading: { en: 'Log Reading', bn: 'নতুন পরিমাপ যোগ করুন' },
    providerAvailHeading: { en: 'Specialist Availability Today', bn: 'আজকের বিশেষজ্ঞ সময়সূচী' },
    viewAllDoctors: { en: 'Browse all specialists', bn: 'সকল বিশেষজ্ঞ দেখুন' },
    medsHeading: { en: 'Today’s Medication Schedule', bn: 'আজকের ওষুধের সময়সূচী' },
    medsTakenCount: { en: 'doses taken today', bn: 'ডোজ আজ নেওয়া হয়েছে' },
    openSlotsLabel: { en: 'open slots', bn: 'খালি স্লট' },
    bookedLabel: { en: 'Booked', bn: 'বুকড' },
    openLabel: { en: 'Open', bn: 'খালি' },
    quickBook: { en: 'Book Slot', bn: 'বুক করুন' },
  },
  directory: {
    title: { en: 'Specialist Directory', bn: 'বিশেষজ্ঞ চিকিৎসক তালিকা' },
    subtitle: {
      en: 'Search BMDC-verified consultants across Dhaka and Chattogram with transparent BDT fees and real-time chamber slots.',
      bn: 'ঢাকা ও চট্টগ্রামের বিএমডিসি যাচাইকৃত বিশেষজ্ঞ চিকিৎসক খুঁজুন—স্বচ্ছ ফি এবং তাৎক্ষণিক চেম্বার স্লটসহ।',
    },
    searchPlaceholder: {
      en: 'Search by doctor name, hospital, specialty, or BMDC license...',
      bn: 'ডাক্তারের নাম, হাসপাতাল, বিভাগ বা বিএমডিসি নম্বর দিয়ে খুঁজুন...',
    },
    allSpecialties: { en: 'All Specialties', bn: 'সকল বিভাগ' },
    allCities: { en: 'All Cities', bn: 'সকল শহর' },
    allModes: { en: 'All Modes', bn: 'সকল মাধ্যম' },
    inPerson: { en: 'In-Person Chamber', bn: 'চেম্বার সাক্ষাৎ' },
    videoConsult: { en: 'Video Consult', bn: 'ভিডিও পরামর্শ' },
    bmdcVerified: { en: 'BMDC Verified', bn: 'বিএমডিসি যাচাইকৃত' },
    experience: { en: 'yrs exp.', bn: 'বছর অভিজ্ঞতা' },
    consultationFee: { en: 'Consultation Fee', bn: 'পরামর্শ ফি' },
    bookAppointment: { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট নিন' },
    showingCount: { en: 'specialists matching filters', bn: 'জন বিশেষজ্ঞ পাওয়া গেছে' },
    emptyTitle: { en: 'No matching specialists found', bn: 'কোনো বিশেষজ্ঞ পাওয়া যায়নি' },
    emptyBody: {
      en: 'Try clearing a specialty or city filter to view all available BMDC-registered consultants.',
      bn: 'সকল বিএমডিসি নিবন্ধিত বিশেষজ্ঞ দেখতে বিভাগ বা শহরের ফিল্টার পরিবর্তন করুন।',
    },
    resetFilters: { en: 'Reset Filters', bn: 'ফিল্টার রিসেট করুন' },
  },
  booking: {
    step1: { en: '1. Schedule', bn: '১. সময়সূচী' },
    step2: { en: '2. Patient & Triage', bn: '২. রোগীর তথ্য' },
    step3: { en: '3. BDT Payment', bn: '৩. পেমেন্ট' },
    selectDate: { en: 'Select Appointment Date', bn: 'সাক্ষাতের তারিখ নির্বাচন করুন' },
    consultType: { en: 'Consultation Format', bn: 'পরামর্শের ধরন' },
    availableSlots: { en: 'Available Time Slots', bn: 'উপলব্ধ সময় স্লট' },
    continue: { en: 'Continue', bn: 'পরবর্তী ধাপ' },
    back: { en: 'Back', bn: 'পেছনে' },
    patientName: { en: 'Patient Full Name', bn: 'রোগীর পূর্ণ নাম' },
    mobileNumber: { en: 'Bangladesh Mobile Number', bn: 'বাংলাদেশ মোবাইল নম্বর' },
    mobileHint: { en: '10 digits starting with 1 (e.g. 1712345678)', bn: '১ দিয়ে শুরু ১০ ডিজিট (যেমন: 1712345678)' },
    mobileError: { en: 'Enter a valid 10-digit BD mobile number (e.g. 17XXXXXXXX)', bn: 'সঠিক ১০ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 17XXXXXXXX)' },
    triagePriority: { en: 'Visit Priority / Triage', bn: 'সাক্ষাতের অগ্রাধিকার' },
    routine: { en: 'Routine Checkup', bn: 'নিয়মিত চেকআপ' },
    followup: { en: 'Report Follow-Up', bn: 'রিপোর্ট ফলো-আপ' },
    urgent: { en: 'Urgent Symptom', bn: 'জরুরি উপসর্গ' },
    chiefComplaint: { en: 'Brief Symptoms or Reason for Visit', bn: 'উপসর্গ বা সাক্ষাতের সংক্ষিপ্ত কারণ' },
    complaintPlaceholder: {
      en: 'e.g., Mild chest tightness after evening walk, routine lipid review...',
      bn: 'যেমন: সন্ধ্যায় হাঁটার পর বুকে হালকা চাপ, রক্তের লিপিড রিপোর্ট দেখানো...',
    },
    paymentTitle: { en: 'Select Local Payment Method', bn: 'পেমেন্ট মাধ্যম নির্বাচন করুন' },
    feeBreakdown: { en: 'Consultation Summary', bn: 'ফি বিবরণী' },
    doctorFee: { en: 'Specialist Consultation Fee', bn: 'বিশেষজ্ঞ পরামর্শ ফি' },
    platformFee: { en: 'Digital Prescription & Queue SMS', bn: 'ডিজিটাল প্রেসক্রিপশন ও সিরিয়াল এসএমএস' },
    totalPayable: { en: 'Total Payable', bn: 'মোট প্রদেয়' },
    walletNumber: { en: 'Wallet Account Number', bn: 'ওয়ালেট অ্যাকাউন্ট নম্বর' },
    confirmPay: { en: 'Confirm & Book Serial', bn: 'নিশ্চিত করুন ও সিরিয়াল নিন' },
    confirmedTitle: { en: 'Appointment Confirmed', bn: 'অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে' },
    confirmedSubtitle: {
      en: 'Your serial token and chamber directions have been added to your Appointments schedule.',
      bn: 'আপনার সিরিয়াল নম্বর ও চেম্বারের তথ্য অ্যাপয়েন্টমেন্ট তালিকায় যুক্ত হয়েছে।',
    },
    serialLabel: { en: 'Chamber Serial', bn: 'চেম্বার সিরিয়াল' },
    viewAppointments: { en: 'Go to Appointments', bn: 'অ্যাপয়েন্টমেন্ট দেখুন' },
    rescheduleTitle: { en: 'Reschedule Appointment', bn: 'অ্যাপয়েন্টমেন্ট সময় পরিবর্তন' },
    saveReschedule: { en: 'Confirm New Slot', bn: 'নতুন সময় নিশ্চিত করুন' },
  },
  appointments: {
    title: { en: 'Appointments & Queue Manager', bn: 'অ্যাপয়েন্টমেন্ট ও সিরিয়াল ব্যবস্থাপনা' },
    subtitle: {
      en: 'Track chamber serial numbers, reporting rooms, payment receipts, and reschedule visits seamlessly.',
      bn: 'চেম্বার সিরিয়াল, রুম নম্বর, পেমেন্ট রসিদ দেখুন এবং প্রয়োজনে সাক্ষাতের সময় পরিবর্তন করুন।',
    },
    upcoming: { en: 'Upcoming', bn: 'আসন্ন' },
    completed: { en: 'Completed', bn: 'সম্পন্ন' },
    cancelled: { en: 'Cancelled', bn: 'বাতিল' },
    reschedule: { en: 'Reschedule', bn: 'সময় বদলান' },
    cancelVisit: { en: 'Cancel Visit', bn: 'বাতিল করুন' },
    confirmCancelPrompt: { en: 'Cancel this confirmed serial?', bn: 'এই নিশ্চিত সিরিয়ালটি কি বাতিল করবেন?' },
    keepVisit: { en: 'Keep Visit', bn: 'রাখুন' },
    confirmCancelBtn: { en: 'Yes, Cancel', bn: 'হ্যাঁ, বাতিল করুন' },
    viewRx: { en: 'View Prescription', bn: 'প্রেসক্রিপশন দেখুন' },
    paidVia: { en: 'Paid via', bn: 'পরিশোধিত:' },
    payAtDesk: { en: 'Pay at Hospital Desk', bn: 'হাসপাতাল ডেস্কে পরিশোধ' },
    emptyUpcoming: { en: 'No upcoming visits in your queue', bn: 'কোনো আসন্ন সাক্ষাৎ নেই' },
    emptyDesc: {
      en: 'Schedule an in-person chamber visit or video consultation with a BMDC-verified specialist.',
      bn: 'বিএমডিসি যাচাইকৃত বিশেষজ্ঞের সাথে চেম্বার বা ভিডিও পরামর্শ বুক করুন।',
    },
  },
  records: {
    title: { en: 'Health Records & Diagnostics', bn: 'স্বাস্থ্য রেকর্ড ও ডায়াগনস্টিক রিপোর্ট' },
    subtitle: {
      en: 'Review verified pathology lab panels, reference ranges, and downloadable digital prescriptions.',
      bn: 'যাচাইকৃত প্যাথলজি ল্যাব রিপোর্ট, রেফারেন্স মান এবং ডিজিটাল প্রেসক্রিপশন পর্যালোচনা করুন।',
    },
    labTab: { en: 'Lab Diagnostics', bn: 'ল্যাব রিপোর্ট' },
    rxTab: { en: 'Digital Prescriptions', bn: 'ডিজিটাল প্রেসক্রিপশন' },
    allReports: { en: 'All Reports', bn: 'সব রিপোর্ট' },
    normalOnly: { en: 'Within Range', bn: 'স্বাভাবিক' },
    attentionOnly: { en: 'Attention Needed', bn: 'মনোযোগ প্রয়োজন' },
    colTest: { en: 'Diagnostic Panel', bn: 'পরীক্ষার নাম' },
    colLab: { en: 'Laboratory', bn: 'ডায়াগনস্টিক সেন্টার' },
    colDate: { en: 'Report Date', bn: 'তারিখ' },
    colResult: { en: 'Key Reading', bn: 'ফলাফল' },
    colStatus: { en: 'Clinical Status', bn: 'অবস্থা' },
    colAction: { en: 'Details', bn: 'বিস্তারিত' },
    inspect: { en: 'Inspect Panel', bn: 'বিস্তারিত' },
    normalLabel: { en: 'Normal', bn: 'স্বাভাবিক' },
    attentionLabel: { en: 'Attention Needed', bn: 'মনোযোগ প্রয়োজন' },
    clinicianNote: { en: 'Pathologist & Clinician Note', bn: 'চিকিৎসকের মন্তব্য' },
    closePanel: { en: 'Close', bn: 'বন্ধ করুন' },
    rxDiagnosis: { en: 'Clinical Assessment / Diagnosis', bn: 'রোগ নির্ণয়' },
    rxAdvice: { en: 'Clinical Advice & Lifestyle Guidance', bn: 'পরামর্শ ও জীবনযাপন নির্দেশনা' },
    rxFollowUp: { en: 'Recommended Follow-Up', bn: 'পরবর্তী ফলো-আপ' },
    printRx: { en: 'Print Prescription', bn: 'প্রেসক্রিপশন প্রিন্ট করুন' },
  },
  logVital: {
    title: { en: 'Log New Clinical Reading', bn: 'নতুন শারীরিক পরিমাপ যোগ করুন' },
    selectMetric: { en: 'Vital Parameter', bn: 'পরিমাপের ধরন' },
    valueLabel: { en: 'Measured Value', bn: 'পরিমাপকৃত মান' },
    save: { en: 'Save Reading', bn: 'সংরক্ষণ করুন' },
    cancel: { en: 'Cancel', bn: 'বাতিল' },
  },
  wellnessTips: {
    heading: { en: 'Daily Wellness Tips', bn: 'দৈনিক সুস্থতার পরামর্শ' },
    subtitle: {
      en: 'Curated guidance tuned to your logged vitals and everyday preventive care.',
      bn: 'আপনার লিপিবদ্ধ শারীরিক পরিমাপ ও দৈনন্দিন স্বাস্থ্য সুরক্ষার সাথে সামঞ্জস্যপূর্ণ পরামর্শ।',
    },
    filterAll: { en: 'All Tips', bn: 'সব পরামর্শ' },
    filterVitals: { en: 'For Your Vitals', bn: 'পরিমাপ ভিত্তিক' },
    filterGeneral: { en: 'General Care', bn: 'সাধারণ যত্ন' },
    matchedTo: { en: 'Matched to your', bn: 'সামঞ্জস্যপূর্ণ:' },
    generalMaintenance: { en: 'General Health Maintenance', bn: 'সার্বিক স্বাস্থ্য সুরক্ষা' },
    tryTodayLabel: { en: 'Simple step for today', bn: 'আজকের সহজ পদক্ষেপ' },
    markPracticed: { en: 'Mark as practiced', bn: 'অনুশীলন করেছি' },
    practicedToday: { en: 'Practiced today', bn: 'আজ অনুশীলন সম্পন্ন' },
    nextTip: { en: 'Next tip', bn: 'পরবর্তী পরামর্শ' },
    prevTip: { en: 'Previous tip', bn: 'পূর্ববর্তী পরামর্শ' },
    updateVitalCta: { en: 'Log updated reading', bn: 'নতুন পরিমাপ দিন' },
    consultDoctorCta: { en: 'Discuss with a doctor', bn: 'বিশেষজ্ঞের পরামর্শ নিন' },
  },
} as const;

