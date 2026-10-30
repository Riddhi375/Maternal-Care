import { HospitalFacility, HospitalReferral } from '../types';

export const INITIAL_HOSPITALS: HospitalFacility[] = [
  {
    id: 'hosp-1',
    name: 'District Women’s Hospital (Veerangana Jhalkari Bai)',
    type: 'District Hospital',
    phone: '+91 522 262 4111',
    emergencyPhone: '108 / +91 522 262 4999',
    address: 'Near Hazratganj, Civil Lines, Lucknow, Uttar Pradesh',
    distanceKm: 4.8,
    ambulanceAvailable: true,
    maternityBedCapacity: '24 Available Beds (NICU Onsite)',
    doctorOnDuty: 'Dr. S. K. Rastogi (Chief Medical Officer)',
  },
  {
    id: 'hosp-2',
    name: 'Community Health Centre (CHC) Sadar',
    type: 'Community Health Centre',
    phone: '+91 522 245 1200',
    emergencyPhone: '108 / +91 522 245 1299',
    address: 'Sadar Bazar Main Road, Cantt, Lucknow',
    distanceKm: 8.2,
    ambulanceAvailable: true,
    maternityBedCapacity: '8 Available Beds (First Referral Unit)',
    doctorOnDuty: 'Dr. Rashmi Shukla (Obstetric Specialist)',
  },
  {
    id: 'hosp-3',
    name: 'King George’s Medical University (KGMU Queen Mary)',
    type: 'Medical College',
    phone: '+91 522 225 7450',
    emergencyPhone: '108 / 102',
    address: 'Shah Mina Road, Chowk, Lucknow, Uttar Pradesh',
    distanceKm: 12.5,
    ambulanceAvailable: true,
    maternityBedCapacity: 'Level 3 Tertiary Care & Advanced NICU',
    doctorOnDuty: 'Emergency Triage Team #2',
  },
  {
    id: 'hosp-4',
    name: 'Primary Health Centre (PHC) Rampur Kalan',
    type: 'Primary Health Centre',
    phone: '+91 522 291 3004',
    emergencyPhone: '108',
    address: 'Rampur Kalan Sub-division, Block Sadar, Lucknow',
    distanceKm: 1.5,
    ambulanceAvailable: false,
    maternityBedCapacity: 'Day Care Delivery Suite & ASHA Outpost',
    doctorOnDuty: 'Dr. A. K. Verma (Medical Officer)',
  },
];

export const INITIAL_REFERRALS: HospitalReferral[] = [
  {
    id: 'ref-101',
    patientId: 'PAT-8921-IN',
    patientName: 'Ananya Sharma',
    gestationalWeek: 24,
    facilityId: 'hosp-1',
    facilityName: 'District Women’s Hospital',
    reason: 'Routine Second Trimester Detailed Growth & Anomaly Scan transfer',
    priority: 'Routine Transfer',
    ambulanceDispatched: false,
    status: 'arrived',
    timestamp: '2026-10-21 at 10:15 AM',
    notes: 'Accompanied by ASHA Sunita Devi. Reports reviewed by Dr. Meera Nambiar.',
  },
];

export class HospitalService {
  private static instance: HospitalService;
  private referrals: HospitalReferral[] = [...INITIAL_REFERRALS];
  private listeners: ((refs: HospitalReferral[]) => void)[] = [];

  public static getInstance(): HospitalService {
    if (!HospitalService.instance) {
      HospitalService.instance = new HospitalService();
    }
    return HospitalService.instance;
  }

  public getFacilities(): HospitalFacility[] {
    return INITIAL_HOSPITALS;
  }

  public getReferrals(): HospitalReferral[] {
    return [...this.referrals];
  }

  public subscribe(cb: (refs: HospitalReferral[]) => void): () => void {
    this.listeners.push(cb);
    cb(this.getReferrals());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const list = this.getReferrals();
    this.listeners.forEach((cb) => cb(list));
  }

  public createReferral(
    patientId: string,
    patientName: string,
    gestationalWeek: number,
    facilityId: string,
    facilityName: string,
    reason: string,
    priority: HospitalReferral['priority'],
    ambulanceDispatched: boolean
  ): HospitalReferral {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];
    const newRef: HospitalReferral = {
      id: 'ref-' + Date.now(),
      patientId,
      patientName,
      gestationalWeek,
      facilityId,
      facilityName,
      reason,
      priority,
      ambulanceDispatched,
      status: 'initiated',
      timestamp: `${todayStr} at ${timeStr}`,
      notes: ambulanceDispatched
        ? 'Ambulance 108 notified (Simulated emergency dispatch). Driver contact dispatched to family phone.'
        : 'Self-transport advised with ASHA accompaniment.',
    };

    this.referrals = [newRef, ...this.referrals];
    this.notify();

    // Simulate transfer progression
    setTimeout(() => {
      this.updateReferralStatus(newRef.id, 'en_route');
    }, 4000);

    return newRef;
  }

  public updateReferralStatus(id: string, status: HospitalReferral['status'], notes?: string) {
    this.referrals = this.referrals.map((r) =>
      r.id === id ? { ...r, status, notes: notes || r.notes } : r
    );
    this.notify();
  }
}

export const hospitalService = HospitalService.getInstance();

