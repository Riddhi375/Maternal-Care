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
import { EmptyState } from '../components/common/EmptyState';
import { SafetyAlert, AlertStatus } from '../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Calendar, 
  Pill, 
  AlertOctagon,
  ChevronRight
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | AlertStatus>('all');
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
  const [resolvingAlert, setResolvingAlert] = useState<SafetyAlert | null>(null);

  // Counts
  const attentionCount = alerts.filter((a) => a.status === 'attention').length;
  const acknowledgedCount = alerts.filter((a) => a.status === 'acknowledged').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.status === activeFilter;
  });

  const getAlertIcon = (type: SafetyAlert['type'], severity: SafetyAlert['severity']) => {
    if (type === 'emergency') {
      return <AlertOctagon className="w-5 h-5 text-[#D6455D]" />;
    }
    if (severity === 'critical') {
      return <AlertTriangle className="w-5 h-5 text-[#D6455D]" />;
    }
    if (severity === 'warning') {
      return <AlertTriangle className="w-5 h-5 text-[#D58A35]" />;
    }
    switch (type) {
      case 'vitals':
        return <Activity className="w-5 h-5 text-[#8B5FBF]" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-[#8B5FBF]" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-[#D95783]" />;
      default:
        return <Info className="w-5 h-5 text-[#8B5FBF]" />;
    }
  };

  const handleConfirmResolve = () => {
    if (resolvingAlert) {
      resolveAlert(resolvingAlert.id);
      setResolvingAlert(null);
      if (selectedAlert?.id === resolvingAlert.id) {
        setSelectedAlert((prev) => (prev ? { ...prev, status: 'resolved' } : null));
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Safety Alerts & Events"
        subtitle="Clinical Events Hub"
        showBack
        backTo="/home"
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Tab Filter */}
        <TabSelector
          activeTab={activeFilter}
          onChange={(tab) => setActiveFilter(tab as any)}
          tabs={[
            { id: 'all', label: 'All', badge: alerts.length },
            { id: 'attention', label: 'Needs Action', badge: attentionCount },
            { id: 'acknowledged', label: 'Acknowledged', badge: acknowledgedCount },
            { id: 'resolved', label: 'Resolved', badge: resolvedCount },
          ]}
        />

        {/* List of Alerts */}
        {filteredAlerts.length === 0 ? (
          <EmptyState
            icon={<ShieldAlert className="w-6 h-6" />}
            title="No Alerts Found"
            description="All systems are calm. No events match the selected status filter."
          />
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                interactive
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 bg-white border-[#EDE3F7] space-y-2.5 transition-all ${
                  alert.status === 'attention' && alert.severity === 'critical'
                    ? 'border-[#F8BCC7] bg-[#FDECEF]/20'
                    : alert.status === 'attention'
                    ? 'border-[#F6D9B4] bg-[#FDF5EC]/20'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft-sm ${
                        alert.severity === 'critical'
                          ? 'bg-[#FDECEF]'
                          : alert.severity === 'warning'
                          ? 'bg-[#FDF5EC]'
                          : 'bg-[#EDE3F7]'
                      }`}
                    >
                      {getAlertIcon(alert.type, alert.severity)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={
                            alert.status === 'attention'
                              ? 'attention'
                              : alert.status === 'acknowledged'
                              ? 'info'
                              : 'success'
                          }
                          size="sm"
                        >
                          {alert.status === 'attention'
                            ? 'Action Needed'
                            : alert.status === 'acknowledged'
                            ? 'Acknowledged'
                            : 'Resolved'}
                        </Badge>

                        {alert.isSimulated && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF6FE] border border-[#DCBEEF] text-[#503477] font-semibold">
                            Simulated Event
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-[#29213A] mt-1.5">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-[#766C82] line-clamp-2 mt-0.5 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#8B5FBF] flex-shrink-0 mt-2" />
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F6F0FC] text-[11px] text-[#766C82]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.timestamp}
                  </span>

                  <div className="flex items-center gap-2">
                    {alert.status === 'attention' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeAlert(alert.id);
                        }}
                        className="text-xs font-bold text-[#8B5FBF] hover:underline cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.status !== 'resolved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResolvingAlert(alert);
                        }}
                        className="text-xs font-bold text-[#36866A] hover:underline cursor-pointer"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Modal
          isOpen={Boolean(selectedAlert)}
          onClose={() => setSelectedAlert(null)}
          title={selectedAlert.title}
          description={`${selectedAlert.timestamp} • Type: ${selectedAlert.type}`}
          footer={
            <div className="w-full flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedAlert.status === 'attention' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert((prev) =>
                        prev ? { ...prev, status: 'acknowledged' } : null
                      );
                    }}
                  >
                    Acknowledge
                  </Button>
                )}

                {selectedAlert.status !== 'resolved' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      setResolvingAlert(selectedAlert);
                    }}
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs text-[#29213A]">
            <div className="p-3 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#8B5FBF] block">
                Detailed Log Summary
              </span>
              <p className="leading-relaxed text-[#503477]">
                {selectedAlert.description}
              </p>
            </div>

            {selectedAlert.actionRecommended && (
              <div className="p-3 bg-[#EAF5F1] rounded-2xl border border-[#B6E2D3] text-[#24634E] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#36866A] block">
                  Recommended Action
                </span>
                <p className="leading-relaxed font-medium">
                  {selectedAlert.actionRecommended}
                </p>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-white border border-[#EDE3F7] text-[#766C82] space-y-1 text-[11px]">
              <p>• Event Category: <strong>{selectedAlert.type}</strong></p>
              <p>• Data Nature: <strong>{selectedAlert.isSimulated ? 'Simulated Prototype Data' : 'Clinical Telemetry'}</strong></p>
              {selectedAlert.acknowledgedAt && (
                <p>• Acknowledged At: <strong>{selectedAlert.acknowledgedAt}</strong></p>
              )}
              {selectedAlert.resolvedAt && (
                <p>• Resolved At: <strong>{selectedAlert.resolvedAt}</strong></p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Resolve Confirmation Modal */}
      <Modal
        isOpen={Boolean(resolvingAlert)}
        onClose={() => setResolvingAlert(null)}
        title="Resolve Safety Alert?"
        description="Confirm that the cause of this alert has been addressed."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setResolvingAlert(null)}>
              Cancel
            </Button>
            <Button variant="success" size="sm" onClick={handleConfirmResolve}>
              Yes, Mark Resolved
            </Button>
          </>
        }
      >
        <div className="p-3 bg-[#EAF5F1] rounded-2xl border border-[#B6E2D3] text-xs text-[#24634E] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>
            This alert will be archived into your permanent health event history.
          </span>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
};
