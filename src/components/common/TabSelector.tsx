import React from 'react';

export interface TabOption<T extends string> {
  id: T;
  label: string;
  badge?: number | string;
}

export interface TabSelectorProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function TabSelector<T extends string>({
  tabs,
  activeTab,
  onChange,
  size = 'md',
  className = '',
}: TabSelectorProps<T>) {
  const sizeClasses = size === 'sm' ? 'p-1 text-xs' : 'p-1.5 text-xs sm:text-sm';

  return (
    <div
      className={`inline-flex items-center w-full bg-[#EDE3F7]/70 rounded-2xl border border-[#DCBEEF]/40 ${sizeClasses} ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white text-[#503477] shadow-soft-sm'
                : 'text-[#766C82] hover:text-[#29213A]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-[#8B5FBF] text-white'
                    : 'bg-[#DCBEEF] text-[#503477]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
