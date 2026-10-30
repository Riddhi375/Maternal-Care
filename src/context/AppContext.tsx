import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  PatientProfile, 
  HealthReading, 
  Appointment, 
  Medication, 
  MedicationLog, 
  SafetyAlert, 
  TrustedContact, 
  AshaWorker, 
  LanguageCode,
  UserRole,
  UserAccount,
  FallDetectionState,
  RiskAssessment,
  SmsMessage,
  LocationData,
  HospitalReferral,
  AshaFollowUp,
  OfflineSyncStatus,
  BleDeviceStatus,
  HealthMetricType
} from '../types';
import {
  initialPatient,
  initialAppointments,
  initialMedications,
  initialMedicationLogs,
  initialAlerts,
  initialReadings,
  initialContacts,
  initialAshaWorker,
  translations,
  timeSeries24h,
  MetricDataPoint,
  DEMO_ACCOUNTS,
  INITIAL_ASHA_FOLLOWUPS
} from '../data/mockData';
import { riskEngine } from '../services/riskEngine';
import { wearableService, playWearableBuzzer, stopWearableBuzzer } from '../services/bleWearableService';
import { smsService } from '../services/smsService';
import { locationService } from '../services/locationService';
import { hospitalService, INITIAL_REFERRALS } from '../services/hospitalService';
import { offlineSyncService } from '../services/offlineSyncService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Roles & Auth
  currentUserRole: UserRole;
  currentUserAccount: UserAccount;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (phone: string, role?: UserRole) => void;
  register: (profileData: Partial<PatientProfile>) => void;
  logout: () => void;
  updatePatient: (updates: Partial<PatientProfile>) => void;

  // Domain Data
  patient: PatientProfile;
  readings: HealthReading[];
  appointments: Appointment[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  alerts: SafetyAlert[];
  contacts: TrustedContact[];
  ashaWorker: AshaWorker;
  toasts: ToastMessage[];
  chartData24h: MetricDataPoint[];

  // Fall Detection & Buzzer
  fallState: FallDetectionState;
  triggerFallDetection: () => void;
  confirmImOk: () => void;
  buzzerActive: boolean;
  toggleBuzzer: () => void;

  // Emergency SOS
  sosActive: boolean;
  sosEventTime: string | null;
  triggerSOS: () => void;
  cancelSOS: () => void;

  // Risk Engine
  currentRiskAssessment: RiskAssessment;

  // SMS Service
  smsMessages: SmsMessage[];
  sendSms: (toName: string, toPhone: string, role: any, text: string) => void;
  retrySms: (id: string) => void;

  // Location / GPS
  location: LocationData;
  refreshLocation: () => Promise<void>;
  toggleLocationSharing: () => void;

  // Hospital Referrals
  referrals: HospitalReferral[];
  addReferral: (ref: Omit<HospitalReferral, 'id' | 'timestamp'>) => void;
  updateReferralStatus: (id: string, status: HospitalReferral['status']) => void;

  // ASHA Follow-ups
  ashaFollowUps: AshaFollowUp[];
  updateFollowUpStatus: (id: string, status: AshaFollowUp['status'], notes?: string) => void;
  addFollowUp: (followUp: Omit<AshaFollowUp, 'id' | 'createdDate'>) => void;

  // Offline Sync
  offlineStatus: OfflineSyncStatus;
  toggleOnlineSimulation: () => void;
  triggerManualSync: () => Promise<void>;

  // Wearable BLE
  bleStatus: BleDeviceStatus;
  toggleBleConnection: () => void;
  simulateWearableReading: (metric: HealthMetricType, abnormal?: boolean) => void;

  // Domain Actions
  addReading: (reading: Omit<HealthReading, 'id' | 'timestamp' | 'isSample'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;

  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markMedicationStatus: (id: string, status: 'taken' | 'skipped' | 'pending', skipReason?: string) => void;
  snoozeMedication: (id: string, minutes: number) => void;

  acknowledgeAlert: (id: string, acknowledgedBy?: string) => void;
  resolveAlert: (id: string, resolvedBy?: string) => void;
  addAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => void;

  addContact: (contact: Omit<TrustedContact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;

  // System
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  resetToDefaultData: () => void;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'matricare_app_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage state:', e);
    }
    return null;
  };

  const saved = loadSavedState();

  // Role & Auth State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(saved?.currentUserRole || 'pregnant_woman');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(saved?.isAuthenticated ?? true);

  // Core Data
  const [patient, setPatient] = useState<PatientProfile>(saved?.patient || initialPatient);
  const [readings, setReadings] = useState<HealthReading[]>(saved?.readings || initialReadings);
  const [appointments, setAppointments] = useState<Appointment[]>(saved?.appointments || initialAppointments);
  const [medications, setMedications] = useState<Medication[]>(saved?.medications || initialMedications);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(saved?.medicationLogs || initialMedicationLogs);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(saved?.alerts || initialAlerts);
  const [contacts, setContacts] = useState<TrustedContact[]>(saved?.contacts || initialContacts);
  const [ashaWorker] = useState<AshaWorker>(saved?.ashaWorker || initialAshaWorker);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [chartData24h, setChartData24h] = useState<MetricDataPoint[]>(saved?.chartData24h || timeSeries24h);

  // Emergency SOS
  const [sosActive, setSosActive] = useState<boolean>(saved?.sosActive || false);
  const [sosEventTime, setSosEventTime] = useState<string | null>(saved?.sosEventTime || null);

  // Fall Detection State
  const [fallState, setFallState] = useState<FallDetectionState>({
    isChecking: false,
    secondsRemaining: 30,
    buzzerSounding: false,
    fallTimestamp: null,
    resolved: true,
  });

  // Services State
  const [buzzerActive, setBuzzerActive] = useState<boolean>(false);
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>(saved?.smsMessages || smsService.getMessages());
  const [location, setLocation] = useState<LocationData>(saved?.location || locationService.getCurrentLocation());
  const [referrals, setReferrals] = useState<HospitalReferral[]>(saved?.referrals || INITIAL_REFERRALS);
  const [ashaFollowUps, setAshaFollowUps] = useState<AshaFollowUp[]>(saved?.ashaFollowUps || INITIAL_ASHA_FOLLOWUPS);
  const [offlineStatus, setOfflineStatus] = useState<OfflineSyncStatus>(offlineSyncService.getStatus());
  const [bleStatus, setBleStatus] = useState<BleDeviceStatus>(wearableService.getStatus());

  const fallTimerRef = useRef<any>(null);

  // Subscribe to external services
  useEffect(() => {
    const unsubBle = wearableService.subscribe((s) => setBleStatus(s));
    const unsubSms = smsService.subscribe((m) => setSmsMessages(m));
    const unsubOffline = offlineSyncService.subscribe((s) => setOfflineStatus(s));
    const unsubHosp = hospitalService.subscribe((r) => setReferrals(r));
    return () => {
      unsubBle();
      unsubSms();
      unsubOffline();
      unsubHosp();
    };
  }, []);

  // Persist state across page reloads and dashboard role switching
  useEffect(() => {
    try {
      const stateToSave = {
        currentUserRole,
        isAuthenticated,
        patient,
        readings,
        appointments,
        medications,
        medicationLogs,
        alerts,
        contacts,
        ashaWorker,
        sosActive,
        sosEventTime,
        chartData24h,
        smsMessages,
        location,
        referrals,
        ashaFollowUps,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [
    currentUserRole,
    isAuthenticated,
    patient,
    readings,
    appointments,
    medications,
    medicationLogs,
    alerts,
    contacts,
    ashaWorker,
    sosActive,
    sosEventTime,
    chartData24h,
    smsMessages,
    location,
    referrals,
    ashaFollowUps,
  ]);

  // Dynamic Risk Assessment
  const currentRiskAssessment = riskEngine.evaluatePatientRisk(
    readings,
    alerts,
    sosActive,
    fallState.isChecking || (!fallState.resolved && fallState.secondsRemaining === 0)
  );

  // Current User Account Details
  const currentUserAccount: UserAccount = DEMO_ACCOUNTS.find((a) => a.role === currentUserRole) || DEMO_ACCOUNTS[0];

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch Active User Role
  const setUserRole = (role: UserRole) => {
    setCurrentUserRole(role);
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role);
    addToast(`Switched active view to: ${acc?.name || role} (${acc?.designation || ''})`, 'info');
  };

  // Auth actions
  const login = (phone: string, role: UserRole = 'pregnant_woman') => {
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role);
    addToast(`Signed in as ${acc?.name || 'User'} (${acc?.designation || role})`, 'success');
  };

  const register = (profileData: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...profileData }));
    setCurrentUserRole('pregnant_woman');
    setIsAuthenticated(true);
    addToast('Registration complete! Welcome to MatriCare.', 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('You have signed out.', 'info');
  };

  const updatePatient = (updates: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...updates }));
    addToast('Profile updated successfully', 'success');
  };

  // Fall Detection Workflow (30s countdown, buzzer, cancellation, escalation)
  const triggerFallDetection = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (fallTimerRef.current) clearInterval(fallTimerRef.current);

    setFallState({
      isChecking: true,
      secondsRemaining: 30,
      buzzerSounding: true,
      fallTimestamp: timeStr,
      resolved: false,
    });
    setBuzzerActive(true);
    playWearableBuzzer();

    addToast('Possible fall detected! Safety check-in countdown started (30s).', 'warning');

    fallTimerRef.current = setInterval(() => {
      setFallState((prev) => {
        if (prev.secondsRemaining <= 1) {
          clearInterval(fallTimerRef.current);
          stopWearableBuzzer();
          setBuzzerActive(false);

          // Auto escalate to emergency alert because user did not tap I'M OK
          const emergencyAlert: SafetyAlert = {
            id: 'alt-fall-' + Date.now(),
            type: 'fall',
            title: 'POSSIBLE FALL DETECTED (Unresponsive)',
            description: `Movement sensor flagged impact at ${timeStr}. User did not respond to the 30-second check-in buzzer. Automatic alert dispatched to Family & ASHA worker.`,
            timestamp: 'Today at ' + timeStr,
            severity: 'critical',
            status: 'attention',
            isSimulated: true,
            actionRecommended: 'Contact patient immediately or dispatch emergency verification.',
            metricType: 'movement',
            escalatedToAsha: true,
          };
          setAlerts((a) => [emergencyAlert, ...a]);

          // Dispatch simulated SMS to Husband & ASHA
          const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];
          if (primaryContact) {
            smsService.composeEmergencySms(
              patient.name,
              patient.pregnancyWeek,
              'fall',
              location.address,
              primaryContact,
              'Family Contact'
            );
          }
          smsService.composeEmergencySms(
            patient.name,
            patient.pregnancyWeek,
            'fall',
            location.address,
            ashaWorker,
            'ASHA Worker'
          );

          // Add ASHA follow-up record
          const newFollowUp: AshaFollowUp = {
            id: 'fol-' + Date.now(),
            patientId: patient.id,
            patientName: patient.name,
            type: 'fall_check',
            title: 'Urgent Home Check-in: Unconfirmed Fall Detection',
            description: `Band registered sudden impact and unacknowledged 30s check-in at ${timeStr}. Visit patient or verify via phone immediately.`,
            status: 'pending',
            createdDate: new Date().toISOString().split('T')[0],
            notes: 'Alert sent to husband Rohan Sharma.',
          };
          setAshaFollowUps((f) => [newFollowUp, ...f]);

          addToast('Safety check-in expired: Automatic Emergency Alert dispatched to Family & ASHA!', 'error');

          return {
            ...prev,
            isChecking: false,
            secondsRemaining: 0,
            buzzerSounding: false,
            resolved: false,
          };
        }
        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
        };
      });
    }, 1000);
  };

  const confirmImOk = () => {
    if (fallTimerRef.current) clearInterval(fallTimerRef.current);
    stopWearableBuzzer();
    setBuzzerActive(false);

    setFallState((prev) => ({
      ...prev,
      isChecking: false,
      buzzerSounding: false,
      resolved: true,
    }));

    addToast('You tapped "I\'M OK" — Pending fall alert cancelled. Glad you are safe! 🌸', 'success');
  };

  const toggleBuzzer = () => {
    const nextState = !buzzerActive;
    setBuzzerActive(nextState);
    if (nextState) {
      playWearableBuzzer();
      addToast('Simulated Wearable Buzzer & Vibration Activated', 'warning');
    } else {
      stopWearableBuzzer();
      addToast('Wearable Buzzer Silenced', 'info');
    }
  };

  // Emergency SOS Workflow
  const triggerSOS = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSosActive(true);
    setSosEventTime(nowStr);
    playWearableBuzzer();
    setBuzzerActive(true);

    const sosAlert: SafetyAlert = {
      id: 'alt-sos-' + Date.now(),
      type: 'emergency',
      title: 'EMERGENCY SOS ACTIVATED',
      description: `Patient initiated high-priority SOS emergency beacon at ${nowStr}. Automatic notifications dispatched to Family & ASHA.`,
      timestamp: 'Today at ' + nowStr,
      severity: 'critical',
      status: 'attention',
      isSimulated: true,
      actionRecommended: 'Call Emergency 108 immediately or dispatch nearest community healthcare team.',
      location: location,
      escalatedToAsha: true,
    };
    setAlerts((prev) => [sosAlert, ...prev]);

    // Send SMS to contacts
    const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];
    if (primaryContact) {
      smsService.composeEmergencySms(
        patient.name,
        patient.pregnancyWeek,
        'sos',
        location.address,
        primaryContact,
        'Family Contact'
      );
    }
    smsService.composeEmergencySms(
      patient.name,
      patient.pregnancyWeek,
      'sos',
      location.address,
      ashaWorker,
      'ASHA Worker'
    );

    addToast('EMERGENCY SOS ACTIVATED — Alerts Dispatched to Family & ASHA Worker!', 'error');
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosEventTime(null);
    stopWearableBuzzer();
    setBuzzerActive(false);
    addToast('Emergency SOS cancelled and deactivated', 'info');
  };

  // SMS Actions
  const sendSms = (toName: string, toPhone: string, role: any, text: string) => {
    smsService.sendCustomSms(toName, toPhone, role, text);
    addToast(`SMS queued for ${toName} (${toPhone})`, 'info');
  };

  const retrySms = (id: string) => {
    smsService.retryMessage(id);
    addToast('Retrying SMS transmission...', 'info');
  };

  // GPS / Location Actions
  const refreshLocation = async () => {
    addToast('Capturing live device GPS coordinates...', 'info');
    const loc = await locationService.requestLiveLocation();
    setLocation(loc);
    addToast(`Location updated: ${loc.address}`, 'success');
  };

  const toggleLocationSharing = () => {
    const nextVal = !patient.locationSharingEnabled;
    setPatient((prev) => ({ ...prev, locationSharingEnabled: nextVal }));
    addToast(nextVal ? 'Emergency GPS location sharing enabled' : 'Location sharing disabled', 'info');
  };

  // Hospital Referral Actions
  const addReferral = (ref: Omit<HospitalReferral, 'id' | 'timestamp'>) => {
    const newRef = hospitalService.createReferral(
      ref.patientId,
      ref.patientName,
      ref.gestationalWeek,
      ref.facilityId,
      ref.facilityName,
      ref.reason,
      ref.priority,
      ref.ambulanceDispatched
    );
    addToast(`Referral initiated to ${newRef.facilityName}`, 'success');
  };

  const updateReferralStatus = (id: string, status: HospitalReferral['status']) => {
    hospitalService.updateReferralStatus(id, status);
    addToast(`Hospital referral status updated to ${status}`, 'info');
  };

  // ASHA Follow-up Actions
  const updateFollowUpStatus = (id: string, status: AshaFollowUp['status'], notes?: string) => {
    setAshaFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status, notes: notes || f.notes } : f))
    );
    addToast(`Follow-up marked as ${status}`, 'success');
  };

  const addFollowUp = (followUp: Omit<AshaFollowUp, 'id' | 'createdDate'>) => {
    const newFollowUp: AshaFollowUp = {
      ...followUp,
      id: 'fol-' + Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setAshaFollowUps((prev) => [newFollowUp, ...prev]);
    addToast(`Created follow-up item for ${followUp.patientName}`, 'success');
  };

  // Offline Sync Actions
  const toggleOnlineSimulation = () => {
    const nextOnline = !offlineStatus.isOnline;
    offlineSyncService.setOnlineStatus(nextOnline);
    addToast(
      nextOnline ? 'Network restored! Reconnected to cloud sync.' : 'Switched to Simulated Offline Mode (Local Storage Active).',
      nextOnline ? 'success' : 'warning'
    );
  };

  const triggerManualSync = async () => {
    addToast('Synchronizing local records with healthcare registry...', 'info');
    const res = await offlineSyncService.triggerAutoSync();
    setPatient((prev) => ({ ...prev, lastSyncTime: 'Just now' }));
    addToast(`Sync complete! ${res.synced} pending items synchronized successfully.`, 'success');
  };

  // Wearable BLE Actions
  const toggleBleConnection = () => {
    const connected = wearableService.toggleConnection();
    setPatient((prev) => ({ ...prev, deviceConnected: connected }));
    addToast(
      connected ? 'Smart Band (BLE) reconnected successfully.' : 'Smart Band disconnected.',
      connected ? 'success' : 'warning'
    );
  };

  const simulateWearableReading = (metric: HealthMetricType, abnormal = false) => {
    const partial = wearableService.generateSimulatedReading(metric, abnormal);
    addReading(partial as any);
  };

  // Readings
  const addReading = (reading: Omit<HealthReading, 'id' | 'timestamp' | 'isSample'>) => {
    const newReading: HealthReading = {
      ...reading,
      id: 'rd-' + Date.now(),
      timestamp: 'Just now',
      isSample: true,
      isSimulated: true,
    };

    setReadings((prev) => [newReading, ...prev]);
    setPatient((prev) => ({ ...prev, lastSyncTime: 'Just now' }));

    if (!offlineStatus.isOnline) {
      offlineSyncService.queueOfflineItem('reading', newReading);
    }

    // Dynamic update to 24-hour chart trend
    const nowHour = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const lastPt = chartData24h[chartData24h.length - 1] || timeSeries24h[timeSeries24h.length - 1];
    const newChartPoint: MetricDataPoint = {
      time: nowHour,
      heartRate: reading.type === 'heartRate' ? Number(reading.value) : lastPt.heartRate,
      spo2: reading.type === 'spo2' ? Number(reading.value) : lastPt.spo2,
      temperature: reading.type === 'temperature' ? Number(reading.value) : lastPt.temperature,
      systolic: reading.systolic ?? (reading.type === 'bloodPressure' ? Number(String(reading.value).split('/')[0]) : lastPt.systolic),
      diastolic: reading.diastolic ?? (reading.type === 'bloodPressure' ? Number(String(reading.value).split('/')[1]) : lastPt.diastolic),
      movement: reading.type === 'movement' ? Number(reading.value) : lastPt.movement,
      status: 'Logged',
    };
    setChartData24h((prev) => [...prev, newChartPoint]);

    // Check if reading should trigger a safety alert
    if (reading.status === 'attention' || reading.status === 'critical') {
      const alertTitle = reading.type === 'heartRate' ? 'Elevated Heart Rate Flagged' : reading.type === 'spo2' ? 'Low SpO2 Level Detected' : 'Abnormal Vital Sign Logged';
      const newAlert: SafetyAlert = {
        id: 'alt-auto-' + Date.now(),
        type: 'vitals',
        title: alertTitle,
        description: `Value of ${reading.value} ${reading.unit} observed from ${reading.source}.`,
        timestamp: 'Just now',
        severity: reading.status === 'critical' ? 'critical' : 'warning',
        status: 'attention',
        isSimulated: true,
        actionRecommended: 'Sit comfortably, hydrate, and re-check in 15 minutes. Notify ASHA if persistent.',
        metricType: reading.type,
      };
      setAlerts((a) => [newAlert, ...a]);
    }

    addToast(`Recorded ${reading.type}: ${reading.value} ${reading.unit}`, 'success');
  };

  // Appointments
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...appointment,
      id: 'apt-' + Date.now(),
      status: 'upcoming',
    };
    setAppointments((prev) => [newApt, ...prev]);
    addToast(`Scheduled appointment with ${appointment.doctorName}`, 'success');
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addToast('Appointment details updated', 'success');
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    addToast('Appointment cancelled successfully', 'info');
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a))
    );
    addToast('Marked check-up as completed', 'success');
  };

  // Medications
  const addMedication = (med: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...med,
      id: 'med-' + Date.now(),
    };
    setMedications((prev) => [...prev, newMed]);
    addToast(`Added medicine reminder for ${med.name}`, 'success');
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    addToast('Medication updated', 'success');
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
    addToast('Medication reminder removed', 'info');
  };

  const markMedicationStatus = (id: string, status: 'taken' | 'skipped' | 'pending', skipReason?: string) => {
    const med = medications.find((m) => m.id === id);
    if (!med) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];

    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              takenAt: status === 'taken' ? nowTime : undefined,
              snoozedUntil: undefined,
            }
          : m
      )
    );

    if (status === 'pending') {
      // Revert/remove recent dose log for this medication today
      setMedicationLogs((prev) => prev.filter((l) => !(l.medicationId === med.id && l.date === todayStr)));
      addToast(`Reverted ${med.name} to pending`, 'info');
    } else {
      const newLog: MedicationLog = {
        id: 'log-' + Date.now(),
        medicationId: med.id,
        medicationName: med.name,
        dosage: med.dosage,
        scheduledTime: med.scheduledTime,
        status,
        actionTime: nowTime,
        date: todayStr,
        skipReason: skipReason || undefined,
      };
      setMedicationLogs((prev) => [newLog, ...prev]);

      if (status === 'skipped') {
        // Automatically create ASHA follow-up notification if missed
        const missedFollowUp: AshaFollowUp = {
          id: 'fol-med-' + Date.now(),
          patientId: patient.id,
          patientName: patient.name,
          type: 'missed_medicine',
          title: `Missed Dose: ${med.name}`,
          description: `Patient marked scheduled ${med.timing} dose as skipped. Reason: ${skipReason || 'Not stated'}. Follow-up at next routine contact.`,
          status: 'pending',
          createdDate: todayStr,
        };
        setAshaFollowUps((f) => [missedFollowUp, ...f]);
      }

      addToast(
        status === 'taken'
          ? `Marked ${med.name} as taken at ${nowTime}`
          : `Marked ${med.name} as skipped`,
        status === 'taken' ? 'success' : 'warning'
      );
    }
  };

  const snoozeMedication = (id: string, minutes: number) => {
    const targetDate = new Date(Date.now() + minutes * 60000);
    const timeStr = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, snoozedUntil: timeStr } : m))
    );
    addToast(`Snoozed reminder for ${minutes} minutes (until ${timeStr})`, 'info');
  };

  // Alerts
  const acknowledgeAlert = (id: string, acknowledgedBy = 'Patient') => {
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'acknowledged', acknowledgedAt: nowStr, acknowledgedBy } : a
      )
    );
    addToast(`Alert acknowledged by ${acknowledgedBy}`, 'info');
  };

  const resolveAlert = (id: string, resolvedBy = 'Care Team') => {
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'resolved', resolvedAt: nowStr, resolvedBy } : a
      )
    );
    addToast(`Alert resolved and archived in history by ${resolvedBy}`, 'success');
  };

  const addAlert = (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => {
    const newAlert: SafetyAlert = {
      ...alert,
      id: 'alt-' + Date.now(),
      timestamp: 'Just now',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addToast(`New alert: ${alert.title}`, alert.severity === 'critical' ? 'error' : 'warning');
  };

  // Contacts
  const addContact = (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: 'tc-' + Date.now(),
    };
    setContacts((prev) => [...prev, newContact]);
    addToast(`Added ${contact.name} to trusted contacts`, 'success');
  };

  const updateContact = (id: string, updates: Partial<TrustedContact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast('Contact updated successfully', 'success');
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    addToast('Contact removed', 'info');
  };

  // Reset to initial mock data
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUserRole('pregnant_woman');
    setPatient(initialPatient);
    setReadings(initialReadings);
    setAppointments(initialAppointments);
    setMedications(initialMedications);
    setMedicationLogs(initialMedicationLogs);
    setAlerts(initialAlerts);
    setContacts(initialContacts);
    setIsAuthenticated(true);
    setSosActive(false);
    setSosEventTime(null);
    setFallState({
      isChecking: false,
      secondsRemaining: 30,
      buzzerSounding: false,
      fallTimestamp: null,
      resolved: true,
    });
    setReferrals(INITIAL_REFERRALS);
    setAshaFollowUps(INITIAL_ASHA_FOLLOWUPS);
    addToast('All demo datasets reset to original verified state', 'info');
  };

  const setLanguage = (lang: LanguageCode) => {
    setPatient((prev) => ({ ...prev, language: lang }));
    addToast(`Language updated`, 'info');
  };

  const t = (key: string): string => {
    const lang = patient.language || 'en';
    const dict = translations[lang] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentUserRole,
        currentUserAccount,
        setUserRole,
        isAuthenticated,
        login,
        register,
        logout,
        updatePatient,

        patient,
        readings,
        appointments,
        medications,
        medicationLogs,
        alerts,
        contacts,
        ashaWorker,
        toasts,
        chartData24h,

        fallState,
        triggerFallDetection,
        confirmImOk,
        buzzerActive,
        toggleBuzzer,

        sosActive,
        sosEventTime,
        triggerSOS,
        cancelSOS,

        currentRiskAssessment,

        smsMessages,
        sendSms,
        retrySms,

        location,
        refreshLocation,
        toggleLocationSharing,

        referrals,
        addReferral,
        updateReferralStatus,

        ashaFollowUps,
        updateFollowUpStatus,
        addFollowUp,

        offlineStatus,
        toggleOnlineSimulation,
        triggerManualSync,

        bleStatus,
        toggleBleConnection,
        simulateWearableReading,

        addReading,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        completeAppointment,

        addMedication,
        updateMedication,
        deleteMedication,
        markMedicationStatus,
        snoozeMedication,

        acknowledgeAlert,
        resolveAlert,
        addAlert,

        addContact,
        updateContact,
        deleteContact,

        addToast,
        removeToast,
        resetToDefaultData,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
