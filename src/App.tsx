import React, { useState, useEffect } from 'react';
import { SentinelSidebar, SentinelTab } from './components/layout/SentinelSidebar';
import { SentinelTopBar } from './components/layout/SentinelTopBar';
import { CommandCenterView } from './components/pages/CommandCenterView';
import { ReportObservationView } from './components/pages/ReportObservationView';
import { ObservationExplorerView } from './components/pages/ObservationExplorerView';
import { ObservationDetailView } from './components/pages/ObservationDetailView';
import { SifIntelligenceView } from './components/pages/SifIntelligenceView';
import { LifeSavingRulesView } from './components/pages/LifeSavingRulesView';
import { PrecursorIntelligenceView } from './components/pages/PrecursorIntelligenceView';
import { SiteRiskPageView } from './components/pages/SiteRiskPageView';
import { TrendsPageView } from './components/pages/TrendsPageView';
import { AiAssistantPageView } from './components/pages/AiAssistantPageView';
import { ReportsPageView } from './components/pages/ReportsPageView';

import { NotificationDrawer } from './components/common/NotificationDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import {
  SentinelObservation,
  SENTINEL_OBSERVATIONS
} from './data/sentinelData';
import {
  SafetyReport,
  NotificationItem,
  UserProfile,
  IOGPRule
} from './types/safety';
import { apiService } from './services/apiService';

export const App: React.FC = () => {
  // Current user profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => apiService.getCurrentUser());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<SentinelTab>('COMMAND_CENTER');

  // Currently opened observation for deep detail view
  const [activeObservation, setActiveObservation] = useState<SentinelObservation | null>(null);

  // Filter state for navigating from other views into Observation Explorer
  const [explorerFilter, setExplorerFilter] = useState<{
    site?: string;
    rule?: string;
    risk?: string;
  }>({});

  // Real observations dataset (seeded with 20 benchmark observations)
  const [observations, setObservations] = useState<SentinelObservation[]>(() => {
    const saved = localStorage.getItem('sentinel_observations_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return SENTINEL_OBSERVATIONS;
  });

  // Notifications and backend connectivity state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Toast status alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme mode: Default to clean 'light' (white background per prompt) or 'dark'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('sentinel-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light'; // White background default as requested
  });

  // Sync theme class with document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('sentinel-theme', theme);
  }, [theme]);

  // Persist observations cache
  useEffect(() => {
    localStorage.setItem('sentinel_observations_cache', JSON.stringify(observations));
  }, [observations]);

  // Load backend reports & check online status
  const loadData = async (user?: UserProfile) => {
    const active = user || currentUser;
    const online = await apiService.checkBackend();
    setIsBackendOnline(online);

    try {
      const fetchedAlerts = await apiService.getAlerts(active);
      setNotifications(fetchedAlerts);
    } catch (e) {
      console.error('Data load error', e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      apiService.checkBackend().then(setIsBackendOnline);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched theme to: ${next === 'light' ? 'Light Mode (White Canvas)' : 'Dark Console Mode'}`);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add new observation from voice/text ingestion
  const handleAddNewObservation = async (newObs: SentinelObservation) => {
    setObservations(prev => [newObs, ...prev]);

    // Also persist into SQLite backend if online
    try {
      await apiService.createReport(newObs, currentUser);
    } catch (err) {
      console.warn('Backend sync failed, preserved in local memory', err);
    }

    showToast(`✓ Observation ${newObs.report_id} added and analyzed by AI!`);
  };

  // Update observation review status
  const handleUpdateObservationStatus = (obsId: string, newStatus: any) => {
    setObservations(prev =>
      prev.map(o => (o.report_id === obsId ? { ...o, review_status: newStatus, status: newStatus } : o))
    );
    showToast(`Observation ${obsId} status updated to: ${newStatus}`);
  };

  const handleSelectObservation = (obs: SentinelObservation) => {
    setActiveObservation(obs);
  };

  const handleTabChange = (tab: SentinelTab) => {
    setActiveTab(tab);
    setActiveObservation(null);
    setIsMobileDrawerOpen(false);
    if (tab !== 'OBSERVATIONS') {
      setExplorerFilter({});
    }
  };

  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Left Sidebar (Desktop Pinned + Mobile Slide-over Drawer) */}
      <SentinelSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        currentUser={currentUser}
        onOpenUserModal={() => setIsLoginModalOpen(true)}
        isBackendOnline={isBackendOnline}
        isMobileOpen={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <SentinelTopBar
          activeTab={activeTab}
          customTitle={activeObservation ? `Observation Detail: ${activeObservation.report_id}` : undefined}
          customSubtitle={activeObservation ? `Incident telemetry, AI extraction & SIF analysis` : undefined}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          unreadAlertsCount={unreadAlertsCount}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen(prev => !prev)}
        />

        {/* Page Content Container */}
        <main className="flex-1 px-3 sm:px-6 py-3 sm:py-5 pb-24 lg:pb-6 max-w-[1600px] w-full mx-auto min-w-0">
          {activeObservation ? (
            <ObservationDetailView
              observation={activeObservation}
              onBack={() => setActiveObservation(null)}
              onUpdateStatus={handleUpdateObservationStatus}
            />
          ) : (
            <>
              {activeTab === 'COMMAND_CENTER' && (
                <CommandCenterView
                  observations={observations}
                  onSelectObservation={handleSelectObservation}
                  onNavigateToTab={handleTabChange}
                />
              )}

              {activeTab === 'REPORT_OBSERVATION' && (
                <ReportObservationView
                  onAddObservation={handleAddNewObservation}
                  onSelectObservation={handleSelectObservation}
                />
              )}

              {activeTab === 'OBSERVATIONS' && (
                <ObservationExplorerView
                  observations={observations}
                  onSelectObservation={handleSelectObservation}
                  initialFilter={explorerFilter}
                />
              )}

              {activeTab === 'SIF_INTELLIGENCE' && (
                <SifIntelligenceView
                  observations={observations}
                  onSelectObservation={handleSelectObservation}
                />
              )}

              {activeTab === 'LIFE_SAVING_RULES' && (
                <LifeSavingRulesView
                  observations={observations}
                  onSelectObservation={handleSelectObservation}
                  onFilterObservationsByRule={(rule) => {
                    setExplorerFilter({ rule });
                    setActiveTab('OBSERVATIONS');
                  }}
                />
              )}

              {activeTab === 'PRECURSORS' && (
                <PrecursorIntelligenceView
                  observations={observations}
                  onSelectObservation={handleSelectObservation}
                />
              )}

              {activeTab === 'SITE_RISK' && (
                <SiteRiskPageView
                  observations={observations}
                  onSelectObservation={handleSelectObservation}
                  onFilterBySite={(site) => {
                    setExplorerFilter({ site });
                    setActiveTab('OBSERVATIONS');
                  }}
                />
              )}

              {activeTab === 'TRENDS' && (
                <TrendsPageView />
              )}

              {activeTab === 'AI_ASSISTANT' && (
                <AiAssistantPageView observations={observations} />
              )}

              {activeTab === 'REPORTS' && (
                <ReportsPageView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={async () => {
          await apiService.markAllAlertsRead();
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          showToast('All safety alerts marked as read');
        }}
        onSelectNotification={(item) => {
          setIsNotificationOpen(false);
          if (item.report_id) {
            const found = observations.find(o => o.report_id === item.report_id);
            if (found) setActiveObservation(found);
          }
        }}
      />

      {/* User Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Logged in as: ${user.name} (${user.role})`);
          setIsLoginModalOpen(false);
        }}
        isBackendOnline={isBackendOnline}
      />

      {/* Status Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (thumb-accessible for phones) */}
      <MobileBottomBar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(prev => !prev)}
        isMobileDrawerOpen={isMobileDrawerOpen}
      />
    </div>
  );
};

export default App;
