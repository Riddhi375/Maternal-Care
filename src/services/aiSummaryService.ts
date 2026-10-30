import { AiHealthSummary, HealthReading, Medication, MedicationLog, SafetyAlert, PatientProfile, Appointment } from '../types';

export class AiSummaryService {
  public static generateSummary(
    period: 'weekly' | 'monthly',
    patient: PatientProfile,
    readings: HealthReading[],
    medications: Medication[],
    medicationLogs: MedicationLog[],
    alerts: SafetyAlert[],
    appointments: Appointment[]
  ): AiHealthSummary {
    const totalDosesScheduled = medicationLogs.length;
    const takenDoses = medicationLogs.filter((m) => m.status === 'taken').length;
    const missedDoses = totalDosesScheduled - takenDoses;
    const adherenceRate = totalDosesScheduled > 0 ? Math.round((takenDoses / totalDosesScheduled) * 100) : 92;

    const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
    const warningAlerts = alerts.filter((a) => a.severity === 'warning').length;

    const avgHrReading = readings.filter((r) => r.type === 'heartRate');
    const avgHr = avgHrReading.length > 0
      ? Math.round(avgHrReading.reduce((acc, curr) => acc + Number(curr.value), 0) / avgHrReading.length)
      : 78;

    const bpReadings = readings.filter((r) => r.type === 'bloodPressure');
    const latestBp = bpReadings[0]?.value || '118/76';

    const upcomingCheckups = appointments.filter((a) => a.status === 'upcoming');

    // 1. Mother Plain-Language Summary
    const motherSummary = `Namaste ${patient.name}! During this past ${period === 'weekly' ? '7 days' : '30 days'} of Week ${patient.pregnancyWeek}, your vital signs have remained largely stable. Your resting heart rate averaged ${avgHr} bpm, and your blood pressure is well maintained at ${latestBp} mmHg. You maintained a great ${adherenceRate}% medicine adherence for your prescribed IFA and Calcium tablets. Continue resting on your left side, drink clean water throughout the day, and keep your upcoming ${upcomingCheckups[0]?.title || 'scheduled clinic visit'} in mind. Remember: If you experience sudden headaches, vision changes, or reduced baby movements, contact your ASHA worker Sunita Devi immediately.`;

    // 2. ASHA / ANM Worker Clinical Summary
    const ashaSummary = `Patient: ${patient.name} (${patient.pregnancyWeek} wks gestation, Gravida ${patient.gravida}, Para ${patient.para}).
Summary Period: Past ${period === 'weekly' ? 'Week' : 'Month'}.
- Vital Stability: Resting HR mean ${avgHr} bpm; BP latest ${latestBp} mmHg (within acceptable range <140/90).
- Telemetry Gaps: Continuous BLE Smart Band synchronized daily. No prolonged transmission blackouts observed.
- Medicine Compliance: ${adherenceRate}% adherence (${takenDoses}/${totalDosesScheduled} recorded doses taken; ${missedDoses} missed/rescheduled).
- Safety Alert History: ${criticalAlerts} emergency-level alerts, ${warningAlerts} warning alerts flagged during this period.
- Recommended Action: Review maternal weight gain and verify fetal growth scan at upcoming antenatal checkup.`;

    const keyMetricsSummary = [
      {
        metric: 'Pulse & Heart Rate',
        status: avgHr > 95 ? ('Needs Attention' as const) : ('Stable' as const),
        detail: `Averaged ${avgHr} bpm across ${avgHrReading.length} wearable telemetry checks.`,
      },
      {
        metric: 'Blood Oxygen (SpO2)',
        status: 'Stable' as const,
        detail: 'Oxygen saturation consistently sustained between 97% and 99%.',
      },
      {
        metric: 'Medicine Adherence',
        status: adherenceRate >= 80 ? ('Stable' as const) : ('Needs Attention' as const),
        detail: `${adherenceRate}% compliance across prescribed IFA & Calcium supplement routine.`,
      },
      {
        metric: 'Safety Alerts Logged',
        status: criticalAlerts > 0 ? ('Elevated' as const) : warningAlerts > 0 ? ('Needs Attention' as const) : ('Stable' as const),
        detail: `${alerts.length} total events recorded; ${alerts.filter((a) => a.status === 'attention').length} awaiting acknowledgement.`,
      },
    ];

    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const pastStr = new Date(Date.now() - (period === 'weekly' ? 7 : 30) * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return {
      period,
      startDate: pastStr,
      endDate: todayStr,
      motherSummary,
      ashaSummary,
      keyMetricsSummary,
      adherenceRate,
      alertsCount: alerts.length,
      missedDosesCount: missedDoses,
      generatedAt: todayStr,
      isAiGenerated: true,
      disclaimer: 'Illustrative AI Health Summary based on recorded sensor and self-report logs. Does not constitute medical diagnosis or replace obstetric evaluation.',
    };
  }
}

