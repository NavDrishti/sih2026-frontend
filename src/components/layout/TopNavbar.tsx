import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Bell, 
  Search, 
  PlusCircle, 
  ChevronDown, 
  Cpu, 
  Flame, 
  AlertTriangle,
  Radio,
  Sun,
  Moon
} from 'lucide-react';
import { IndustrialBadge } from '../common/IndustrialBadge';

export type NavTab = 
  | 'OVERVIEW' 
  | 'LIVE FEED' 
  | 'SITE RISK' 
  | 'LIFE-SAVING RULES' 
  | 'REPORTS' 
  | 'ANALYTICS' 
  | 'ACTION TRACKER';

interface TopNavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenNewObservation: () => void;
  selectedSite: string;
  onSiteChange: (site: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenNewObservation,
  selectedSite,
  onSiteChange,
  theme,
  onToggleTheme
}) => {
  const tabs: NavTab[] = [
    'OVERVIEW',
    'LIVE FEED',
    'SITE RISK',
    'LIFE-SAVING RULES',
    'REPORTS',
    'ANALYTICS',
    'ACTION TRACKER'
  ];

  return (
    <header className="sticky top-0 z-40 bg-industrial-950/95 backdrop-blur border-b border-industrial-800 select-none">
      {/* Top Header Bar */}
      <div className="px-4 py-2 border-b border-industrial-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-hazard-red-dark border border-hazard-red flex items-center justify-center text-hazard-red shadow-hazard-red">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-widest text-sm uppercase">
                  REFINERY SIF INTELLIGENCE
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-industrial-800 text-[10px] text-industrial-400 border border-industrial-700">
                  v2.4-RC
                </span>
              </div>
              <p className="text-[10px] text-industrial-400 tracking-tight hidden md:block">
                AI-Driven Safety Observation & SIF Precursor Detection Platform
              </p>
            </div>
          </div>

          <div className="h-4 w-px bg-industrial-800 hidden md:block mx-1" />

          {/* Refinery / Site Selector */}
          <div className="flex items-center gap-1.5 text-industrial-300">
            <span className="text-industrial-500 uppercase tracking-wider text-[10px]">FACILITY:</span>
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 px-2 py-1 bg-industrial-900 hover:bg-industrial-850 border border-industrial-700 text-industrial-200 font-mono text-xs transition"
                onClick={() => onSiteChange(selectedSite === 'BAYPORT REFINERY — COMPLEX 04' ? 'DEER PARK COMPLEX — TRAIN A' : 'BAYPORT REFINERY — COMPLEX 04')}
                title="Click to toggle refinery site"
              >
                <span className="w-2 h-2 rounded-full bg-safety-cyan animate-ping" />
                <span className="font-semibold">{selectedSite}</span>
                <ChevronDown className="w-3 h-3 text-industrial-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Status Indicators */}
        <div className="flex items-center gap-3">
          {/* System Telemetry Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-industrial-900 border border-industrial-800">
            <Radio className="w-3.5 h-3.5 text-hazard-cyan animate-pulse" />
            <span className="text-[11px] text-industrial-300">
              CORE SYSTEM: <span className="text-hazard-cyan font-semibold">ONLINE</span>
            </span>
            <span className="text-industrial-600">|</span>
            <Cpu className="w-3.5 h-3.5 text-industrial-400" />
            <span className="text-[11px] text-industrial-300">
              AI ENGINE: <span className="text-emerald-400 font-semibold">INFERENCE READY</span>
            </span>
          </div>

          {/* DEMO MODE Badge */}
          <div className="px-2 py-0.5 bg-hazard-amber-dark border border-hazard-amber text-hazard-amber font-mono font-bold text-[10px] tracking-widest uppercase shadow-hazard-amber">
            DEMO MODE • SEEDED DATA
          </div>

          {/* Main Theme Switcher: Black Theme vs White Theme */}
          <div 
            className="flex items-center bg-industrial-900 border border-industrial-700 p-0.5 rounded-xs"
            title="Toggle website main theme between Black and White"
          >
            <button
              onClick={() => { if (theme !== 'dark') onToggleTheme(); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-industrial-800 text-hazard-cyan border border-industrial-600 shadow-xs'
                  : 'text-industrial-400 hover:text-industrial-200 opacity-60 hover:opacity-100'
              }`}
              aria-label="Switch to Black Theme"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>BLACK</span>
            </button>
            <button
              onClick={() => { if (theme !== 'light') onToggleTheme(); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold transition-all ${
                theme === 'light'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                  : 'text-industrial-400 hover:text-industrial-200 opacity-60 hover:opacity-100'
              }`}
              aria-label="Switch to White Theme"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>WHITE</span>
            </button>
          </div>

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-industrial-900 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 hover:text-white transition text-xs"
            title="Search observations, equipment, barriers (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SEARCH</span>
            <kbd className="hidden md:inline px-1 py-0.2 bg-industrial-800 border border-industrial-700 text-[9px] text-industrial-400">
              /
            </kbd>
          </button>

          {/* New Observation CTA */}
          <button
            onClick={onOpenNewObservation}
            className="flex items-center gap-1.5 px-3 py-1 bg-hazard-red hover:bg-red-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition border border-red-500 shadow-hazard-red"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>NEW OBSERVATION</span>
          </button>

          {/* Notification Icon */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 bg-industrial-900 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 hover:text-white transition"
            title="Open safety alert escalation drawer"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-hazard-red text-white text-[10px] font-bold flex items-center justify-center border border-industrial-950 animate-critical-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-industrial-800">
            <div className="w-6 h-6 bg-industrial-800 border border-industrial-700 flex items-center justify-center text-industrial-300 font-bold text-[10px]">
              HS
            </div>
            <div className="text-[10px] leading-tight">
              <div className="text-industrial-200 font-semibold">Y. KARWA</div>
              <div className="text-industrial-500">LEAD HSSE SUPV</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="px-4 flex items-center gap-1 overflow-x-auto no-scrollbar bg-industrial-900/60">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative px-4 py-2.5 font-mono text-xs font-semibold tracking-wider whitespace-nowrap transition-all border-b-2 uppercase ${
                isActive
                  ? 'border-hazard-red text-white bg-industrial-850/80 shadow-[inset_0_-2px_0_0_#ef4444]'
                  : 'border-transparent text-industrial-400 hover:text-industrial-200 hover:bg-industrial-850/40'
              }`}
            >
              {tab}
              {tab === 'LIVE FEED' && (
                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-hazard-red animate-ping" />
              )}
              {tab === 'ACTION TRACKER' && (
                <span className="ml-1.5 px-1 py-0.2 bg-hazard-amber-dark text-hazard-amber border border-hazard-amber-border text-[9px]">
                  3 DUE
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
