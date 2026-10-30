export type LanguageCode = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr';

export type UserRole = 'pregnant_woman' | 'family' | 'asha' | 'doctor';

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  avatar?: string;
  designation?: string;
  associatedPatientId: string;
}

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
  locationSharingEnabled: boolean;
  city: string;
  state: string;
  emergencyNote?: string;
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
  source: 'Smart Band' | 'Manual Log' | 'Clinic Visit' | 'Wearable BLE (Simulated)';
  isSample: boolean;
  isSimulated?: boolean;
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
  | 'Emergency Checkup'
  | 'Phone Consultation'
  | 'Video Consultation';

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
  isTeleconsult?: boolean;
  meetingLink?: string;
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
  snoozedUntil?: string;
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
  skipReason?: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'attention' | 'acknowledged' | 'resolved';

export interface SafetyAlert {
  id: string;
  type: 'vitals' | 'appointment' | 'medication' | 'emergency' | 'system' | 'fall';
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  isSimulated: boolean;
  actionRecommended?: string;
  metricType?: HealthMetricType;
  patientId?: string;
  location?: LocationData;
  escalatedToAsha?: boolean;
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

// Module 1: Safety & Wearable
export interface BleDeviceStatus {
  connected: boolean;
  batteryLevel: number;
  sensorHealth: {
    pulseSensor: 'operational' | 'calibrating' | 'disconnected';
    spo2Sensor: 'operational' | 'calibrating' | 'disconnected';
    motionSensor: 'operational' | 'calibrating' | 'disconnected';
    temperatureSensor: 'operational' | 'calibrating' | 'disconnected';
    bpSensor: 'operational' | 'optional_not_attached' | 'disconnected';
  };
  buzzerActive: boolean;
  lastPacketTimestamp?: string;
}

export interface FallDetectionState {
  isChecking: boolean;
  secondsRemaining: number;
  buzzerSounding: boolean;
  fallTimestamp: string | null;
  resolved: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  address: string;
  timestamp: string;
  isSimulated: boolean;
  permissionState: 'granted' | 'prompt' | 'denied';
}

export interface SmsMessage {
  id: string;
  recipientName: string;
  recipientPhone: string;
  recipientRole: 'Family Contact' | 'ASHA Worker' | 'Doctor / PHC';
  content: string;
  status: 'queued' | 'simulated_sent' | 'delivered' | 'failed';
  timestamp: string;
  alertId?: string;
  retryCount: number;
}

// Module 2: Smart Insight
export type RiskCategory = 'Normal' | 'Warning' | 'Possible Emergency';

export interface RiskAssessment {
  id: string;
  category: RiskCategory;
  title: string;
  reason: string;
  timestamp: string;
  relevantReadings: {
    metric: string;
    value: string | number;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'emergency';
  }[];
  recommendedAction: string;
  urgencyLevel: 'routine' | 'contact_asha' | 'urgent_108';
  isSimulated: boolean;
}

export interface AiHealthSummary {
  period: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  motherSummary: string;
  ashaSummary: string;
  keyMetricsSummary: {
    metric: string;
    status: 'Stable' | 'Needs Attention' | 'Elevated';
    detail: string;
  }[];
  adherenceRate: number;
  alertsCount: number;
  missedDosesCount: number;
  generatedAt: string;
  isAiGenerated: boolean;
  disclaimer: string;
}

// Module 4: Guidance
export interface GuidanceItem {
  id: string;
  category: 'eat' | 'avoid' | 'dos' | 'donts' | 'warning_signs';
  trimester: 1 | 2 | 3 | 'all';
  weekRange?: string;
  title: string;
  description: string;
  benefitOrRisk: string;
  culturalContext?: string;
  urgency?: 'routine' | 'contact_asha' | 'urgent_108';
}

export interface PregnancyFaq {
  id: string;
  question: string;
  category: 'diet' | 'symptoms' | 'safety' | 'labor' | 'asha';
  answer: string;
  warningNotice?: string;
  suggestedAction?: string;
}

// Module 5: Connected Care
export interface HospitalFacility {
  id: string;
  name: string;
  type: 'District Hospital' | 'Community Health Centre' | 'Medical College' | 'Primary Health Centre';
  phone: string;
  emergencyPhone: string;
  address: string;
  distanceKm: number;
  ambulanceAvailable: boolean;
  maternityBedCapacity: string;
  doctorOnDuty: string;
}

export interface HospitalReferral {
  id: string;
  patientId: string;
  patientName: string;
  gestationalWeek: number;
  facilityId: string;
  facilityName: string;
  reason: string;
  priority: 'Immediate Emergency' | 'Urgent Referral' | 'Routine Transfer';
  ambulanceDispatched: boolean;
  status: 'initiated' | 'en_route' | 'arrived' | 'admitted' | 'resolved';
  timestamp: string;
  notes?: string;
}

export interface AshaFollowUp {
  id: string;
  patientId: string;
  patientName: string;
  type: 'missed_medicine' | 'missed_checkup' | 'abnormal_vital' | 'fall_check' | 'routine_visit';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'escalated';
  createdDate: string;
  notes?: string;
}

export interface OfflineSyncStatus {
  isOnline: boolean;
  pendingReadingsCount: number;
  pendingAlertsCount: number;
  lastSyncedAt: string;
  syncInProgress: boolean;
}
