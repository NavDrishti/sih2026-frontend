import React from 'react';
import {
  FileText,
  ShieldAlert,
  AlertTriangle,
  Search,
  ShieldCheck,
  Bot,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  AlertOctagon,
  Flame,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SentinelObservation, SIF_TREND_DATA_8_WEEKS, RISK_DISTRIBUTION_DONUT, PRECURSOR_PATTERNS } from '../../data/sentinelData';

interface CommandCenterViewProps {
  observations: SentinelObservation[];
  onSelectObservation: (obs: SentinelObservation) => void;
  onNavigateToTab: (tab: any) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  observations,
  onSelectObservation,
  onNavigateToTab
}) => {
  const totalReports = observations.length || 20;
  const sifCount = observations.filter(o => o.sif_potential).length || 16;
  const highRiskCount = observations.filter(o => o.severity === 'CRITICAL' || o.severity === 'HIGH').length || 15;
  const openInvestigations = observations.filter(o => o.review_status === 'Needs Investigation' || o.status === 'Needs Investigation' || o.review_status === 'Escalated').length || 13;
  const lsrExposures = observations.filter(o => o.iogp_rule).length || 16;

  // Priority AI alerts (top 3 critical SIF potential observations)
  const priorityAlerts = observations
    .filter(o => o.sif_potential && o.severity === 'CRITICAL')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 6 Top Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Reports */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white mb-3">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {totalReports}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Total Reports
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Last 8 weeks
          </div>
        </div>

        {/* SIF Potential */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded-full">
              ↑ 160%
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {sifCount}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            SIF Potential
          </div>
          <div className="text-[11px] text-red-500/80 mt-0.5 font-medium">
            High Severity Risk
          </div>
        </div>

        {/* High Risk */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {highRiskCount}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            High Risk
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Prioritized cases
          </div>
        </div>

        {/* Open Investigations */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 dark:bg-orange-500/20 flex items-center justify-center text-orange-500 mb-3">
            <Search className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {openInvestigations}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Open Investigations
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Pending review
          </div>
        </div>

        {/* LSR Exposures */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {lsrExposures}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            LSR Exposures
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            IOGP Rules mapped
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-3">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            87%
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            AI Confidence
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Avg across reports
          </div>
        </div>
      </div>

      {/* Main Charts Row: SIF Trend + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SIF Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SIF Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SIF vs Non-SIF reports over 8 weeks
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SIF_TREND_DATA_8_WEEKS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNonSif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sif"
                  name="SIF Potential"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSif)"
                />
                <Area
                  type="monotone"
                  dataKey="nonSif"
                  name="Non-SIF"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorNonSif)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">SIF Potential</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Non-SIF Reports</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution Donut (1 Col) */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Risk Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                By risk level
              </p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION_DONUT}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {RISK_DISTRIBUTION_DONUT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalReports}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Total
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {RISK_DISTRIBUTION_DONUT.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority AI Alerts & Emerging Precursor Patterns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority AI Alerts */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Priority AI Alerts
              </h3>
            </div>
            <span className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
              Critical Actions Required
            </span>
          </div>

          <div className="space-y-3">
            {priorityAlerts.map((obs) => (
              <div
                key={obs.report_id}
                onClick={() => onSelectObservation(obs)}
                className="p-3.5 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400">
                      {obs.report_id}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {obs.site}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {obs.activity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {obs.ai_summary || obs.raw_narrative}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
                      Score {obs.sif_score}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      LSR: {obs.iogp_rule}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 shrink-0 transition-colors mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Precursor Patterns */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Emerging Precursor Patterns
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('PRECURSORS')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {PRECURSOR_PATTERNS.slice(0, 3).map((pattern) => (
              <div
                key={pattern.id}
                onClick={() => onNavigateToTab('PRECURSORS')}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-900/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {pattern.title}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        pattern.severity === 'Critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}>
                        {pattern.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {pattern.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {pattern.occurrences} events
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span>Sites: {pattern.sitesCount}</span>
                  <span>•</span>
                  <span>Related: {pattern.relatedRule}</span>
                  <span>•</span>
                  <span className={pattern.trend === 'Rising' ? 'text-red-500 font-medium' : 'text-slate-400'}>
                    Trend: {pattern.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
