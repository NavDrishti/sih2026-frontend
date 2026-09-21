import React from 'react';
import {
  FileText,
  ShieldAlert,
  CheckCircle,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { MONTHLY_SAFETY_PERFORMANCE } from '../../data/sentinelData';

export const TrendsPageView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 4 Metric Cards Grid matching Screenshot 280 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Report Volume Trend */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white mb-3">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
            <span>-29%</span>
            <ArrowDownRight className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Report Volume Trend
          </div>
        </div>

        {/* SIF Trend */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center text-red-500 mb-3">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight flex items-center gap-1">
            <span>160%</span>
            <ArrowUpRight className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            SIF Trend (8 weeks)
          </div>
        </div>

        {/* Action Closure Rate */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            68%
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Action Closure Rate
          </div>
        </div>

        {/* Active Precursors */}
        <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            7
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Active Precursors
          </div>
        </div>
      </div>

      {/* Monthly Safety Performance Area Chart */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Monthly Safety Performance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reports, SIF potential, and safety actions (7 months)
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_SAFETY_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#334155" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#334155" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSifMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                dataKey="totalReports"
                name="Total Reports"
                stroke="#334155"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="safetyActions"
                name="Safety Actions"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAction)"
              />
              <Area
                type="monotone"
                dataKey="sif"
                name="SIF Potential"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSifMonth)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">SIF Potential</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Safety Actions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Total Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
};
