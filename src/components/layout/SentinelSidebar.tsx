import React from 'react';
import {
  LayoutGrid,
  Mic,
  Search,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Bot,
  FileText,
  HardHat,
  UserCheck,
  X
} from 'lucide-react';
import { UserProfile } from '../../types/safety';

export type SentinelTab =
  | 'COMMAND_CENTER'
  | 'REPORT_OBSERVATION'
  | 'OBSERVATIONS'
  | 'SIF_INTELLIGENCE'
  | 'LIFE_SAVING_RULES'
  | 'PRECURSORS'
  | 'SITE_RISK'
  | 'TRENDS'
  | 'AI_ASSISTANT'
  | 'REPORTS';

interface SentinelSidebarProps {
  activeTab: SentinelTab;
  onSelectTab: (tab: SentinelTab) => void;
  currentUser: UserProfile;
  onOpenUserModal: () => void;
  isBackendOnline: boolean | null;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SentinelSidebar: React.FC<SentinelSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenUserModal,
  isBackendOnline,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems: { id: SentinelTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'COMMAND_CENTER', label: 'Command Center', icon: LayoutGrid },
    { id: 'REPORT_OBSERVATION', label: 'Report Observation', icon: Mic },
    { id: 'OBSERVATIONS', label: 'Observations', icon: Search },
    { id: 'SIF_INTELLIGENCE', label: 'SIF Intelligence', icon: AlertOctagon },
    { id: 'LIFE_SAVING_RULES', label: 'Life-Saving Rules', icon: ShieldCheck },
    { id: 'PRECURSORS', label: 'Precursors', icon: AlertTriangle },
    { id: 'SITE_RISK', label: 'Site Risk', icon: MapPin },
    { id: 'TRENDS', label: 'Trends', icon: TrendingUp },
    { id: 'AI_ASSISTANT', label: 'AI Assistant', icon: Bot },
    { id: 'REPORTS', label: 'Reports', icon: FileText },
  ];

  const handleTabClick = (tabId: SentinelTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full min-h-full">
      {/* Brand Header */}
      <div>
        <div className="p-4 pb-5 border-b border-[#152033]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 shrink-0">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-[15px] leading-tight tracking-tight flex items-center gap-1.5">
                Nav Drishti
              </h1>
              <p className="text-[11px] text-slate-400 tracking-tight font-medium mt-0.5">
                AI Safety Intelligence
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            SAFETY OPERATIONS
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Box & Backend Telemetry */}
      <div className="p-3 border-t border-[#152033]/80 space-y-2 mt-4">
        {/* Backend Status Pill */}
        <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/60 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline === true
                  ? 'bg-emerald-500 animate-pulse'
                  : isBackendOnline === false
                  ? 'bg-amber-500'
                  : 'bg-slate-500'
              }`}
            />
            <span>{isBackendOnline ? 'SQLite Sync: Connected' : 'Local Cache Active'}</span>
          </div>
          <span className="text-slate-400 text-[9px]">SIH-2026</span>
        </div>

        {/* User Card */}
        <button
          onClick={() => {
            onOpenUserModal();
            if (isMobile && onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-colors text-left"
          title="Click to switch role or view credentials"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {currentUser.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'ND'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate flex items-center justify-between">
              <span>{currentUser.name || 'HSE Lead'}</span>
              <UserCheck className="w-3 h-3 text-emerald-400 shrink-0 ml-1 opacity-70" />
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentUser.title || 'SIH 2026 Demo'}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Permanent Desktop Sidebar (hidden on mobile, visible on lg and above) */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#0c1322] border-r border-[#152033] flex-col justify-between shrink-0 select-none z-30 sticky top-0 h-screen overflow-y-auto">
        {renderContent(false)}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer (visible only when isMobileOpen is true on mobile) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0c1322] border-r border-[#152033] flex flex-col justify-between select-none shadow-2xl z-10 overflow-y-auto animate-slide-in">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
