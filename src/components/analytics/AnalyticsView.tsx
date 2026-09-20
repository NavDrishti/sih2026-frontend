import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Sliders, 
  ShieldAlert, 
  Layers, 
  Activity, 
  BarChart2, 
  Flame 
} from 'lucide-react';
import { MOCK_ANALYTICS_DATA, MOCK_UNIT_RISK_SUMMARIES } from '../../data/mockRefineryData';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '6M' | '1Y'>('30D');
  const [metricMode, setMetricMode] = useState<'Count' | 'Percentage' | 'Density'>('Count');

  const timeRanges = ['7D', '30D', '90D', '6M', '1Y'] as const;
  const metricModes = ['Count', 'Percentage', 'Density'] as const;

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-industrial-950 border border-industrial-700 p-2.5 text-xs font-mono shadow-2xl space-y-1">
          <div className="text-white font-bold border-b border-industrial-800 pb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* Analytics Controls Header */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-hazard-cyan" />
            <h2 className="text-base font-bold text-white tracking-widest uppercase">
              REFINERY SIF PRECURSOR ANALYTICS & HISTORICAL TRENDS
            </h2>
          </div>
          <p className="text-xs text-industrial-400 font-sans mt-0.5">
            Temporal telemetry, barrier degradation velocities, and operational risk metrics
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filters */}
          <div className="flex items-center bg-industrial-950 p-1 border border-industrial-800">
            <span className="text-[10px] text-industrial-500 uppercase px-2">TIME:</span>
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-[11px] font-mono transition ${
                  timeRange === range
                    ? 'bg-hazard-red text-white font-bold'
                    : 'text-industrial-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Metric Mode Toggle */}
          <div className="flex items-center bg-industrial-950 p-1 border border-industrial-800">
            <span className="text-[10px] text-industrial-500 uppercase px-2">VIEW:</span>
            {metricModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setMetricMode(mode)}
                className={`px-2.5 py-1 text-[11px] font-mono transition ${
                  metricMode === mode
                    ? 'bg-industrial-800 text-hazard-cyan font-bold border border-industrial-700'
                    : 'text-industrial-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. SIF Precursor Trend vs Total Observations */}
        <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-hazard-red" />
              <h3 className="tech-label text-white">
                SIF PRECURSOR TREND VS TOTAL OBSERVATIONS OVER TIME
              </h3>
            </div>
            <span className="text-[10px] text-industrial-400">30-DAY TEMPORAL</span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS_DATA.trends30d}>
                <defs>
                  <linearGradient id="colorSif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="date" stroke="#647b9f" fontSize={10} />
                <YAxis stroke="#647b9f" fontSize={10} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="total_obs" name="Total Observations" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="sif_precursors" name="SIF Precursors" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSif)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Critical Barrier Failures & Control Failures Over Time */}
        <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-hazard-amber" />
              <h3 className="tech-label text-white">
                BARRIER FAILURES & CRITICAL CONTROL BREACHES
              </h3>
            </div>
            <span className="text-[10px] text-industrial-400">DEFENSE DEFECTS</span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ANALYTICS_DATA.trends30d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="date" stroke="#647b9f" fontSize={10} />
                <YAxis stroke="#647b9f" fontSize={10} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="barrier_failures" name="Barrier Failures" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="critical_failures" name="Critical Control Fails" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. SIF Precursors by Operational Activity */}
        <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-hazard-red" />
              <h3 className="tech-label text-white">
                SIF POTENTIAL BY REFINERY ACTIVITY
              </h3>
            </div>
            <span className="text-[10px] text-industrial-400">HIGH-CONSEQUENCE TASKS</span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS_DATA.activityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis type="number" stroke="#647b9f" fontSize={10} />
                <YAxis type="category" dataKey="activity" stroke="#647b9f" fontSize={10} width={90} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total_obs" name="Total Activity Obs" fill="#212c40" />
                <Bar dataKey="sif_count" name="SIF Precursors" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Corrective Action Closure & Verification Trend */}
        <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <h3 className="tech-label text-white">
                CORRECTIVE ACTION CLOSURE VELOCITY
              </h3>
            </div>
            <span className="text-[10px] text-industrial-400">MONTHLY RESOLUTION</span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS_DATA.closureTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="month" stroke="#647b9f" fontSize={10} />
                <YAxis stroke="#647b9f" fontSize={10} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="created" name="Actions Created" fill="#ef4444" />
                <Bar dataKey="closed" name="Actions Closed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
