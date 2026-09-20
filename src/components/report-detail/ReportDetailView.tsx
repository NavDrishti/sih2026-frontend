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
  ExternalLink
} from 'lucide-react';
import { SafetyReport, CorrectiveAction } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';
import { calculateSIFScore } from '../../services/sifScoringService';

interface ReportDetailViewProps {
  report: SafetyReport;
  onBack: () => void;
  onNavigateReport?: (reportId: string) => void;
  onOpenActionTracker?: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onBack,
  onOpenActionTracker
}) => {
  const [whyFlaggedExpanded, setWhyFlaggedExpanded] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const sifCalc = calculateSIFScore(report.sif_parameters);

  const handleCopyReportId = () => {
    navigator.clipboard.writeText(report.report_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 transition text-[11px]"
          >
            <Code className="w-3.5 h-3.5 text-hazard-cyan" />
            <span>{showRawJson ? 'HIDE JSON' : 'INSPECT API JSON'}</span>
          </button>
          <button
            onClick={handleCopyReportId}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 transition text-[11px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'COPIED ID!' : 'SHARE ID'}</span>
          </button>
        </div>
      </div>

      {/* Raw JSON Inspector Overlay */}
      {showRawJson && (
        <div className="p-4 bg-industrial-950 border border-hazard-cyan-border shadow-2xl relative">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-industrial-800 text-hazard-cyan font-bold">
            <span className="flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              BACKEND API DATA STRUCTURE — SCHEMA SPECIFICATION
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

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-industrial-950 p-2.5 border border-industrial-800 lg:self-start">
            <div className="text-center px-2 border-r border-industrial-800">
              <div className="text-[10px] text-industrial-500 uppercase">CLASSIFICATION</div>
              <div className="text-xs font-bold text-hazard-red mt-0.5">
                {report.sif_classification}
              </div>
            </div>
            <div className="text-center px-2">
              <div className="text-[10px] text-industrial-500 uppercase">SIF SCORE</div>
              <div className="text-base font-black text-white mt-0.5">
                <span className="text-hazard-red">{sifCalc.score}</span> / 5.0
              </div>
            </div>
          </div>
        </div>

        {/* Large Critical Alert Banner (Section 7) */}
        <div className="mt-4 p-3.5 bg-hazard-red-dark/40 border-2 border-hazard-red shadow-hazard-red">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-hazard-red text-white shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black text-white tracking-widest uppercase">
                  CRITICAL SIF PRECURSOR DETECTED
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 bg-hazard-red-dark px-2 py-0.5 border border-hazard-red">
                  HIGH SEVERITY BARRIER BREACH
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
                    {report.critical_control_failure || 'Energy isolation verification (DBB + zero energy proof)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Investigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Narrative & Causal Pathway (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* RAW WORKER NARRATIVE — VERBATIM (Section 8) */}
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
                <span>SUBMITTED BY: {report.reporter_role.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* AI ONE-LINE SUMMARY (Section 9) */}
          <div className="p-4 bg-industrial-900 border border-industrial-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-industrial-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-hazard-cyan" />
                <h4 className="tech-label text-hazard-cyan">
                  AI ONE-LINE SUMMARY
                </h4>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-industrial-400">EXTRACTION CONFIDENCE:</span>
                <span className="font-bold text-hazard-cyan bg-industrial-950 px-2 py-0.5 border border-hazard-cyan-border">
                  {report.confidence}%
                </span>
              </div>
            </div>
            <p className="text-xs text-industrial-100 font-sans font-medium leading-relaxed bg-industrial-950/80 p-3 border border-industrial-800">
              {report.ai_summary}
            </p>
          </div>

          {/* AI CAUSAL FATALITY PATHWAY (Section 10) */}
          <div className="p-4 bg-industrial-900 border border-industrial-800">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-hazard-red" />
                <h4 className="tech-label text-white">
                  AI CAUSAL FATALITY PATHWAY
                </h4>
              </div>
              <span className="text-[10px] text-industrial-400 uppercase">
                VERTICAL PRECURSOR SEQUENCE
              </span>
            </div>

            <div className="space-y-2">
              {report.causal_pathway.map((stage, idx) => {
                const isCritical = stage.isCritical;
                const isLast = idx === report.causal_pathway.length - 1;

                return (
                  <div key={stage.step} className="relative">
                    <div
                      className={`p-3 border transition-all ${
                        isCritical
                          ? 'bg-industrial-950 border-hazard-red/80 shadow-[inset_3px_0_0_0_#ef4444]'
                          : 'bg-industrial-950 border-industrial-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs px-1.5 py-0.2 ${
                            isCritical ? 'bg-hazard-red text-white' : 'bg-industrial-800 text-industrial-300'
                          }`}>
                            {stage.step}
                          </span>
                          <span className={`font-bold tracking-wider text-xs ${
                            isCritical ? 'text-hazard-red' : 'text-industrial-300'
                          }`}>
                            {stage.name}
                          </span>
                        </div>
                        {isCritical && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-hazard-red-dark text-red-200 border border-hazard-red font-semibold">
                            CRITICAL MECHANISM
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-industrial-200 font-sans pl-7 leading-snug">
                        {stage.description}
                      </p>
                    </div>

                    {!isLast && (
                      <div className="flex justify-center py-1">
                        <span className="text-industrial-600 font-bold text-xs select-none">
                          ↓
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Barrier Matrix, SIF Scoring, AI Reasoning (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* CRITICAL BARRIER ANALYSIS TABLE (Section 11) */}
          <div className="p-4 bg-industrial-900 border border-industrial-800">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-hazard-amber" />
                <h4 className="tech-label text-white">
                  CRITICAL BARRIER ANALYSIS
                </h4>
              </div>
              <span className="text-[10px] text-industrial-400">
                DEFENSE-IN-DEPTH MATRIX
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-industrial-800 bg-industrial-950 text-industrial-400 text-[10px] uppercase tracking-wider">
                    <th className="p-2">CONTROL / BARRIER</th>
                    <th className="p-2">EXPECTED</th>
                    <th className="p-2">OBSERVED</th>
                    <th className="p-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-800 text-[11px]">
                  {report.barriers.map((barrier, idx) => {
                    const isFailed = barrier.status === 'FAILED';
                    const isWarning = barrier.status === 'WARNING';
                    const isVerified = barrier.status === 'VERIFIED';

                    return (
                      <tr 
                        key={idx} 
                        className={`transition-colors ${
                          isFailed 
                            ? 'bg-hazard-red-dark/15 hover:bg-hazard-red-dark/25' 
                            : isWarning 
                            ? 'bg-hazard-amber-dark/15 hover:bg-hazard-amber-dark/25'
                            : 'hover:bg-industrial-850'
                        }`}
                      >
                        <td className="p-2 font-bold text-industrial-200">
                          {barrier.name}
                        </td>
                        <td className="p-2 text-industrial-400">
                          {barrier.expected}
                        </td>
                        <td className="p-2 text-industrial-300 font-sans text-[11px]">
                          {barrier.observed}
                        </td>
                        <td className="p-2 text-right">
                          {isFailed && (
                            <span className="px-1.5 py-0.5 bg-hazard-red text-white font-bold text-[10px] border border-red-500">
                              FAILED
                            </span>
                          )}
                          {isWarning && (
                            <span className="px-1.5 py-0.5 bg-hazard-amber text-black font-bold text-[10px]">
                              WARNING
                            </span>
                          )}
                          {isVerified && (
                            <span className="px-1.5 py-0.5 bg-hazard-green-dark text-emerald-300 border border-hazard-green-border font-bold text-[10px]">
                              VERIFIED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SIF SCORING BREAKDOWN (Section 12) */}
          <div className="p-4 bg-industrial-900 border border-industrial-800">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-industrial-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-hazard-red" />
                <h4 className="tech-label text-white">
                  SIF PRECURSOR SCORING MATRIX
                </h4>
              </div>
              <span className="text-[10px] text-industrial-400">
                MULTI-FACTOR ALGORITHM
              </span>
            </div>

            {/* Overall Score Box */}
            <div className="p-3 bg-industrial-950 border border-hazard-red-border flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] text-industrial-400 uppercase tracking-wider">
                  OVERALL SIF PRECURSOR SCORE
                </div>
                <div className="text-xl font-black text-white mt-0.5">
                  <span className="text-hazard-red">{sifCalc.score}</span> / 5.0
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-industrial-400 uppercase tracking-wider">
                  CLASSIFICATION
                </div>
                <div className="text-xs font-bold text-hazard-red uppercase tracking-wider mt-0.5">
                  {sifCalc.classification}
                </div>
              </div>
            </div>

            {/* Individual Parameters */}
            <div className="space-y-2 text-[11px]">
              {[
                { label: 'ENERGY RELEASE POTENTIAL', val: report.sif_parameters.energyReleasePotential },
                { label: 'BARRIER FAILURE', val: report.sif_parameters.barrierFailure },
                { label: 'WORKER EXPOSURE', val: report.sif_parameters.workerExposure },
                { label: 'HAZARDOUS MATERIAL', val: report.sif_parameters.hazardousMaterial },
                { label: 'LINE BREAKING', val: report.sif_parameters.lineBreaking },
                { label: 'CONTROL VERIFICATION', val: report.sif_parameters.controlVerification },
                { label: 'PROXIMITY TO HAZARD', val: report.sif_parameters.proximityToHazard },
              ].map((param) => {
                const isMax = param.val >= 5;
                const isHigh = param.val >= 4;

                return (
                  <div key={param.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-industrial-300 font-mono text-[10px]">
                        {param.label}
                      </span>
                      <span className={`font-bold font-mono ${
                        isMax ? 'text-hazard-red' : isHigh ? 'text-hazard-amber' : 'text-hazard-cyan'
                      }`}>
                        {param.val} / 5
                      </span>
                    </div>
                    {/* 5-segment indicator bar */}
                    <div className="grid grid-cols-5 gap-1 h-1.5">
                      {[1, 2, 3, 4, 5].map((seg) => {
                        const isFilled = seg <= param.val;
                        let fillBg = 'bg-industrial-800';
                        if (isFilled) {
                          if (param.val >= 5) fillBg = 'bg-hazard-red';
                          else if (param.val >= 4) fillBg = 'bg-hazard-amber';
                          else fillBg = 'bg-hazard-cyan';
                        }
                        return <div key={seg} className={`h-full ${fillBg}`} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIF SCORING EXPLANATION (Section 13) */}
          <div className="p-4 bg-industrial-900 border border-industrial-800">
            <button
              onClick={() => setWhyFlaggedExpanded(!whyFlaggedExpanded)}
              className="w-full flex items-center justify-between pb-2 border-b border-industrial-800 text-left"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-hazard-amber" />
                <h4 className="tech-label text-industrial-100">
                  WHY WAS THIS REPORT FLAGGED?
                </h4>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-industrial-400">
                <span>{whyFlaggedExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
                {whyFlaggedExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {whyFlaggedExpanded && (
              <div className="pt-3 space-y-3">
                <div className="space-y-1.5">
                  {report.why_flagged.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-sans text-industrial-200">
                      <span className="text-hazard-cyan font-mono font-bold shrink-0 mt-0.5">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-hazard-amber-dark/20 border border-hazard-amber-border">
                  <div className="text-[10px] font-bold uppercase text-hazard-amber mb-0.5">
                    PRIMARY ESCALATION TRIGGER:
                  </div>
                  <p className="text-xs font-sans text-amber-100 font-medium">
                    &ldquo;{report.primary_escalation_trigger}&rdquo;
                  </p>
                </div>
              </div>
            )}
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
                  <span>ACTION TRACKER</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {report.corrective_actions.map((act) => (
                <div
                  key={act.action_id}
                  className="p-2.5 bg-industrial-950 border border-industrial-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">
                      {act.action_id}
                    </span>
                    <span className={`px-1.5 py-0.2 font-bold text-[9px] uppercase ${
                      act.status === 'OPEN'
                        ? 'bg-hazard-red text-white'
                        : act.status === 'IN PROGRESS'
                        ? 'bg-hazard-amber text-black'
                        : 'bg-industrial-800 text-industrial-300'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-industrial-300 font-sans">
                    {act.description}
                  </p>
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
    </div>
  );
};
