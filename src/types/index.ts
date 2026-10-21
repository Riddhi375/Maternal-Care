export type LanguageCode = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr';

export interface PatientProfile {
  id: string;
  name: string;
  dob: string;
  phone: string;
  bloodGroup: string;
  pregnancyWeek: number;
  estimatedDueDate: string;
  trimester: 1 | 2 | 3;
  gravida: number; // number of pregnancies
  para: number;    // number of births
  language: LanguageCode;
  deviceConnected: boolean;
  deviceModel: string;
  lastSyncTime: string;
  notificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  emergencySharingEnabled: boolean;
  city: string;
  state: string;
}

export type HealthMetricType = 'heartRate' | 'spo2' | 'temperature' | 'bloodPressure' | 'movement';

export interface HealthReading {
  id: string;
  type: HealthMetricType;
  value: number | string;
  unit: string;
  systolic?: number;
  diastolic?: number;
  status: 'normal' | 'attention' | 'critical';
  timestamp: string; // ISO string or human format
  source: 'Smart Band' | 'Manual Log' | 'Clinic Visit';
  isSample: boolean;
  notes?: string;
}

export interface MetricSummary {
  current: string | number;
  unit: string;
  status: 'normal' | 'attention' | 'critical';
  lastUpdated: string;
  source: string;
  trend: 'up' | 'down' | 'stable';
  idealRange: string;
}

export type AppointmentType = 
  | 'Routine Antenatal'
  | 'Ultrasound Scan'
  | 'Blood & Urine Test'
  | 'Glucose Screening'
  | 'ASHA Home Visit'
  | 'Nutrition & Wellness'
  | 'Emergency Checkup';

export interface Appointment {
  id: string;
  title: string;
  doctorName: string;
  specialty: string;
  facility: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: AppointmentType;
  location: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reminderEnabled: boolean;
}

export type MedicationTiming = 'Morning' | 'Afternoon' | 'Night' | 'With Food' | 'Before Sleep';
export type MedicationStatus = 'pending' | 'taken' | 'skipped';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  instructions: string;
  timing: MedicationTiming;
  scheduledTime: string; // e.g. "08:30 AM"
  status: MedicationStatus;
  takenAt?: string;
  color: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: 'taken' | 'skipped';
  actionTime: string;
  date: string; // YYYY-MM-DD
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'attention' | 'acknowledged' | 'resolved';

export interface SafetyAlert {
  id: string;
  type: 'vitals' | 'appointment' | 'medication' | 'emergency' | 'system';
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  acknowledgedAt?: string;
  resolvedAt?: string;
  isSimulated: boolean;
  actionRecommended?: string;
  metricType?: HealthMetricType;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  isVerified: boolean;
  receiveSmsAlerts: boolean;
}

export interface AshaWorker {
  id: string;
  name: string;
  workerId: string;
  phone: string;
  village: string;
  subCentre: string;
  primaryHealthCentre: string;
  avatarUrl: string;
  experienceYears: number;
  nextPlannedVisit: string;
  visitPurpose: string;
  availabilityHours: string;
  assignedBlock: string;
}

export interface PregnancyWeekData {
  week: number;
  trimester: 1 | 2 | 3;
  babySizeFruit: string;
  babySizeInches: string;
  babyWeightGrams: string;
  babyMilestone: string;
  motherChanges: string;
  careTips: string[];
  recommendedTests: string[];
  warningSigns: string[];
}
