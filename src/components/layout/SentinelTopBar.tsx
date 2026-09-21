import React from 'react';
import { Calendar, Sun, Moon, Bell } from 'lucide-react';
import { SentinelTab } from './SentinelSidebar';

interface SentinelTopBarProps {
  activeTab: SentinelTab;
  customTitle?: string;
  customSubtitle?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
}

const TAB_TITLES: Record<SentinelTab, { title: string; subtitle: string }> = {
  COMMAND_CENTER: {
    title: 'Command Center',
    subtitle: 'Real-time safety intelligence overview'
  },
  REPORT_OBSERVATION: {
    title: 'Report Observation',
    subtitle: 'Submit a safety observation via voice or text'
  },
  OBSERVATIONS: {
    title: 'Observation Explorer',
    subtitle: 'Search and filter all safety observations'
  },
  SIF_INTELLIGENCE: {
    title: 'SIF Intelligence',
    subtitle: 'Serious Injury & Fatality potential analysis'
  },
  LIFE_SAVING_RULES: {
    title: 'Life-Saving Rules',
    subtitle: 'IOGP Life-Saving Rules exposure tracking'
  },
  PRECURSORS: {
    title: 'Precursor Intelligence',
    subtitle: 'Recurring safety pattern detection'
  },
  SITE_RISK: {
    title: 'Site Risk',
    subtitle: 'Risk distribution across all sites'
  },
  TRENDS: {
    title: 'Trends',
    subtitle: 'Safety performance trends over time'
  },
  AI_ASSISTANT: {
    title: 'AI Assistant',
    subtitle: 'Ask Sentinel about your safety data'
  },
  REPORTS: {
    title: 'Reports',
    subtitle: 'Generate and export safety reports'
  }
};

export const SentinelTopBar: React.FC<SentinelTopBarProps> = ({
  activeTab,
  customTitle,
  customSubtitle,
  theme,
  onToggleTheme,
  unreadAlertsCount,
  onOpenNotifications
}) => {
  const current = TAB_TITLES[activeTab] || {
    title: 'Safety Intelligence',
    subtitle: 'Process Safety Operations'
  };

  const title = customTitle || current.title;
  const subtitle = customSubtitle || current.subtitle;

  // Format demo date matching screenshot: e.g. "Sunday, 20 September 2026"
  const formattedDate = "Sunday, 20 September 2026";

  return (
    <header className="px-6 pt-5 pb-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Page Title & Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Right: Date, Theme Toggle, Notifications */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Formatted Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-colors"
            title={theme === 'dark' ? 'Switch to Clean White Theme' : 'Switch to Dark Console Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-colors"
            title="Safety Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Demo Data Tag */}
      <div className="mt-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700/80">
          DEMO DATA
        </span>
      </div>
    </header>
  );
};
