import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  AlertOctagon,
  Bot,
  Check,
  Edit3,
  Clock,
  ShieldCheck,
  Layers,
  ChevronRight,
  Share2,
  Download
} from 'lucide-react';
import { SentinelObservation } from '../../data/sentinelData';

interface ObservationDetailViewProps {
  observation: SentinelObservation;
  onBack: () => void;
  onUpdateStatus?: (obsId: string, newStatus: any) => void;
}

export const ObservationDetailView: React.FC<ObservationDetailViewProps> = ({
  observation,
  onBack,
  onUpdateStatus
}) => {
  const [currentStatus, setCurrentStatus] = useState(observation.review_status || observation.status || 'Under Review');
  const [isCopied, setIsCopied] = useState(false);

  const dateFormatted = new Date(observation.timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleStatusChange = (status: 'Confirmed' | 'Needs Investigation' | 'Escalated') => {
    setCurrentStatus(status);
    if (onUpdateStatus) {
      onUpdateStatus(observation.report_id, status);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#131f37] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {observation.report_id}
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                observation.severity === 'CRITICAL'
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {observation.severity}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                {currentStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {observation.site}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* CRITICAL USER REQUIREMENT: Separate Actual Outcome from Potential Outcome! */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actual Outcome Banner */}
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              ACTUAL OUTCOME
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
              Physical Event
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
            {observation.actual_outcome || 'Near Miss (No Injury)'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Immediate real-world consequence observed. Work halted or intervention prevented physical injury on site.
          </p>
        </div>

        {/* Potential Outcome Banner */}
        <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              POTENTIAL OUTCOME &bull; SIF POTENTIAL
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
              Score: {observation.sif_score} / 100
            </span>
          </div>
          <div className="text-lg font-bold text-red-700 dark:text-red-400 mt-1.5">
            {observation.potential_outcome || 'Fatal Injury'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {observation.potential_consequence || 'Severe bodily harm or fatality had the remaining barrier failed.'}
          </p>
        </div>
      </div>

      {/* Raw Narrative Box */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ORIGINAL RAW SAFETY REPORT
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          "{observation.raw_narrative}"
        </p>
      </div>

      {/* AI Extracted Fields & SIF Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Extracted Parameters (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI STRUCTURED EXTRACTION
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Activity</span>
              <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                {observation.activity}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Life-Saving Rule</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {observation.iogp_rule}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Equipment / Tag</span>
              <span className="font-bold text-slate-900 dark:text-white mt-1 block truncate">
                {observation.equipment || 'P-301'}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Process Hazard & Energy</span>
              <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                {observation.hazards.join(' • ')}
              </span>
            </div>
          </div>

          {/* Critical Barrier Failures */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              CRITICAL BARRIER STATUS
            </span>
            <div className="space-y-2">
              {observation.barriers.map((barrier, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {barrier.name} ({barrier.controlType || 'Safeguard'})
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Observed: {barrier.observed}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    barrier.status === 'FAILED'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                      : barrier.status === 'WARNING' || barrier.status === 'NOT_VERIFIED'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}>
                    {barrier.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5x5 Visual Risk Matrix (1 Col) */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              5×5 RISK MATRIX
            </h3>
            <span className="text-xs font-mono font-bold text-red-500">
              Severity: 5 | Prob: 4
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[10px] text-center font-bold">
            {/* 5x5 grid simulation with marker */}
            {[5, 4, 3, 2, 1].map((row) =>
              [1, 2, 3, 4, 5].map((col) => {
                const isTarget = row === 5 && col === 4;
                const score = row * col;
                const bg =
                  score >= 15
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                    : score >= 8
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`h-9 rounded flex items-center justify-center relative ${bg} ${
                      isTarget ? 'ring-2 ring-red-600 shadow-md scale-105 z-10 bg-red-600 text-white font-extrabold' : ''
                    }`}
                  >
                    {isTarget ? '★' : ''}
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            ★ Current Incident: Critical SIF Risk Envelope
          </div>

          {/* Precursor Tags */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              RECURRING PRECURSOR TAGS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {observation.precursor_tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
                >
                  ⚠ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Human Review Bottom Bar */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Human Review Decision
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit and confirm AI classification for enterprise HSE reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleStatusChange('Confirmed')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentStatus === 'Confirmed'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm</span>
          </button>

          <button
            onClick={() => handleStatusChange('Needs Investigation')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentStatus === 'Needs Investigation'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Needs Investigation</span>
          </button>

          <button
            onClick={() => handleStatusChange('Escalated')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentStatus === 'Escalated'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Escalate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
