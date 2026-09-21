import React from 'react';
import {
  LayoutGrid,
  Mic,
  Search,
  AlertOctagon,
  Menu
} from 'lucide-react';
import { SentinelTab } from './SentinelSidebar';

interface MobileBottomBarProps {
  activeTab: SentinelTab;
  onSelectTab: (tab: SentinelTab) => void;
  onToggleMobileDrawer: () => void;
  isMobileDrawerOpen: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  onSelectTab,
  onToggleMobileDrawer,
  isMobileDrawerOpen
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c1322]/95 backdrop-blur-lg border-t border-[#152033] px-2 py-1.5 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      {/* 1. Command Center */}
      <button
        type="button"
        onClick={() => onSelectTab('COMMAND_CENTER')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
          activeTab === 'COMMAND_CENTER' && !isMobileDrawerOpen
            ? 'text-emerald-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutGrid className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Overview</span>
      </button>

      {/* 2. Observations Explorer */}
      <button
        type="button"
        onClick={() => onSelectTab('OBSERVATIONS')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
          activeTab === 'OBSERVATIONS' && !isMobileDrawerOpen
            ? 'text-emerald-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Search className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Explore</span>
      </button>

      {/* 3. Report Observation - Prominent Center Action */}
      <button
        type="button"
        onClick={() => onSelectTab('REPORT_OBSERVATION')}
        className="flex flex-col items-center justify-center -mt-5 relative group"
        aria-label="Report Observation"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 ring-4 ring-[#0c1322] group-hover:scale-105 active:scale-95 transition-transform">
          <Mic className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 mt-0.5">Report</span>
      </button>

      {/* 4. SIF Intelligence */}
      <button
        type="button"
        onClick={() => onSelectTab('SIF_INTELLIGENCE')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
          activeTab === 'SIF_INTELLIGENCE' && !isMobileDrawerOpen
            ? 'text-emerald-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <AlertOctagon className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">SIF Intel</span>
      </button>

      {/* 5. Menu / All Tabs */}
      <button
        type="button"
        onClick={onToggleMobileDrawer}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
          isMobileDrawerOpen
            ? 'text-emerald-400 font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>
    </div>
  );
};
