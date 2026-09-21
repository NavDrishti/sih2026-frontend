import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Minus,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PRECURSOR_PATTERNS, SentinelObservation } from '../../data/sentinelData';

interface PrecursorIntelligenceViewProps {
  observations: SentinelObservation[];
  onSelectObservation: (obs: SentinelObservation) => void;
}

export const PrecursorIntelligenceView: React.FC<PrecursorIntelligenceViewProps> = ({
  observations,
  onSelectObservation
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);

  const activePattern = selectedPatternId
    ? PRECURSOR_PATTERNS.find(p => p.id === selectedPatternId)
    : null;

  const linkedObservations = activePattern
    ? observations.filter(o => activePattern.sampleObservationIds.includes(o.report_id))
    : [];

  return (
    <div className="space-y-6">
      {/* Pattern Cards Stack matching Screenshot 278 */}
      <div className="space-y-4">
        {PRECURSOR_PATTERNS.map((pattern) => {
          const isCritical = pattern.severity === 'Critical';
          const isRising = pattern.trend === 'Rising';
          const isSelected = selectedPatternId === pattern.id;

          return (
            <div
              key={pattern.id}
              onClick={() => setSelectedPatternId(isSelected ? null : pattern.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-[#131f37] hover:shadow-md ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCritical
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-500'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pattern.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      {pattern.description}
                    </p>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-4 pt-2 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {pattern.occurrences} occurrences
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{pattern.sitesCount} sites</span>
                      <span className="text-slate-400">•</span>
                      <span>
                        Related: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{pattern.relatedRule}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badges & Chevron */}
                <div className="flex items-center gap-2.5 shrink-0 self-start">
                  {/* Trend Badge */}
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    isRising ? 'text-red-500' : 'text-slate-500'
                  }`}>
                    {isRising ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    <span>{pattern.trend}</span>
                  </span>

                  {/* Severity Pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {pattern.severity}
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-400 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Linked Observations for Selected Precursor Pattern */}
      {activePattern && (
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Linked Observations: {activePattern.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Incidents contributing to this recurring precursor pattern
              </p>
            </div>
            <button
              onClick={() => setSelectedPatternId(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="space-y-2">
            {linkedObservations.map((obs) => (
              <div
                key={obs.report_id}
                onClick={() => onSelectObservation(obs)}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {obs.report_id}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{obs.site}</span>
                    <span>•</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">Score {obs.sif_score}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                    {obs.ai_summary || obs.raw_narrative}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {obs.activity}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
