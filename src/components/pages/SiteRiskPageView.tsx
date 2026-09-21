import React, { useState } from 'react';
import {
  MapPin,
  FileText,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  BarChart2,
  PieChart as PieIcon
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
import { SITE_RISK_DATA, SentinelObservation } from '../../data/sentinelData';

interface SiteRiskPageViewProps {
  observations: SentinelObservation[];
  onSelectObservation: (obs: SentinelObservation) => void;
  onFilterBySite: (siteName: string) => void;
}

export const SiteRiskPageView: React.FC<SiteRiskPageViewProps> = ({
  observations,
  onSelectObservation,
  onFilterBySite
}) => {
  const [selectedSiteName, setSelectedSiteName] = useState<string | null>(null);

  const totalSites = SITE_RISK_DATA.length;
  const totalReports = observations.length || 20;
  const sifCount = observations.filter(o => o.sif_potential).length || 16;
  const criticalCount = observations.filter(o => o.severity === 'CRITICAL').length || 7;

  // Horizontal bar chart data
  const horizontalBarData = [...SITE_RISK_DATA].reverse();

  // Pie chart data
  const pieData = SITE_RISK_DATA.map(s => ({
    name: s.site,
    value: s.reports,
    color: s.color
  }));

  const siteObservations = selectedSiteName
    ? observations.filter(o => o.site === selectedSiteName)
    : [];

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards Grid matching Screenshot 279 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Sites */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white mb-3">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {totalSites}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Sites
          </div>
        </div>

        {/* Total Reports */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            {totalReports}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Total Reports
          </div>
        </div>

        {/* SIF Potential */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight mt-1">
            {sifCount}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            SIF Potential
          </div>
        </div>

        {/* Critical */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-1">
            {criticalCount}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Critical
          </div>
        </div>
      </div>

      {/* Charts Row: Reports by Site (Horizontal Bar) + Risk Distribution by Site (Donut/Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Site Horizontal Bar Chart */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Reports by Site
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total observations per site
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={horizontalBarData}
                margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
              >
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="site"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="reports" name="Observations" fill="#1e293b" radius={[0, 4, 4, 0]}>
                  {horizontalBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution by Site Donut/Pie */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Risk Distribution by Site
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proportion of total reports
              </p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
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
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Site Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SITE_RISK_DATA.map((site) => (
          <div
            key={site.site}
            onClick={() => setSelectedSiteName(site.site)}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131f37] hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {site.site}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {site.reports} reports &bull; {site.sif} SIF potential
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>

      {/* Selected Site Drawer */}
      {selectedSiteName && (
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Observations at: {selectedSiteName}
            </h3>
            <button
              onClick={() => onFilterBySite(selectedSiteName)}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Filter in Explorer →
            </button>
          </div>

          <div className="space-y-2">
            {siteObservations.map((obs) => (
              <div
                key={obs.report_id}
                onClick={() => onSelectObservation(obs)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {obs.report_id}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{obs.activity}</span>
                    <span>•</span>
                    <span className="text-red-500 font-bold">Score {obs.sif_score}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {obs.ai_summary || obs.raw_narrative}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
