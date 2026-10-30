import { OfflineSyncStatus } from '../types';

export class OfflineSyncManager {
  private static instance: OfflineSyncManager;
  private status: OfflineSyncStatus = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingReadingsCount: 0,
    pendingAlertsCount: 0,
    lastSyncedAt: 'Just now',
    syncInProgress: false,
  };

  private listeners: ((status: OfflineSyncStatus) => void)[] = [];
  private pendingQueue: any[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  public static getInstance(): OfflineSyncManager {
    if (!OfflineSyncManager.instance) {
      OfflineSyncManager.instance = new OfflineSyncManager();
    }
    return OfflineSyncManager.instance;
  }

  public getStatus(): OfflineSyncStatus {
    return { ...this.status };
  }

  public subscribe(cb: (status: OfflineSyncStatus) => void): () => void {
    this.listeners.push(cb);
    cb(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const s = this.getStatus();
    this.listeners.forEach((cb) => cb(s));
  }

  public setOnlineStatus(online: boolean) {
    this.handleNetworkChange(online);
  }

  private handleNetworkChange(online: boolean) {
    this.status.isOnline = online;
    if (online && (this.status.pendingReadingsCount > 0 || this.status.pendingAlertsCount > 0)) {
      this.triggerAutoSync();
    }
    this.notify();
  }

  public queueOfflineItem(type: 'reading' | 'alert' | 'medication', item: any) {
    this.pendingQueue.push({ type, item, timestamp: Date.now() });
    if (type === 'reading') this.status.pendingReadingsCount += 1;
    if (type === 'alert') this.status.pendingAlertsCount += 1;
    this.notify();
  }

  public async triggerAutoSync(): Promise<{ synced: number }> {
    if (this.status.syncInProgress) return { synced: 0 };
    this.status.syncInProgress = true;
    this.notify();

    // Idempotent sync simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = this.pendingQueue.length;
        this.pendingQueue = [];
        this.status.pendingReadingsCount = 0;
        this.status.pendingAlertsCount = 0;
        this.status.lastSyncedAt = 'Just now';
        this.status.syncInProgress = false;
        this.notify();
        resolve({ synced: count });
      }, 1200);
    });
  }
}

export const offlineSyncService = OfflineSyncManager.getInstance();

