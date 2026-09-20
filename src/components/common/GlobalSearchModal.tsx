import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShieldAlert, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SafetyReport } from '../../types/safety';
import { IndustrialBadge } from './IndustrialBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SafetyReport[];
  onSelectReport: (report: SafetyReport) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredReports = normalizedQuery === '' 
    ? reports.slice(0, 5) 
    : reports.filter((r) => {
        return (
          r.report_id.toLowerCase().includes(normalizedQuery) ||
          r.unit.toLowerCase().includes(normalizedQuery) ||
          r.equipment.toLowerCase().includes(normalizedQuery) ||
          (r.equipment_full && r.equipment_full.toLowerCase().includes(normalizedQuery)) ||
          r.activity.toLowerCase().includes(normalizedQuery) ||
          r.iogp_rule.toLowerCase().includes(normalizedQuery) ||
          r.hazards.some(h => h.toLowerCase().includes(normalizedQuery)) ||
          r.raw_narrative.toLowerCase().includes(normalizedQuery) ||
          r.ai_summary.toLowerCase().includes(normalizedQuery) ||
          r.barriers.some(b => b.name.toLowerCase().includes(normalizedQuery) || b.observed.toLowerCase().includes(normalizedQuery)) ||
          r.severity.toLowerCase().includes(normalizedQuery) ||
          r.sif_classification.toLowerCase().includes(normalizedQuery)
        );
      });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-industrial-950 border border-industrial-700 shadow-2xl flex flex-col max-h-[80vh] font-mono z-10">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-industrial-800 bg-industrial-900 flex items-center gap-3">
          <Search className="w-5 h-5 text-hazard-cyan shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search report ID (REF-...), equipment (P-204), unit (DHT), hazard, barrier..."
            className="w-full bg-transparent text-white font-mono text-sm placeholder-industrial-500 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-industrial-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-industrial-800 text-[10px] text-industrial-400 border border-industrial-700">
            ESC
          </kbd>
        </div>

        {/* Quick Filter Suggestion Chips */}
        <div className="px-4 py-2 bg-industrial-900/40 border-b border-industrial-800/80 flex items-center gap-2 overflow-x-auto text-[11px] text-industrial-400">
          <span className="text-[10px] text-industrial-500 uppercase">QUICK SEARCH:</span>
          {['P-204', 'DHT', 'Energy Isolation', 'Line Breaking', 'Barrier Failed', 'Hydrogen'].map(term => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2 py-0.5 bg-industrial-800 hover:bg-industrial-750 border border-industrial-700 text-industrial-300 hover:text-white transition whitespace-nowrap"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-industrial-500 text-xs">
              NO REFINERY OBSERVATIONS MATCHED &quot;{query}&quot;
            </div>
          ) : (
            filteredReports.map((report) => {
              const isCritical = report.severity === 'CRITICAL';
              return (
                <div
                  key={report.report_id}
                  onClick={() => {
                    onSelectReport(report);
                    onClose();
                  }}
                  className={`p-3 border cursor-pointer transition flex items-start justify-between gap-3 ${
                    isCritical
                      ? 'bg-industrial-900/90 border-hazard-red-border hover:border-hazard-red hover:bg-industrial-850'
                      : 'bg-industrial-900/80 border-industrial-800 hover:border-industrial-700 hover:bg-industrial-850'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {report.report_id}
                      </span>
                      <span className="px-1.5 py-0.2 bg-industrial-800 border border-industrial-700 text-hazard-cyan font-bold text-[10px]">
                        {report.unit}
                      </span>
                      <span className="text-[11px] text-industrial-300 font-mono">
                        {report.equipment}
                      </span>
                      {report.sif_potential && (
                        <IndustrialBadge variant="critical" size="xs">
                          SIF POTENTIAL
                        </IndustrialBadge>
                      )}
                      <IndustrialBadge 
                        variant={report.severity === 'CRITICAL' ? 'outline-red' : 'outline-amber'} 
                        size="xs"
                      >
                        {report.iogp_rule}
                      </IndustrialBadge>
                    </div>

                    <p className="text-xs text-industrial-200 font-sans line-clamp-1">
                      {report.ai_summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-industrial-400">
                      <span>ACT: {report.activity}</span>
                      <span>•</span>
                      <span>SCORE: <span className="font-bold text-hazard-red">{report.sif_score}/5</span></span>
                      <span>•</span>
                      <span className="text-industrial-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-industrial-500 group-hover:text-hazard-cyan pt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-industrial-800 bg-industrial-900 flex items-center justify-between text-[10px] text-industrial-500">
          <span>SHOWING {filteredReports.length} MATCHING RECORDS</span>
          <span className="flex items-center gap-1">
            <span>PRESS</span>
            <CornerDownLeft className="w-3 h-3" />
            <span>TO SELECT</span>
          </span>
        </div>
      </div>
    </div>
  );
};
