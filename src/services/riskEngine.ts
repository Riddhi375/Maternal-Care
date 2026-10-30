import { HealthReading, RiskAssessment, RiskCategory, SafetyAlert } from '../types';

export interface RiskThresholdConfig {
  heartRate: {
    lowWarning: number;
    highWarning: number;
    highEmergency: number;
  };
  spo2: {
    warningThreshold: number;
    emergencyThreshold: number;
  };
  temperature: {
    feverWarning: number;
    highFeverEmergency: number;
  };
  bloodPressure: {
    systolicWarning: number;
    systolicEmergency: number;
    diastolicWarning: number;
    diastolicEmergency: number;
  };
  gapHoursThreshold: number;
}

export const DEFAULT_THRESHOLDS: RiskThresholdConfig = {
  heartRate: {
    lowWarning: 55,
    highWarning: 105,
    highEmergency: 125,
  },
  spo2: {
    warningThreshold: 94,
    emergencyThreshold: 90,
  },
  temperature: {
    feverWarning: 100.4,
    highFeverEmergency: 102.5,
  },
  bloodPressure: {
    systolicWarning: 140,
    systolicEmergency: 160,
    diastolicWarning: 90,
    diastolicEmergency: 110,
  },
  gapHoursThreshold: 6,
};

export class ExplainableRiskEngine {
  private thresholds: RiskThresholdConfig = DEFAULT_THRESHOLDS;

  public setThresholds(newThresholds: Partial<RiskThresholdConfig>) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  public getThresholds(): RiskThresholdConfig {
    return { ...this.thresholds };
  }

  public evaluatePatientRisk(
    readings: HealthReading[],
    alerts: SafetyAlert[],
    hasActiveSos = false,
    hasUnresolvedFall = false
  ): RiskAssessment {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const reasons: string[] = [];
    const relevantReadings: RiskAssessment['relevantReadings'] = [];
    let category: RiskCategory = 'Normal';
    let urgency: RiskAssessment['urgencyLevel'] = 'routine';

    // 1. Immediate Critical Overrides: SOS or Fall
    if (hasActiveSos) {
      return {
        id: 'risk-' + Date.now(),
        category: 'Possible Emergency',
        title: 'Emergency SOS Signal Active',
        reason: 'Patient triggered high-priority emergency beacon. Urgent human verification required.',
        timestamp: 'Today at ' + nowStr,
        relevantReadings: [],
        recommendedAction: 'Immediate contact with patient, primary family member, and dispatch nearest ambulance (108).',
        urgencyLevel: 'urgent_108',
        isSimulated: true,
      };
    }

    if (hasUnresolvedFall) {
      return {
        id: 'risk-' + Date.now(),
        category: 'Possible Emergency',
        title: 'Possible Fall Detected (Unresponsive)',
        reason: 'MPU6050 motion sensor detected impact and subsequent motionless state. Safety check-in countdown expired without response.',
        timestamp: 'Today at ' + nowStr,
        relevantReadings: [],
        recommendedAction: 'Contact pregnant woman immediately or dispatch family/ASHA worker to home address.',
        urgencyLevel: 'urgent_108',
        isSimulated: true,
      };
    }

    // 2. Evaluate Latest Vitals
    const latestHr = readings.find((r) => r.type === 'heartRate');
    if (latestHr) {
      const hrVal = Number(latestHr.value);
      if (hrVal >= this.thresholds.heartRate.highEmergency) {
        category = 'Possible Emergency';
        urgency = 'urgent_108';
        reasons.push(`Severely elevated resting heart rate (${hrVal} bpm > ${this.thresholds.heartRate.highEmergency} bpm)`);
        relevantReadings.push({
          metric: 'Heart Rate',
          value: `${hrVal} bpm`,
          normalRange: '70–95 bpm',
          status: 'emergency',
        });
      } else if (hrVal >= this.thresholds.heartRate.highWarning || hrVal < this.thresholds.heartRate.lowWarning) {
        category = 'Warning';
        urgency = 'contact_asha';
        reasons.push(`Elevated pulse (${hrVal} bpm) outside typical resting pregnancy target`);
        relevantReadings.push({
          metric: 'Heart Rate',
          value: `${hrVal} bpm`,
          normalRange: '70–95 bpm',
          status: 'abnormal',
        });
      } else {
        relevantReadings.push({
          metric: 'Heart Rate',
          value: `${hrVal} bpm`,
          normalRange: '70–95 bpm',
          status: 'normal',
        });
      }
    }

    const latestSpo2 = readings.find((r) => r.type === 'spo2');
    if (latestSpo2) {
      const spo2Val = Number(latestSpo2.value);
      if (spo2Val <= this.thresholds.spo2.emergencyThreshold) {
        category = 'Possible Emergency';
        urgency = 'urgent_108';
        reasons.push(`Critical hypoxemia: SpO2 dropped to ${spo2Val}% (≤ ${this.thresholds.spo2.emergencyThreshold}%)`);
        relevantReadings.push({
          metric: 'Blood Oxygen (SpO2)',
          value: `${spo2Val}%`,
          normalRange: '95–100%',
          status: 'emergency',
        });
      } else if (spo2Val <= this.thresholds.spo2.warningThreshold) {
        if (category !== 'Possible Emergency') category = 'Warning';
        if (urgency !== 'urgent_108') urgency = 'contact_asha';
        reasons.push(`Sub-optimal peripheral oxygen saturation (${spo2Val}%)`);
        relevantReadings.push({
          metric: 'Blood Oxygen (SpO2)',
          value: `${spo2Val}%`,
          normalRange: '95–100%',
          status: 'abnormal',
        });
      } else {
        relevantReadings.push({
          metric: 'Blood Oxygen (SpO2)',
          value: `${spo2Val}%`,
          normalRange: '95–100%',
          status: 'normal',
        });
      }
    }

    const latestBp = readings.find((r) => r.type === 'bloodPressure');
    if (latestBp) {
      const sys = latestBp.systolic ?? (typeof latestBp.value === 'string' ? Number(latestBp.value.split('/')[0]) : 120);
      const dia = latestBp.diastolic ?? (typeof latestBp.value === 'string' ? Number(latestBp.value.split('/')[1]) : 80);
      if (sys >= this.thresholds.bloodPressure.systolicEmergency || dia >= this.thresholds.bloodPressure.diastolicEmergency) {
        category = 'Possible Emergency';
        urgency = 'urgent_108';
        reasons.push(`Severe gestational hypertension (${sys}/${dia} mmHg) requiring urgent clinical triage for preeclampsia`);
        relevantReadings.push({
          metric: 'Blood Pressure',
          value: `${sys}/${dia} mmHg`,
          normalRange: '<120/80 mmHg',
          status: 'emergency',
        });
      } else if (sys >= this.thresholds.bloodPressure.systolicWarning || dia >= this.thresholds.bloodPressure.diastolicWarning) {
        if (category !== 'Possible Emergency') category = 'Warning';
        if (urgency !== 'urgent_108') urgency = 'contact_asha';
        reasons.push(`Blood pressure reading (${sys}/${dia} mmHg) crosses stage 1 hypertensive guideline`);
        relevantReadings.push({
          metric: 'Blood Pressure',
          value: `${sys}/${dia} mmHg`,
          normalRange: '<120/80 mmHg',
          status: 'abnormal',
        });
      } else {
        relevantReadings.push({
          metric: 'Blood Pressure',
          value: `${sys}/${dia} mmHg`,
          normalRange: '<120/80 mmHg',
          status: 'normal',
        });
      }
    }

    // 3. Repeated Pattern Detection (e.g. 3 consecutive high HR or multiple recent warnings)
    const recentAlertsAttention = alerts.filter((a) => a.status === 'attention');
    if (recentAlertsAttention.length >= 2 && category === 'Normal') {
      category = 'Warning';
      urgency = 'contact_asha';
      reasons.push(`${recentAlertsAttention.length} unacknowledged safety alerts logged recently`);
    }

    let recommendedAction = 'Continue daily routine and wearable monitoring. Keep staying hydrated and well-rested.';
    if (category === 'Possible Emergency') {
      recommendedAction = 'Call Emergency 108 or escort patient immediately to the nearest Community Health Centre or District Hospital.';
    } else if (category === 'Warning') {
      recommendedAction = 'Sit or lie comfortably on left side. Contact your assigned ASHA worker for an in-person check-in if symptoms persist.';
    }

    return {
      id: 'risk-' + Date.now(),
      category,
      title: category === 'Normal' ? 'All Vitals Within Stable Limits' : category === 'Warning' ? 'Elevated Monitoring Parameters' : 'Possible Maternal Emergency Flagged',
      reason: reasons.length > 0 ? reasons.join('; ') : 'All recorded telemetry and activity meet gestational benchmarks.',
      timestamp: 'Today at ' + nowStr,
      relevantReadings,
      recommendedAction,
      urgencyLevel: urgency,
      isSimulated: true,
    };
  }
}

export const riskEngine = new ExplainableRiskEngine();
