import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { MessageSquare, Send, RefreshCw, Smartphone, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { FormField } from './FormField';

export const SmsSimulatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { smsMessages, sendSms, retrySms, contacts, ashaWorker } = useApp();
  const [recipientIndex, setRecipientIndex] = useState(0);
  const [customText, setCustomText] = useState('');

  const recipients = [
    { name: 'Rohan Sharma (Husband)', phone: '+91 98200 11223', role: 'Family Contact' as const },
    { name: `${ashaWorker.name} (ASHA)`, phone: ashaWorker.phone, role: 'ASHA Worker' as const },
    { name: 'Dr. Meera Nambiar (PHC)', phone: '+91 94155 00112', role: 'Doctor / PHC' as const },
  ];

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const rec = recipients[recipientIndex];
    sendSms(rec.name, rec.phone, rec.role, customText);
    setCustomText('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SMS Gateway & Alert Delivery Console"
      description="Module 1F (Planned in PDF): Simulated SMS dispatcher for non-smartphone fallback."
      footer={
        <Button variant="outline" size="sm" onClick={onClose}>
          Close Console
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Notice */}
        <div className="p-2.5 rounded-xl bg-[#FAF6FE] border border-[#DCBEEF] text-xs text-[#503477]">
          <p className="font-semibold flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#8B5FBF]" />
            Feature-Phone Fallback Simulator
          </p>
          <p className="text-[11px] text-[#766C82] mt-0.5">
            This module generates and delivers plain-text alerts for family members in areas with low internet or on feature phones. Integrates with Gov / NIC SMS gateways.
          </p>
        </div>

        {/* Quick Send Test Message */}
        <form onSubmit={handleSendCustom} className="p-3 bg-white rounded-2xl border border-[#EDE3F7] space-y-2.5">
          <h4 className="text-xs font-bold text-[#29213A]">
            Dispatch Test Outgoing SMS
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField
              label="Recipient"
              as="select"
              value={recipientIndex.toString()}
              onChange={(e) => setRecipientIndex(Number(e.target.value))}
              options={recipients.map((r, idx) => ({
                label: `${r.name}`,
                value: idx.toString(),
              }))}
            />
            <div className="text-xs flex flex-col justify-end pb-1 text-[#766C82]">
              Phone: <strong className="text-[#503477]">{recipients[recipientIndex].phone}</strong>
            </div>
          </div>

          <FormField
            label="Message Text"
            placeholder="Type custom SMS alert..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />

          <Button
            type="submit"
            size="sm"
            variant="primary"
            fullWidth
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Queue & Send Simulated SMS
          </Button>
        </form>

        {/* Message Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#503477]">
            <span>SMS Dispatch Queue ({smsMessages.length})</span>
            <span className="text-[10px] text-[#766C82] font-normal">Real-time status</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {smsMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3 rounded-2xl bg-white border border-[#EDE3F7] text-xs space-y-1.5 shadow-soft-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#29213A] truncate">{msg.recipientName}</span>
                  <div className="flex items-center gap-1.5">
                    {msg.status === 'delivered' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#36866A]">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    ) : msg.status === 'simulated_sent' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#8B5FBF]">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Transmitting
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#D58A35]">Queued</span>
                    )}
                  </div>
                </div>

                <p className="p-2 rounded-xl bg-[#F6F0FC] font-mono text-[11px] text-[#503477] leading-relaxed">
                  {msg.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#766C82] pt-0.5">
                  <span>To: {msg.recipientPhone} • {msg.timestamp}</span>
                  <button
                    onClick={() => retrySms(msg.id)}
                    className="text-[#8B5FBF] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Re-send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

