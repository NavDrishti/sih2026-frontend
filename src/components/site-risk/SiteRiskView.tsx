import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Filter, 
  AlertTriangle, 
  ChevronRight, 
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { RefineryUnit, ActivityType, SafetyReport, HeatmapCell } from '../../types/safety';
import { MOCK_UNIT_RISK_SUMMARIES, MOCK_HEATMAP_DATA } from '../../data/mockRefineryData';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface SiteRiskViewProps {
  onSelectUnit: (unit: RefineryUnit) => void;
  onSelectReport: (report: SafetyReport) => void;
  reports: SafetyReport[];
}

export const SiteRiskView: React.FC<SiteRiskViewProps> = ({
  onSelectUnit,
  onSelectReport,
  reports
}) => {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<RefineryUnit | 'ALL'>('ALL');

  const units: RefineryUnit[] = [
    'DHT', 'FCC', 'SRU', 'CDU', 'Tank Farm', 'Hydrocracker', 'VDU', 'NHT'
  ];

  const activities: ActivityType[] = [
    'Startup',
    'Shutdown',
    'Maintenance',
    'Line Breaking',
    'Hot Work',
    'Confined Space Entry',
    'Lifting',
    'Routine Operations'
  ];

  // Map cell for quick lookup
  const getCell = (unit: RefineryUnit, activity: ActivityType): HeatmapCell => {
    return (
      MOCK_HEATMAP_DATA.find((c) => c.unit === unit && c.activity === activity) || {
        unit,
        activity,
        score: 1,
        observation_count: 0,
        sif_precursor_count: 0,
        top_failed_barrier: 'None',
        common_iogp_rule: 'Energy Isolation'
      }
    );
  };

  const getSeverityStyle = (score: number) => {
    switch (score) {
      case 5:
        return 'bg-hazard-red text-white border-hazard-red shadow-hazard-red font-black animate-pulse';
      case 4:
        return 'bg-amber-600 text-white border-amber-500 font-bold';
      case 3:
        return 'bg-amber-950/80 text-amber-300 border-hazard-amber-border font-semibold';
      case 2:
        return 'bg-industrial-800 text-hazard-cyan border-industrial-700';
      case 1:
      default:
        return 'bg-industrial-950 text-industrial-600 border-industrial-850';
    }
  };

  const activeInspection = hoveredCell || selectedCell;

  // Filtered reports when a cell or unit is clicked
  const drilldownReports = reports.filter((r) => {
    if (selectedCell) {
      return r.unit === selectedCell.unit && r.activity === selectedCell.activity;
    }
    if (selectedUnitFilter !== 'ALL') {
      return r.unit === selectedUnitFilter;
    }
    return true;
  });

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* View Header */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-hazard-red" />
            <h2 className="text-base font-bold text-white tracking-widest uppercase">
              REFINERY SITE RISK RANKING & HAZARD MATRIX
            </h2>
          </div>
          <p className="text-xs text-industrial-400 font-sans mt-0.5">
            Unit-level SIF precursor density analysis across high-consequence operational activities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-industrial-400">
            <span className="text-industrial-500 uppercase">HEATMAP LEGEND:</span>
            <span className="px-1.5 py-0.2 bg-industrial-950 text-industrial-600 border border-industrial-850">1 LOW</span>
            <span className="px-1.5 py-0.2 bg-industrial-800 text-hazard-cyan border border-industrial-700">2 MOD</span>
            <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-hazard-amber-border">3 ELEV</span>
            <span className="px-1.5 py-0.2 bg-amber-600 text-white font-bold">4 HIGH</span>
            <span className="px-1.5 py-0.2 bg-hazard-red text-white font-black animate-pulse">5 CRIT</span>
          </div>
        </div>
      </div>

      {/* UNIT × ACTIVITY RISK HEATMAP (Section 15) */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-hazard-cyan" />
            <h3 className="tech-label text-white">
              8 × 8 REFINERY UNIT × ACTIVITY RISK HEATMAP
            </h3>
          </div>
          <span className="text-[10px] text-industrial-400">
            CLICK CELL TO FILTER OBSERVATIONS
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse select-none min-w-[760px]">
            <thead>
              <tr className="border-b border-industrial-800 text-[10px] text-industrial-400">
                <th className="p-2 text-left font-mono font-bold uppercase w-28 bg-industrial-950">
                  UNIT \ ACTIVITY
                </th>
                {activities.map((act) => (
                  <th key={act} className="p-2 text-center font-mono font-medium uppercase tracking-wider bg-industrial-950/60">
                    {act}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850 text-xs font-mono">
              {units.map((unit) => (
                <tr key={unit} className="hover:bg-industrial-850/50 transition">
                  <td className="p-2 font-bold text-white bg-industrial-950 border-r border-industrial-800">
                    <button
                      onClick={() => {
                        setSelectedUnitFilter(unit);
                        setSelectedCell(null);
                      }}
                      className="hover:text-hazard-cyan flex items-center gap-1 transition text-left"
                    >
                      <span>{unit}</span>
                      <ArrowUpRight className="w-3 h-3 text-industrial-500 opacity-0 group-hover:opacity-100" />
                    </button>
                  </td>
                  {activities.map((act) => {
                    const cell = getCell(unit, act);
                    const isSelected = selectedCell?.unit === unit && selectedCell?.activity === act;
                    return (
                      <td key={act} className="p-1 text-center">
                        <button
                          onClick={() => setSelectedCell(cell)}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-full py-2.5 px-1 border transition-all flex flex-col items-center justify-center ${getSeverityStyle(
                            cell.score
                          )} ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                        >
                          <span className="text-xs font-bold leading-none">{cell.score}</span>
                          <span className="text-[9px] opacity-75 leading-none mt-0.5">
                            {cell.sif_precursor_count} SIF
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap Cell Inspector Banner */}
        {activeInspection && (
          <div className="p-3 bg-industrial-950 border border-hazard-cyan-border shadow-safety-cyan flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-industrial-900 border border-industrial-700 text-hazard-cyan font-black text-sm">
                {activeInspection.score} / 5
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    {activeInspection.unit} • {activeInspection.activity.toUpperCase()}
                  </span>
                  <IndustrialBadge 
                    variant={activeInspection.score >= 4 ? 'critical' : activeInspection.score >= 3 ? 'amber' : 'cyan'} 
                    size="xs"
                  >
                    RISK LEVEL {activeInspection.score}
                  </IndustrialBadge>
                </div>
                <div className="text-[11px] text-industrial-300 flex flex-wrap items-center gap-3">
                  <span>TOTAL OBS: <strong className="text-white">{activeInspection.observation_count}</strong></span>
                  <span>•</span>
                  <span>SIF PRECURSORS: <strong className="text-hazard-red">{activeInspection.sif_precursor_count}</strong></span>
                  <span>•</span>
                  <span>COMMON RULE: <strong className="text-hazard-amber">{activeInspection.common_iogp_rule}</strong></span>
                </div>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <div className="text-industrial-400 text-[10px] uppercase">TOP FAILED BARRIER</div>
              <div className="text-hazard-red font-bold underline decoration-hazard-red underline-offset-2">
                {activeInspection.top_failed_barrier}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REFINERY RISK-RANKING TABLE (Section 14) */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-hazard-red" />
            <h3 className="tech-label text-white">
              REFINERY UNIT RISK RANKING
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {selectedUnitFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedUnitFilter('ALL')}
                className="px-2 py-0.5 bg-industrial-800 hover:bg-industrial-750 text-hazard-cyan border border-industrial-700 text-[10px]"
              >
                RESET UNIT FILTER ({selectedUnitFilter})
              </button>
            )}
            <span className="text-[10px] text-industrial-400">
              SORTED BY SIF PRECURSOR DENSITY
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-industrial-800 bg-industrial-950 text-industrial-400 text-[10px] uppercase tracking-wider">
                <th className="p-2.5">UNIT</th>
                <th className="p-2.5 text-center">OBSERVATIONS</th>
                <th className="p-2.5 text-center">SIF PRECURSORS</th>
                <th className="p-2.5 text-center">CRITICAL FAILURES</th>
                <th className="p-2.5 text-center">OPEN ACTIONS</th>
                <th className="p-2.5">DOMINANT HAZARD</th>
                <th className="p-2.5 text-center">TREND</th>
                <th className="p-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850 text-xs">
              {MOCK_UNIT_RISK_SUMMARIES.map((u, idx) => {
                const isSelected = selectedUnitFilter === u.unit;
                return (
                  <tr
                    key={u.unit}
                    onClick={() => {
                      setSelectedUnitFilter(u.unit);
                      setSelectedCell(null);
                    }}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-industrial-850 border-l-4 border-hazard-red'
                        : 'hover:bg-industrial-850/60'
                    }`}
                  >
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-industrial-500 font-bold text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-xs">{u.unit}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-center font-mono text-industrial-300">
                      {u.observations}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-hazard-red">
                      {u.sif_precursors}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-amber-400">
                      {u.critical_failures}
                    </td>
                    <td className="p-2.5 text-center font-mono text-industrial-200">
                      {u.open_actions}
                    </td>
                    <td className="p-2.5 font-sans text-industrial-300 text-[11px]">
                      {u.dominant_hazard}
                    </td>
                    <td className="p-2.5 text-center">
                      {u.trend === 'UP' && (
                        <span className="inline-flex items-center gap-0.5 text-hazard-red font-bold text-[10px]">
                          <TrendingUp className="w-3 h-3" />
                          <span>UP</span>
                        </span>
                      )}
                      {u.trend === 'DOWN' && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold text-[10px]">
                          <TrendingDown className="w-3 h-3" />
                          <span>DOWN</span>
                        </span>
                      )}
                      {u.trend === 'STABLE' && (
                        <span className="inline-flex items-center gap-0.5 text-industrial-400 font-bold text-[10px]">
                          <Minus className="w-3 h-3" />
                          <span>STABLE</span>
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUnit(u.unit);
                        }}
                        className="px-2 py-0.5 bg-industrial-800 hover:bg-industrial-750 text-hazard-cyan border border-industrial-700 text-[10px] font-mono transition"
                      >
                        FILTER FEED &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drilldown Reports Panel */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-hazard-cyan" />
            <h3 className="tech-label text-white">
              FILTERED SIF OBSERVATIONS ({drilldownReports.length})
            </h3>
            {selectedCell && (
              <span className="px-2 py-0.5 bg-industrial-800 text-hazard-cyan text-[10px]">
                CELL: {selectedCell.unit} / {selectedCell.activity}
              </span>
            )}
            {!selectedCell && selectedUnitFilter !== 'ALL' && (
              <span className="px-2 py-0.5 bg-industrial-800 text-hazard-cyan text-[10px]">
                UNIT: {selectedUnitFilter}
              </span>
            )}
          </div>
          <span className="text-[10px] text-industrial-400">
            CLICK ANY OBSERVATION TO OPEN DETAILED INVESTIGATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {drilldownReports.map((report) => (
            <div
              key={report.report_id}
              onClick={() => onSelectReport(report)}
              className="p-3 bg-industrial-950 border border-industrial-800 hover:border-hazard-red transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs group-hover:text-hazard-cyan transition">
                  {report.report_id}
                </span>
                <span className="px-1.5 py-0.2 bg-hazard-red-dark text-red-200 border border-hazard-red font-bold text-[9px]">
                  SCORE {report.sif_score}/5
                </span>
              </div>

              <div className="text-[11px] text-industrial-400 font-mono">
                {report.unit} • {report.equipment} • {report.activity}
              </div>

              <p className="text-xs text-industrial-200 font-sans line-clamp-2 leading-relaxed">
                {report.ai_summary}
              </p>

              <div className="pt-2 border-t border-industrial-850 flex items-center justify-between text-[10px] text-industrial-400">
                <span className="text-hazard-amber">{report.iogp_rule}</span>
                <span className="text-hazard-cyan group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>INVESTIGATE</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
