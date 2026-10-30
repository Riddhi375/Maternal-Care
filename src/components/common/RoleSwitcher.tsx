import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEMO_ACCOUNTS } from '../../data/mockData';
import { Users, ChevronDown, Check, ShieldCheck, HeartHandshake, Stethoscope, Baby } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUserRole, setUserRole, currentUserAccount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'pregnant_woman':
        return Baby;
      case 'family':
        return HeartHandshake;
      case 'asha':
        return ShieldCheck;
      case 'doctor':
        return Stethoscope;
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setIsOpen(false);

    // Contextual auto-navigation to role-specific dashboard
    if (role === 'asha') {
      navigate('/asha-dashboard');
    } else if (role === 'doctor') {
      navigate('/doctor-dashboard');
    } else if (role === 'family') {
      navigate('/family-dashboard');
    } else {
      if (location.pathname.includes('dashboard')) {
        navigate('/home');
      }
    }
  };

  const CurrentIcon = getRoleIcon(currentUserRole);

  return (
    <div className="relative z-40 bg-[#FAF6FE] border-b border-[#EDE3F7] px-3 py-1.5 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[10px] font-bold text-[#8B5FBF] uppercase tracking-wider flex-shrink-0">
          Demo RBAC:
        </span>
        <div className="flex items-center gap-1 text-[#29213A] truncate font-medium">
          <CurrentIcon className="w-3.5 h-3.5 text-[#8B5FBF] flex-shrink-0" />
          <span className="truncate">{currentUserAccount.name}</span>
          <span className="text-[10px] text-[#766C82] hidden sm:inline truncate">
            ({currentUserAccount.designation})
          </span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 rounded-xl bg-white border border-[#DCBEEF] text-[#503477] font-bold text-[11px] flex items-center gap-1 hover:bg-[#EDE3F7] transition-all cursor-pointer shadow-soft-sm"
        >
          <span>Switch Role</span>
          <ChevronDown className="w-3 h-3 text-[#8B5FBF]" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-8 w-64 bg-white rounded-2xl shadow-xl border border-[#EDE3F7] p-2 space-y-1 z-50 animate-fade-in">
            <div className="px-2.5 py-1 text-[10px] font-bold text-[#766C82] uppercase tracking-wide border-b border-[#F6F0FC]">
              Select Demo Role Persona
            </div>

            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = getRoleIcon(acc.role);
              const isSelected = currentUserRole === acc.role;
              return (
                <button
                  key={acc.id}
                  onClick={() => handleRoleSelect(acc.role)}
                  className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDE3F7] text-[#503477] font-bold'
                      : 'hover:bg-[#FAF6FE] text-[#29213A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#F6F0FC] flex items-center justify-center text-[#8B5FBF] flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold truncate leading-tight">{acc.name}</p>
                      <p className="text-[10px] text-[#766C82] truncate leading-tight">
                        {acc.designation}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#8B5FBF] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

