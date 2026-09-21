import React from 'react';
import { Calendar, Sun, Moon, Bell, Menu } from 'lucide-react';
import { SentinelTab } from './SentinelSidebar';

interface SentinelTopBarProps {
  activeTab: SentinelTab;
  customTitle?: string;
  customSubtitle?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onToggleMobileDrawer?: () => void;
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
    subtitle: 'Ask Nav Drishti about your safety data'
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
  onOpenNotifications,
  onToggleMobileDrawer
}) => {
  const current = TAB_TITLES[activeTab] || {
    title: 'Safety Intelligence',
    subtitle: 'Process Safety Operations'
  };

  const title = customTitle || current.title;
  const subtitle = customSubtitle || current.subtitle;

  // Format demo date
  const formattedDate = "Sunday, 20 September 2026";

  return (
    <header className="px-3 sm:px-6 pt-3 sm:pt-5 pb-2 sm:pb-3 border-b border-slate-200/60 dark:border-slate-800/60 lg:border-b-0">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Drawer Button + Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Toggle (hidden on desktop lg) */}
          {onToggleMobileDrawer && (
            <button
              type="button"
              onClick={onToggleMobileDrawer}
              className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {title}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5 hidden xs:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Date, Theme Toggle, Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Formatted Date (desktop & tablet) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-colors"
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
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-colors"
            title="Safety Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Demo Data Tag */}
      <div className="mt-2 hidden sm:block">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700/80">
          DEMO DATA
        </span>
      </div>
    </header>
  );
};
