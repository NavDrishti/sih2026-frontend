import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Flame,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SentinelObservation, SIF_TREND_DATA_8_WEEKS } from '../../data/sentinelData';

interface SifIntelligenceViewProps {
  observations: SentinelObservation[];
  onSelectObservation: (obs: SentinelObservation) => void;
}

export const SifIntelligenceView: React.FC<SifIntelligenceViewProps> = ({
  observations,
  onSelectObservation
}) => {
  const sifObservations = [...observations]
    .filter(o => o.sif_potential)
    .sort((a, b) => b.sif_score - a.sif_score);

  const totalSif = sifObservations.length || 16;
  const criticalCount = sifObservations.filter(o => o.severity === 'CRITICAL').length || 7;
  const avgScore = Math.round(
    sifObservations.reduce((acc, curr) => acc + curr.sif_score, 0) / (sifObservations.length || 1)
  ) || 83;
  const sifRate = Math.round((totalSif / (observations.length || 20)) * 100) || 80;

  // SIF Rate gauge data
  const gaugeData = [
    { name: 'SIF Potential', value: sifRate, color: '#ef4444' },
    { name: 'Controlled', value: 100 - sifRate, color: '#e2e8f0' }
  ];

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards Grid matching Screenshot 275 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* SIF Potential */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center text-red-500 mb-3">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {totalSif}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            SIF Potential
          </div>
        </div>

        {/* Critical Risk */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {criticalCount}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Critical Risk
          </div>
        </div>

        {/* Avg SIF Score */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {avgScore}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Avg SIF Score
          </div>
        </div>

        {/* SIF Rate */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {sifRate}%
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            SIF Rate
          </div>
        </div>
      </div>

      {/* Charts Row: SIF Trend (Bars) + SIF Rate Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SIF Trend Bar Chart */}
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
                SIF-potential reports over 8 weeks
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SIF_TREND_DATA_8_WEEKS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="sif" name="SIF Reports" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonSif" name="Non-SIF Reports" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIF Rate Gauge Donut */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SIF Rate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                % of reports with SIF potential
              </p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {sifRate}%
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            High precursor concentration indicates need for proactive barrier defense.
          </p>
        </div>
      </div>

      {/* SIF Potential Observations Table matching Screenshot 284 */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SIF-Potential Observations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sorted by SIF score (highest first)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">SITE</th>
                <th className="py-3 px-4">ACTIVITY</th>
                <th className="py-3 px-4">ACTUAL</th>
                <th className="py-3 px-4">POTENTIAL</th>
                <th className="py-3 px-4">SCORE</th>
                <th className="py-3 px-4">RISK</th>
                <th className="py-3 px-4">LSR</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sifObservations.map((obs) => {
                const isCritical = obs.severity === 'CRITICAL';
                return (
                  <tr
                    key={obs.report_id}
                    onClick={() => onSelectObservation(obs)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {obs.report_id}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {obs.site}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {obs.activity}
                    </td>

                    {/* Actual Outcome */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {obs.actual_outcome?.split('(')[0] || 'Near Miss'}
                    </td>

                    {/* Potential Outcome in Red */}
                    <td className="py-3.5 px-4 font-bold text-red-600 dark:text-red-400">
                      {obs.potential_outcome}
                    </td>

                    {/* Score with flame icon */}
                    <td className="py-3.5 px-4 font-bold font-mono text-red-600 dark:text-red-400 flex items-center gap-1">
                      {obs.sif_score}
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {isCritical ? 'Critical' : 'High'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {obs.iogp_rule}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        obs.review_status === 'Needs Investigation' || obs.status === 'Needs Investigation'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : obs.review_status === 'Escalated' || obs.status === 'Escalated'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {obs.review_status || obs.status || 'Under Review'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
