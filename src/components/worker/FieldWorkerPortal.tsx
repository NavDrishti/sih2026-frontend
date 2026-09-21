import React, { useState } from 'react';
import { 
  PlusCircle, 
  Bell, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  ShieldAlert, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  Flame,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { SafetyReport, UserProfile } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';
import { ReportChatHub } from '../reports/ReportChatHub';

interface FieldWorkerPortalProps {
  currentUser: UserProfile;
  reports: SafetyReport[];
  onOpenNewObservation: () => void;
  onOpenAlerts: () => void;
  onReportUpdated?: (updated: SafetyReport) => void;
}

export const FieldWorkerPortal: React.FC<FieldWorkerPortalProps> = ({
  currentUser,
  reports,
  onOpenNewObservation,
  onOpenAlerts,
  onReportUpdated
}) => {
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(() => {
    return reports.length > 0 ? reports[0] : null;
  });

  const [filterText, setFilterText] = useState('');

  // Filter reports to those relevant to this worker or their assigned unit
  const filteredReports = reports.filter(r => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      r.report_id.toLowerCase().includes(q) ||
      r.unit.toLowerCase().includes(q) ||
      r.equipment.toLowerCase().includes(q) ||
      r.raw_narrative.toLowerCase().includes(q)
    );
  });

  const getLifecycleStep = (report: SafetyReport): number => {
    const status = report.status?.toUpperCase() || 'SUBMITTED';
    if (status.includes('CLOSED')) return 5;
    if (status.includes('ACTION')) return 4;
    if (status.includes('INVESTIGATION')) return 3;
    if (status.includes('TRIAGED') || report.sif_score > 0) return 2;
    return 1;
  };

  const steps = [
    { num: 1, label: 'SUBMITTED' },
    { num: 2, label: 'AI TRIAGED' },
    { num: 3, label: 'INSPECTOR REVIEW' },
    { num: 4, label: 'ACTION ACTIVE' },
    { num: 5, label: 'VERIFIED CLOSED' }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Field Worker Header Card */}
      <div className="p-4 md:p-6 bg-industrial-900 border border-industrial-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hazard-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-hazard-cyan/20 border border-hazard-cyan/40 text-hazard-cyan font-bold text-[10px] tracking-wider uppercase">
                OPERATIONAL FIELD CONSOLE
              </span>
              <span className="text-industrial-400 text-[11px]">
                BADGE: <b className="text-white">{currentUser.badge_id}</b>
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
              {currentUser.name}
            </h1>
            <p className="text-xs text-industrial-300 font-sans">
              {currentUser.title} • Primary Assigned Area: <b className="text-hazard-cyan">{currentUser.unit}</b>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewObservation}
              className="flex items-center gap-2 px-4 py-2.5 bg-hazard-red hover:bg-red-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition border border-red-500 shadow-hazard-red"
            >
              <PlusCircle className="w-4 h-4" />
              <span>REPORT OBSERVATION</span>
            </button>

            <button
              onClick={onOpenAlerts}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-industrial-800 hover:bg-industrial-750 border border-industrial-700 text-industrial-200 transition font-bold"
            >
              <Bell className="w-4 h-4 text-hazard-amber" />
              <span>ALERTS &amp; NOTICES</span>
            </button>
          </div>
        </div>

        {/* Worker Policy Notice Banner */}
        <div className="mt-4 p-2.5 bg-industrial-950/70 border border-industrial-800 flex items-start gap-2.5 text-[11px] text-industrial-300 font-sans">
          <ShieldAlert className="w-4 h-4 text-hazard-cyan shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold font-mono uppercase text-[10px] block">
              STOP WORK AUTHORITY POLICY (IOGP 590 / API RP 754)
            </span>
            As field personnel, you have full authority and obligation to halt any job if isolation is unverified or unexpected pressure/flammable vapor is encountered. Report observations immediately below.
          </div>
        </div>
      </div>

      {/* Main Dual-Column Layout: Left = My Reports List; Right = Selected Report Details & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: My Observations List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 bg-industrial-900 border border-industrial-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-hazard-cyan" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                MY SUBMITTED REPORTS ({filteredReports.length})
              </h3>
            </div>
            <div className="relative w-40">
              <input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full px-2 py-1 bg-industrial-950 border border-industrial-700 text-[11px] text-white placeholder:text-industrial-500 font-sans outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto industrial-scroll pr-1">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center bg-industrial-900/50 border border-industrial-800 text-industrial-400">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-hazard-amber opacity-60" />
                <p className="font-bold">No observations found</p>
                <p className="text-[11px] font-sans mt-1">Click &apos;Report Observation&apos; above to log your first field finding.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isSelected = selectedReport?.report_id === report.report_id;
                const currentStep = getLifecycleStep(report);

                return (
                  <div
                    key={report.report_id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-3 border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-industrial-850 border-hazard-cyan shadow-hazard-cyan/10'
                        : 'bg-industrial-900 hover:bg-industrial-850 border-industrial-800 hover:border-industrial-700'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono text-xs">
                          {report.report_id}
                        </span>
                        <span className="px-1.5 py-0.2 bg-industrial-800 text-cyan-300 text-[10px] border border-industrial-700 font-bold">
                          {report.unit}
                        </span>
                      </div>
                      <IndustrialBadge
                        variant={report.severity === 'CRITICAL' ? 'critical' : report.severity === 'HIGH' ? 'amber' : 'cyan'}
                        size="sm"
                      >
                        {report.sif_classification || report.severity}
                      </IndustrialBadge>
                    </div>

                    {/* Narrative preview */}
                    <p className="font-sans text-xs text-industrial-300 line-clamp-2 leading-relaxed mb-2">
                      {report.raw_narrative}
                    </p>

                    {/* Lifecycle Progress Bar */}
                    <div className="pt-2 border-t border-industrial-800">
                      <div className="flex items-center justify-between text-[10px] text-industrial-400 mb-1">
                        <span>LIFECYCLE STATUS:</span>
                        <span className="text-hazard-cyan font-bold uppercase">
                          {report.status || steps[currentStep - 1].label}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 h-1.5 bg-industrial-950 p-0.5 border border-industrial-800">
                        {steps.map((s) => (
                          <div
                            key={s.num}
                            className={`h-full transition-colors ${
                              s.num <= currentStep
                                ? s.num === 5
                                  ? 'bg-emerald-500'
                                  : 'bg-hazard-cyan'
                                : 'bg-industrial-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Report Inspection & Chat Console */}
        <div className="lg:col-span-7 space-y-4">
          {selectedReport ? (
            <>
              {/* Selected Report Snapshot Panel */}
              <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-industrial-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">
                        {selectedReport.report_id}
                      </span>
                      <span className="px-2 py-0.5 bg-industrial-800 border border-industrial-700 text-cyan-300 text-xs font-bold">
                        UNIT: {selectedReport.unit}
                      </span>
                      <span className="text-industrial-300 font-bold uppercase">
                        {selectedReport.equipment_full || selectedReport.equipment}
                      </span>
                    </div>
                    <p className="text-[11px] text-industrial-400 mt-0.5">
                      Logged on: {selectedReport.timestamp} • Reporter: {selectedReport.created_by_name || currentUser.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-industrial-400 block uppercase">
                      SIF PRECURSOR RATING
                    </span>
                    <span className="text-base font-black text-hazard-red font-mono">
                      {selectedReport.sif_score} / 5.0
                    </span>
                  </div>
                </div>

                {/* Narrative Quote */}
                <div className="p-2.5 bg-industrial-950 border border-industrial-850">
                  <span className="text-[10px] font-bold text-industrial-400 uppercase tracking-wider block mb-1">
                    REPORTED NARRATIVE:
                  </span>
                  <p className="text-xs font-sans text-industrial-200 leading-relaxed">
                    &ldquo;{selectedReport.raw_narrative}&rdquo;
                  </p>
                </div>

                {/* 10-Parameter Key Audit Checklist */}
                {selectedReport.parameters && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-industrial-400 uppercase tracking-wider block mb-2">
                      10-PARAMETER REFINERY SPECIFICATION AUDIT:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2 bg-industrial-950 border border-industrial-850">
                        <span className="text-[9px] text-industrial-500 block uppercase">01. LOCATION</span>
                        <span className="font-bold text-white truncate block">{selectedReport.parameters.refinery_unit || selectedReport.unit}</span>
                      </div>
                      <div className="p-2 bg-industrial-950 border border-industrial-850">
                        <span className="text-[9px] text-industrial-500 block uppercase">02. TASK</span>
                        <span className="font-bold text-white truncate block">{selectedReport.parameters.activity_type || selectedReport.activity}</span>
                      </div>
                      <div className="p-2 bg-industrial-950 border border-industrial-850">
                        <span className="text-[9px] text-industrial-500 block uppercase">03. UA/UC CATEGORY</span>
                        <span className="font-bold text-hazard-amber truncate block">{selectedReport.parameters.ua_uc_category || 'Pending'}</span>
                      </div>
                      <div className="p-2 bg-industrial-950 border border-industrial-850">
                        <span className="text-[9px] text-industrial-500 block uppercase">05. PRESSURE / MATERIAL</span>
                        <span className="font-bold text-white truncate block">{selectedReport.parameters.pressure_condition || 'Unknown'}</span>
                      </div>
                      <div className="p-2 bg-industrial-950 border border-industrial-850">
                        <span className="text-[9px] text-industrial-500 block uppercase">06. BARRIER STATUS</span>
                        <span className={`font-bold truncate block ${selectedReport.parameters.barrier_status === 'Failed' ? 'text-hazard-red' : 'text-emerald-400'}`}>
                          {selectedReport.parameters.barrier_status || 'Not Verified'}
                        </span>
                      </div>
                      <div className="p-2 bg-industrial-950 border border-industrial-850">
                        <span className="text-[9px] text-industrial-500 block uppercase">08. ACTUAL CONSEQUENCE</span>
                        <span className="font-bold text-white truncate block">{selectedReport.parameters.actual_consequence || 'No Injury'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Report Chat Hub */}
              <ReportChatHub
                report={selectedReport}
                currentUser={currentUser}
                onParametersUpdated={(updated) => {
                  setSelectedReport(updated);
                  if (onReportUpdated) onReportUpdated(updated);
                }}
              />
            </>
          ) : (
            <div className="p-12 text-center bg-industrial-900 border border-industrial-800 text-industrial-500">
              <p>Select a report from the list to view lifecycle progress and communicate with the Safety Officer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
