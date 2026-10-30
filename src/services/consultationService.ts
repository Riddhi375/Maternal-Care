export interface ConsultationSession {
  id: string;
  doctorName: string;
  specialty: string;
  type: 'video' | 'phone' | 'in_person';
  scheduledTime: string;
  status: 'connecting' | 'active' | 'completed' | 'ended';
  callDurationSeconds: number;
  doctorNotes?: string;
}

export class ConsultationService {
  private static instance: ConsultationService;
  private activeSession: ConsultationSession | null = null;
  private listeners: ((session: ConsultationSession | null) => void)[] = [];

  public static getInstance(): ConsultationService {
    if (!ConsultationService.instance) {
      ConsultationService.instance = new ConsultationService();
    }
    return ConsultationService.instance;
  }

  public getActiveSession(): ConsultationSession | null {
    return this.activeSession;
  }

  public subscribe(cb: (session: ConsultationSession | null) => void): () => void {
    this.listeners.push(cb);
    cb(this.activeSession);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.activeSession));
  }

  public startDemoVideoConsultation(doctorName: string, specialty: string): ConsultationSession {
    this.activeSession = {
      id: 'call-' + Date.now(),
      doctorName,
      specialty,
      type: 'video',
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'connecting',
      callDurationSeconds: 0,
      doctorNotes: 'Patient Ananya Sharma (Week 24). Reporting mild ankle swelling; vitals reviewed over tele-link. Instructed to maintain left-lateral sleeping posture and complete 2nd Trimester Ultrasound scan.',
    };
    this.notify();

    setTimeout(() => {
      if (this.activeSession) {
        this.activeSession.status = 'active';
        this.notify();
      }
    }, 1500);

    return this.activeSession;
  }

  public endConsultation() {
    if (this.activeSession) {
      this.activeSession.status = 'completed';
      this.notify();
      setTimeout(() => {
        this.activeSession = null;
        this.notify();
      }, 500);
    }
  }
}

export const consultationService = ConsultationService.getInstance();
