import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Flame, 
  Zap, 
  Layers, 
  ArrowRight, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  MOCK_GLOBAL_KPIS, 
  MOCK_UNIT_RISK_SUMMARIES, 
  MOCK_IOGP_RULES 
} from '../../data/mockRefineryData';
import { SafetyReport, RefineryUnit, IOGPRule } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip 
} from 'recharts';

interface OverviewDashboardProps {
  reports: SafetyReport[];
  onSelectReport: (report: SafetyReport) => void;
  onNavigateToUnit: (unit: RefineryUnit) => void;
  onNavigateToRule: (rule: IOGPRule) => void;
  onNavigateToFeed: (filter?: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  reports,
  onSelectReport,
  onNavigateToUnit,
  onNavigateToRule,
  onNavigateToFeed
}) => {
  const [selectedRuleFilter, setSelectedRuleFilter] = useState<IOGPRule | null>(null);

  // Colors for IOGP Life-Saving Rules Donut
  const RULE_COLORS = [
    '#ef4444', // Energy Isolation (red)
    '#f97316', // Line of Fire (orange)
    '#f59e0b', // Confined Space (amber)
    '#eab308', // Hot Work (yellow-amber)
    '#06b6d4', // Working at Height (cyan)
    '#3b82f6', // Bypassing Controls (blue)
    '#8b5cf6', // Driving (purple)
    '#10b981', // Lifting Operations (green)
  ];

  const donutData = MOCK_IOGP_RULES.map((r, i) => ({
    name: r.rule,
    value: r.flagged_count,
    percentage: r.percentage,
    trend: r.trend,
    color: RULE_COLORS[i % RULE_COLORS.length]
  }));

  // Critical SIF observations for quick ticker
  const criticalReports = reports
    .filter(r => r.sif_potential || r.severity === 'CRITICAL')
    .slice(0, 5);

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* High-Priority Active Alert Strip */}
      <div className="p-3 bg-hazard-red-dark/30 border border-hazard-red flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-hazard-red">
        <div className="flex items-center gap-2.5">
          <span className="p-1 bg-hazard-red text-white animate-pulse">
            <AlertOctagon className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              CRITICAL CONTROL ADVISORY:
            </span>
            <span className="text-red-200 font-sans ml-2 text-xs">
              DHT Feed Pump P-204 line-breaking isolation failure. 11 barrier restorations currently pending refinery-wide.
            </span>
          </div>
        </div>
        <button
          onClick={() => onSelectReport(reports[0])}
          className="self-start md:self-auto px-2.5 py-1 bg-hazard-red hover:bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider transition border border-red-400 shrink-0"
        >
          INVESTIGATE ANCHOR SIF &rarr;
        </button>
      </div>

      {/* TOP 4 PRIMARY KPI CARDS (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Reports */}
        <div className="p-3.5 bg-industrial-900 border border-industrial-800 space-y-2">
          <div className="flex items-center justify-between text-industrial-400">
            <span className="tech-label">TOTAL REPORTS</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-industrial-800 border border-industrial-700 text-industrial-300">
              WINDOW: {MOCK_GLOBAL_KPIS.timeWindow}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white tracking-tight">
              {MOCK_GLOBAL_KPIS.totalReports}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% MoM</span>
            </div>
          </div>
          <div className="text-[11px] text-industrial-400 font-sans flex items-center justify-between pt-1 border-t border-industrial-800/80">
            <span>Verified safety inputs</span>
            <button 
              onClick={() => onNavigateToFeed()}
              className="text-hazard-cyan hover:underline text-[10px] font-mono"
            >
              VIEW ALL &rarr;
            </button>
          </div>
        </div>

        {/* SIF-Potential */}
        <div className="p-3.5 bg-industrial-900 border border-hazard-red-border/70 shadow-[inset_0_2px_0_0_#ef4444] space-y-2">
          <div className="flex items-center justify-between text-industrial-400">
            <span className="tech-label text-hazard-red">SIF-POTENTIAL</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-hazard-red-dark border border-hazard-red text-red-200 font-bold">
              {MOCK_GLOBAL_KPIS.sifPotentialPercent}% FLAGGED
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-hazard-red tracking-tight">
              {MOCK_GLOBAL_KPIS.sifPotentialCount}
            </div>
            <div className="text-[11px] text-red-300 font-mono">
              High fatal potential
            </div>
          </div>
          <div className="text-[11px] text-industrial-400 font-sans flex items-center justify-between pt-1 border-t border-industrial-800/80">
            <span>Unmitigated energy release</span>
            <button 
              onClick={() => onNavigateToFeed('SIF Potential')}
              className="text-hazard-red hover:underline text-[10px] font-mono font-bold"
            >
              FILTER SIF &rarr;
            </button>
          </div>
        </div>

        {/* Open Critical Control Failures */}
        <div className="p-3.5 bg-industrial-900 border border-hazard-amber-border/70 shadow-[inset_0_2px_0_0_#f59e0b] space-y-2">
          <div className="flex items-center justify-between text-industrial-400">
            <span className="tech-label text-hazard-amber">OPEN CRITICAL CONTROL FAILURES</span>
            <span className="w-2 h-2 rounded-full bg-hazard-amber animate-ping" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-hazard-amber tracking-tight">
              {MOCK_GLOBAL_KPIS.openCriticalControlFailures}
            </div>
            <div className="text-[10px] text-amber-300 font-mono">
              Awaiting restoration
            </div>
          </div>
          <div className="text-[11px] text-industrial-400 font-sans flex items-center justify-between pt-1 border-t border-industrial-800/80">
            <span>Barriers non-functional</span>
            <span className="text-hazard-amber text-[10px] font-mono font-bold">
              ESCALATED
            </span>
          </div>
        </div>

        {/* Top At-Risk Unit */}
        <div className="p-3.5 bg-industrial-900 border border-industrial-800 space-y-2">
          <div className="flex items-center justify-between text-industrial-400">
            <span className="tech-label">TOP AT-RISK UNIT</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-industrial-800 border border-industrial-700 text-hazard-cyan font-bold">
              CONCENTRATION
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white tracking-tight">
              {MOCK_GLOBAL_KPIS.topAtRiskUnit}
            </div>
            <div className="text-[11px] text-hazard-red font-mono font-bold">
              {MOCK_GLOBAL_KPIS.topAtRiskPrecursors} SIF precursors
            </div>
          </div>
          <div className="text-[11px] text-industrial-400 font-sans flex items-center justify-between pt-1 border-t border-industrial-800/80">
            <span>Diesel Hydrotreater</span>
            <button 
              onClick={() => onNavigateToUnit('DHT')}
              className="text-hazard-cyan hover:underline text-[10px] font-mono"
            >
              UNIT MATRIX &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* SECONDARY 8 KPI METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { label: 'HIGH-RISK OBS', val: MOCK_GLOBAL_KPIS.highRiskObservations, color: 'text-hazard-red' },
          { label: 'BARRIER FAILURES', val: MOCK_GLOBAL_KPIS.criticalBarrierFailures, color: 'text-hazard-red' },
          { label: 'NEAR MISSES', val: MOCK_GLOBAL_KPIS.nearMisses, color: 'text-amber-400' },
          { label: 'ACTIONS OVERDUE', val: MOCK_GLOBAL_KPIS.correctiveActionsOverdue, color: 'text-hazard-red' },
          { label: 'ISOLATION FAILS', val: MOCK_GLOBAL_KPIS.energyIsolationFailures, color: 'text-hazard-amber' },
          { label: 'CONFINED SPACE', val: MOCK_GLOBAL_KPIS.confinedSpacePrecursors, color: 'text-hazard-amber' },
          { label: 'HOT WORK PRECURS', val: MOCK_GLOBAL_KPIS.hotWorkPrecursors, color: 'text-amber-300' },
          { label: 'LINE BREAKING', val: MOCK_GLOBAL_KPIS.lineBreakingObservations, color: 'text-hazard-red' },
        ].map((item) => (
          <div key={item.label} className="p-2.5 bg-industrial-900/90 border border-industrial-800">
            <div className="text-[9px] text-industrial-400 font-mono truncate uppercase tracking-wider">
              {item.label}
            </div>
            <div className={`text-lg font-black font-mono mt-0.5 ${item.color}`}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* CORE ANALYTICAL ROW: SIF Precursor Density By Unit (Section 4) & IOGP Distribution Donut (Section 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SIF PRECURSOR DENSITY BY REFINERY UNIT (Section 4 - 7 cols) */}
        <div className="lg:col-span-7 p-4 bg-industrial-900 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-hazard-red" />
              <h3 className="tech-label text-white">
                SIF PRECURSOR DENSITY BY REFINERY UNIT
              </h3>
            </div>
            <span className="text-[10px] text-industrial-400">
              SIF COUNT / TOTAL OBSERVATIONS
            </span>
          </div>

          {/* Horizontal Bar Visualizer */}
          <div className="space-y-2.5 pt-1">
            {MOCK_UNIT_RISK_SUMMARIES.map((unitData) => {
              const sifCount = unitData.sif_precursors;
              const totalObs = unitData.observations;
              const percent = Math.round((sifCount / totalObs) * 100);

              // Severity bar color
              let barColor = 'bg-hazard-cyan';
              if (percent >= 45 || sifCount >= 40) barColor = 'bg-hazard-red';
              else if (percent >= 35 || sifCount >= 25) barColor = 'bg-hazard-amber';

              return (
                <div
                  key={unitData.unit}
                  onClick={() => onNavigateToUnit(unitData.unit)}
                  className="group cursor-pointer p-2 hover:bg-industrial-850 border border-transparent hover:border-industrial-700 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white w-24 group-hover:text-hazard-cyan transition">
                        {unitData.unit}
                      </span>
                      <span className="text-[10px] text-industrial-400 font-sans hidden sm:inline">
                        {unitData.dominant_hazard}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-industrial-300">
                        <strong className="text-hazard-red">{sifCount}</strong> / {totalObs} obs
                      </span>
                      <span className="w-12 text-right font-bold text-white text-[11px]">
                        {percent}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2.5 bg-industrial-950 border border-industrial-800 overflow-hidden flex">
                    <div
                      className={`h-full ${barColor} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-industrial-800 flex items-center justify-between text-[10px] text-industrial-500">
            <span>CLICK ANY UNIT ROW TO DRILL DOWN INTO UNIT RISK MATRIX</span>
            <span className="text-hazard-cyan">NORMALIZED SEVERITY INDEX</span>
          </div>
        </div>

        {/* IOGP LIFE-SAVING RULES DISTRIBUTION (Section 5 - 5 cols) */}
        <div className="lg:col-span-5 p-4 bg-industrial-900 border border-industrial-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-hazard-amber" />
                <h3 className="tech-label text-white">
                  IOGP LIFE-SAVING RULES DISTRIBUTION
                </h3>
              </div>
              <span className="text-[10px] text-industrial-400">
                FLAGGED PRECURSORS
              </span>
            </div>

            {/* Donut Chart & Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
              <div className="sm:col-span-5 h-44 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={2}
                      stroke="#0a0d14"
                      strokeWidth={2}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-industrial-950 border border-industrial-700 p-2 text-xs font-mono shadow-xl">
                              <div className="text-white font-bold">{data.name}</div>
                              <div className="text-hazard-red">{data.value} observations ({data.percentage}%)</div>
                              <div className="text-[10px] text-industrial-400">{data.trend}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-white">262</span>
                  <span className="text-[9px] text-industrial-400 uppercase">SIF OBS</span>
                </div>
              </div>

              {/* Interactive Legend / List */}
              <div className="sm:col-span-7 space-y-1.5 text-xs">
                {MOCK_IOGP_RULES.slice(0, 6).map((rule, idx) => (
                  <button
                    key={rule.rule}
                    onClick={() => {
                      setSelectedRuleFilter(rule.rule);
                      onNavigateToRule(rule.rule);
                    }}
                    className="w-full flex items-center justify-between p-1.5 bg-industrial-950/80 hover:bg-industrial-800 border border-industrial-850 hover:border-industrial-700 transition text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 shrink-0"
                        style={{ backgroundColor: RULE_COLORS[idx % RULE_COLORS.length] }}
                      />
                      <span className="font-medium text-industrial-200 truncate text-[11px]">
                        {rule.rule}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                      <span className="font-bold text-white">{rule.flagged_count}</span>
                      <span className="text-industrial-500 text-[10px]">({rule.percentage}%)</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-industrial-800 flex items-center justify-between text-[10px] text-industrial-500">
            <span>CLICK RULE TO FILTER OBSERVATIONS</span>
            <button 
              onClick={() => onNavigateToRule('Energy Isolation')}
              className="text-hazard-cyan hover:underline"
            >
              VIEW ALL RULES &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* RECENT CRITICAL SIF OBSERVATION FEED (Section 6 preview) */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-hazard-red" />
            <h3 className="tech-label text-white">
              LATEST CRITICAL SIF PRECURSORS (REAL-TIME FEED)
            </h3>
          </div>
          <button
            onClick={() => onNavigateToFeed()}
            className="text-hazard-cyan hover:underline text-xs flex items-center gap-1 font-mono"
          >
            <span>EXPAND FULL LIVE STREAM</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {criticalReports.map((report) => (
            <div
              key={report.report_id}
              onClick={() => onSelectReport(report)}
              className="p-3.5 bg-industrial-950 border border-hazard-red-border/60 hover:border-hazard-red hover:shadow-hazard-red transition cursor-pointer space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs group-hover:text-hazard-cyan transition">
                    {report.report_id}
                  </span>
                  <span className="px-1.5 py-0.2 bg-industrial-800 text-hazard-cyan font-bold text-[10px]">
                    {report.unit}
                  </span>
                </div>
                <IndustrialBadge variant="critical" size="xs">
                  SCORE {report.sif_score}/5
                </IndustrialBadge>
              </div>

              <div className="text-[11px] text-industrial-300 font-mono">
                {report.equipment_full || report.equipment}
              </div>

              <div className="flex flex-wrap gap-1">
                <IndustrialBadge variant="outline-red" size="xs">
                  {report.iogp_rule}
                </IndustrialBadge>
                {report.p2h_rating && (
                  <span className="px-1.5 py-0.2 bg-hazard-red-dark text-red-200 text-[10px] font-bold border border-hazard-red">
                    {report.p2h_rating}
                  </span>
                )}
              </div>

              <p className="text-xs text-industrial-200 font-sans line-clamp-2 leading-relaxed">
                {report.ai_summary}
              </p>

              <div className="pt-2 border-t border-industrial-850 flex items-center justify-between text-[10px] text-industrial-500">
                <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
                <span className="text-hazard-cyan flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-bold">
                  <span>INSPECT SIF</span>
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
