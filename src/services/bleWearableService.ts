import { BleDeviceStatus, HealthMetricType, HealthReading } from '../types';

let audioCtx: AudioContext | null = null;
let buzzerOscillator: OscillatorNode | null = null;
let buzzerGain: GainNode | null = null;

export const playWearableBuzzer = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (buzzerOscillator) {
      return; // Already playing
    }

    buzzerOscillator = audioCtx.createOscillator();
    buzzerGain = audioCtx.createGain();

    buzzerOscillator.type = 'square';
    buzzerOscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz beep

    // Pulsing volume for buzzer effect
    buzzerGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

    buzzerOscillator.connect(buzzerGain);
    buzzerGain.connect(audioCtx.destination);
    buzzerOscillator.start();
  } catch (err) {
    console.warn('Web Audio buzzer simulation notice:', err);
  }
};

export const stopWearableBuzzer = () => {
  try {
    if (buzzerOscillator) {
      buzzerOscillator.stop();
      buzzerOscillator.disconnect();
      buzzerOscillator = null;
    }
    if (buzzerGain) {
      buzzerGain.disconnect();
      buzzerGain = null;
    }
  } catch (err) {
    console.warn('Error stopping buzzer:', err);
  }
};

export interface BlePacket {
  pulse: number;
  spo2: number;
  temperature: number;
  movementSteps: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  fallFlag: boolean;
  sosFlag: boolean;
  batteryPct: number;
  timestamp: string;
}

export class BleWearableManager {
  private static instance: BleWearableManager;
  private status: BleDeviceStatus = {
    connected: true,
    batteryLevel: 88,
    sensorHealth: {
      pulseSensor: 'operational',
      spo2Sensor: 'operational',
      motionSensor: 'operational',
      temperatureSensor: 'operational',
      bpSensor: 'operational',
    },
    buzzerActive: false,
    lastPacketTimestamp: new Date().toLocaleTimeString(),
  };

  private listeners: ((status: BleDeviceStatus) => void)[] = [];

  private constructor() {}

  public static getInstance(): BleWearableManager {
    if (!BleWearableManager.instance) {
      BleWearableManager.instance = new BleWearableManager();
    }
    return BleWearableManager.instance;
  }

  public getStatus(): BleDeviceStatus {
    return { ...this.status };
  }

  public subscribe(callback: (status: BleDeviceStatus) => void): () => void {
    this.listeners.push(callback);
    callback(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    const s = this.getStatus();
    this.listeners.forEach((cb) => cb(s));
  }

  public toggleConnection(): boolean {
    this.status.connected = !this.status.connected;
    this.notify();
    return this.status.connected;
  }

  public setBuzzer(active: boolean) {
    this.status.buzzerActive = active;
    if (active) {
      playWearableBuzzer();
    } else {
      stopWearableBuzzer();
    }
    this.notify();
  }

  public generateSimulatedReading(metric: HealthMetricType, abnormal = false): Partial<HealthReading> {
    const nowStr = 'Just now';
    switch (metric) {
      case 'heartRate':
        const hr = abnormal ? Math.floor(Math.random() * 20) + 115 : Math.floor(Math.random() * 14) + 74;
        return {
          type: 'heartRate',
          value: hr,
          unit: 'bpm',
          status: hr > 100 ? 'attention' : 'normal',
          timestamp: nowStr,
          source: 'Wearable BLE (Simulated)',
          isSample: true,
          isSimulated: true,
          notes: abnormal ? 'Abnormal elevated resting pulse logged via simulated BLE band' : 'Continuous BLE heart rate stream',
        };
      case 'spo2':
        const spo2 = abnormal ? Math.floor(Math.random() * 4) + 91 : Math.floor(Math.random() * 3) + 97;
        return {
          type: 'spo2',
          value: spo2,
          unit: '%',
          status: spo2 < 95 ? 'attention' : 'normal',
          timestamp: nowStr,
          source: 'Wearable BLE (Simulated)',
          isSample: true,
          isSimulated: true,
          notes: abnormal ? 'Oxygen saturation dropped below 95% threshold' : 'Stable peripheral capillary oxygenation',
        };
      case 'temperature':
        const temp = abnormal ? 100.8 : 98.4;
        return {
          type: 'temperature',
          value: temp,
          unit: '°F',
          status: temp > 100 ? 'attention' : 'normal',
          timestamp: nowStr,
          source: 'Wearable BLE (Simulated)',
          isSample: true,
          isSimulated: true,
          notes: abnormal ? 'Elevated temperature reading' : 'Normal basal body temperature',
        };
      case 'bloodPressure':
        const sys = abnormal ? 148 : 118;
        const dia = abnormal ? 94 : 76;
        return {
          type: 'bloodPressure',
          value: `${sys}/${dia}`,
          systolic: sys,
          diastolic: dia,
          unit: 'mmHg',
          status: sys >= 140 || dia >= 90 ? 'attention' : 'normal',
          timestamp: nowStr,
          source: 'Wearable BLE (Simulated)',
          isSample: true,
          isSimulated: true,
          notes: abnormal ? 'Systolic / diastolic elevated indicating pre-hypertension' : 'Normal gestational blood pressure',
        };
      case 'movement':
        const steps = abnormal ? 150 : 2800;
        return {
          type: 'movement',
          value: steps,
          unit: 'steps',
          status: steps < 500 ? 'attention' : 'normal',
          timestamp: nowStr,
          source: 'Wearable BLE (Simulated)',
          isSample: true,
          isSimulated: true,
          notes: abnormal ? 'Prolonged period of immobility detected by MPU6050' : 'Regular daily ambulatory movement',
        };
    }
  }

  // Future hardware integration entry point
  public async connectRealDevice(): Promise<{ success: boolean; message: string }> {
    if (typeof navigator === 'undefined' || !(navigator as any).bluetooth) {
      return {
        success: false,
        message: 'Web Bluetooth API is not supported in this browser environment. Using high-fidelity BLE simulation.',
      };
    }

    try {
      // Standard Heart Rate BLE service UUID: 0x180D
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service'],
      });
      return {
        success: true,
        message: `Connected to physical BLE device: ${device.name || 'MatriBand'}`,
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Physical Bluetooth connection cancelled. Reverting to simulated mode.',
      };
    }
  }
}

export const wearableService = BleWearableManager.getInstance();

