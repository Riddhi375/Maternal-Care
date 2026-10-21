import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const config = {
          success: {
            bg: 'bg-white border-[#B6E2D3]',
            text: 'text-[#24634E]',
            icon: <CheckCircle2 className="w-5 h-5 text-[#36866A] flex-shrink-0" />,
            bar: 'bg-[#36866A]',
          },
          error: {
            bg: 'bg-white border-[#F8BCC7]',
            text: 'text-[#B0263E]',
            icon: <AlertCircle className="w-5 h-5 text-[#D6455D] flex-shrink-0" />,
            bar: 'bg-[#D6455D]',
          },
          warning: {
            bg: 'bg-white border-[#F6D9B4]',
            text: 'text-[#A7661C]',
            icon: <AlertTriangle className="w-5 h-5 text-[#D58A35] flex-shrink-0" />,
            bar: 'bg-[#D58A35]',
          },
          info: {
            bg: 'bg-white border-[#DCBEEF]',
            text: 'text-[#503477]',
            icon: <Info className="w-5 h-5 text-[#8B5FBF] flex-shrink-0" />,
            bar: 'bg-[#8B5FBF]',
          },
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border shadow-soft-md p-3.5 flex items-start gap-3 transition-all animate-in slide-in-from-top-3 duration-200 ${config.bg}`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar}`} />
            {config.icon}
            <div className="flex-1 pt-0.5">
              <p className={`text-xs sm:text-sm font-medium ${config.text}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-[#766C82] hover:bg-[#F6F0FC] transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
