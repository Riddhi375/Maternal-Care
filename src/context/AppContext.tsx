import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientProfile, 
  HealthReading, 
  Appointment, 
  Medication, 
  MedicationLog, 
  SafetyAlert, 
  TrustedContact, 
  AshaWorker, 
  LanguageCode 
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
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  patient: PatientProfile;
  readings: HealthReading[];
  appointments: Appointment[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  alerts: SafetyAlert[];
  contacts: TrustedContact[];
  ashaWorker: AshaWorker;
  isAuthenticated: boolean;
  sosActive: boolean;
  sosEventTime: string | null;
  toasts: ToastMessage[];

  // Auth
  login: (phone: string) => void;
  register: (profileData: Partial<PatientProfile>) => void;
  logout: () => void;
  updatePatient: (updates: Partial<PatientProfile>) => void;

  // Readings
  addReading: (reading: Omit<HealthReading, 'id' | 'timestamp' | 'isSample'>) => void;

  // Appointments
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;

  // Medications
  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markMedicationStatus: (id: string, status: 'taken' | 'skipped') => void;

  // Alerts
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  addAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => void;

  // Contacts
  addContact: (contact: Omit<TrustedContact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  deleteContact: (id: string) => void;

  // Emergency SOS
  triggerSOS: () => void;
  cancelSOS: () => void;

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
  // Load initial from local storage or defaults
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

  const [patient, setPatient] = useState<PatientProfile>(saved?.patient || initialPatient);
  const [readings, setReadings] = useState<HealthReading[]>(saved?.readings || initialReadings);
  const [appointments, setAppointments] = useState<Appointment[]>(saved?.appointments || initialAppointments);
  const [medications, setMedications] = useState<Medication[]>(saved?.medications || initialMedications);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(saved?.medicationLogs || initialMedicationLogs);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(saved?.alerts || initialAlerts);
  const [contacts, setContacts] = useState<TrustedContact[]>(saved?.contacts || initialContacts);
  const [ashaWorker] = useState<AshaWorker>(saved?.ashaWorker || initialAshaWorker);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(saved?.isAuthenticated ?? true);
  const [sosActive, setSosActive] = useState<boolean>(saved?.sosActive || false);
  const [sosEventTime, setSosEventTime] = useState<string | null>(saved?.sosEventTime || null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state
  useEffect(() => {
    try {
      const stateToSave = {
        patient,
        readings,
        appointments,
        medications,
        medicationLogs,
        alerts,
        contacts,
        ashaWorker,
        isAuthenticated,
        sosActive,
        sosEventTime,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [patient, readings, appointments, medications, medicationLogs, alerts, contacts, ashaWorker, isAuthenticated, sosActive, sosEventTime]);

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

  // Auth actions
  const login = (phone: string) => {
    setPatient((prev) => ({ ...prev, phone }));
    setIsAuthenticated(true);
    addToast('Welcome back, ' + (patient.name || 'Patient') + '!', 'success');
  };

  const register = (profileData: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...profileData }));
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

  // Readings
  const addReading = (reading: Omit<HealthReading, 'id' | 'timestamp' | 'isSample'>) => {
    const newReading: HealthReading = {
      ...reading,
      id: 'rd-' + Date.now(),
      timestamp: 'Just now',
      isSample: true,
    };
    setReadings((prev) => [newReading, ...prev]);
    setPatient((prev) => ({ ...prev, lastSyncTime: 'Just now' }));
    addToast(`Recorded ${reading.type} reading: ${reading.value} ${reading.unit}`, 'success');
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

  const markMedicationStatus = (id: string, status: 'taken' | 'skipped') => {
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
            }
          : m
      )
    );

    // Add to logs
    const newLog: MedicationLog = {
      id: 'log-' + Date.now(),
      medicationId: med.id,
      medicationName: med.name,
      dosage: med.dosage,
      scheduledTime: med.scheduledTime,
      status,
      actionTime: nowTime,
      date: todayStr,
    };
    setMedicationLogs((prev) => [newLog, ...prev]);

    addToast(
      status === 'taken'
        ? `Marked ${med.name} as taken at ${nowTime}`
        : `Marked ${med.name} as skipped`,
      status === 'taken' ? 'success' : 'warning'
    );
  };

  // Alerts
  const acknowledgeAlert = (id: string) => {
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'acknowledged', acknowledgedAt: nowStr } : a
      )
    );
    addToast('Alert acknowledged', 'info');
  };

  const resolveAlert = (id: string) => {
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'resolved', resolvedAt: nowStr } : a
      )
    );
    addToast('Alert resolved and archived in history', 'success');
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

  // Emergency SOS
  const triggerSOS = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSosActive(true);
    setSosEventTime(nowStr);

    // Create an emergency alert
    const sosAlert: SafetyAlert = {
      id: 'alt-sos-' + Date.now(),
      type: 'emergency',
      title: 'EMERGENCY SOS ACTIVATED (Simulated Demo)',
      description: 'Patient initiated high-priority SOS beacon. Simulated emergency protocol initiated: Alerts sent to Primary Contact & Assigned ASHA Worker.',
      timestamp: 'Today at ' + nowStr,
      severity: 'critical',
      status: 'attention',
      isSimulated: true,
      actionRecommended: 'Contact emergency medical services (108 / 102) immediately or proceed to the nearest maternity hospital emergency room.',
    };
    setAlerts((prev) => [sosAlert, ...prev]);
    addToast('EMERGENCY SOS ACTIVATED — Simulated Alert Logged', 'error');
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosEventTime(null);
    addToast('Emergency SOS cancelled and deactivated', 'info');
  };

  // Reset to initial mock data
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
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
    addToast('Sample data reset to default demo state', 'info');
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
        patient,
        readings,
        appointments,
        medications,
        medicationLogs,
        alerts,
        contacts,
        ashaWorker,
        isAuthenticated,
        sosActive,
        sosEventTime,
        toasts,
        login,
        register,
        logout,
        updatePatient,
        addReading,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        addMedication,
        updateMedication,
        deleteMedication,
        markMedicationStatus,
        acknowledgeAlert,
        resolveAlert,
        addAlert,
        addContact,
        updateContact,
        deleteContact,
        triggerSOS,
        cancelSOS,
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
