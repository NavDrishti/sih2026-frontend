import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  ExternalLink,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { SafetyReport, SeverityLevel } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface LiveFeedViewProps {
  reports: SafetyReport[];
  onSelectReport: (report: SafetyReport) => void;
  initialFilter?: string;
}

export const LiveFeedView: React.FC<LiveFeedViewProps> = ({
  reports,
  onSelectReport,
  initialFilter = 'All'
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);

  const filters = [
    'All',
    'Critical',
    'SIF Potential',
    'Near Miss',
    'Unsafe Act',
    'Unsafe Condition',
    'Barrier Failure',
    'Energy Isolation',
    'Hot Work',
    'Confined Space',
    'Line Breaking'
  ];

  const filteredReports = reports.filter((report) => {
    // Text search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = 
        report.report_id.toLowerCase().includes(q) ||
        report.unit.toLowerCase().includes(q) ||
        report.equipment.toLowerCase().includes(q) ||
        report.raw_narrative.toLowerCase().includes(q) ||
        report.ai_summary.toLowerCase().includes(q) ||
        report.iogp_rule.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category filter
    switch (activeFilter) {
      case 'Critical':
        return report.severity === 'CRITICAL';
      case 'SIF Potential':
        return report.sif_potential;
      case 'Near Miss':
        return report.report_types.includes('Near Miss');
      case 'Unsafe Act':
        return report.report_types.includes('UA');
      case 'Unsafe Condition':
        return report.report_types.includes('UC');
      case 'Barrier Failure':
        return report.barriers.some(b => b.status === 'FAILED');
      case 'Energy Isolation':
        return report.iogp_rule === 'Energy Isolation';
      case 'Hot Work':
        return report.iogp_rule === 'Hot Work';
      case 'Confined Space':
        return report.iogp_rule === 'Confined Space';
      case 'Line Breaking':
        return report.activity === 'Line Breaking';
      case 'All':
      default:
        return true;
    }
  });

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* Feed Control Bar */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-hazard-red animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-widest uppercase">
              REAL-TIME SAFETY OBSERVATION FEED
            </h2>
          </div>
          <span className="px-2 py-0.5 bg-hazard-red-dark text-red-200 border border-hazard-red text-[10px] font-bold">
            STREAM ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-industrial-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed observations..."
              className="w-full bg-industrial-950 border border-industrial-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-industrial-500 focus:outline-hidden focus:border-industrial-600 font-mono"
            />
          </div>
          <button
            onClick={() => setIsSimulatingLive(!isSimulatingLive)}
            className={`px-2.5 py-1.5 border text-[11px] font-mono flex items-center gap-1.5 transition ${
              isSimulatingLive
                ? 'bg-industrial-800 text-hazard-cyan border-industrial-700'
                : 'bg-industrial-950 text-industrial-400 border-industrial-800'
            }`}
            title="Toggle simulated real-time stream pulse"
          >
            <RefreshCw className={`w-3 h-3 ${isSimulatingLive ? 'animate-spin' : ''}`} />
            <span>{isSimulatingLive ? 'AUTO-SYNC' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar (Section 6) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition border ${
                isActive
                  ? 'bg-hazard-red text-white border-red-500 font-bold shadow-hazard-red'
                  : 'bg-industrial-900 hover:bg-industrial-850 text-industrial-300 border-industrial-800'
              }`}
            >
              {f}
              {f === 'Critical' && (
                <span className="ml-1.5 px-1 py-0.2 bg-black/40 text-white text-[9px]">
                  {reports.filter(r => r.severity === 'CRITICAL').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feed Cards Stream */}
      <div className="space-y-2.5">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center bg-industrial-900 border border-industrial-800 text-industrial-500">
            NO OBSERVATIONS MATCH ACTIVE FILTER CRITERIA
          </div>
        ) : (
          filteredReports.map((report) => {
            const isCritical = report.severity === 'CRITICAL';
            const isHigh = report.severity === 'HIGH';
            const timeFormatted = new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={report.report_id}
                onClick={() => onSelectReport(report)}
                className={`p-4 border transition cursor-pointer relative group flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${
                  isCritical
                    ? 'bg-industrial-900/90 border-hazard-red-border hover:border-hazard-red shadow-[inset_3px_0_0_0_#ef4444]'
                    : isHigh
                    ? 'bg-industrial-900/80 border-hazard-amber-border/80 hover:border-hazard-amber shadow-[inset_3px_0_0_0_#f59e0b]'
                    : 'bg-industrial-900/70 border-industrial-800 hover:border-industrial-700 shadow-[inset_3px_0_0_0_#06b6d4]'
                }`}
              >
                {/* Left Block: Identity, Unit, Equipment, Tags */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-wider">
                      {report.report_id}
                    </span>
                    <span className="text-industrial-500 font-mono text-xs">
                      {timeFormatted} UTC
                    </span>
                    <span className="px-2 py-0.5 bg-industrial-800 border border-industrial-700 text-hazard-cyan font-bold text-xs">
                      {report.unit}
                    </span>
                    <span className="text-xs font-semibold text-industrial-200">
                      {report.equipment_full || report.equipment}
                    </span>
                  </div>

                  {/* Badges / Tags (Section 6) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {report.sif_potential && (
                      <IndustrialBadge variant="critical" size="xs">
                        SIF POTENTIAL
                      </IndustrialBadge>
                    )}
                    <IndustrialBadge variant="amber" size="xs">
                      {report.iogp_rule.toUpperCase()}
                    </IndustrialBadge>
                    {report.barriers.some(b => b.status === 'FAILED') && (
                      <IndustrialBadge variant="critical" size="xs">
                        BARRIER FAILED
                      </IndustrialBadge>
                    )}
                    {report.p2h_rating && (
                      <span className="px-1.5 py-0.2 bg-hazard-red-dark text-red-200 border border-hazard-red text-[10px] font-bold">
                        {report.p2h_rating}
                      </span>
                    )}
                    <span className="text-[10px] text-industrial-400 font-mono">
                      ACTIVITY: {report.activity.toUpperCase()}
                    </span>
                  </div>

                  {/* Short AI Summary (Section 6) */}
                  <p className="text-xs text-industrial-100 font-sans font-medium leading-relaxed bg-industrial-950/60 p-2.5 border border-industrial-850">
                    &ldquo;{report.ai_summary}&rdquo;
                  </p>
                </div>

                {/* Right Block: Status, SIF Score, Drilldown CTA */}
                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-1 border-t md:border-t-0 border-industrial-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'bg-hazard-red text-white'
                        : isHigh
                        ? 'bg-hazard-amber text-black'
                        : 'bg-hazard-cyan-dark text-cyan-200 border border-hazard-cyan-border'
                    }`}>
                      {report.severity}
                    </span>
                    <div className="text-right">
                      <div className="text-[9px] text-industrial-500 uppercase">SCORE</div>
                      <div className="font-mono font-black text-sm text-hazard-red leading-none">
                        {report.sif_score}/5
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-hazard-cyan group-hover:text-white transition font-mono mt-2">
                    <span>INVESTIGATE</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
