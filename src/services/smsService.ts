import { SmsMessage, TrustedContact, AshaWorker } from '../types';

export class SmsService {
  private static instance: SmsService;
  private messageHistory: SmsMessage[] = [
    {
      id: 'sms-demo-1',
      recipientName: 'Rohan Sharma (Husband)',
      recipientPhone: '+91 98200 11223',
      recipientRole: 'Family Contact',
      content: '[MatriCare ALERT] Elevate resting pulse (98 bpm) observed for Ananya Sharma at 02:15 PM. Status: Resting. Please check in with her.',
      status: 'delivered',
      timestamp: 'Today at 02:16 PM',
      retryCount: 0,
    },
    {
      id: 'sms-demo-2',
      recipientName: 'Sunita Devi (ASHA)',
      recipientPhone: '+91 94150 12345',
      recipientRole: 'ASHA Worker',
      content: '[MatriCare Follow-up] Scheduled evening calcium dose missed yesterday by Ananya Sharma (Week 24). Added to morning visit review.',
      status: 'delivered',
      timestamp: 'Today at 08:05 AM',
      retryCount: 0,
    },
  ];

  private listeners: ((msgs: SmsMessage[]) => void)[] = [];

  public static getInstance(): SmsService {
    if (!SmsService.instance) {
      SmsService.instance = new SmsService();
    }
    return SmsService.instance;
  }

  public getMessages(): SmsMessage[] {
    return [...this.messageHistory];
  }

  public subscribe(cb: (msgs: SmsMessage[]) => void): () => void {
    this.listeners.push(cb);
    cb(this.getMessages());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const list = this.getMessages();
    this.listeners.forEach((cb) => cb(list));
  }

  public composeEmergencySms(
    patientName: string,
    pregnancyWeek: number,
    eventType: 'sos' | 'fall' | 'vitals',
    locationStr: string,
    contact: TrustedContact | AshaWorker,
    role: SmsMessage['recipientRole']
  ): SmsMessage {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let text = '';

    if (eventType === 'fall') {
      text = `[MatriCare URGENT] Possible fall detected for ${patientName} (Week ${pregnancyWeek}) at ${timeStr}. 30s safety check-in timed out. Location: ${locationStr}. Please check on her immediately or call 108.`;
    } else if (eventType === 'sos') {
      text = `[MatriCare HIGH EMERGENCY] ${patientName} activated SOS beacon at ${timeStr}. Location: ${locationStr}. Urgent human response requested.`;
    } else {
      text = `[MatriCare Warning] Abnormal vitals logged for ${patientName} at ${timeStr}. Verified with rule engine. Please follow up.`;
    }

    const newMsg: SmsMessage = {
      id: 'sms-' + Date.now() + Math.random().toString(36).substring(2, 5),
      recipientName: `${contact.name} (${role})`,
      recipientPhone: contact.phone,
      recipientRole: role,
      content: text,
      status: 'queued',
      timestamp: 'Today at ' + timeStr,
      retryCount: 0,
    };

    this.messageHistory = [newMsg, ...this.messageHistory];
    this.notify();

    // Simulate SMS network delivery latency
    setTimeout(() => {
      this.updateStatus(newMsg.id, 'simulated_sent');
      setTimeout(() => {
        this.updateStatus(newMsg.id, 'delivered');
      }, 1500);
    }, 1000);

    return newMsg;
  }

  public sendCustomSms(recipientName: string, recipientPhone: string, role: SmsMessage['recipientRole'], content: string): SmsMessage {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: SmsMessage = {
      id: 'sms-' + Date.now(),
      recipientName,
      recipientPhone,
      recipientRole: role,
      content,
      status: 'simulated_sent',
      timestamp: 'Today at ' + timeStr,
      retryCount: 0,
    };
    this.messageHistory = [newMsg, ...this.messageHistory];
    this.notify();

    setTimeout(() => {
      this.updateStatus(newMsg.id, 'delivered');
    }, 1200);

    return newMsg;
  }

  public retryMessage(id: string) {
    this.messageHistory = this.messageHistory.map((m) =>
      m.id === id ? { ...m, status: 'simulated_sent', retryCount: m.retryCount + 1 } : m
    );
    this.notify();
    setTimeout(() => {
      this.updateStatus(id, 'delivered');
    }, 1500);
  }

  private updateStatus(id: string, status: SmsMessage['status']) {
    this.messageHistory = this.messageHistory.map((m) => (m.id === id ? { ...m, status } : m));
    this.notify();
  }

  public clearHistory() {
    this.messageHistory = [];
    this.notify();
  }
}

export const smsService = SmsService.getInstance();

