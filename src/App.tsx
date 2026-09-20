import React, { useState, useEffect } from 'react';
import { TopNavbar, NavTab } from './components/layout/TopNavbar';
import { Footer } from './components/layout/Footer';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { ReportDetailView } from './components/report-detail/ReportDetailView';
import { SiteRiskView } from './components/site-risk/SiteRiskView';
import { LiveFeedView } from './components/live-feed/LiveFeedView';
import { LifeSavingRulesView } from './components/life-saving-rules/LifeSavingRulesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ActionTrackerView } from './components/action-tracker/ActionTrackerView';
import { ReportsArchiveView } from './components/reports/ReportsArchiveView';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NewObservationModal } from './components/modals/NewObservationModal';
import { AiExtractionModal } from './components/modals/AiExtractionModal';
import { 
  MOCK_REPORTS, 
  MOCK_NOTIFICATIONS 
} from './data/mockRefineryData';
import { SafetyReport, RefineryUnit, IOGPRule, NotificationItem } from './types/safety';

export const App: React.FC = () => {
  // Navigation & Core View States
  const [activeTab, setActiveTab] = useState<NavTab>('OVERVIEW');
  const [activeReport, setActiveReport] = useState<SafetyReport | null>(null);
  const [selectedSite, setSelectedSite] = useState('BAYPORT REFINERY — COMPLEX 04');

  // Reports collection in state (allows adding new observations)
  const [reports, setReports] = useState<SafetyReport[]>(MOCK_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Drilldown filter states
  const [feedInitialFilter, setFeedInitialFilter] = useState<string>('All');
  const [rulesInitialFilter, setRulesInitialFilter] = useState<IOGPRule | undefined>(undefined);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewObservationOpen, setIsNewObservationOpen] = useState(false);
  const [aiExtractionTarget, setAiExtractionTarget] = useState<SafetyReport | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme mode: 'dark' (Night Shift / Control Room) vs 'light' (Day Shift / High Visibility)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('refinery-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('refinery-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched main theme to: ${next === 'light' ? 'WHITE THEME (Clean Light Mode)' : 'BLACK THEME (Dark Console)'}`);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut listener (/ or Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isSearchOpen && !isNewObservationOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isNewObservationOpen]);

  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleSelectReport = (report: SafetyReport) => {
    setActiveReport(report);
  };

  const handleSelectReportById = (reportId: string) => {
    const found = reports.find(r => r.report_id === reportId);
    if (found) {
      setActiveReport(found);
    } else {
      showToast(`Report ${reportId} not found`);
    }
  };

  const handleNavigateToUnit = (unit: RefineryUnit) => {
    setActiveTab('SITE RISK');
    setActiveReport(null);
  };

  const handleNavigateToRule = (rule: IOGPRule) => {
    setRulesInitialFilter(rule);
    setActiveTab('LIFE-SAVING RULES');
    setActiveReport(null);
  };

  const handleNavigateToFeed = (filter: string = 'All') => {
    setFeedInitialFilter(filter);
    setActiveTab('LIVE FEED');
    setActiveReport(null);
  };

  const handleAddNewReport = (newReport: SafetyReport) => {
    setReports(prev => [newReport, ...prev]);
    // Also push a critical notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      type: 'CRITICAL',
      title: `${newReport.unit} — Critical observation ${newReport.report_id} submitted`,
      message: newReport.ai_summary,
      timestamp: 'Just now',
      read: false,
      report_id: newReport.report_id
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`✓ Observation ${newReport.report_id} ingested and classified!`);
    setActiveReport(newReport);
  };

  const handleSelectNotification = (item: NotificationItem) => {
    if (item.report_id) {
      handleSelectReportById(item.report_id);
    } else if (item.action_id) {
      setActiveTab('ACTION TRACKER');
      setActiveReport(null);
    }
    setIsNotificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-200 flex flex-col font-sans industrial-grid">
      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveReport(null);
        }}
        unreadAlertsCount={unreadAlertsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewObservation={() => setIsNewObservationOpen(true)}
        selectedSite={selectedSite}
        onSiteChange={(site) => {
          setSelectedSite(site);
          showToast(`Switched active complex telemetry to: ${site}`);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6">
        {/* If an active report is selected, show deep investigation screen */}
        {activeReport ? (
          <ReportDetailView
            report={activeReport}
            onBack={() => setActiveReport(null)}
            onNavigateReport={handleSelectReportById}
            onOpenActionTracker={() => {
              setActiveReport(null);
              setActiveTab('ACTION TRACKER');
            }}
          />
        ) : (
          <>
            {activeTab === 'OVERVIEW' && (
              <OverviewDashboard
                reports={reports}
                onSelectReport={handleSelectReport}
                onNavigateToUnit={handleNavigateToUnit}
                onNavigateToRule={handleNavigateToRule}
                onNavigateToFeed={handleNavigateToFeed}
              />
            )}

            {activeTab === 'LIVE FEED' && (
              <LiveFeedView
                reports={reports}
                onSelectReport={handleSelectReport}
                initialFilter={feedInitialFilter}
              />
            )}

            {activeTab === 'SITE RISK' && (
              <SiteRiskView
                reports={reports}
                onSelectUnit={handleNavigateToUnit}
                onSelectReport={handleSelectReport}
              />
            )}

            {activeTab === 'LIFE-SAVING RULES' && (
              <LifeSavingRulesView
                reports={reports}
                onSelectReport={handleSelectReport}
                initialRule={rulesInitialFilter}
              />
            )}

            {activeTab === 'REPORTS' && (
              <ReportsArchiveView
                reports={reports}
                onSelectReport={handleSelectReport}
              />
            )}

            {activeTab === 'ANALYTICS' && (
              <AnalyticsView />
            )}

            {activeTab === 'ACTION TRACKER' && (
              <ActionTrackerView
                onSelectReportById={handleSelectReportById}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          showToast('All safety notifications marked as read');
        }}
        onSelectNotification={handleSelectNotification}
      />

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        reports={reports}
        onSelectReport={handleSelectReport}
      />

      {/* New Observation & Multi-modal Ingestion Modal */}
      <NewObservationModal
        isOpen={isNewObservationOpen}
        onClose={() => setIsNewObservationOpen(false)}
        onSubmitReport={handleAddNewReport}
      />

      {/* AI Extraction View Modal */}
      {aiExtractionTarget && (
        <AiExtractionModal
          isOpen={!!aiExtractionTarget}
          onClose={() => setAiExtractionTarget(null)}
          report={aiExtractionTarget}
        />
      )}

      {/* Global Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 p-3 bg-industrial-900 border border-hazard-cyan text-hazard-cyan font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 bg-hazard-cyan animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default App;
