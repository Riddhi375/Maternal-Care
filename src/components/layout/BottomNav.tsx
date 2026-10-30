import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  HeartPulse, 
  Sparkles, 
  Bell, 
  User, 
  Users, 
  HeartHandshake, 
  Stethoscope, 
  BookOpen, 
  Building2,
  FileText
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { alerts, t, currentUserRole } = useApp();

  const attentionAlerts = alerts.filter((a) => a.status === 'attention').length;

  const getNavItems = () => {
    switch (currentUserRole) {
      case 'asha':
        return [
          { to: '/asha-dashboard', label: 'Priority Queue', icon: Users },
          { to: '/health', label: 'Vitals', icon: HeartPulse },
          { to: '/history', label: '9-Mo History', icon: FileText },
          { to: '/alerts', label: 'Alerts', icon: Bell, badge: attentionAlerts > 0 ? attentionAlerts : undefined },
          { to: '/profile', label: 'Profile', icon: User },
        ];
      case 'doctor':
        return [
          { to: '/doctor-dashboard', label: 'Doctor Portal', icon: Stethoscope },
          { to: '/history', label: 'Longitudinal', icon: FileText },
          { to: '/hospital-referral', label: 'Referrals', icon: Building2 },
          { to: '/alerts', label: 'Alerts', icon: Bell, badge: attentionAlerts > 0 ? attentionAlerts : undefined },
          { to: '/profile', label: 'Profile', icon: User },
        ];
      case 'family':
        return [
          { to: '/family-dashboard', label: 'Family View', icon: HeartHandshake },
          { to: '/health', label: 'Her Vitals', icon: HeartPulse },
          { to: '/contacts', label: 'Care Circle', icon: Users },
          { to: '/alerts', label: 'Alerts', icon: Bell, badge: attentionAlerts > 0 ? attentionAlerts : undefined },
          { to: '/profile', label: 'Profile', icon: User },
        ];
      default:
        // Pregnant Woman
        return [
          { to: '/home', label: t('home'), icon: Home },
          { to: '/health', label: t('health'), icon: HeartPulse },
          { to: '/guidance', label: 'Coach & Diet', icon: BookOpen },
          { to: '/alerts', label: t('alerts'), icon: Bell, badge: attentionAlerts > 0 ? attentionAlerts : undefined },
          { to: '/profile', label: t('profile'), icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none pb-safe"
      aria-label="Bottom Navigation"
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl pointer-events-auto">
        <div className="glass-nav px-2 py-2 sm:px-6 flex items-center justify-around rounded-t-3xl shadow-lg border-t border-[#DCBEEF]/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 select-none cursor-pointer
                  ${
                    isActive
                      ? 'text-[#8B5FBF] font-bold'
                      : 'text-[#766C82] hover:text-[#503477] font-medium'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-[#EDE3F7] text-[#8B5FBF] scale-110 shadow-soft-sm'
                          : 'text-[#766C82]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.badge !== undefined && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D6455D] text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px] text-center">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5FBF] mt-0.5" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
