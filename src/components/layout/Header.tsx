import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Bell, AlertOctagon, Wifi, WifiOff } from 'lucide-react';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  backTo,
  rightAction,
}) => {
  const navigate = useNavigate();
  const { alerts, patient, sosActive } = useApp();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const unreadAlerts = alerts.filter((a) => a.status === 'attention').length;

  return (
    <header className="sticky top-0 z-40 glass-header px-4 py-3 sm:px-6 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Back or Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-xl text-[#503477] hover:bg-[#EDE3F7] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5FBF]"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5FBF] to-[#D95783] flex items-center justify-center text-white shadow-soft-sm font-bold text-sm">
                M
              </div>
              <div>
                <span className="font-bold text-base text-[#503477] tracking-tight block leading-none">
                  MatriCare
                </span>
                <span className="text-[10px] text-[#D95783] font-medium leading-tight">
                  Maternal Companion
                </span>
              </div>
            </div>
          )}

          {title && showBack && (
            <div className="truncate">
              <h1 className="text-base sm:text-lg font-bold text-[#29213A] truncate leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-[#766C82] truncate leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {rightAction}

          {/* Sync indicator pill */}
          <div
            title={`Device: ${patient.deviceModel} (Sample Sync: ${patient.lastSyncTime})`}
            className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-[#EDE3F7] text-[11px] text-[#766C82]"
          >
            {patient.deviceConnected ? (
              <>
                <Wifi className="w-3 h-3 text-[#36866A]" />
                <span className="truncate max-w-[70px]">Band Synced</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-[#D6455D]" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Alerts Bell */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 rounded-xl text-[#503477] hover:bg-[#EDE3F7] active:scale-95 transition-all"
            aria-label="View notifications and alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D6455D] text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Emergency SOS Header Button */}
          <button
            onClick={() => navigate('/emergency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-soft-sm ${
              sosActive
                ? 'bg-[#D6455D] text-white animate-beacon'
                : 'bg-[#FDECEF] hover:bg-[#F8BCC7] text-[#D6455D] border border-[#F8BCC7]'
            }`}
            aria-label="Emergency SOS screen"
          >
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
