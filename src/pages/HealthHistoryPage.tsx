import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { TabSelector } from '../components/common/TabSelector';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Pill, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';
import { ShareableRecordModal } from '../components/common/ShareableRecordModal';

export const HealthHistoryPage: React.FC = () => {
  const { 
    patient, 
    readings, 
    appointments, 
    medicationLogs, 
    alerts, 
    ashaWorker, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'readings' | 'appointments' | 'meds' | 'alerts'>('timeline');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | 't1' | 't2' | 't3'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<{
    title: string;
    type: string;
    date: string;
    status: string;
    source: string;
    details: string;
  } | null>(null);

  // Robust Date Filtering Logic
  const isWithinDateFilter = (dateOrTimestampStr: string, filter: 'all' | '7d' | '30d' | 't1' | 't2' | 't3'): boolean => {
    if (filter === 'all') return true;

    const lower = (dateOrTimestampStr || '').toLowerCase();
    const isRecent = lower.includes('today') || lower.includes('just now') || lower.includes('yesterday') || lower.includes('3 days ago');

    if (filter === '7d') {
      if (isRecent) return true;
      const parsed = new Date(dateOrTimestampStr);
      if (!isNaN(parsed.getTime())) {
        const diffDays = Math.abs((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      return false;
    }

    if (filter === '30d') {
      if (isRecent) return true;
      const parsed = new Date(dateOrTimestampStr);
      if (!isNaN(parsed.getTime())) {
        const diffDays = Math.abs((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }
      return false;
    }

    // Trimester-based filters
    if (filter === 't1') {
      return lower.includes('aug') || lower.includes('jul') || lower.includes('jun') || lower.includes('t1');
    }
    if (filter === 't2') {
      return lower.includes('today') || lower.includes('oct') || lower.includes('sep') || isRecent;
    }
    if (filter === 't3') {
      return lower.includes('nov') || lower.includes('dec');
    }

    return true;
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredReadings = readings
    .filter((r) => isWithinDateFilter(r.timestamp, dateFilter))
    .filter((r) => matchesSearch(`${r.type} ${r.value} ${r.source} ${r.notes || ''}`));

  const filteredAppointments = appointments
    .filter((a) => isWithinDateFilter(a.date, dateFilter))
    .filter((a) => matchesSearch(`${a.title} ${a.doctorName} ${a.facility} ${a.type}`));

  const filteredMedicationLogs = medicationLogs
    .filter((m) => isWithinDateFilter(m.date, dateFilter))
    .filter((m) => matchesSearch(`${m.medicationName} ${m.dosage} ${m.status}`));

  const filteredAlerts = alerts
    .filter((a) => isWithinDateFilter(a.timestamp, dateFilter))
    .filter((a) => matchesSearch(`${a.title} ${a.description} ${a.severity}`));

  // Unified Chronological Timeline Items
  const timelineItems = [
    ...filteredReadings.map((r) => ({
      id: r.id,
      kind: 'vital' as const,
      title: `${r.type.toUpperCase()}: ${r.value} ${r.unit}`,
      subtitle: `${r.source} · Status: ${r.status}`,
      date: r.timestamp,
      badge: r.status === 'normal' ? 'Normal' : 'Attention',
      badgeVariant: r.status === 'normal' ? ('normal' as const) : ('attention' as const),
      raw: r,
    })),
    ...filteredAppointments.map((a) => ({
      id: a.id,
      kind: 'appointment' as const,
      title: a.title,
      subtitle: `${a.doctorName} · ${a.facility}`,
      date: `${a.date} at ${a.time}`,
      badge: a.status,
      badgeVariant: a.status === 'completed' ? ('success' as const) : ('lavender' as const),
      raw: a,
    })),
    ...filteredMedicationLogs.map((m) => ({
      id: m.id,
      kind: 'med' as const,
      title: `${m.medicationName} (${m.dosage})`,
      subtitle: `Scheduled: ${m.scheduledTime} · Logged: ${m.date} at ${m.actionTime}`,
      date: `${m.date} at ${m.actionTime}`,
      badge: m.status === 'taken' ? 'Dose Taken' : 'Skipped',
      badgeVariant: m.status === 'taken' ? ('success' as const) : ('skipped' as const),
      raw: m,
    })),
    ...filteredAlerts.map((alt) => ({
      id: alt.id,
      kind: 'alert' as const,
      title: alt.title,
      subtitle: alt.description,
      date: alt.timestamp,
      badge: alt.severity,
      badgeVariant: alt.severity === 'critical' ? ('critical' as const) : ('warning' as const),
      raw: alt,
    })),
  ];

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Nine-Month Health History"
        subtitle="Longitudinal Health Dossier"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsExportModalOpen(true)}
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Export Banner Card */}
        <Card variant="highlight" className="p-4 border-[#DCBEEF]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#8B5FBF] uppercase tracking-wide">
                Comprehensive 9-Month Dossier
              </span>
              <h2 className="text-sm font-bold text-[#29213A] mt-0.5">
                Doctor-Ready Health Summary
              </h2>
              <p className="text-xs text-[#766C82] mt-0.5 leading-relaxed">
                Export verified timeline of vitals, ANC check-ups, scans, and supplement adherence.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsExportModalOpen(true)}
              icon={<FileText className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </Card>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#766C82]" />
          <input
            type="text"
            placeholder="Search records by keyword, doctor, scan, or vital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white rounded-2xl border border-[#EDE3F7] text-xs text-[#29213A] placeholder-[#766C82] focus:outline-none focus:ring-2 focus:ring-[#8B5FBF]"
          />
        </div>

        {/* Tab Selector */}
        <TabSelector
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          tabs={[
            { id: 'timeline', label: 'Timeline', badge: timelineItems.length },
            { id: 'readings', label: 'Vitals', badge: filteredReadings.length },
            { id: 'appointments', label: 'Check-ups', badge: filteredAppointments.length },
            { id: 'meds', label: 'Med Logs', badge: filteredMedicationLogs.length },
            { id: 'alerts', label: 'Alerts', badge: filteredAlerts.length },
          ]}
        />

        {/* Date Filter Pills */}
        <div className="flex flex-col gap-1.5 text-xs">
          <span className="text-[#766C82] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#8B5FBF]" /> Filter Interval / Trimester:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Records' },
              { id: '7d', label: 'Past 7 Days' },
              { id: '30d', label: 'Past 30 Days' },
              { id: 't1', label: 'Trimester 1' },
              { id: 't2', label: 'Trimester 2' },
              { id: 't3', label: 'Trimester 3' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDateFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  dateFilter === f.id
                    ? 'bg-[#8B5FBF] text-white shadow-soft-sm'
                    : 'bg-white text-[#766C82] border border-[#EDE3F7]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab: Unified Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-2.5">
            {timelineItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#766C82] bg-white rounded-2xl border border-[#EDE3F7]">
                No records match the selected date or search filter.
              </div>
            ) : (
              timelineItems.map((item) => (
                <Card
                  key={item.id}
                  interactive
                  onClick={() =>
                    setSelectedRecordDetail({
                      title: item.title,
                      type: item.kind.toUpperCase(),
                      date: item.date,
                      status: item.badge,
                      source: item.subtitle,
                      details: JSON.stringify(item.raw, null, 2),
                    })
                  }
                  className="p-3.5 bg-white border-[#EDE3F7] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={item.badgeVariant as any} size="sm">
                      {item.badge}
                    </Badge>
                    <span className="text-[10px] text-[#766C82]">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#29213A]">{item.title}</h4>
                  <p className="text-[11px] text-[#766C82]">{item.subtitle}</p>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab: Vitals */}
        {activeTab === 'readings' && (
          <div className="space-y-2.5">
            {filteredReadings.map((r) => (
              <Card key={r.id} className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#29213A] uppercase">{r.type}</span>
                  <p className="text-sm font-extrabold text-[#503477]">
                    {r.value} <span className="text-xs text-[#766C82] font-normal">{r.unit}</span>
                  </p>
                  <span className="text-[10px] text-[#766C82]">{r.source} · {r.timestamp}</span>
                </div>
                <Badge variant={r.status === 'normal' ? 'normal' : 'attention'} size="sm">
                  {r.status}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Tab: Check-ups */}
        {activeTab === 'appointments' && (
          <div className="space-y-2.5">
            {filteredAppointments.map((a) => (
              <Card key={a.id} className="p-3.5 bg-white border-[#EDE3F7] space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="lavender" size="sm">{a.type}</Badge>
                  <Badge variant={a.status === 'completed' ? 'success' : 'normal'} size="sm">
                    {a.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-[#29213A]">{a.title}</h4>
                <p className="text-[11px] text-[#766C82]">
                  {a.doctorName} · {a.facility} ({a.date} at {a.time})
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab: Medication Logs */}
        {activeTab === 'meds' && (
          <div className="space-y-2.5">
            {filteredMedicationLogs.map((m) => (
              <Card key={m.id} className="p-3.5 bg-white border-[#EDE3F7] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#29213A]">{m.medicationName}</h4>
                  <p className="text-[10px] text-[#766C82]">
                    {m.dosage} · Scheduled: {m.scheduledTime}
                  </p>
                  <span className="text-[10px] text-[#8B5FBF]">Logged: {m.date} at {m.actionTime}</span>
                </div>
                <Badge variant={m.status === 'taken' ? 'success' : 'skipped'} size="sm">
                  {m.status}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Tab: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-2.5">
            {filteredAlerts.map((alt) => (
              <Card key={alt.id} className="p-3.5 bg-white border-[#EDE3F7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant={alt.severity === 'critical' ? 'critical' : 'warning'} size="sm">
                    {alt.severity}
                  </Badge>
                  <span className="text-[10px] text-[#766C82]">{alt.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-[#29213A]">{alt.title}</h4>
                <p className="text-xs text-[#766C82]">{alt.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecordDetail && (
        <Modal
          isOpen={!!selectedRecordDetail}
          onClose={() => setSelectedRecordDetail(null)}
          title={selectedRecordDetail.title}
          description={`Record Type: ${selectedRecordDetail.type} · ${selectedRecordDetail.date}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedRecordDetail(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF6FE] border border-[#DCBEEF] space-y-1">
              <p><strong>Status:</strong> {selectedRecordDetail.status}</p>
              <p><strong>Source / Subtitle:</strong> {selectedRecordDetail.source}</p>
              <p><strong>Timestamp:</strong> {selectedRecordDetail.date}</p>
            </div>
            <pre className="p-3 rounded-2xl bg-[#F6F0FC] font-mono text-[10px] text-[#503477] whitespace-pre-wrap max-h-48 overflow-y-auto">
              {selectedRecordDetail.details}
            </pre>
          </div>
        </Modal>
      )}

      {/* Shareable Record Modal */}
      <ShareableRecordModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />

      <BottomNav />
    </div>
  );
};
