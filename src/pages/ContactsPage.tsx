import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FormField } from '../components/common/FormField';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmptyState } from '../components/common/EmptyState';
import { TrustedContact } from '../types';
import { 
  Users, 
  Phone, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Star
} from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, addToast } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testSmsModal, setTestSmsModal] = useState<TrustedContact | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Husband');
  const [phone, setPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [receiveSmsAlerts, setReceiveSmsAlerts] = useState(true);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setRelationship('Husband');
    setPhone('');
    setIsPrimary(contacts.length === 0);
    setReceiveSmsAlerts(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (c: TrustedContact) => {
    setEditingContact(c);
    setName(c.name);
    setRelationship(c.relationship);
    setPhone(c.phone);
    setIsPrimary(c.isPrimary);
    setReceiveSmsAlerts(c.receiveSmsAlerts);
    setIsAddModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingContact) {
      updateContact(editingContact.id, {
        name,
        relationship,
        phone,
        isPrimary,
        receiveSmsAlerts,
      });
    } else {
      addContact({
        name,
        relationship,
        phone,
        isPrimary,
        isVerified: true, // Demo verification
        receiveSmsAlerts,
      });
    }
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteContact(deletingId);
      setDeletingId(null);
    }
  };

  const handleSimulateSmsAlert = (contact: TrustedContact) => {
    setTestSmsModal(contact);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Trusted Contacts"
        subtitle="Family & Care Network"
        showBack
        backTo="/home"
        rightAction={
          <Button
            size="sm"
            variant="primary"
            onClick={openAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Add
          </Button>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        <DisclaimerBanner />

        {/* Intro Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#EDE3F7] shadow-soft-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#29213A]">
                Family & Care Circle ({contacts.length} Contacts)
              </h2>
              <p className="text-xs text-[#766C82] mt-0.5 leading-relaxed">
                Trusted contacts receive notifications in emergency SOS events and milestone updates.
              </p>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No Contacts Added Yet"
            description="Add your husband, mother, or caregiver so they can be informed during pregnancy."
            actionLabel="Add First Contact"
            onAction={openAddModal}
          />
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <Card
                key={contact.id}
                className="p-4 bg-white border-[#EDE3F7] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FAF6FE] border border-[#DCBEEF] flex items-center justify-center text-[#503477] font-bold text-sm shadow-soft-sm flex-shrink-0">
                      {contact.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="lavender" size="sm">
                          {contact.relationship}
                        </Badge>
                        {contact.isPrimary && (
                          <Badge variant="success" size="sm">
                            ★ Primary Contact
                          </Badge>
                        )}
                        <span className="text-[10px] text-[#36866A] font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          {contact.isVerified ? 'Verified (Demo)' : 'Pending'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#29213A] mt-1.5">
                        {contact.name}
                      </h3>
                      <p className="text-xs text-[#766C82] mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#8B5FBF]" /> {contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(contact)}
                      className="p-1.5 rounded-lg text-[#8B5FBF] hover:bg-[#EDE3F7] transition-colors"
                      title="Edit contact"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(contact.id)}
                      className="p-1.5 rounded-lg text-[#D6455D] hover:bg-[#FDECEF] transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Options Bar */}
                <div className="pt-2 border-t border-[#F6F0FC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#766C82]">
                    SMS Alerts: {contact.receiveSmsAlerts ? 'Enabled' : 'Disabled'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateSmsAlert(contact)}
                      className="text-xs font-semibold text-[#8B5FBF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Test Alert</span>
                    </button>

                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      className="px-2.5 py-1 rounded-xl bg-[#EDE3F7] hover:bg-[#DCBEEF] text-[#503477] font-bold text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Add Trusted Contact'}
        description="Provide family contact details for emergency care and updates."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveContact}>
              Save Contact
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveContact} className="space-y-3.5">
          <FormField
            label="Full Name"
            placeholder="e.g. Rohan Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Relationship"
              as="select"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              options={[
                { label: 'Husband', value: 'Husband' },
                { label: 'Mother', value: 'Mother' },
                { label: 'Mother-in-law', value: 'Mother-in-law' },
                { label: 'Sister', value: 'Sister' },
                { label: 'Father', value: 'Father' },
                { label: 'Guardian / Caregiver', value: 'Guardian' },
                { label: 'Other', value: 'Other' },
              ]}
            />

            <FormField
              label="Mobile Phone"
              type="tel"
              placeholder="+91 98200 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF]"
              />
              <span className="font-semibold text-[#29213A]">
                Designate as Primary Emergency Contact
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={receiveSmsAlerts}
                onChange={(e) => setReceiveSmsAlerts(e.target.checked)}
                className="rounded text-[#8B5FBF] focus:ring-[#8B5FBF]"
              />
              <span className="text-[#766C82]">
                Receive automated SMS notifications during SOS triggers (Simulated)
              </span>
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Contact Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Remove Contact?"
        description="Are you sure you wish to remove this contact from your emergency care circle?"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Remove Contact
            </Button>
          </>
        }
      >
        <div className="p-3 bg-[#FDECEF] rounded-2xl border border-[#F8BCC7] text-xs text-[#B0263E] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            This contact will no longer be notified during SOS events.
          </span>
        </div>
      </Modal>

      {/* Test SMS Modal */}
      {testSmsModal && (
        <Modal
          isOpen={Boolean(testSmsModal)}
          onClose={() => setTestSmsModal(null)}
          title="Simulated SMS Alert"
          description={`Testing message delivery to ${testSmsModal.name} (${testSmsModal.phone})`}
          footer={
            <Button size="sm" onClick={() => setTestSmsModal(null)}>
              Got it
            </Button>
          }
        >
          <div className="p-3 bg-[#FAF6FE] rounded-2xl border border-[#EDE3F7] space-y-2 text-xs">
            <p className="font-bold text-[#503477]">Simulated SMS Preview:</p>
            <div className="p-3 bg-white rounded-xl border border-[#DCBEEF] font-mono text-[11px] text-[#29213A] leading-relaxed">
              "[MatriCare Demo Alert]: Ananya Sharma logged Week 24 vitals check. All metrics stable. Next ANC scan on Oct 28."
            </div>
            <p className="text-[11px] text-[#766C82]">
              Note: This is a demonstration simulator. No real SMS carrier fee is incurred.
            </p>
          </div>
        </Modal>
      )}

      <BottomNav />
    </div>
  );
};
