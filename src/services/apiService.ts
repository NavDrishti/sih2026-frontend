import { SafetyReport, UserProfile, ReportChatMessage, NotificationItem, UserRole } from '../types/safety';
import { MOCK_REPORTS, MOCK_NOTIFICATIONS } from '../data/mockRefineryData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

// Predefined Demo Users
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  field_worker: {
    id: 'USR-WORKER-01',
    badge_id: 'OP-4492',
    name: 'Rajesh Kumar',
    role: 'field_worker',
    title: 'Senior Mechanical Operations Technician',
    unit: 'DHT (Diesel Hydrotreater)',
    email: 'rajesh.kumar@refinery.internal'
  },
  safety_inspector: {
    id: 'USR-INSPECTOR-01',
    badge_id: 'HSSE-108',
    name: 'Vikram Singh',
    role: 'safety_inspector',
    title: 'Senior HSSE Process Safety Inspector',
    unit: 'Refinery Complex Wide',
    email: 'vikram.singh@refinery.internal'
  }
};

class ApiService {
  private isServerAvailable: boolean | null = null;
  private storageKeyReports = 'nav_drishti_reports_v2';
  private storageKeyMessages = 'nav_drishti_messages_v2';
  private storageKeyAlerts = 'nav_drishti_alerts_v2';
  private storageKeyUser = 'nav_drishti_current_user_v2';

  constructor() {
    this.initLocalStorageFallback();
  }

  // Initialize local browser storage if empty (for GitHub Pages / offline mode)
  private initLocalStorageFallback() {
    if (!localStorage.getItem(this.storageKeyReports)) {
      localStorage.setItem(this.storageKeyReports, JSON.stringify(MOCK_REPORTS));
    }
    if (!localStorage.getItem(this.storageKeyAlerts)) {
      localStorage.setItem(this.storageKeyAlerts, JSON.stringify(MOCK_NOTIFICATIONS));
    }
    if (!localStorage.getItem(this.storageKeyMessages)) {
      const initialMessages: Record<string, ReportChatMessage[]> = {
        'REF-20260918-004412': [
          {
            id: 'MSG-001',
            report_id: 'REF-20260918-004412',
            sender_id: 'AI-SYSTEM',
            sender_name: 'Nav-Drishti AI Co-Pilot',
            sender_role: 'ai_copilot',
            message: '🤖 AI Observation Ingested: High SIF Potential (4.8/5.0). Automated parameter scan flagged high-pressure diesel release during line breaking without verified positive isolation.',
            timestamp: '2026-09-18 14:23 UTC',
            is_ai: true
          },
          {
            id: 'MSG-002',
            report_id: 'REF-20260918-004412',
            sender_id: 'AI-SYSTEM',
            sender_name: 'Nav-Drishti AI Co-Pilot',
            sender_role: 'ai_copilot',
            message: '⚠️ Parameter Clarification: Rajesh, was the upstream block valve locked with a physical padlock, and was depressurization verified before unbolting?',
            timestamp: '2026-09-18 14:24 UTC',
            is_ai: true
          },
          {
            id: 'MSG-003',
            report_id: 'REF-20260918-004412',
            sender_id: 'USR-WORKER-01',
            sender_name: 'Rajesh Kumar',
            sender_role: 'field_worker',
            message: 'Block valve had a danger tag but no physical padlock. We cracked flange bolts when gauge read zero, but gauge needle was seized and line held 24 bar residual diesel.',
            timestamp: '2026-09-18 14:35 UTC',
            is_ai: false
          },
          {
            id: 'MSG-004',
            report_id: 'REF-20260918-004412',
            sender_id: 'USR-INSPECTOR-01',
            sender_name: 'Vikram Singh (Safety Inspector)',
            sender_role: 'safety_inspector',
            message: 'Thanks Rajesh. Stop Work Authority confirmed for P-204 spool. Shift supervisor is swinging a spectacle blind spade and replacing gauge PG-204B before permit reissue.',
            timestamp: '2026-09-18 14:48 UTC',
            is_ai: false
          }
        ]
      };
      localStorage.setItem(this.storageKeyMessages, JSON.stringify(initialMessages));
    }
  }

  // Check if real SQLite backend server is reachable
  async checkBackend(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isServerAvailable = res.ok;
      return res.ok;
    } catch (e) {
      this.isServerAvailable = false;
      return false;
    }
  }

  getIsServerAvailable(): boolean | null {
    return this.isServerAvailable;
  }

  // Current User Session
  getCurrentUser(): UserProfile {
    const saved = localStorage.getItem(this.storageKeyUser);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default to field worker
    return DEMO_USERS.field_worker;
  }

  setCurrentUser(user: UserProfile) {
    localStorage.setItem(this.storageKeyUser, JSON.stringify(user));
  }

  // Login
  async login(role: UserRole, badgeId?: string, customName?: string): Promise<UserProfile> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, badge_id: badgeId, name: customName })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            this.setCurrentUser(data.user);
            return data.user;
          }
        }
      } catch (e) {
        console.warn('Backend login failed, using local session');
      }
    }

    // Fallback to local role preset
    const user = DEMO_USERS[role];
    if (customName) user.name = customName;
    if (badgeId) user.badge_id = badgeId;
    this.setCurrentUser(user);
    return user;
  }

  // Get Reports
  async getReports(user?: UserProfile): Promise<SafetyReport[]> {
    const currentUser = user || this.getCurrentUser();
    const isOnline = await this.checkBackend();

    if (isOnline) {
      try {
        const url = `${API_BASE}/reports?role=${currentUser.role}&user_id=${currentUser.id}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Cache to local storage
          localStorage.setItem(this.storageKeyReports, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Backend fetch failed, falling back to local database');
      }
    }

    // Local Storage Fallback
    const stored = localStorage.getItem(this.storageKeyReports);
    let list: SafetyReport[] = stored ? JSON.parse(stored) : MOCK_REPORTS;

    // Filter for field worker
    if (currentUser.role === 'field_worker') {
      const personal = list.filter(r => r.created_by === currentUser.id);
      if (personal.length > 0) return personal;
    }
    return list;
  }

  // Create Report
  async createReport(reportData: Partial<SafetyReport>, user?: UserProfile): Promise<SafetyReport> {
    const currentUser = user || this.getCurrentUser();
    const reportId = reportData.report_id || `REF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)} UTC`;

    const fullReport: SafetyReport = {
      report_id: reportId,
      timestamp: timestamp,
      unit: reportData.unit || 'DHT',
      equipment: reportData.equipment || 'EQUIP-01',
      equipment_full: reportData.equipment_full || `${reportData.unit} Equipment`,
      activity: reportData.activity || 'Maintenance',
      report_type: reportData.report_type || 'UA',
      report_types: reportData.report_types || [reportData.report_type || 'UA'],
      raw_narrative: reportData.raw_narrative || '',
      ai_summary: reportData.ai_summary || reportData.raw_narrative?.slice(0, 120) || 'Safety observation reported',
      confidence: reportData.confidence || 94,
      hazards: reportData.hazards || ['Hydrocarbon Release'],
      barriers: reportData.barriers || [],
      iogp_rule: reportData.iogp_rule || 'Energy Isolation',
      sif_potential: reportData.sif_potential ?? true,
      sif_score: reportData.sif_score ?? 4.2,
      sif_classification: reportData.sif_classification || 'HIGH SIF POTENTIAL',
      severity: reportData.severity || 'CRITICAL',
      causal_pathway: reportData.causal_pathway || [],
      sif_parameters: reportData.sif_parameters || {
        energyReleasePotential: 4,
        barrierFailure: 4,
        workerExposure: 3,
        hazardousMaterial: 4,
        lineBreaking: 4,
        controlVerification: 3,
        proximityToHazard: 4
      },
      why_flagged: reportData.why_flagged || ['Non-routine line breaking into hydrocarbon envelope'],
      primary_escalation_trigger: reportData.primary_escalation_trigger || 'Pressurized hydrocarbon release',
      reporter_role: currentUser.title,
      corrective_actions: reportData.corrective_actions || [],
      photo_url: reportData.photo_url,
      created_by: currentUser.id,
      created_by_name: currentUser.name,
      status: 'Under Investigation',
      parameters: reportData.parameters || {}
    };

    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullReport)
        });
        if (res.ok) {
          const created = await res.json();
          // Update local cache
          const localList = JSON.parse(localStorage.getItem(this.storageKeyReports) || '[]');
          localStorage.setItem(this.storageKeyReports, JSON.stringify([created.report, ...localList]));
          return created.report;
        }
      } catch (e) {
        console.warn('Backend create failed, saving to local store');
      }
    }

    // Local Storage Path
    const localList = JSON.parse(localStorage.getItem(this.storageKeyReports) || '[]');
    const updated = [fullReport, ...localList];
    localStorage.setItem(this.storageKeyReports, JSON.stringify(updated));

    // Create Initial AI Message in Local Storage
    const allMsgs = JSON.parse(localStorage.getItem(this.storageKeyMessages) || '{}');
    const params = fullReport.parameters || {};
    const missing: string[] = [];
    if (!params.actual_consequence) missing.push('actual injury (No Injury / First Aid)');
    if (!params.pressure_condition) missing.push('line pressure status');
    if (!params.barrier_status) missing.push('LOTO / barrier verification');

    let aiPrompt = `🤖 AI Observation Ingested: Report ${fullReport.report_id} classified as ${fullReport.sif_classification}.`;
    if (missing.length > 0) {
      aiPrompt += `\n\n🔍 AI Parameter Clarification Needed:\nPlease clarify the following unknown parameters: ${missing.join(', ')}? You can reply directly in this chat!`;
    }

    allMsgs[fullReport.report_id] = [
      {
        id: `MSG-${Date.now()}`,
        report_id: fullReport.report_id,
        sender_id: 'AI-SYSTEM',
        sender_name: 'Nav-Drishti AI Co-Pilot',
        sender_role: 'ai_copilot',
        message: aiPrompt,
        timestamp: 'Just now',
        is_ai: true
      }
    ];
    localStorage.setItem(this.storageKeyMessages, JSON.stringify(allMsgs));

    // Push local alert
    const localAlerts: NotificationItem[] = JSON.parse(localStorage.getItem(this.storageKeyAlerts) || '[]');
    const newAlert: NotificationItem = {
      id: `ALT-${Date.now()}`,
      type: fullReport.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      title: `Observation Logged: ${fullReport.report_id} (${fullReport.unit})`,
      message: `${fullReport.created_by_name} submitted: "${fullReport.raw_narrative.slice(0, 80)}..."`,
      timestamp: 'Just now',
      read: false,
      report_id: fullReport.report_id
    };
    localStorage.setItem(this.storageKeyAlerts, JSON.stringify([newAlert, ...localAlerts]));

    return fullReport;
  }

  // Update Report (Status, Severity, etc.)
  async updateReport(reportId: string, updates: Partial<SafetyReport>, user?: UserProfile): Promise<SafetyReport | null> {
    const currentUser = user || this.getCurrentUser();
    const isOnline = await this.checkBackend();

    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/reports/${reportId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updates, updated_by_role: currentUser.role })
        });
        if (res.ok) {
          const data = await res.json();
          return data.report;
        }
      } catch (e) {
        console.warn('Backend update failed');
      }
    }

    // Local Storage update
    const localList: SafetyReport[] = JSON.parse(localStorage.getItem(this.storageKeyReports) || '[]');
    const idx = localList.findIndex(r => r.report_id === reportId);
    if (idx !== -1) {
      localList[idx] = { ...localList[idx], ...updates };
      localStorage.setItem(this.storageKeyReports, JSON.stringify(localList));
      return localList[idx];
    }
    return null;
  }

  // Get Messages for a Report
  async getMessages(reportId: string): Promise<ReportChatMessage[]> {
    const isOnline = await this.checkBackend();

    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/reports/${reportId}/messages`);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (e) {}
    }

    // Local Storage
    const allMsgs = JSON.parse(localStorage.getItem(this.storageKeyMessages) || '{}');
    return allMsgs[reportId] || [];
  }

  // Send Message (with AI auto-update of parameters)
  async sendMessage(reportId: string, text: string, user?: UserProfile): Promise<ReportChatMessage[]> {
    const currentUser = user || this.getCurrentUser();
    const isOnline = await this.checkBackend();

    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/reports/${reportId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: currentUser.id,
            sender_name: `${currentUser.name}${currentUser.role === 'safety_inspector' ? ' (Safety Inspector)' : ''}`,
            sender_role: currentUser.role,
            message: text
          })
        });
        if (res.ok) {
          const data = await res.json();
          return data.messages;
        }
      } catch (e) {}
    }

    // Local Storage Implementation
    const allMsgs = JSON.parse(localStorage.getItem(this.storageKeyMessages) || '{}');
    const thread: ReportChatMessage[] = allMsgs[reportId] || [];

    const newMsg: ReportChatMessage = {
      id: `MSG-${Date.now()}`,
      report_id: reportId,
      sender_id: currentUser.id,
      sender_name: `${currentUser.name}${currentUser.role === 'safety_inspector' ? ' (Safety Inspector)' : ''}`,
      sender_role: currentUser.role,
      message: text,
      timestamp: 'Just now',
      is_ai: false
    };
    thread.push(newMsg);

    // Natural language parameter extraction
    const lower = text.toLowerCase();
    const autoUpdated: Record<string, any> = {};

    if (lower.includes('no injury') || lower.includes('no one hurt')) autoUpdated.actual_consequence = 'No Injury';
    else if (lower.includes('first aid')) autoUpdated.actual_consequence = 'First Aid';
    else if (lower.includes('medical')) autoUpdated.actual_consequence = 'Medical Treatment';

    if (lower.includes('high pressure') || lower.includes('24 bar') || lower.includes('pressurized')) autoUpdated.pressure_condition = 'High Pressure (2–50 bar)';
    else if (lower.includes('low pressure') || lower.includes('atmospheric')) autoUpdated.pressure_condition = 'Atmospheric';

    if (lower.includes('diesel')) autoUpdated.process_material = 'Diesel';
    else if (lower.includes('sour gas') || lower.includes('h2s')) autoUpdated.process_material = 'Sour Gas';
    else if (lower.includes('naphtha')) autoUpdated.process_material = 'Naphtha';

    if (lower.includes('loto failed') || lower.includes('no padlock') || lower.includes('unverified')) {
      autoUpdated.barrier_status = 'Failed';
      autoUpdated.critical_control_failure = true;
    } else if (lower.includes('isolated') && lower.includes('verified')) {
      autoUpdated.barrier_status = 'Effective';
    }

    if (Object.keys(autoUpdated).length > 0) {
      newMsg.auto_updated_fields = autoUpdated;

      // Update report parameters in local storage
      const localList: SafetyReport[] = JSON.parse(localStorage.getItem(this.storageKeyReports) || '[]');
      const rIdx = localList.findIndex(r => r.report_id === reportId);
      if (rIdx !== -1) {
        localList[rIdx].parameters = { ...(localList[rIdx].parameters || {}), ...autoUpdated };
        localStorage.setItem(this.storageKeyReports, JSON.stringify(localList));
      }

      // Append AI acknowledgement
      const fieldsText = Object.entries(autoUpdated).map(([k, v]) => `• ${k} ➔ "${v}"`).join('\n');
      thread.push({
        id: `MSG-${Date.now() + 1}`,
        report_id: reportId,
        sender_id: 'AI-SYSTEM',
        sender_name: 'Nav-Drishti AI Co-Pilot',
        sender_role: 'ai_copilot',
        message: `🤖 AI Parameter Update: Extracted verified parameters:\n${fieldsText}\nDataset synchronized!`,
        timestamp: 'Just now',
        is_ai: true,
        auto_updated_fields: autoUpdated
      });
    }

    allMsgs[reportId] = thread;
    localStorage.setItem(this.storageKeyMessages, JSON.stringify(allMsgs));
    return thread;
  }

  // Trigger AI Clarification explicitly
  async triggerAiClarify(reportId: string): Promise<ReportChatMessage[]> {
    const isOnline = await this.checkBackend();

    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/reports/${reportId}/ai-clarify`, { method: 'POST' });
        if (res.ok) {
          return this.getMessages(reportId);
        }
      } catch (e) {}
    }

    // Local Storage
    const allMsgs = JSON.parse(localStorage.getItem(this.storageKeyMessages) || '{}');
    const thread: ReportChatMessage[] = allMsgs[reportId] || [];

    thread.push({
      id: `MSG-${Date.now()}`,
      report_id: reportId,
      sender_id: 'AI-SYSTEM',
      sender_name: 'Nav-Drishti AI Co-Pilot',
      sender_role: 'ai_copilot',
      message: `🤖 AI Safety Co-Pilot: Process Safety review active. Please confirm if Double Block & Bleed isolation was signed off by unit operations before line cracking.`,
      timestamp: 'Just now',
      is_ai: true
    });

    allMsgs[reportId] = thread;
    localStorage.setItem(this.storageKeyMessages, JSON.stringify(allMsgs));
    return thread;
  }

  // Get Alerts
  async getAlerts(user?: UserProfile): Promise<NotificationItem[]> {
    const currentUser = user || this.getCurrentUser();
    const isOnline = await this.checkBackend();

    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE}/alerts?user_id=${currentUser.id}&role=${currentUser.role}`);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (e) {}
    }

    // Local Storage
    const localAlerts = localStorage.getItem(this.storageKeyAlerts);
    return localAlerts ? JSON.parse(localAlerts) : MOCK_NOTIFICATIONS;
  }

  // Mark Alert Read
  async markAlertRead(alertId: string): Promise<void> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        await fetch(`${API_BASE}/alerts/${alertId}/read`, { method: 'PATCH' });
      } catch (e) {}
    }
    const localAlerts: NotificationItem[] = JSON.parse(localStorage.getItem(this.storageKeyAlerts) || '[]');
    const updated = localAlerts.map(a => a.id === alertId ? { ...a, read: true } : a);
    localStorage.setItem(this.storageKeyAlerts, JSON.stringify(updated));
  }

  // Mark All Alerts Read
  async markAllAlertsRead(): Promise<void> {
    const isOnline = await this.checkBackend();
    if (isOnline) {
      try {
        await fetch(`${API_BASE}/alerts/mark-all-read`, { method: 'POST' });
      } catch (e) {}
    }
    const localAlerts: NotificationItem[] = JSON.parse(localStorage.getItem(this.storageKeyAlerts) || '[]');
    const updated = localAlerts.map(a => ({ ...a, read: true }));
    localStorage.setItem(this.storageKeyAlerts, JSON.stringify(updated));
  }
}

export const apiService = new ApiService();
