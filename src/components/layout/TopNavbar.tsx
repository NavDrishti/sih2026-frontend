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
  Moon,
  User,
  HardHat,
  ShieldCheck,
  Database,
  ArrowRightLeft
} from 'lucide-react';
import { IndustrialBadge } from '../common/IndustrialBadge';
import { UserProfile, UserRole } from '../../types/safety';

export type NavTab = 
  | 'OVERVIEW' 
  | 'LIVE FEED' 
  | 'SITE RISK' 
  | 'LIFE-SAVING RULES' 
  | 'REPORTS' 
  | 'ANALYTICS' 
  | 'ACTION TRACKER'
  | 'FIELD_WORKER_PORTAL';

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
  currentUser: UserProfile;
  onOpenLoginModal: () => void;
  isBackendOnline: boolean | null;
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
  onToggleTheme,
  currentUser,
  onOpenLoginModal,
  isBackendOnline
}) => {
  const isWorker = currentUser.role === 'field_worker';

  const inspectorTabs: { id: NavTab; label: string }[] = [
    { id: 'OVERVIEW', label: 'OVERVIEW' },
    { id: 'LIVE FEED', label: 'LIVE FEED' },
    { id: 'SITE RISK', label: 'SITE RISK' },
    { id: 'LIFE-SAVING RULES', label: 'LIFE-SAVING RULES' },
    { id: 'REPORTS', label: 'REPORTS ARCHIVE' },
    { id: 'ANALYTICS', label: 'ANALYTICS' },
    { id: 'ACTION TRACKER', label: 'ACTION TRACKER' }
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
                  NAV DRISHTI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-industrial-800 text-[10px] text-industrial-400 border border-industrial-700">
                  v2.5-PRO
                </span>
              </div>
              <p className="text-[10px] text-industrial-400 tracking-tight hidden md:block">
                AI Process Safety &bull; 10-Parameter Dataset &bull; SIF Precursor Intelligence
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

        {/* Right Side Status Indicators & Role Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Database Live Status Indicator */}
          <div 
            onClick={onOpenLoginModal}
            className={`cursor-pointer px-2.5 py-1 border flex items-center gap-1.5 text-[11px] font-bold transition ${
              isBackendOnline
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-hazard-amber-dark/30 border-hazard-amber-border text-hazard-amber'
            }`}
            title="Click to view database connection status and switch roles"
          >
            <Database className="w-3.5 h-3.5" />
            {isBackendOnline ? (
              <span className="hidden sm:inline">LIVE SQLITE DB (PORT 5001)</span>
            ) : (
              <span className="hidden sm:inline">BROWSER DB (GITHUB LIVE LINK)</span>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
          </div>

          {/* User Role Badge & Switcher */}
          <button
            onClick={onOpenLoginModal}
            className={`flex items-center gap-2 px-2.5 py-1 border text-xs font-bold transition ${
              isWorker
                ? 'bg-hazard-cyan/15 hover:bg-hazard-cyan/25 border-hazard-cyan/40 text-hazard-cyan'
                : 'bg-hazard-amber-dark/30 hover:bg-hazard-amber-dark/50 border-hazard-amber-border text-hazard-amber'
            }`}
            title="Click to switch role between Field Worker and Safety Inspector"
          >
            {isWorker ? <HardHat className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span className="uppercase">{currentUser.name}</span>
            <span className="text-[10px] px-1 py-0.2 bg-black/40 border border-current">
              {isWorker ? 'WORKER' : 'INSPECTOR'}
            </span>
            <ArrowRightLeft className="w-3 h-3 opacity-70" />
          </button>

          {/* Main Theme Switcher: Black Theme vs White Theme */}
          <div 
            className="flex items-center bg-industrial-900 border border-industrial-700 p-0.5 rounded-xs"
            title="Toggle theme between Black and White"
          >
            <button
              onClick={() => { if (theme !== 'dark') onToggleTheme(); }}
              className={`flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-industrial-800 text-hazard-cyan border border-industrial-600'
                  : 'text-industrial-400 hover:text-industrial-200'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">BLACK</span>
            </button>
            <button
              onClick={() => { if (theme !== 'light') onToggleTheme(); }}
              className={`flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold transition-all ${
                theme === 'light'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'text-industrial-400 hover:text-industrial-200'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">WHITE</span>
            </button>
          </div>

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-industrial-900 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 hover:text-white transition text-xs"
            title="Search observations (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SEARCH</span>
          </button>

          {/* New Observation CTA */}
          <button
            onClick={onOpenNewObservation}
            className="flex items-center gap-1.5 px-3 py-1 bg-hazard-red hover:bg-red-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition border border-red-500 shadow-hazard-red"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>REPORT</span>
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
        </div>
      </div>

      {/* Role-Filtered Tab Navigation Bar */}
      <nav className="px-4 py-1.5 flex items-center gap-1 overflow-x-auto whitespace-nowrap text-xs font-mono border-b border-industrial-800 bg-industrial-950/70">
        {isWorker ? (
          /* Field Worker Navigation Tabs */
          <>
            <button
              onClick={() => onTabChange('FIELD_WORKER_PORTAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition border ${
                activeTab === 'FIELD_WORKER_PORTAL'
                  ? 'bg-hazard-cyan/20 text-hazard-cyan border-hazard-cyan/50 shadow-xs'
                  : 'text-industrial-300 hover:text-white border-transparent hover:bg-industrial-850'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>MY OBSERVATIONS &amp; STATUS TRACKER</span>
            </button>

            <button
              onClick={onOpenNewObservation}
              className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-hazard-red hover:text-red-400 border border-hazard-red/30 bg-hazard-red/10 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ REPORT NEW HAZARD</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-industrial-300 hover:text-white border border-transparent hover:bg-industrial-850 transition"
            >
              <Bell className="w-3.5 h-3.5 text-hazard-amber" />
              <span>SAFETY ALERTS &amp; NOTICES ({unreadAlertsCount})</span>
            </button>
          </>
        ) : (
          /* Safety Inspector Navigation Tabs */
          inspectorTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 font-bold transition border ${
                  isActive
                    ? 'bg-industrial-800 text-hazard-cyan border-industrial-600 shadow-xs'
                    : 'text-industrial-400 hover:text-industrial-200 border-transparent hover:bg-industrial-850'
                }`}
              >
                {tab.label}
              </button>
            );
          })
        )}
      </nav>
    </header>
  );
};
