import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  FileText, 
  Activity, 
  Layers, 
  Flame, 
  Zap, 
  UserCheck, 
  Clock, 
  Download, 
  Code,
  ExternalLink,
  MessageSquare,
  Sliders,
  Check
} from 'lucide-react';
import { SafetyReport, CorrectiveAction, UserProfile } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';
import { calculateSIFScore } from '../../services/sifScoringService';
import { ReportChatHub } from '../reports/ReportChatHub';
import { apiService } from '../../services/apiService';

interface ReportDetailViewProps {
  report: SafetyReport;
  onBack: () => void;
  onNavigateReport?: (reportId: string) => void;
  onOpenActionTracker?: () => void;
  currentUser?: UserProfile;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report: initialReport,
  onBack,
  onOpenActionTracker,
  currentUser = {
    id: 'USR-INSPECTOR-01',
    badge_id: 'HSSE-108',
    name: 'Vikram Singh',
    role: 'safety_inspector',
    title: 'Senior HSSE Process Safety Inspector',
    unit: 'Refinery Complex Wide',
    email: 'vikram.singh@refinery.internal'
  }
}) => {
  const [report, setReport] = useState<SafetyReport>(initialReport);
  const [activeViewTab, setActiveViewTab] = useState<'AUDIT' | 'COMMUNICATION' | '10_PARAMS'>('AUDIT');
  const [whyFlaggedExpanded, setWhyFlaggedExpanded] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const sifCalc = calculateSIFScore(report.sif_parameters);

  const handleCopyReportId = () => {
    navigator.clipboard.writeText(report.report_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await apiService.updateReport(report.report_id, { status: newStatus }, currentUser);
      if (updated) setReport(updated);
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-industrial-900 border border-industrial-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1 bg-industrial-800 hover:bg-industrial-750 border border-industrial-700 text-industrial-200 transition font-bold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FEED / OVERVIEW</span>
          </button>
          <div className="h-4 w-px bg-industrial-700" />
          <div className="text-industrial-400">
            INCIDENT INVESTIGATION CONSOLE &gt; <span className="text-white font-bold">{report.report_id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Tab Switcher */}
          <div className="flex bg-industrial-950 border border-industrial-700 p-0.5">
            <button
              onClick={() => setActiveViewTab('AUDIT')}
              className={`px-2.5 py-1 text-xs font-bold transition ${
                activeViewTab === 'AUDIT' ? 'bg-industrial-800 text-white border border-industrial-600' : 'text-industrial-400 hover:text-white'
              }`}
            >
              BARRIER &amp; SIF AUDIT
            </button>
            <button
              onClick={() => setActiveViewTab('COMMUNICATION')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold transition ${
                activeViewTab === 'COMMUNICATION' ? 'bg-hazard-cyan/20 text-hazard-cyan border border-hazard-cyan/40' : 'text-industrial-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>COMMUNICATION CONSOLE</span>
            </button>
            <button
              onClick={() => setActiveViewTab('10_PARAMS')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold transition ${
                activeViewTab === '10_PARAMS' ? 'bg-hazard-amber/20 text-hazard-amber border border-hazard-amber/40' : 'text-industrial-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>10 PARAMETERS</span>
            </button>
          </div>

          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 transition text-[11px]"
          >
            <Code className="w-3.5 h-3.5 text-hazard-cyan" />
            <span>{showRawJson ? 'HIDE JSON' : 'INSPECT API'}</span>
          </button>
          <button
            onClick={handleCopyReportId}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 transition text-[11px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'COPIED ID!' : 'SHARE'}</span>
          </button>
        </div>
      </div>

      {/* Raw JSON Inspector Overlay */}
      {showRawJson && (
        <div className="p-4 bg-industrial-950 border border-hazard-cyan-border shadow-2xl relative">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-industrial-800 text-hazard-cyan font-bold">
            <span className="flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              SQLITE DATABASE RECORD — 10-PARAMETER SCHEMA
            </span>
            <span className="text-[10px] text-industrial-400">application/json</span>
          </div>
          <pre className="text-[11px] text-emerald-400 bg-industrial-900/90 p-3 overflow-x-auto max-h-72 border border-industrial-800 leading-relaxed font-mono">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}

      {/* Main Investigation Header Panel */}
      <div className="p-4 bg-industrial-900 border border-industrial-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xl font-black text-white tracking-widest">
                {report.report_id}
              </span>
              <span className="px-2 py-0.5 bg-hazard-cyan-dark text-cyan-200 border border-hazard-cyan-border font-bold text-xs">
                UNIT: {report.unit}
              </span>
              <span className="text-sm font-bold text-industrial-200 uppercase tracking-wide">
                {report.equipment_full || report.equipment}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <IndustrialBadge variant="critical" size="sm" pulse={report.severity === 'CRITICAL'}>
                SIF POTENTIAL
              </IndustrialBadge>
              <IndustrialBadge variant="amber" size="sm">
                {report.iogp_rule.toUpperCase()}
              </IndustrialBadge>
              <IndustrialBadge variant="critical" size="sm">
                BARRIER FAILED
              </IndustrialBadge>
              {report.p2h_rating && (
                <span className="px-2 py-0.5 bg-hazard-red-dark text-red-300 border border-hazard-red font-mono font-bold text-xs tracking-wider">
                  {report.p2h_rating}
                </span>
              )}
              <span className="text-industrial-400 text-[11px] ml-2">
                RECORDED: {new Date(report.timestamp).toUTCString()}
              </span>
            </div>
          </div>

          {/* Quick Stats Pill + Safety Inspector Triage Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-industrial-950 p-2.5 border border-industrial-800 lg:self-start">
            <div className="text-center px-2 border-r border-industrial-800">
              <div className="text-[10px] text-industrial-500 uppercase">CLASSIFICATION</div>
              <div className="text-xs font-bold text-hazard-red mt-0.5">
                {report.sif_classification}
              </div>
            </div>
            <div className="text-center px-2 border-r border-industrial-800">
              <div className="text-[10px] text-industrial-500 uppercase">SIF SCORE</div>
              <div className="text-base font-black text-white mt-0.5">
                <span className="text-hazard-red">{sifCalc.score}</span> / 5.0
              </div>
            </div>

            {/* Inspector Status Dropdown */}
            <div className="px-2">
              <div className="text-[10px] text-industrial-500 uppercase mb-0.5">LIFECYCLE STATUS</div>
              <select
                value={report.status || 'Under Investigation'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className="px-2 py-1 bg-industrial-900 border border-industrial-700 text-hazard-cyan font-bold text-xs outline-none focus:border-hazard-cyan"
              >
                <option value="Under Investigation">Under Investigation</option>
                <option value="Corrective Action Assigned">Action Assigned</option>
                <option value="Closed">Closed</option>
                <option value="Verified Closed">Verified Closed (Signed Off)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Large Critical Alert Banner */}
        <div className="mt-4 p-3.5 bg-hazard-red-dark/40 border-2 border-hazard-red shadow-hazard-red">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-hazard-red text-white shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black text-white tracking-widest uppercase">
                  CRITICAL SIF PRECURSOR DETECTED • HIGH POTENTIAL EVENT
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 bg-hazard-red-dark px-2 py-0.5 border border-hazard-red">
                  MAJOR ACCIDENT HAZARD ENVELOPE
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-red-300 font-semibold uppercase">MAPPED IOGP LIFE-SAVING RULE: </span>
                  <span className="text-white font-bold">{report.iogp_rule}</span>
                </div>
                <div>
                  <span className="text-red-300 font-semibold uppercase">CRITICAL CONTROL FAILURE: </span>
                  <span className="text-white font-bold underline decoration-hazard-red underline-offset-2">
                    {report.critical_control_failure || 'Energy isolation verification (DBB + positive blind)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeViewTab === 'COMMUNICATION' ? (
        <div className="space-y-4">
          <div className="p-3 bg-industrial-900 border border-industrial-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-hazard-cyan" />
              <span className="text-white font-bold uppercase">
                INTERACTIVE INVESTIGATION CHAT WITH FIELD WORKER &amp; AI
              </span>
            </div>
            <span className="text-industrial-400 text-[11px]">
              REPORTER: <b className="text-white">{report.created_by_name || 'Rajesh Kumar'}</b> ({report.reporter_role || 'Field Operator'})
            </span>
          </div>

          <ReportChatHub
            report={report}
            currentUser={currentUser}
            onParametersUpdated={(updated) => setReport(updated)}
          />
        </div>
      ) : activeViewTab === '10_PARAMS' ? (
        /* 10-Parameter Detailed Table View */
        <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-hazard-amber" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                10-PARAMETER REFINERY OBSERVATION TAXONOMY SPECIFICATION
              </h3>
            </div>
            <span className="text-industrial-400 text-[10px]">API RP 754 / OSHA PSM 1910.119</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {[
              { num: '01', title: 'Refinery Unit & Location', fields: [
                { k: 'refinery_unit', v: report.parameters?.refinery_unit || report.unit },
                { k: 'process_area', v: report.parameters?.process_area || 'Feed Section' },
                { k: 'equipment', v: report.parameters?.equipment || report.equipment },
                { k: 'specific_location', v: report.parameters?.specific_location || `${report.equipment} Suction Flange` }
              ]},
              { num: '02', title: 'Refinery Activity / Task', fields: [
                { k: 'activity_type', v: report.parameters?.activity_type || report.activity },
                { k: 'task', v: report.parameters?.task || 'Flange opening / maintenance' },
                { k: 'operating_condition', v: report.parameters?.operating_condition || 'Maintenance' },
                { k: 'routine_status', v: report.parameters?.routine_status || 'Non-routine' },
                { k: 'safety_critical_task', v: String(report.parameters?.safety_critical_task ?? true) }
              ]},
              { num: '03', title: 'UA/UC Observation Category', fields: [
                { k: 'ua_uc_type', v: report.parameters?.ua_uc_type || 'Unsafe Act (UA)' },
                { k: 'ua_uc_category', v: report.parameters?.ua_uc_category || 'Isolation/LOTO violation' },
                { k: 'ua_uc_subcategory', v: report.parameters?.ua_uc_subcategory || 'Line unbolting before zero-energy verification' }
              ]},
              { num: '04', title: 'Process Hazard & Mechanism', fields: [
                { k: 'process_hazard', v: report.parameters?.process_hazard || 'High-Pressure Hydrocarbon' },
                { k: 'hazard_mechanism', v: report.parameters?.hazard_mechanism || 'Hydrocarbon Release / Flange Spray' }
              ]},
              { num: '05', title: 'Energy & Exposure Envelope', fields: [
                { k: 'process_material', v: report.parameters?.process_material || 'Diesel' },
                { k: 'energy_source', v: report.parameters?.energy_source || 'Pressure' },
                { k: 'pressure_condition', v: report.parameters?.pressure_condition || 'High Pressure (2–50 bar)' },
                { k: 'temperature_condition', v: report.parameters?.temperature_condition || 'Elevated (>60°C)' },
                { k: 'persons_exposed', v: String(report.parameters?.persons_exposed ?? 2) },
                { k: 'exposure_type', v: report.parameters?.exposure_type || 'Hydrocarbon Exposure' }
              ]},
              { num: '06', title: 'Barrier / Critical Control', fields: [
                { k: 'barrier_type', v: report.parameters?.barrier_type || 'Double Block and Bleed' },
                { k: 'barrier_status', v: report.parameters?.barrier_status || 'Failed' },
                { k: 'critical_control_failure', v: String(report.parameters?.critical_control_failure ?? true) }
              ]},
              { num: '07', title: 'Operating & Human Factors', fields: [
                { k: 'performance_influencing_factor', v: report.parameters?.performance_influencing_factor || 'Turnaround Workload' },
                { k: 'communication_issue', v: String(report.parameters?.communication_issue ?? true) },
                { k: 'supervision_issue', v: String(report.parameters?.supervision_issue ?? false) }
              ]},
              { num: '08', title: 'Actual & Potential Consequence', fields: [
                { k: 'actual_consequence', v: report.parameters?.actual_consequence || 'No Injury' },
                { k: 'potential_consequence', v: report.parameters?.potential_consequence || 'Fatality (SIF)' }
              ]},
              { num: '09', title: 'SIF / High-Potential Mechanism', fields: [
                { k: 'high_potential_event', v: String(report.parameters?.high_potential_event ?? true) },
                { k: 'sif_potential', v: String(report.parameters?.sif_potential ?? true) },
                { k: 'proximity_to_harm', v: `${report.parameters?.proximity_to_harm || 5} / 5 (Direct Line of Fire)` },
                { k: 'sif_mechanism', v: report.parameters?.sif_mechanism || 'High-Pressure Hydrocarbon Release / Line of Fire' }
              ]},
              { num: '10', title: 'Immediate Action & Status', fields: [
                { k: 'immediate_action', v: report.parameters?.immediate_action || 'Work Stopped' },
                { k: 'work_stopped', v: String(report.parameters?.work_stopped ?? true) },
                { k: 'equipment_isolated', v: String(report.parameters?.equipment_isolated ?? true) },
                { k: 'observation_status', v: report.status || 'Under Investigation' }
              ]}
            ].map((pGroup) => (
              <div key={pGroup.num} className="p-3 bg-industrial-950 border border-industrial-800 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-industrial-800">
                  <span className="font-bold text-white font-mono text-[11px]">
                    PARAMETER {pGroup.num}: {pGroup.title.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  {pGroup.fields.map((f) => (
                    <div key={f.k} className="flex items-start justify-between gap-2">
                      <span className="text-industrial-400 font-mono text-[10px] shrink-0">{f.k}:</span>
                      <span className="text-white font-medium text-right break-words">{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default Audit Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Narrative & Causal Pathway */}
          <div className="lg:col-span-7 space-y-4">
            {/* Raw Worker Narrative */}
            <div className="p-4 bg-industrial-900 border border-industrial-800">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-industrial-400" />
                  <h4 className="tech-label text-industrial-200">
                    RAW WORKER NARRATIVE — VERBATIM
                  </h4>
                </div>
                <span className="text-[10px] text-industrial-500 uppercase">
                  UNMODIFIED FIELD CAPTURE
                </span>
              </div>
              <blockquote className="p-3.5 bg-industrial-950 border-l-2 border-industrial-600 text-industrial-200 text-xs font-sans leading-relaxed tracking-normal italic select-text">
                &ldquo;{report.raw_narrative}&rdquo;
              </blockquote>
              {report.reporter_role && (
                <div className="mt-2 text-[10px] text-industrial-500 flex items-center gap-1.5 justify-end">
                  <UserCheck className="w-3 h-3 text-hazard-cyan" />
                  <span>SUBMITTED BY: {report.reporter_role.toUpperCase()} ({report.created_by_name || 'Worker'})</span>
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="p-4 bg-industrial-900 border border-industrial-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-industrial-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-hazard-cyan" />
                  <h4 className="tech-label text-hazard-cyan">
                    AI PROCESS SAFETY SYNTHESIS
                  </h4>
                </div>
                <span className="text-[10px] text-industrial-400">
                  CONFIDENCE: <b className="text-emerald-400">{report.confidence}%</b>
                </span>
              </div>
              <p className="text-xs font-sans text-white leading-relaxed">
                {report.ai_summary}
              </p>
            </div>

            {/* Causal Pathway Flow */}
            <div className="p-4 bg-industrial-900 border border-industrial-800">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-hazard-red" />
                  <h4 className="tech-label text-white">
                    ESCALATION CHAIN &bull; CAUSAL FATALITY PATHWAY
                  </h4>
                </div>
                <span className="text-[10px] text-industrial-400">
                  6-STAGE PROGRESSION
                </span>
              </div>

              <div className="space-y-2">
                {report.causal_pathway.map((stage, idx) => (
                  <div
                    key={stage.step}
                    className={`p-2.5 border text-xs ${
                      stage.isCritical 
                        ? 'bg-industrial-950 border-hazard-red/40 text-white'
                        : 'bg-industrial-950/60 border-industrial-800 text-industrial-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-hazard-cyan text-[10px]">STAGE {stage.step}: {stage.name}</span>
                      {stage.isCritical && (
                        <span className="text-[9px] px-1 bg-hazard-red text-white">CRITICAL STEP</span>
                      )}
                    </div>
                    <p className="font-sans text-[11px]">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Barrier Analysis & SIF Parameters */}
          <div className="lg:col-span-5 space-y-4">
            {/* Barrier Matrix */}
            <div className="p-4 bg-industrial-900 border border-industrial-800">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-hazard-amber" />
                  <h4 className="tech-label text-white">
                    CRITICAL BARRIER ANALYSIS
                  </h4>
                </div>
                <span className="text-[10px] text-industrial-400">DEFENSE IN DEPTH</span>
              </div>

              <div className="space-y-2">
                {report.barriers.map((barrier, idx) => (
                  <div key={idx} className="p-2 bg-industrial-950 border border-industrial-800 flex items-center justify-between text-[11px]">
                    <div>
                      <div className="font-bold text-white">{barrier.name}</div>
                      <div className="text-[10px] text-industrial-400 font-sans">{barrier.observed}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 font-bold text-[9px] uppercase ${
                      barrier.status === 'FAILED' ? 'bg-hazard-red text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {barrier.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SIF Parameter Breakdown */}
            <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-2.5">
              <h4 className="tech-label text-white pb-2 border-b border-industrial-800">
                SIF PARAMETER BREAKDOWN (1-5)
              </h4>
              {[
                { label: 'ENERGY RELEASE POTENTIAL', val: report.sif_parameters.energyReleasePotential },
                { label: 'BARRIER FAILURE DEGREE', val: report.sif_parameters.barrierFailure },
                { label: 'WORKER EXPOSURE HEADCOUNT', val: report.sif_parameters.workerExposure },
                { label: 'HAZARDOUS MATERIAL SEVERITY', val: report.sif_parameters.hazardousMaterial },
                { label: 'LINE BREAKING CRITICALITY', val: report.sif_parameters.lineBreaking },
                { label: 'CONTROL VERIFICATION DEFICIT', val: report.sif_parameters.controlVerification },
                { label: 'PROXIMITY TO HAZARD (P2H)', val: report.sif_parameters.proximityToHazard }
              ].map((p) => (
                <div key={p.label} className="space-y-1 text-[10px]">
                  <div className="flex justify-between text-industrial-300">
                    <span>{p.label}</span>
                    <span className="font-bold text-hazard-cyan">{p.val} / 5</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 h-1.5 bg-industrial-950 p-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`h-full ${s <= p.val ? (p.val >= 5 ? 'bg-hazard-red' : 'bg-hazard-cyan') : 'bg-industrial-800'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Linked Corrective Actions */}
            <div className="p-4 bg-industrial-900 border border-industrial-800">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-hazard-cyan" />
                  <h4 className="tech-label text-white">
                    LINKED CORRECTIVE ACTIONS ({report.corrective_actions.length})
                  </h4>
                </div>
                {onOpenActionTracker && (
                  <button
                    onClick={onOpenActionTracker}
                    className="text-[10px] text-hazard-cyan hover:underline flex items-center gap-1"
                  >
                    <span>TRACKER</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {report.corrective_actions.map((act) => (
                  <div key={act.action_id} className="p-2.5 bg-industrial-950 border border-industrial-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{act.action_id}</span>
                      <span className="px-1.5 py-0.2 bg-hazard-red text-white text-[9px] font-bold uppercase">{act.status}</span>
                    </div>
                    <p className="text-[11px] text-industrial-300 font-sans">{act.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-industrial-500 pt-1 border-t border-industrial-850">
                      <span>OWNER: {act.owner}</span>
                      <span>DUE: {act.due_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
