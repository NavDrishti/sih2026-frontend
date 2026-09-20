import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Lock, 
  Eye, 
  ArrowUpRight, 
  AlertTriangle, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  Car, 
  Building, 
  Wrench, 
  Compass, 
  Crosshair,
  Radio
} from 'lucide-react';
import { IOGPRule, SafetyReport, RefineryUnit } from '../../types/safety';
import { MOCK_IOGP_RULES } from '../../data/mockRefineryData';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface LifeSavingRulesViewProps {
  onSelectReport: (report: SafetyReport) => void;
  reports: SafetyReport[];
  initialRule?: IOGPRule;
}

export const LifeSavingRulesView: React.FC<LifeSavingRulesViewProps> = ({
  onSelectReport,
  reports,
  initialRule
}) => {
  const [selectedRule, setSelectedRule] = useState<IOGPRule | 'ALL'>(initialRule || 'ALL');

  // Helper icons per IOGP rule
  const getRuleIcon = (rule: IOGPRule) => {
    switch (rule) {
      case 'Energy Isolation':
        return <Lock className="w-5 h-5 text-hazard-red" />;
      case 'Line of Fire':
        return <Crosshair className="w-5 h-5 text-amber-500" />;
      case 'Confined Space':
        return <Layers className="w-5 h-5 text-hazard-amber" />;
      case 'Hot Work':
        return <Flame className="w-5 h-5 text-hazard-red" />;
      case 'Working at Height':
        return <Building className="w-5 h-5 text-hazard-cyan" />;
      case 'Bypassing Safety Controls':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Driving':
        return <Car className="w-5 h-5 text-industrial-400" />;
      case 'Lifting Operations':
      case 'Safe Mechanical Lifting / Suspended Loads':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-hazard-cyan" />;
    }
  };

  const filteredReports = reports.filter((r) => {
    if (selectedRule === 'ALL') return true;
    return r.iogp_rule === selectedRule;
  });

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* Header */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-hazard-cyan" />
            <h2 className="text-base font-bold text-white tracking-widest uppercase">
              IOGP LIFE-SAVING RULES COMPLIANCE & SIF MAPPING
            </h2>
          </div>
          <p className="text-xs text-industrial-400 font-sans mt-0.5">
            Refinery operations mapped against the 10 International Oil & Gas Producers (IOGP) Life-Saving Rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedRule !== 'ALL' && (
            <button
              onClick={() => setSelectedRule('ALL')}
              className="px-2.5 py-1 bg-industrial-800 hover:bg-industrial-750 text-hazard-cyan border border-industrial-700 text-xs font-mono"
            >
              SHOW ALL RULES (RESET)
            </button>
          )}
        </div>
      </div>

      {/* Rules Grid (Section 16) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_IOGP_RULES.map((ruleItem) => {
          const isSelected = selectedRule === ruleItem.rule;
          return (
            <div
              key={ruleItem.rule}
              onClick={() => setSelectedRule(ruleItem.rule)}
              className={`p-4 border transition cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? 'bg-industrial-850 border-hazard-red shadow-hazard-red ring-1 ring-hazard-red'
                  : 'bg-industrial-900 border-industrial-800 hover:border-industrial-700 hover:bg-industrial-850/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 bg-industrial-950 border border-industrial-800">
                    {getRuleIcon(ruleItem.rule)}
                  </div>
                  <span className="text-[10px] text-industrial-400 font-mono">
                    {ruleItem.trend}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-hazard-cyan transition">
                    {ruleItem.rule.toUpperCase()}
                  </h3>
                  <div className="text-xs font-mono text-hazard-red font-bold mt-0.5">
                    {ruleItem.flagged_count} flagged observations ({ruleItem.percentage}%)
                  </div>
                </div>

                <div className="p-2 bg-industrial-950/80 border border-industrial-850 space-y-1 text-[11px]">
                  <div className="text-industrial-400 text-[10px] uppercase">
                    PRIMARY BARRIER FAILURE:
                  </div>
                  <div className="text-industrial-200 font-sans text-xs line-clamp-2">
                    {ruleItem.primary_failure}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-industrial-800 flex items-center justify-between text-[10px]">
                <span className="text-industrial-400">
                  TOP UNIT: <strong className="text-hazard-cyan">{ruleItem.top_unit}</strong>
                </span>
                <span className="text-hazard-cyan flex items-center gap-0.5 font-bold">
                  <span>FILTER</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtered Reports for Active Rule */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-hazard-amber" />
            <h3 className="tech-label text-white">
              OBSERVATIONS MAPPED TO {selectedRule === 'ALL' ? 'ALL RULES' : selectedRule.toUpperCase()} ({filteredReports.length})
            </h3>
          </div>
          <span className="text-[10px] text-industrial-400">
            CLICK ANY OBSERVATION TO VIEW INVESTIGATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredReports.map((report) => (
            <div
              key={report.report_id}
              onClick={() => onSelectReport(report)}
              className="p-3.5 bg-industrial-950 border border-industrial-800 hover:border-hazard-red transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs group-hover:text-hazard-cyan transition">
                  {report.report_id}
                </span>
                <span className="px-1.5 py-0.2 bg-industrial-800 text-hazard-cyan font-bold text-[10px]">
                  {report.unit}
                </span>
              </div>

              <div className="text-[11px] text-industrial-300 font-mono">
                {report.equipment} • {report.activity}
              </div>

              <p className="text-xs text-industrial-200 font-sans line-clamp-2 leading-relaxed">
                {report.ai_summary}
              </p>

              <div className="pt-2 border-t border-industrial-850 flex items-center justify-between text-[10px] text-industrial-400">
                <span className="text-hazard-red font-bold">SIF SCORE: {report.sif_score}/5</span>
                <span className="text-hazard-cyan flex items-center gap-0.5">
                  <span>INSPECT</span>
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
